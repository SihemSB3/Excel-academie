import { useState, useEffect, useCallback } from 'react'
import { calcNiveau, ajouterJours, INTERVALLES } from '../lib/revisions'

const KEY = 'excel-dojo-progress-v1'

const DEFAUT = {
  xp: 0,
  ceintures: [], // ex: ['blanche']
  ecransValides: {}, // ex: { 'ch1-lex-01': true }
  chapitresTermines: [], // ex: [1]
  // Journal d'apprentissage : la mémoire du Shifu. Par kata : nombre de passages,
  // erreurs cumulées et du dernier passage, temps passé (secondes), date du dernier passage.
  journal: {}, // ex: { 'ch7-m2': { fois: 2, erreursTotal: 3, dernierErreurs: 0, dureeTotale: 240, dernierLe: '2026-07-02' } }
  streak: { jour: null, serie: 0 }, // série de jours consécutifs avec au moins un kata terminé
}

// 'AAAA-MM-JJ' en heure locale (toISOString basculerait de jour selon le fuseau)
function jourLocal(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function estVeille(jour, aujourdhui) {
  const d = new Date(`${aujourdhui}T12:00:00`)
  d.setDate(d.getDate() - 1)
  return jour === jourLocal(d)
}

function charger() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAUT, ...JSON.parse(raw) }
  } catch (e) {
    // localStorage indisponible ou corrompu : on repart propre
  }
  return { ...DEFAUT }
}

// Hook de progression : tout est persisté dans le navigateur (zéro backend).
export function useProgress() {
  const [etat, setEtat] = useState(charger)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(etat))
    } catch (e) {
      /* quota plein ou navigation privée : on ignore */
    }
  }, [etat])

  const validerEcran = useCallback((id, xp = 0) => {
    setEtat((s) => {
      if (s.ecransValides[id]) return s // déjà validé : pas de double XP
      return { ...s, ecransValides: { ...s.ecransValides, [id]: true }, xp: s.xp + xp }
    })
  }, [])

  const estValide = useCallback((id) => Boolean(etat.ecransValides[id]), [etat.ecransValides])

  const debloquerCeinture = useCallback((id, xpBonus = 0, chapitre = null) => {
    setEtat((s) => {
      const dejaObtenue = s.ceintures.includes(id)
      return {
        ...s,
        ceintures: dejaObtenue ? s.ceintures : [...s.ceintures, id],
        chapitresTermines:
          chapitre && !s.chapitresTermines.includes(chapitre)
            ? [...s.chapitresTermines, chapitre]
            : s.chapitresTermines,
        xp: dejaObtenue ? s.xp : s.xp + xpBonus,
      }
    })
  }, [])

  // Consigne un passage de kata dans le journal + met à jour la série de jours.
  // stats = { erreurs, duree } (duree en secondes), fournies par LeconNarree.
  const enregistrerKata = useCallback((id, stats = {}) => {
    const erreurs = Math.max(0, stats.erreurs || 0)
    const duree = Math.max(0, stats.duree || 0)
    setEtat((s) => {
      const avant = s.journal[id] || { fois: 0, erreursTotal: 0, dernierErreurs: 0, dureeTotale: 0, dernierLe: null, niveau: 0 }
      const auj = jourLocal()
      let streak = s.streak
      if (streak.jour !== auj) {
        streak = { jour: auj, serie: estVeille(streak.jour, auj) ? streak.serie + 1 : 1 }
      }
      // Répétition espacée : le niveau monte sans faute, redescend avec des erreurs, et
      // fixe la date de la prochaine révision (intervalle de plus en plus long).
      const niveau = calcNiveau(avant.niveau || 0, erreurs)
      const prochaineLe = ajouterJours(auj, INTERVALLES[niveau])
      return {
        ...s,
        journal: {
          ...s.journal,
          [id]: {
            fois: avant.fois + 1,
            erreursTotal: avant.erreursTotal + erreurs,
            dernierErreurs: erreurs,
            dureeTotale: avant.dureeTotale + duree,
            dernierLe: auj,
            niveau,
            prochaineLe,
          },
        },
        streak,
      }
    })
  }, [])

  const reinitialiser = useCallback(() => setEtat({ ...DEFAUT }), [])

  return { etat, validerEcran, estValide, debloquerCeinture, enregistrerKata, reinitialiser }
}
