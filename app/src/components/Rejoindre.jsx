import { useEffect, useState } from 'react'
import { Bouton } from './ui'
import { Shifu } from './Shifu'
import Auth from './Auth'
import { useAuth } from '../store/AuthContext'
import { apercuGroupe, rejoindreGroupe, nettoyerUrl, MESSAGES_RESULTAT, normaliserCode } from '../lib/groupes'

// Écran de rattachement à un groupe, ouvert par le lien d'invitation du formateur
// (…/?groupe=ESC-B2A-7F3K). L'apprenant voit toujours à quel établissement et à
// quelle promo il s'apprête à se rattacher AVANT de valider : c'est ce qui rend
// impossible de rejoindre le mauvais groupe par erreur.
export default function Rejoindre({ code: codeInitial, onTermine }) {
  const { session, chargement } = useAuth()
  const [code, setCode] = useState(normaliserCode(codeInitial))
  const [apercu, setApercu] = useState(undefined) // undefined = en cours, null = introuvable
  const [enCours, setEnCours] = useState(false)
  const [message, setMessage] = useState('')
  const [reussi, setReussi] = useState(false)

  useEffect(() => {
    let annule = false
    setApercu(undefined)
    apercuGroupe(code).then((r) => {
      if (!annule) setApercu(r)
    })
    return () => {
      annule = true
    }
  }, [code])

  const valider = async () => {
    setEnCours(true)
    setMessage('')
    const resultat = await rejoindreGroupe(code)
    setEnCours(false)
    if (resultat === 'ok' || resultat === 'deja_membre') {
      setReussi(true)
      nettoyerUrl()
      return
    }
    setMessage(MESSAGES_RESULTAT[resultat] || MESSAGES_RESULTAT.erreur)
  }

  const Cadre = ({ children }) => (
    <div className="flex min-h-screen w-full items-center justify-center bg-cream px-5 py-8">
      <div className="w-full max-w-sm text-center">{children}</div>
    </div>
  )

  if (chargement || apercu === undefined) {
    return (
      <Cadre>
        <p className="text-sm text-navy/40">Chargement…</p>
      </Cadre>
    )
  }

  // Lien invalide ou groupe fermé : on propose la saisie manuelle en secours.
  if (apercu === null) {
    return (
      <Cadre>
        <div className="mb-3 flex justify-center">
          <Shifu humeur="accueil" size={84} />
        </div>
        <h1 className="font-display text-2xl text-navy">Ce lien ne correspond à aucun groupe</h1>
        <p className="mt-2 text-sm text-navy/65">
          Vérifie le code auprès de ton formateur, ou saisis-le ici.
        </p>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(normaliserCode(e.target.value))}
          placeholder="Code du groupe"
          className="mt-4 w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-center font-bold tracking-wider text-navy outline-none focus:border-mint"
        />
        <button onClick={onTermine} className="mt-5 text-sm text-navy/60 underline hover:text-navy">
          Continuer sans groupe
        </button>
      </Cadre>
    )
  }

  if (reussi) {
    return (
      <Cadre>
        <div className="mb-3 flex justify-center">
          <Shifu humeur="fier" size={84} />
        </div>
        <h1 className="font-display text-2xl text-navy">Te voilà rattaché 🎉</h1>
        <p className="mt-2 text-sm text-navy/70">
          {apercu.organisation} · {apercu.groupe}
        </p>
        <p className="mt-2 text-sm text-navy/60">
          Ton formateur suivra ta progression. À toi de jouer, la ceinture blanche t'attend.
        </p>
        <div className="mt-6">
          <Bouton onClick={onTermine}>Commencer</Bouton>
        </div>
      </Cadre>
    )
  }

  // Pas encore connecté : on affiche l'inscription, en rappelant le groupe rejoint.
  if (!session) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-cream">
        <div className="mx-auto w-full max-w-sm px-5 pt-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-navy/50">Invitation</p>
          <h1 className="font-display text-2xl text-navy">{apercu.organisation}</h1>
          <p className="text-sm font-bold text-navy/60">{apercu.groupe}</p>
          <p className="mt-3 rounded-xl bg-mint/15 px-4 py-3 text-sm text-navy/75">
            Crée ton compte, tu rejoindras ce groupe juste après.
          </p>
        </div>
        <Auth onConnecte={() => {}} />
      </div>
    )
  }

  return (
    <Cadre>
      <div className="mb-3 flex justify-center">
        <Shifu humeur="accueil" size={84} />
      </div>
      <p className="text-xs font-bold uppercase tracking-wide text-navy/50">Tu rejoins</p>
      <h1 className="font-display text-2xl text-navy">{apercu.organisation}</h1>
      <p className="mt-1 text-sm font-bold text-navy/65">{apercu.groupe}</p>
      <p className="mt-3 text-sm text-navy/60">
        Ton formateur pourra suivre ta progression : chapitres validés, exercices faits et résultats aux quiz.
      </p>

      {apercu.complet && (
        <p className="mt-4 rounded-xl bg-[#e8853a]/15 px-3 py-2 text-sm text-navy/80">
          Toutes les places de ce groupe sont prises. Préviens ton formateur, il pourra en ajouter.
        </p>
      )}
      {message && <p className="mt-4 rounded-xl bg-[#e8853a]/15 px-3 py-2 text-sm text-navy/80">{message}</p>}

      <div className="mt-6">
        <Bouton onClick={valider} disabled={enCours || apercu.complet}>
          {enCours ? '…' : 'Rejoindre ce groupe'}
        </Bouton>
      </div>
      <button onClick={onTermine} className="mt-4 text-sm text-navy/55 underline hover:text-navy">
        Ce n'est pas mon groupe
      </button>
    </Cadre>
  )
}
