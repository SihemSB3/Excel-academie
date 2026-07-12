import { useId } from 'react'
import { ceintureInfo } from '../lib/belts'

// Bouton principal réutilisé partout
export function Bouton({ children, onClick, variant = 'primary', disabled = false, className = '' }) {
  const base =
    'w-full rounded-2xl px-5 py-4 font-bold text-lg transition active:scale-[.98] disabled:opacity-40 disabled:active:scale-100'
  const styles = {
    primary: 'bg-mint text-navy-deep hover:bg-mint-dark',
    ghost: 'bg-navy/5 text-navy border border-navy/15 hover:bg-navy/10',
  }
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  )
}

// Ceinture dessinée en SVG, colorée selon le niveau
// Bandeau de téléchargement du chapitre du guide (PDF). Affiché en haut de l'écran d'un chapitre.
export function TelechargerGuide({ url, className = '' }) {
  if (!url) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 rounded-2xl border border-[#e8853a]/30 bg-[#e8853a]/10 px-4 py-3 text-left transition hover:bg-[#e8853a]/[0.16] ${className}`}
    >
      <span className="text-xl">📘</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-navy">Le cours de ce chapitre en PDF</p>
        <p className="text-xs text-navy/55">Télécharge le chapitre du guide et garde-le avec toi.</p>
      </div>
      <span className="shrink-0 rounded-full bg-[#e8853a] px-3 py-1 text-xs font-bold text-white">Télécharger</span>
    </a>
  )
}

export function BeltGraphic({ ceinture = 'blanche', size = 130, anime = false }) {
  const { couleur, couleur2, bord } = ceintureInfo(ceinture)
  const bicolore = couleur2 && couleur2 !== couleur
  const uid = useId()
  const clip = `belt-${uid}`
  return (
    <svg
      width={size}
      height={size * 0.66}
      viewBox="0 0 200 132"
      className={anime ? 'animate-glow' : ''}
      aria-hidden="true"
    >
      {/* On découpe selon la forme de la ceinture, puis on remplit en deux moitiés (bicolore) */}
      <defs>
        <clipPath id={clip}>
          <rect x="83" y="74" width="15" height="46" rx="4" />
          <rect x="102" y="74" width="15" height="46" rx="4" />
          <rect x="8" y="46" width="184" height="34" rx="6" />
          <rect x="78" y="40" width="44" height="48" rx="9" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect x="0" y="30" width="100" height="102" fill={couleur} />
        <rect x="100" y="30" width="100" height="102" fill={bicolore ? couleur2 : couleur} />
      </g>
      {/* Contours par-dessus le remplissage */}
      <g fill="none" stroke={bord} strokeWidth="2">
        <rect x="83" y="74" width="15" height="46" rx="4" />
        <rect x="102" y="74" width="15" height="46" rx="4" />
        <rect x="8" y="46" width="184" height="34" rx="6" />
        <rect x="78" y="40" width="44" height="48" rx="9" />
      </g>
      <rect x="8" y="64" width="184" height="5" fill="rgba(0,0,0,.10)" />
      {/* La couture centrale, qui sépare nettement les deux couleurs */}
      {bicolore && <line x1="100" y1="40" x2="100" y2="120" stroke={bord} strokeWidth="2" />}
    </svg>
  )
}

export function ProgressBar({ valeur = 0, max = 100 }) {
  const pct = max > 0 ? Math.min(100, Math.round((valeur / max) * 100)) : 0
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-navy/10">
      <div className="h-full rounded-full bg-mint transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  )
}

export function TopBar({ titre, etape, total, onQuitter }) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 bg-cream/90 px-4 py-3 backdrop-blur">
      <button
        onClick={onQuitter}
        aria-label="Quitter le chapitre"
        className="text-2xl leading-none text-navy/60 hover:text-navy"
      >
        ×
      </button>
      <div className="min-w-0 flex-1">
        <p className="mb-1 truncate text-xs font-bold uppercase tracking-wide text-navy/50">{titre}</p>
        <ProgressBar valeur={etape} max={total} />
      </div>
    </div>
  )
}
