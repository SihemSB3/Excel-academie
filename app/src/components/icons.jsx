// Petites icônes SVG maison pour l'univers de l'académie.

// Tête de ninja (encarts + "Entraînement")
export function NinjaIcon({ size = 28, className = '' }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="24" cy="23" r="16" fill="#0a335d" />
      <path d="M9 15 l-6 -2 1 7 z" fill="#41c1ba" />
      <rect x="8" y="14" width="29" height="5" rx="1.5" fill="#41c1ba" />
      <ellipse cx="24" cy="26" rx="10.5" ry="9" fill="#f0d2a8" />
      <circle cx="19.5" cy="25" r="2.1" fill="#0a335d" />
      <circle cx="28.5" cy="25" r="2.1" fill="#0a335d" />
    </svg>
  )
}

// Mannequin de bois (mok yan jong) du Wing Chun, pour le décor en filigrane
export function MannequinBois({ size = 160, className = '' }) {
  return (
    <svg
      viewBox="0 0 100 180"
      width={size}
      height={size * 1.8}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="12"
      strokeLinecap="round"
    >
      <line x1="50" y1="14" x2="50" y2="150" />
      <line x1="50" y1="46" x2="22" y2="34" />
      <line x1="50" y1="46" x2="78" y2="34" />
      <line x1="50" y1="72" x2="76" y2="80" />
      <line x1="50" y1="120" x2="30" y2="152" />
    </svg>
  )
}

// (anciennes icônes conservées au cas où)
export function ArtMartialIcon({ size = 26, className = '' }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="10" r="4" fill="currentColor" stroke="none" />
      <path d="M16 14 L19 27" />
      <path d="M19 27 L13 40" />
      <path d="M18 22 L40 12" />
      <path d="M16 17 L8 21" />
      <path d="M16 18 L25 22" />
    </svg>
  )
}
