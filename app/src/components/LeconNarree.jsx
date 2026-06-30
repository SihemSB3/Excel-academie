import { useState, useEffect } from 'react'
import { Bouton } from './ui'
import { ShifuDit } from './Shifu'
import { coloreFormule } from '../lib/excel'
import { NinjaIcon } from './icons'

// Rend un texte avec des passages en **gras**
function gras(str = '') {
  return str.split('**').map((t, i) => (i % 2 === 1 ? <strong key={i} className="font-bold text-navy">{t}</strong> : <span key={i}>{t}</span>))
}

// Bloc « méthode » : un titre (ex. « Méthode 1 : le ruban ») puis les étapes,
// chacune sur sa propre ligne (numérotée), jamais en paragraphe.
// `depart` permet de continuer la numérotation après une capture intercalée.
function EtapesListe({ titre, items = [], depart = 1 }) {
  if (!titre && !items.length) return null
  return (
    <div className="space-y-2">
      {titre && <p className="font-display text-lg leading-tight text-navy">{gras(titre)}</p>}
      {items.length > 0 && (
        <ol className="space-y-1.5">
          {items.map((e, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-navy/85">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint text-[11px] font-bold text-navy-deep">{depart + i}</span>
              <span>{gras(e)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

// Bloc « En savoir plus » qui se déplie dans l'app, sans en sortir (détail repris de l'ebook).
function PlusInfo({ plus }) {
  const [ouvert, setOuvert] = useState(false)
  return (
    <div className="mt-3">
      <button
        onClick={() => setOuvert((o) => !o)}
        className="flex items-center gap-1.5 rounded-full bg-mint/10 px-3 py-1.5 text-sm font-bold text-mint transition hover:bg-mint/20"
      >
        <span>ℹ️ En savoir plus</span>
        <span className={`text-xs transition-transform ${ouvert ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {ouvert && (
        <div className="mt-2 animate-fade-up space-y-2 rounded-2xl border border-mint/30 bg-mint/5 p-4">
          {plus.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-navy/85">{gras(p)}</p>
          ))}
        </div>
      )}
    </div>
  )
}

const OPERATEURS = [
  { s: '=', l: 'égal à' },
  { s: '<>', l: 'différent de' },
  { s: '>', l: 'supérieur à' },
  { s: '>=', l: 'supérieur ou égal' },
  { s: '<', l: 'inférieur à' },
  { s: '<=', l: 'inférieur ou égal' },
]

const REF_COULEURS = { bleu: '#1a73e8', ambre: '#d97706', vert: '#1f9d57', violet: '#8b5cf6' }

// Colore les références d'une formule selon une carte { B2: 'bleu', C2: 'ambre' }, comme Excel.
function coloreAvecRefs(formule, map) {
  const refs = Object.keys(map)
  if (!refs.length) return coloreFormule(formule)
  // Chaque clé (ex. C2) matche aussi ses formes absolues ($C$2, $C2, C$2).
  const pattern = refs
    .map((r) => {
      const m = r.match(/^([A-Z]+)(\d+)$/)
      return m ? `\\$?${m[1]}\\$?${m[2]}` : r
    })
    .join('|')
  const re = new RegExp('(' + pattern + ')', 'g')
  return formule.split(re).map((p, i) => {
    const norm = p.replace(/\$/g, '')
    return map[norm] ? (
      <span key={i} style={{ color: REF_COULEURS[map[norm]] || map[norm], fontWeight: 700 }}>{p}</span>
    ) : (
      <span key={i} className="text-navy/80">{p}</span>
    )
  })
}

// Mini-tableur concret : un vrai bout de feuille Excel avec données, formule et résultat.
// `poignee` = cellule avec la poignée de recopie (+). `refsCouleur` = cellules colorées comme Excel.
// `animePoignee` = la poignée descend le long de la colonne.
function Tableur({ v }) {
  const { cols, rows, cells = {}, actif, formule, poignee, legende, refsCouleur, animePoignee } = v
  const rendreFormule = (f) => (refsCouleur ? coloreAvecRefs(f, refsCouleur) : coloreFormule(f))
  return (
    <div className="mt-3">
      <div className="animate-fade-up overflow-hidden rounded-xl border border-navy/10 bg-[#ffffff] shadow-lg">
        <div className="flex items-center gap-2 border-b border-navy/10 bg-navy/5 px-3 py-1.5 text-xs">
          <span className="font-bold text-navy/50">fx</span>
          <span className="font-mono text-navy/90">{formule ? rendreFormule(formule) : <span className="text-navy/30">|</span>}</span>
        </div>
        <div className="grid text-xs" style={{ gridTemplateColumns: `28px repeat(${cols.length}, 1fr)` }}>
          <div className="bg-navy/5" />
          {cols.map((c) => (
            <div key={c} className="border-b border-l border-navy/10 bg-navy/10 py-1 text-center text-navy/50">
              {c}
            </div>
          ))}
          {rows.map((r) => (
            <div key={r} className="contents">
              <div className="border-b border-navy/10 bg-navy/10 py-1 text-center text-navy/50">{r}</div>
              {cols.map((c) => {
                const id = c + r
                const cell = cells[id] || {}
                const estPoignee = id === poignee
                const coul = refsCouleur && refsCouleur[id] ? REF_COULEURS[refsCouleur[id]] : null
                let cls = 'text-navy/90'
                if (cell.entete) cls = 'bg-navy/10 font-bold text-navy/70'
                if (cell.ref) cls = 'bg-sky-500/25 text-navy'
                if (cell.vert) cls = 'bg-mint/40 font-bold text-navy'
                if (cell.rouge) cls = 'bg-red-500/25 font-bold text-red-700'
                const estFormule = typeof cell.t === 'string' && cell.t.startsWith('=')
                return (
                  <div
                    key={id}
                    style={coul ? { backgroundColor: coul + '22', boxShadow: `inset 0 0 0 2px ${coul}`, color: coul, fontWeight: 700 } : undefined}
                    className={`min-h-[30px] border-b border-l border-navy/10 px-2 py-1 ${cell.num ? 'text-right' : ''} ${coul ? '' : cls} ${estPoignee ? 'relative' : actif === id && !coul ? 'animate-glow ring-2 ring-mint ring-inset' : ''}`}
                  >
                    {estFormule ? <span className="font-mono text-[10px] leading-tight">{rendreFormule(cell.t)}</span> : cell.t || ''}
                    {estPoignee && (
                      <span className={`pointer-events-none absolute -bottom-2 -right-1 z-10 text-lg font-black leading-none text-navy-deep ${animePoignee ? 'animate-descend' : ''}`}>+</span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      {legende && (
        <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
          <span className="text-navy/40">↳</span>
          <span>{legende}</span>
        </p>
      )}
    </div>
  )
}

// Fenêtre Excel « Insérer une fonction » reproduite fidèlement.
function AssistantDialog({ v }) {
  const { recherche = '', placeholder = 'Tapez une brève description de ce que vous voulez faire, puis cliquez sur OK', categorie = 'Toutes', fonctions = [], selection = 0, signature, description, focus } = v
  return (
    <div className="mx-auto mt-3 max-w-md animate-fade-up overflow-hidden rounded-lg border border-navy/25 shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 text-[11px] font-semibold text-navy/80">
        <span>Insérer une fonction</span>
        <span className="text-navy/40">?&nbsp;&nbsp;✕</span>
      </div>
      <div className="space-y-2 bg-white p-3 text-[11px] text-navy">
        <p>Recherchez une fonction :</p>
        <div className={`flex gap-2 ${focus === 'recherche' ? 'rounded ring-2 ring-mint ring-offset-1' : ''}`}>
          <div className="flex-1 rounded-sm border border-navy/25 px-2 py-1">
            {recherche ? recherche : <span className="text-navy/35">{placeholder}</span>}
          </div>
          <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-2 py-1">Rechercher</span>
        </div>
        <div className={`flex items-center gap-2 ${focus === 'categorie' ? 'rounded ring-2 ring-mint ring-offset-1' : ''}`}>
          <span>Ou sélectionnez une catégorie :</span>
          <span className="flex flex-1 items-center justify-between rounded-sm border border-navy/25 px-2 py-1">{categorie}<span className="text-navy/40">▾</span></span>
        </div>
        <p>Sélectionnez une fonction :</p>
        <div className={`h-28 overflow-hidden rounded-sm border border-navy/25 ${focus === 'liste' ? 'ring-2 ring-mint' : ''}`}>
          {fonctions.map((f, i) => (
            <div key={i} className={`px-2 py-[3px] font-mono ${i === selection ? 'bg-[#0a63c9] text-white' : 'text-navy'}`}>{f}</div>
          ))}
        </div>
        {signature && <p className="font-semibold">{signature}</p>}
        {description && <p className="leading-snug text-navy/70">{description}</p>}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[#0a63c9] underline">Aide sur cette fonction</span>
          <span className="flex gap-2">
            <span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-5 py-0.5">OK</span>
            <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// Fenêtre « Arguments de la fonction ».
function ArgumentsDialog({ v }) {
  const { fonction, args = [], apercu, resultat, description, encadre } = v
  // Si la capture précise des arguments obligatoires, on les met en gras et les
  // facultatifs en normal (comme dans le vrai assistant). Sinon, rendu uniforme.
  const useGras = args.some((a) => a.obligatoire !== undefined)
  return (
    <div className="mx-auto mt-3 max-w-md animate-fade-up overflow-hidden rounded-lg border border-navy/25 shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 text-[11px] font-semibold text-navy/80">
        <span>Arguments de la fonction</span>
        <span className="text-navy/40">?&nbsp;&nbsp;✕</span>
      </div>
      <div className="space-y-2 bg-white p-3 text-[11px] text-navy">
        <p className="font-semibold">{fonction}</p>
        <div className="space-y-1">
          {args.map((a, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-16 text-right ${useGras ? (a.obligatoire ? 'font-bold text-navy' : 'font-normal text-navy/45') : 'font-semibold'}`}>{a.label}</span>
              <span className="flex items-center gap-2 rounded-sm border border-navy/25 px-2 py-0.5">
                <span className="min-w-[56px] font-mono">{a.ref}</span>
                <span className="text-navy/40">↑</span>
              </span>
              <span className={a.ref ? 'text-navy/55' : 'italic text-navy/35'}>= {a.valeur}</span>
            </div>
          ))}
        </div>
        <div className="relative rounded-md px-2 py-1.5">
          {apercu && <p className="text-navy/60">&nbsp;&nbsp;= {apercu}</p>}
          {description && <p className="leading-snug text-navy/70">{description}</p>}
          {resultat && <p className="font-semibold">Résultat = {resultat}</p>}
          {encadre && (
            <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
              <rect className="draw-rect" rx="6" pathLength="1" />
            </svg>
          )}
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[#0a63c9] underline">Aide sur cette fonction</span>
          <span className="flex gap-2">
            <span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-5 py-0.5">OK</span>
            <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// Liste déroulante d'autocomplétion quand on tape le début d'une fonction.
function AutoComplete({ v }) {
  const { saisie = '=', items = [], selection = 0, cellule = 'A1' } = v
  const col = (cellule.match(/[A-Z]+/) || ['A'])[0]
  const row = (cellule.match(/\d+/) || ['1'])[0]
  return (
    <div className="mx-auto mt-3 max-w-xs animate-fade-up text-[11px]">
      <div className="overflow-hidden rounded-t-md border border-navy/15 shadow-lg">
        <div className="grid" style={{ gridTemplateColumns: '24px 1fr' }}>
          <div className="bg-navy/10" />
          <div className="border-b border-l border-navy/10 bg-navy/10 py-1 text-center text-navy/50">{col}</div>
          <div className="bg-navy/10 py-1 text-center text-navy/50">{row}</div>
          <div className="border-b border-l border-navy/10 bg-white px-2 py-1 font-mono text-navy">{saisie}<span className="animate-pulse">|</span></div>
        </div>
      </div>
      <div className="ml-6 overflow-hidden rounded-b-md border border-t-0 border-navy/20 bg-white shadow-xl">
        {items.map((it, i) => (
          <div key={i}>
            <div className={`flex items-center gap-2 px-2 py-1 ${i === selection ? 'bg-[#cfe2ff]' : ''}`}>
              <span className="grid h-4 w-5 place-items-center rounded-sm bg-[#107c41] text-[8px] font-bold italic text-white">fx</span>
              <span className="font-mono text-navy">{it.nom}</span>
            </div>
            {i === selection && it.desc && (
              <div className="border-t border-navy/15 bg-[#fff8e1] px-2 py-1 text-[10px] leading-snug text-navy/70">{it.desc}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Photo du ruban Excel : onglets + groupe encadré et nommé (montre où se trouve un bouton).
function RubanImg({ v }) {
  const {
    onglets = ['Fichier', 'Accueil', 'Insertion', 'Mise en page', 'Formules', 'Données', 'Révision', 'Affichage'],
    actif = 'Formules',
    groupes = [
      { icone: 'fx', label: 'Insérer une\nfonction', actif: true },
      { icone: 'Σ', label: 'Somme\nautomatique' },
      { icone: '🕘', label: 'Récentes' },
      { icone: '💲', label: 'Financier' },
      { icone: '?', label: 'Logique' },
    ],
    groupeNom = 'Bibliothèque de fonctions',
    lanceur,
  } = v
  return (
    <div className="mx-auto max-w-md animate-fade-up overflow-hidden rounded-md border border-navy/15 text-[10px] shadow-lg">
      <div className="flex gap-0.5 bg-[#f3f3f3] px-2 pt-1">
        {onglets.map((o) => (
          <span key={o} className={`rounded-t px-2 py-1 ${o === actif ? 'bg-white font-bold text-[#0a7a3d]' : 'text-navy/55'}`}>{o}</span>
        ))}
      </div>
      <div className="flex items-start gap-2 bg-white px-2 py-2">
        {/* Le groupe est encadré et clairement nommé en dessous (ex. « Cellules »). */}
        <div className="rounded-md border border-navy/15 bg-navy/[0.02] px-1.5 pb-1 pt-1.5">
          <div className="flex items-end gap-1">
            {groupes.map((g, i) => (
              <div key={i} className={`flex w-16 flex-col items-center gap-1 rounded px-1 py-1 text-center ${g.actif ? 'bg-mint/15 ring-2 ring-mint' : 'opacity-60'}`}>
                <span className={`grid h-7 w-7 place-items-center rounded text-sm ${g.icone === 'fx' ? 'bg-[#107c41] font-bold italic text-white' : 'text-navy/70'}`}>{g.icone}</span>
                <span className="leading-tight text-navy/75">
                  {g.label.split('\n').map((l, j) => (
                    <span key={j} className="block">{l}</span>
                  ))}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-1 flex items-center justify-center gap-1 border-t border-navy/10 pt-0.5 text-[9px] font-semibold text-navy/60">
            <span>{groupeNom}</span>
            {lanceur && (
              <span className="grid h-3.5 w-3.5 animate-glow place-items-center rounded-sm leading-none text-navy ring-2 ring-mint" title="Lanceur de boîte de dialogue">↘</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Enveloppe : étapes (avec titre de méthode) au-dessus, puis la photo du ruban.
function Ruban({ v }) {
  return (
    <div className="mt-3 space-y-3">
      <EtapesListe titre={v.titre} items={v.etapes} />
      <RubanImg v={v} />
    </div>
  )
}

// Met en valeur le symbole $ dans une adresse de cellule.
function codeDollar(code) {
  return [...code].map((c, i) => (c === '$' ? <span key={i} className="font-bold text-mint">$</span> : <span key={i}>{c}</span>))
}

// Les 4 types de référence : relative, absolue, mixtes.
function Adresses({ v }) {
  const items = v.items || [
    { code: '$A$1', role: 'Absolue', detail: 'colonne et ligne figées' },
    { code: 'A$1', role: 'Mixte', detail: 'ligne figée' },
    { code: '$A1', role: 'Mixte', detail: 'colonne figée' },
    { code: 'A1', role: 'Relative', detail: 'rien de figé' },
  ]
  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {items.map((it, i) => (
        <div key={i} className="animate-fade-up rounded-xl border border-navy/10 bg-navy/5 p-3" style={{ animationDelay: `${i * 100}ms` }}>
          <p className="font-mono text-xl text-navy">{codeDollar(it.code)}</p>
          <p className="text-xs font-bold uppercase tracking-wide text-mint">{it.role}</p>
          <p className="text-[11px] text-navy/55">{it.detail}</p>
        </div>
      ))}
    </div>
  )
}

// Les différents curseurs d'Excel (sélection, poignée de recopie, déplacement), dessinés.
function Curseurs({ v }) {
  const SELECT = (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <path d="M10 2h4v6h6v4h-6v6h-4v-6H4V8h6z" fill="#ffffff" stroke="#0a335d" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
  const FILL = (
    <svg viewBox="0 0 24 24" className="h-6 w-6" stroke="#072545" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  )
  const MOVE = (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#0a335d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <polyline points="9 6 12 3 15 6" />
      <polyline points="9 18 12 21 15 18" />
      <polyline points="6 9 3 12 6 15" />
      <polyline points="18 9 21 12 18 15" />
    </svg>
  )
  const icone = { select: SELECT, fill: FILL, move: MOVE }
  const items = v.items || [
    { type: 'select', titre: 'Sélectionner', desc: 'La croix blanche épaisse : pour sélectionner des cellules.' },
    { type: 'fill', titre: 'Recopier', desc: 'La croix noire fine (+) : la poignée de recopie, pour recopier ou créer une série.' },
    { type: 'move', titre: 'Déplacer', desc: 'La flèche à 4 directions : pour déplacer une cellule.' },
  ]
  return (
    <div className="mt-3 space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex animate-fade-up items-center gap-3 rounded-xl border border-navy/10 bg-navy/5 p-3" style={{ animationDelay: `${i * 120}ms` }}>
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg border ${it.type === 'select' ? 'border-navy-deep bg-navy-deep' : 'border-navy/10 bg-white'}`}>{icone[it.type]}</span>
          <div className="min-w-0">
            <p className="font-bold text-navy">{it.titre}</p>
            <p className="text-xs leading-snug text-navy/60">{it.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Photo d'un menu / liste déroulante : options, certaines mises en avant.
function MenuImg({ v }) {
  const { items = [] } = v
  return (
    <div className="flex justify-center">
      <div className="w-64 overflow-hidden rounded-md border border-navy/20 bg-white py-1 text-xs shadow-xl">
        {items.map((it, i) =>
          it === '-' ? (
            <div key={i} className="my-1 border-t border-navy/10" />
          ) : (
            <div key={i} className={`flex items-center gap-2 px-3 py-1.5 ${it.actif ? 'bg-mint/20 font-semibold text-navy' : 'text-navy/80'}`}>
              <span className="w-4 text-center text-[13px]">{it.icone || ''}</span>
              <span>{it.label}</span>
            </div>
          )
        )}
      </div>
    </div>
  )
}

// Menu contextuel (clic droit) : titre de méthode + étapes, puis la photo du menu.
function MenuContextuel({ v }) {
  return (
    <div className="mt-3 space-y-3">
      <EtapesListe titre={v.titre} items={v.etapes} />
      <MenuImg v={v} />
    </div>
  )
}

// Glisser-déposer : on attrape le bord d'une cellule (curseur flèche) et on la déplace.
function Glisser() {
  const MOVE = (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#0a335d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <polyline points="9 6 12 3 15 6" />
      <polyline points="9 18 12 21 15 18" />
      <polyline points="6 9 3 12 6 15" />
      <polyline points="18 9 21 12 18 15" />
    </svg>
  )
  return (
    <div className="mt-3 flex justify-center py-2">
      <div className="relative h-16 w-56">
        <div className="absolute right-0 top-2 grid h-12 w-16 place-items-center rounded-sm border-2 border-dashed border-mint bg-mint/10 text-sm font-bold text-mint/60">30</div>
        <div className="animate-glisse absolute left-0 top-2 grid h-12 w-16 place-items-center rounded-sm border-2 border-navy bg-white text-sm font-bold text-navy shadow-md">
          30
          <span className="absolute -right-2.5 -top-2.5 rounded-full border border-navy/10 bg-white p-0.5 shadow">{MOVE}</span>
        </div>
      </div>
    </div>
  )
}

// Barre d'onglets de feuilles + menu « Déplacer ou copier » (pour copier vers une autre feuille).
function Onglets({ v }) {
  const { onglets = ['Feuil1', 'Feuil2', 'Feuil3'], actif = 'Feuil1' } = v
  return (
    <div className="mt-3">
      <div className="flex items-end gap-1 rounded-t-md border-t border-navy/15 bg-navy/5 px-2 pt-1 text-[11px]">
        {onglets.map((o) => (
          <span key={o} className={`rounded-t px-3 py-1 ${o === actif ? 'bg-white font-bold text-navy' : 'bg-navy/10 text-navy/55'}`}>{o}</span>
        ))}
        <span className="px-2 text-navy/40">＋</span>
      </div>
      <div className="ml-2 mt-1 w-56 overflow-hidden rounded-md border border-navy/20 bg-white py-1 text-xs shadow-xl">
        {['Insérer…', 'Supprimer', 'Renommer'].map((l) => (
          <div key={l} className="px-3 py-1.5 text-navy/80">{l}</div>
        ))}
        <div className="flex items-center gap-2 bg-mint/20 px-3 py-1.5 font-semibold text-navy">
          <span>📑</span>Déplacer ou copier…
        </div>
        <div className="my-1 border-t border-navy/10" />
        <div className="px-3 py-1.5 text-navy/70">☑ Créer une copie</div>
      </div>
    </div>
  )
}

// Le geste de saisie : on tape dans une cellule, puis Entrée.
function SaisieCell() {
  return (
    <div className="mt-3 flex flex-col items-center gap-3 py-2">
      <div className="overflow-hidden rounded-md border border-navy/15 shadow">
        <div className="grid" style={{ gridTemplateColumns: '28px 120px' }}>
          <div className="bg-navy/10" />
          <div className="border-b border-l border-navy/10 bg-navy/10 py-1 text-center text-xs text-navy/50">A</div>
          <div className="bg-navy/10 py-1 text-center text-xs text-navy/50">1</div>
          <div className="border-b border-l border-navy/10 px-2 py-2 text-sm text-navy ring-2 ring-mint ring-inset">Pomme<span className="animate-pulse">|</span></div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-navy/60">
        <span>puis</span>
        <span className="rounded border border-navy/20 bg-white px-2 py-1 font-semibold text-navy shadow-sm">Entrée ↵</span>
      </div>
    </div>
  )
}

// Boîte « Format de cellule » (les 6 onglets d'Excel), précédée des étapes écrites.
// Paramètres : actif (onglet surligné), categories + categorieActive + types + titreDroite
// (colonnes de l'onglet Nombre). Par défaut : onglet Nombre > catégorie Date (réutilisé du ch.2).
function FormatCellule({ v }) {
  const {
    etapes = [],
    actif = 'Nombre',
    categories = ['Standard', 'Nombre', 'Monétaire', 'Date', 'Heure', 'Pourcentage'],
    categorieActive = 'Date',
    titreDroite = 'Type :',
    types = ['14/03/2012', '14 mars 2012', 'mercredi 14 mars', '14-mars', '14-mars-12'],
  } = v
  const onglets = ['Nombre', 'Alignement', 'Police', 'Bordure', 'Remplissage', 'Protection']
  return (
    <div className="mt-3 space-y-3">
      {etapes.length > 0 && (
        <ol className="space-y-1.5">
          {etapes.map((e, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-navy/85">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint text-[11px] font-bold text-navy-deep">{i + 1}</span>
              <span>{gras(e)}</span>
            </li>
          ))}
        </ol>
      )}
      <div className="mx-auto max-w-sm overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
        <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80">
          <span>Format de cellule</span>
          <span className="text-navy/40">✕</span>
        </div>
        <div className="flex flex-wrap gap-1 border-b border-navy/15 bg-white px-2 pt-1 text-[10px]">
          {onglets.map((t) => (
            <span key={t} className={`rounded-t px-2 py-1 ${t === actif ? 'bg-white font-bold text-navy ring-1 ring-navy/15' : 'text-navy/50'}`}>{t}</span>
          ))}
        </div>
        {actif === 'Bordure' ? (
          <div className="grid grid-cols-2 gap-3 bg-white p-3">
            <div>
              <p className="mb-1 text-navy/60">Style du trait :</p>
              <div className="space-y-2 rounded-sm border border-navy/20 p-2">
                <div className="border-t border-navy/70" />
                <div className="border-t-2 border-navy/80" />
                <div className="border-t border-dashed border-navy/70" />
                <div className="border-t-2 border-double border-navy/80" />
              </div>
              <p className="mb-1 mt-2 text-navy/60">Couleur :</p>
              <span className="flex items-center justify-between rounded-sm border border-navy/25 px-2 py-1">
                <span className="h-3 w-8 rounded-sm bg-navy" />
                <span className="text-navy/40">▾</span>
              </span>
            </div>
            <div>
              <p className="mb-1 text-navy/60">Présélections :</p>
              <div className="flex gap-1.5">
                {['Aucune', 'Contour', 'Intérieur'].map((p, i) => (
                  <span key={p} className={`flex flex-col items-center gap-1 rounded-sm border px-1.5 py-1 text-[8px] ${i === 1 ? 'border-mint bg-mint/15 text-navy' : 'border-navy/20 text-navy/55'}`}>
                    <span className="h-4 w-4 border border-navy/50" />
                    {p}
                  </span>
                ))}
              </div>
              <p className="mb-1 mt-3 text-navy/60">Aperçu :</p>
              <div className="mx-auto grid h-12 w-20 place-items-center border-2 border-navy/70 text-[9px] text-navy/40">Texte</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 bg-white p-3">
            <div>
              <p className="mb-1 text-navy/60">Catégorie :</p>
              <div className="h-24 overflow-hidden rounded-sm border border-navy/20">
                {categories.map((c) => (
                  <div key={c} className={`px-2 py-0.5 ${c === categorieActive ? 'bg-[#0a63c9] text-white' : 'text-navy'}`}>{c}</div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1 text-navy/60">{titreDroite}</p>
              <div className="h-24 overflow-hidden rounded-sm border border-navy/20">
                {types.map((c, i) => (
                  <div key={c} className={`px-2 py-0.5 ${i === 0 ? 'bg-[#0a63c9] text-white' : 'text-navy'}`}>{c}</div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 bg-white px-3 pb-2">
          <span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-4 py-0.5">OK</span>
          <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span>
        </div>
      </div>
    </div>
  )
}

// La barre de formule avec la croix (annuler) et la coche (valider).
function BarreFormule() {
  return (
    <div className="mt-3">
      <div className="overflow-hidden rounded-md border border-navy/15 bg-white shadow">
        <div className="flex items-stretch text-xs">
          <div className="flex w-14 items-center justify-center border-r border-navy/10 bg-navy/5 py-1.5 text-navy/70">A2</div>
          <div className="flex items-center gap-2 border-r border-navy/10 px-2">
            <span className="grid h-5 w-5 place-items-center rounded-sm bg-red-500/15 text-xs font-bold text-red-600 ring-2 ring-red-400">✕</span>
            <span className="text-sm text-mint">✓</span>
            <span className="text-sm italic text-navy/50">fx</span>
          </div>
          <div className="flex-1 px-2 py-1.5 font-mono text-navy">Pomm<span className="animate-pulse">|</span></div>
        </div>
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳</span>
        <span>La croix rouge ✕ (ou la touche Échap) annule ta saisie en cours. La coche verte ✓ la valide.</span>
      </p>
    </div>
  )
}

// La barre de formule avec le bouton fx (Insérer une fonction) surligné.
// Sert pour « clique sur le bouton fx dans la barre de formule ».
function BarreFx({ v }) {
  const { cellule = 'B2', formule = '' } = v
  return (
    <div className="mt-3">
      <div className="overflow-hidden rounded-md border border-navy/15 bg-white shadow">
        <div className="flex items-stretch text-xs">
          <div className="flex w-14 items-center justify-center border-r border-navy/10 bg-navy/5 py-1.5 text-navy/70">{cellule}</div>
          <div className="flex items-center gap-2 border-r border-navy/10 px-2">
            <span className="text-navy/30">✕</span>
            <span className="text-navy/30">✓</span>
            <span className="grid place-items-center rounded-sm bg-mint/15 px-1.5 py-0.5 text-sm italic text-mint ring-2 ring-mint">fx</span>
          </div>
          <div className="flex-1 px-2 py-1.5 font-mono text-navy">{formule ? coloreFormule(formule) : <span className="text-navy/25">|</span>}</div>
        </div>
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳</span>
        <span>
          Le bouton <strong className="font-bold text-navy">fx</strong> (Insérer une fonction), juste à gauche de la barre de formule, ouvre l'assistant.
        </span>
      </p>
    </div>
  )
}

// La « Zone Nom » : la boîte à gauche de la barre de formule, où s'affiche / s'écrit
// le nom d'une cellule. Sert pour la leçon « Utiliser les noms dans les formules ».
function ZoneNom({ v }) {
  const { nom = 'Nom', saisie = false, fleche = false, formule = '', liste = [], legende } = v
  return (
    <div className="mt-3">
      <div className="overflow-hidden rounded-md border border-navy/15 bg-white shadow">
        <div className="flex items-stretch text-xs">
          {/* La Zone Nom, surlignée pour bien la repérer */}
          <div className="relative flex w-28 shrink-0 items-center justify-between gap-1 border-r border-navy/10 bg-mint/15 px-2 py-1.5 ring-2 ring-mint ring-inset">
            <span className="truncate font-mono text-navy">
              {nom}
              {saisie && <span className="animate-pulse">|</span>}
            </span>
            {fleche && <span className="text-navy/40">▾</span>}
          </div>
          <div className="flex items-center gap-2 border-r border-navy/10 px-2 text-navy/50">
            <span className="text-sm italic">fx</span>
          </div>
          <div className="flex-1 px-2 py-1.5 font-mono text-navy">
            {formule ? coloreFormule(formule) : <span className="text-navy/25">|</span>}
          </div>
        </div>
        {/* Liste déroulante des noms (navigation), si fournie */}
        {liste.length > 0 && (
          <div className="border-t border-navy/10 bg-white text-[11px]">
            {liste.map((n, i) => (
              <div key={i} className={`px-3 py-1 font-mono ${i === 0 ? 'bg-[#0a63c9] text-white' : 'text-navy/80'}`}>{n}</div>
            ))}
          </div>
        )}
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳</span>
        <span>
          La <strong className="font-bold text-navy">Zone Nom</strong>, à gauche de la barre de formule : c'est là que tu lis ou que tu écris le nom d'une cellule.
        </span>
      </p>
      {legende && (
        <p className="mt-1 flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
          <span className="text-navy/40">↳</span>
          <span>{legende}</span>
        </p>
      )}
    </div>
  )
}

// Recopie animée : la poignée descend UNE fois, et chaque formule s'affiche au passage.
function RecopieAnim() {
  const [rev, setRev] = useState(0)
  useEffect(() => {
    const t1 = setTimeout(() => setRev(1), 800)
    const t2 = setTimeout(() => setRev(2), 1550)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])
  const lignes = [
    { p: 'Clavier', prix: '30', qte: '2', f: '=B2*C2' },
    { p: 'Souris', prix: '20', qte: '3', f: '=B3*C3' },
    { p: 'Écran', prix: '150', qte: '1', f: '=B4*C4' },
  ]
  return (
    <div className="mt-3">
      <div className="animate-fade-up overflow-hidden rounded-xl border border-navy/10 bg-white shadow-lg">
        <div className="flex items-center gap-2 border-b border-navy/10 bg-navy/5 px-3 py-1.5 text-xs">
          <span className="font-bold text-navy/50">fx</span>
          <span className="font-mono text-navy/90">{coloreFormule('=B2*C2')}</span>
        </div>
        <div className="grid text-xs" style={{ gridTemplateColumns: '28px repeat(5, 1fr)' }}>
          <div className="bg-navy/5" />
          {['A', 'B', 'C', 'D', 'E'].map((c) => (
            <div key={c} className="border-b border-l border-navy/10 bg-navy/10 py-1 text-center text-navy/50">{c}</div>
          ))}
          <div className="border-b border-navy/10 bg-navy/10 py-1 text-center text-navy/50">1</div>
          {['Produit', 'Prix', 'Qté', 'Total', ''].map((h, i) => (
            <div key={i} className="border-b border-l border-navy/10 bg-navy/10 px-2 py-1 font-bold text-navy/70">{h}</div>
          ))}
          {lignes.map((d, idx) => {
            const r = idx + 2
            const visible = idx === 0 || rev >= idx
            return (
              <div key={r} className="contents">
                <div className="border-b border-navy/10 bg-navy/10 py-1 text-center text-navy/50">{r}</div>
                <div className="border-b border-l border-navy/10 px-2 py-1 text-navy/90">{d.p}</div>
                <div className="border-b border-l border-navy/10 px-2 py-1 text-navy/90">{d.prix}</div>
                <div className="border-b border-l border-navy/10 px-2 py-1 text-navy/90">{d.qte}</div>
                <div className="relative border-b border-l border-navy/10 px-2 py-1">
                  {visible && <span className="font-mono text-[10px] leading-tight">{coloreFormule(d.f)}</span>}
                  {idx === 0 && (
                    <span className="animate-descendonce pointer-events-none absolute -bottom-2 -right-1 z-10 text-lg font-black leading-none text-navy-deep">+</span>
                  )}
                </div>
                <div className="border-b border-l border-navy/10" />
              </div>
            )
          })}
        </div>
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳</span>
        <span>La poignée descend une fois, et la formule s'affiche sur chaque ligne à son passage.</span>
      </p>
    </div>
  )
}

// Options de recopie des séries : la balise bleue + son menu (jours ouvrés, mois, années).
function SeriesOptions({ v }) {
  const { etapes = [] } = v
  const options = [
    'Copier les cellules',
    'Incrémenter une série',
    'Incrémenter les jours ouvrés',
    'Incrémenter les mois',
    'Incrémenter les années',
  ]
  const sel = 1
  return (
    <div className="mt-3 space-y-3">
      {etapes.length > 0 && (
        <ol className="space-y-1.5">
          {etapes.map((e, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-navy/85">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint text-[11px] font-bold text-navy-deep">{i + 1}</span>
              <span>{e}</span>
            </li>
          ))}
        </ol>
      )}
      <div className="flex flex-col items-center gap-1">
        <div className="relative overflow-hidden rounded-md border border-navy/15 shadow">
          <div className="grid text-[10px]" style={{ gridTemplateColumns: '24px repeat(3, 78px)' }}>
            <div className="bg-navy/10" />
            {['A', 'B', 'C'].map((c) => (
              <div key={c} className="border-b border-l border-navy/10 bg-navy/10 py-1 text-center text-navy/50">{c}</div>
            ))}
            <div className="bg-navy/10 py-1 text-center text-navy/50">1</div>
            <div className="border-b border-l border-navy/10 px-1.5 py-1 text-navy/90">01/05/2025</div>
            <div className="border-b border-l border-navy/10 bg-mint/30 px-1.5 py-1 font-semibold text-navy">02/05/2025</div>
            <div className="border-b border-l border-navy/10 bg-mint/30 px-1.5 py-1 font-semibold text-navy">03/05/2025</div>
          </div>
          <span className="absolute -bottom-2.5 right-0 flex items-center gap-0.5 rounded-sm border border-navy/25 bg-white px-1 py-0.5 shadow">
            <svg width="11" height="11" viewBox="0 0 12 12">
              <rect x="1" y="1" width="10" height="10" rx="1" fill="none" stroke="#0a335d" strokeWidth="1" />
              <rect x="1.5" y="6.5" width="9" height="4.5" fill="#0a335d" opacity="0.45" />
            </svg>
            <span className="text-[8px] leading-none text-navy/60">▾</span>
          </span>
        </div>
        <span className="text-[10px] text-navy/45">↑ la balise « Options de recopie »</span>
        <div className="mt-1 w-64 overflow-hidden rounded-md border border-navy/20 bg-white py-1 text-xs shadow-xl">
          {options.map((o, i) => (
            <div key={i} className={`flex items-center gap-2 px-3 py-1.5 ${i === sel ? 'font-semibold text-navy' : 'text-navy/80'}`}>
              <span className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border ${i === sel ? 'border-mint' : 'border-navy/30'}`}>
                {i === sel && <span className="h-1.5 w-1.5 rounded-full bg-mint" />}
              </span>
              <span>{o}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Collage spécial : les étapes + les options de collage (Valeurs, Formules, Transposer...).
function CollageSpecial({ v }) {
  const { etapes = [] } = v
  const opts = [
    { icone: '📋', label: 'Coller' },
    { icone: '123', label: 'Valeurs', actif: true },
    { icone: 'ƒx', label: 'Formules' },
    { icone: '🎨', label: 'Format' },
    { icone: '⇅', label: 'Transposer' },
  ]
  return (
    <div className="mt-3 space-y-3">
      {etapes.length > 0 && (
        <ol className="space-y-1.5">
          {etapes.map((e, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-navy/85">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint text-[11px] font-bold text-navy-deep">{i + 1}</span>
              <span>{e}</span>
            </li>
          ))}
        </ol>
      )}
      <div className="flex justify-center">
        <div className="rounded-md border border-navy/20 bg-white p-2 shadow-xl">
          <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wide text-navy/50">Options de collage</p>
          <div className="flex gap-1.5">
            {opts.map((o, i) => (
              <div key={i} className={`flex w-[58px] flex-col items-center gap-1 rounded p-1.5 text-center ${o.actif ? 'bg-mint/20 ring-1 ring-mint' : 'bg-navy/5'}`}>
                <span className="grid h-7 w-7 place-items-center rounded bg-white text-xs font-bold text-navy/80 shadow-sm">{o.icone}</span>
                <span className="text-[9px] leading-tight text-navy/70">{o.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Transposer : une ligne devient une colonne.
function Transposer() {
  const mois = ['Jan', 'Fév', 'Mar']
  return (
    <div className="mt-3 flex items-center justify-center gap-3 py-2 text-[11px]">
      <div className="overflow-hidden rounded-md border border-navy/15 shadow">
        <div className="flex">
          {mois.map((m, i) => (
            <div key={m} className={`bg-white px-3 py-2 font-semibold text-navy ${i ? 'border-l border-navy/10' : ''}`}>{m}</div>
          ))}
        </div>
      </div>
      <span className="text-xl font-bold text-mint">⇄</span>
      <div className="overflow-hidden rounded-md border border-navy/15 shadow">
        {mois.map((m, i) => (
          <div key={m} className={`bg-mint/15 px-4 py-1.5 font-semibold text-navy ${i ? 'border-t border-navy/10' : ''}`}>{m}</div>
        ))}
      </div>
    </div>
  )
}

// Montre visuellement ce que chaque type de référence fige (colonne, ligne, les deux, rien).
function RefFiger() {
  const types = [
    { code: '$A$1', col: true, row: true, label: 'La colonne A ET la ligne 1 restent fixes.' },
    { code: 'A$1', col: false, row: true, label: 'La ligne 1 reste fixe (la colonne peut changer).' },
    { code: '$A1', col: true, row: false, label: 'La colonne A reste fixe (la ligne peut changer).' },
    { code: 'A1', col: false, row: false, label: 'Tout s\'adapte quand on recopie.' },
  ]
  const cols = ['A', 'B', 'C']
  const rows = [1, 2, 3]
  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      {types.map((t, i) => (
        <div key={i} className="animate-fade-up rounded-xl border border-navy/10 bg-navy/5 p-3" style={{ animationDelay: `${i * 100}ms` }}>
          <p className="mb-2 font-mono text-lg leading-none text-navy">{codeDollar(t.code)}</p>
          <div className="inline-block overflow-hidden rounded border border-navy/15 bg-white">
            <div className="grid" style={{ gridTemplateColumns: '16px repeat(3, 20px)' }}>
              <div className="bg-navy/10" />
              {cols.map((c) => (
                <div key={c} className={`border-b border-l border-navy/10 text-center text-[9px] leading-[18px] ${t.col && c === 'A' ? 'bg-mint/60 font-bold text-navy' : 'bg-navy/10 text-navy/45'}`}>{c}</div>
              ))}
              {rows.map((r) => (
                <div key={r} className="contents">
                  <div className={`text-center text-[9px] leading-[18px] ${t.row && r === 1 ? 'bg-mint/60 font-bold text-navy' : 'bg-navy/10 text-navy/45'}`}>{r}</div>
                  {cols.map((c) => {
                    const fige = (t.col && c === 'A') || (t.row && r === 1)
                    return <div key={c} className={`h-[18px] border-b border-l border-navy/10 ${fige ? 'bg-mint/25' : ''}`} />
                  })}
                </div>
              ))}
            </div>
          </div>
          <p className="mt-2 text-[11px] leading-snug text-navy/65">{t.label}</p>
        </div>
      ))}
    </div>
  )
}

// Bordures + couleur de fond + couleur de texte : un tableau « avant / après »,
// et le petit menu déroulant « Bordures » d'Excel.
function BorduresFond({ v }) {
  const { menu, avantSelection, apres = 'complet' } = v
  const lignes = [
    ['Produit', 'Prix'],
    ['Clavier', '30 €'],
    ['Souris', '20 €'],
  ]
  const GrilleIcone = ({ pleine }) => (
    <svg width="14" height="14" viewBox="0 0 14 14" className="shrink-0">
      <rect x="1" y="1" width="12" height="12" fill="none" stroke="#0a335d" strokeWidth="1" />
      {pleine && (
        <g stroke="#0a335d" strokeWidth="0.8">
          <line x1="1" y1="7" x2="13" y2="7" />
          <line x1="7" y1="1" x2="7" y2="13" />
        </g>
      )}
    </svg>
  )
  return (
    <div className="mt-3 space-y-3">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Avant : tableau brut, ou plage sélectionnée (avantSelection) */}
        <div>
          <p className="mb-1 text-center text-[10px] font-bold uppercase tracking-wide text-navy/40">Avant</p>
          <div className="overflow-hidden rounded-sm border border-dashed border-navy/20 text-[11px]">
            {lignes.map((r, i) => (
              <div key={i} className="flex">
                {r.map((c, j) => (
                  <div key={j} className={`w-20 px-2 py-1 text-navy/70 ${avantSelection && i === 0 ? 'bg-[#cfe2ff] ring-1 ring-inset ring-[#0a63c9]/60' : ''}`}>{c}</div>
                ))}
              </div>
            ))}
          </div>
          {avantSelection && <p className="mt-1 text-center text-[9px] text-navy/45">↑ on sélectionne d'abord</p>}
        </div>
        <span className="text-xl font-bold text-mint">→</span>
        {/* Après : bordures complètes, ou juste le fond (apres='fond') */}
        <div>
          <p className="mb-1 text-center text-[10px] font-bold uppercase tracking-wide text-mint">Après</p>
          <div className={`overflow-hidden rounded-sm text-[11px] shadow ${apres === 'fond' ? 'border border-navy/15' : 'border border-navy/60'}`}>
            {lignes.map((r, i) => (
              <div key={i} className="flex">
                {r.map((c, j) =>
                  apres === 'fond' ? (
                    <div key={j} className={`w-20 px-2 py-1 ${i === 0 ? 'bg-amber-300/80 font-bold text-navy' : 'text-navy/80'}`}>{c}</div>
                  ) : (
                    <div key={j} className={`w-20 border-navy/60 px-2 py-1 ${j ? 'border-l' : ''} ${i ? 'border-t' : ''} ${i === 0 ? 'bg-navy font-bold text-cream' : j === 1 ? 'font-semibold text-mint' : 'text-navy/90'}`}>{c}</div>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {menu && (
        <div className="flex flex-col items-center">
          <div className="w-56 overflow-hidden rounded-md border border-navy/20 bg-white py-1 text-xs shadow-xl">
            <p className="px-3 pb-1 pt-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy/40">Bordures</p>
            {[
              ['Bordure inférieure', false],
              ['Toutes les bordures', true],
              ['Bordures extérieures', false],
              ['Aucune bordure', false],
            ].map(([label, actif], i) => (
              <div key={i} className={`flex items-center gap-2 px-3 py-1.5 ${actif ? 'bg-mint/20 font-semibold text-navy' : 'text-navy/80'}`}>
                <GrilleIcone pleine={actif} />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <span className="mt-1 text-[10px] text-navy/45">↑ le menu déroulant du bouton « Bordures »</span>
        </div>
      )}
    </div>
  )
}

// Format des nombres : la même valeur affichée selon le bouton choisi (€, %, séparateur, décimale).
function FormatNombre() {
  const lignes = [
    { bouton: 'Monétaire', icone: '€', avant: '1234,5', apres: '1 234,50 €' },
    { bouton: 'Pourcentage', icone: '%', avant: '0,75', apres: '75 %' },
    { bouton: 'Séparateur de milliers', icone: '000', avant: '1234567', apres: '1 234 567' },
    { bouton: 'Ajouter une décimale', icone: ',0', avant: '12,5', apres: '12,50' },
  ]
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-navy/10 bg-white shadow-lg">
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 text-[11px]">
        <div className="border-b border-navy/10 bg-navy/5 px-3 py-1.5 font-bold text-navy/60">Bouton</div>
        <div className="border-b border-navy/10 bg-navy/5 px-3 py-1.5 text-right font-bold text-navy/60">Avant</div>
        <div className="border-b border-navy/10 bg-navy/5 px-3 py-1.5 text-right font-bold text-navy/60">Après</div>
        {lignes.map((l, i) => (
          <div key={i} className="contents">
            <div className="flex items-center gap-2 border-b border-navy/5 px-3 py-2">
              <span className="grid h-6 min-w-[26px] place-items-center rounded border border-navy/15 bg-navy/5 px-1 text-xs font-bold text-navy/70">{l.icone}</span>
              <span className="text-navy/80">{l.bouton}</span>
            </div>
            <div className="border-b border-navy/5 px-3 py-2 text-right font-mono text-navy/50">{l.avant}</div>
            <div className="border-b border-navy/5 px-3 py-2 text-right font-mono font-bold text-mint">{l.apres}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Le pinceau (reproduire la mise en forme), ANIMÉ : la cellule « Sous-total » part
// sans mise en forme, puis prend le style de la cellule modèle (sous les yeux de l'élève).
function Pinceau() {
  const [peint, setPeint] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setPeint(true), 1100)
    return () => clearTimeout(t)
  }, [])
  const base = 'grid h-12 w-24 place-items-center rounded-sm border text-sm font-bold transition-all duration-700'
  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center justify-center gap-3 py-2">
        <div className="flex flex-col items-center gap-1">
          <div className={`${base} border-navy bg-navy text-cream`}>Total</div>
          <span className="text-[10px] text-navy/50">1. La cellule modèle</span>
        </div>
        <div className="flex flex-col items-center text-mint">
          <span className={`text-2xl ${peint ? '' : 'animate-bounce'}`}>🖌️</span>
          <span className="text-[10px] font-bold">{peint ? '✓ style copié' : '→ on copie le style'}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className={`${base} ${peint ? 'border-navy bg-navy text-cream' : 'border-navy/20 bg-white text-navy/80'}`}>Sous-total</div>
          <span className="text-[10px] text-navy/50">2. La cellule {peint ? 'repeinte' : 'à repeindre'}</span>
        </div>
      </div>
      <p className="mx-auto mt-2 max-w-xs text-center text-[11px] leading-snug text-navy/55">
        La cellule « Sous-total » prend la même mise en forme que la cellule modèle.
      </p>
    </div>
  )
}

// Galerie « Styles de cellule » : des mises en forme prêtes à l'emploi.
function Styles() {
  const items = [
    { label: 'Normal', cls: 'bg-white text-navy/80 border-navy/15' },
    { label: 'Satisfaisant', cls: 'bg-[#c6efce] text-[#0a7a3d] border-[#0a7a3d]/30' },
    { label: 'Neutre', cls: 'bg-[#ffeb9c] text-[#9c6500] border-[#9c6500]/30' },
    { label: 'Insatisfaisant', cls: 'bg-[#ffc7ce] text-[#9c0006] border-[#9c0006]/30' },
    { label: 'Titre', cls: 'bg-white text-navy font-display text-base border-navy/15' },
    { label: 'Total', cls: 'bg-white text-navy border-y-2 border-navy' },
  ]
  return (
    <div className="mt-3 grid grid-cols-3 gap-2">
      {items.map((it, i) => (
        <div
          key={i}
          className={`grid h-12 animate-fade-up place-items-center rounded-md border px-2 text-center text-xs font-bold shadow-sm ${it.cls}`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {it.label}
        </div>
      ))}
    </div>
  )
}

// Aperçu d'une page d'impression : marges, zones en-tête/pied, orientation portrait/paysage.
function ApercuImpression({ v }) {
  const { orientation = 'portrait', zones, legende, bureau } = v
  const paysage = orientation === 'paysage'
  // Mode « bureau » : fenêtre Excel en paysage (mode Page), avec les zones en-tête/pied.
  if (bureau) {
    return (
      <div className="mt-3 flex flex-col items-center gap-2">
        <div className="w-full max-w-md overflow-hidden rounded-md border border-navy/20 shadow-lg">
          <div className="flex items-center bg-[#1f7a4d] px-2 py-1 text-[10px] text-white">
            <span className="font-semibold">Classeur1 — Excel</span>
            <span className="ml-auto opacity-80">—&nbsp;&nbsp;▢&nbsp;&nbsp;✕</span>
          </div>
          <div className="bg-[#eceae3] p-2">
            <div className="flex text-[8px] text-navy/45">
              <div className="w-4" />
              {['A', 'B', 'C', 'D', 'E'].map((c) => (
                <div key={c} className="flex-1 border-l border-navy/15 bg-navy/10 text-center">{c}</div>
              ))}
            </div>
            <div className="mt-1 bg-white p-2 shadow-inner">
              <div className="rounded-sm bg-mint/25 py-1 text-center text-[9px] font-bold text-mint ring-1 ring-mint">EN-TÊTE</div>
              <div className="my-1 text-[8px]">
                {['Produit  Prix  Qté', 'Clavier  30   2', 'Souris   20   3', 'Écran    150  1'].map((r, i) => (
                  <div key={i} className={`border-b border-navy/10 px-1 py-0.5 ${i === 0 ? 'bg-navy/10 font-bold text-navy/70' : 'text-navy/60'}`}>
                    <span className="whitespace-pre">{r}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-sm bg-mint/25 py-1 text-center text-[9px] font-bold text-mint ring-1 ring-mint">PIED DE PAGE</div>
            </div>
          </div>
        </div>
        {legende && (
          <p className="flex max-w-md items-start gap-1.5 text-[11px] leading-snug text-navy/60">
            <span className="text-navy/40">↳</span>
            <span>{legende}</span>
          </p>
        )}
      </div>
    )
  }
  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div
        className="relative bg-white p-3 shadow-xl ring-1 ring-navy/15"
        style={{ width: paysage ? 260 : 190, height: paysage ? 190 : 260 }}
      >
        {/* marges */}
        <div className="absolute inset-2 border border-dashed border-navy/25" />
        <div className="relative flex h-full flex-col">
          <div className={`mb-2 rounded-sm py-1 text-center text-[9px] ${zones ? 'bg-mint/25 font-bold text-mint ring-1 ring-mint' : 'text-navy/40'}`}>
            {zones ? 'EN-TÊTE' : 'Mon entreprise'}
          </div>
          <div className="flex-1 overflow-hidden text-[8px]">
            {['Produit  Prix  Qté', 'Clavier  30   2', 'Souris   20   3', 'Écran    150  1'].map((r, i) => (
              <div key={i} className={`flex justify-between border-b border-navy/10 px-1 py-0.5 ${i === 0 ? 'bg-navy/10 font-bold text-navy/70' : 'text-navy/60'}`}>
                <span className="whitespace-pre">{r}</span>
              </div>
            ))}
          </div>
          <div className={`mt-2 rounded-sm py-1 text-center text-[9px] ${zones ? 'bg-mint/25 font-bold text-mint ring-1 ring-mint' : 'text-navy/40'}`}>
            {zones ? 'PIED DE PAGE' : 'Page 1'}
          </div>
        </div>
      </div>
      <span className="rounded-full bg-navy/5 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy/55">
        {paysage ? 'Paysage' : 'Portrait'}
      </span>
      {legende && (
        <p className="flex max-w-xs items-start gap-1.5 text-[11px] leading-snug text-navy/60">
          <span className="text-navy/40">↳</span>
          <span>{legende}</span>
        </p>
      )}
    </div>
  )
}

// Éditeur « Personnaliser l'en-tête / pied de page » : barre d'insertion + 3 zones.
function EntetePerso() {
  const outils = [
    { i: 'A', t: 'Police' },
    { i: '#', t: 'Numéro de page' },
    { i: '##', t: 'Nombre de pages' },
    { i: '📅', t: 'Date' },
    { i: '🕐', t: 'Heure' },
    { i: '🖼', t: 'Image' },
  ]
  const zones = [
    { t: 'Partie gauche', c: '' },
    { t: 'Partie centrale', c: 'Mon entreprise' },
    { t: 'Partie droite', c: 'Page &[Page]' },
  ]
  return (
    <div className="mx-auto mt-3 max-w-sm overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80">
        <span>En-tête</span>
        <span className="text-navy/40">✕</span>
      </div>
      <div className="space-y-2 bg-white p-3">
        <p className="text-navy/60">Insère ce que tu veux :</p>
        <div className="flex flex-wrap gap-1">
          {outils.map((o, i) => (
            <span key={i} className="grid h-7 min-w-[28px] place-items-center rounded border border-navy/15 bg-navy/5 px-1 text-xs font-bold text-navy/70" title={o.t}>{o.i}</span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {zones.map((z, i) => (
            <div key={i}>
              <p className="mb-0.5 text-[9px] text-navy/45">{z.t}</p>
              <div className="grid h-12 place-items-center rounded-sm border border-navy/20 px-1 text-center text-[9px] text-navy/80">{z.c}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 bg-white px-3 pb-2">
        <span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-4 py-0.5">OK</span>
        <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span>
      </div>
    </div>
  )
}

// Écran « Fichier > Imprimer » : réglages à gauche, aperçu de la page à droite.
function ImpressionApercu() {
  const reglages = [
    ['Imprimer', 'Feuilles actives ▾'],
    ['Orientation', 'Portrait ▾'],
    ['Format', 'A4 ▾'],
    ['Mise à l\'échelle', 'Aucune ▾'],
  ]
  return (
    <div className="mx-auto mt-3 max-w-md overflow-hidden rounded-lg border border-navy/20 shadow-xl">
      <div className="bg-[#1f7a4d] px-3 py-1.5 text-[11px] font-semibold text-white">Fichier ▸ Imprimer</div>
      <div className="flex gap-2 bg-white p-2 text-[10px]">
        <div className="w-1/2 space-y-1.5">
          <span className="block rounded bg-[#0a63c9] py-1 text-center font-bold text-white">🖨 Imprimer</span>
          <div className="flex items-center justify-between">
            <span className="text-navy/50">Copies :</span>
            <span className="rounded border border-navy/25 px-2">1</span>
          </div>
          <div>
            <p className="text-navy/45">Imprimante</p>
            <div className="rounded-sm border border-navy/25 px-2 py-0.5 text-navy/80">HP DeskJet ▾</div>
          </div>
          {reglages.map(([l, val], i) => (
            <div key={i}>
              <p className="text-navy/45">{l}</p>
              <div className="rounded-sm border border-navy/25 px-2 py-0.5 text-navy/80">{val}</div>
            </div>
          ))}
        </div>
        <div className="w-1/2">
          <p className="mb-1 text-center text-navy/45">Aperçu</p>
          <div className="mx-auto bg-white p-1.5 shadow ring-1 ring-navy/15">
            <div className="border border-dashed border-navy/20 p-1.5 text-[7px] leading-tight">
              <div className="mb-1 text-center font-semibold text-navy/50">Mon entreprise</div>
              {['Produit   Prix', 'Clavier   30 €', 'Souris    20 €', 'Écran     150 €'].map((r, i) => (
                <div key={i} className={`border-b border-navy/10 ${i === 0 ? 'font-bold text-navy/60' : 'text-navy/50'}`}>
                  <span className="whitespace-pre">{r}</span>
                </div>
              ))}
              <div className="mt-2 text-center text-navy/40">Page 1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Boîte « Style » (Nouveau style de cellule) : champ pour nommer le style + Format.
function StyleNom() {
  const props = [
    ['Nombre', 'Standard'],
    ['Alignement', 'Général'],
    ['Police', 'Calibri 11'],
    ['Bordure', 'Aucune'],
    ['Remplissage', 'Aucun'],
  ]
  return (
    <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80">
        <span>Style</span>
        <span className="text-navy/40">✕</span>
      </div>
      <div className="space-y-2 bg-white p-3">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-navy/60">Nom du style :</span>
          <span className="flex-1 rounded-sm border border-navy/30 px-2 py-1 text-navy ring-1 ring-mint">Mon style devis<span className="animate-pulse">|</span></span>
        </div>
        <div className="rounded-sm border border-navy/15 p-2">
          <p className="mb-1 text-[10px] uppercase tracking-wide text-navy/45">Le style inclut</p>
          {props.map(([k, val], i) => (
            <div key={i} className="flex justify-between text-[10px] text-navy/70">
              <span>☑ {k}</span>
              <span className="text-navy/40">{val}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-0.5">
          <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Format…</span>
          <span className="flex gap-2">
            <span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-4 py-0.5">OK</span>
            <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// Galerie de thèmes de document proposés (palette de couleurs + police).
function Themes() {
  const themes = [
    { nom: 'Office', c: ['#0a335d', '#41c1ba', '#d97706', '#8b5cf6'] },
    { nom: 'Berlin', c: ['#1f7a4d', '#e0c200', '#c0504d', '#4f81bd'] },
    { nom: 'Vue', c: ['#8b5cf6', '#41c1ba', '#f59e0b', '#ef4444'] },
    { nom: 'Ion', c: ['#b91c1c', '#f59e0b', '#0a335d', '#1f9d57'] },
  ]
  return (
    <div className="mt-3">
      <div className="grid grid-cols-4 gap-2">
        {themes.map((t, i) => (
          <div key={i} className="animate-fade-up overflow-hidden rounded-lg border border-navy/15 bg-white shadow-sm" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex">
              {t.c.map((c, j) => (
                <span key={j} className="h-5 flex-1" style={{ background: c }} />
              ))}
            </div>
            <p className="text-center font-display text-base leading-tight text-navy">Aa</p>
            <p className="pb-1 text-center text-[9px] text-navy/55">{t.nom}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-[11px] text-navy/55">Survole un thème pour le prévisualiser, clique pour l'appliquer.</p>
    </div>
  )
}

// Petite boîte de dialogue avec des champs (ex. « Imprimer les titres », « Mise à l'échelle »).
function Champs({ v }) {
  const { titre, champs = [] } = v
  return (
    <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      {titre && (
        <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80">
          <span>{titre}</span>
          <span className="text-navy/40">✕</span>
        </div>
      )}
      <div className="space-y-2 bg-white p-3">
        {champs.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="shrink-0 text-navy/60">{c.l} :</span>
            <span className={`flex-1 rounded-sm border px-2 py-1 text-navy ${c.actif ? 'border-navy/30 ring-1 ring-mint' : 'border-navy/20'}`}>{c.v || ' '}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 bg-white px-3 pb-2">
        <span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-4 py-0.5">OK</span>
        <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span>
      </div>
    </div>
  )
}

// Double-clic interactif : l'élève double-clique LUI-MÊME le bord droit de l'en-tête B,
// et la colonne s'ajuste au contenu le plus long. Curseur double-flèche ↔.
function DoubleClic({ onResolu }) {
  const [ajuste, setAjuste] = useState(false)
  const faire = () => {
    if (!ajuste) {
      setAjuste(true)
      onResolu && onResolu()
    }
  }
  const largeurB = ajuste ? 150 : 54
  const lignes = [
    ['Clavier', 'Clavier mécanique'],
    ['Écran', 'Écran 27 pouces'],
    ['Souris', 'Souris sans fil'],
  ]
  return (
    <div className="mt-3">
      <div className="flex justify-center">
        <div className="select-none overflow-visible rounded-xl border border-navy/10 bg-white text-xs shadow-lg">
          <div className="flex">
            <div className="w-6 shrink-0 border-b border-navy/10 bg-navy/10" />
            <div className="w-20 shrink-0 border-b border-l border-navy/10 bg-navy/10 py-0.5 text-center text-navy/50">A</div>
            <div className="relative shrink-0 border-b border-l border-navy/10 bg-navy/10 py-0.5 text-center text-navy/50" style={{ width: largeurB, transition: 'width .5s ease' }}>
              B
              <div onDoubleClick={faire} title="Double-clique pour ajuster" className="absolute -right-1.5 top-0 z-10 flex h-full w-3 cursor-col-resize items-center justify-center">
                <span className="h-full w-0.5 bg-mint" />
                <span className="pointer-events-none absolute text-[11px] font-black leading-none text-navy-deep">↔</span>
              </div>
            </div>
          </div>
          {lignes.map(([a, b], i) => (
            <div className="flex" key={i}>
              <div className="w-6 shrink-0 border-b border-navy/10 bg-navy/10 py-1 text-center text-navy/50">{i + 1}</div>
              <div className="w-20 shrink-0 border-b border-l border-navy/10 px-2 py-1 text-navy/90">{a}</div>
              <div className="shrink-0 overflow-hidden whitespace-nowrap border-b border-l border-navy/10 px-2 py-1 text-navy/90" style={{ width: largeurB, transition: 'width .5s ease' }}>{b}</div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 rounded-full bg-mint/15 px-3 py-2 text-center text-sm font-bold text-mint">
        {ajuste ? "✓ La colonne s'ajuste au contenu le plus long." : '👆 Double-clique sur le bord droit de l\'en-tête (entre B et C)'}
      </p>
    </div>
  )
}

// Bloc « méthode » composite : alterne étapes (numérotation continue) et captures.
function CaptureInline({ c }) {
  if (!c) return null
  if (c.type === 'ruban') return <RubanImg v={c} />
  if (c.type === 'menu') return <MenuImg v={c} />
  // Tout autre visuel (formatcellule, borduresfond, formatnombre, pinceau, styles,
  // apercuimpression, tableur…) peut aussi être intercalé entre les étapes.
  return <Visuel v={c} />
}
function Methode({ v }) {
  const { titre, blocs = [] } = v

  // On regroupe les blocs : un groupe = une série d'étapes + la/les capture(s) et note
  // qui la suivent, jusqu'à la prochaine série d'étapes. Permet de révéler « au fur et à mesure ».
  const groupes = []
  let cur = []
  let curHasCapture = false
  for (const b of blocs) {
    if (b.etapes && curHasCapture) {
      groupes.push(cur)
      cur = []
      curHasCapture = false
    }
    cur.push(b)
    if (b.capture) curHasCapture = true
  }
  if (cur.length) groupes.push(cur)

  const total = groupes.length
  const progressif = total >= 3 // bouton « Voir la suite » seulement quand il y a beaucoup de captures
  const depart = progressif ? 1 : total

  // Révélation progressive sur la même page. On réinitialise quand on change de méthode.
  const [prevBlocs, setPrevBlocs] = useState(blocs)
  const [revele, setRevele] = useState(depart)
  if (blocs !== prevBlocs) {
    setPrevBlocs(blocs)
    setRevele(depart)
  }
  const visibles = progressif ? groupes.slice(0, revele) : groupes

  let n = 0
  const rendreBloc = (b, key) => {
    if (b.etapes) {
      const d = n + 1
      n += b.etapes.length
      return <EtapesListe key={key} items={b.etapes} depart={d} />
    }
    if (b.capture) return <CaptureInline key={key} c={b.capture} />
    if (b.note) {
      const lab = b.label === undefined ? 'Astuce' : b.label
      return (
        <p key={key} className="rounded-xl border border-mint/30 bg-mint/5 px-3 py-2 text-sm leading-relaxed text-navy/85">
          {lab && <span className="font-bold text-mint">{lab} : </span>}
          {gras(b.note)}
        </p>
      )
    }
    return null
  }

  return (
    <div className="mt-3 space-y-3">
      {titre && <p className="font-display text-lg leading-tight text-navy">{gras(titre)}</p>}
      {visibles.map((g, gi) => (
        <div key={gi} className={gi > 0 ? 'animate-fade-up space-y-3' : 'space-y-3'}>
          {g.map((b, bi) => rendreBloc(b, gi + '-' + bi))}
        </div>
      ))}
      {progressif && revele < total && (
        <button
          onClick={() => setRevele((r) => Math.min(r + 1, total))}
          className="mx-auto flex items-center gap-1.5 rounded-full bg-mint/15 px-5 py-2 text-sm font-bold text-mint transition hover:bg-mint/25"
        >
          Voir la suite ({revele}/{total}) <span className="text-base leading-none">↓</span>
        </button>
      )}
    </div>
  )
}

// La vraie fenêtre « Gestionnaire de noms » : un tableau Nom / Valeur / Fait référence à,
// une ligne sélectionnée, et les boutons (dont Supprimer surligné).
function GestionnaireNoms({ v }) {
  const { noms = [], selection = 0 } = v
  return (
    <div className="mx-auto mt-3 max-w-md overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80">
        <span>Gestionnaire de noms</span>
        <span className="text-navy/40">✕</span>
      </div>
      <div className="space-y-2 bg-white p-3">
        <div className="flex gap-1.5">
          <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-2 py-0.5">Nouveau…</span>
          <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-2 py-0.5">Modifier…</span>
          <span className="rounded-sm border-2 border-mint bg-mint/15 px-2 py-0.5 font-bold text-navy">Supprimer</span>
        </div>
        <div className="overflow-hidden rounded-sm border border-navy/20">
          <div className="grid bg-navy/10 text-navy/55" style={{ gridTemplateColumns: '1fr 0.8fr 1.4fr' }}>
            <span className="px-2 py-1">Nom</span>
            <span className="border-l border-navy/10 px-2 py-1">Valeur</span>
            <span className="border-l border-navy/10 px-2 py-1">Fait référence à</span>
          </div>
          {noms.map((n, i) => (
            <div key={i} className={`grid ${i === selection ? 'bg-[#cfe2ff]' : 'bg-white'}`} style={{ gridTemplateColumns: '1fr 0.8fr 1.4fr' }}>
              <span className="border-t border-navy/10 px-2 py-1 font-mono text-navy">{n.nom}</span>
              <span className="border-l border-t border-navy/10 px-2 py-1 text-navy/70">{n.valeur}</span>
              <span className="border-l border-t border-navy/10 px-2 py-1 font-mono text-navy/70">{n.ref}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-4 py-0.5">Fermer</span>
        </div>
      </div>
    </div>
  )
}

// Petite fenêtre de sélection : soit une liste (ex. « Coller un nom »),
// soit des cases à cocher (ex. « Créer des noms à partir de la sélection »).
function ListeDialog({ v }) {
  const { titre, intro, items, cases, selection = 0, ok = 'OK' } = v
  return (
    <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80">
        <span>{titre}</span>
        <span className="text-navy/40">✕</span>
      </div>
      <div className="space-y-2 bg-white p-3">
        {intro && <p className="text-navy/60">{intro}</p>}
        {items && (
          <div className="max-h-28 overflow-hidden rounded-sm border border-navy/25">
            {items.map((it, i) => (
              <div key={i} className={`px-2 py-1 font-mono ${i === selection ? 'bg-[#0a63c9] text-white' : 'text-navy'}`}>{it}</div>
            ))}
          </div>
        )}
        {cases && (
          <div className="space-y-1.5 py-0.5">
            {cases.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-navy/80">
                <span className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-sm border text-[9px] ${c.coche ? 'border-mint bg-mint text-white' : 'border-navy/40'}`}>{c.coche ? '✓' : ''}</span>
                {c.label}
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-4 py-0.5">{ok}</span>
          <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span>
        </div>
      </div>
    </div>
  )
}

function Visuel({ v }) {
  if (!v) return null
  if (v.type === 'methode') return <Methode v={v} />
  if (v.type === 'recopieanim') return <RecopieAnim />
  if (v.type === 'reffiger') return <RefFiger />
  if (v.type === 'seriesoptions') return <SeriesOptions v={v} />
  if (v.type === 'collagespecial') return <CollageSpecial v={v} />
  if (v.type === 'transposer') return <Transposer />
  if (v.type === 'tableur') return <Tableur v={v} />
  if (v.type === 'assistant') return <AssistantDialog v={v} />
  if (v.type === 'arguments') return <ArgumentsDialog v={v} />
  if (v.type === 'autocomplete') return <AutoComplete v={v} />
  if (v.type === 'ruban') return <Ruban v={v} />
  if (v.type === 'adresses') return <Adresses v={v} />
  if (v.type === 'curseurs') return <Curseurs v={v} />
  if (v.type === 'menu') return <MenuContextuel v={v} />
  if (v.type === 'glisser') return <Glisser />
  if (v.type === 'onglets') return <Onglets v={v} />
  if (v.type === 'saisiecell') return <SaisieCell />
  if (v.type === 'formatcellule') return <FormatCellule v={v} />
  if (v.type === 'borduresfond') return <BorduresFond v={v} />
  if (v.type === 'formatnombre') return <FormatNombre />
  if (v.type === 'pinceau') return <Pinceau />
  if (v.type === 'styles') return <Styles />
  if (v.type === 'apercuimpression') return <ApercuImpression v={v} />
  if (v.type === 'enteteperso') return <EntetePerso />
  if (v.type === 'impressionapercu') return <ImpressionApercu />
  if (v.type === 'stylenom') return <StyleNom />
  if (v.type === 'themes') return <Themes />
  if (v.type === 'champs') return <Champs v={v} />
  if (v.type === 'gestionnairenoms') return <GestionnaireNoms v={v} />
  if (v.type === 'listedialog') return <ListeDialog v={v} />
  if (v.type === 'barreformule') return <BarreFormule />
  if (v.type === 'barrefx') return <BarreFx v={v} />
  if (v.type === 'zonenom') return <ZoneNom v={v} />
  if (v.type === 'formule') {
    return (
      <div className="mt-3 flex animate-fade-up items-center gap-2 rounded-xl border-2 border-mint/45 bg-mint/15 px-4 py-3 shadow-sm">
        <span className="shrink-0 font-mono text-sm italic text-mint/70">fx</span>
        <span className="font-mono text-lg text-navy">{coloreFormule(v.formule)}</span>
      </div>
    )
  }
  if (v.type === 'parties') {
    return (
      <div className="mt-3 space-y-2">
        {v.items.map((it, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-navy/10 bg-navy/5 p-3 animate-fade-up" style={{ animationDelay: `${i * 130}ms` }}>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-mint font-bold text-navy-deep">{i + 1}</span>
            <span className="text-sm text-navy/90">{gras(it.label)}</span>
          </div>
        ))}
      </div>
    )
  }
  if (v.type === 'etapes') {
    return (
      <ol className="mt-3 space-y-2">
        {v.items.map((it, i) => (
          <li key={i} className="flex items-start gap-3 rounded-xl border border-navy/10 bg-navy/5 p-3 animate-fade-up" style={{ animationDelay: `${i * 130}ms` }}>
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint text-xs font-bold text-navy-deep">{i + 1}</span>
            <span className="text-sm text-navy/85">{it}</span>
          </li>
        ))}
      </ol>
    )
  }
  if (v.type === 'operateurs') {
    return (
      <div className={`mt-3 grid gap-2 ${v.cols === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {(v.items || OPERATEURS).map((o, i) => (
          <div key={i} className="flex items-center gap-2 rounded-xl border border-navy/10 bg-navy/5 p-2 animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
            <span className="font-mono text-lg font-bold text-mint">{o.s}</span>
            <span className="text-xs text-navy/70">{o.l}</span>
          </div>
        ))}
      </div>
    )
  }
  if (v.type === 'exercice') {
    return (
      <div className="mt-3 space-y-2">
        {v.items.map((ex, i) => (
          <a
            key={i}
            href={ex.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex animate-fade-up items-center gap-3 rounded-2xl border border-mint/40 bg-mint/10 p-4 transition hover:bg-mint/20"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mint text-xl">📊</span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wide text-mint">Entraînement</p>
              <p className="truncate font-bold text-navy">{ex.titre}</p>
            </div>
            <span className="shrink-0 text-navy/40">↗</span>
          </a>
        ))}
      </div>
    )
  }
  if (v.type === 'encart') {
    return (
      <div className="mt-3 flex items-start gap-3 rounded-2xl border border-mint/40 bg-mint/10 p-4 animate-fade-up">
        <div className="shrink-0 animate-float text-mint">
          <NinjaIcon size={34} className="text-mint" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-mint">{v.label || 'Bon à savoir'}</p>
          {v.texte && <p className="mt-1 text-sm leading-relaxed text-navy/90">{gras(v.texte)}</p>}
          {v.liste && (
            <ul className="mt-1.5 space-y-1.5">
              {v.liste.map((it, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-snug text-navy/90">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                  <span>{gras(it)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }
  return null
}

function Question({ q, onResolu }) {
  const [choix, setChoix] = useState(null)
  const repondu = choix !== null
  return (
    <div className="mt-3">
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let cls = 'border-navy/10 bg-navy/5'
          if (repondu) {
            if (i === q.bonne) cls = 'border-mint/60 bg-mint/15'
            else if (i === choix) cls = 'border-red-400/50 bg-red-500/10'
          }
          return (
            <button
              key={i}
              disabled={repondu}
              onClick={() => {
                setChoix(i)
                onResolu && onResolu()
              }}
              className={`flex w-full items-center gap-2 rounded-xl border px-4 py-3 text-left font-mono text-sm transition ${cls}`}
            >
              {coloreFormule(opt)}
            </button>
          )
        })}
      </div>
      {repondu && (
        <p className={`mt-2 rounded-xl px-3 py-2 text-sm ${choix === q.bonne ? 'bg-mint/15 text-mint' : 'bg-navy/10 text-navy/90'}`}>
          {choix === q.bonne ? '✓ Bravo ! ' : 'Presque ! '}
          {q.explication}
        </p>
      )}
    </div>
  )
}

// Exercice interactif : l'élève élargit lui-même la colonne. Paramétrable via `v`
// (par défaut : démo ##### du ch.2 ; au ch.3 on étire une colonne de texte, sans #####).
function Elargir({ onResolu, v = {} }) {
  const {
    labelA = 'Écran',
    valeurEtroit = '#####',
    valeurLarge = '1 500',
    largeurLarge = '120px',
    aligneDroite = true,
    okMsg = '✓ Le nombre réapparaît : 1 500 €',
    promptMsg = "👆 Clique sur la poignée verte (bord droit de la colonne B) pour l'élargir",
  } = v
  const [large, setLarge] = useState(false)
  const ouvrir = () => {
    if (!large) {
      setLarge(true)
      onResolu && onResolu()
    }
  }
  return (
    <div className="mt-3">
      <div className="select-none overflow-hidden rounded-xl border border-navy/10 bg-white shadow-lg">
        <div className="grid text-xs" style={{ gridTemplateColumns: `26px 1fr ${large ? largeurLarge : '44px'} 1fr`, transition: 'grid-template-columns .6s ease' }}>
          <div className="bg-navy/10" />
          <div className="border-b border-l border-navy/10 bg-navy/10 py-1 text-center text-navy/50">A</div>
          <div className="relative border-b border-l border-navy/10 bg-navy/10 py-1 text-center text-navy/50">
            B
            <div onClick={ouvrir} title="Élargir la colonne" className="absolute -right-1.5 top-0 z-10 flex h-full w-3 cursor-col-resize items-center justify-center">
              <span className="h-full w-0.5 bg-mint" />
              <span className="pointer-events-none absolute text-[11px] font-black leading-none text-navy-deep">↔</span>
            </div>
          </div>
          <div className="border-b border-l border-navy/10 bg-navy/10 py-1 text-center text-navy/50">C</div>
          <div className="bg-navy/10 text-center text-navy/50">1</div>
          <div className="border-b border-l border-navy/10 px-2 py-1 text-navy/90">{labelA}</div>
          <div className={`overflow-hidden whitespace-nowrap border-b border-l border-navy/10 px-2 py-1 text-navy/90 ${aligneDroite ? 'text-right' : ''}`}>{large ? valeurLarge : valeurEtroit}</div>
          <div className="border-b border-l border-navy/10" />
        </div>
      </div>
      <p className="mt-3 rounded-full bg-mint/15 px-3 py-2 text-center text-sm font-bold text-mint">
        {large ? okMsg : promptMsg}
      </p>
    </div>
  )
}

// Une leçon racontée par le Shifu, une étape à la fois, ancrée dans un exemple concret.
export default function LeconNarree({ lecon, onQuitter, onTermine }) {
  const steps = lecon.exercices?.length
    ? [
        ...lecon.narration,
        {
          humeur: 'fier',
          dit: "Place à la pratique ! Ouvre ce fichier sur ton ordinateur et applique ce que tu viens d'apprendre. 💪",
          visuel: { type: 'exercice', items: lecon.exercices },
        },
      ]
    : lecon.narration
  const [etape, setEtape] = useState(0)
  const [resolu, setResolu] = useState(false)
  const s = steps[etape]
  const dernier = etape >= steps.length - 1
  const bloque = ['question', 'elargir', 'doubleclic'].includes(s.visuel?.type) && !resolu

  useEffect(() => {
    setResolu(false)
    window.scrollTo({ top: 0 })
  }, [etape])

  const avancer = () => {
    if (dernier) (onTermine || onQuitter)()
    else setEtape((e) => e + 1)
  }
  const reculer = () => setEtape((e) => Math.max(0, e - 1))

  return (
    <div className="flex flex-1 flex-col">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-cream/90 px-4 py-3 backdrop-blur">
        <button onClick={onQuitter} aria-label="Quitter" className="text-2xl leading-none text-navy/60 hover:text-navy">
          ×
        </button>
        <p className="flex-1 truncate text-xs font-bold uppercase tracking-wide text-navy/50">{lecon.titre}</p>
        <button
          onClick={() => (onTermine || onQuitter)()}
          className="shrink-0 text-xs font-bold text-navy/40 transition hover:text-navy"
        >
          Je connais, passer ›
        </button>
      </div>

      <div className="mx-auto w-full max-w-2xl flex-1 px-5 py-6">
        <div className="flex min-h-[320px] flex-col" key={etape}>
          <ShifuDit message={s.dit} humeur={s.humeur || 'accueil'} size={72} />
          {s.visuel?.type === 'question' ? (
            <Question q={s.visuel} onResolu={() => setResolu(true)} />
          ) : s.visuel?.type === 'elargir' ? (
            <Elargir v={s.visuel} onResolu={() => setResolu(true)} />
          ) : s.visuel?.type === 'doubleclic' ? (
            <DoubleClic onResolu={() => setResolu(true)} />
          ) : (
            <Visuel v={s.visuel} />
          )}
          {s.plus && <PlusInfo plus={s.plus} />}
        </div>

        <div className="mt-4">
          <Bouton onClick={avancer} disabled={bloque}>
            {bloque
              ? s.visuel?.type === 'elargir'
                ? 'Élargis la colonne'
                : s.visuel?.type === 'doubleclic'
                  ? 'Double-clique sur le bord'
                  : 'Réponds pour continuer'
              : dernier
                ? 'Terminer'
                : 'Continuer'}
          </Bouton>
          {etape > 0 && (
            <button onClick={reculer} className="mt-3 block w-full text-center text-xs text-navy/50 hover:text-navy">
              ‹ Revenir en arrière
            </button>
          )}
        </div>

        <div className="mt-4 flex justify-center gap-1.5">
          {steps.map((_, i) => (
            <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === etape ? 'bg-mint' : i < etape ? 'bg-mint/40' : 'bg-navy/15'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
