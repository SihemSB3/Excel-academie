import { useState } from 'react'
import { Bouton } from './ui'
import { Shifu } from './Shifu'
import { supabase } from '../lib/supabase'
import { useAuth } from '../store/AuthContext'

// Écran affiché quand l'utilisateur revient d'un lien « mot de passe oublié ».
// Supabase a ouvert une session temporaire de récupération ; on lui fait choisir
// un nouveau mot de passe, puis on le renvoie dans le dojo, connecté.
export default function NouveauMotDePasse({ onTermine }) {
  const { terminerRecuperation } = useAuth()
  const [mdp, setMdp] = useState('')
  const [mdp2, setMdp2] = useState('')
  const [erreur, setErreur] = useState('')
  const [charge, setCharge] = useState(false)

  const valider = async () => {
    setErreur('')
    if (mdp.length < 6) {
      setErreur('Le mot de passe doit faire au moins 6 caractères.')
      return
    }
    if (mdp !== mdp2) {
      setErreur('Les deux mots de passe ne correspondent pas.')
      return
    }
    setCharge(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: mdp })
      if (error) throw error
      terminerRecuperation()
      onTermine && onTermine()
    } catch (e) {
      setErreur(e?.message || 'Une erreur est survenue.')
      setCharge(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-cream px-5 py-8">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
        <div className="mb-2 flex justify-center">
          <Shifu humeur="accueil" size={84} />
        </div>
        <h1 className="text-center font-display text-3xl text-navy">Nouveau mot de passe</h1>
        <p className="mt-2 text-center text-sm text-navy/60">Choisis ton nouveau mot de passe pour te reconnecter.</p>

        <div className="mt-5 space-y-3">
          <input
            type="password"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
            placeholder="Nouveau mot de passe"
            autoComplete="new-password"
            className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-navy outline-none focus:border-mint"
          />
          <input
            type="password"
            value={mdp2}
            onChange={(e) => setMdp2(e.target.value)}
            placeholder="Confirme le mot de passe"
            autoComplete="new-password"
            className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-navy outline-none focus:border-mint"
          />
        </div>

        {erreur && <p className="mt-3 rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-700">{erreur}</p>}

        <div className="mt-5">
          <Bouton onClick={valider} disabled={charge}>
            {charge ? '...' : 'Enregistrer'}
          </Bouton>
        </div>
      </div>
    </div>
  )
}
