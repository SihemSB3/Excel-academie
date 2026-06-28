import { useState } from 'react'
import { Bouton } from './ui'
import { ShifuDit } from './Shifu'

const PRESETS = [
  'Décrocher la ceinture jaune cette semaine',
  "M'entraîner 10 minutes chaque jour",
  'Finir le chapitre 2 ce mois-ci',
]

// Écran montré après la 1re ceinture : l'élève fixe un objectif clair (capitaliser sur l'élan).
export default function ObjectifsSmart({ onTerminer }) {
  const [choix, setChoix] = useState(null)
  const [perso, setPerso] = useState('')
  const objectif = choix === 'perso' ? perso.trim() : choix

  const valider = () => {
    if (objectif) {
      try {
        localStorage.setItem('excel-dojo-objectif', objectif)
      } catch {
        /* stockage indisponible */
      }
    }
    onTerminer()
  }

  return (
    <div className="flex flex-1 flex-col px-5 py-8">
      <p className="text-xs font-bold uppercase tracking-wide text-mint">Ton objectif</p>
      <h2 className="mt-1 font-display text-3xl text-navy">Fixe ton cap</h2>

      <div className="mt-4">
        <ShifuDit
          humeur="content"
          size={76}
          message="Tu viens de gagner ta **première ceinture**. Profitons de l'élan : choisis un objectif clair. C'est ce qui te fera revenir t'entraîner."
        />
      </div>

      <div className="mt-5 space-y-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setChoix(p)}
            className={`w-full rounded-2xl border p-3 text-left transition ${choix === p ? 'border-mint bg-mint/15 font-bold text-navy' : 'border-navy/10 bg-navy/5 text-navy/80 hover:bg-navy/10'}`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setChoix('perso')}
          className={`w-full rounded-2xl border p-3 text-left transition ${choix === 'perso' ? 'border-mint bg-mint/15' : 'border-navy/10 bg-navy/5 hover:bg-navy/10'}`}
        >
          <span className="font-bold text-navy">Mon propre objectif</span>
          {choix === 'perso' && (
            <input
              autoFocus
              value={perso}
              onChange={(e) => setPerso(e.target.value)}
              placeholder="Ex : maîtriser les formules avant juin"
              className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-mint"
            />
          )}
        </button>
      </div>

      <div className="mt-auto pt-6">
        <Bouton onClick={valider} disabled={!objectif}>
          C'est noté 🎯
        </Bouton>
        <button onClick={onTerminer} className="mt-3 block w-full text-center text-xs text-navy/40 transition hover:text-navy/70">
          Plus tard
        </button>
      </div>
    </div>
  )
}
