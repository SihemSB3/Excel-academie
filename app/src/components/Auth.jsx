import { useState } from 'react'
import { Bouton } from './ui'
import { Shifu } from './Shifu'
import { supabase, supabaseActif } from '../lib/supabase'

// Écran connexion / inscription. Inactif tant que les clés Supabase ne sont pas
// renseignées (l'app continue alors en mode local). S'active dès que le .env est rempli.
export default function Auth({ onRetour, onConnecte }) {
  const [mode, setMode] = useState('connexion') // 'connexion' | 'inscription'
  const [email, setEmail] = useState('')
  const [mdp, setMdp] = useState('')
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [erreur, setErreur] = useState('')
  const [info, setInfo] = useState('')
  const [charge, setCharge] = useState(false)

  const soumettre = async () => {
    setErreur('')
    setInfo('')
    if (!email.trim()) {
      setErreur('Renseigne ton email.')
      return
    }
    if (!supabaseActif) {
      setErreur('La connexion sera disponible très bientôt.')
      return
    }
    // Mot de passe oublié : on envoie un lien de réinitialisation par email.
    if (mode === 'reset') {
      setCharge(true)
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin,
        })
        if (error) throw error
        setInfo('Si un compte existe pour cette adresse, tu recevras un email avec un lien pour choisir un nouveau mot de passe.')
      } catch (e) {
        setErreur(e?.message || 'Une erreur est survenue.')
      } finally {
        setCharge(false)
      }
      return
    }
    if (!mdp) {
      setErreur('Renseigne ton mot de passe.')
      return
    }
    if (mdp.length < 6) {
      setErreur('Le mot de passe doit faire au moins 6 caractères.')
      return
    }
    // Le prénom et le nom servent au suivi du formateur : sans eux, son tableau
    // de bord n'afficherait que des adresses email.
    if (mode === 'inscription' && (!prenom.trim() || !nom.trim())) {
      setErreur('Renseigne ton prénom et ton nom.')
      return
    }
    setCharge(true)
    try {
      if (mode === 'inscription') {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: mdp,
          options: { data: { prenom: prenom.trim(), nom: nom.trim() } },
        })
        if (error) throw error
        setInfo('Compte créé ! Vérifie ta boîte mail pour confirmer, puis connecte-toi.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: mdp })
        if (error) throw error
        onConnecte && onConnecte()
      }
    } catch (e) {
      setErreur(e?.message || 'Une erreur est survenue.')
    } finally {
      setCharge(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col px-5 py-8">
      {onRetour && (
        <button onClick={onRetour} aria-label="Fermer" className="self-start text-2xl leading-none text-navy/50 hover:text-navy">
          ×
        </button>
      )}

      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
        <div className="mb-2 flex justify-center">
          <Shifu humeur="accueil" size={84} />
        </div>
        <h1 className="text-center font-display text-3xl text-navy">
          {mode === 'reset' ? 'Mot de passe oublié' : mode === 'inscription' ? 'Créer un compte' : 'Connexion'}
        </h1>
        <p className="mt-2 text-center text-sm text-navy/60">
          {mode === 'reset'
            ? 'Entre ton email : on t’envoie un lien pour choisir un nouveau mot de passe.'
            : 'Connecte-toi pour retrouver ta progression sur tous tes appareils : apprends sur mobile, fais les exercices sur PC.'}
        </p>

        {!supabaseActif && (
          <div className="mt-4 rounded-xl border border-mint/30 bg-mint/10 px-4 py-3 text-center text-sm text-navy/80">
            🔧 Les comptes arrivent très bientôt. En attendant, ta progression est déjà sauvegardée sur cet appareil.
          </div>
        )}

        <div className="mt-5 space-y-3">
          {mode === 'inscription' && (
            <div className="flex gap-3">
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Prénom"
                autoComplete="given-name"
                className="w-full min-w-0 rounded-xl border border-navy/15 bg-white px-4 py-3 text-navy outline-none focus:border-mint"
              />
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom"
                autoComplete="family-name"
                className="w-full min-w-0 rounded-xl border border-navy/15 bg-white px-4 py-3 text-navy outline-none focus:border-mint"
              />
            </div>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ton email"
            autoComplete="email"
            className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-navy outline-none focus:border-mint"
          />
          {mode !== 'reset' && (
            <input
              type="password"
              value={mdp}
              onChange={(e) => setMdp(e.target.value)}
              placeholder="Mot de passe"
              autoComplete={mode === 'inscription' ? 'new-password' : 'current-password'}
              className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-navy outline-none focus:border-mint"
            />
          )}
        </div>

        {mode === 'connexion' && (
          <button
            onClick={() => {
              setMode('reset')
              setErreur('')
              setInfo('')
            }}
            className="mt-2 self-end text-xs text-navy/50 transition hover:text-navy"
          >
            Mot de passe oublié ?
          </button>
        )}

        {/* Information obligatoire : la progression est visible du formateur dès
            qu'un apprenant rejoint un groupe. On le dit avant l'inscription. */}
        {mode === 'inscription' && (
          <p className="mt-3 text-xs leading-relaxed text-navy/55">
            Si tu rejoins le groupe d'un établissement, ton formateur verra ta progression : chapitres validés, temps
            passé et résultats aux quiz. Personne d'autre n'y a accès.
          </p>
        )}

        {erreur && <p className="mt-3 rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-700">{erreur}</p>}
        {info && <p className="mt-3 rounded-xl bg-mint/15 px-3 py-2 text-sm text-mint">{info}</p>}

        <div className="mt-5">
          <Bouton onClick={soumettre} disabled={charge}>
            {charge ? '...' : mode === 'reset' ? 'Envoyer le lien' : mode === 'inscription' ? 'Créer mon compte' : 'Se connecter'}
          </Bouton>
        </div>

        <button
          onClick={() => {
            setMode(mode === 'connexion' ? 'inscription' : 'connexion')
            setErreur('')
            setInfo('')
          }}
          className="mt-4 text-center text-sm text-navy/60 transition hover:text-navy"
        >
          {mode === 'reset'
            ? 'Retour à la connexion'
            : mode === 'inscription'
              ? 'Déjà un compte ? Se connecter'
              : 'Pas encore de compte ? En créer un'}
        </button>
      </div>
    </div>
  )
}
