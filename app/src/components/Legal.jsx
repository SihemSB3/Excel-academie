import { PAGES_LEGALES } from '../data/legal'

// Écran des pages légales (CGV, confidentialité, mentions légales), intégré à
// l'app. Le contenu vient de data/legal.js (source unique). Les onglets en haut
// permettent de passer d'un document à l'autre sans quitter l'écran.
const ONGLETS = [
  { id: 'cgv', label: 'CGV' },
  { id: 'confidentialite', label: 'Confidentialité' },
  { id: 'mentions', label: 'Mentions légales' },
]

export default function Legal({ page = 'cgv', onRetour, onChangerPage }) {
  const doc = PAGES_LEGALES[page] || PAGES_LEGALES.cgv

  return (
    <div className="min-h-screen w-full bg-cream px-5 py-8">
      <style>{`
        .legal-contenu h2 { font-size:18px; color:#0A335D; font-weight:800; margin:26px 0 6px; }
        .legal-contenu p, .legal-contenu li { font-size:14.5px; line-height:1.65; color:#3A4B60; margin:6px 0; }
        .legal-contenu ul { padding-left:20px; margin:6px 0; }
        .legal-contenu a { color:#178A72; font-weight:700; }
        .legal-contenu table { border-collapse:collapse; width:100%; margin:10px 0; font-size:13.5px; }
        .legal-contenu th, .legal-contenu td { border:1px solid #EFE7D5; padding:8px 10px; text-align:left; vertical-align:top; }
        .legal-contenu th { background:#F0FAF6; color:#0A335D; }
      `}</style>

      <div className="mx-auto w-full max-w-2xl">
        {onRetour && (
          <button onClick={onRetour} className="mb-4 text-sm font-bold text-navy/60 transition hover:text-navy">
            ‹ Retour à l'Académie
          </button>
        )}

        <p className="text-xs font-bold uppercase tracking-[.2em] text-mint">L'Art du Digital — Excel Académie</p>
        <h1 className="mt-1 font-display text-3xl text-navy-deep sm:text-4xl">{doc.titre}</h1>

        <div className="mt-4 flex flex-wrap gap-2">
          {ONGLETS.map((o) => (
            <button
              key={o.id}
              onClick={() => onChangerPage && onChangerPage(o.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                page === o.id ? 'bg-navy text-cream' : 'bg-navy/5 text-navy/70 hover:bg-navy/10'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-navy/10 bg-white/60 p-6">
          <div className="legal-contenu" dangerouslySetInnerHTML={{ __html: doc.html }} />
          <p className="mt-6 text-xs text-navy/40">Dernière mise à jour : 30 juillet 2026.</p>
        </div>
      </div>
    </div>
  )
}
