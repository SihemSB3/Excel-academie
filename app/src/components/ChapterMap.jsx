import { ceintureInfo } from '../lib/belts'
import { BeltGraphic, TelechargerGuide } from './ui'

const ICONE = { lecon: '📖', narration: '📖', flashcards: '⌨️', fiche_memo: '📋', quiz: '🎯', checklist: '✅' }
const ETIQUETTE = {
  lecon: 'Kata',
  narration: 'Kata',
  flashcards: 'Réflexes',
  fiche_memo: 'Parchemin',
  quiz: "L'épreuve",
  checklist: 'Passage de ceinture',
}

// La carte du chapitre : un chemin vertical de nœuds qui se remplit jusqu'à la ceinture.
export default function ChapterMap({ ch, estFait, tousFaits, onOuvrir, onQuitter, onReclamerCeinture }) {
  const ceinture = ceintureInfo(ch.ceinture)
  const faits = ch.modules.filter(estFait).length // nœuds terminés (contigus depuis le début)

  return (
    <div className="flex flex-1 flex-col">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-cream/90 px-4 py-3 backdrop-blur">
        <button
          onClick={onQuitter}
          aria-label="Retour à l'académie"
          className="text-2xl leading-none text-navy/60 hover:text-navy"
        >
          ×
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-navy">{ch.titre}</p>
          <p className="text-xs text-navy/50">
            {faits}/{ch.modules.length} étapes · objectif ceinture {ceinture.label.toLowerCase()}
          </p>
        </div>
      </div>

      <div className="flex-1 px-5 py-6">
        <TelechargerGuide url={ch.guideUrl} className="mb-6" />
        <ol className="relative">
          {ch.modules.map((m, i) => {
            const fait = i < faits
            const courant = i === faits && !tousFaits
            const dispo = fait || courant
            const topMint = i <= faits
            const bottomMint = i < faits
            return (
              <li
                key={m.id}
                className="flex animate-fade-up items-stretch"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                {/* Le rail du chemin + le nœud */}
                <div className="flex w-14 flex-col items-center">
                  <span className={`w-1 ${i === 0 ? 'h-5 bg-transparent' : `h-5 ${topMint ? 'bg-mint' : 'bg-navy/10'}`}`} />
                  <button
                    disabled={!dispo}
                    onClick={() => dispo && onOuvrir(i)}
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg transition ${
                      fait
                        ? 'bg-mint text-navy-deep'
                        : courant
                          ? 'animate-glow bg-mint/15 text-navy ring-4 ring-mint/60'
                          : 'bg-navy/5 text-navy/30'
                    }`}
                  >
                    {fait ? '✓' : dispo ? ICONE[m.type] : '🔒'}
                  </button>
                  <span className={`w-1 flex-1 ${bottomMint ? 'bg-mint' : 'bg-navy/10'}`} />
                </div>

                {/* La carte de l'étape */}
                <button
                  disabled={!dispo}
                  onClick={() => dispo && onOuvrir(i)}
                  className={`my-2 ml-1 flex-1 rounded-2xl border p-3 text-left transition ${
                    dispo
                      ? 'border-navy/10 bg-navy/5 hover:bg-navy/10'
                      : 'border-navy/5 bg-navy/[.02] opacity-50'
                  }`}
                >
                  <p className="text-[11px] font-bold uppercase tracking-wide text-mint/80">{ETIQUETTE[m.type]}</p>
                  <p className="font-bold leading-tight text-navy">{m.titre}</p>
                  <p className="mt-0.5 text-xs text-navy/45">
                    {fait ? 'Terminé ✓' : courant ? 'À faire maintenant' : dispo ? 'À revoir' : 'Verrouillé'}
                  </p>
                </button>
              </li>
            )
          })}

          {/* Le but : la ceinture */}
          <li
            className="flex animate-fade-up flex-col items-center pt-2 text-center"
            style={{ animationDelay: `${ch.modules.length * 70}ms` }}
          >
            <span className={`h-8 w-1 ${tousFaits ? 'bg-mint' : 'bg-navy/10'}`} />
            <div className={tousFaits ? 'animate-pop' : 'opacity-40'}>
              <BeltGraphic ceinture={ch.ceinture} size={120} anime={tousFaits} />
            </div>
            <p className="mt-1 font-display text-2xl text-navy">Ceinture {ceinture.label}</p>
            {tousFaits ? (
              <button
                onClick={onReclamerCeinture}
                className="mt-3 animate-pop rounded-2xl bg-mint px-6 py-3 text-lg font-bold text-navy-deep transition active:scale-95"
              >
                Réclame ta ceinture 🥋
              </button>
            ) : (
              (() => {
                const restants = ch.modules.filter((mm) => !estFait(mm))
                return (
                  <div className="mt-1 max-w-[17rem] text-center text-xs text-navy/45">
                    <p className="font-semibold text-navy/55">
                      Il te reste {restants.length} étape{restants.length > 1 ? 's' : ''} avant la ceinture :
                    </p>
                    <p className="mt-0.5">{restants.map((mm) => mm.titre).join(' · ')}</p>
                  </div>
                )
              })()
            )}
          </li>
        </ol>
      </div>
    </div>
  )
}
