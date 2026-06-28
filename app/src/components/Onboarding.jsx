import { useState } from 'react'
import { Bouton, BeltGraphic } from './ui'
import { ShifuDit } from './Shifu'
import { MannequinBois } from './icons'
import { CEINTURES } from '../lib/belts'

const ETAPES = [
  { humeur: 'accueil', dit: 'Bienvenue dans ton **dojo Excel**. Ici, on n\'apprend pas Excel par cœur : on s\'entraîne, geste après geste.' },
  { humeur: 'content', dit: 'Tu vas progresser comme un artiste martial : de la **ceinture blanche** à la **ceinture noire**. Chaque chapitre maîtrisé te fait gagner une ceinture.', voie: true },
  { humeur: 'pensif', dit: '**Règle du dojo n°1 :** la régularité bat l\'intensité. Un petit entraînement chaque jour vaut mieux qu\'une longue séance une fois par mois.' },
  { humeur: 'pensif', dit: '**Règle du dojo n°2 :** ici, aucun jugement. Chaque erreur te rapproche de la maîtrise, elle fait partie du chemin.' },
  { humeur: 'fier', dit: '**Règle du dojo n°3 :** prends ton temps et savoure chaque étape. Le Shifu t\'accompagne à chaque pas. Prêt(e) à commencer ?' },
]

// La Voie : les 7 ceintures, de la blanche à la noire.
function Voie() {
  return (
    <div className="mt-4 flex flex-wrap items-end justify-center gap-x-2 gap-y-3">
      {CEINTURES.map((c, i) => (
        <div key={c.id} className="flex animate-fade-up flex-col items-center" style={{ animationDelay: `${i * 90}ms` }}>
          <BeltGraphic ceinture={c.id} size={i === 0 ? 58 : 46} />
          <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-navy/45">{c.label}</span>
        </div>
      ))}
    </div>
  )
}

// Tunnel d'entrée : l'arrivée au dojo, la Voie, et les règles, avant la première leçon.
export default function Onboarding({ onTerminer }) {
  const [etape, setEtape] = useState(0)
  const s = ETAPES[etape]
  const dernier = etape >= ETAPES.length - 1
  const avancer = () => (dernier ? onTerminer() : setEtape((e) => e + 1))

  return (
    <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-cream px-5 py-8">
      {/* Décor du dojo en filigrane */}
      <div className="pointer-events-none absolute -right-12 top-12 text-navy/5">
        <MannequinBois size={230} />
      </div>
      <div className="pointer-events-none absolute -left-14 bottom-8 -scale-x-100 text-navy/[0.04]">
        <MannequinBois size={190} />
      </div>

      <div className="z-10 mb-4 text-center">
        <p className="font-display text-[11px] uppercase tracking-[0.25em] text-mint">L'Art du Digital</p>
        <h1 className="font-display text-4xl text-navy">Excel Dojo</h1>
      </div>

      <div className="z-10 mx-auto flex w-full max-w-xl flex-1 flex-col justify-center">
        <div key={etape} className="flex min-h-[280px] flex-col justify-center">
          <ShifuDit message={s.dit} humeur={s.humeur} size={88} />
          {s.voie && <Voie />}
        </div>

        <div className="mt-6">
          <Bouton onClick={avancer}>{dernier ? 'Entrer dans le dojo 🥋' : 'Continuer'}</Bouton>
          {!dernier && (
            <button onClick={onTerminer} className="mt-3 block w-full text-center text-xs text-navy/40 transition hover:text-navy/70">
              Passer l'intro
            </button>
          )}
        </div>

        <div className="mt-5 flex justify-center gap-1.5">
          {ETAPES.map((_, i) => (
            <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === etape ? 'bg-mint' : i < etape ? 'bg-mint/40' : 'bg-navy/15'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
