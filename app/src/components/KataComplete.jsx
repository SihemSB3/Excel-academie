import { useEffect, useState } from 'react'
import { ceintureInfo } from '../lib/belts'
import { BeltGraphic, Bouton } from './ui'
import { ShifuBubble } from './Shifu'

const COULEURS_CONFETTI = ['#41c1ba', '#0a335d', '#f4cf3f', '#e8853a', '#ffffff']

const FELICITATIONS = [
  'Kata maîtrisé. La répétition forge le réflexe : ton œil voit déjà Excel autrement.',
  "Un kata de plus. Chaque geste appris est un geste que tu n'auras plus à chercher.",
  'Belle exécution. Le maître ne compte pas les katas, il compte les progrès.',
  'Tu avances bien. La ceinture se gagne un kata à la fois.',
]

function Confetti() {
  const pieces = Array.from({ length: 22 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 3,
    dur: 2.6 + Math.random() * 2,
    color: COULEURS_CONFETTI[i % COULEURS_CONFETTI.length],
    size: 6 + Math.random() * 6,
    rond: i % 2 === 0,
  }))
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="animate-confetti absolute top-0"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: p.rond ? '9999px' : '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  )
}

// La récompense de fin de KATA : plus petite que la cérémonie de ceinture, mais un vrai
// moment de satisfaction — confettis, +XP, barre de progression vers la prochaine ceinture
// et félicitations du Shifu. `dejaFait` = kata rejoué (pas de double XP, message adapté).
export default function KataComplete({ titre, xp, dejaFait, fait, total, ceinture, onContinuer }) {
  const info = ceintureInfo(ceinture)
  const [message] = useState(() => FELICITATIONS[Math.floor(Math.random() * FELICITATIONS.length)])
  const pct = Math.round((fait / total) * 100)
  const pctAvant = dejaFait ? pct : Math.round(((fait - 1) / total) * 100)
  const [largeur, setLargeur] = useState(pctAvant)
  useEffect(() => {
    const id = setTimeout(() => setLargeur(pct), 450)
    return () => clearTimeout(id)
  }, [pct])

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(65,193,186,.14),transparent_60%)]" />
      <Confetti />
      <div
        className="animate-rayons pointer-events-none absolute left-1/2 top-[26%] h-64 w-64 opacity-20"
        style={{
          background: 'repeating-conic-gradient(rgba(65,193,186,.30) 0deg 7deg, transparent 7deg 22deg)',
          borderRadius: '9999px',
          maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
        }}
      />

      <p className="z-10 animate-fade-up text-sm font-bold uppercase tracking-[.3em] text-mint">Kata terminé</p>
      <h1 className="z-10 mt-3 animate-pop font-display text-3xl leading-tight text-navy">{titre}</h1>

      {!dejaFait ? (
        <div className="z-10 mt-4 animate-pop rounded-full bg-mint px-6 py-2 font-display text-2xl text-navy-deep" style={{ animationDelay: '.2s' }}>
          +{xp} XP
        </div>
      ) : (
        <div className="z-10 mt-4 animate-fade-up rounded-full bg-navy/10 px-5 py-2 text-sm font-bold text-navy/60" style={{ animationDelay: '.2s' }}>
          Kata révisé, la répétition est la voie 🥋
        </div>
      )}

      <div className="z-10 mt-6 w-full max-w-xs animate-fade-up" style={{ animationDelay: '.35s' }}>
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-navy/55">
          <span>Ceinture {info.label.toLowerCase()}</span>
          <span>
            {fait}/{total} étapes
          </span>
        </div>
        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-navy/10">
          <div className="h-full rounded-full bg-mint transition-all duration-700 ease-out" style={{ width: `${largeur}%` }} />
        </div>
        <div className="mt-3 flex justify-center">
          <BeltGraphic ceinture={ceinture} size={90} />
        </div>
      </div>

      <div className="z-10 mt-5 w-full max-w-xs animate-fade-up text-left" style={{ animationDelay: '.5s' }}>
        <ShifuBubble humeur="fier" size={72} message={message} />
      </div>

      <div className="z-10 mt-6 w-full max-w-xs animate-fade-up" style={{ animationDelay: '.65s' }}>
        <Bouton onClick={onContinuer}>Continuer le parcours</Bouton>
      </div>
    </div>
  )
}
