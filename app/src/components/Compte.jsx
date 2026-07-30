import { useEffect, useState } from 'react'
import { Bouton } from './ui'
import { supabase } from '../lib/supabase'
import { useAuth } from '../store/AuthContext'
import { chargerMonCompte } from '../lib/groupes'

const formaterDate = (iso) => {
  if (!iso) return ''
  const [a, m, j] = String(iso).split('-').map(Number)
  return new Date(a, (m || 1) - 1, j || 1).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const aujourdhui = () => new Date().toISOString().slice(0, 10)

export default function Compte({ onRetour, onOuvrirPremium }) {
  const { session, utilisateur } = useAuth()
  const [compte, setCompte] = useState(undefined)
  const [chargePortail, setChargePortail] = useState(false)
  const [erreur, setErreur] = useState('')
  // Suppression de compte : en deux temps, avec confirmation tapée à la main.
  // C'est irréversible, un simple clic serait trop facile à faire par erreur.
  const [zoneSuppression, setZoneSuppression] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [chargeSuppression, setChargeSuppression] = useState(false)

  useEffect(() => {
    let annule = false
    chargerMonCompte(utilisateur?.id).then((c) => {
      if (!annule) setCompte(c)
    })
    return () => {
      annule = true
    }
  }, [utilisateur?.id])

  const abonneMensuel = compte?.premium_jusqu_au && compte.premium_jusqu_au >= aujourdhui()
  const aVie = compte?.premium_a_vie

  const gererAbonnement = async () => {
    setErreur('')
    setChargePortail(true)
    try {
      const reponse = await fetch('/.netlify/functions/portail-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: session?.access_token }),
      })
      if (!reponse.ok) throw new Error(await reponse.text())
      const { url } = await reponse.json()
      if (url) window.location.href = url
      else throw new Error('Lien du portail manquant')
    } catch (e) {
      setErreur("Impossible d'ouvrir la gestion de l'abonnement pour le moment.")
      setChargePortail(false)
    }
  }

  const supprimerCompte = async () => {
    setErreur('')
    setChargeSuppression(true)
    try {
      const reponse = await fetch('/.netlify/functions/supprimer-compte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: session?.access_token }),
      })
      if (!reponse.ok) throw new Error(await reponse.text())
      // Le compte n'existe plus : on ferme la session et on repart à zéro.
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (e) {
      setErreur("La suppression n'a pas abouti. Réessaie, ou écris à contact@lartdudigital.fr.")
      setChargeSuppression(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-cream px-5 py-8">
      <div className="mx-auto w-full max-w-xl">
        {onRetour && (
          <button onClick={onRetour} className="mb-4 text-sm font-bold text-navy/60 transition hover:text-navy">
            ‹ Retour à l'Académie
          </button>
        )}

        <h1 className="font-display text-3xl text-navy-deep sm:text-4xl">Mon compte</h1>

        <section className="mt-5 rounded-2xl border border-navy/10 bg-white/60 p-5">
          <h2 className="text-xs font-bold uppercase tracking-wide text-navy/50">Mes informations</h2>
          <p className="mt-2 text-sm text-navy/80">
            {compte?.prenom || compte?.nom ? (
              <span className="font-bold text-navy">
                {[compte.prenom, compte.nom].filter(Boolean).join(' ')}
              </span>
            ) : null}
          </p>
          <p className="text-sm text-navy/70">{utilisateur?.email}</p>
        </section>

        <section className="mt-4 rounded-2xl border border-navy/10 bg-white/60 p-5">
          <h2 className="text-xs font-bold uppercase tracking-wide text-navy/50">Mon abonnement</h2>

          {compte === undefined ? (
            <p className="mt-2 text-sm text-navy/50">Chargement…</p>
          ) : aVie ? (
            <>
              <p className="mt-2 flex items-center gap-2 text-sm font-bold text-navy">
                <span className="rounded-full bg-mint/25 px-3 py-0.5 text-xs uppercase tracking-wide text-navy">Accès à vie</span>
                Tout est débloqué, pour toujours.
              </p>
              <p className="mt-1 text-xs text-navy/55">Aucun paiement récurrent, rien à gérer.</p>
            </>
          ) : abonneMensuel ? (
            <>
              <p className="mt-2 text-sm text-navy/80">
                Abonnement mensuel actif, jusqu'au{' '}
                <strong className="font-bold text-navy">{formaterDate(compte.premium_jusqu_au)}</strong>.
              </p>
              <div className="mt-4">
                <Bouton onClick={gererAbonnement} disabled={chargePortail}>
                  {chargePortail ? '…' : 'Gérer ou résilier mon abonnement'}
                </Bouton>
              </div>
              <p className="mt-2 text-xs text-navy/50">
                Tu peux résilier à tout moment. L'accès reste ouvert jusqu'à la fin de la période déjà payée.
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-navy/70">Tu es sur le compte gratuit (chapitres 1 et 2).</p>
              {onOuvrirPremium && (
                <div className="mt-4">
                  <Bouton onClick={onOuvrirPremium}>Débloquer toute l'Académie</Bouton>
                </div>
              )}
            </>
          )}

          {erreur && <p className="mt-3 rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-700">{erreur}</p>}
        </section>

        <button
          onClick={() => supabase.auth.signOut()}
          className="mt-6 text-sm font-bold text-navy/60 underline transition hover:text-navy"
        >
          Se déconnecter
        </button>

        {/* Droit à l'effacement (RGPD art. 17). Discret mais accessible sans
            avoir à écrire un email : la demande doit pouvoir être exercée seule. */}
        <section className="mt-10 border-t border-navy/10 pt-6">
          {!zoneSuppression ? (
            <button
              onClick={() => setZoneSuppression(true)}
              className="text-xs text-navy/40 underline transition hover:text-red-700"
            >
              Supprimer mon compte
            </button>
          ) : (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
              <h2 className="font-display text-xl text-red-800">Supprimer définitivement mon compte</h2>

              <ul className="mt-3 space-y-1.5 text-sm text-navy/80">
                <li>• Ton compte, ta progression, tes ceintures et tes résultats aux quiz seront effacés.</li>
                <li>• C'est <strong className="font-bold">définitif</strong> : rien ne pourra être récupéré.</li>
                {aVie && (
                  <li>
                    • Tu perdras ton <strong className="font-bold">accès à vie</strong>, déjà payé. Il ne sera pas
                    remboursé et ne pourra pas être rétabli.
                  </li>
                )}
                {abonneMensuel && (
                  <li>
                    • Ton abonnement mensuel sera <strong className="font-bold">résilié automatiquement</strong>. Aucun
                    nouveau prélèvement ne sera effectué.
                  </li>
                )}
                <li>
                  • Tes <strong className="font-bold">factures sont conservées 10 ans</strong>, comme la loi comptable
                  l'impose. C'est la seule donnée qui subsiste, et elle reste chez notre prestataire de paiement.
                </li>
              </ul>

              <label className="mt-4 block text-sm text-navy/80">
                Pour confirmer, tape <strong className="font-bold">SUPPRIMER</strong> ci-dessous :
                <input
                  type="text"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-navy/20 bg-white px-4 py-3 text-navy outline-none focus:border-red-500"
                  autoComplete="off"
                />
              </label>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={supprimerCompte}
                  disabled={confirmation.trim().toUpperCase() !== 'SUPPRIMER' || chargeSuppression}
                  className="w-full rounded-2xl bg-red-700 px-5 py-3 font-bold text-white transition hover:bg-red-800 disabled:opacity-40"
                >
                  {chargeSuppression ? '…' : 'Supprimer définitivement'}
                </button>
                <button
                  onClick={() => {
                    setZoneSuppression(false)
                    setConfirmation('')
                    setErreur('')
                  }}
                  className="w-full rounded-2xl border border-navy/20 px-5 py-3 font-bold text-navy transition hover:bg-navy/5"
                >
                  Annuler
                </button>
              </div>

              {erreur && <p className="mt-3 rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-700">{erreur}</p>}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
