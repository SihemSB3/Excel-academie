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
export function BeltGraphic({ ceinture = 'blanche', size = 130, anime = false }) {
  const { couleur, bord } = ceintureInfo(ceinture)
  return (
    <svg
      width={size}
      height={size * 0.66}
      viewBox="0 0 200 132"
      className={anime ? 'animate-glow' : ''}
      aria-hidden="true"
    >
      <rect x="83" y="74" width="15" height="46" rx="4" fill={couleur} stroke={bord} strokeWidth="2" />
      <rect x="102" y="74" width="15" height="46" rx="4" fill={couleur} stroke={bord} strokeWidth="2" />
      <rect x="8" y="46" width="184" height="34" rx="6" fill={couleur} stroke={bord} strokeWidth="2" />
      <rect x="78" y="40" width="44" height="48" rx="9" fill={couleur} stroke={bord} strokeWidth="2" />
      <rect x="8" y="64" width="184" height="5" fill="rgba(0,0,0,.10)" />
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
