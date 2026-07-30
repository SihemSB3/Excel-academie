import { Shifu } from './Shifu'
import { Bouton } from './ui'

// Écran affiché quand un utilisateur NON abonné termine le dernier chapitre
// gratuit (chapitre 2), juste après sa ceinture. Le moment fort pour proposer
// l'abonnement, sans forcer : il peut aussi continuer à explorer.
export default function FinGratuit({ onDebloquer, onContinuer }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-cream px-5 py-10 text-center">
      <Shifu humeur="content" size={96} />
      <h1 className="mt-4 font-display text-3xl text-navy-deep sm:text-4xl">Bravo, jeune élève 🥋</h1>
      <p className="mt-3 max-w-md text-navy/75">
        Tu as bouclé les <strong className="text-navy">2 chapitres offerts</strong>. La suite du parcours t'attend :
        11 chapitres, 91 exercices, et les ceintures jusqu'à la noire.
      </p>
      <div className="mt-7 w-full max-w-xs">
        <Bouton onClick={onDebloquer}>Débloquer toute l'Académie</Bouton>
      </div>
      <button onClick={onContinuer} className="mt-4 text-sm font-bold text-navy/55 transition hover:text-navy">
        Continuer à explorer
      </button>
    </div>
  )
}
