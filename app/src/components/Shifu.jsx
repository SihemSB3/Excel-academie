import { useState, useEffect, useMemo } from 'react'

// Le Shifu : la mascotte-maître de l'académie (façon Duolingo, mais un vieux maître de kung-fu).
// humeur : 'accueil' | 'content' | 'fier' | 'pensif'
export function Shifu({ humeur = 'accueil', size = 110, className = '' }) {
  const yeux = {
    accueil: (
      <>
        <circle cx="83" cy="84" r="3.4" fill="#2b2b2b" />
        <circle cx="117" cy="84" r="3.4" fill="#2b2b2b" />
      </>
    ),
    content: (
      <>
        <path d="M77 86 Q83 79 89 86" stroke="#2b2b2b" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <path d="M111 86 Q117 79 123 86" stroke="#2b2b2b" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      </>
    ),
    fier: (
      <>
        <path d="M78 85 Q83 82 88 85" stroke="#2b2b2b" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <path d="M112 85 Q117 82 122 85" stroke="#2b2b2b" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      </>
    ),
    pensif: (
      <>
        <circle cx="86" cy="82" r="3.2" fill="#2b2b2b" />
        <circle cx="120" cy="82" r="3.2" fill="#2b2b2b" />
      </>
    ),
  }
  const sourcils = {
    accueil: 'M70 68 Q80 63 91 68 M109 68 Q120 63 130 68',
    content: 'M70 66 Q80 61 91 66 M109 66 Q120 61 130 66',
    fier: 'M71 70 Q81 64 91 67 M109 67 Q119 64 129 70',
    pensif: 'M70 64 Q81 62 91 69 M109 69 Q119 62 130 64',
  }

  return (
    <svg viewBox="0 0 200 226" width={size} height={size * 1.13} className={className} aria-hidden="true">
      {/* Cou (peau bronzée) */}
      <rect x="89" y="120" width="22" height="36" fill="#cf9463" />
      {/* Robe de moine Shaolin (ocre/orange) */}
      <path d="M50 154 Q100 140 150 154 L162 216 Q100 228 38 216 Z" fill="#cf8a3e" stroke="#a5662a" strokeWidth="2" />
      {/* Sous-vêtement crème + col croisé façon kung-fu */}
      <path d="M82 150 L100 184 L118 150 Z" fill="#f0e6d2" />
      <path d="M82 150 L100 184 L108 173 L92 149 Z" fill="#b5732c" />
      <path d="M118 150 L100 184 L92 173 L108 149 Z" fill="#c9822f" />
      {/* Manches / plis d'épaule */}
      <rect x="52" y="161" width="13" height="26" rx="6" fill="#bd7a30" />
      <rect x="135" y="161" width="13" height="26" rx="6" fill="#bd7a30" />
      {/* Ceinture (sash) + nœud */}
      <rect x="52" y="184" width="96" height="16" rx="6" fill="#7a3b2a" stroke="#5a2a1e" strokeWidth="1.5" />
      <rect x="94" y="186" width="12" height="22" rx="3" fill="#8a4632" />
      {/* Base sombre (tapis / pieds) */}
      <rect x="46" y="200" width="108" height="12" rx="3" fill="#3a2a1e" />
      {/* Collier de perles (mala) */}
      {[[78, 150], [84, 155], [90, 159], [96, 161], [104, 161], [110, 159], [116, 155], [122, 150]].map(([bx, by], i) => (
        <circle key={i} cx={bx} cy={by} r="2.6" fill="#8a4632" />
      ))}
      {/* Visage (peau bronzée) */}
      <ellipse cx="100" cy="84" rx="52" ry="50" fill="#d9a273" stroke="#b57f4f" strokeWidth="2" />
      <circle cx="50" cy="88" r="9" fill="#d9a273" stroke="#b57f4f" strokeWidth="2" />
      <circle cx="150" cy="88" r="9" fill="#d9a273" stroke="#b57f4f" strokeWidth="2" />
      {/* Barbe latérale (grise du maître) reliant les tempes au menton. Crâne rasé (pas de chignon). */}
      <path d="M53 70 Q47 98 60 114" stroke="#e6e9ec" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M147 70 Q153 98 140 114" stroke="#e6e9ec" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d={sourcils[humeur]} stroke="#eef1f2" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      {yeux[humeur]}
      <path d="M96 90 Q100 98 104 90" stroke="#b57f4f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M100 102 Q85 104 72 120" stroke="#eef1f2" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M100 102 Q115 104 128 120" stroke="#eef1f2" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M73 112 Q78 158 100 160 Q122 158 127 112 Q113 130 100 128 Q87 130 73 112 Z" fill="#eef1f2" stroke="#dadfe1" strokeWidth="1.5" />
    </svg>
  )
}

// Texte qui s'écrit progressivement (effet machine à écrire)
export function TypeWriter({ text = '', speed = 16, onDone, className = '' }) {
  // Le texte peut contenir des passages en **gras**
  const segs = useMemo(() => text.split('**').map((t, i) => ({ bold: i % 2 === 1, t })), [text])
  const total = segs.reduce((s, x) => s + x.t.length, 0)
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    if (!total) return
    let i = 0
    const id = setInterval(() => {
      i += 1
      setN(i)
      if (i >= total) {
        clearInterval(id)
        onDone && onDone()
      }
    }, speed)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])
  let rem = n
  const done = n >= total
  return (
    <span className={className}>
      {segs.map((seg, idx) => {
        const take = Math.min(seg.t.length, Math.max(0, rem))
        rem -= seg.t.length
        const shown = seg.t.slice(0, take)
        if (!shown) return null
        return seg.bold ? (
          <strong key={idx} className="font-bold text-navy">{shown}</strong>
        ) : (
          <span key={idx}>{shown}</span>
        )
      })}
      {!done && <span className="animate-pulse text-mint">▍</span>}
    </span>
  )
}

// Le Shifu avec une bulle de dialogue (texte instantané)
export function ShifuBubble({ message, humeur = 'accueil', size = 88 }) {
  return (
    <div className="flex items-end gap-2">
      <div className="shrink-0 animate-float">
        <Shifu humeur={humeur} size={size} />
      </div>
      <div className="relative mb-3 flex-1 animate-fade-up rounded-2xl rounded-bl-sm border border-navy/10 bg-navy/5 px-4 py-3 text-sm leading-relaxed text-navy/90">
        {message}
      </div>
    </div>
  )
}

// Le Shifu qui "parle" : la bulle s'écrit progressivement
export function ShifuDit({ message, humeur = 'accueil', size = 72, onDone }) {
  return (
    <div className="flex items-end gap-2">
      <div className="shrink-0 animate-float">
        <Shifu humeur={humeur} size={size} />
      </div>
      <div className="relative mb-3 flex-1 animate-fade-up rounded-2xl rounded-bl-sm border border-navy/10 bg-navy/5 px-4 py-3 text-sm leading-relaxed text-navy/90">
        <TypeWriter text={message} onDone={onDone} />
      </div>
    </div>
  )
}
