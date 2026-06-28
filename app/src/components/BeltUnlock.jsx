import { ceintureInfo } from '../lib/belts'
import { BeltGraphic, Bouton } from './ui'
import { ShifuBubble } from './Shifu'

const COULEURS_CONFETTI = ['#41c1ba', '#0a335d', '#f4cf3f', '#e8853a', '#ffffff']

function Confetti() {
  const pieces = Array.from({ length: 28 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 3.5,
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

// Le pic émotionnel du dojo : le déblocage de ceinture. Cérémonie festive.
export default function BeltUnlock({ recompense, onContinuer }) {
  const info = ceintureInfo(recompense.ceinture_debloquee)
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(65,193,186,.18),transparent_60%)]" />
      <Confetti />
      {/* Rayons qui tournent derrière la ceinture */}
      <div
        className="animate-rayons pointer-events-none absolute left-1/2 top-[34%] h-80 w-80 opacity-25"
        style={{
          background: 'repeating-conic-gradient(rgba(65,193,186,.30) 0deg 7deg, transparent 7deg 22deg)',
          borderRadius: '9999px',
          maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
        }}
      />

      <p className="z-10 animate-fade-up text-sm font-bold uppercase tracking-[.3em] text-mint">Bravo</p>
      <div className="z-10 mt-4 animate-pop">
        <BeltGraphic ceinture={recompense.ceinture_debloquee} size={190} anime />
      </div>
      <h1 className="z-10 mt-5 animate-fade-up font-display text-4xl leading-tight text-navy" style={{ animationDelay: '.15s' }}>
        Ceinture {info.label}
        <br />
        débloquée !
      </h1>
      <p className="z-10 mt-3 max-w-xs animate-fade-up text-navy/80" style={{ animationDelay: '.3s' }}>
        {recompense.message}
      </p>
      <div className="z-10 mt-5 animate-fade-up rounded-full bg-mint/15 px-5 py-2 font-bold text-mint" style={{ animationDelay: '.45s' }}>
        + {recompense.xp_bonus} XP
      </div>

      <div className="z-10 mt-6 w-full max-w-xs animate-fade-up text-left" style={{ animationDelay: '.6s' }}>
        <ShifuBubble
          humeur="fier"
          size={76}
          message="Incline-toi. Tu as gagné cette ceinture par ton travail, pas par chance."
        />
      </div>

      <div className="z-10 mt-6 w-full max-w-xs animate-fade-up" style={{ animationDelay: '.75s' }}>
        <Bouton onClick={onContinuer}>Retour au dojo</Bouton>
      </div>
    </div>
  )
}
