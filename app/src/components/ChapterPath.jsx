import { useEffect, useRef, useState } from 'react'
import { ceintureInfo } from '../lib/belts'
import { BeltGraphic } from './ui'
import { Shifu } from './Shifu'

const ICONE = { lecon: '📖', narration: '📖', flashcards: '⌨️', fiche_memo: '📋', quiz: '🎯', checklist: '✅' }
const ETIQUETTE = {
  lecon: 'Kata',
  narration: 'Kata',
  flashcards: 'Réflexes',
  fiche_memo: 'Parchemin',
  quiz: "L'épreuve",
  checklist: 'Passage de ceinture',
}

function cheminLisse(pts) {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1]
    const p1 = pts[i]
    const dx = (p1.x - p0.x) * 0.42
    d += ` C ${p0.x + dx} ${p0.y}, ${p1.x - dx} ${p1.y}, ${p1.x} ${p1.y}`
  }
  return d
}

// Version PC : chemin horizontal d'aventure. La ligne verte se trace et le Shifu
// marche dessus jusqu'à l'étape courante, puis la vue glisse vers la droite.
export default function ChapterPath({ ch, estFait, tousFaits, onOuvrir, onQuitter, onReclamerCeinture }) {
  const ceinture = ceintureInfo(ch.ceinture)
  const faits = ch.modules.filter(estFait).length
  const N = ch.modules.length
  const cibleIdx = tousFaits ? N : faits

  const stepX = 240
  const startX = 160
  const baseY = 210
  const amp = 66
  const H = 430

  const pts = []
  for (let i = 0; i <= N; i++) pts.push({ x: startX + i * stepX, y: baseY + amp * Math.sin(i * 0.8) })
  const trackW = startX * 2 + N * stepX
  const dChemin = cheminLisse(pts)

  const ligneRef = useRef(null)
  const scroller = useRef(null)
  const [len, setLen] = useState(0)
  const [pct, setPct] = useState(0) // position (en % du chemin) jusqu'où la ligne est tracée + où est le Shifu

  // Mesure la longueur totale du chemin une fois rendu
  useEffect(() => {
    if (ligneRef.current) setLen(ligneRef.current.getTotalLength())
  }, [dChemin])

  // Anime le tracé + la marche du Shifu vers l'étape courante (au montage et à chaque progression)
  useEffect(() => {
    const id = setTimeout(() => setPct((cibleIdx / N) * 100), 70)
    return () => clearTimeout(id)
  }, [cibleIdx, N])

  // Fait glisser la vue pour suivre le Shifu
  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTo({ left: Math.max(0, pts[cibleIdx].x - el.clientWidth / 2), behavior: 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cibleIdx])

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-3 px-5 py-3">
        <button onClick={onQuitter} aria-label="Retour au dojo" className="text-2xl leading-none text-navy/60 hover:text-navy">
          ×
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-navy">{ch.titre}</p>
          <p className="text-xs text-navy/50">
            {faits}/{N} étapes · objectif ceinture {ceinture.label.toLowerCase()}
          </p>
        </div>
      </div>

      <div ref={scroller} className="flex flex-1 items-center overflow-x-auto overflow-y-hidden">
        <div className="relative shrink-0" style={{ width: trackW, height: H }}>
          <svg width={trackW} height={H} className="absolute inset-0">
            {/* le sentier complet, en pointillés */}
            <path d={dChemin} fill="none" stroke="rgba(10,51,93,.12)" strokeWidth="6" strokeLinecap="round" strokeDasharray="1 18" />
            {/* la ligne verte qui se trace jusqu'à l'étape courante */}
            <path
              ref={ligneRef}
              d={dChemin}
              fill="none"
              stroke="#41c1ba"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={len || 1}
              strokeDashoffset={len ? len * (1 - pct / 100) : len}
              style={{ transition: 'stroke-dashoffset 1.4s ease-in-out', opacity: len ? 1 : 0 }}
            />
          </svg>

          {ch.modules.map((m, i) => {
            const fait = i < faits
            const courant = i === faits && !tousFaits
            const dispo = fait || courant
            const p = pts[i]
            return (
              <div
                key={m.id}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
                style={{ left: p.x, top: p.y, width: 170 }}
              >
                <button
                  disabled={!dispo}
                  onClick={() => dispo && onOuvrir(i)}
                  className={`grid h-16 w-16 place-items-center rounded-full text-2xl shadow-lg transition ${
                    fait
                      ? 'bg-mint text-navy-deep'
                      : courant
                        ? 'animate-glow bg-mint/15 text-navy ring-4 ring-mint/60'
                        : 'bg-navy/5 text-navy/30'
                  }`}
                >
                  {fait ? '✓' : dispo ? ICONE[m.type] : '🔒'}
                </button>
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-mint/70">{ETIQUETTE[m.type]}</p>
                  <p className="text-xs font-bold leading-tight text-navy">{m.titre}</p>
                </div>
              </div>
            )
          })}

          {/* But : la ceinture, tout au bout du chemin */}
          <div
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: pts[N].x, top: pts[N].y, width: 210 }}
          >
            <div className={tousFaits ? 'animate-pop' : 'opacity-40'}>
              <BeltGraphic ceinture={ch.ceinture} size={96} anime={tousFaits} />
            </div>
            <p className="font-display text-lg text-navy">Ceinture {ceinture.label}</p>
            {tousFaits ? (
              <button
                onClick={onReclamerCeinture}
                className="mt-2 animate-pop rounded-2xl bg-mint px-5 py-2 font-bold text-navy-deep transition active:scale-95"
              >
                Réclame ta ceinture 🥋
              </button>
            ) : (
              <p className="text-[11px] text-navy/40">À débloquer</p>
            )}
          </div>

          {/* Le Shifu marche le long du chemin (offset-path) jusqu'à l'étape courante */}
          <div
            className="pointer-events-none absolute left-0 top-0 z-10 h-0 w-0"
            style={{
              offsetPath: `path('${dChemin}')`,
              offsetDistance: `${pct}%`,
              offsetRotate: '0deg',
              transition: 'offset-distance 1.4s ease-in-out',
            }}
          >
            <div className="absolute bottom-2 left-0 -translate-x-1/2 animate-float">
              <Shifu humeur={faits > 0 ? 'content' : 'accueil'} size={72} />
            </div>
          </div>
        </div>
      </div>

      <p className="px-5 pb-4 text-center text-[11px] text-navy/30">
        Le Shifu avance avec toi, étape après étape, jusqu'à la ceinture.
      </p>
    </div>
  )
}
