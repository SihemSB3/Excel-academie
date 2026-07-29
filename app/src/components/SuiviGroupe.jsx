import { useEffect, useMemo, useState } from 'react'
import EspaceFormateur from './EspaceFormateur'
import {
  chargerSuiviGroupe,
  chargerJalons,
  ajouterJalon as ajouterJalonBase,
  majJalon,
  supprimerJalon as supprimerJalonBase,
  lienInvitation,
} from '../lib/groupes'

// 'AAAA-MM-JJ' du jour, en heure locale.
const aujourdhui = () => {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

// Enveloppe réelle de l'espace formateur : va chercher les vraies données du
// groupe et les passe à l'écran de suivi, qui est le même qu'en démonstration.
export default function SuiviGroupe({ groupe, onQuitter }) {
  const [apprenants, setApprenants] = useState(null)
  const [jalons, setJalons] = useState(null)

  useEffect(() => {
    let annule = false
    Promise.all([chargerSuiviGroupe(groupe.id), chargerJalons(groupe.id)]).then(([a, j]) => {
      if (annule) return
      setApprenants(a)
      setJalons(j)
    })
    return () => {
      annule = true
    }
  }, [groupe.id])

  const organisation = useMemo(
    () => ({
      nom: groupe.organisation?.nom || groupe.nom,
      groupe: groupe.organisation?.nom ? groupe.nom : '',
      periode: '',
      licences: groupe.licences,
    }),
    [groupe],
  )

  // Les échéances sont modifiées dans l'écran ; ici on répercute en base la
  // seule différence entre l'ancienne et la nouvelle liste.
  const enregistrerJalons = async (suivante, precedente) => {
    const avant = Object.fromEntries(precedente.map((j) => [j.id, j]))
    const apres = Object.fromEntries(suivante.map((j) => [j.id, j]))

    for (const j of precedente) {
      if (!apres[j.id]) await supprimerJalonBase(j.id)
    }
    for (const j of suivante) {
      const ancien = avant[j.id]
      if (!ancien) {
        const cree = await ajouterJalonBase(groupe.id, j.date, j.chapitres)
        // On remplace l'identifiant provisoire par celui de la base.
        if (cree) setJalons((liste) => liste.map((x) => (x.id === j.id ? cree : x)))
      } else if (ancien.date !== j.date || ancien.chapitres !== j.chapitres) {
        await majJalon(j.id, { date: j.date, chapitres: j.chapitres })
      }
    }
  }

  if (apprenants === null || jalons === null) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-cream">
        <p className="text-sm text-navy/40">Chargement du suivi…</p>
      </div>
    )
  }

  if (apprenants.length === 0) {
    return (
      <div className="min-h-screen w-full bg-cream px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-navy/50">Espace formateur</p>
          <h1 className="font-display text-3xl text-navy-deep">{organisation.nom}</h1>
          <p className="mt-4 text-navy/70">
            Personne n'a encore rejoint ce groupe. Diffusez le lien ci-dessous à vos apprenants, leur progression
            apparaîtra ici dès leur première connexion.
          </p>
          <code className="mt-5 block overflow-x-auto whitespace-nowrap rounded-xl bg-navy/5 px-4 py-3 text-sm text-navy">
            {lienInvitation(groupe.code)}
          </code>
          {onQuitter && (
            <button onClick={onQuitter} className="mt-6 text-sm text-navy/60 underline hover:text-navy">
              Voir le parcours comme un apprenant
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <EspaceFormateur
      demo={false}
      organisation={organisation}
      apprenants={apprenants}
      jalonsInitiaux={jalons}
      dateReference={aujourdhui()}
      lien={lienInvitation(groupe.code)}
      onJalonsChange={enregistrerJalons}
      onQuitter={onQuitter}
    />
  )
}
