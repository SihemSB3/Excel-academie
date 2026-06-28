import { useState } from 'react'
import { useProgressCtx } from '../store/ProgressContext'
import { Bouton } from './ui'

export default function Checklist({ module, onTermine }) {
  const { validerEcran } = useProgressCtx()
  const [coches, setCoches] = useState({})
  const terminer = () => {
    validerEcran(module.id, module.xp_completion || 0)
    onTermine()
  }
  return (
    <div className="animate-fade-up px-5 py-6">
      <p className="text-xs font-bold uppercase tracking-wide text-mint">{module.titre}</p>
      <h2 className="mt-1 font-display text-3xl text-navy">Mes compétences</h2>
      <p className="mt-2 text-sm text-navy/60">
        Coche ce que tu maîtrises. C'est ton auto-évaluation, sois honnête avec toi-même.
      </p>
      <div className="mt-4 space-y-2">
        {module.items.map((it, idx) => {
          const on = coches[idx]
          return (
            <button
              key={idx}
              onClick={() => setCoches((c) => ({ ...c, [idx]: !c[idx] }))}
              className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
                on ? 'border-mint/50 bg-mint/10' : 'border-navy/10 bg-navy/5'
              }`}
            >
              <span
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border text-xs ${
                  on ? 'border-mint bg-mint text-navy-deep' : 'border-navy/30'
                }`}
              >
                {on ? '✓' : ''}
              </span>
              <span className="text-sm text-navy/90">{it}</span>
            </button>
          )
        })}
      </div>
      <div className="mt-7">
        <Bouton onClick={terminer}>Valider mes acquis</Bouton>
      </div>
    </div>
  )
}
