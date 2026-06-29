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
      <rect x="89" y="120" width="22" height="36" fill="#f0c79b" />
      <path d="M50 154 Q100 140 150 154 L162 216 Q100 228 38 216 Z" fill="#2c4063" stroke="#1a2740" strokeWidth="2" />
      <path d="M81 150 L100 167 L119 150 L117 161 Q100 178 83 161 Z" fill="#41c1ba" />
      <rect x="44" y="190" width="112" height="13" rx="3" fill="#1c1c1c" />
      <rect x="92" y="188" width="16" height="20" rx="3" fill="#1c1c1c" />
      <rect x="55" y="160" width="90" height="27" rx="13" fill="#26395d" stroke="#1a2740" strokeWidth="2" />
      <line x1="100" y1="162" x2="100" y2="185" stroke="#1a2740" strokeWidth="2" />
      <rect x="52" y="161" width="13" height="25" rx="6" fill="#41c1ba" />
      <rect x="135" y="161" width="13" height="25" rx="6" fill="#41c1ba" />
      <ellipse cx="100" cy="84" rx="52" ry="50" fill="#f3d2a7" stroke="#e0b483" strokeWidth="2" />
      <circle cx="50" cy="88" r="9" fill="#f3d2a7" stroke="#e0b483" strokeWidth="2" />
      <circle cx="150" cy="88" r="9" fill="#f3d2a7" stroke="#e0b483" strokeWidth="2" />
      <path d="M53 70 Q47 98 60 114" stroke="#e6e9ec" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M147 70 Q153 98 140 114" stroke="#e6e9ec" strokeWidth="6" fill="none" strokeLinecap="round" />
      <ellipse cx="100" cy="31" rx="13" ry="12" fill="#39393b" />
      <rect x="91" y="39" width="18" height="8" rx="3" fill="#2b2b2b" />
      <path d={sourcils[humeur]} stroke="#eef1f2" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      {yeux[humeur]}
      <path d="M96 90 Q100 98 104 90" stroke="#e0b483" strokeWidth="2.5" fill="none" strokeLinecap="round" />
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
