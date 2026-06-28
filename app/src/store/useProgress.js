import { useState, useEffect, useCallback } from 'react'

const KEY = 'excel-dojo-progress-v1'

const DEFAUT = {
  xp: 0,
  ceintures: [], // ex: ['blanche']
  ecransValides: {}, // ex: { 'ch1-lex-01': true }
  chapitresTermines: [], // ex: [1]
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

  const reinitialiser = useCallback(() => setEtat({ ...DEFAUT }), [])

  return { etat, validerEcran, estValide, debloquerCeinture, reinitialiser }
}
