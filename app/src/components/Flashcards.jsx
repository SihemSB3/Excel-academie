import { useState, useEffect } from 'react'
import { useProgressCtx } from '../store/ProgressContext'
import { Bouton } from './ui'
import { ShifuDit } from './Shifu'
import { ding } from '../lib/sound'

function GroupeCartes({ label, cartes }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-mint/80">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {cartes.map((c, i) => {
          const aMac = c.mac && c.mac !== c.raccourci
          return (
            <div
              key={c.n}
              className="animate-fade-up rounded-xl border border-navy/10 bg-navy/5 p-3"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="font-display text-base leading-tight text-mint">
                {c.raccourci}
                {aMac && <span className="ml-1 font-sans text-[9px] font-bold uppercase tracking-wide text-navy/35">PC</span>}
              </div>
              {aMac && (
                <div className="font-display text-base leading-tight text-mint/70">
                  {c.mac}
                  <span className="ml-1 font-sans text-[9px] font-bold uppercase tracking-wide text-navy/35">Mac</span>
                </div>
              )}
              <div className="mt-1 text-xs leading-snug text-navy/75">{c.action}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Flashcards({ module, onTermine }) {
  const { validerEcran } = useProgressCtx()
  const cartesPar = (cat) => module.cartes.filter((c) => c.categorie === cat)

  const steps = [
    { type: 'shifu', humeur: 'accueil', message: 'Les raccourcis clavier, ce sont de précieuses astuces pour gagner du temps.' },
    { type: 'shifu', humeur: 'accueil', message: "Au début ils semblent peu naturels, c'est normal. Répète-les souvent, et ils deviendront instinctifs." },
    { type: 'cat', cat: 'navigation', label: 'Se déplacer' },
    { type: 'cat', cat: 'selection', label: 'Sélectionner' },
    { type: 'cat', cat: 'fichier', label: 'Gérer le fichier' },
    { type: 'cat', cat: 'edition', label: 'Éditer' },
  ]
  if (module.hack_shaolin) steps.push({ type: 'shifu', humeur: 'pensif', message: module.hack_shaolin, son: true })

  const [etape, setEtape] = useState(0)
  const dernier = etape >= steps.length - 1
  const s = steps[etape]

  useEffect(() => {
    if (steps[etape]?.son) ding()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etape])

  const avancer = () => {
    if (dernier) {
      validerEcran(module.id, module.xp_completion || 0)
      onTermine()
    } else {
      setEtape((e) => e + 1)
    }
  }
  const reculer = () => setEtape((e) => Math.max(0, e - 1))

  return (
    <div className="animate-fade-up px-5 py-6">
      <p className="text-xs font-bold uppercase tracking-wide text-mint">{module.titre}</p>
      <h2 className="mb-4 mt-1 font-display text-3xl text-navy">Les raccourcis clavier</h2>

      {/* Une seule étape à la fois (conversation) ; key={etape} relance l'animation et l'écriture */}
      <div className="flex min-h-[240px] items-start" key={etape}>
        {s.type === 'shifu' ? <ShifuDit message={s.message} humeur={s.humeur} size={70} /> : <GroupeCartes label={s.label} cartes={cartesPar(s.cat)} />}
      </div>

      <div className="mt-4">
        <Bouton onClick={avancer}>{dernier ? "C'est noté, je continue" : 'Continuer'}</Bouton>
        {etape > 0 && (
          <button onClick={reculer} className="mt-3 block w-full text-center text-xs text-navy/50 hover:text-navy">
            ‹ Revenir en arrière
          </button>
        )}
      </div>

      {/* Indicateur de progression dans la conversation */}
      <div className="mt-4 flex justify-center gap-1.5">
        {steps.map((_, i) => (
          <span key={i} className={`h-1.5 w-1.5 rounded-full transition-colors ${i === etape ? 'bg-mint' : i < etape ? 'bg-mint/40' : 'bg-navy/15'}`} />
        ))}
      </div>
    </div>
  )
}
