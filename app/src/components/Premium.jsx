import { useState } from 'react'
import { ShifuBubble } from './Shifu'

// Écran d'abonnement (paywall). S'affiche quand un visiteur tente d'ouvrir du
// contenu premium (chapitres 3 à 13, ou la section « accès direct »).
//
// Le paiement Stripe n'est pas encore branché : les boutons affichent un message
// d'attente honnête, comme l'écran de connexion. Quand Stripe sera prêt, chaque
// bouton lancera le Checkout correspondant (à vie ou mensuel).

const AVANTAGES = [
  'Les 13 chapitres, de la ceinture blanche à la noire',
  'Les 91 exercices corrigés, du niveau débutant au niveau pro',
  'Les fonctions les plus demandées en entreprise : RECHERCHEV, SI, TCD…',
  'Les guides PDF par chapitre, à télécharger',
  'Ton suivi de progression et tes ceintures sauvegardés',
]

function Plan({ titre, prix, sousTitre, detail, recommande, chargement, onClick }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-5 ${
        recommande ? 'border-mint bg-mint/10' : 'border-navy/15 bg-white/70'
      }`}
    >
      {recommande && (
        <span className="absolute -top-2.5 left-5 rounded-full bg-mint px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy-deep">
          Le plus choisi
        </span>
      )}
      <p className="text-sm font-bold uppercase tracking-wide text-navy/60">{titre}</p>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="font-display text-4xl text-navy-deep">{prix}</span>
        {sousTitre && <span className="text-sm font-bold text-navy/60">{sousTitre}</span>}
      </div>
      {detail && <p className="mt-1 text-xs text-navy/55">{detail}</p>}
      <button
        onClick={onClick}
        disabled={chargement}
        className={`mt-4 w-full rounded-full px-4 py-2.5 text-sm font-bold transition disabled:opacity-60 ${
          recommande
            ? 'bg-mint text-navy-deep hover:bg-mint-dark'
            : 'border border-navy/20 text-navy hover:bg-navy/5'
        }`}
      >
        {chargement ? '…' : 'Choisir'}
      </button>
    </div>
  )
}

export default function Premium({ onRetour, onChoisir }) {
  const [message, setMessage] = useState(null)
  const [charge, setCharge] = useState(null)
  // Renoncement exprès au droit de rétractation (obligatoire pour du contenu
  // numérique à accès immédiat, voir CGV art. 9). Sans coche, pas de paiement.
  const [consent, setConsent] = useState(false)

  const choisir = async (plan) => {
    if (!consent) {
      setMessage('Merci de cocher la case ci-dessous pour continuer.')
      return
    }
    // Sans backend branché (mode local/démo), on reste honnête plutôt que d'échouer.
    if (!onChoisir) {
      setMessage('Le paiement sera disponible très bientôt. Ton accès sera débloqué automatiquement après le règlement.')
      return
    }
    setCharge(plan)
    setMessage(null)
    try {
      await onChoisir(plan) // redirige vers Stripe
    } catch {
      setMessage("Le paiement n'a pas pu démarrer. Réessaie dans un instant.")
      setCharge(null)
    }
  }

  return (
    <div className="min-h-screen w-full bg-cream px-5 py-8">
      <div className="mx-auto max-w-xl">
        {onRetour && (
          <button onClick={onRetour} className="mb-4 text-sm font-bold text-navy/60 transition hover:text-navy">
            ‹ Retour au dojo
          </button>
        )}

        <div className="mb-5">
          <ShifuBubble
            humeur="pensif"
            message="Tu as goûté aux deux premiers chapitres, jeune élève. La voie complète t'attend, du blanc au noir. Débloque tout et va au bout."
          />
        </div>

        <h1 className="font-display text-3xl text-navy-deep sm:text-4xl">Débloque toute l'Académie</h1>
        <p className="mt-2 text-sm text-navy/70">
          Les chapitres 1 et 2 sont offerts. Pour la suite du parcours, choisis ta formule.
        </p>

        <ul className="mt-5 space-y-2">
          {AVANTAGES.map((a) => (
            <li key={a} className="flex items-start gap-2 text-sm text-navy/85">
              <span className="mt-0.5 text-mint">✓</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-navy/15 bg-white/60 p-4 text-sm text-navy/80">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-mint"
          />
          <span>
            J'accepte les{' '}
            <a href="/cgv.html" target="_blank" rel="noopener noreferrer" className="font-bold text-navy underline">
              conditions générales de vente
            </a>{' '}
            et je demande l'accès immédiat au contenu, en renonçant à mon droit de rétractation de 14 jours.
          </span>
        </label>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Plan
            titre="Accès à vie"
            prix="129 €"
            detail="Un seul paiement, accès pour toujours. Le meilleur rapport."
            recommande
            chargement={charge === 'vie'}
            onClick={() => choisir('vie')}
          />
          <Plan
            titre="Mensuel"
            prix="19,90 €"
            sousTitre="/mois"
            detail="Sans engagement, résiliable à tout moment."
            chargement={charge === 'mois'}
            onClick={() => choisir('mois')}
          />
        </div>

        {message && (
          <div className="mt-4 rounded-2xl border border-[#e8853a]/40 bg-[#e8853a]/10 px-4 py-3 text-sm text-navy/80">
            🔧 {message}
          </div>
        )}

        <p className="mt-6 text-center text-[11px] text-navy/40">
          Déjà membre d'une école ou d'une entreprise partenaire ? Rejoins ton groupe avec le lien fourni par ton
          formateur, l'accès est compris.
        </p>
      </div>
    </div>
  )
}
