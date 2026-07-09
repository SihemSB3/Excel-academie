import { useState, useEffect, useRef } from 'react'
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
      <span key={i}>{coloreFormule(p)}</span>
    )
  })
}

// Mini-tableur concret : un vrai bout de feuille Excel avec données, formule et résultat.
// `poignee` = cellule avec la poignée de recopie (+). `refsCouleur` = cellules colorées comme Excel.
// `animePoignee` = la poignée descend le long de la colonne.
function Tableur({ v }) {
  const { cols, rows, cells = {}, actif, formule, poignee, legende, refsCouleur, animePoignee, feuilles, feuilleActive, classeur, role } = v
  const rendreFormule = (f) => (refsCouleur ? coloreAvecRefs(f, refsCouleur) : coloreFormule(f))
  return (
    <div className="mt-3">
      <div className="animate-fade-up overflow-hidden rounded-xl border border-navy/10 bg-[#ffffff] shadow-lg">
        {classeur && (
          <div className="flex items-center gap-2 bg-[#1f7a4d] px-3 py-1 text-[10px] text-white">
            <span className="font-semibold">📗 {classeur}</span>
            {role && <span className="rounded-full bg-white/25 px-2 py-[1px] text-[9px] font-bold uppercase tracking-wide">{role}</span>}
            <span className="ml-auto opacity-80">▢&nbsp;&nbsp;✕</span>
          </div>
        )}
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
        {feuilles && (
          <div className="flex items-end gap-1 border-t border-navy/10 bg-navy/5 px-2 pt-1 text-[10px]">
            {feuilles.map((f) => (
              <span key={f} className={`rounded-t px-2.5 py-0.5 ${f === feuilleActive ? 'bg-white font-bold text-navy' : 'bg-navy/10 text-navy/50'}`}>
                {f}
              </span>
            ))}
            <span className="px-1 text-navy/35">＋</span>
          </div>
        )}
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
// Glisser-déposer montré dans le classeur ENTIER : on voit toute la grille, et une PLAGE
// de 2 cellules (« Souris | 20 ») glisse de sa ligne vers une ligne vide plus bas, curseur
// flèche 4 directions à l'appui. Rejouable.
function Glisser() {
  const [pose, setPose] = useState(false)
  const [cle, setCle] = useState(0)
  useEffect(() => {
    setPose(false)
    const id = setTimeout(() => setPose(true), 900)
    return () => clearTimeout(id)
  }, [cle])
  const MOVE = (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#0a335d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <polyline points="9 6 12 3 15 6" />
      <polyline points="9 18 12 21 15 18" />
      <polyline points="6 9 3 12 6 15" />
      <polyline points="18 9 21 12 18 15" />
    </svg>
  )
  // Colonne C vide en plus : la plage « Souris | 20 » n'occupe que A+B, la croix
  // du curseur déplacement se pose donc dans la colonne C, sans être coupée au bord.
  const cols = ['A', 'B', 'C']
  const H = 26 // hauteur d'une ligne (px)
  const LARG_PLAGE = 'calc((100% - 22px) * 2 / 3)' // A + B (2 colonnes sur 3)
  // Grille : en-têtes A/B/C, ligne 1 (titres), ligne 2 (Clavier), ligne 3 (Souris ← glisse), ligne 4 (vide, cible).
  const contenu = { 1: ['Produit', 'Prix (€)', ''], 2: ['Clavier', '30', ''], 3: pose ? ['', '', ''] : ['Souris', '20', ''], 4: pose ? ['Souris', '20', ''] : ['', '', ''] }
  return (
    <div className="mt-3">
      <div className="relative mx-auto max-w-[290px] overflow-hidden rounded-xl border border-navy/10 bg-white shadow-lg">
        <div className="flex items-center gap-2 bg-[#eceae3] px-2 py-1 text-[10px] text-navy/40"><span>Classeur1 — Excel</span></div>
        <div className="relative grid text-[11px]" style={{ gridTemplateColumns: '22px repeat(3, 1fr)' }}>
          <div className="bg-navy/5" style={{ height: H }} />
          {cols.map((c) => (<div key={c} className="grid place-items-center border-b border-l border-navy/10 bg-navy/10 text-navy/50" style={{ height: H }}>{c}</div>))}
          {[1, 2, 3, 4].map((r) => (
            <div key={r} className="contents">
              <div className="grid place-items-center border-b border-navy/10 bg-navy/10 text-navy/50" style={{ height: H }}>{r}</div>
              {cols.map((c, ci) => {
                const val = contenu[r][ci]
                const entete = r === 1
                return (
                  <div key={c} className={`flex items-center border-b border-l border-navy/10 px-1.5 ${ci === 1 ? 'justify-end' : ''} ${entete ? 'bg-navy/10 font-bold text-navy/70' : 'text-navy/85'}`} style={{ height: H }}>{val}</div>
                )
              })}
            </div>
          ))}
          {/* cible en pointillés sur la ligne 4 (colonnes A+B seulement) */}
          <div className="pointer-events-none absolute rounded-sm border-2 border-dashed border-mint/70" style={{ left: 22, width: LARG_PLAGE, top: H * 4, height: H }} />
          {/* la plage qui glisse (Souris | 20), en overlay, de la ligne 3 vers la ligne 4 */}
          <div className="pointer-events-none absolute z-10 flex items-center rounded-sm border-2 border-navy bg-white shadow-md" style={{ left: 22, width: LARG_PLAGE, top: pose ? H * 4 : H * 3, height: H, transition: 'top .9s cubic-bezier(.4,0,.2,1)' }}>
            <span className="flex-1 px-1.5 text-navy/85">Souris</span>
            <span className="flex-1 px-1.5 text-right text-navy/85">20</span>
            {/* curseur déplacement posé dans la colonne C (à droite de la plage), pour ne masquer aucune valeur */}
            <span className="absolute top-1/2 -translate-y-1/2 rounded-full border border-navy/10 bg-white p-0.5 shadow" style={{ left: 'calc(100% + 6px)' }}>{MOVE}</span>
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-start justify-between gap-3">
        <p className="flex items-start gap-1.5 text-[11px] leading-snug text-navy/60"><span className="text-navy/40">↳</span><span>{pose ? '« Souris | 20 » a été déposé sur la ligne 4. La plage entière a suivi le curseur.' : 'On attrape le bord de la sélection (curseur flèche à 4 branches) et on la glisse plus bas…'}</span></p>
        <button onClick={() => setCle((k) => k + 1)} className="shrink-0 rounded-full bg-mint/15 px-3 py-1 text-[11px] font-bold text-mint transition hover:bg-mint/25">↻ Rejouer</button>
      </div>
    </div>
  )
}

// Barre d'onglets de feuilles + menu « Déplacer ou copier » (pour copier vers une autre feuille).
function Onglets({ v }) {
  // `items` (optionnel) = menu contextuel personnalisé (sinon menu « Déplacer ou copier » par défaut).
  // `items: []` = pas de menu (juste les onglets). `couleurs` = { 'Feuil1': '#...' } pour l'onglet coloré.
  // `actifs` (tableau) = plusieurs onglets sélectionnés en même temps (groupe de travail).
  const { onglets = ['Feuil1', 'Feuil2', 'Feuil3'], actif = 'Feuil1', actifs, items, couleurs = {}, legende } = v
  const estSel = (o) => (actifs ? actifs.includes(o) : o === actif)
  return (
    <div className="mt-3">
      <div className="flex items-end gap-1 rounded-t-md border-t border-navy/15 bg-navy/5 px-2 pt-1 text-[11px]">
        {onglets.map((o) => (
          <span key={o} className={`rounded-t px-3 py-1 ${estSel(o) ? 'bg-white font-bold text-navy' : 'bg-navy/10 text-navy/55'}`} style={couleurs[o] ? { boxShadow: `inset 0 -3px 0 ${couleurs[o]}` } : undefined}>
            {o}
          </span>
        ))}
        <span className="px-2 text-navy/40">＋</span>
      </div>
      {items === undefined ? (
        <div className="ml-2 mt-1 w-56 overflow-hidden rounded-md border border-navy/20 bg-white py-1 text-xs shadow-xl">
          {['Insérer…', 'Supprimer', 'Renommer'].map((l) => (
            <div key={l} className="px-3 py-1.5 text-navy/80">{l}</div>
          ))}
          <div className="my-1 border-t border-navy/10" />
          <div className="flex items-center gap-2 bg-mint/20 px-3 py-1.5 font-semibold text-navy">
            <span>📑</span>Déplacer ou copier…
          </div>
        </div>
      ) : items.length > 0 ? (
        <div className="ml-2 mt-1 w-60 overflow-hidden rounded-md border border-navy/20 bg-white py-1 text-xs shadow-xl">
          {items.map((l, i) =>
            l === '-' ? (
              <div key={i} className="my-1 border-t border-navy/10" />
            ) : typeof l === 'object' ? (
              <div key={i} className="flex items-center gap-2 bg-mint/20 px-3 py-1.5 font-semibold text-navy">{l.label}</div>
            ) : (
              <div key={i} className="px-3 py-1.5 text-navy/80">{l}</div>
            ),
          )}
        </div>
      ) : null}
      {legende && (
        <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
          <span className="text-navy/40">↳</span>
          <span>{legende}</span>
        </p>
      )}
    </div>
  )
}

// La vraie boîte « Déplacer ou copier » : barre d'onglets + fenêtre avec la liste
// des feuilles et surtout la case « Créer une copie » cochée (pour garder l'original).
function DeplacerCopierFeuille() {
  const feuilles = ['Feuil1', 'Feuil2', 'Feuil3', '(déplacer en dernier)']
  return (
    <div className="mt-3">
      <div className="mx-auto max-w-[260px]">
        <div className={BARRE_ONGLETS}>
          {['Feuil1', 'Feuil2', 'Feuil3'].map((o) => (
            <span key={o} className={`rounded-t px-3 py-1 ${o === 'Feuil1' ? 'bg-white font-bold text-navy' : 'bg-navy/10 text-navy/55'}`}>{o}</span>
          ))}
          <span className="px-2 text-navy/40">＋</span>
        </div>
      </div>
      <div className="mx-auto mt-2 max-w-[260px] overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
        <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80">
          <span>Déplacer ou copier</span>
          <span className="text-navy/40">✕</span>
        </div>
        <div className="space-y-2 bg-white p-3">
          <p className="text-navy/55">Dans le classeur :</p>
          <div className="flex items-center justify-between rounded-sm border border-navy/30 px-2 py-1 text-navy/80">
            <span>Classeur1</span><span className="text-navy/40">▾</span>
          </div>
          <p className="pt-0.5 text-navy/55">Avant la feuille :</p>
          <div className="overflow-hidden rounded-sm border border-navy/25">
            {feuilles.map((f, i) => (
              <div key={f} className={`px-2 py-1 ${i === 1 ? 'bg-mint/25 font-semibold text-navy' : 'text-navy/75'}`}>{f}</div>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-md border-2 border-mint bg-mint/15 px-2 py-1.5">
            <span className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-sm border border-mint bg-mint text-[9px] text-white">✓</span>
            <span className="font-bold text-navy">Créer une copie</span>
          </div>
          <div className="flex justify-end gap-2 border-t border-navy/10 pt-2">
            <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5 text-navy/80">OK</span>
            <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5 text-navy/80">Annuler</span>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-2 flex max-w-[280px] items-start gap-1.5 text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳</span>
        <span>Sans la case « Créer une copie », la feuille serait <b>déplacée</b> : coche-la pour garder l'original et en <b>dupliquer</b> une copie.</span>
      </p>
    </div>
  )
}

// Un curseur souris (flèche) pour les animations de clic.
function Pointeur({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.35))' }}>
      <path d="M5 2 L5 19 L9.5 14.5 L12.5 21 L15 20 L12 13.5 L18.5 13.5 Z" fill="#0a335d" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

const BARRE_ONGLETS = 'flex items-end gap-1 rounded-t-md border-t border-navy/15 bg-navy/5 px-2 pt-1 text-[11px]'

// Animation : on double-clique sur l'onglet, puis on tape le nom « Janvier ».
function RenommerOnglet() {
  const [p, setP] = useState(0) // 0 repos · 1 double-clic · 2 édition (vide) · 3 saisie « Janvier » · 4 fait
  useEffect(() => {
    const durees = [1100, 1000, 650, 1500, 1300]
    const id = setTimeout(() => setP((x) => (x + 1) % durees.length), durees[p])
    return () => clearTimeout(id)
  }, [p])
  const nom = p <= 1 ? 'Feuil1' : p === 2 ? '' : 'Janvier'
  const edition = p === 2 || p === 3
  return (
    <div className="mt-3">
      <div className="relative">
        <div className={BARRE_ONGLETS}>
          <span className={`rounded-t px-3 py-1 ${edition ? 'bg-white text-navy ring-2 ring-mint ring-inset' : 'bg-white font-bold text-navy'}`}>
            {nom || ' '}
            {edition && <span className="animate-pulse">|</span>}
          </span>
          <span className="rounded-t bg-navy/10 px-3 py-1 text-navy/55">Feuil2</span>
          <span className="rounded-t bg-navy/10 px-3 py-1 text-navy/55">Feuil3</span>
          <span className="px-2 text-navy/40">＋</span>
        </div>
        {p === 1 && (
          <div className="pointer-events-none absolute left-9 top-4">
            <span className="absolute left-0 top-0 h-6 w-6 animate-ping rounded-full bg-mint/50" />
            <span className="absolute left-0 top-0 h-6 w-6 animate-ping rounded-full bg-mint/50" style={{ animationDelay: '.3s' }} />
            <Pointeur className="relative" />
          </div>
        )}
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳</span>
        <span>{p >= 3 ? 'On tape le nouveau nom, ici « Janvier », puis Entrée.' : 'Double-clique sur l\'onglet pour le renommer.'}</span>
      </p>
    </div>
  )
}

// Animation : on clique sur le ＋ et un nouvel onglet apparaît.
function AjouterOnglet() {
  const [p, setP] = useState(0) // 0 repos · 1 clic sur ＋ · 2 nouvel onglet · 3 fait
  useEffect(() => {
    const durees = [1200, 950, 1500, 900]
    const id = setTimeout(() => setP((x) => (x + 1) % durees.length), durees[p])
    return () => clearTimeout(id)
  }, [p])
  const nouvel = p >= 2
  return (
    <div className="mt-3">
      <div className={BARRE_ONGLETS}>
        <span className="rounded-t bg-white px-3 py-1 font-bold text-navy">Janvier</span>
        {nouvel && <span className="animate-pop rounded-t bg-white px-3 py-1 font-bold text-navy ring-2 ring-mint ring-inset">Feuil2</span>}
        <span className="relative px-2 text-navy/40">
          ＋
          {p === 1 && (
            <span className="pointer-events-none absolute -left-1 -top-1">
              <span className="absolute left-0 top-0 h-6 w-6 animate-ping rounded-full bg-mint/50" />
              <Pointeur className="relative" />
            </span>
          )}
        </span>
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳</span>
        <span>{nouvel ? 'Un nouvel onglet apparaît, prêt à être renommé.' : 'Clique sur le ＋ pour ajouter une feuille.'}</span>
      </p>
    </div>
  )
}

// Animation : « Janvier » (au milieu) est attrapé et déplacé tout à gauche, et il Y RESTE.
function DeplacerOnglet() {
  const [bouge, setBouge] = useState(false)
  const [cle, setCle] = useState(0) // incrémenté pour rejouer
  useEffect(() => {
    setBouge(false)
    const id = setTimeout(() => setBouge(true), 850)
    return () => clearTimeout(id)
  }, [cle])
  const slots = [8, 84, 160] // gauche · milieu · droite
  const tab = 'absolute top-1 grid h-7 w-[72px] place-items-center rounded-t text-center'
  const trans = { transition: 'left .8s cubic-bezier(.4,0,.2,1)' }
  return (
    <div className="mt-3">
      <div className="relative h-10 rounded-t-md border-t border-navy/15 bg-navy/5" style={{ width: 262 }}>
        <span className={`${tab} bg-navy/10 text-navy/55`} style={{ left: bouge ? slots[1] : slots[0], ...trans }}>Février</span>
        <span className={`${tab} z-10 bg-white font-bold text-navy shadow-lg ring-1 ring-mint`} style={{ left: bouge ? slots[0] : slots[1], ...trans }}>
          Janvier
          <span className="pointer-events-none absolute -bottom-3 -right-2"><Pointeur /></span>
        </span>
        <span className={`${tab} bg-navy/10 text-navy/55`} style={{ left: slots[2] }}>Mars</span>
        <span className="absolute top-2 text-navy/40" style={{ left: 240 }}>＋</span>
      </div>
      <div className="mt-2 flex items-start justify-between gap-3">
        <p className="flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
          <span className="text-navy/40">↳</span>
          <span>{bouge ? '« Janvier » est passé tout à gauche, et il y reste.' : 'On attrape « Janvier » (au milieu) et on le fait glisser à gauche.'}</span>
        </p>
        <button onClick={() => setCle((k) => k + 1)} className="shrink-0 rounded-full bg-mint/15 px-3 py-1 text-[11px] font-bold text-mint transition hover:bg-mint/25">
          ↻ Rejouer
        </button>
      </div>
    </div>
  )
}

// La palette « Couleur d'onglet » d'Excel (couleurs du thème + standard), une teinte choisie.
function PaletteCouleurs({ v }) {
  const theme = ['#ffffff', '#f2f0e6', '#0a335d', '#41c1ba', '#e8853a', '#4caf72', '#3f7fc4', '#8b5cf6']
  const standard = ['#c0392b', '#e8853a', '#f4cf3f', '#4caf72', '#41c1ba', '#3f7fc4', '#8b5cf6', '#7a4a2b']
  const sel = v?.selection ?? 4
  return (
    <div className="mx-auto mt-3 w-60 overflow-hidden rounded-md border border-navy/20 bg-white p-2.5 text-[10px] shadow-xl">
      <p className="mb-1.5 font-semibold text-navy/75">Couleur d'onglet</p>
      <p className="mb-1 text-navy/45">Couleurs du thème</p>
      <div className="mb-2 flex gap-1">
        {theme.map((c, i) => (
          <span key={i} className="h-5 w-5 rounded-sm border border-navy/15" style={{ background: c }} />
        ))}
      </div>
      <p className="mb-1 text-navy/45">Couleurs standard</p>
      <div className="flex gap-1">
        {standard.map((c, i) => (
          <span key={i} className={`h-5 w-5 rounded-sm ${i === sel ? 'ring-2 ring-navy ring-offset-1' : 'border border-navy/15'}`} style={{ background: c }} />
        ))}
      </div>
      <p className="mt-2 flex items-start gap-1 text-[9px] text-navy/45">
        <span>↳</span>
        <span>Clique la teinte de ton choix.</span>
      </p>
    </div>
  )
}

// La vraie fenêtre « Déplacer ou copier » d'Excel (avec la case « Créer une copie »).
function DeplacerCopierDialog({ v }) {
  const { classeur = '(classeur actuel)', feuilles = ['Janvier', 'Février', '(en dernier)'], selection = 0, copie = true } = v
  return (
    <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80">
        <span>Déplacer ou copier</span>
        <span className="text-navy/40">✕</span>
      </div>
      <div className="space-y-2 bg-white p-3 text-navy">
        <p className="text-navy/60">Déplacer les feuilles sélectionnées</p>
        <div>
          <p className="mb-1 text-navy/55">Dans le classeur :</p>
          <span className="flex items-center justify-between rounded-sm border border-navy/25 px-2 py-1">
            {classeur}
            <span className="text-navy/40">▾</span>
          </span>
        </div>
        <div>
          <p className="mb-1 text-navy/55">Avant la feuille :</p>
          <div className="h-20 overflow-hidden rounded-sm border border-navy/25">
            {feuilles.map((f, i) => (
              <div key={i} className={`px-2 py-0.5 ${i === selection ? 'bg-[#0a63c9] text-white' : 'text-navy'}`}>{f}</div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 pt-0.5">
          <span className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-sm border text-[9px] ${copie ? 'border-mint bg-mint text-white' : 'border-navy/40'}`}>{copie ? '✓' : ''}</span>
          <span className={copie ? 'font-bold text-navy' : 'text-navy/70'}>Créer une copie</span>
        </div>
        <div className="flex justify-end gap-2 pt-0.5">
          <span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-4 py-0.5">OK</span>
          <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span>
        </div>
      </div>
    </div>
  )
}

// Une (ou plusieurs) touche(s) de clavier dessinée(s), pour montrer « c'est CETTE touche ».
function ToucheClavier({ v }) {
  const { touches = [], note } = v
  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        {touches.map((t, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="font-bold text-navy/50">+</span>}
            <span className="inline-flex min-w-[52px] items-center justify-center rounded-lg border border-navy/25 bg-white px-3 py-2 text-sm font-bold text-navy shadow-[0_3px_0_rgba(10,51,93,0.22)] ring-2 ring-mint">
              {t}
            </span>
          </span>
        ))}
      </div>
      {note && (
        <p className="flex max-w-xs items-start gap-1.5 text-center text-[11px] leading-snug text-navy/60">
          <span className="font-bold text-mint">↑</span>
          <span>{note}</span>
        </p>
      )}
    </div>
  )
}

// Deux fenêtres de classeur (fichiers) : le SOURCE (la donnée) et le CIBLE (où l'afficher).
function DeuxClasseurs({ v }) {
  const { source = 'Ventes.xlsx', cible = 'Synthèse.xlsx' } = v
  const fenetres = [
    { nom: source, role: 'Source', desc: 'contient la donnée', val: '8 800', ref: true },
    { nom: cible, role: 'Cible', desc: 'où on affiche la valeur', val: '', ref: false },
  ]
  return (
    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:justify-center">
      {fenetres.map((f, i) => (
        <div key={i} className="flex-1 overflow-hidden rounded-md border border-navy/20 shadow-md">
          <div className="flex items-center bg-[#1f7a4d] px-2 py-1 text-[10px] text-white">
            <span className="font-semibold">📗 {f.nom}</span>
            <span className="ml-auto opacity-80">▢&nbsp;&nbsp;✕</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white px-2 py-3 text-[11px]">
            <span className="text-navy/60">Total :</span>
            <span className={`min-w-[54px] rounded-sm border px-2 py-1 text-center ${f.ref ? 'border-sky-500/40 bg-sky-500/20 font-bold text-navy' : 'border-dashed border-navy/25 text-navy/35'}`}>{f.val || '…'}</span>
          </div>
          <div className="bg-mint/10 px-2 py-1 text-center text-[9px] font-bold uppercase tracking-wide text-mint">{f.role} — {f.desc}</div>
        </div>
      ))}
    </div>
  )
}

// La fenêtre « Liaisons de classeur » (Données > Liaisons de classeur) : fichiers source + statut + actions.
function LiaisonsDialog({ v }) {
  const { fichiers = [{ nom: 'Ventes.xlsx', statut: 'OK' }] } = v
  return (
    <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80">
        <span>Liaisons de classeur</span>
        <span className="text-navy/40">✕</span>
      </div>
      <div className="space-y-2 bg-white p-3">
        <p className="text-navy/55">Classeurs source :</p>
        {fichiers.map((f, i) => (
          <div key={i} className="flex items-center gap-2 rounded-sm border border-navy/20 px-2 py-1.5">
            <span className="text-navy/75">📗 {f.nom}</span>
            <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-[#1f7a4d]">
              <span className="h-2 w-2 rounded-full bg-[#1f9d57]" /> {f.statut}
            </span>
            <span className="text-navy/40">⋯</span>
          </div>
        ))}
        <div className="rounded-md bg-navy/5 p-2 text-[10px] text-navy/70">
          <p className="mb-1 font-semibold text-navy/60">Sur les « ⋯ », tu peux :</p>
          <p>• Mettre à jour les valeurs</p>
          <p>• Modifier la source</p>
          <p>• Rompre la liaison</p>
        </div>
      </div>
    </div>
  )
}

// La fenêtre « Collage spécial » d'Excel, avec le bouton « Coller avec liaison » mis en avant.
function CollageSpecialDialog() {
  // La vraie fenêtre « Collage spécial » : toutes les options de la section « Coller »
  // (2 colonnes), la section « Opération », et les cases du bas.
  const collerG = ['Tout', 'Formules', 'Valeurs', 'Formats', 'Commentaires', 'Validation']
  const collerD = ['Tout en utilisant le thème source', 'Tout sauf la bordure', 'Largeurs de colonnes', 'Formules et format des nombres', 'Valeurs et format des nombres', 'Fusionner la mise en forme cond.']
  const operation = ['Aucune', 'Addition', 'Soustraction', 'Multiplication', 'Division']
  const Radio = ({ label, actif }) => (
    <span className="flex items-center gap-1.5 text-navy/80">
      <span className={`grid h-3 w-3 shrink-0 place-items-center rounded-full border ${actif ? 'border-navy/70' : 'border-navy/30'}`}>
        {actif && <span className="h-1.5 w-1.5 rounded-full bg-navy/70" />}
      </span>
      <span className={actif ? 'font-semibold text-navy' : ''}>{label}</span>
    </span>
  )
  return (
    <div className="mx-auto mt-3 max-w-[340px] overflow-hidden rounded-lg border border-navy/25 text-[10.5px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 text-[11px] font-semibold text-navy/80">
        <span>Collage spécial</span>
        <span className="text-navy/40">✕</span>
      </div>
      <div className="space-y-2.5 bg-white p-3">
        <div>
          <p className="mb-1 font-semibold text-navy/55">Coller</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {collerG.map((o, i) => <Radio key={o} label={o} actif={i === 0} />)}
            {collerD.map((o) => <Radio key={o} label={o} actif={false} />)}
          </div>
        </div>
        <div className="border-t border-navy/10 pt-2">
          <p className="mb-1 font-semibold text-navy/55">Opération</p>
          <div className="grid grid-cols-3 gap-x-3 gap-y-1">
            {operation.map((o, i) => <Radio key={o} label={o} actif={i === 0} />)}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-navy/10 pt-2">
          <span className="flex items-center gap-1.5 text-navy/75"><span className="h-3.5 w-3.5 shrink-0 rounded-sm border border-navy/40" /> Blancs non compris</span>
          <span className="flex items-center gap-1.5 text-navy/75"><span className="h-3.5 w-3.5 shrink-0 rounded-sm border border-navy/40" /> Transposé</span>
        </div>
        <div className="flex items-center justify-between border-t border-navy/10 pt-2">
          <span className="rounded-sm border-2 border-mint bg-mint/15 px-2 py-0.5 font-bold text-navy">Coller avec liaison</span>
          <span className="flex gap-2">
            <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">OK</span>
            <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// La vraie fenêtre « Protéger la feuille » : case en-tête + champ mot de passe + longue liste d'actions.
function ProtegerFeuilleDialog() {
  const actions = [
    'Sélectionner les cellules verrouillées',
    'Sélectionner les cellules déverrouillées',
    'Format de cellule',
    'Format de colonnes',
    'Format de lignes',
    'Insérer des colonnes',
    'Insérer des lignes',
    'Supprimer des colonnes',
    'Supprimer des lignes',
    'Trier',
    'Utiliser le filtre automatique',
    'Modifier les objets',
  ]
  const coches = 2
  return (
    <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80">
        <span>Protéger la feuille</span>
        <span className="text-navy/40">✕</span>
      </div>
      <div className="space-y-2 bg-white p-3">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-sm border border-mint bg-mint text-[9px] text-white">✓</span>
          <span className="font-semibold text-navy">Protéger la feuille et le contenu des cellules verrouillées</span>
        </div>
        <div>
          <p className="mb-1 text-navy/55">Mot de passe pour ôter la protection :</p>
          <div className="rounded-sm border border-navy/30 px-2 py-1 tracking-widest text-navy/70 ring-1 ring-mint">••••••</div>
        </div>
        <p className="text-navy/55">Autoriser tous les utilisateurs de cette feuille à :</p>
        <div className="max-h-32 overflow-hidden rounded-sm border border-navy/20">
          {actions.map((a, i) => (
            <div key={i} className="flex items-center gap-2 border-b border-navy/5 px-2 py-1 text-navy/80">
              <span className={`grid h-3 w-3 shrink-0 place-items-center rounded-sm border text-[8px] ${i < coches ? 'border-mint bg-mint text-white' : 'border-navy/40'}`}>{i < coches ? '✓' : ''}</span>
              {a}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-0.5">
          <span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-4 py-0.5">OK</span>
          <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span>
        </div>
      </div>
    </div>
  )
}

// Un tableau de données Excel « mis sous forme de tableau » : en-têtes colorés,
// flèches de filtre, lignes en couleurs alternées (zébrées).
function TableauDonnees({ v }) {
  const { entetes = [], lignes = [], filtres = false, filtreCol = -1, legende, total, brut = false, selection = false, colSel = -1, ligneSel = -1, ligneSelDepuis = 1, feuilles, feuilleActive } = v
  return (
    <div className="mt-3">
      <div className={`animate-fade-up overflow-hidden rounded-lg border border-navy/15 shadow-lg ${selection ? 'ring-2 ring-[#1a73e8] ring-offset-1' : ''}`}>
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              {entetes.map((h, i) => (
                <th key={i} className={`px-2 py-1.5 text-left font-bold ${brut ? 'border-b border-navy/15 bg-navy/10 text-navy/70' : 'border-b-2 border-mint bg-mint/25 text-navy'}`}>
                  <span className="flex items-center justify-between gap-1">
                    {h}
                    {filtres && <span className={i === filtreCol ? 'text-mint' : 'text-navy/45'}>{i === filtreCol ? '▽' : '▾'}</span>}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lignes.map((row, ri) => (
              <tr key={ri} className={brut ? 'bg-white' : ri % 2 ? 'bg-navy/[0.04]' : 'bg-white'}>
                {row.map((cell, ci) => {
                  const sel = ri === ligneSel && ci >= ligneSelDepuis
                  return (
                    <td key={ci} className={`border-b border-navy/10 px-2 py-1 text-navy/85 ${colSel === ci ? 'bg-sky-500/15' : ''} ${sel ? 'bg-sky-500/20 font-semibold ring-1 ring-inset ring-[#1a73e8]/60' : ''}`}>{cell}</td>
                  )
                })}
              </tr>
            ))}
            {total && (
              <tr className="bg-mint/15 font-bold text-navy">
                {total.map((cell, ci) => (
                  <td key={ci} className="border-t-2 border-mint px-2 py-1">{cell}</td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
        {feuilles && (
          <div className="flex items-end gap-1 border-t border-navy/15 bg-navy/5 px-2 pb-0.5 pt-1 text-[10px]">
            {feuilles.map((f) => (
              <span key={f} className={`rounded-t px-2 py-0.5 ${f === feuilleActive ? 'bg-white font-bold text-navy shadow ring-1 ring-navy/20' : 'text-navy/55'}`}>{f}</span>
            ))}
            <span className="px-1 text-navy/40">＋</span>
          </div>
        )}
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

// Le menu déroulant d'un filtre automatique (Trier A→Z / Z→A + cases à cocher des valeurs).
function FiltreMenu({ v }) {
  const { colonne = 'Ville', valeurs = [], typeFiltre = 'textuels' } = v
  return (
    <div className="mx-auto mt-3 max-w-[15rem] overflow-hidden rounded-md border border-navy/25 bg-white text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-navy/5 px-2 py-1 font-semibold text-navy/70">
        {colonne} <span className="text-mint">▽</span>
      </div>
      <div className="space-y-1 px-2 py-1.5 text-navy/70">
        <p>⬆ Trier de A à Z</p>
        <p>⬇ Trier de Z à A</p>
        <p className="text-navy/45">Filtres {typeFiltre} ▸</p>
      </div>
      <div className="border-t border-navy/10 px-2 py-1.5">
        {valeurs.map((val, i) => (
          <div key={i} className="flex items-center gap-2 py-0.5 text-navy/80">
            <span className={`grid h-3.5 w-3.5 place-items-center rounded-sm border text-[9px] ${val.coche === false ? 'border-navy/40' : 'border-mint bg-mint text-white'}`}>{val.coche === false ? '' : '✓'}</span>
            {val.label}
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 border-t border-navy/10 px-2 py-1.5">
        <span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-3 py-0.5">OK</span>
        <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-2 py-0.5">Annuler</span>
      </div>
    </div>
  )
}

// La boîte de dialogue « Trier » (tri personnalisé sur plusieurs niveaux).
function TriDialog({ v }) {
  const { niveaux = [] } = v
  return (
    <div className="mx-auto mt-3 max-w-md overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Trier</span><span className="text-navy/40">✕</span></div>
      <div className="space-y-2 bg-white p-3">
        <div className="flex gap-1.5">
          <span className="rounded-sm border-2 border-mint bg-mint/15 px-2 py-0.5 font-bold text-navy">＋ Ajouter un niveau</span>
          <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-2 py-0.5 text-navy/60">✕ Supprimer un niveau</span>
        </div>
        <div className="overflow-hidden rounded-sm border border-navy/20">
          <div className="grid grid-cols-[1.4fr_1fr_1.2fr] bg-navy/10 text-navy/55">
            <span className="px-2 py-1">Colonne</span>
            <span className="border-l border-navy/15 px-2 py-1">Trier sur</span>
            <span className="border-l border-navy/15 px-2 py-1">Ordre</span>
          </div>
          {niveaux.map((n, i) => (
            <div key={i} className="grid grid-cols-[1.4fr_1fr_1.2fr] border-t border-navy/10 bg-white">
              <span className="px-2 py-1 text-navy/80">{i === 0 ? 'Trier par' : 'Puis par'} <strong className="font-semibold text-navy">{n.colonne}</strong></span>
              <span className="border-l border-navy/10 px-2 py-1 text-navy/60">Valeurs</span>
              <span className="border-l border-navy/10 px-2 py-1 text-navy/80">{n.ordre}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2"><span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-4 py-0.5">OK</span><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span></div>
      </div>
    </div>
  )
}

// La boîte de dialogue « Sous-total ».
function SousTotalDialog({ v }) {
  const { changement = 'Vendeur', fonction = 'Somme', colonnes = ['CA'] } = v
  return (
    <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Sous-total</span><span className="text-navy/40">✕</span></div>
      <div className="space-y-2 bg-white p-3 text-navy">
        <div>
          <p className="mb-1 text-navy/55">À chaque changement de :</p>
          <span className="flex items-center justify-between rounded-sm border border-navy/25 px-2 py-1">{changement}<span className="text-navy/40">▾</span></span>
        </div>
        <div>
          <p className="mb-1 text-navy/55">Utiliser la fonction :</p>
          <span className="flex items-center justify-between rounded-sm border border-navy/25 px-2 py-1">{fonction}<span className="text-navy/40">▾</span></span>
        </div>
        <div>
          <p className="mb-1 text-navy/55">Ajouter un sous-total à :</p>
          <div className="space-y-1 rounded-sm border border-navy/25 p-1.5">
            {colonnes.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-navy/80">
                <span className="grid h-3.5 w-3.5 place-items-center rounded-sm border border-mint bg-mint text-[9px] text-white">✓</span>{c}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-0.5"><span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-4 py-0.5">OK</span><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span></div>
      </div>
    </div>
  )
}

// La boîte « Formulaire » d'Excel : un champ par colonne + boutons de navigation.
function Formulaire({ v }) {
  const { champs = [], index = 4, total = 12 } = v
  return (
    <div className="mx-auto mt-3 max-w-sm overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Feuil1</span><span className="text-navy/40">✕</span></div>
      <div className="flex gap-3 bg-white p-3">
        <div className="flex-1 space-y-1.5">
          {champs.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-right text-navy/60">{c.l} :</span>
              <span className="flex-1 rounded-sm border border-navy/25 px-2 py-0.5 text-navy">{c.v}</span>
            </div>
          ))}
          <p className="pt-1 text-right text-[10px] text-navy/45">{index} sur {total}</p>
        </div>
        <div className="flex w-24 shrink-0 flex-col gap-1">
          {['Nouveau', 'Supprimer', 'Précédente', 'Suivante', 'Critères', 'Fermer'].map((b) => (
            <span key={b} className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-2 py-0.5 text-center text-navy/80">{b}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Figer les volets, animé : l'en-tête reste fixe pendant que les lignes défilent.
function FigerVolets() {
  const entetes = ['Date', 'Vendeur', 'Ville', 'CA']
  const lignes = [
    ['05/03', 'Marie', 'Lyon', '8 200 €'],
    ['06/03', 'Karim', 'Paris', '12 500 €'],
    ['07/03', 'Léa', 'Lyon', '6 400 €'],
    ['08/03', 'Tom', 'Marseille', '9 100 €'],
    ['09/03', 'Nina', 'Paris', '7 300 €'],
    ['10/03', 'Sam', 'Lyon', '5 900 €'],
    ['11/03', 'Ana', 'Nice', '10 400 €'],
    ['12/03', 'Ben', 'Paris', '8 800 €'],
  ]
  return (
    <div className="mt-3">
      <div className="overflow-hidden rounded-lg border border-navy/15 shadow-lg">
        {/* En-tête FIGÉE : elle ne bouge pas */}
        <div className="grid grid-cols-4 border-b-2 border-mint bg-mint/25 text-[11px] font-bold text-navy">
          {entetes.map((h) => (
            <span key={h} className="px-2 py-1.5">{h}</span>
          ))}
        </div>
        {/* Corps qui défile */}
        <div className="relative h-24 overflow-hidden">
          <div className="animate-defile absolute inset-x-0 top-0">
            {lignes.map((row, ri) => (
              <div key={ri} className={`grid grid-cols-4 text-[11px] ${ri % 2 ? 'bg-navy/[0.04]' : 'bg-white'}`}>
                {row.map((c, ci) => (
                  <span key={ci} className="border-b border-navy/10 px-2 py-1 text-navy/85">{c}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳</span>
        <span>Même quand les lignes défilent, la ligne d'en-tête (Date, Vendeur, Ville, CA) reste visible : elle est figée.</span>
      </p>
    </div>
  )
}

// Aperçu des sauts de page : une grille découpée en pages par des lignes bleues.
function SautsPage() {
  const cols = 6
  const rows = 5
  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div className="relative overflow-hidden rounded-sm bg-white p-3 shadow ring-1 ring-navy/15">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 30px)`, gridTemplateRows: `repeat(${rows}, 20px)` }}>
          {Array.from({ length: cols * rows }).map((_, i) => {
            const c = i % cols
            return <div key={i} className={`border border-navy/10 ${c === 3 ? 'border-l-[3px] border-l-[#2f6fed]' : ''} ${i < cols ? 'bg-navy/10' : ''}`} />
          })}
        </div>
        <span className="pointer-events-none absolute left-[58px] top-[54px] text-xl font-black text-[#2f6fed]/25">1</span>
        <span className="pointer-events-none absolute right-[58px] top-[54px] text-xl font-black text-[#2f6fed]/25">2</span>
      </div>
      <p className="max-w-md text-center text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳ </span>Chaque cadre bleu est une page à imprimer. Glisse une ligne bleue pour déplacer la coupure.
      </p>
    </div>
  )
}

// Extension automatique d'un tableau, animée : la nouvelle ligne saisie est absorbée
// dans le tableau, avec la même mise en forme.
function ExtensionTableau() {
  const [p, setP] = useState(0) // 0 = on tape la nouvelle ligne · 1 = elle est absorbée
  useEffect(() => {
    const durees = [1700, 2300]
    const id = setTimeout(() => setP((x) => (x + 1) % 2), durees[p])
    return () => clearTimeout(id)
  }, [p])
  const base = [['Marie', 'Lyon', '8 200 €'], ['Karim', 'Paris', '12 500 €'], ['Léa', 'Lyon', '6 400 €']]
  return (
    <div className="mt-3">
      <div className="overflow-hidden rounded-lg border border-navy/15 shadow-lg">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>{['Vendeur', 'Ville', 'CA'].map((h) => (<th key={h} className="border-b-2 border-mint bg-mint/25 px-2 py-1.5 text-left font-bold text-navy">{h}</th>))}</tr>
          </thead>
          <tbody>
            {base.map((row, ri) => (
              <tr key={ri} className={ri % 2 ? 'bg-navy/[0.04]' : 'bg-white'}>
                {row.map((c, ci) => (<td key={ci} className="border-b border-navy/10 px-2 py-1 text-navy/85">{c}</td>))}
              </tr>
            ))}
            <tr className={p === 1 ? 'animate-fade-up bg-navy/[0.04]' : 'bg-white'}>
              {['Nina', 'Paris', '7 300 €'].map((c, ci) => (
                <td key={ci} className={`px-2 py-1 text-navy/85 ${p === 1 ? 'border-b border-navy/10' : 'ring-1 ring-mint ring-inset'}`}>
                  {c}{p === 0 && ci === 0 && <span className="animate-pulse">|</span>}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳</span>
        <span>{p === 0 ? 'On tape « Nina » juste sous la dernière ligne, puis Entrée…' : '…et la ligne rejoint le tableau toute seule, avec la même mise en forme (couleur alternée, bordures).'}</span>
      </p>
    </div>
  )
}

// Saisie semi-automatique, animée : on tape le début d'un mot déjà présent,
// Excel propose la suite en gris, puis Entrée valide.
function SaisieAuto() {
  const [p, setP] = useState(0) // 0 tape « Ma » · 1 suggestion « rie » en gris · 2 validé « Marie »
  useEffect(() => {
    const d = [1000, 1500, 1400]
    const id = setTimeout(() => setP((x) => (x + 1) % 3), d[p])
    return () => clearTimeout(id)
  }, [p])
  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div className="overflow-hidden rounded-md border border-navy/15 shadow">
        <div className="grid" style={{ gridTemplateColumns: '28px 130px' }}>
          <div className="bg-navy/10" />
          <div className="border-b border-l border-navy/10 bg-navy/10 py-1 text-center text-xs text-navy/50">Vendeur</div>
          {['Marie', 'Karim', 'Léa'].map((v, i) => (
            <div key={i} className="contents">
              <div className="border-b border-navy/10 bg-navy/10 py-1 text-center text-xs text-navy/50">{i + 2}</div>
              <div className="border-b border-l border-navy/10 px-2 py-1 text-sm text-navy/85">{v}</div>
            </div>
          ))}
          <div className="bg-navy/10 py-1 text-center text-xs text-navy/50">5</div>
          <div className="border-l border-navy/10 px-2 py-1 text-sm ring-2 ring-mint ring-inset">
            {p === 0 ? (
              <span className="text-navy">Ma<span className="animate-pulse">|</span></span>
            ) : p === 1 ? (
              <span className="text-navy">Ma<span className="text-navy/35">rie</span><span className="animate-pulse">|</span></span>
            ) : (
              <span className="font-medium text-navy">Marie</span>
            )}
          </div>
        </div>
      </div>
      <p className="max-w-xs text-center text-[11px] leading-snug text-navy/60">
        {p === 1 ? 'Excel propose « rie » en gris : appuie sur Entrée pour valider.' : p === 2 ? '✓ Validé : « Marie ».' : 'On tape le début d\'un mot déjà présent dans la colonne…'}
      </p>
    </div>
  )
}

// Le plan (outline) des sous-totaux : les boutons de niveau 1/2/3 + la liste groupée.
function Plan() {
  const rows = [
    { t: 'Léa · Lyon · 6 400 €', lvl: 2 },
    { t: 'Marie · Lyon · 8 200 €', lvl: 2 },
    { t: 'Total Lyon · 14 600 €', lvl: 1, bold: true },
    { t: 'Tom · Marseille · 9 100 €', lvl: 2 },
    { t: 'Total Marseille · 9 100 €', lvl: 1, bold: true },
    { t: 'Total général · 36 200 €', lvl: 0, bold: true },
  ]
  return (
    <div className="mt-3">
      <div className="overflow-hidden rounded-md border border-navy/15 shadow">
        {/* Les boutons de plan, en haut à gauche comme dans Excel */}
        <div className="flex items-center gap-1 border-b border-navy/15 bg-navy/5 px-2 py-1">
          {[1, 2, 3].map((n) => (
            <span key={n} className="grid h-4 w-4 place-items-center rounded-sm border border-navy/35 bg-white text-[9px] font-bold text-navy/70">{n}</span>
          ))}
          <span className="ml-1 text-[9px] text-navy/40">← niveaux de détail</span>
        </div>
        <div className="text-[11px]">
          {rows.map((r, i) => (
            <div key={i} className={`border-b border-navy/10 py-1 pr-2 ${r.bold ? 'bg-mint/10 font-bold text-navy' : 'text-navy/80'}`} style={{ paddingLeft: `${8 + r.lvl * 14}px` }}>{r.t}</div>
          ))}
        </div>
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳</span>
        <span>Clique les boutons <strong className="font-bold text-navy">1 / 2 / 3</strong> (en haut à gauche) pour passer du total général au détail complet.</span>
      </p>
    </div>
  )
}

// La barre d'accès rapide d'Excel, tout en haut, avec le chevron ▾ mis en avant.
function BarreAccesRapide() {
  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div className="w-full max-w-md overflow-hidden rounded-md border border-navy/20 shadow">
        <div className="flex items-center gap-2 bg-[#1f7a4d] px-2 py-1 text-white">
          <span className="text-[12px]">💾</span>
          <span className="text-[12px]">↶</span>
          <span className="text-[12px]">↷</span>
          <span className="grid h-4 w-5 place-items-center rounded-sm bg-white/25 text-[10px] ring-2 ring-mint">▾</span>
          <span className="ml-2 text-[10px] opacity-80">Classeur1 — Excel</span>
        </div>
      </div>
      <p className="max-w-xs text-center text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳ </span>La barre d'accès rapide est tout en haut de la fenêtre. Le chevron <strong className="font-bold text-navy">▾</strong> (surligné) ouvre « Autres commandes… ».
      </p>
    </div>
  )
}

// Aperçu impression sur 2 pages, montrant que la ligne de titres se répète sur chaque page.
function ApercuTitres() {
  const Page = ({ lignes, n }) => (
    <div className="bg-white p-2 shadow ring-1 ring-navy/15" style={{ width: 132 }}>
      <div className="overflow-hidden rounded-sm border border-navy/10 text-[8px]">
        <div className="bg-mint/25 px-1 py-0.5 font-bold text-navy/75">Date · Vendeur · Ville</div>
        {lignes.map((r, i) => (
          <div key={i} className="border-t border-navy/10 px-1 py-0.5 text-navy/60">{r}</div>
        ))}
      </div>
      <div className="mt-1 text-center text-[8px] text-navy/40">Page {n}</div>
    </div>
  )
  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div className="flex gap-3">
        <Page n={1} lignes={['05/03 · Marie · Lyon', '06/03 · Karim · Paris', '07/03 · Léa · Lyon']} />
        <Page n={2} lignes={['08/03 · Tom · Marseille', '09/03 · Nina · Paris', '10/03 · Sam · Lyon']} />
      </div>
      <p className="max-w-md text-center text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳ </span>La ligne de titres (Date, Vendeur, Ville) réapparaît en haut de <strong className="font-bold text-navy">chaque</strong> page.
      </p>
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
        ) : actif === 'Protection' ? (
          <div className="space-y-2 bg-white p-3 text-navy/80">
            <div className="flex items-center gap-2">
              <span className="grid h-3.5 w-3.5 place-items-center rounded-sm border border-mint bg-mint text-[9px] text-white">✓</span>
              <span className="font-semibold text-navy">Verrouillée</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-sm border border-navy/40" />
              <span>Masquée</span>
            </div>
            <p className="leading-snug text-navy/55">Toutes les cellules sont « Verrouillées » par défaut. Le verrouillage ne prend effet qu'une fois la feuille protégée (onglet Révision, bouton Protéger la feuille).</p>
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
        {/* pb + overflow visible : la balise déborde sous la grille sans être coupée */}
        <div className="relative pb-5 pr-2">
          <div className="overflow-hidden rounded-md border border-navy/15 shadow">
            <div className="grid text-[10px]" style={{ gridTemplateColumns: '24px repeat(3, 78px)' }}>
              <div className="bg-navy/10" />
              {['A', 'B', 'C'].map((c) => (
                <div key={c} className="border-b border-l border-navy/10 bg-navy/10 py-1 text-center text-navy/50">{c}</div>
              ))}
              <div className="bg-navy/10 py-1 text-center text-navy/50">1</div>
              <div className="border-l border-navy/10 px-1.5 py-1 text-navy/90">01/05/2025</div>
              <div className="border-l border-navy/10 bg-mint/30 px-1.5 py-1 font-semibold text-navy">02/05/2025</div>
              <div className="relative border-l border-navy/10 bg-mint/30 px-1.5 py-1 font-semibold text-navy">03/05/2025</div>
            </div>
          </div>
          <span className="animate-glow absolute bottom-0 right-0 flex items-center gap-1 rounded-sm border border-navy/30 bg-white px-1.5 py-1 shadow-md">
            <svg width="14" height="14" viewBox="0 0 12 12">
              <rect x="1" y="1" width="10" height="10" rx="1" fill="none" stroke="#0a335d" strokeWidth="1" />
              <rect x="1.5" y="6.5" width="9" height="4.5" fill="#0a335d" opacity="0.45" />
            </svg>
            <span className="text-[9px] leading-none text-navy/60">▾</span>
          </span>
        </div>
        <span className="text-[10px] text-navy/45">↑ la balise « Options de recopie » (clique-la après avoir tiré la poignée)</span>
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
// Petit menu contextuel réutilisé dans les captures (clic droit sur une cellule).
function MiniMenuContextuel({ highlight }) {
  const items = ['✂ Couper', '📄 Copier', '📋 Coller', 'Collage spécial…', 'Insérer…']
  return (
    <div className="w-40 overflow-hidden rounded-md border border-navy/20 bg-white py-1 text-[10px] shadow-xl">
      {items.map((l) => (
        <div key={l} className={`px-2.5 py-1 ${l === highlight ? 'bg-mint/25 font-semibold text-navy' : 'text-navy/75'}`}>{l}</div>
      ))}
    </div>
  )
}

function CollageSpecial({ v }) {
  const { etapes = [] } = v
  const opts = [
    { icone: '📋', label: 'Coller' },
    { icone: '123', label: 'Valeurs', actif: true },
    { icone: 'ƒx', label: 'Formules' },
    { icone: '🎨', label: 'Format' },
    { icone: '⇅', label: 'Transposer' },
  ]
  // Une mini-capture par étape (même ordre que `etapes`) : on illustre chaque geste.
  const captures = [
    // 1 · copier la cellule : contour vert « clignotant » + raccourci
    <div key="c1" className="flex items-center gap-2">
      <div className="flex overflow-hidden rounded border border-navy/15 bg-white text-[10px]">
        <div className="grid h-6 w-14 place-items-center border-r border-navy/10 bg-navy/5 text-navy/70">Total</div>
        <div className="grid h-6 w-12 place-items-center border-2 border-dashed border-mint bg-mint/10 font-bold text-navy">10</div>
      </div>
      <span className="rounded border border-navy/20 bg-navy/5 px-2 py-1 text-[10px] font-bold text-navy/70">Ctrl + C</span>
    </div>,
    // 2 · clic droit sur la destination : le menu apparaît
    <div key="c2" className="flex items-center gap-2">
      <Pointeur />
      <MiniMenuContextuel />
    </div>,
    // 3 · on clique « Collage spécial… » (surligné)
    <MiniMenuContextuel key="c3" highlight="Collage spécial…" />,
    // 4 · on choisit ce qu'on colle : la palette d'options
    <div key="c4" className="rounded-md border border-navy/20 bg-white p-2 shadow-lg">
      <div className="flex gap-1.5">
        {opts.map((o, i) => (
          <div key={i} className={`flex w-[52px] flex-col items-center gap-1 rounded p-1.5 text-center ${o.actif ? 'bg-mint/20 ring-1 ring-mint' : 'bg-navy/5'}`}>
            <span className="grid h-6 w-6 place-items-center rounded bg-white text-[11px] font-bold text-navy/80 shadow-sm">{o.icone}</span>
            <span className="text-[9px] leading-tight text-navy/70">{o.label}</span>
          </div>
        ))}
      </div>
    </div>,
  ]
  return (
    <div className="mt-3 space-y-3">
      <ol className="space-y-3">
        {etapes.map((e, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-navy/85">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint text-[11px] font-bold text-navy-deep">{i + 1}</span>
            <div className="min-w-0 space-y-1.5">
              <p>{gras(e)}</p>
              {captures[i] && <div>{captures[i]}</div>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

// Le ruban Accueil avec le bouton « Coller ▾ » et son menu déroulant ouvert :
// on y voit bien l'entrée « Collage spécial… » tout en bas (méthode ruban).
function CollerDropdown() {
  const icones = [
    { i: '📋', l: 'Coller' },
    { i: 'ƒx', l: 'Formules' },
    { i: '123', l: 'Valeurs' },
    { i: '🎨', l: 'Format' },
    { i: '⇅', l: 'Transposer' },
  ]
  return (
    <div className="mx-auto mt-3 max-w-[300px]">
      <div className="overflow-hidden rounded-lg border border-navy/15 bg-white shadow-lg">
        <div className="flex gap-4 border-b border-navy/10 bg-[#f3f1ea] px-3 py-1 text-[11px]">
          {['Fichier', 'Accueil', 'Insertion', 'Mise en page'].map((o) => (
            <span key={o} className={o === 'Accueil' ? 'font-bold text-mint' : 'text-navy/50'}>{o}</span>
          ))}
        </div>
        <div className="flex items-start gap-3 p-3">
          <div className="flex flex-col items-center">
            <div className="grid h-9 w-9 place-items-center rounded bg-mint/20 text-lg shadow-sm ring-1 ring-mint">📋</div>
            <div className="mt-0.5 flex items-center gap-0.5 rounded bg-mint/20 px-1.5 text-[10px] font-bold text-navy ring-1 ring-mint">Coller <span>▾</span></div>
          </div>
          <div className="flex gap-3 pt-1 text-[10px] text-navy/60">
            <span className="flex flex-col items-center gap-0.5"><span className="text-base">✂</span>Couper</span>
            <span className="flex flex-col items-center gap-0.5"><span className="text-base">📄</span>Copier</span>
          </div>
        </div>
      </div>
      {/* le menu déroulant qui tombe sous le bouton Coller ▾ (aligné à gauche du ruban) */}
      <div className="ml-3 w-[200px] overflow-hidden rounded-md border border-navy/20 bg-white shadow-xl">
        <p className="px-3 pt-2 text-[10px] font-semibold uppercase tracking-wide text-navy/45">Coller</p>
        <div className="flex flex-wrap gap-1.5 p-2">
          {icones.map((o) => (
            <span key={o.l} title={o.l} className="grid h-7 w-7 place-items-center rounded bg-navy/5 text-[11px] font-bold text-navy/75">{o.i}</span>
          ))}
        </div>
        <div className="border-t border-navy/10" />
        <div className="flex items-center gap-2 bg-mint/25 px-3 py-2 text-[11px] font-bold text-navy">
          <span>📋⚙</span> Collage spécial…
        </div>
      </div>
    </div>
  )
}

// « Somme automatique » interactive : on clique le bouton ∑ et on VOIT Excel
// écrire =SOMME(B2:B4) puis calculer 200 tout seul, dans le tableau juste en dessous.
function SommeAuto({ onResolu }) {
  const [etape, setEtape] = useState(0) // 0 rien · 1 la formule s'écrit · 2 le résultat
  const H = 26
  const lignes = [
    ['Produit', 'Prix (€)'],
    ['Clavier', '30'],
    ['Souris', '20'],
    ['Écran', '150'],
    ['Total', ''],
  ]
  useEffect(() => {
    if (etape === 2) onResolu && onResolu()
  }, [etape])
  const cliquer = () => {
    if (etape !== 0) return
    setEtape(1)
    setTimeout(() => setEtape(2), 800)
  }
  const totalCell = etape === 0 ? '' : etape === 1 ? '=SOMME(B2:B4)' : '200'
  return (
    <div className="mt-3">
      <div className="flex justify-center">
        <button
          onClick={cliquer}
          disabled={etape !== 0}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold shadow-sm transition ${etape === 0 ? 'animate-pulse border-mint bg-mint/15 text-navy hover:bg-mint/25' : 'border-navy/15 bg-navy/5 text-navy/45'}`}
        >
          <span className="text-lg leading-none">∑</span> Somme automatique
        </button>
      </div>
      <div className="mx-auto mt-3 max-w-[260px] overflow-hidden rounded-xl border border-navy/10 bg-white shadow-lg">
        <div className="flex items-center gap-2 bg-[#eceae3] px-2 py-1 text-[10px] text-navy/40"><span>Classeur1 — Excel</span></div>
        <div className="grid text-[11px]" style={{ gridTemplateColumns: '22px repeat(2, 1fr)' }}>
          <div className="bg-navy/5" style={{ height: H }} />
          {['A', 'B'].map((c) => (<div key={c} className="grid place-items-center border-b border-l border-navy/10 bg-navy/10 text-navy/50" style={{ height: H }}>{c}</div>))}
          {lignes.map((row, ri) => {
            const r = ri + 1
            return (
              <div key={r} className="contents">
                <div className="grid place-items-center border-b border-navy/10 bg-navy/10 text-navy/50" style={{ height: H }}>{r}</div>
                {row.map((val, ci) => {
                  const entete = r === 1 || (ci === 0 && r === 5)
                  const estTotal = ci === 1 && r === 5
                  const hi = ci === 1 && etape >= 1 && r >= 2 && r <= 4
                  return (
                    <div
                      key={ci}
                      className={`flex items-center border-b border-l border-navy/10 px-1.5 ${ci === 1 ? 'justify-end' : ''} ${entete ? 'bg-navy/10 font-bold text-navy/70' : 'text-navy/85'} ${hi ? 'bg-mint/15 ring-1 ring-inset ring-mint/50' : ''} ${estTotal && etape === 2 ? 'bg-mint/20 font-bold text-navy' : ''}`}
                      style={{ height: H }}
                    >
                      {estTotal ? totalCell : val}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
      <p className="mx-auto mt-2 flex max-w-[280px] items-start gap-1.5 text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳</span>
        <span>{etape === 0 ? 'Clique ∑ : Excel devine la plage à additionner.' : etape === 1 ? 'Excel écrit =SOMME(B2:B4) tout seul…' : '✓ La somme est créée : =SOMME(B2:B4) affiche 200, en un seul clic !'}</span>
      </p>
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
        {champs.map((c, i) =>
          c.check !== undefined ? (
            <div key={i} className="flex items-center gap-2 text-navy/80">
              <span className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-sm border text-[9px] ${c.check ? 'border-mint bg-mint text-white' : 'border-navy/40'}`}>{c.check ? '✓' : ''}</span>
              {c.l}
            </div>
          ) : (
            <div key={i} className="flex items-center gap-2">
              <span className="shrink-0 text-navy/60">{c.l} :</span>
              <span className={`flex-1 rounded-sm border px-2 py-1 text-navy ${c.actif ? 'border-navy/30 ring-1 ring-mint' : 'border-navy/20'}`}>{c.v || ' '}</span>
            </div>
          ),
        )}
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
  const progressif = total >= 2 // bouton « Voir la suite » dès qu'il y a plusieurs groupes étapes+captures
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

// ---------- Chapitre 8 : les graphiques ----------
const SERIE_COULEURS = ['#41c1ba', '#0a335d', '#e8853a', '#8b5cf6', '#4caf72']
// Arrondit joliment le haut de l'axe des valeurs (25 pour un max de 24, etc.).
function niceMax(m) {
  if (m <= 0) return 10
  const pow = Math.pow(10, Math.floor(Math.log10(m)))
  for (const s of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) {
    if (s * pow >= m) return s * pow
  }
  return 10 * pow
}
// Chemin d'un secteur de camembert.
function arcPath(cx, cy, r, a0, a1) {
  const p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)]
  const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)]
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M${cx},${cy} L${p0[0].toFixed(1)},${p0[1].toFixed(1)} A${r},${r} 0 ${large} 1 ${p1[0].toFixed(1)},${p1[1].toFixed(1)} Z`
}

// Un mini-histogramme réutilisé dans les cadres « feuille » (déplacer, redimensionner, imprimer, onglets).
function MiniBarres({ w = 130, h = 84, titre = 'Ventes' }) {
  const vals = [12, 19, 15, 24]
  const max = 25
  const px = 8
  const pw = w - 16
  const base = h - 12
  const ph = base - 16
  const gw = pw / vals.length
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full">
      <text x={w / 2} y="10" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0a335d">{titre}</text>
      <line x1={px} y1={base} x2={px + pw} y2={base} stroke="#0a335d" strokeOpacity="0.3" />
      {vals.map((val, i) => {
        const bh = (val / max) * ph
        const bw = gw * 0.6
        return <rect key={i} x={px + gw * i + gw * 0.2} y={base - bh} width={bw} height={bh} rx="1" fill="#41c1ba" />
      })}
    </svg>
  )
}

// Le coeur du chapitre : un vrai graphique dessiné en SVG (histogramme, courbe, secteurs
// ou mixte), avec titre, axes, quadrillage, légende et animation d'apparition (barres qui
// poussent, courbe qui se trace). NB : la forme du graphe est dans `forme` (pas `type`,
// réservé au dispatcher des visuels).
function Graphique({ v }) {
  const {
    forme = 'histogramme',
    titre = 'Ventes par mois',
    cats = ['Jan', 'Fév', 'Mar', 'Avr'],
    series = [{ nom: 'Ventes', vals: [12, 19, 15, 24] }],
    legende: cap,
    montrerLegende = series.length > 1,
    etiquettes = false,
    quadrillage = true,
    annoterAxes = false,
    poignees = false,
    anime = false,
    surbrillance,
    axeY,
    theme,
  } = v
  // theme: 'sombre' = un vrai changement de style (fond navy, texte blanc), pour montrer
  // qu'appliquer un style transforme l'habillage complet du graphique.
  const sombre = theme === 'sombre'
  const encre = sombre ? '#ffffff' : '#0a335d'

  const [grandi, setGrandi] = useState(!anime)
  useEffect(() => {
    if (!anime) return undefined
    setGrandi(false)
    let raf2
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setGrandi(true))
    })
    return () => {
      cancelAnimationFrame(raf1)
      if (raf2) cancelAnimationFrame(raf2)
    }
  }, [anime, forme])

  const top = titre ? 30 : 16
  // Largeur du plot laissant une marge à droite pour l'axe secondaire (graphique mixte).
  const plot = { x: 40, y: top, w: 244, h: 170 - top }
  const baseY = plot.y + plot.h
  // En mixte, l'axe principal (gauche) ne concerne que la 1re série (les barres) ; la 2e série
  // (la courbe) a son propre axe secondaire à droite. Sinon on prend toutes les valeurs.
  const echelleVals = forme === 'mixte' ? series[0].vals : series.flatMap((s) => s.vals)
  const maxV = axeY?.max ?? niceMax(Math.max(...echelleVals, 1))
  const minV = axeY?.min ?? 0
  const yOf = (val) => baseY - ((val - minV) / (maxV - minV)) * plot.h
  const groupW = plot.w / cats.length
  const paliers = 5

  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div className={`w-full max-w-sm animate-fade-up rounded-lg border p-2 shadow-lg ${sombre ? 'border-navy-deep bg-navy' : 'border-navy/15 bg-white'}`}>
        <svg viewBox="0 0 300 210" className="w-full">
          {poignees && (
            <g>
              <rect x="4" y="4" width="292" height="202" fill="none" stroke="#1a73e8" strokeWidth="1" strokeDasharray="4 3" />
              {[[4, 4], [150, 4], [296, 4], [296, 105], [296, 206], [150, 206], [4, 206], [4, 105]].map(([hx, hy], i) => (
                <rect key={i} x={hx - 3} y={hy - 3} width="6" height="6" fill="white" stroke="#1a73e8" strokeWidth="1" />
              ))}
            </g>
          )}
          {titre && <text x="150" y="18" textAnchor="middle" fontSize="12" fontWeight="700" fill={encre}>{titre}</text>}
          {surbrillance === 'titre' && titre && <rect x="70" y="5" width="160" height="17" rx="3" fill="none" stroke="#41c1ba" strokeWidth="1.5" strokeDasharray="3 2" />}

          {forme !== 'secteurs' && (
            <g>
              {Array.from({ length: paliers + 1 }).map((_, i) => {
                const val = minV + (i / paliers) * (maxV - minV)
                const gy = baseY - (i / paliers) * plot.h
                return (
                  <g key={i}>
                    {quadrillage && <line x1={plot.x} y1={gy} x2={plot.x + plot.w} y2={gy} stroke={encre} strokeOpacity={sombre ? 0.18 : 0.1} strokeWidth="1" />}
                    <text x={plot.x - 5} y={gy + 3} textAnchor="end" fontSize="8" fill={encre} fillOpacity={sombre ? 0.75 : 0.6}>{Math.round(val)}</text>
                  </g>
                )
              })}
              <line x1={plot.x} y1={plot.y} x2={plot.x} y2={baseY} stroke={surbrillance === 'axeY' ? '#41c1ba' : encre} strokeWidth={surbrillance === 'axeY' ? 2 : 1} strokeOpacity={surbrillance === 'axeY' ? 1 : 0.35} />
              <line x1={plot.x} y1={baseY} x2={plot.x + plot.w} y2={baseY} stroke={encre} strokeWidth="1" strokeOpacity="0.35" />
              {cats.map((c, ci) => (
                <text key={ci} x={plot.x + groupW * (ci + 0.5)} y={baseY + 13} textAnchor="middle" fontSize="9" fill={encre} fillOpacity={sombre ? 0.85 : 0.75}>{c}</text>
              ))}
            </g>
          )}

          {forme === 'histogramme' && cats.map((c, ci) => {
            const nS = series.length
            const bw = Math.min(24, (groupW * 0.72) / nS)
            const gx = plot.x + groupW * ci + (groupW - bw * nS) / 2
            return series.map((s, si) => {
              const h = ((s.vals[ci] - minV) / (maxV - minV)) * plot.h
              const col = s.couleur || SERIE_COULEURS[si % SERIE_COULEURS.length]
              const x = gx + si * bw
              return (
                <g key={ci + '-' + si}>
                  <rect x={x + 1} y={grandi ? baseY - h : baseY} width={bw - 2} height={grandi ? h : 0} rx="1.5" fill={col} style={{ transition: 'y .8s cubic-bezier(.2,.9,.3,1), height .8s cubic-bezier(.2,.9,.3,1)', transitionDelay: `${(ci * nS + si) * 70}ms` }} />
                  {etiquettes && grandi && <text x={x + bw / 2} y={baseY - h - 3} textAnchor="middle" fontSize="8" fontWeight="700" fill={col}>{s.vals[ci]}</text>}
                </g>
              )
            })
          })}

          {forme === 'courbe' && series.map((s, si) => {
            const col = s.couleur || SERIE_COULEURS[si % SERIE_COULEURS.length]
            const pts = s.vals.map((val, ci) => [plot.x + groupW * (ci + 0.5), yOf(val)])
            const d = 'M' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L')
            return (
              <g key={si}>
                <path d={d} fill="none" stroke={col} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="600" strokeDashoffset={grandi ? 0 : 600} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                {pts.map((p, i) => (
                  <circle key={i} cx={p[0]} cy={p[1]} r="2.6" fill="white" stroke={col} strokeWidth="1.6" style={{ opacity: grandi ? 1 : 0, transition: 'opacity .4s', transitionDelay: `${600 + i * 80}ms` }} />
                ))}
              </g>
            )
          })}

          {forme === 'secteurs' && (() => {
            const cx = 150
            const cy = titre ? 110 : 100
            const r = 68
            const vals = series[0].vals
            const tot = vals.reduce((a, b) => a + b, 0)
            let ang = -Math.PI / 2
            return vals.map((val, ci) => {
              const a0 = ang
              const a1 = ang + (val / tot) * Math.PI * 2
              ang = a1
              const col = SERIE_COULEURS[ci % SERIE_COULEURS.length]
              const mid = (a0 + a1) / 2
              const lx = cx + r * 0.62 * Math.cos(mid)
              const ly = cy + r * 0.62 * Math.sin(mid)
              return (
                <g key={ci} style={{ opacity: grandi ? 1 : 0, transition: 'opacity .5s', transitionDelay: `${ci * 120}ms` }}>
                  <path d={arcPath(cx, cy, r, a0, a1)} fill={col} stroke="white" strokeWidth="1.5" />
                  <text x={lx} y={ly + 3} textAnchor="middle" fontSize="8" fontWeight="700" fill="white">{Math.round((val / tot) * 100)}%</text>
                </g>
              )
            })
          })()}

          {forme === 'mixte' && (() => {
            const s0 = series[0]
            const s1 = series[1]
            const max1 = niceMax(Math.max(...s1.vals, 1))
            const y1 = (val) => baseY - (val / max1) * plot.h
            const bw = Math.min(30, groupW * 0.5)
            const pts = s1.vals.map((val, ci) => [plot.x + groupW * (ci + 0.5), y1(val)])
            const d = 'M' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L')
            const col1 = s1.couleur || SERIE_COULEURS[2]
            return (
              <g>
                {cats.map((c, ci) => {
                  const h = (s0.vals[ci] / maxV) * plot.h
                  const x = plot.x + groupW * ci + (groupW - bw) / 2
                  return <rect key={ci} x={x} y={grandi ? baseY - h : baseY} width={bw} height={grandi ? h : 0} rx="1.5" fill={s0.couleur || SERIE_COULEURS[0]} style={{ transition: 'y .8s, height .8s', transitionDelay: `${ci * 70}ms` }} />
                })}
                <path d={d} fill="none" stroke={col1} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="600" strokeDashoffset={grandi ? 0 : 600} style={{ transition: 'stroke-dashoffset 1s ease-out .3s' }} />
                {pts.map((p, i) => (
                  <circle key={i} cx={p[0]} cy={p[1]} r="2.8" fill={col1} style={{ opacity: grandi ? 1 : 0, transition: 'opacity .4s', transitionDelay: `${800 + i * 80}ms` }} />
                ))}
                <line x1={plot.x + plot.w} y1={plot.y} x2={plot.x + plot.w} y2={baseY} stroke={col1} strokeWidth="1" strokeOpacity="0.5" />
                {[0, max1].map((val, i) => (
                  <text key={i} x={plot.x + plot.w + 4} y={y1(val) + 3} textAnchor="start" fontSize="8" fill={col1}>{val}</text>
                ))}
              </g>
            )
          })()}

          {annoterAxes && (
            <g>
              <text x={plot.x + plot.w / 2} y={baseY + 26} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#41c1ba">Axe X — catégories</text>
              <text x={13} y={plot.y + plot.h / 2} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#41c1ba" transform={`rotate(-90 13 ${plot.y + plot.h / 2})`}>Axe Y — valeurs</text>
            </g>
          )}
        </svg>
        {(montrerLegende || forme === 'secteurs') && (
          <div className={`mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[9px] ${surbrillance === 'legende' ? 'rounded py-0.5 ring-1 ring-mint' : ''}`}>
            {(forme === 'secteurs' ? cats : series.map((s) => s.nom)).map((lab, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: forme === 'secteurs' ? SERIE_COULEURS[i % SERIE_COULEURS.length] : series[i].couleur || SERIE_COULEURS[i % SERIE_COULEURS.length] }} />
                <span className="text-navy/70">{lab}</span>
              </span>
            ))}
          </div>
        )}
      </div>
      {cap && (
        <p className="flex max-w-sm items-start gap-1.5 text-center text-[11px] leading-snug text-navy/60">
          <span className="text-navy/40">↳</span>
          <span>{cap}</span>
        </p>
      )}
    </div>
  )
}

// La grille « quel graphique pour quoi » (Insertion > Graphiques).
function TypesGraphiques() {
  const items = [
    { nom: 'Histogramme', use: 'Comparer des valeurs entre séries', ic: 'histo' },
    { nom: 'Courbe', use: 'Montrer une évolution dans le temps', ic: 'ligne' },
    { nom: 'Secteurs', use: 'Une part relative d\'un total', ic: 'pie' },
    { nom: 'Barres', use: 'Quand les étiquettes sont longues', ic: 'barres' },
    { nom: 'Aires', use: 'Mettre en avant le volume cumulé', ic: 'aire' },
    { nom: 'Nuage de points', use: 'La relation entre deux variables', ic: 'nuage' },
    { nom: 'Autres', use: 'Graphiques spéciaux (cascade, radar…)', ic: 'autres' },
  ]
  const Icone = ({ t }) => {
    if (t === 'histo') return <g><rect x="2" y="9" width="4" height="9" fill="#41c1ba" /><rect x="8" y="5" width="4" height="13" fill="#0a335d" /><rect x="14" y="11" width="4" height="7" fill="#e8853a" /></g>
    if (t === 'ligne') return <polyline points="2,15 7,8 12,11 18,3" fill="none" stroke="#41c1ba" strokeWidth="2" />
    if (t === 'pie') return <g><circle cx="10" cy="10" r="8" fill="#0a335d" /><path d="M10,10 L10,2 A8,8 0 0,1 17,13 Z" fill="#41c1ba" /></g>
    if (t === 'barres') return <g><rect x="2" y="3" width="12" height="3" fill="#41c1ba" /><rect x="2" y="8" width="8" height="3" fill="#0a335d" /><rect x="2" y="13" width="15" height="3" fill="#e8853a" /></g>
    if (t === 'aire') return <polygon points="2,18 2,12 8,7 13,10 18,4 18,18" fill="#41c1ba" fillOpacity="0.6" stroke="#41c1ba" />
    if (t === 'nuage') return <g><circle cx="5" cy="13" r="1.6" fill="#0a335d" /><circle cx="9" cy="9" r="1.6" fill="#0a335d" /><circle cx="13" cy="11" r="1.6" fill="#0a335d" /><circle cx="16" cy="5" r="1.6" fill="#41c1ba" /></g>
    return <g><polygon points="10,2 17,7.5 14.5,17 5.5,17 3,7.5" fill="none" stroke="#0a335d" strokeWidth="1.2" /><polygon points="10,6 13.5,8.5 12,13.5 8,13.5 6.5,8.5" fill="#41c1ba" fillOpacity="0.55" stroke="#41c1ba" strokeWidth="0.7" /></g>
  }
  return (
    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {items.map((it, i) => (
        <div key={i} className="flex animate-fade-up flex-col items-center gap-1 rounded-xl border border-navy/10 bg-navy/5 p-2 text-center" style={{ animationDelay: `${i * 70}ms` }}>
          <svg viewBox="0 0 20 20" className="h-8 w-8"><Icone t={it.ic} /></svg>
          <span className="text-[11px] font-bold text-navy">{it.nom}</span>
          <span className="text-[10px] leading-tight text-navy/60">{it.use}</span>
        </div>
      ))}
    </div>
  )
}

// Le focus « sous-types » d'une catégorie (ex. l'histogramme) : 2D, 3D, cylindre, conique, pyramidal.
function SousTypesGraphiques() {
  const items = [
    { nom: 'Histogramme 2D', use: 'Barres verticales simples pour comparer des valeurs.', ic: '2d' },
    { nom: 'Histogramme 3D', use: 'Même représentation avec un effet tridimensionnel.', ic: '3d' },
    { nom: 'Cylindre', use: 'Barres en forme de cylindres, rendu plus esthétique.', ic: 'cyl' },
    { nom: 'Conique', use: 'Barres coniques pointant vers le haut.', ic: 'cone' },
    { nom: 'Pyramidal', use: 'Barres en pyramides, pour un visuel original.', ic: 'pyr' },
  ]
  const BARRES = [[3, 10, 10], [10, 6, 14], [17, 12, 8]]
  const cols = ['#41c1ba', '#0a335d', '#e8853a']
  const Ic = ({ t }) => {
    if (t === '2d') return <g>{BARRES.map(([x, y, h], i) => (<rect key={i} x={x} y={y} width="4" height={h} fill={cols[i]} />))}</g>
    if (t === '3d') return <g>{BARRES.map(([x, y, h], i) => (<g key={i}><rect x={x} y={y} width="4" height={h} fill={cols[i]} /><polygon points={`${x},${y} ${x + 1.5},${y - 1.6} ${x + 5.5},${y - 1.6} ${x + 4},${y}`} fill={cols[i]} fillOpacity="0.65" /></g>))}</g>
    if (t === 'cyl') return <g>{BARRES.map(([x, y, h], i) => (<g key={i}><rect x={x} y={y} width="4" height={h} fill={cols[i]} /><ellipse cx={x + 2} cy={y + h} rx="2" ry="0.9" fill={cols[i]} /><ellipse cx={x + 2} cy={y} rx="2" ry="0.9" fill={cols[i]} fillOpacity="0.65" /></g>))}</g>
    if (t === 'cone') return <g>{BARRES.map(([x, y, h], i) => (<g key={i}><polygon points={`${x + 2},${y} ${x + 4},${y + h} ${x},${y + h}`} fill={cols[i]} /><ellipse cx={x + 2} cy={y + h} rx="2" ry="0.8" fill={cols[i]} fillOpacity="0.65" /></g>))}</g>
    return <g>{BARRES.map(([x, y, h], i) => (<g key={i}><polygon points={`${x + 2},${y} ${x + 4},${y + h} ${x},${y + h}`} fill={cols[i]} /><line x1={x + 2} y1={y} x2={x + 2} y2={y + h} stroke="white" strokeWidth="0.5" /></g>))}</g>
  }
  return (
    <div className="mt-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((it, i) => (
          <div key={i} className="flex animate-fade-up flex-col items-center gap-1 rounded-xl border border-navy/10 bg-navy/5 p-2 text-center" style={{ animationDelay: `${i * 70}ms` }}>
            <svg viewBox="0 0 24 22" className="h-9 w-10"><Ic t={it.ic} /></svg>
            <span className="text-[11px] font-bold text-navy">{it.nom}</span>
            <span className="text-[10px] leading-tight text-navy/60">{it.use}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳</span>
        <span>Ces sous-types apparaissent en miniatures dès que tu ouvres une catégorie, ou via <strong className="font-bold text-navy">Tous types de graphiques</strong>. Chaque famille a aussi ses variantes <strong className="font-bold text-navy">Groupé / Empilé / Empilé 100 %</strong> (visibles dans la galerie). Survole pour l'aperçu, clique pour insérer.</span>
      </p>
    </div>
  )
}

// La galerie « Styles du graphique » : chaque vignette est un habillage complet différent
// (fond, quadrillage, effets, couleurs). Le Style 3 (fond sombre) est celui qu'on applique.
function StylesGraphiqueGalerie() {
  const barres = [[8, 10], [17, 15], [26, 8]]
  const Vignette = ({ n }) => {
    const fondSombre = n === 3
    const gris = n === 2
    const contour = n === 4
    const bande = n === 5
    const mono = n === 6
    const cols = mono ? ['#41c1ba', '#7fd6d1', '#b9e9e6'] : ['#41c1ba', '#0a335d', '#e8853a']
    return (
      <div className={`flex flex-col items-center gap-1 rounded-lg p-1.5 ${fondSombre ? 'bg-mint/10 ring-2 ring-mint' : 'ring-1 ring-navy/15'}`}>
        <svg viewBox="0 0 40 28" className="h-10 w-14">
          <rect x="0.5" y="0.5" width="39" height="27" rx="1.5" fill={fondSombre ? '#0a335d' : gris ? '#eef1f4' : '#ffffff'} stroke="#0a335d" strokeOpacity="0.15" />
          {bande && <rect x="2" y="12" width="36" height="12" fill="#0a335d" fillOpacity="0.07" />}
          <rect x="11" y="4" width="18" height="1.8" rx="0.9" fill={fondSombre ? '#ffffff' : '#0a335d'} fillOpacity="0.55" />
          {(gris || fondSombre) && [12, 16, 20].map((gy) => (
            <line key={gy} x1="4" y1={gy} x2="36" y2={gy} stroke={fondSombre ? '#ffffff' : '#0a335d'} strokeOpacity="0.15" strokeWidth="0.5" />
          ))}
          {barres.map(([x, h], i) =>
            contour ? (
              <rect key={i} x={x} y={24 - h} width="6" height={h} fill="none" stroke={cols[i]} strokeWidth="1.2" />
            ) : (
              <rect key={i} x={x} y={24 - h} width="6" height={h} fill={fondSombre ? '#41c1ba' : cols[i]} />
            ),
          )}
          <line x1="4" y1="24" x2="36" y2="24" stroke={fondSombre ? '#ffffff' : '#0a335d'} strokeOpacity="0.4" strokeWidth="0.6" />
        </svg>
        <span className={`text-[9px] ${fondSombre ? 'font-bold text-mint' : 'text-navy/60'}`}>Style {n}</span>
      </div>
    )
  }
  return (
    <div className="mt-3">
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <Vignette key={n} n={n} />
        ))}
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳</span>
        <span>La galerie <strong className="font-bold text-navy">Styles du graphique</strong> : chaque vignette est un habillage complet (fond, quadrillage, effets, couleurs). Ici on va choisir le <strong className="font-bold text-navy">Style 3</strong> (fond sombre).</span>
      </p>
    </div>
  )
}

// Une mini-courbe (pendant de MiniBarres) pour les aperçus.
function MiniCourbe({ w = 150, h = 72, titre = 'Ventes' }) {
  const vals = [12, 19, 15, 24]
  const max = 25
  const px = 10
  const pw = w - 20
  const base = h - 12
  const ph = base - 16
  const pts = vals.map((val, i) => [px + (i / (vals.length - 1)) * pw, base - (val / max) * ph])
  const d = 'M' + pts.map((p) => p.map((x) => x.toFixed(1)).join(',')).join(' L')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full">
      <text x={w / 2} y="10" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0a335d">{titre}</text>
      <line x1={px} y1={base} x2={px + pw} y2={base} stroke="#0a335d" strokeOpacity="0.3" />
      <path d={d} fill="none" stroke="#41c1ba" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2" fill="white" stroke="#41c1ba" strokeWidth="1.4" />
      ))}
    </svg>
  )
}

// La fenêtre « Insérer un graphique » (Graphiques recommandés), ANIMÉE : Excel propose
// d'abord l'histogramme, puis on voit quelqu'un cliquer la miniature « Courbe » et
// l'aperçu changer en direct. Rejouable.
function RecommandeDialog() {
  const [sel, setSel] = useState(0)
  const [cle, setCle] = useState(0)
  useEffect(() => {
    setSel(0)
    const id = setTimeout(() => setSel(1), 1600)
    return () => clearTimeout(id)
  }, [cle])
  const Mini = ({ t }) => (
    <svg viewBox="0 0 24 16" className="h-4 w-7">
      {t === 'histo' && <g><rect x="3" y="7" width="4" height="7" fill="#41c1ba" /><rect x="9" y="3" width="4" height="11" fill="#0a335d" /><rect x="15" y="9" width="4" height="5" fill="#e8853a" /></g>}
      {t === 'ligne' && <polyline points="3,13 8,6 13,9 20,3" fill="none" stroke="#41c1ba" strokeWidth="1.8" />}
      {t === 'barres' && <g><rect x="3" y="3" width="12" height="2.6" fill="#41c1ba" /><rect x="3" y="7" width="8" height="2.6" fill="#0a335d" /><rect x="3" y="11" width="15" height="2.6" fill="#e8853a" /></g>}
      {t === 'aire' && <polygon points="3,14 3,9 9,5 14,8 20,3 20,14" fill="#41c1ba" fillOpacity="0.6" stroke="#41c1ba" />}
    </svg>
  )
  const minis = ['histo', 'ligne', 'barres', 'aire']
  const actif = sel === 0 ? 0 : 1
  return (
    <div className="mt-3">
      <div className="mx-auto max-w-md overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
        <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Insérer un graphique</span><span className="text-navy/40">✕</span></div>
        <div className="bg-white p-3">
          <div className="mb-2 flex gap-4 border-b border-navy/10 pb-1 text-[10px]"><span className="font-bold text-[#0a7a3d]">Graphiques recommandés</span><span className="text-navy/45">Tous les graphiques</span></div>
          <div className="flex gap-2">
            <div className="flex w-16 shrink-0 flex-col gap-1.5">
              {minis.map((t, i) => (
                <div key={i} className={`relative grid place-items-center rounded p-1 transition ${i === actif ? 'ring-2 ring-mint' : 'ring-1 ring-navy/15'}`}>
                  <Mini t={t} />
                  {i === 1 && sel === 1 && <span className="pointer-events-none absolute -bottom-2 -right-1"><Pointeur /></span>}
                </div>
              ))}
            </div>
            <div className="flex-1">
              <div className="rounded border border-navy/15 bg-[#fafafa] p-1" style={{ height: 80 }}>
                {sel === 0 ? <MiniBarres w={150} h={72} titre="Ventes par mois" /> : <MiniCourbe w={150} h={72} titre="Ventes par mois" />}
              </div>
              <p className="mt-1.5 text-[10px] leading-snug text-navy/60">
                {sel === 0 ? (
                  <>Un <strong className="text-navy">histogramme groupé</strong> permet de comparer des valeurs entre quelques catégories.</>
                ) : (
                  <>Une <strong className="text-navy">courbe</strong> montre l'évolution des valeurs dans le temps.</>
                )}
              </p>
            </div>
          </div>
          <div className="mt-2 flex justify-end gap-2"><span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-4 py-0.5">OK</span><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span></div>
        </div>
      </div>
      <div className="mt-2 flex items-start justify-between gap-3">
        <p className="flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
          <span className="text-navy/40">↳</span>
          <span>{sel === 0 ? 'Excel propose d\'abord l\'histogramme (1re miniature sélectionnée)…' : '…on clique la miniature « Courbe » : l\'aperçu et la description changent en direct.'}</span>
        </p>
        <button onClick={() => setCle((k) => k + 1)} className="shrink-0 rounded-full bg-mint/15 px-3 py-1 text-[11px] font-bold text-mint transition hover:bg-mint/25">↻ Rejouer</button>
      </div>
    </div>
  )
}

// Animation : modifier le titre du graphique — on double-clique le titre, on tape le
// nouveau texte, puis clic en dehors pour valider. Rejouable.
function TitreGraphique() {
  const [p, setP] = useState(0) // 0 on approche · 1 double-clic (édition) · 2 on tape · 3 validé
  const [cle, setCle] = useState(0)
  useEffect(() => {
    setP(0)
    const t1 = setTimeout(() => setP(1), 900)
    const t2 = setTimeout(() => setP(2), 2000)
    const t3 = setTimeout(() => setP(3), 3500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [cle])
  const messages = [
    'On approche le curseur du titre…',
    'Double-clic : le titre passe en édition (encadré, texte sélectionné).',
    'On tape le nouveau titre : « Ventes 2025 »…',
    '…clic en dehors : le nouveau titre est validé. ✓',
  ]
  return (
    <div className="mt-3">
      <div className="mx-auto w-full max-w-sm rounded-lg border border-navy/15 bg-white p-2 shadow-lg">
        <div className="relative flex h-8 items-center justify-center">
          {p === 0 && (
            <span className="relative text-sm font-bold text-navy">
              Ventes par mois
              <span className="pointer-events-none absolute -bottom-3 -right-4"><Pointeur /></span>
            </span>
          )}
          {p === 1 && (
            <span className="relative rounded-sm border border-[#1a73e8] px-2 text-sm font-bold text-navy">
              <span className="bg-sky-200/70">Ventes par mois</span>
              <span className="pointer-events-none absolute -bottom-3 -right-4"><Pointeur /></span>
              <span className="absolute -right-1.5 -top-1.5 h-4 w-4 animate-ping rounded-full bg-mint/60" />
            </span>
          )}
          {p === 2 && (
            <span className="rounded-sm border border-[#1a73e8] px-2 text-sm font-bold text-navy">
              Ventes 2025<span className="animate-pulse">|</span>
            </span>
          )}
          {p === 3 && <span className="animate-fade-up text-sm font-bold text-navy">Ventes 2025</span>}
        </div>
        <div style={{ height: 104 }}><MiniBarres w={280} h={100} titre="" /></div>
      </div>
      <div className="mt-2 flex items-start justify-between gap-3">
        <p className="flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
          <span className="text-navy/40">↳</span>
          <span>{messages[p]}</span>
        </p>
        <button onClick={() => setCle((k) => k + 1)} className="shrink-0 rounded-full bg-mint/15 px-3 py-1 text-[11px] font-bold text-mint transition hover:bg-mint/25">↻ Rejouer</button>
      </div>
    </div>
  )
}

// Le groupe « Sélection active » (tout à gauche de l'onglet Format), rendu comme dans le
// VRAI Excel : une grande LISTE DÉROULANTE qui affiche l'élément sélectionné du graphique,
// + les boutons « Mise en forme de la sélection » et « Rétablir le style d'origine »,
// avec une annotation qui explique ce que c'est. (Identique sur Mac et Windows.)
function SelectionActive({ v }) {
  const element = v?.element || 'Série « Ventes »'
  const onglets = ['Fichier', 'Accueil', 'Insertion', 'Création de graphique', 'Format']
  return (
    <div className="mx-auto mt-3 max-w-md animate-fade-up overflow-hidden rounded-md border border-navy/15 text-[10px] shadow-lg">
      <div className="flex gap-0.5 bg-[#f3f3f3] px-2 pt-1">
        {onglets.map((o) => (
          <span key={o} className={`rounded-t px-2 py-1 ${o === 'Format' ? 'bg-white font-bold text-[#0a7a3d]' : 'text-navy/55'}`}>{o}</span>
        ))}
      </div>
      <div className="flex items-start bg-white px-2 py-2">
        <div className="shrink-0 rounded-md border border-navy/15 bg-navy/[0.02] px-2 pb-1 pt-1.5">
          <div className="space-y-1">
            <div className="flex w-44 items-center justify-between rounded-sm border-2 border-mint bg-white px-2 py-1 text-navy">
              <span className="truncate font-semibold">{element}</span>
              <span className="ml-1 grid h-3.5 w-4 shrink-0 place-items-center rounded-sm bg-navy/10 text-navy/70">▾</span>
            </div>
            <div className="w-44 rounded-sm border border-navy/20 bg-[#f7f7f7] px-2 py-1 text-navy/80">🎨 Mise en forme de la sélection</div>
            <div className="w-44 rounded-sm border border-navy/20 bg-[#f7f7f7] px-2 py-1 text-navy/60">↺ Rétablir le style d'origine</div>
          </div>
          <div className="mt-1 border-t border-navy/10 pt-0.5 text-center text-[9px] font-semibold text-navy/60">Sélection active</div>
        </div>
        <div className="ml-3 mt-1 min-w-0 text-[9px] leading-snug">
          <p className="font-bold text-mint">↖ La liste déroulante</p>
          <p className="mt-0.5 text-navy/65">Elle affiche <strong className="font-bold text-navy">l'élément du graphique actuellement sélectionné</strong> (ici « {element} »). La flèche <strong className="font-bold text-navy">▾</strong> ouvre la liste de tous les éléments.</p>
        </div>
      </div>
    </div>
  )
}

// Le CLIC DROIT montré dans son CONTEXTE : le graphique sélectionné, le pointeur sur une
// barre, et le menu contextuel qui s'ouvre juste à côté (pas un menu flottant sorti de nulle part).
function ClicDroitGraphique({ v }) {
  const items = v?.items || [
    { label: 'Supprimer' },
    { label: 'Modifier le type de graphique de série…', actif: true },
    { label: 'Sélectionner des données…' },
    { label: 'Ajouter des étiquettes de données' },
    { label: 'Ajouter une courbe de tendance…' },
    { label: 'Mettre en forme une série de données…' },
  ]
  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div className="relative" style={{ width: 330, height: 218 }}>
        <div className="absolute left-0 top-0 rounded border border-navy/20 bg-white p-1 shadow ring-1 ring-[#1a73e8]" style={{ width: 190, height: 120 }}>
          <MiniBarres w={180} h={110} titre="Ventes" />
        </div>
        <span className="pointer-events-none absolute z-20" style={{ left: 92, top: 62 }}><Pointeur /></span>
        <div className="absolute z-10 w-56 overflow-hidden rounded-md border border-navy/20 bg-white py-0.5 text-[10px] shadow-xl" style={{ left: 102, top: 76 }}>
          {items.map((it, i) => (
            <div key={i} className={`px-2 py-1 ${it.actif ? 'bg-mint/15 font-semibold text-navy' : 'text-navy/75'}`}>{it.label}</div>
          ))}
        </div>
      </div>
      <p className="max-w-sm text-center text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳ </span>Clic <strong className="font-bold text-navy">droit</strong> sur la série (une barre) : le menu s'ouvre <strong className="font-bold text-navy">juste à côté</strong>, avec les commandes de CET élément.
      </p>
    </div>
  )
}

// Le clic droit sur un ONGLET de feuille : la barre d'onglets en bas + le menu qui s'ouvre
// au-dessus de l'onglet visé.
function ClicDroitOnglet({ v }) {
  const onglet = v?.onglet || 'Graph1'
  const feuilles = v?.feuilles || ['Feuil1', 'Graph1']
  const items = v?.items || [{ label: 'Insérer…' }, { label: 'Supprimer', actif: true }, { label: 'Renommer' }, { label: 'Déplacer ou copier…' }]
  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div className="relative w-64" style={{ height: 160 }}>
        <div className="absolute bottom-8 left-14 z-10 w-44 overflow-hidden rounded-md border border-navy/20 bg-white py-0.5 text-[10px] shadow-xl">
          {items.map((it, i) => (
            <div key={i} className={`px-2 py-1 ${it.actif ? 'bg-mint/15 font-semibold text-navy' : 'text-navy/75'}`}>{it.label}</div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-md border border-navy/15 bg-white">
          <div className="h-6 bg-white" />
          <div className="flex items-end gap-1 border-t border-navy/15 bg-navy/5 px-2 pb-0.5 pt-1 text-[10px]">
            {feuilles.map((f) => (
              <span key={f} className={`relative rounded-t px-2 py-0.5 ${f === onglet ? 'bg-white font-bold text-navy shadow ring-1 ring-mint' : 'text-navy/55'}`}>
                {f}
                {f === onglet && <span className="pointer-events-none absolute -right-2 -top-2 z-20"><Pointeur /></span>}
              </span>
            ))}
            <span className="px-1 text-navy/40">＋</span>
          </div>
        </div>
      </div>
      <p className="max-w-sm text-center text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳ </span>Clic <strong className="font-bold text-navy">droit</strong> sur l'onglet « {onglet} » (en bas) : le menu s'ouvre juste au-dessus, avec <strong className="font-bold text-navy">Supprimer</strong>.
      </p>
    </div>
  )
}

// Le volet « Mettre en forme… » (task pane à droite) : remplissage, bordure, effets d'un élément.
function VoletFormat({ v }) {
  const titre = v?.titre || 'Mettre en forme la sélection'
  const radios = (opts) => opts.map(([l, on], i) => (
    <div key={i} className="flex items-center gap-2">
      <span className={`grid h-3 w-3 place-items-center rounded-full border ${on ? 'border-mint' : 'border-navy/40'}`}>{on && <span className="h-1.5 w-1.5 rounded-full bg-mint" />}</span>
      <span className={on ? 'font-semibold text-navy' : 'text-navy/70'}>{l}</span>
    </div>
  ))
  return (
    <div className="mx-auto mt-3 w-56 overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>{titre}</span><span className="text-navy/40">✕</span></div>
      <div className="bg-white p-2">
        <div className="mb-2 flex gap-4 border-b border-navy/10 pb-1 text-navy/55"><span className="text-mint">🪣 Remplissage</span><span>⬠ Effets</span></div>
        <p className="font-bold text-navy/75">▾ Remplissage</p>
        <div className="mb-2 ml-1 space-y-1">
          {radios([['Aucun', false], ['Uni', true], ['Dégradé', false]])}
          <div className="flex items-center gap-2 pl-5"><span className="text-navy/55">Couleur</span><span className="h-4 w-6 rounded-sm border border-navy/25" style={{ background: v?.couleur || '#41c1ba' }} /><span className="text-navy/40">▾</span></div>
        </div>
        <p className="font-bold text-navy/75">▾ Bordure</p>
        <div className="ml-1 space-y-1">{radios([['Aucune', false], ['Trait plein', true]])}</div>
        <p className="mt-2 flex items-start gap-1 text-[10px] text-navy/50"><span>↳</span><span>Ajuste le <strong className="text-navy">remplissage</strong>, la <strong className="text-navy">bordure</strong> et les <strong className="text-navy">effets</strong> de l'élément choisi.</span></p>
      </div>
    </div>
  )
}

// Le raccourci « pinceau » à côté du graphique : onglets Style et Couleur.
function PinceauGraphique() {
  return (
    <div className="mx-auto mt-3 w-60 overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex gap-4 border-b border-navy/15 bg-[#f3f3f3] px-3 py-1.5 font-semibold"><span className="text-[#0a7a3d]">Style</span><span className="text-navy/45">Couleur</span></div>
      <div className="bg-white p-2">
        <p className="mb-1 text-[10px] text-navy/55">Applique une mise en forme globale (effets, bordures, transparence).</p>
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`rounded p-1 ${i === 1 ? 'ring-2 ring-mint' : 'ring-1 ring-navy/15'}`}>
              <svg viewBox="0 0 24 16" className="h-4 w-full"><rect x="3" y="7" width="4" height="7" fill="#41c1ba" /><rect x="9" y="4" width="4" height="10" fill="#0a335d" /><rect x="15" y="9" width="4" height="5" fill="#e8853a" /></svg>
            </div>
          ))}
        </div>
        <p className="mt-2 flex items-start gap-1 text-[10px] text-navy/50"><span>↳</span><span>Onglet <strong className="text-navy">Couleur</strong> : palette <strong className="text-navy">Colorée</strong> (multicolore) ou <strong className="text-navy">Monochrome</strong> (une seule teinte).</span></p>
      </div>
    </div>
  )
}

// Le raccourci « filtre » à côté du graphique : onglets Valeurs / Noms + Appliquer.
function FiltreGraphique() {
  const cases = (opts) => opts.map(([l, on], i) => (
    <div key={i} className="flex items-center gap-2 text-navy/80">
      <span className={`grid h-3 w-3 place-items-center rounded-sm border text-[8px] ${on ? 'border-mint bg-mint text-white' : 'border-navy/40'}`}>{on ? '✓' : ''}</span>{l}
    </div>
  ))
  return (
    <div className="mx-auto mt-3 w-56 overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex gap-4 border-b border-navy/15 bg-[#f3f3f3] px-3 py-1.5 font-semibold"><span className="text-[#0a7a3d]">Valeurs</span><span className="text-navy/45">Noms</span></div>
      <div className="bg-white p-2">
        <p className="mb-1 font-semibold text-navy/70">Séries</p>
        <div className="mb-2 ml-1 space-y-1">{cases([['Ventes', true]])}</div>
        <p className="mb-1 font-semibold text-navy/70">Catégories</p>
        <div className="ml-1 space-y-1">{cases([['Jan', true], ['Fév', true], ['Mar', true], ['Avr', false]])}</div>
        <div className="mt-2 flex justify-end"><span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-3 py-0.5 font-semibold">Appliquer</span></div>
        <p className="mt-1.5 flex items-start gap-1 text-[10px] text-navy/50"><span>↳</span><span>Coche/décoche (ici <strong className="text-navy">Avr</strong> est décoché), puis <strong className="text-navy">Appliquer</strong> — sans toucher aux données sources.</span></p>
      </div>
    </div>
  )
}

// La fenêtre « Modifier le type de graphique », ANIMÉE : catégories à gauche, sous-types +
// aperçu à droite. On voit quelqu'un cliquer « Courbes » : l'aperçu change en direct. Rejouable.
function TypeGraphiqueDialog() {
  const [sel, setSel] = useState(0)
  const [cle, setCle] = useState(0)
  useEffect(() => {
    setSel(0)
    const id = setTimeout(() => setSel(1), 1600)
    return () => clearTimeout(id)
  }, [cle])
  const cats = ['Histogramme', 'Courbes', 'Secteurs', 'Barres', 'Aires', 'Nuage de points', 'Autres']
  const actif = sel === 0 ? 0 : 1
  return (
    <div className="mt-3">
      <div className="mx-auto max-w-md overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
        <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Modifier le type de graphique</span><span className="text-navy/40">✕</span></div>
        <div className="bg-white p-3">
          <div className="flex gap-2">
            <div className="w-28 shrink-0 overflow-hidden rounded-sm border border-navy/20 text-[10px]">
              {cats.map((c, i) => (
                <div key={i} className={`relative px-2 py-1 transition ${i === actif ? 'bg-[#cfe2ff] font-semibold text-navy' : 'text-navy/70'}`}>
                  {c}
                  {i === 1 && sel === 1 && <span className="pointer-events-none absolute -bottom-1.5 right-1 z-10"><Pointeur /></span>}
                </div>
              ))}
            </div>
            <div className="flex-1">
              <div className="mb-2 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`rounded p-1 ${i === 0 ? 'ring-2 ring-mint' : 'ring-1 ring-navy/15'}`}>
                    <svg viewBox="0 0 24 18" className="h-5 w-7">
                      {actif === 0 ? (
                        <g><rect x="3" y="8" width="4" height="8" fill="#41c1ba" /><rect x="9" y="4" width="4" height="12" fill="#0a335d" /><rect x="15" y="10" width="4" height="6" fill="#e8853a" /></g>
                      ) : (
                        <polyline points="3,14 8,7 13,10 20,4" fill="none" stroke="#41c1ba" strokeWidth="1.8" />
                      )}
                    </svg>
                  </div>
                ))}
              </div>
              <div className="rounded border border-navy/15 bg-[#fafafa] p-1" style={{ height: 86 }}>
                {actif === 0 ? <MiniBarres w={150} h={78} titre="Aperçu" /> : <MiniCourbe w={150} h={78} titre="Aperçu" />}
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-end gap-2"><span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-4 py-0.5">OK</span><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span></div>
        </div>
      </div>
      <div className="mt-2 flex items-start justify-between gap-3">
        <p className="flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
          <span className="text-navy/40">↳</span>
          <span>{sel === 0 ? 'La catégorie « Histogramme » est sélectionnée, avec son aperçu…' : '…on clique « Courbes » : les sous-types et l\'aperçu changent en direct. OK pour valider.'}</span>
        </p>
        <button onClick={() => setCle((k) => k + 1)} className="shrink-0 rounded-full bg-mint/15 px-3 py-1 text-[11px] font-bold text-mint transition hover:bg-mint/25">↻ Rejouer</button>
      </div>
    </div>
  )
}

// La galerie des sous-types (dropdown Insertion > Histogramme), un sous-type surligné.
// Chaque vignette dessine son vrai rendu : groupé, EMPILÉ (segments superposés),
// empilé 100 % (barres pleines découpées), 3D.
function GalerieGraphiques() {
  const Vig = ({ t }) => (
    <svg viewBox="0 0 24 18" className="h-5 w-6">
      {t === 'groupe' && <g><rect x="3" y="8" width="4" height="8" fill="#41c1ba" /><rect x="9" y="4" width="4" height="12" fill="#0a335d" /><rect x="15" y="10" width="4" height="6" fill="#e8853a" /></g>}
      {t === 'empile' && (
        <g>
          <rect x="4" y="9" width="5" height="4" fill="#41c1ba" /><rect x="4" y="13" width="5" height="3" fill="#0a335d" />
          <rect x="11" y="5" width="5" height="6" fill="#41c1ba" /><rect x="11" y="11" width="5" height="5" fill="#0a335d" />
          <rect x="18" y="8" width="5" height="4" fill="#41c1ba" /><rect x="18" y="12" width="5" height="4" fill="#0a335d" />
        </g>
      )}
      {t === 'cent' && (
        <g>
          <rect x="4" y="3" width="5" height="7" fill="#41c1ba" /><rect x="4" y="10" width="5" height="6" fill="#0a335d" />
          <rect x="11" y="3" width="5" height="4" fill="#41c1ba" /><rect x="11" y="7" width="5" height="9" fill="#0a335d" />
          <rect x="18" y="3" width="5" height="9" fill="#41c1ba" /><rect x="18" y="12" width="5" height="4" fill="#0a335d" />
        </g>
      )}
      {t === 'trois' && (
        <g>
          <rect x="3" y="8" width="4" height="8" fill="#41c1ba" /><polygon points="3,8 4.5,6.5 8.5,6.5 7,8" fill="#41c1ba" fillOpacity="0.6" />
          <rect x="10" y="4" width="4" height="12" fill="#0a335d" /><polygon points="10,4 11.5,2.5 15.5,2.5 14,4" fill="#0a335d" fillOpacity="0.6" />
          <rect x="17" y="10" width="4" height="6" fill="#e8853a" /><polygon points="17,10 18.5,8.5 22.5,8.5 21,10" fill="#e8853a" fillOpacity="0.6" />
        </g>
      )}
    </svg>
  )
  const sous = [
    { n: 'Groupé', t: 'groupe' },
    { n: 'Empilé', t: 'empile' },
    { n: 'Empilé 100%', t: 'cent' },
    { n: '3D groupé', t: 'trois' },
  ]
  return (
    <div className="mx-auto mt-3 w-64 overflow-hidden rounded-md border border-navy/20 bg-white p-2 text-[10px] shadow-xl">
      <p className="mb-1.5 font-semibold text-navy/75">Histogramme</p>
      <div className="grid grid-cols-4 gap-1.5">
        {sous.map((s, i) => (
          <div key={i} className={`flex flex-col items-center gap-0.5 rounded p-1 text-center ${i === 0 ? 'bg-mint/15 ring-2 ring-mint' : 'ring-1 ring-navy/10'}`}>
            <Vig t={s.t} />
            <span className="leading-tight text-navy/60">{s.n}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 flex items-start gap-1 text-[9px] text-navy/50"><span>↳</span><span>Survole un sous-type pour l'aperçu, clique pour l'insérer. L'<strong className="text-navy">Empilé</strong> superpose les séries dans une même barre ; l'<strong className="text-navy">Empilé 100 %</strong> montre leur part en pourcentage.</span></p>
    </div>
  )
}

// Animation : on déplace le graphique (objet flottant) dans la feuille, curseur 4 flèches.
function DeplacerGraphique() {
  const [bouge, setBouge] = useState(false)
  const [cle, setCle] = useState(0)
  useEffect(() => {
    setBouge(false)
    const id = setTimeout(() => setBouge(true), 850)
    return () => clearTimeout(id)
  }, [cle])
  return (
    <div className="mt-3">
      <div className="relative mx-auto h-44 w-full max-w-sm overflow-hidden rounded-md border border-navy/15 bg-white" style={{ backgroundImage: 'linear-gradient(#0a335d10 1px, transparent 1px), linear-gradient(90deg, #0a335d10 1px, transparent 1px)', backgroundSize: '40px 28px' }}>
        <div className="absolute h-24 w-40 rounded border border-navy/20 bg-white shadow-lg ring-1 ring-mint" style={{ left: bouge ? 150 : 12, top: bouge ? 76 : 12, transition: 'left .9s cubic-bezier(.4,0,.2,1), top .9s cubic-bezier(.4,0,.2,1)' }}>
          <MiniBarres />
          <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg text-navy/70">✥</span>
        </div>
      </div>
      <div className="mt-2 flex items-start justify-between gap-3">
        <p className="flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
          <span className="text-navy/40">↳</span>
          <span>{bouge ? 'Le graphique a été déposé plus bas à droite.' : 'Survole le bord jusqu\'au curseur ✥ (4 flèches), clique et fais glisser.'}</span>
        </p>
        <button onClick={() => setCle((k) => k + 1)} className="shrink-0 rounded-full bg-mint/15 px-3 py-1 text-[11px] font-bold text-mint transition hover:bg-mint/25">↻ Rejouer</button>
      </div>
    </div>
  )
}

// Animation : on agrandit le graphique via une poignée d'angle (8 poignées, Shift = proportions).
function RedimensionnerGraphique() {
  const [grand, setGrand] = useState(false)
  const [cle, setCle] = useState(0)
  useEffect(() => {
    setGrand(false)
    const id = setTimeout(() => setGrand(true), 850)
    return () => clearTimeout(id)
  }, [cle])
  const w = grand ? 190 : 120
  const h = grand ? 120 : 80
  const handles = [[0, 0], [0.5, 0], [1, 0], [1, 0.5], [1, 1], [0.5, 1], [0, 1], [0, 0.5]]
  return (
    <div className="mt-3">
      <div className="relative mx-auto flex h-44 w-full max-w-sm items-center justify-center overflow-hidden rounded-md border border-navy/15 bg-white">
        <div className="relative rounded border border-navy/20 bg-white shadow" style={{ width: w, height: h, transition: 'width .9s cubic-bezier(.4,0,.2,1), height .9s cubic-bezier(.4,0,.2,1)' }}>
          <MiniBarres />
          <div className="pointer-events-none absolute inset-0 rounded ring-1 ring-[#1a73e8]" />
          {handles.map(([hx, hy], i) => (
            <span key={i} className={`absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 border border-[#1a73e8] bg-white ${i === 4 ? 'ring-2 ring-mint' : ''}`} style={{ left: `${hx * 100}%`, top: `${hy * 100}%` }} />
          ))}
          <span className="pointer-events-none absolute -bottom-4 -right-3"><Pointeur /></span>
        </div>
      </div>
      <div className="mt-2 flex items-start justify-between gap-3">
        <p className="flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
          <span className="text-navy/40">↳</span>
          <span>{grand ? 'Poignée d\'angle glissée : le graphique s\'agrandit. Avec Shift, les proportions sont gardées.' : 'Attrape une poignée d\'angle (surlignée) et fais-la glisser.'}</span>
        </p>
        <button onClick={() => setCle((k) => k + 1)} className="shrink-0 rounded-full bg-mint/15 px-3 py-1 text-[11px] font-bold text-mint transition hover:bg-mint/25">↻ Rejouer</button>
      </div>
    </div>
  )
}

// Animation : les onglets contextuels « Création de graphique » et « Format » apparaissent
// à la sélection du graphique, et disparaissent quand on clique ailleurs.
function OngletsContextuels() {
  const [sel, setSel] = useState(false)
  const [cle, setCle] = useState(0)
  useEffect(() => {
    setSel(false)
    const id = setTimeout(() => setSel(true), 900)
    return () => clearTimeout(id)
  }, [cle])
  const base = ['Fichier', 'Accueil', 'Insertion', 'Mise en page', 'Formules', 'Données', 'Révision', 'Affichage']
  return (
    <div className="mt-3">
      <div className="mx-auto max-w-md overflow-hidden rounded-md border border-navy/15 shadow-lg">
        <div className="flex flex-wrap items-center gap-0.5 bg-[#f3f3f3] px-2 pt-1 text-[10px]">
          {base.map((o) => (<span key={o} className="rounded-t px-1.5 py-1 text-navy/55">{o}</span>))}
          {sel && (
            <>
              <span className="animate-fade-up rounded-t bg-[#107c41] px-1.5 py-1 font-bold text-white">Création de graphique</span>
              <span className="animate-fade-up rounded-t bg-[#107c41]/80 px-1.5 py-1 font-bold text-white">Format</span>
            </>
          )}
        </div>
        <div className="flex items-center justify-center bg-white p-3">
          <div className={`rounded border bg-white p-1 shadow ${sel ? 'ring-2 ring-[#1a73e8]' : 'border-navy/15'}`} style={{ width: 150, height: 92 }}>
            <MiniBarres />
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-start justify-between gap-3">
        <p className="flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
          <span className="text-navy/40">↳</span>
          <span>{sel ? 'Graphique sélectionné : les onglets « Création de graphique » et « Format » apparaissent à droite du ruban.' : 'Clique en dehors : les onglets contextuels disparaissent.'}</span>
        </p>
        <button onClick={() => setCle((k) => k + 1)} className="shrink-0 rounded-full bg-mint/15 px-3 py-1 text-[11px] font-bold text-mint transition hover:bg-mint/25">↻ Rejouer</button>
      </div>
    </div>
  )
}

// Les trois boutons flottants à côté du graphique sélectionné (＋ / pinceau / filtre).
// `bouton` ('plus' | 'pinceau' | 'filtre') surligne l'icône concernée pour montrer OÙ elle
// se trouve ; le menu des éléments n'est affiché que pour le ＋.
function BoutonsGraphique({ v }) {
  const bouton = v?.bouton || 'plus'
  const actifIdx = bouton === 'plus' ? 0 : bouton === 'pinceau' ? 1 : 2
  const elements = v?.elements || [
    { l: 'Titre du graphique', c: true },
    { l: 'Étiquettes de données', c: false },
    { l: 'Table de données', c: false },
    { l: 'Quadrillage', c: true },
    { l: 'Légende', c: true },
    { l: 'Courbe de tendance', c: false },
  ]
  const legendes = {
    plus: (
      <>Les trois icônes flottantes : <strong className="font-bold text-navy">＋</strong> (éléments, surligné), <strong className="font-bold text-navy">🖌</strong> (style/couleur), <strong className="font-bold text-navy">▽</strong> (filtre). Coche ou décoche un élément pour l'ajouter ou le retirer.</>
    ),
    pinceau: (
      <>Le <strong className="font-bold text-navy">🖌 pinceau</strong> est la <strong className="font-bold text-navy">2e icône flottante</strong>, juste à droite du graphique sélectionné (surlignée ici).</>
    ),
    filtre: (
      <>Le <strong className="font-bold text-navy">▽ filtre</strong> est la <strong className="font-bold text-navy">3e icône flottante</strong>, juste à droite du graphique sélectionné (surlignée ici).</>
    ),
  }
  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div className="flex items-start gap-2">
        <div className="rounded border border-navy/20 bg-white p-1 shadow ring-1 ring-[#1a73e8]" style={{ width: 140, height: 92 }}><MiniBarres /></div>
        <div className="flex flex-col gap-1">
          {['＋', '🖌', '▽'].map((ic, i) => (
            <span key={i} className={`grid h-6 w-6 place-items-center rounded-full border bg-white text-[11px] shadow ${i === actifIdx ? 'border-mint text-navy ring-2 ring-mint' : 'border-navy/20 text-navy/60'}`}>{ic}</span>
          ))}
        </div>
        {bouton === 'plus' && (
          <div className="w-44 overflow-hidden rounded-md border border-navy/20 bg-white text-[10px] shadow-xl">
            <div className="border-b border-navy/10 bg-navy/5 px-2 py-1 font-semibold text-navy/75">Éléments de graphique</div>
            {elements.map((e, i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-1">
                <span className={`grid h-3 w-3 place-items-center rounded-sm border text-[8px] ${e.c ? 'border-mint bg-mint text-white' : 'border-navy/40'}`}>{e.c ? '✓' : ''}</span>
                <span className="text-navy/80">{e.l}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="max-w-sm text-center text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳ </span>{legendes[bouton]}
      </p>
    </div>
  )
}

// Le volet « Format de l'axe » : Options d'axe (limites min/max + unités).
function FormatAxe() {
  const champs = [['Minimum', '0,0'], ['Maximum', '25,0'], ['Unité principale', '5,0'], ['Unité secondaire', '1,0']]
  return (
    <div className="mx-auto mt-3 w-56 overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Format de l'axe</span><span className="text-navy/40">✕</span></div>
      <div className="bg-white p-3">
        <p className="mb-2 font-bold text-navy/80">▸ Options d'axe</p>
        <div className="space-y-1.5">
          {champs.map(([l, val], i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <span className="text-navy/70">{l}</span>
              <span className={`w-16 rounded-sm border px-2 py-0.5 text-right text-navy ${i < 3 ? 'border-mint ring-1 ring-mint' : 'border-navy/25'}`}>{val}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 flex items-start gap-1 text-[10px] text-navy/50"><span>↳</span><span>Les <strong className="text-navy">limites</strong> (min/max) et les <strong className="text-navy">unités</strong> règlent l'échelle.</span></p>
      </div>
    </div>
  )
}

// La fenêtre « Sélectionner la source de données » : liste des séries + flèches d'ordre.
function SelectionnerDonnees({ v }) {
  const series = v?.series || ['Ebook Excel', 'Ebook Shaolin']
  const sel = v?.selection ?? 0
  return (
    <div className="mx-auto mt-3 max-w-sm overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Sélectionner la source de données</span><span className="text-navy/40">✕</span></div>
      <div className="bg-white p-3">
        <div className="mb-2 flex justify-center"><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5 text-navy/80">⇄ Intervertir les lignes/colonnes</span></div>
        <p className="mb-1 text-navy/55">Entrées de légende (Séries)</p>
        <div className="mb-1 flex gap-1">
          <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-2 py-0.5 text-navy/80">＋ Ajouter</span>
          <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-2 py-0.5 text-navy/80">✎ Modifier</span>
          <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-2 py-0.5 text-navy/80">✕ Supprimer</span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 overflow-hidden rounded-sm border border-navy/25">
            {series.map((s, i) => (
              <div key={i} className={`flex items-center gap-1 px-2 py-1 ${i === sel ? 'bg-[#cfe2ff]' : 'bg-white'}`}>
                <span className="grid h-3 w-3 place-items-center rounded-sm border border-mint bg-mint text-[8px] text-white">✓</span>
                <span className="text-navy">{s}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center gap-1">
            <span className="grid h-5 w-5 place-items-center rounded-sm border-2 border-mint bg-white font-bold text-navy">↑</span>
            <span className="grid h-5 w-5 place-items-center rounded-sm border-2 border-mint bg-white font-bold text-navy">↓</span>
          </div>
        </div>
        <p className="mt-2 flex items-start gap-1 text-[10px] text-navy/50"><span>↳</span><span>Les boutons <strong className="text-navy">Ajouter / Modifier / Supprimer</strong> gèrent les séries ; les flèches <strong className="text-navy">↑ ↓</strong> changent leur ordre.</span></p>
      </div>
    </div>
  )
}

// Animation : Intervertir les lignes/colonnes bascule ce qui est en abscisse et ce qui devient série.
function IntervertirGraphique() {
  const [p, setP] = useState(0)
  const [cle, setCle] = useState(0)
  useEffect(() => {
    setP(0)
    const id = setTimeout(() => setP(1), 1400)
    return () => clearTimeout(id)
  }, [cle])
  const A = { cats: ['T1', 'T2', 'T3'], series: [{ nom: 'Ebook Excel', couleur: '#41c1ba', vals: [12, 18, 24] }, { nom: 'Ebook Shaolin', couleur: '#0a335d', vals: [9, 15, 21] }] }
  const B = { cats: ['Ebook Excel', 'Ebook Shaolin'], series: [{ nom: 'T1', couleur: '#41c1ba', vals: [12, 9] }, { nom: 'T2', couleur: '#0a335d', vals: [18, 15] }, { nom: 'T3', couleur: '#e8853a', vals: [24, 21] }] }
  const cur = p === 0 ? A : B
  return (
    <div className="mt-3">
      <div key={p} className="animate-fade-up"><Graphique v={{ forme: 'histogramme', titre: 'Ventes des ebooks', ...cur, montrerLegende: true }} /></div>
      <div className="mt-1 flex items-center justify-center gap-2 text-[11px]">
        <span className={p === 0 ? 'font-bold text-navy' : 'text-navy/45'}>Séries = Produits</span>
        <span className="text-navy/40">⇄</span>
        <span className={p === 1 ? 'font-bold text-navy' : 'text-navy/45'}>Séries = Trimestres</span>
      </div>
      <div className="mt-1 flex items-start justify-between gap-3">
        <p className="flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
          <span className="text-navy/40">↳</span>
          <span>Création &gt; <strong className="font-bold text-navy">Intervertir les lignes/colonnes</strong> échange l'abscisse et les séries.</span>
        </p>
        <button onClick={() => setCle((k) => k + 1)} className="shrink-0 rounded-full bg-mint/15 px-3 py-1 text-[11px] font-bold text-mint transition hover:bg-mint/25">↻ Rejouer</button>
      </div>
    </div>
  )
}

// La fenêtre « Déplacer le graphique » : Nouvelle feuille vs Objet dans.
function DeplacerGraphiqueDialog({ v }) {
  const sel = v?.selection ?? 0
  return (
    <div className="mx-auto mt-3 max-w-sm overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Déplacer le graphique</span><span className="text-navy/40">✕</span></div>
      <div className="space-y-2 bg-white p-3 text-navy">
        <p className="text-navy/60">Emplacement du graphique :</p>
        <div className="flex items-center gap-2">
          <span className={`grid h-3.5 w-3.5 place-items-center rounded-full border ${sel === 0 ? 'border-mint' : 'border-navy/40'}`}>{sel === 0 && <span className="h-1.5 w-1.5 rounded-full bg-mint" />}</span>
          <span className={sel === 0 ? 'font-bold' : 'text-navy/70'}>Nouvelle feuille :</span>
          <span className="rounded-sm border border-navy/25 px-2 py-0.5">Graph1</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`grid h-3.5 w-3.5 place-items-center rounded-full border ${sel === 1 ? 'border-mint' : 'border-navy/40'}`}>{sel === 1 && <span className="h-1.5 w-1.5 rounded-full bg-mint" />}</span>
          <span className={sel === 1 ? 'font-bold' : 'text-navy/70'}>Objet dans :</span>
          <span className="rounded-sm border border-navy/25 px-2 py-0.5">Feuil1 ▾</span>
        </div>
        <div className="flex justify-end gap-2 pt-0.5">
          <span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-4 py-0.5">OK</span>
          <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span>
        </div>
      </div>
    </div>
  )
}

// La vue « Fichier > Imprimer » ENTIÈRE (l'écran backstage d'Excel) : le menu Fichier à
// gauche (Imprimer surligné), les paramètres au centre (Imprimante, Paramètres avec
// « Imprimer la sélection »), et le VRAI aperçu à droite (page + « 1 sur 1 »).
function BackstageImprimer({ v }) {
  const parametre = v?.parametre || 'Imprimer la sélection'
  const legende = v?.legende
  return (
    <div className="mt-3">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-md border border-navy/25 shadow-xl">
        <div className="flex" style={{ minHeight: 235 }}>
          <div className="w-24 shrink-0 bg-[#1f7a4d] px-2 py-2 text-[9px] text-white">
            <p className="mb-2 pl-1 text-sm leading-none">←</p>
            {['Accueil', 'Nouveau', 'Ouvrir', 'Enregistrer', 'Imprimer', 'Partager', 'Fermer'].map((m) => (
              <p key={m} className={`rounded px-1.5 py-1 ${m === 'Imprimer' ? 'bg-white/25 font-bold' : 'opacity-85'}`}>{m}</p>
            ))}
          </div>
          <div className="w-40 shrink-0 border-r border-navy/10 bg-[#f7f7f7] p-2 text-[9px] text-navy">
            <p className="mb-1.5 text-[13px] font-bold">Imprimer</p>
            <div className="mb-2 flex items-center gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#1f7a4d] text-sm text-white">🖨</span>
              <span className="text-navy/70">Copies : 1</span>
            </div>
            <p className="mt-1 font-semibold text-navy/55">Imprimante</p>
            <div className="mb-1 flex items-center justify-between rounded-sm border border-navy/20 bg-white px-1.5 py-1"><span>Mon imprimante</span><span className="text-navy/40">▾</span></div>
            <p className="mt-1 font-semibold text-navy/55">Paramètres</p>
            <div className="flex items-center justify-between rounded-sm border-2 border-mint bg-white px-1.5 py-1 font-semibold"><span>{parametre}</span><span className="text-navy/40">▾</span></div>
            <div className="mt-1 flex items-center justify-between rounded-sm border border-navy/20 bg-white px-1.5 py-1"><span>Orientation Paysage</span><span className="text-navy/40">▾</span></div>
            <div className="mt-1 flex items-center justify-between rounded-sm border border-navy/20 bg-white px-1.5 py-1"><span>A4</span><span className="text-navy/40">▾</span></div>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center bg-[#e8e6e1] p-2">
            <div className="rounded-sm bg-white p-2 shadow-md ring-1 ring-navy/15" style={{ width: 148 }}>
              <div style={{ height: 94 }}><MiniBarres w={132} h={90} titre="Ventes par mois" /></div>
            </div>
            <p className="mt-1.5 text-[9px] text-navy/50">◂ &nbsp;1 sur 1&nbsp; ▸</p>
          </div>
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

// Aperçu d'impression d'un graphique seul (page A4 portrait).
function ImprimerGraphique() {
  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div className="rounded-sm bg-white p-3 shadow-lg ring-1 ring-navy/15" style={{ width: 190 }}>
        <div className="mx-auto rounded border border-navy/15 p-1" style={{ height: 120 }}><MiniBarres w={168} h={110} titre="Ventes par mois" /></div>
      </div>
      <p className="max-w-sm text-center text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳ </span>Fichier &gt; Imprimer. Si le <strong className="font-bold text-navy">graphique est sélectionné</strong>, seul le graphique s'imprime ; sinon, c'est toute la feuille active.
      </p>
    </div>
  )
}

// Un tableau avec une colonne « Tendance » de sparklines (mini-graphiques dans une cellule).
// `marqueurs: true` = version personnalisée (couleur orange + un marqueur sur chaque point).
function Sparklines({ v }) {
  const marqueurs = v?.marqueurs
  const rows = [
    { nom: 'Ebook Excel', vals: [8, 12, 10, 16, 22] },
    { nom: 'Ebook Shaolin', vals: [20, 16, 17, 12, 9] },
    { nom: 'Formations', vals: [10, 11, 10, 12, 13] },
  ]
  const spark = (vals) => {
    const max = Math.max(...vals)
    const min = Math.min(...vals)
    const w = 64
    const h = 18
    const pts = vals.map((val, i) => [(i / (vals.length - 1)) * (w - 4) + 2, h - 2 - ((val - min) / (max - min || 1)) * (h - 4)])
    const d = 'M' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L')
    const last = pts[pts.length - 1]
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="h-4 w-16">
        <path d={d} fill="none" stroke={marqueurs ? '#e8853a' : '#41c1ba'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        {marqueurs ? (
          pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="1.5" fill="#0a335d" />)
        ) : (
          <circle cx={last[0]} cy={last[1]} r="1.6" fill="#0a335d" />
        )}
      </svg>
    )
  }
  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div className="overflow-hidden rounded-md border border-navy/15 shadow">
        <table className="border-collapse text-[11px]">
          <thead>
            <tr>{['Produit', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Tendance'].map((h) => (<th key={h} className="border-b-2 border-mint bg-mint/25 px-2 py-1 font-bold text-navy">{h}</th>))}</tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className={ri % 2 ? 'bg-navy/[0.04]' : 'bg-white'}>
                <td className="border-b border-navy/10 px-2 py-1 text-navy/85">{r.nom}</td>
                {r.vals.map((val, ci) => (<td key={ci} className="border-b border-navy/10 px-2 py-1 text-center text-navy/70">{val}</td>))}
                <td className="border-b border-l border-navy/10 px-2 py-1">{spark(r.vals)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="max-w-sm text-center text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳ </span>
        {marqueurs ? (
          <>Après personnalisation : <strong className="font-bold text-navy">couleur orange</strong> + un <strong className="font-bold text-navy">marqueur</strong> sur chaque point (avant, les courbes étaient turquoise, sans marqueurs).</>
        ) : (
          <>Un <strong className="font-bold text-navy">sparkline</strong> est un mini-graphique logé dans une seule cellule (colonne « Tendance ») : parfait pour un tableau de bord.</>
        )}
      </p>
    </div>
  )
}

// La fenêtre Excel ENTIÈRE (barre de titre + ruban + feuille avec le graphique) et, à droite,
// le volet « Format de l'axe » docké comme dans le vrai Excel. volet=false : on montre où
// double-cliquer l'axe (surligné) ; volet=true : le volet d'options ouvert à droite.
function ClasseurAxe({ v }) {
  const volet = v?.volet
  const vals = [12, 19, 15, 24]
  const cats = ['Jan', 'Fév', 'Mar', 'Avr']
  const max = 25
  const px = 30
  const py = 10
  const pw = 150
  const ph = 88
  const baseY = py + ph
  const gw = pw / cats.length
  return (
    <div className="mx-auto mt-3 w-full max-w-md overflow-hidden rounded-md border border-navy/25 shadow-xl">
      <div className="flex items-center bg-[#1f7a4d] px-2 py-1 text-[10px] text-white">
        <span className="font-semibold">📗 Ventes.xlsx — Excel</span>
        <span className="ml-auto opacity-80">▢&nbsp;&nbsp;✕</span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 border-b border-navy/10 bg-[#f3f3f3] px-2 py-1 text-[9px]">
        {['Accueil', 'Insertion', 'Création de graphique', 'Format'].map((o, i) => (
          <span key={i} className={i === 3 ? 'rounded-t bg-white px-1 font-bold text-[#0a7a3d]' : 'text-navy/55'}>{o}</span>
        ))}
      </div>
      <div className="flex bg-white">
        <div className="flex-1 p-2">
          <div className="rounded border border-navy/15 bg-white p-1 shadow-sm">
            <svg viewBox="0 0 190 112" className="w-full">
              <text x="95" y="9" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0a335d">Ventes par mois</text>
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const gy = baseY - (i / 5) * ph
                return (
                  <g key={i}>
                    <line x1={px} y1={gy} x2={px + pw} y2={gy} stroke="#0a335d" strokeOpacity="0.1" />
                    <text x={px - 3} y={gy + 3} textAnchor="end" fontSize="7" fill={!volet ? '#2fa39c' : '#0a335d'} fillOpacity={!volet ? 1 : 0.6} fontWeight={!volet ? 700 : 400}>{i * 5}</text>
                  </g>
                )
              })}
              {/* Axe Y : surligné en turquoise à l'étape « double-clic » */}
              <line x1={px} y1={py} x2={px} y2={baseY} stroke={!volet ? '#41c1ba' : '#0a335d'} strokeWidth={!volet ? 2.5 : 1} strokeOpacity={!volet ? 1 : 0.4} />
              <line x1={px} y1={baseY} x2={px + pw} y2={baseY} stroke="#0a335d" strokeWidth="1" strokeOpacity="0.4" />
              {vals.map((val, i) => {
                const h = (val / max) * ph
                const bw = gw * 0.5
                const x = px + gw * i + (gw - bw) / 2
                return (
                  <g key={i}>
                    <rect x={x} y={baseY - h} width={bw} height={h} rx="1" fill="#41c1ba" />
                    <text x={px + gw * (i + 0.5)} y={baseY + 9} textAnchor="middle" fontSize="7" fill="#0a335d" fillOpacity="0.7">{cats[i]}</text>
                  </g>
                )
              })}
              {!volet && (
                <g>
                  <rect x={px - 20} y={py - 2} width="20" height={ph + 4} rx="2" fill="none" stroke="#41c1ba" strokeWidth="1.2" strokeDasharray="3 2" />
                  <text x={px + 6} y={py + 12} fontSize="7.5" fontWeight="700" fill="#2fa39c">↖ double-clic</text>
                </g>
              )}
            </svg>
          </div>
        </div>
        {volet && (
          <div className="w-36 shrink-0 border-l border-navy/15 bg-[#fafafa] p-2 text-[10px]">
            <div className="flex items-center justify-between font-semibold text-navy/80"><span>Format de l'axe</span><span className="text-navy/40">✕</span></div>
            <p className="mt-1.5 font-bold text-navy/75">▾ Options d'axe</p>
            <div className="mt-1 space-y-1">
              {[['Minimum', '0,0'], ['Maximum', '25,0'], ['Unité princ.', '5,0'], ['Unité second.', '1,0']].map(([l, val], i) => (
                <div key={i} className="flex items-center justify-between gap-1">
                  <span className="text-navy/65">{l}</span>
                  <span className={`w-12 rounded-sm border px-1 py-0.5 text-right text-navy ${i < 3 ? 'border-mint ring-1 ring-mint' : 'border-navy/25'}`}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <p className="bg-white px-2 pb-2 pt-1 text-center text-[10px] leading-snug text-navy/55">
        {volet ? 'Le volet « Format de l\'axe » s\'ouvre à droite de la fenêtre : règle les limites (min/max) et les unités.' : 'Double-clique l\'axe vertical des valeurs (surligné en turquoise) dans ton classeur.'}
      </p>
    </div>
  )
}

// ---------- Chapitre 9 : consolidation & TCD multi-tables ----------

// La vraie fenêtre « Consolider » (Données > Outils de données > Consolider).
function ConsoliderDialog({ v }) {
  const { fonction = 'Somme', reference = '', refs = [], ligneHaut = false, colGauche = false, lier = false, focus } = v
  const ring = (f) => (focus === f ? 'ring-2 ring-mint' : '')
  const Case = ({ l, c }) => (
    <div className="flex items-center gap-2">
      <span className={`grid h-3.5 w-3.5 place-items-center rounded-sm border text-[9px] ${c ? 'border-mint bg-mint text-white' : 'border-navy/40'}`}>{c ? '✓' : ''}</span>
      <span className={c ? 'font-semibold text-navy' : 'text-navy/75'}>{l}</span>
    </div>
  )
  return (
    <div className="mx-auto mt-3 max-w-sm overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Consolider</span><span className="text-navy/40">✕</span></div>
      <div className="space-y-2 bg-white p-3 text-navy">
        <div>
          <p className="mb-1 text-navy/55">Fonction :</p>
          <span className={`flex items-center justify-between rounded-sm border border-navy/25 px-2 py-1 ${ring('fonction')}`}>{fonction}<span className="text-navy/40">▾</span></span>
        </div>
        <div>
          <p className="mb-1 text-navy/55">Référence :</p>
          <div className="flex gap-1">
            <span className={`flex-1 rounded-sm border border-navy/25 px-2 py-1 font-mono ${ring('reference')}`}>{reference || ' '}</span>
            <span className="shrink-0 rounded-sm border border-navy/25 bg-[#f0f0f0] px-2 py-1">Parcourir…</span>
          </div>
        </div>
        <div>
          <p className="mb-1 text-navy/55">Toutes les références :</p>
          <div className="h-14 overflow-hidden rounded-sm border border-navy/25 bg-white">
            {refs.length === 0 ? <div className="px-2 py-1 italic text-navy/30">(vide)</div> : refs.map((r, i) => (<div key={i} className="px-2 py-0.5 font-mono text-[10px] text-navy/80">{r}</div>))}
          </div>
          <div className="mt-1 flex gap-1">
            <span className={`rounded-sm border-2 px-3 py-0.5 ${focus === 'ajouter' ? 'border-mint bg-mint/15 font-bold' : 'border-navy/25 bg-[#f0f0f0]'}`}>Ajouter</span>
            <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Supprimer</span>
          </div>
        </div>
        <div className="space-y-1 border-t border-navy/10 pt-1.5">
          <p className="text-navy/55">Étiquettes dans :</p>
          <Case l="Ligne du haut" c={ligneHaut} />
          <Case l="Colonne de gauche" c={colGauche} />
          <Case l="Lier aux données source" c={lier} />
        </div>
        <div className="flex justify-end gap-2 pt-0.5"><span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-4 py-0.5">OK</span><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Fermer</span></div>
      </div>
    </div>
  )
}

// Le volet « Champs de tableau croisé dynamique » : liste des tables/champs + 4 zones.
function ChampsTCD({ v }) {
  const { tables = [], lignes = [], valeurs = [], colonnes = [], filtres = [] } = v
  const Zone = ({ nom, items }) => (
    <div className="rounded-sm border border-navy/20 bg-[#fafafa] p-1">
      <p className="mb-0.5 text-[9px] font-semibold text-navy/50">{nom}</p>
      <div className="min-h-[18px] space-y-0.5">
        {items.map((it, i) => (<span key={i} className="block rounded-sm bg-mint/20 px-1.5 py-0.5 text-[10px] text-navy ring-1 ring-mint/40">{it}</span>))}
      </div>
    </div>
  )
  return (
    <div className="mx-auto mt-3 w-60 overflow-hidden rounded-lg border border-navy/25 text-[10px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Champs de tableau croisé dynamique</span><span className="text-navy/40">✕</span></div>
      <div className="bg-white p-2">
        <div className="mb-1 flex gap-3 border-b border-navy/10 pb-1 text-[9px]"><span className="text-navy/45">Actifs</span><span className="font-bold text-[#0a7a3d]">Tous</span></div>
        <div className="mb-2 space-y-1">
          {tables.map((t, i) => (
            <div key={i}>
              <p className="font-semibold text-navy/70">▾ {t.nom}</p>
              {t.champs.map((c, j) => (<div key={j} className="ml-2 flex items-center gap-1 text-navy/75"><span className={`grid h-3 w-3 place-items-center rounded-sm border text-[8px] ${c.coche ? 'border-mint bg-mint text-white' : 'border-navy/40'}`}>{c.coche ? '✓' : ''}</span>{c.nom}</div>))}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1">
          <Zone nom="▽ Filtres" items={filtres} />
          <Zone nom="▥ Colonnes" items={colonnes} />
          <Zone nom="☰ Lignes" items={lignes} />
          <Zone nom="Σ Valeurs" items={valeurs} />
        </div>
      </div>
    </div>
  )
}

// La fenêtre « Créer une relation » (Analyse du TCD > Relations > Nouveau).
function RelationDialog({ v }) {
  const { table = 'T_ventes', colonne = 'Zones Vente', tableAssociee = 'T_zones', colonneAssociee = 'Zones Vente' } = v
  const Champ = ({ label, val }) => (
    <div><p className="mb-0.5 text-navy/55">{label}</p><span className="flex items-center justify-between rounded-sm border border-navy/25 px-2 py-1 font-mono text-[10px]">{val}<span className="text-navy/40">▾</span></span></div>
  )
  return (
    <div className="mx-auto mt-3 max-w-sm overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Créer une relation</span><span className="text-navy/40">✕</span></div>
      <div className="space-y-2 bg-white p-3 text-navy">
        <p className="text-navy/60">Choisis les tables et les colonnes à relier :</p>
        <div className="grid grid-cols-2 gap-2">
          <Champ label="Table :" val={table} />
          <Champ label="Colonne (externe) :" val={colonne} />
          <Champ label="Table associée :" val={tableAssociee} />
          <Champ label="Colonne associée :" val={colonneAssociee} />
        </div>
        <div className="flex justify-end gap-2 pt-0.5"><span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-4 py-0.5">OK</span><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span></div>
      </div>
    </div>
  )
}

// La fenêtre « Gérer les relations » (liste des liaisons + boutons).
function GererRelations({ v }) {
  const { relations = [], focusDetection = false } = v
  return (
    <div className="mx-auto mt-3 max-w-md overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Gérer les relations</span><span className="text-navy/40">✕</span></div>
      <div className="bg-white p-3">
        <div className="overflow-hidden rounded-sm border border-navy/25">
          <div className="bg-navy/10 px-2 py-1 text-[10px] text-navy/55">Table (colonne externe) → Table associée (colonne principale)</div>
          {relations.length === 0 ? <div className="px-2 py-2 italic text-navy/30">(aucune relation pour l'instant)</div> : relations.map((r, i) => (<div key={i} className="border-t border-navy/10 px-2 py-1 font-mono text-[10px] text-navy/80">{r}</div>))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          <span className={focusDetection ? 'rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5' : 'rounded-sm border-2 border-mint bg-mint/15 px-3 py-0.5 font-bold'}>Nouveau…</span>
          <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Modifier…</span>
          <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Supprimer</span>
          <span className={focusDetection ? 'rounded-sm border-2 border-mint bg-mint/15 px-3 py-0.5 font-bold' : 'rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5'}>Détection automatique…</span>
        </div>
      </div>
    </div>
  )
}

// Animation : comme dans le vrai volet, la LISTE DES CHAMPS est EN HAUT et les QUATRE
// zones (Filtres, Colonnes, Lignes, Valeurs) EN BAS. Le champ « Vendeurs » est glissé de
// la liste vers la zone Lignes. Rejouable.
function GlisserChampTCD() {
  const [pose, setPose] = useState(false)
  const [cle, setCle] = useState(0)
  useEffect(() => {
    setPose(false)
    const id = setTimeout(() => setPose(true), 900)
    return () => clearTimeout(id)
  }, [cle])
  const Zone = ({ nom, actif }) => (
    <div className={`rounded-sm border-2 border-dashed p-1 transition-colors ${actif ? 'border-mint bg-mint/5' : 'border-navy/25 bg-[#fafafa]'}`}>
      <p className="text-[9px] font-semibold text-navy/50">{nom}</p>
      <div className="min-h-[24px]" />
    </div>
  )
  return (
    <div className="mt-3">
      <div className="relative mx-auto w-full max-w-sm rounded-md border border-navy/15 bg-white p-2">
        <p className="text-[9px] font-semibold leading-tight text-navy/60">Champs de tableau croisé dynamique</p>
        <div className="mt-1 space-y-0.5 rounded-sm border border-navy/15 bg-[#fafafa] px-1.5 py-1 text-[10px] text-navy/75">
          <p className="font-semibold text-navy/55">▾ T_vendeurs</p>
          <div className="ml-2 flex items-center gap-1.5">
            <span className={`grid h-3 w-3 place-items-center rounded-sm border text-[8px] ${pose ? 'border-mint bg-mint text-white' : 'border-navy/40 bg-white'}`}>{pose ? '✓' : ''}</span>
            <span className={pose ? 'text-navy/35' : ''}>Vendeurs</span>
          </div>
          <p className="font-semibold text-navy/55">▾ T_ventes</p>
          <div className="ml-2 flex items-center gap-1.5"><span className="grid h-3 w-3 rounded-sm border border-navy/40 bg-white" /> Montant</div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <Zone nom="▽ Filtres" />
          <Zone nom="▥ Colonnes" />
          <Zone nom="☰ Lignes" actif={pose} />
          <Zone nom="Σ Valeurs" />
        </div>
        <span className="absolute z-10 rounded-sm bg-mint/30 px-1.5 py-0.5 text-[10px] font-medium text-navy shadow ring-1 ring-mint" style={{ left: pose ? 26 : 38, top: pose ? 184 : 34, transition: 'left .9s cubic-bezier(.4,0,.2,1), top .9s cubic-bezier(.4,0,.2,1)' }}>Vendeurs</span>
      </div>
      <div className="mt-2 flex items-start justify-between gap-3">
        <p className="flex items-start gap-1.5 text-[11px] leading-snug text-navy/60">
          <span className="text-navy/40">↳</span>
          <span>{pose ? '« Vendeurs » est déposé dans la zone Lignes (en bas) : chaque vendeur devient une ligne du rapport.' : 'La liste des champs est EN HAUT, les 4 zones EN BAS. On attrape « Vendeurs » et on le glisse vers Lignes…'}</span>
        </p>
        <button onClick={() => setCle((k) => k + 1)} className="shrink-0 rounded-full bg-mint/15 px-3 py-1 text-[11px] font-bold text-mint transition hover:bg-mint/25">↻ Rejouer</button>
      </div>
    </div>
  )
}

// « Construis ton TCD » : comme dans Excel, la feuille (avec ses ONGLETS) à GAUCHE et le
// volet Champs à DROITE. L'élève ATTRAPE un champ de la liste (clic) puis le DÉPOSE dans
// une zone (clic) : le tableau croisé se remplit tout seul à chaque dépôt. Piloté par
// `sequence` [{champ, zone, consigne}] ; on voit qu'une NOUVELLE feuille (Feuil1) est née.
function TcdBuilder({ v, onResolu, onErreur }) {
  const { feuilles = ['Ventes', 'Feuil1'], feuilleActive = 'Feuil1', classeur = 'Ventes.xlsx', champs = [], sequence = [], etiquettes = [], valeurLabel = 'Somme de Montant', valeurs = [], total, explication, colonnesHeaders = [], matrice = null, totauxLignes = [], totauxColonnes = [] } = v
  const [placed, setPlaced] = useState({})
  const [etape, setEtape] = useState(0)
  const [pris, setPris] = useState(null)
  const [rate, setRate] = useState(false)
  const fini = etape >= sequence.length
  const cur = sequence[etape] || {}

  useEffect(() => {
    if (etape >= sequence.length) onResolu && onResolu()
  }, [etape])

  const contenuZone = (k) => Object.keys(placed).filter((n) => placed[n] === k)
  const lignesPlacees = Object.values(placed).includes('lignes')
  const colonnesPlacees = Object.values(placed).includes('colonnes')
  const valeursPlacees = Object.values(placed).includes('valeurs')

  const attraper = (nom) => {
    if (fini || placed[nom]) return
    setPris((p) => (p === nom ? null : nom))
  }
  const deposer = (k) => {
    if (fini || !pris) return
    if (pris === cur.champ && k === cur.zone) {
      setPlaced((p) => ({ ...p, [pris]: k }))
      setPris(null)
      setEtape((e) => e + 1)
    } else {
      setRate(true)
      onErreur && onErreur()
      setTimeout(() => {
        setRate(false)
        setPris(null)
      }, 900)
    }
  }

  const zones = [
    { k: 'filtres', nom: '▽ Filtres' },
    { k: 'colonnes', nom: '▥ Colonnes' },
    { k: 'lignes', nom: '☰ Lignes' },
    { k: 'valeurs', nom: 'Σ Valeurs' },
  ]

  return (
    <div className="mt-3">
      {!fini && (
        <p className="mb-2 rounded-xl bg-navy/5 px-3 py-2 text-center text-sm font-bold text-navy">
          👆 {pris ? `« ${pris} » attrapé : clique la zone où le déposer` : cur.consigne}
        </p>
      )}
      <div className="animate-fade-up overflow-hidden rounded-xl border border-navy/15 bg-white shadow-lg">
        <div className="flex items-center gap-2 bg-[#1f7a4d] px-3 py-1 text-[10px] text-white"><span className="font-semibold">📗 {classeur}</span><span className="ml-auto opacity-80">▢&nbsp;&nbsp;✕</span></div>
        <div className="flex gap-2 p-2">
          <div className="min-w-0 flex-1">
            <div className="rounded border border-navy/15 bg-[#fafafa] p-1.5 text-[10px]">
              {!lignesPlacees ? (
                <div className="grid min-h-[132px] place-items-center px-1 text-center leading-tight text-navy/40">
                  <span>Tableau croisé<br />dynamique<br /><span className="text-[9px]">(dépose un champ<br />pour commencer)</span></span>
                </div>
              ) : matrice && colonnesPlacees ? (
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border border-navy/15 bg-navy/10 px-1.5 py-1 font-bold text-navy/60">Somme de Montant</td>
                      {colonnesHeaders.map((h, j) => (<td key={j} className="border border-navy/15 bg-navy/10 px-1.5 py-1 text-right font-bold text-navy/70">{h}</td>))}
                      {valeursPlacees && <td className="border border-navy/15 bg-navy/10 px-1.5 py-1 text-right font-bold text-navy/70">Total</td>}
                    </tr>
                    {etiquettes.map((et, i) => (
                      <tr key={i}>
                        <td className="border border-navy/15 px-1.5 py-1 font-semibold text-navy/85">{et}</td>
                        {colonnesHeaders.map((_, j) => (<td key={j} className="border border-navy/15 px-1.5 py-1 text-right text-mint-dark">{valeursPlacees ? matrice[i][j] : ''}</td>))}
                        {valeursPlacees && <td className="border border-navy/15 px-1.5 py-1 text-right font-semibold text-navy/80">{totauxLignes[i]}</td>}
                      </tr>
                    ))}
                    {valeursPlacees && (
                      <tr>
                        <td className="border border-navy/15 bg-navy/5 px-1.5 py-1 font-bold text-navy/70">Total</td>
                        {totauxColonnes.map((t, j) => (<td key={j} className="border border-navy/15 bg-navy/5 px-1.5 py-1 text-right font-bold text-navy/80">{t}</td>))}
                        <td className="border border-navy/15 bg-navy/5 px-1.5 py-1 text-right font-bold text-navy/80">{total}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="w-full border-collapse">
                  <tbody>
                    <tr><td className="border border-navy/15 bg-navy/10 px-1.5 py-1 font-bold text-navy/70">Étiquettes de lignes</td>{valeursPlacees && <td className="border border-navy/15 bg-navy/10 px-1.5 py-1 text-right font-bold text-navy/70">{valeurLabel}</td>}</tr>
                    {etiquettes.map((et, i) => (
                      <tr key={i}><td className="border border-navy/15 px-1.5 py-1 text-navy/85">{et}</td>{valeursPlacees && <td className="border border-navy/15 px-1.5 py-1 text-right font-semibold text-mint-dark">{valeurs[i]}</td>}</tr>
                    ))}
                    {valeursPlacees && <tr><td className="border border-navy/15 bg-navy/5 px-1.5 py-1 font-bold text-navy/70">Total général</td><td className="border border-navy/15 bg-navy/5 px-1.5 py-1 text-right font-bold text-navy/80">{total}</td></tr>}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className="w-40 shrink-0 rounded border border-navy/15 text-[10px]">
            <div className="border-b border-navy/10 bg-[#f3f3f3] px-1.5 py-1 font-semibold text-navy/70">Champs de TCD</div>
            <div className="p-1.5">
              <p className="mb-0.5 font-semibold text-navy/55">▾ Ventes</p>
              <div className="mb-2 space-y-0.5">
                {champs.map((nom) => {
                  const libre = !placed[nom]
                  const estPris = pris === nom
                  return (
                    <div key={nom} onClick={libre ? () => attraper(nom) : undefined} className={`flex items-center gap-1 rounded px-1 py-0.5 ${libre ? 'cursor-pointer hover:bg-mint/10' : 'opacity-30'} ${estPris ? 'bg-mint/25 ring-1 ring-mint' : ''}`}>
                      <span className={`grid h-3 w-3 shrink-0 place-items-center rounded-sm border text-[8px] ${!libre ? 'border-mint bg-mint text-white' : 'border-navy/40'}`}>{!libre ? '✓' : ''}</span>{nom}
                    </div>
                  )
                })}
              </div>
              <div className="grid grid-cols-2 gap-1">
                {zones.map((z) => {
                  const items = contenuZone(z.k)
                  const cible = pris && cur.zone === z.k
                  return (
                    <div key={z.k} onClick={pris ? () => deposer(z.k) : undefined} className={`rounded-sm border p-1 transition ${pris ? 'cursor-pointer' : ''} ${cible ? 'animate-pulse border-mint bg-mint/10 ring-1 ring-mint' : 'border-navy/20 bg-[#fafafa]'}`}>
                      <p className="text-[9px] font-semibold text-navy/50">{z.nom}</p>
                      <div className="min-h-[16px] space-y-0.5">{items.map((n) => (<span key={n} className="block truncate rounded-sm bg-mint/20 px-1 py-0.5 text-[9px] text-navy ring-1 ring-mint/40">{n}</span>))}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-end gap-1 border-t border-navy/10 bg-navy/5 px-2 pt-1 text-[10px]">
          {feuilles.map((f) => (<span key={f} className={`rounded-t px-2.5 py-0.5 ${f === feuilleActive ? 'bg-white font-bold text-navy' : 'bg-navy/10 text-navy/50'}`}>{f}</span>))}
          <span className="px-1 text-navy/35">＋</span>
        </div>
      </div>
      {fini ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-mint/15 px-3 py-2 text-sm text-navy/90"><span className="font-bold text-mint">✓ TCD construit ! 🥋</span> {explication}</p>
      ) : rate ? (
        <p className="mt-2 rounded-xl bg-navy/10 px-3 py-2 text-sm font-medium text-navy/90">Pas cette zone. Reclique le champ, puis dépose-le dans la bonne zone.</p>
      ) : null}
    </div>
  )
}

// « Manipule ton TCD » : le classeur ENTIER (onglets + TCD) reste visible ; l'élève
// déclenche une action (clic droit → menu, ou bouton du ruban) et VOIT le TCD changer en
// direct (une ligne s'ajoute à l'actualisation, dates regroupées, valeurs en %…). Props :
// `avant`/`apres` = { titre, valeurTitre, lignes:[{et,val,nouvelle?}], total }.
function TcdScene({ v, onResolu, onErreur }) {
  const { feuilles = ['Ventes', 'Feuil1'], feuilleActive = 'Feuil1', classeur = 'Ventes.xlsx', consigne, declencheur = 'menu', clicDroitLabel = 'Clic droit sur le TCD', items = [], onglets = ['Fichier', 'Accueil', 'Insertion', 'Analyse du TCD', 'Création'], groupeNom, groupes = [], cible, avant = {}, apres = {}, explication } = v
  const [fait, setFait] = useState(false)
  const [rates, setRates] = useState([])
  const tcd = fait ? apres : avant
  const choisir = (val) => {
    if (fait) return
    if (val === cible) {
      setFait(true)
      onResolu && onResolu()
    } else if (!rates.includes(val)) {
      setRates((r) => [...r, val])
      onErreur && onErreur()
    }
  }

  const Tcd = () => (
    <table className="border-collapse text-[10px]">
      <tbody>
        <tr>
          <td className="border border-navy/15 bg-navy/10 px-2 py-1 font-bold text-navy/70">{tcd.titre || 'Étiquettes de lignes'}</td>
          <td className="border border-navy/15 bg-navy/10 px-2 py-1 text-right font-bold text-navy/70">{tcd.valeurTitre || 'Somme de Montant'}</td>
        </tr>
        {(tcd.lignes || []).map((l, i) => (
          <tr key={i} className={fait && l.nouvelle ? 'animate-fade-up' : ''}>
            <td className={`border border-navy/15 px-2 py-1 text-navy/85 ${fait && l.nouvelle ? 'bg-mint/20 font-semibold' : ''}`}>{l.et}</td>
            <td className={`border border-navy/15 px-2 py-1 text-right ${fait ? 'font-semibold text-mint-dark' : 'text-navy/85'}`}>{l.val}</td>
          </tr>
        ))}
        {tcd.total && (
          <tr><td className="border border-navy/15 bg-navy/5 px-2 py-1 font-bold text-navy/70">Total général</td><td className="border border-navy/15 bg-navy/5 px-2 py-1 text-right font-bold text-navy/80">{tcd.total}</td></tr>
        )}
      </tbody>
    </table>
  )

  return (
    <div className="mt-3">
      {!fait && consigne && <p className="mb-2 rounded-xl bg-navy/5 px-3 py-2 text-center text-sm font-bold text-navy">👆 {consigne}</p>}
      <div className="animate-fade-up overflow-hidden rounded-xl border border-navy/15 bg-white shadow-lg">
        <div className="flex items-center gap-2 bg-[#1f7a4d] px-3 py-1 text-[10px] text-white"><span className="font-semibold">📗 {classeur}</span><span className="ml-auto opacity-80">▢&nbsp;&nbsp;✕</span></div>
        {declencheur === 'ruban' && (
          <div className="border-b border-navy/10 bg-[#f3f3f3] px-2 pt-1">
            <div className="flex gap-0.5 text-[10px]">{onglets.map((o) => (<span key={o} className={`rounded-t px-2 py-1 ${o === (v.actif || 'Analyse du TCD') ? 'bg-white font-bold text-[#0a7a3d]' : 'text-navy/55'}`}>{o}</span>))}</div>
            <div className="flex items-start gap-2 bg-white px-2 py-1.5">
              <div className="rounded-md border border-navy/15 bg-navy/[0.02] px-1.5 pb-1 pt-1">
                <div className="flex items-end gap-1">
                  {groupes.map((g, i) => {
                    const bon = fait && g.label === cible
                    const rate = rates.includes(g.label)
                    return (
                      <div key={i} onClick={!fait && !rate ? () => choisir(g.label) : undefined} className={`flex w-16 flex-col items-center gap-1 rounded px-1 py-1 text-center text-[10px] ${!fait && !rate ? 'cursor-pointer hover:bg-mint/10' : ''} ${bon ? 'bg-mint/20 ring-2 ring-mint' : rate ? 'opacity-30' : ''}`}>
                        <span className="grid h-6 w-6 place-items-center rounded text-sm text-navy/70">{g.icone}</span>
                        <span className="leading-tight text-navy/75">{g.label.split('\n').map((l, j) => (<span key={j} className="block">{l}</span>))}</span>
                      </div>
                    )
                  })}
                </div>
                {groupeNom && <div className="mt-1 border-t border-navy/10 pt-0.5 text-center text-[9px] font-semibold text-navy/60">{groupeNom}</div>}
              </div>
            </div>
          </div>
        )}
        <div className="flex items-start gap-2 p-2">
          <div className="min-w-0 flex-1 overflow-x-auto"><Tcd /></div>
          {declencheur === 'menu' && !fait && (
            <div className="w-40 shrink-0">
              <p className="mb-1 text-center text-[9px] font-bold uppercase tracking-wide text-navy/40">🖱 {clicDroitLabel}</p>
              <div className="overflow-hidden rounded-md border border-navy/20 bg-white text-[11px] shadow-xl">
                {items.map((it, i) => {
                  const label = typeof it === 'string' ? it : it.label
                  if (label === '-') return <div key={i} className="my-0.5 border-t border-navy/10" />
                  const rate = rates.includes(i)
                  return (
                    <div key={i} onClick={!rate ? () => choisir(i) : undefined} className={`flex items-center gap-2 px-3 py-1.5 transition ${!rate ? 'cursor-pointer hover:bg-mint/10' : 'text-navy/30'} text-navy/80`}>
                      {typeof it === 'object' && it.icone && <span className="w-4 text-center">{it.icone}</span>}
                      <span>{label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-end gap-1 border-t border-navy/10 bg-navy/5 px-2 pt-1 text-[10px]">
          {feuilles.map((f) => (<span key={f} className={`rounded-t px-2.5 py-0.5 ${f === feuilleActive ? 'bg-white font-bold text-navy' : 'bg-navy/10 text-navy/50'}`}>{f}</span>))}
          <span className="px-1 text-navy/35">＋</span>
        </div>
      </div>
      {fait ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-mint/15 px-3 py-2 text-sm text-navy/90"><span className="font-bold text-mint">✓ Bien joué ! 🥋</span> {explication}</p>
      ) : rates.length > 0 ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-navy/10 px-3 py-2 text-sm font-medium text-navy/90">{ENCOURAGEMENTS_Q[(rates.length - 1) % ENCOURAGEMENTS_Q.length]}</p>
      ) : null}
    </div>
  )
}

// Le PLAN d'une consolidation liée : les boutons de niveaux 1/2 en haut à gauche, et les
// boutons + / – dans la marge pour développer ou masquer le détail de chaque groupe.
function PlanConso() {
  const rows = [
    { g: '', txt: 'Janvier', val: '12 400 €', detail: true },
    { g: '', txt: 'Février', val: '13 800 €', detail: true },
    { g: '', txt: 'Mars', val: '12 000 €', detail: true },
    { g: '−', txt: 'Ebook Excel', val: '38 200 €', bold: true },
    { g: '+', txt: 'Ebook Shaolin', val: '28 500 €', bold: true },
    { g: '+', txt: 'Formations', val: '21 900 €', bold: true },
  ]
  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div className="w-72 overflow-hidden rounded-md border border-navy/15 shadow">
        <div className="flex items-center gap-1 border-b border-navy/15 bg-navy/5 px-2 py-1">
          {[1, 2].map((n) => (
            <span key={n} className="grid h-4 w-4 place-items-center rounded-sm border border-navy/35 bg-white text-[9px] font-bold text-navy/70">{n}</span>
          ))}
          <span className="ml-1 text-[9px] text-navy/40">← niveaux de plan</span>
        </div>
        <div className="text-[11px]">
          {rows.map((r, i) => (
            <div key={i} className={`flex items-stretch border-b border-navy/10 ${r.bold ? 'bg-mint/10 font-bold text-navy' : 'text-navy/70'}`}>
              <span className="grid w-6 shrink-0 place-items-center border-r border-navy/10">
                {r.g && <span className="grid h-3.5 w-3.5 place-items-center rounded-sm border border-navy/40 bg-white text-[10px] font-bold text-navy">{r.g}</span>}
              </span>
              <span className={`flex-1 px-2 py-1 ${r.detail ? 'pl-5 italic' : ''}`}>{r.txt}</span>
              <span className="px-3 py-1 text-right">{r.val}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="max-w-sm text-center text-[11px] leading-snug text-navy/60">
        <span className="text-navy/40">↳ </span>« <strong className="font-bold text-navy">−</strong> » = groupe développé (le détail des 3 mois d'Ebook Excel est visible) ; « <strong className="font-bold text-navy">+</strong> » = groupe fermé (seul le total s'affiche). Les boutons <strong className="font-bold text-navy">1 / 2</strong> (en haut à gauche) changent le niveau pour tout le tableau.
      </p>
    </div>
  )
}

// La feuille TCD ENTIÈRE : à gauche la zone du rapport (vide « prêt à configurer », ou le
// vrai rapport croisé avec Étiquettes de lignes ▾ / Somme de Montant / Total général) et à
// droite la fenêtre « Champs de tableau croisé dynamique » dockée, + les onglets en bas.
function VueTCD({ v }) {
  const { rapport = false, legende } = v || {}
  const Zone = ({ nom, items }) => (
    <div className="rounded-sm border border-navy/20 bg-white p-0.5">
      <p className="text-[8px] font-semibold text-navy/50">{nom}</p>
      <div className="min-h-[14px] space-y-0.5">
        {items.map((it, i) => (
          <span key={i} className="block truncate rounded-sm bg-mint/20 px-1 py-0.5 text-[8px] text-navy ring-1 ring-mint/40">{it}</span>
        ))}
      </div>
    </div>
  )
  const tables = [
    { nom: 'T_ventes', champs: [{ n: 'Zones Vente' }, { n: 'Montant', c: rapport }] },
    { nom: 'T_zones', champs: [{ n: 'Zones Vente' }, { n: 'Bureau' }] },
    { nom: 'T_vendeurs', champs: [{ n: 'Vendeurs', c: rapport }, { n: 'Grade' }] },
  ]
  return (
    <div className="mt-3">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-md border border-navy/25 shadow-xl">
        <div className="flex items-center bg-[#1f7a4d] px-2 py-1 text-[10px] text-white">
          <span className="font-semibold">📗 Consolidation.xlsx — Excel</span>
          <span className="ml-auto opacity-80">▢&nbsp;&nbsp;✕</span>
        </div>
        <div className="flex bg-white">
          <div className="flex-1 p-2">
            {rapport ? (
              <div className="overflow-hidden rounded-sm border border-navy/20 text-[10px]">
                <div className="grid border-b border-navy/15 bg-[#dbeafe] font-semibold text-navy" style={{ gridTemplateColumns: '1.3fr 1fr' }}>
                  <span className="flex items-center justify-between px-2 py-1">Étiquettes de lignes <span className="text-navy/50">▾</span></span>
                  <span className="border-l border-navy/15 px-2 py-1">Somme de Montant</span>
                </div>
                {[['Karim', '18 700 €'], ['Léa', '14 600 €'], ['Marie', '8 200 €']].map(([n, m], i) => (
                  <div key={i} className={`grid ${i % 2 ? 'bg-navy/[0.03]' : 'bg-white'}`} style={{ gridTemplateColumns: '1.3fr 1fr' }}>
                    <span className="px-2 py-0.5 text-navy/85">{n}</span>
                    <span className="border-l border-navy/10 px-2 py-0.5 text-right text-navy/85">{m}</span>
                  </div>
                ))}
                <div className="grid border-t-2 border-navy/30 bg-[#dbeafe]/60 font-bold text-navy" style={{ gridTemplateColumns: '1.3fr 1fr' }}>
                  <span className="px-2 py-0.5">Total général</span>
                  <span className="border-l border-navy/15 px-2 py-0.5 text-right">41 500 €</span>
                </div>
              </div>
            ) : (
              <div className="grid h-40 place-items-center rounded-sm border-2 border-navy/30 p-2 text-center">
                <div>
                  <p className="text-[10px] font-semibold text-navy/70">TableauCroisédynamique1</p>
                  <p className="mx-auto mt-1 max-w-[150px] text-[9px] leading-snug text-navy/45">Pour générer un rapport, choisissez des champs dans la liste des champs de tableau croisé dynamique</p>
                </div>
              </div>
            )}
          </div>
          <div className="w-40 shrink-0 border-l border-navy/15 bg-[#fafafa] p-1.5 text-[9px]">
            <p className="font-semibold leading-tight text-navy/80">Champs de tableau croisé dynamique</p>
            <div className="mb-1 mt-1 flex gap-2 border-b border-navy/10 pb-0.5 text-[8px]"><span className="text-navy/45">Actifs</span><span className="font-bold text-[#0a7a3d]">Tous</span></div>
            <div className="mb-1.5 space-y-0.5">
              {tables.map((t, i) => (
                <div key={i}>
                  <p className="font-semibold text-navy/70">▾ {t.nom}</p>
                  {t.champs.map((c2, j) => (
                    <div key={j} className="ml-1.5 flex items-center gap-1 text-[8px] text-navy/75">
                      <span className={`grid h-2.5 w-2.5 place-items-center rounded-sm border text-[7px] ${c2.c ? 'border-mint bg-mint text-white' : 'border-navy/40'}`}>{c2.c ? '✓' : ''}</span>
                      {c2.n}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1">
              <Zone nom="▽ Filtres" items={[]} />
              <Zone nom="▥ Colonnes" items={[]} />
              <Zone nom="☰ Lignes" items={rapport ? ['Vendeurs'] : []} />
              <Zone nom="Σ Valeurs" items={rapport ? ['Somme de Montant'] : []} />
            </div>
          </div>
        </div>
        <div className="flex items-end gap-1 border-t border-navy/15 bg-navy/5 px-2 pb-0.5 pt-1 text-[9px]">
          {['Ventes', 'Zones Vente', 'Vendeurs', 'TCD'].map((f) => (
            <span key={f} className={`rounded-t px-2 py-0.5 ${f === 'TCD' ? 'bg-white font-bold text-navy shadow ring-1 ring-navy/20' : 'text-navy/55'}`}>{f}</span>
          ))}
          <span className="px-1 text-navy/40">＋</span>
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

// ---------- Chapitre 10 : mise en forme conditionnelle & fonctions conditionnelles ----------
const MFC_DATA = [
  ['Marie', '8 200 €', 8200],
  ['Karim', '12 500 €', 12500],
  ['Léa', '4 300 €', 4300],
  ['Tom', '15 800 €', 15800],
  ['Nina', '6 100 €', 6100],
]

// Un tableau de ventes AVEC ou SANS mise en forme conditionnelle : surbrillance rouge sous
// un seuil, barres de données, jeu d'icônes, NUANCES de couleurs (dégradé), règle par
// FORMULE (vert au-dessus d'un seuil) ou DOUBLONS (noms en double surlignés).
// `avant` = version brute (pour l'avant/après) ; `data` = autres lignes que MFC_DATA.
function MFCTableau({ v }) {
  const { style, avant = false, seuil = 7000, legende, data } = v
  const rows = data || MFC_DATA
  const max = Math.max(...rows.map((r) => r[2]))
  const counts = {}
  rows.forEach(([nom]) => {
    counts[nom] = (counts[nom] || 0) + 1
  })
  const icone = (n) => (n >= 12000 ? { s: '▲', c: '#1f9d57' } : n >= 7000 ? { s: '▬', c: '#d9a406' } : { s: '▼', c: '#d33' })
  const nuance = (n) => (n >= 12000 ? '#c6efce' : n >= 7000 ? '#ffeb9c' : '#ffc7ce')
  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div className="overflow-hidden rounded-md border border-navy/15 shadow">
        <table className="border-collapse text-[11px]">
          <thead><tr>{['Vendeur', 'Ventes'].map((h) => (<th key={h} className="border-b-2 border-mint bg-mint/25 px-4 py-1 font-bold text-navy">{h}</th>))}</tr></thead>
          <tbody>
            {rows.map(([nom, aff, n], i) => {
              const rouge = !avant && style === 'surbrillance' && n < seuil
              const vert = !avant && style === 'formule' && n >= 12000
              const doublon = !avant && style === 'doublons' && counts[nom] > 1
              const fondNuance = !avant && style === 'nuances' ? { background: nuance(n) } : vert ? { background: '#c6efce' } : undefined
              return (
                <tr key={i} className={i % 2 ? 'bg-navy/[0.03]' : 'bg-white'}>
                  <td className={`border-b border-navy/10 px-4 py-1 ${doublon ? 'bg-red-500/25 font-semibold text-red-700' : 'text-navy/85'}`}>{nom}</td>
                  <td className={`relative border-b border-navy/10 px-4 py-1 ${rouge ? 'bg-red-500/25 font-semibold text-red-700' : vert ? 'font-semibold text-[#1f7a4d]' : 'text-navy/85'}`} style={fondNuance}>
                    {!avant && style === 'barres' && <span className="absolute inset-y-1 left-1 rounded-sm bg-mint/40" style={{ width: `${(n / max) * 72}%` }} />}
                    <span className="relative flex items-center gap-1.5">
                      {!avant && style === 'icones' && <span style={{ color: icone(n).c }}>{icone(n).s}</span>}
                      {aff}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {legende && <p className="max-w-sm text-center text-[11px] leading-snug text-navy/60"><span className="text-navy/40">↳ </span>{legende}</p>}
    </div>
  )
}

// Le menu déroulant « Mise en forme conditionnelle » (Accueil > Styles), une entrée surlignée.
function MFCMenu({ v }) {
  const actif = v?.actif ?? 0
  const items = ['Règles de mise en surbrillance des cellules', 'Règles des valeurs de plage haute/basse', 'Barres de données', 'Nuances de couleurs', 'Jeux d\'icônes', 'Nouvelle règle…', 'Effacer les règles', 'Gérer les règles…']
  const icons = ['▦', '📊', '▬', '🎨', '🚦', '＋', '⌫', '⚙']
  return (
    <div className="mx-auto mt-3 w-72 overflow-hidden rounded-md border border-navy/20 bg-white py-0.5 text-[10px] shadow-xl">
      {items.map((it, i) => (
        <div key={i} className={`flex items-center justify-between px-2 py-1 ${i === actif ? 'bg-mint/15 font-semibold text-navy' : 'text-navy/75'}`}>
          <span className="flex items-center gap-1.5"><span className="w-3 text-center">{icons[i]}</span>{it}</span>
          {i < 5 && <span className="text-navy/40">▸</span>}
        </div>
      ))}
    </div>
  )
}

// Une petite fenêtre de règle (ex. « Inférieur à ») : le seuil + le style de mise en forme.
function MFCDialog({ v }) {
  const { titre = 'Inférieur à', valeur = '7000', style = 'Remplissage rouge clair, texte rouge foncé', phrase } = v
  return (
    <div className="mx-auto mt-3 max-w-sm overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>{titre}</span><span className="text-navy/40">✕</span></div>
      <div className="space-y-2 bg-white p-3 text-navy">
        <p className="text-navy/70">Mettre en forme les cellules {phrase || (<>qui sont <strong>{titre.toUpperCase()}</strong></>)} :</p>
        <div className="flex items-center gap-2">
          <span className="min-w-[70px] rounded-sm border-2 border-mint bg-white px-2 py-1 text-center font-mono">{valeur}</span>
          <span className="text-navy/55">avec</span>
          <span className="flex items-center gap-1 rounded-sm border border-navy/25 bg-[#fde8e8] px-2 py-1 text-red-700">{style}<span className="text-navy/40">▾</span></span>
        </div>
        <div className="flex justify-end gap-2 pt-0.5"><span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-4 py-0.5">OK</span><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span></div>
      </div>
    </div>
  )
}

// La fenêtre « Nouvelle règle de mise en forme » : les types de règles (le dernier,
// « Utiliser une formule… », sélectionné), la zone de formule et l'aperçu du format.
function NouvelleRegle({ v }) {
  const formule = v?.formule || '=B2>=12000'
  const types = [
    "Mettre en forme toutes les cellules d'après leur valeur",
    'Appliquer une mise en forme uniquement aux cellules qui contiennent',
    'Appliquer une mise en forme aux valeurs de début ou de fin de plage',
    'Utiliser une formule pour déterminer pour quelles cellules le format sera appliqué',
  ]
  return (
    <div className="mx-auto mt-3 max-w-md overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Nouvelle règle de mise en forme</span><span className="text-navy/40">✕</span></div>
      <div className="bg-white p-3">
        <p className="mb-1 text-navy/55">Sélectionnez un type de règle :</p>
        <div className="mb-2 overflow-hidden rounded-sm border border-navy/25 text-[10px]">
          {types.map((t, i) => (
            <div key={i} className={`px-2 py-1 ${i === types.length - 1 ? 'bg-[#cfe2ff] font-semibold text-navy' : 'text-navy/70'}`}>▸ {t}</div>
          ))}
        </div>
        <p className="mb-1 text-navy/55">Appliquer une mise en forme aux valeurs pour lesquelles cette formule est vraie :</p>
        <div className="mb-2 rounded-sm border-2 border-mint bg-white px-2 py-1 font-mono text-navy">{formule}</div>
        <div className="flex items-center gap-2">
          <span className="text-navy/55">Aperçu :</span>
          <span className="rounded-sm border border-navy/20 bg-[#c6efce] px-3 py-0.5 text-[#1f7a4d]">AaBbCc</span>
          <span className="ml-auto rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Format…</span>
        </div>
        <div className="mt-2 flex justify-end gap-2"><span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-4 py-0.5">OK</span><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span></div>
      </div>
    </div>
  )
}

// Le « Gestionnaire des règles de mise en forme conditionnelle » (liste + boutons).
function GestionRegles({ v }) {
  const regles = v?.regles || [{ desc: 'Jeu d\'icônes (3 flèches)', plage: '=$B$2:$B$6' }]
  const sel = v?.selection ?? 0
  return (
    <div className="mx-auto mt-3 max-w-md overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Gestionnaire des règles de mise en forme conditionnelle</span><span className="text-navy/40">✕</span></div>
      <div className="bg-white p-3">
        <div className="mb-2 flex gap-1">
          <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-2 py-0.5">＋ Nouvelle règle</span>
          <span className="rounded-sm border-2 border-mint bg-mint/15 px-2 py-0.5 font-bold">✎ Modifier la règle…</span>
          <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-2 py-0.5">✕ Supprimer</span>
        </div>
        <div className="overflow-hidden rounded-sm border border-navy/25">
          <div className="grid bg-navy/10 text-navy/55" style={{ gridTemplateColumns: '2fr 1.2fr' }}><span className="px-2 py-1">Règle (dans l'ordre)</span><span className="border-l border-navy/10 px-2 py-1">S'applique à</span></div>
          {regles.map((r, i) => (<div key={i} className={`grid ${i === sel ? 'bg-[#cfe2ff]' : 'bg-white'}`} style={{ gridTemplateColumns: '2fr 1.2fr' }}><span className="border-t border-navy/10 px-2 py-1 text-navy">{r.desc}</span><span className="border-l border-t border-navy/10 px-2 py-1 font-mono text-navy/70">{r.plage}</span></div>))}
        </div>
      </div>
    </div>
  )
}

// La fenêtre « Modifier la règle » d'un jeu d'icônes : chaque icône + son seuil (Valeur/Type).
function RegleIcones({ v }) {
  const lignes = v?.lignes || [{ icone: '▲', c: '#1f9d57', op: '>=', val: '67' }, { icone: '▬', c: '#d9a406', op: '>=', val: '33' }, { icone: '▼', c: '#d33', op: '<', val: '33' }]
  return (
    <div className="mx-auto mt-3 max-w-sm overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Modifier la règle de mise en forme</span><span className="text-navy/40">✕</span></div>
      <div className="bg-white p-3">
        <p className="mb-1.5 font-semibold text-navy/75">Afficher chaque icône selon ces règles :</p>
        <div className="grid text-[9px] text-navy/50" style={{ gridTemplateColumns: '1.3fr 0.8fr 1.3fr' }}><span>Icône</span><span>quand</span><span>Valeur · Type</span></div>
        <div className="space-y-1">
          {lignes.map((l, i) => (
            <div key={i} className="grid items-center gap-1" style={{ gridTemplateColumns: '1.3fr 0.8fr 1.3fr' }}>
              <span className="flex items-center gap-1"><span className="text-base" style={{ color: l.c }}>{l.icone}</span><span className="text-navy/55">{i === 0 ? 'quand ≥' : i === lignes.length - 1 ? 'sinon <' : 'sinon ≥'}</span></span>
              <span className="rounded-sm border border-navy/25 px-1 py-0.5 text-center font-mono">{l.op}</span>
              <span className="flex items-center gap-1 rounded-sm border-2 border-mint px-1 py-0.5 ring-1 ring-mint"><span className="flex-1 text-center font-mono">{l.val}</span><span className="text-navy/40">Nombre ▾</span></span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-end gap-2"><span className="rounded-sm border-2 border-[#0a63c9] bg-[#f0f0f0] px-4 py-0.5">OK</span><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span></div>
      </div>
    </div>
  )
}

// Le lexique des erreurs Excel : Erreur / Quand ? / Comment corriger.
function ErreursExcel({ v }) {
  const erreurs = v?.erreurs || [
    { e: '#DIV/0!', q: 'Division par zéro ou dénominateur vide', c: 'Entoure la division de SIERREUR(… ; "")' },
    { e: '#VALEUR!', q: 'Format incompatible (ex. texte + nombre)', c: 'Corrige le format de la cellule' },
    { e: '#NOM ?', q: 'Nom ou référence non valide (faute de frappe)', c: 'Corrige l\'orthographe / le nom de plage' },
    { e: '#N/A', q: 'Une recherche ne trouve pas la valeur', c: 'SI.NON.DISPO(… ; 0) pour remplacer' },
    { e: '#NUL!', q: 'Un deux-points manque dans la plage (A1B1)', c: 'Ajoute le : → A1:B1' },
    { e: '#NOMBRE!', q: 'Nombre trop grand ou calcul impossible', c: 'Vérifie tes calculs intermédiaires' },
    { e: '#####', q: 'La colonne est trop étroite pour le contenu', c: 'Élargis la colonne' },
  ]
  return (
    <div className="mt-3 overflow-hidden rounded-md border border-navy/15 text-[11px] shadow">
      <div className="grid bg-mint/25 font-bold text-navy" style={{ gridTemplateColumns: '0.9fr 1.7fr 1.6fr' }}><span className="px-2 py-1">Erreur</span><span className="px-2 py-1">Quand ?</span><span className="px-2 py-1">Comment corriger</span></div>
      {erreurs.map((x, i) => (
        <div key={i} className={`grid ${i % 2 ? 'bg-navy/[0.03]' : 'bg-white'}`} style={{ gridTemplateColumns: '0.9fr 1.7fr 1.6fr' }}>
          <span className="border-t border-navy/10 px-2 py-1 font-mono font-bold text-red-600">{x.e}</span>
          <span className="border-t border-navy/10 px-2 py-1 text-navy/80">{x.q}</span>
          <span className="border-t border-navy/10 px-2 py-1 text-navy/70">{x.c}</span>
        </div>
      ))}
    </div>
  )
}

// Deux tableaux liés par une clé commune (le décor des fonctions de recherche, ch.11).
// t1/t2 : { titre, entetes, lignes, cle (index de colonne), valeur (index) }.
// horizontal:true sur t2 = tableau en lignes (clé sur la 1re LIGNE, pour RECHERCHEH).
function DeuxTableaux({ v }) {
  const { t1, t2, legende } = v
  const Table = ({ t, horizontal }) => (
    <div className="min-w-0">
      <p className="mb-1 text-center text-[10px] font-black uppercase tracking-wide text-navy/45">{t.titre}</p>
      <div className="overflow-hidden rounded-md border border-navy/15 bg-white shadow">
        <table className="w-full border-collapse text-[10.5px]">
          <tbody>
            {[t.entetes, ...t.lignes].map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => {
                  const estEntete = horizontal ? c === 0 : r === 0
                  const estCle = horizontal ? r === t.cle : c === t.cle
                  const estVal = t.valeur != null && (horizontal ? r === t.valeur : c === t.valeur)
                  return (
                    <td key={c} className={`border-b border-navy/10 px-2 py-1 ${estEntete ? 'bg-navy/5 font-bold text-navy' : 'text-navy/80'} ${estCle ? 'bg-mint/20' : ''} ${estVal ? 'bg-amber-400/20' : ''}`}>{cell || ' '}</td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-1 flex justify-center gap-2 text-[9px] font-bold">
        <span className="rounded-full bg-mint/20 px-2 py-0.5 text-mint-dark">🔑 clé commune</span>
        {t.valeur != null && <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-amber-700">→ valeur à extraire</span>}
      </div>
    </div>
  )
  return (
    <div className="mt-3">
      <div className="grid gap-3 sm:grid-cols-2 sm:items-start">
        <Table t={t1} horizontal={t1.horizontal} />
        <Table t={t2} horizontal={t2.horizontal} />
      </div>
      {legende && <p className="mt-2 text-center text-xs text-navy/60">{legende}</p>}
    </div>
  )
}

// La fenêtre « Nouveau nom » (Formules > Définir un nom, ou clic droit > Définir un nom).
function DefinirNom({ v }) {
  const { nom = 'PrixHT', zone = 'Classeur', reference = '=Feuil1!$B$2:$B$11', focus } = v
  const Champ = ({ label, valeur, cle, deroulant }) => (
    <div className="grid items-center gap-2" style={{ gridTemplateColumns: '90px 1fr' }}>
      <span className="text-right text-navy/70">{label}</span>
      <span className={`flex items-center justify-between rounded-sm border bg-white px-2 py-1 font-mono ${focus === cle ? 'border-2 border-mint ring-1 ring-mint' : 'border-navy/25'}`}>
        <span>{valeur}</span>
        {deroulant && <span className="text-navy/40">▾</span>}
      </span>
    </div>
  )
  return (
    <div className="mx-auto mt-3 max-w-sm overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
      <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Nouveau nom</span><span className="text-navy/40">✕</span></div>
      <div className="space-y-1.5 bg-white p-3">
        <Champ label="Nom :" valeur={nom} cle="nom" />
        <Champ label="Zone :" valeur={zone} cle="zone" deroulant />
        <Champ label="Fait référence à :" valeur={reference} cle="reference" />
        <div className="mt-2 flex justify-end gap-2"><span className={`rounded-sm px-4 py-0.5 ${focus === 'ok' ? 'border-2 border-mint bg-mint/15 font-bold' : 'border-2 border-[#0a63c9] bg-[#f0f0f0]'}`}>OK</span><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5">Annuler</span></div>
      </div>
    </div>
  )
}

// « Repérer les zones du ruban Accueil » : ruban numéroté, on clique un bouton
// pour découvrir sa fonction (exploration, l'élève participe).
function RubanZones() {
  const [sel, setSel] = useState(null)
  const F = { 1: 'Choix de la police', 2: 'Taille du texte', 3: 'Augmenter la taille de la police', 4: 'Réduire la taille de la police', 5: 'Alignement vertical : haut', 6: 'Alignement vertical : milieu', 7: 'Alignement vertical : bas', 8: 'Retour à la ligne automatique', 9: 'Format monétaire (€)', 10: 'Changer le format (standard, texte, monétaire…)', 11: 'Séparateur de milliers', 12: 'Gras', 13: 'Italique', 14: 'Souligner', 15: 'Ajouter une bordure', 16: 'Couleur de remplissage (fond)', 17: 'Couleur de police', 18: 'Alignement horizontal (gauche / centre / droite)', 19: 'Diminuer le retrait', 20: 'Augmenter le retrait', 21: 'Orientation du texte (diagonale, vertical…)', 22: 'Fusionner et centrer', 23: 'Retirer une décimale', 24: 'Ajouter une décimale', 25: 'Mettre la valeur en pourcentage (%)' }
  const groupes = [
    { nom: 'Police', btns: [[1, 'Aptos ▾', 1], [2, '11 ▾'], [3, 'A⁺'], [4, 'A⁻'], [12, 'G'], [13, 'I'], [14, 'S'], [15, '⊞'], [16, '🪣'], [17, 'A']] },
    { nom: 'Alignement', btns: [[5, '▔'], [6, '━'], [7, '▁'], [8, '↵'], [18, '≡'], [19, '⇤'], [20, '⇥'], [21, '⤡'], [22, '⧉']] },
    { nom: 'Nombre', btns: [[10, 'Standard ▾', 1], [9, '€'], [25, '%'], [11, '000'], [23, '←.0'], [24, '.0→']] },
  ]
  return (
    <div className="mt-3">
      <div className="space-y-2 rounded-lg border border-navy/15 bg-[#f6f4ee] p-2 shadow-sm">
        {groupes.map((g) => (
          <div key={g.nom} className="rounded-md border border-navy/10 bg-white/70 px-2 pb-1 pt-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {g.btns.map(([n, lbl, wide]) => (
                <button
                  key={n}
                  onClick={() => setSel(n)}
                  className={`relative grid h-7 place-items-center rounded border text-[10px] font-bold transition ${wide ? 'px-2' : 'w-7'} ${sel === n ? 'border-mint bg-mint/25 text-navy ring-2 ring-mint' : 'border-navy/15 bg-white text-navy/70 hover:bg-navy/5'}`}
                >
                  {lbl}
                  <span className={`absolute -right-1.5 -top-1.5 grid h-3.5 w-3.5 place-items-center rounded-full text-[7px] font-bold text-white ${sel === n ? 'bg-mint' : 'bg-navy/55'}`}>{n}</span>
                </button>
              ))}
            </div>
            <p className="mt-1 border-t border-navy/10 pt-0.5 text-center text-[8px] font-semibold uppercase tracking-wide text-navy/45">{g.nom}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-[11px] text-navy/55">👆 Clique un numéro pour découvrir à quoi il sert.</p>
      {sel && (
        <div className="mt-2 flex animate-fade-up items-center gap-2 rounded-xl border border-mint/40 bg-mint/10 px-3 py-2">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint text-xs font-bold text-white">{sel}</span>
          <span className="text-sm font-semibold text-navy">{F[sel]}</span>
        </div>
      )}
    </div>
  )
}

// « Créer ton propre style » interactif : l'élève enchaîne Styles de cellule >
// Nouveau style > nomme > Format > choisit fond + couleur de texte > OK > OK.
function StyleBuilder({ onResolu }) {
  const [etape, setEtape] = useState(0)
  const [fond, setFond] = useState(null)
  const [police, setPolice] = useState(null)
  useEffect(() => { if (etape >= 5) onResolu && onResolu() }, [etape])
  const fonds = [['#0a335d', 'Marine'], ['#41c1ba', 'Menthe'], ['#e8853a', 'Orange'], ['#f4cf3f', 'Jaune'], ['#ffffff', 'Blanc']]
  const polices = [['#16243f', 'Marine'], ['#ffffff', 'Blanc'], ['#e8853a', 'Orange']]
  const consignes = [
    'Onglet **Accueil** : clique sur « **Styles de cellule** ».',
    'Tout en bas du menu, clique sur « **Nouveau style de cellule** ».',
    'Ton style s\'appelle « Mon style devis ». Clique sur « **Format…** » pour le définir.',
    'Choisis une **couleur de fond** ET une **couleur de texte**, puis clique **OK**.',
    'Ton style est prêt. Clique sur **OK** pour le créer.',
  ]
  const Chip = ({ c, on, sel: s }) => (
    <button onClick={on} title={c[1]} className={`h-7 w-7 rounded border transition ${s ? 'ring-2 ring-mint ring-offset-1' : 'border-navy/20 hover:scale-110'}`} style={{ background: c[0] }} />
  )
  return (
    <div className="mt-3">
      <div className="rounded-xl border border-mint/40 bg-mint/[0.07] px-3 py-2 text-sm text-navy/85">
        {etape >= 5 ? (
          <span className="font-bold text-mint">✓ Bravo, ton style personnalisé est créé !</span>
        ) : (
          <><span className="font-bold text-mint">Étape {etape + 1}/5 · </span>{gras(consignes[etape])}</>
        )}
      </div>

      {etape === 0 && (
        <div className="mx-auto mt-3 max-w-[320px] overflow-hidden rounded-lg border border-navy/15 bg-white shadow-lg">
          <div className="flex gap-3 border-b border-navy/10 bg-[#f3f1ea] px-3 py-1 text-[11px]">{['Fichier', 'Accueil', 'Insertion', 'Mise en page'].map((o) => (<span key={o} className={o === 'Accueil' ? 'font-bold text-mint' : 'text-navy/50'}>{o}</span>))}</div>
          <div className="flex items-start gap-2 p-3">
            <button onClick={() => setEtape(1)} className="flex animate-pulse flex-col items-center gap-1 rounded-md border-2 border-mint bg-mint/15 px-2 py-1.5 ring-1 ring-mint">
              <span className="text-lg">🎨</span><span className="text-[10px] font-bold text-navy">Styles de<br />cellule</span>
            </button>
            <div className="flex flex-col items-center gap-1 rounded-md border border-navy/10 px-2 py-1.5 opacity-60"><span className="text-lg">▦</span><span className="text-[10px] text-navy/60">Sous forme<br />de tableau</span></div>
          </div>
          <p className="border-t border-navy/10 pb-1 text-center text-[9px] font-semibold uppercase tracking-wide text-navy/45">Style</p>
        </div>
      )}

      {etape === 1 && (
        <div className="mx-auto mt-3 max-w-[260px] overflow-hidden rounded-md border border-navy/20 bg-white shadow-xl text-[11px]">
          <p className="px-3 pt-2 text-[9px] font-semibold uppercase tracking-wide text-navy/45">Bon, insatisfaisant et neutre</p>
          <div className="flex flex-wrap gap-1 p-2">{['Normal', 'Neutre', 'Correct', 'Incorrect', 'Titre', 'Total'].map((s) => (<span key={s} className="rounded border border-navy/15 bg-navy/5 px-2 py-1 text-navy/70">{s}</span>))}</div>
          <button onClick={() => setEtape(2)} className="flex w-full animate-pulse items-center gap-2 border-t border-navy/10 bg-mint/25 px-3 py-2 text-left font-bold text-navy ring-1 ring-inset ring-mint">
            <span>➕</span> Nouveau style de cellule…
          </button>
        </div>
      )}

      {etape === 2 && (
        <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
          <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Style</span><span className="text-navy/40">✕</span></div>
          <div className="space-y-3 bg-white p-3">
            <div className="flex items-center gap-2"><span className="shrink-0 text-navy/60">Nom du style :</span><span className="flex-1 rounded-sm border border-navy/30 px-2 py-1 text-navy ring-1 ring-mint">Mon style devis</span></div>
            <div className="flex justify-end"><button onClick={() => setEtape(3)} className="animate-pulse rounded-sm border-2 border-mint bg-mint/15 px-4 py-1 font-bold text-navy">Format…</button></div>
          </div>
        </div>
      )}

      {etape === 3 && (
        <div className="mx-auto mt-3 max-w-sm overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
          <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Format de cellule</span><span className="text-navy/40">✕</span></div>
          <div className="flex gap-1 border-b border-navy/15 bg-[#f3f1ea] px-2 pt-1 text-[10px]">{['Nombre', 'Alignement', 'Police', 'Bordure', 'Remplissage'].map((t, i) => (<span key={t} className={`rounded-t px-2 py-1 ${i === 4 ? 'bg-white font-bold text-navy' : 'text-navy/50'}`}>{t}</span>))}</div>
          <div className="space-y-3 bg-white p-3">
            <div>
              <p className="mb-1.5 font-semibold text-navy/60">Couleur de fond :</p>
              <div className="flex gap-2">{fonds.map((c) => <Chip key={c[0]} c={c} sel={fond === c[0]} on={() => setFond(c[0])} />)}</div>
            </div>
            <div>
              <p className="mb-1.5 font-semibold text-navy/60">Couleur du texte :</p>
              <div className="flex gap-2">{polices.map((c) => <Chip key={c[0]} c={c} sel={police === c[0]} on={() => setPolice(c[0])} />)}</div>
            </div>
            <div className="flex items-center justify-between border-t border-navy/10 pt-2">
              <span className="grid h-8 w-20 place-items-center rounded border border-navy/15 text-[11px] font-bold" style={{ background: fond || '#fff', color: police || '#16243f' }}>Aperçu</span>
              <button onClick={() => fond && police && setEtape(4)} disabled={!fond || !police} className={`rounded-sm border-2 px-4 py-0.5 font-bold ${fond && police ? 'border-mint bg-mint/15 text-navy' : 'border-navy/15 bg-navy/5 text-navy/35'}`}>OK</button>
            </div>
          </div>
        </div>
      )}

      {etape === 4 && (
        <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
          <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Style</span><span className="text-navy/40">✕</span></div>
          <div className="space-y-2 bg-white p-3">
            <div className="flex items-center gap-2"><span className="shrink-0 text-navy/60">Nom du style :</span><span className="flex-1 rounded-sm border border-navy/30 px-2 py-1 font-semibold text-navy">Mon style devis</span></div>
            <p className="text-[10px] text-navy/55">Le style inclut : Police, Remplissage <span className="inline-block h-3 w-3 rounded-sm border border-navy/20 align-middle" style={{ background: fond }} />, Couleur du texte <span className="inline-block h-3 w-3 rounded-sm border border-navy/20 align-middle" style={{ background: police }} />.</p>
            <div className="flex justify-end gap-2 border-t border-navy/10 pt-2"><button onClick={() => setEtape(5)} className="animate-pulse rounded-sm border-2 border-mint bg-mint/15 px-5 py-0.5 font-bold text-navy">OK</button><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5 text-navy/70">Annuler</span></div>
          </div>
        </div>
      )}

      {etape >= 5 && (
        <div className="mt-3 flex flex-col items-center gap-2 animate-fade-up">
          <div className="grid h-12 w-40 place-items-center rounded-lg border-2 shadow-md" style={{ background: fond || '#fff', color: police || '#16243f', borderColor: fond === '#ffffff' ? '#0a335d33' : 'transparent' }}>
            <span className="font-display text-lg">DEVIS 2026</span>
          </div>
          <p className="text-center text-[11px] font-semibold text-mint">✓ Ton style « Mon style devis » est créé et prêt à réutiliser !</p>
        </div>
      )}
    </div>
  )
}

// « Personnaliser l'en-tête » interactif : l'élève clique une zone (gauche/centre/
// droite) puis un élément (date, n° page…) pour l'insérer. Objectif : date à gauche,
// n° de page à droite.
function EntetreBuilder({ onResolu }) {
  const [zones, setZones] = useState({ gauche: '', centre: 'Mon entreprise', droite: '' })
  const [focus, setFocus] = useState('gauche')
  const outils = [
    { i: '📅', label: 'Date', code: '&[Date]' },
    { i: '🕐', label: 'Heure', code: '&[Heure]' },
    { i: '#', label: 'N° de page', code: '&[Page]' },
    { i: '##', label: 'Nb pages', code: '&[Pages]' },
    { i: '👤', label: 'Auteur', code: '&[Auteur]' },
    { i: '🖼', label: 'Image', code: '&[Image]' },
  ]
  const fait = zones.gauche.includes('&[Date]') && zones.droite.includes('&[Page]')
  const [valide, setValide] = useState(false)
  useEffect(() => { if (valide) onResolu && onResolu() }, [valide])
  const inserer = (code) => setZones((z) => (z[focus].includes(code) ? z : { ...z, [focus]: (z[focus] ? z[focus] + ' ' : '') + code }))
  const zdef = [['gauche', 'Partie gauche'], ['centre', 'Partie centrale'], ['droite', 'Partie droite']]
  return (
    <div className="mt-3">
      <div className="rounded-xl border border-mint/40 bg-mint/[0.07] px-3 py-2 text-sm text-navy/85">
        <span className="font-bold text-mint">Objectif : </span>mets la <b>date</b> à <b>gauche</b> et le <b>numéro de page</b> à <b>droite</b>. Clique d'abord une zone, puis un élément à insérer.
      </div>
      <div className="mx-auto mt-3 max-w-sm overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
        <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>En-tête</span><span className="text-navy/40">✕</span></div>
        <div className="space-y-2 bg-white p-3">
          <p className="text-navy/60">Insère ce que tu veux (dans la zone sélectionnée) :</p>
          <div className="flex flex-wrap gap-1.5">
            {outils.map((o) => (
              <button key={o.label} onClick={() => inserer(o.code)} title={o.label} className="grid h-8 min-w-[32px] place-items-center rounded border border-navy/20 bg-navy/5 px-1.5 text-sm font-bold text-navy/75 transition hover:bg-mint/15 hover:ring-1 hover:ring-mint">{o.i}</button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {zdef.map(([k, lbl]) => (
              <button key={k} onClick={() => setFocus(k)} className={`text-left ${focus === k ? '' : ''}`}>
                <p className={`mb-0.5 text-[9px] ${focus === k ? 'font-bold text-mint' : 'text-navy/45'}`}>{lbl}{focus === k ? ' ✎' : ''}</p>
                <div className={`grid h-14 place-items-center rounded-sm border px-1 text-center text-[9px] transition ${focus === k ? 'border-mint bg-mint/10 ring-1 ring-mint' : 'border-navy/20 bg-white hover:bg-navy/5'} text-navy/80`}>{zones[k] || <span className="text-navy/25">(vide)</span>}</div>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-navy/10 pt-2">
            <span className="text-[10px] text-navy/50">{fait ? '✓ Date à gauche, page à droite.' : 'Place les 2 éléments…'}</span>
            <span className="flex gap-2">
              <button onClick={() => fait && setValide(true)} disabled={!fait} className={`rounded-sm border-2 px-5 py-0.5 font-bold ${fait ? 'border-mint bg-mint/15 text-navy' : 'border-navy/15 bg-navy/5 text-navy/35'}`}>OK</button>
              <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5 text-navy/70">Annuler</span>
            </span>
          </div>
        </div>
      </div>
      {valide && <p className="mt-2 text-center text-[11px] font-semibold text-mint animate-fade-up">✓ En-tête personnalisé : date à gauche, « Mon entreprise » au centre, page à droite.</p>}
    </div>
  )
}

// Construire une formule AVEC l'assistant fonction, interactif : l'élève clique fx,
// choisit la bonne fonction dans « Insérer une fonction », puis remplit les arguments
// dans « Arguments de la fonction ». Réutilisé pour SI et ARRONDI.
function AssistantFormule({ v, onResolu, onErreur }) {
  const { cellule = 'B2', categorie = 'Logique', recherche, fonctions = [], cible, signature, description, args = [], resultat, formuleFinale } = v
  const [etape, setEtape] = useState(0)
  const [selFn, setSelFn] = useState(null)
  const [remplis, setRemplis] = useState({})
  useEffect(() => { if (etape >= 3) onResolu && onResolu() }, [etape])
  const oblig = args.map((a, i) => (a.obligatoire ? i : -1)).filter((i) => i >= 0)
  const tousFaits = oblig.every((i) => remplis[i])
  const choisir = (nom) => { setSelFn(nom); if (nom !== cible) onErreur && onErreur() }
  const remplir = (i) => setRemplis((r) => (r[i] ? r : { ...r, [i]: true }))
  const consignes = [
    'Clique sur le bouton **fx**, à gauche de la barre de formule.',
    `Sélectionne la fonction **${cible}** dans la liste, puis clique **OK**.`,
    'Renseigne les arguments : **clique chaque champ**, puis clique **OK**.',
  ]
  return (
    <div className="mt-3">
      <div className="rounded-xl border border-mint/40 bg-mint/[0.07] px-3 py-2 text-sm text-navy/85">
        {etape >= 3 ? (
          <span className="font-bold text-mint">✓ Bravo, l'assistant a construit ta formule {cible} !</span>
        ) : (
          <><span className="font-bold text-mint">Étape {etape + 1}/3 · </span>{gras(consignes[etape])}</>
        )}
      </div>

      {etape === 0 && (
        <div className="mx-auto mt-3 flex max-w-md items-center gap-1.5 rounded-md border border-navy/20 bg-white px-2 py-2 text-[11px] shadow">
          <span className="rounded border border-navy/15 bg-navy/5 px-2 py-0.5 font-semibold text-navy/70">{cellule}</span>
          <span className="text-navy/25">✕</span><span className="text-navy/25">✓</span>
          <button onClick={() => setEtape(1)} className="grid h-6 w-7 animate-pulse place-items-center rounded border-2 border-mint bg-mint/15 text-[12px] font-bold italic text-mint ring-1 ring-mint" title="Insérer une fonction">fx</button>
          <span className="ml-1 flex-1 border-l border-navy/10 pl-2 text-navy/25">|</span>
        </div>
      )}

      {etape === 1 && (
        <div className="mx-auto mt-3 max-w-sm overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
          <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Insérer une fonction</span><span className="text-navy/40">? ✕</span></div>
          <div className="space-y-2 bg-white p-3">
            <p className="text-navy/55">Recherchez une fonction :</p>
            <div className="flex gap-1"><span className="flex-1 truncate rounded-sm border border-navy/25 px-2 py-1 text-navy/70">{recherche || 'Tapez une brève description…'}</span><span className="shrink-0 rounded-sm border border-navy/25 bg-[#f0f0f0] px-2 py-1">Rechercher</span></div>
            <div className="flex items-center gap-2"><span className="shrink-0 text-navy/55">Catégorie :</span><span className="flex-1 rounded-sm border border-navy/25 px-2 py-1 text-navy/75">{categorie} ▾</span></div>
            <p className="text-navy/55">Sélectionnez une fonction :</p>
            <div className="overflow-hidden rounded-sm border-2 border-mint">
              {fonctions.map((f) => (
                <button key={f} onClick={() => choisir(f)} className={`block w-full px-2 py-1 text-left font-mono transition ${selFn === f ? (f === cible ? 'bg-[#2f5fd0] text-white' : 'bg-red-100 text-red-700') : 'text-navy/80 hover:bg-navy/5'}`}>{f}</button>
              ))}
            </div>
            <p className="font-mono text-[10px] text-navy/70">{signature}</p>
            <p className="text-[10px] leading-snug text-navy/55">{description}</p>
            {selFn && selFn !== cible && <p className="text-[10px] font-semibold text-red-600">Ce n'est pas la bonne fonction, choisis {cible}.</p>}
            <div className="flex items-center justify-between border-t border-navy/10 pt-2">
              <span className="text-[10px] text-[#2f5fd0] underline">Aide sur cette fonction</span>
              <span className="flex gap-2">
                <button onClick={() => selFn === cible && setEtape(2)} disabled={selFn !== cible} className={`rounded-sm border-2 px-4 py-0.5 font-bold ${selFn === cible ? 'animate-pulse border-[#0a63c9] bg-mint/15 text-navy' : 'border-navy/15 bg-navy/5 text-navy/35'}`}>OK</button>
                <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5 text-navy/70">Annuler</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {etape === 2 && (
        <div className="mx-auto mt-3 max-w-sm overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
          <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Arguments de la fonction</span><span className="text-navy/40">? ✕</span></div>
          <div className="space-y-2 bg-white p-3">
            <p className="font-semibold text-navy">{cible}</p>
            {args.map((a, i) => {
              const rempli = remplis[i] || !a.obligatoire
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className={`w-24 shrink-0 text-right ${a.obligatoire ? 'font-bold text-navy' : 'text-navy/55'}`}>{a.label}</span>
                  <button onClick={() => remplir(i)} className={`min-w-0 flex-1 truncate rounded-sm border px-2 py-1 text-left font-mono ${rempli ? 'border-navy/30 text-navy' : 'animate-pulse border-mint text-navy/35 ring-1 ring-mint'}`}>{rempli ? a.ref : 'clique ici…'}</button>
                  <span className="w-16 shrink-0 truncate text-navy/50">= {rempli ? a.apercu : '?'}</span>
                </div>
              )
            })}
            <div className="rounded-md border-2 border-mint/50 bg-mint/5 p-2 text-navy/70">
              <p>= {tousFaits ? resultat : '?'}</p>
              <p className="text-[10px] leading-snug">{description}</p>
              {tousFaits && <p className="font-bold text-navy">Résultat = {resultat}</p>}
            </div>
            <div className="flex items-center justify-between border-t border-navy/10 pt-2">
              <span className="text-[10px] text-[#2f5fd0] underline">Aide sur cette fonction</span>
              <span className="flex gap-2">
                <button onClick={() => tousFaits && setEtape(3)} disabled={!tousFaits} className={`rounded-sm border-2 px-4 py-0.5 font-bold ${tousFaits ? 'animate-pulse border-[#0a63c9] bg-mint/15 text-navy' : 'border-navy/15 bg-navy/5 text-navy/35'}`}>OK</button>
                <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5 text-navy/70">Annuler</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {etape >= 3 && (
        <div className="mt-3 flex flex-col items-center gap-2 animate-fade-up">
          <div className="rounded-md bg-[#f3f1ea] px-3 py-1.5 font-mono text-sm text-navy shadow-inner">{cellule} : {formuleFinale || `=${cible}(…)`} → <span className="font-bold text-mint">{resultat}</span></div>
          <p className="text-center text-[11px] font-semibold text-mint">✓ L'assistant a rempli la formule et affiché le résultat : {resultat}.</p>
        </div>
      )}
    </div>
  )
}

// « Rechercher & remplacer » interactif : l'élève remplit Rechercher (9,5) et
// Remplacer par (10), clique « Remplacer tout » et voit le tableau se corriger.
function Remplacer({ onResolu }) {
  const [rech, setRech] = useState(false)
  const [remp, setRemp] = useState(false)
  const [fait, setFait] = useState(false)
  useEffect(() => { if (fait) onResolu && onResolu() }, [fait])
  const H = 26
  const notes = [['Léa', '14'], ['Tom', fait ? '10' : '9,5'], ['Sam', '16'], ['Lou', fait ? '10' : '9,5']]
  const consigne = !rech ? 'Clique le champ **Rechercher** pour y mettre la valeur à trouver (9,5).' : !remp ? 'Clique le champ **Remplacer par** pour la nouvelle valeur (10).' : 'Clique **Remplacer tout**.'
  return (
    <div className="mt-3">
      <div className="rounded-xl border border-mint/40 bg-mint/[0.07] px-3 py-2 text-sm text-navy/85">
        {fait ? <span className="font-bold text-mint">✓ 2 remplacements effectués : les « 9,5 » sont devenus « 10 » !</span> : gras(consigne)}
      </div>
      <div className="mx-auto mt-3 max-w-[240px] overflow-hidden rounded-lg border border-navy/10 bg-white shadow">
        <div className="grid text-[11px]" style={{ gridTemplateColumns: '22px 1fr 1fr' }}>
          <div style={{ height: H }} className="bg-navy/5" />
          {['A', 'B'].map((c) => <div key={c} className="grid place-items-center border-b border-l border-navy/10 bg-navy/10 text-navy/50" style={{ height: H }}>{c}</div>)}
          {[['Élève', 'Note'], ...notes].map((row, ri) => (
            <div key={ri} className="contents">
              <div className="grid place-items-center border-b border-navy/10 bg-navy/10 text-navy/50" style={{ height: H }}>{ri + 1}</div>
              {row.map((val, ci) => {
                const ent = ri === 0
                const changed = fait && ci === 1 && val === '10'
                return <div key={ci} className={`flex items-center border-b border-l border-navy/10 px-1.5 ${ci === 1 ? 'justify-end' : ''} ${ent ? 'bg-navy/10 font-bold text-navy/70' : changed ? 'bg-mint/20 font-bold text-navy' : 'text-navy/85'}`} style={{ height: H }}>{val}</div>
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
        <div className="flex items-end gap-1 bg-[#e9e9e9] px-3 pt-1.5 font-semibold text-navy/80">
          <span className="rounded-t border border-b-0 border-navy/15 bg-white px-2 py-0.5 text-navy">Remplacer</span>
          <span className="px-2 py-0.5 text-navy/45">Rechercher</span>
          <span className="ml-auto pb-0.5 text-navy/40">✕</span>
        </div>
        <div className="space-y-2 bg-white p-3">
          <div className="flex items-center gap-2"><span className="w-28 shrink-0 text-right text-navy/60">Rechercher :</span><button onClick={() => setRech(true)} className={`min-w-0 flex-1 rounded-sm border px-2 py-1 text-left font-mono ${rech ? 'border-navy/30 text-navy' : 'animate-pulse border-mint text-navy/35 ring-1 ring-mint'}`}>{rech ? '9,5' : 'clique…'}</button></div>
          <div className="flex items-center gap-2"><span className="w-28 shrink-0 text-right text-navy/60">Remplacer par :</span><button onClick={() => rech && setRemp(true)} disabled={!rech} className={`min-w-0 flex-1 rounded-sm border px-2 py-1 text-left font-mono ${remp ? 'border-navy/30 text-navy' : rech ? 'animate-pulse border-mint text-navy/35 ring-1 ring-mint' : 'border-navy/15 text-navy/25'}`}>{remp ? '10' : 'clique…'}</button></div>
          <div className="flex justify-end gap-2 border-t border-navy/10 pt-2">
            <button onClick={() => rech && remp && setFait(true)} disabled={!rech || !remp} className={`rounded-sm border-2 px-3 py-0.5 font-bold ${rech && remp && !fait ? 'animate-pulse border-mint bg-mint/15 text-navy' : rech && remp ? 'border-mint bg-mint/15 text-navy' : 'border-navy/15 bg-navy/5 text-navy/35'}`}>Remplacer tout</button>
            <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-2 py-0.5 text-navy/60">Fermer</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// « Convertir » (séparer une colonne) interactif : assistant en 3 étapes que
// l'élève traverse (Délimité > Espace > Terminer), puis la colonne se découpe.
function ConvertirWizard({ onResolu }) {
  const [etape, setEtape] = useState(0)
  const [delim, setDelim] = useState(false)
  const [espace, setEspace] = useState(false)
  useEffect(() => { if (etape >= 3) onResolu && onResolu() }, [etape])
  const H = 26
  const consignes = ['Choisis **Délimité**, puis clique **Suivant**.', 'Coche le séparateur **Espace**, puis clique **Suivant**.', 'Vérifie la **Destination**, puis clique **Terminer**.']
  return (
    <div className="mt-3">
      <div className="rounded-xl border border-mint/40 bg-mint/[0.07] px-3 py-2 text-sm text-navy/85">
        {etape >= 3 ? <span className="font-bold text-mint">✓ Colonne séparée : le prénom d'un côté, le nom de l'autre !</span> : <><span className="font-bold text-mint">Étape {etape + 1}/3 · </span>{gras(consignes[etape])}</>}
      </div>
      {etape === 0 && (
        <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
          <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Assistant Conversion (étape 1 sur 3)</span><span className="text-navy/40">✕</span></div>
          <div className="space-y-2 bg-white p-3">
            <p className="text-navy/55">Type de données d'origine :</p>
            <button onClick={() => setDelim(true)} className="flex w-full items-center gap-2 text-left text-navy/80"><span className={`grid h-4 w-4 shrink-0 place-items-center rounded-sm border text-[9px] text-white ${delim ? 'border-mint bg-mint' : 'animate-pulse border-mint ring-1 ring-mint'}`}>{delim && '✓'}</span>Délimité (séparé par des espaces, virgules…)</button>
            <div className="flex items-center gap-2 text-navy/45"><span className="h-4 w-4 shrink-0 rounded-sm border border-navy/30" />Largeur fixe</div>
            <div className="flex justify-end gap-2 border-t border-navy/10 pt-2"><button onClick={() => delim && setEtape(1)} disabled={!delim} className={`rounded-sm border-2 px-4 py-0.5 font-bold ${delim ? 'animate-pulse border-mint bg-mint/15 text-navy' : 'border-navy/15 bg-navy/5 text-navy/35'}`}>Suivant</button><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5 text-navy/60">Annuler</span></div>
          </div>
        </div>
      )}
      {etape === 1 && (
        <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
          <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Assistant Conversion (étape 2 sur 3)</span><span className="text-navy/40">✕</span></div>
          <div className="space-y-1.5 bg-white p-3">
            <p className="text-navy/55">Séparateurs :</p>
            {['Tabulation', 'Point-virgule', 'Virgule'].map((s) => <div key={s} className="flex items-center gap-2 text-navy/45"><span className="h-4 w-4 shrink-0 rounded-sm border border-navy/30" />{s}</div>)}
            <button onClick={() => setEspace(true)} className="flex w-full items-center gap-2 text-left text-navy/80"><span className={`grid h-4 w-4 shrink-0 place-items-center rounded-sm border text-[9px] text-white ${espace ? 'border-mint bg-mint' : 'animate-pulse border-mint ring-1 ring-mint'}`}>{espace && '✓'}</span>Espace</button>
            {espace && <div className="mt-1 flex animate-fade-up overflow-hidden rounded border border-navy/15 text-[10px]"><div className="flex-1 border-r border-navy/10 bg-mint/5 px-1.5 py-0.5 text-navy/80">paul</div><div className="flex-1 bg-mint/5 px-1.5 py-0.5 text-navy/80">dupont</div></div>}
            <div className="flex justify-end gap-2 border-t border-navy/10 pt-2"><button onClick={() => espace && setEtape(2)} disabled={!espace} className={`rounded-sm border-2 px-4 py-0.5 font-bold ${espace ? 'animate-pulse border-mint bg-mint/15 text-navy' : 'border-navy/15 bg-navy/5 text-navy/35'}`}>Suivant</button><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5 text-navy/60">Annuler</span></div>
          </div>
        </div>
      )}
      {etape === 2 && (
        <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
          <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Assistant Conversion (étape 3 sur 3)</span><span className="text-navy/40">✕</span></div>
          <div className="space-y-2 bg-white p-3">
            <div className="flex items-center gap-2"><span className="shrink-0 text-navy/60">Destination :</span><span className="flex-1 rounded-sm border border-navy/30 px-2 py-1 font-mono text-navy ring-1 ring-mint">=$B$1</span></div>
            <p className="text-[10px] text-navy/50">On garde l'original en colonne A, le découpage arrive à droite (colonne B).</p>
            <div className="flex justify-end gap-2 border-t border-navy/10 pt-2"><button onClick={() => setEtape(3)} className="animate-pulse rounded-sm border-2 border-mint bg-mint/15 px-4 py-0.5 font-bold text-navy">Terminer</button><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5 text-navy/60">Annuler</span></div>
          </div>
        </div>
      )}
      {etape >= 3 && (
        <div className="mx-auto mt-3 max-w-[240px] overflow-hidden rounded-lg border border-navy/10 bg-white shadow animate-fade-up">
          <div className="grid text-[11px]" style={{ gridTemplateColumns: '22px 1fr 1fr' }}>
            <div style={{ height: H }} className="bg-navy/5" />
            {['A', 'B'].map((c) => <div key={c} className="grid place-items-center border-b border-l border-navy/10 bg-navy/10 text-navy/50" style={{ height: H }}>{c}</div>)}
            {[['paul', 'dupont'], ['marie', 'curie']].map((row, ri) => (
              <div key={ri} className="contents"><div className="grid place-items-center border-b border-navy/10 bg-navy/10 text-navy/50" style={{ height: H }}>{ri + 1}</div>{row.map((val, ci) => <div key={ci} className="flex items-center border-b border-l border-navy/10 bg-mint/10 px-1.5 font-semibold text-navy" style={{ height: H }}>{val}</div>)}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Nommer / naviguer avec la Zone Nom, interactif.
// mode 'nommer' : clique la Zone Nom (le nom s'écrit) puis Entrée.
// mode 'naviguer' : clique la flèche ▾, choisis un nom, Excel t'y emmène.
function ZoneNomBuilder({ v, onResolu }) {
  const { mode = 'nommer', nom = 'Prix_Unitaire', liste = ['Prix_Unitaire', 'Quantite', 'TVA'] } = v
  const [etape, setEtape] = useState(0)
  const [choix, setChoix] = useState(null)
  useEffect(() => { if (etape >= 2) onResolu && onResolu() }, [etape])
  const consigne = mode === 'nommer'
    ? (etape === 0 ? 'Clique dans la **Zone Nom** (à gauche de la barre de formule) pour y taper le nom.' : 'Appuie sur **Entrée** pour enregistrer le nom.')
    : (etape === 0 ? 'Clique la **flèche ▾** de la Zone Nom pour ouvrir la liste de tes noms.' : 'Clique un **nom** : Excel t\'emmène directement à sa cellule.')
  return (
    <div className="mt-3">
      <div className="rounded-xl border border-mint/40 bg-mint/[0.07] px-3 py-2 text-sm text-navy/85">
        {etape >= 2 ? <span className="font-bold text-mint">{mode === 'nommer' ? `✓ La cellule B2 s'appelle maintenant « ${nom} » !` : `✓ Excel t'a emmené directement à la plage « ${choix} » !`}</span> : gras(consigne)}
      </div>
      <div className="mx-auto mt-3 max-w-md">
        {/* Zone Nom + barre de formule (dans un conteneur relatif pour que la liste
            déroulante ne soit PAS coupée par l'overflow-hidden de la barre) */}
        <div className="relative">
          <div className="flex items-stretch overflow-hidden rounded-md border border-navy/20 text-[11px] shadow">
            <button
              onClick={() => mode === 'nommer' ? etape === 0 && setEtape(1) : etape === 0 && setEtape(0.5)}
              className={`flex h-8 w-28 shrink-0 items-center gap-1 border-r border-navy/20 bg-[#f3f1ea] px-2 text-left font-mono ${etape < 1 ? 'animate-pulse text-navy/40 ring-1 ring-inset ring-mint' : 'text-navy'}`}
            >
              <span className="truncate">{mode === 'nommer' ? (etape >= 1 ? nom : 'B2') : (etape >= 2 ? choix : 'B2')}</span>
              {mode === 'nommer' && etape >= 1 && etape < 2 && <span className="animate-pulse">|</span>}
              {mode === 'naviguer' && <span className="ml-auto text-navy/40">▾</span>}
            </button>
            <div className="flex flex-1 items-center gap-2 bg-white px-2 text-navy/50"><span className="italic">fx</span><span>{mode === 'nommer' ? '30' : ''}</span></div>
          </div>
          {mode === 'naviguer' && etape === 0.5 && (
            <div className="absolute left-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-md border border-navy/20 bg-white shadow-xl">
              {liste.map((n) => <button key={n} onClick={() => { setChoix(n); setEtape(2) }} className="block w-full px-2 py-1.5 text-left font-mono text-navy/80 hover:bg-mint/15">{n}</button>)}
            </div>
          )}
        </div>
        {mode === 'nommer' && etape === 1 && (
          <div className="mt-2 flex justify-center"><button onClick={() => setEtape(2)} className="animate-pulse rounded-md border-2 border-mint bg-mint/15 px-4 py-1.5 text-[12px] font-bold text-navy">⏎ Entrée</button></div>
        )}
        {/* mini tableur */}
        <div className="mt-2 overflow-hidden rounded-md border border-navy/10 bg-white text-[11px]">
          {[['Produit', 'Prix'], ['Clavier', '30']].map((row, ri) => (
            <div key={ri} className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {row.map((c, ci) => <div key={ci} className={`border-b border-l border-navy/10 px-2 py-1 ${ri === 0 ? 'bg-navy/10 font-bold text-navy/70' : ri === 1 && ci === 1 && ((mode === 'nommer' && etape >= 1) || (mode === 'naviguer' && etape >= 2)) ? 'bg-mint/15 font-semibold text-navy ring-1 ring-inset ring-mint/50' : 'text-navy/85'}`}>{c}</div>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Nommer / gérer via le ruban ou le clic droit, interactif : on clique le
// déclencheur (bouton du ruban ou entrée du menu), puis on agit dans la boîte.
// dialogue : 'nouveaunom' (remplir le Nom + OK) | 'etiquettes' (cocher Ligne du
// haut + OK) | 'gestionnaire' (sélectionner un nom + Supprimer).
function RubanNommage({ v, onResolu }) {
  const { declencheur = 'ruban', bouton = 'Définir un nom', dialogue = 'nouveaunom', nom = 'PrixHT', noms = [], resultat } = v
  const [etape, setEtape] = useState(0)
  const [champRempli, setChampRempli] = useState(false)
  const [coche, setCoche] = useState(false)
  const [sel, setSel] = useState(null)
  useEffect(() => { if (etape >= 2) onResolu && onResolu() }, [etape])
  const pretOK = dialogue === 'nouveaunom' ? champRempli : dialogue === 'etiquettes' ? coche : sel !== null
  const consignes0 = declencheur === 'menu' ? `Fais un clic droit, puis clique **${bouton}** dans le menu.` : `Onglet Formules : clique le bouton **${bouton}**.`
  const consigne1 = dialogue === 'nouveaunom' ? 'Clique le champ **Nom** pour le remplir, puis **OK**.' : dialogue === 'etiquettes' ? 'Coche **Ligne du haut** (les titres sont en haut), puis **OK**.' : 'Sélectionne le nom à supprimer, puis clique **Supprimer**.'
  const groupes = [
    { icone: '🔖', label: 'Définir un nom' },
    { icone: '📋', label: 'Gestionnaire de noms' },
    { icone: '⊞', label: 'Créer depuis sélection' },
  ].map((g) => ({ ...g, actif: g.label === bouton || (bouton === 'Créer à partir de la sélection' && g.label === 'Créer depuis sélection') }))
  return (
    <div className="mt-3">
      <div className="rounded-xl border border-mint/40 bg-mint/[0.07] px-3 py-2 text-sm text-navy/85">
        {etape >= 2 ? <span className="font-bold text-mint">{resultat}</span> : <><span className="font-bold text-mint">Étape {etape + 1}/2 · </span>{gras(etape === 0 ? consignes0 : consigne1)}</>}
      </div>

      {etape === 0 && declencheur === 'ruban' && (
        <div className="mx-auto mt-3 max-w-[320px] overflow-hidden rounded-lg border border-navy/15 bg-white shadow-lg text-[11px]">
          <div className="flex gap-3 border-b border-navy/10 bg-[#f3f1ea] px-3 py-1">{['Fichier', 'Accueil', 'Insertion', 'Formules', 'Données'].map((o) => <span key={o} className={o === 'Formules' ? 'font-bold text-mint' : 'text-navy/50'}>{o}</span>)}</div>
          <div className="flex items-start gap-2 p-3">
            {groupes.map((g, i) => (
              <button key={i} onClick={() => g.actif && setEtape(1)} disabled={!g.actif} className={`flex w-20 flex-col items-center gap-1 rounded p-1.5 text-center ${g.actif ? 'animate-pulse bg-mint/15 ring-1 ring-mint' : 'opacity-50'}`}>
                <span className="text-base">{g.icone}</span><span className="text-[9px] leading-tight text-navy/70">{g.label}</span>
              </button>
            ))}
          </div>
          <p className="border-t border-navy/10 pb-1 text-center text-[9px] font-semibold uppercase tracking-wide text-navy/45">Noms définis</p>
        </div>
      )}

      {etape === 0 && declencheur === 'menu' && (
        <div className="mx-auto mt-3 w-52 overflow-hidden rounded-md border border-navy/20 bg-white py-1 text-[11px] shadow-xl">
          {[{ i: '📄', l: 'Copier' }, { i: '📋', l: 'Coller' }, '-', { i: '🔖', l: 'Définir un nom…', cible: true }, { i: '🔗', l: 'Lien…' }].map((it, i) => it === '-' ? <div key={i} className="my-1 border-t border-navy/10" /> : (
            <button key={i} onClick={() => it.cible && setEtape(1)} disabled={!it.cible} className={`flex w-full items-center gap-2 px-3 py-1.5 text-left ${it.cible ? 'animate-pulse bg-mint/20 font-semibold text-navy ring-1 ring-inset ring-mint' : 'text-navy/70'}`}><span>{it.i}</span>{it.l}</button>
          ))}
        </div>
      )}

      {etape === 1 && dialogue === 'nouveaunom' && (
        <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
          <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Nouveau nom</span><span className="text-navy/40">✕</span></div>
          <div className="space-y-2 bg-white p-3">
            <div className="flex items-center gap-2"><span className="w-24 shrink-0 text-right text-navy/60">Nom :</span><button onClick={() => setChampRempli(true)} className={`min-w-0 flex-1 rounded-sm border px-2 py-1 text-left font-mono ${champRempli ? 'border-navy/30 text-navy' : 'animate-pulse border-mint text-navy/35 ring-1 ring-mint'}`}>{champRempli ? nom : 'clique pour taper…'}</button></div>
            <div className="flex items-center gap-2"><span className="w-24 shrink-0 text-right text-navy/60">Champ :</span><span className="flex-1 rounded-sm border border-navy/25 px-2 py-1 text-navy/70">Classeur ▾</span></div>
            <div className="flex items-center gap-2"><span className="w-24 shrink-0 text-right text-navy/60">Fait référence à :</span><span className="min-w-0 flex-1 truncate rounded-sm border border-navy/25 px-2 py-1 font-mono text-navy/70">=Feuil1!$B$2</span></div>
            <div className="flex justify-end gap-2 border-t border-navy/10 pt-2"><button onClick={() => champRempli && setEtape(2)} disabled={!champRempli} className={`rounded-sm border-2 px-5 py-0.5 font-bold ${champRempli ? 'animate-pulse border-mint bg-mint/15 text-navy' : 'border-navy/15 bg-navy/5 text-navy/35'}`}>OK</button><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5 text-navy/60">Annuler</span></div>
          </div>
        </div>
      )}

      {etape === 1 && dialogue === 'etiquettes' && (
        <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
          <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Créer des noms à partir de la sélection</span><span className="text-navy/40">✕</span></div>
          <div className="space-y-2 bg-white p-3">
            <p className="text-navy/55">Créer les noms à partir des valeurs de :</p>
            <button onClick={() => setCoche(true)} className="flex w-full items-center gap-2 text-left text-navy/80"><span className={`grid h-4 w-4 shrink-0 place-items-center rounded-sm border text-[9px] text-white ${coche ? 'border-mint bg-mint' : 'animate-pulse border-mint ring-1 ring-mint'}`}>{coche && '✓'}</span>Ligne du haut</button>
            <div className="flex items-center gap-2 text-navy/45"><span className="h-4 w-4 shrink-0 rounded-sm border border-navy/30" />Colonne de gauche</div>
            <div className="flex justify-end gap-2 border-t border-navy/10 pt-2"><button onClick={() => coche && setEtape(2)} disabled={!coche} className={`rounded-sm border-2 px-5 py-0.5 font-bold ${coche ? 'animate-pulse border-mint bg-mint/15 text-navy' : 'border-navy/15 bg-navy/5 text-navy/35'}`}>OK</button><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5 text-navy/60">Annuler</span></div>
          </div>
        </div>
      )}

      {etape === 1 && dialogue === 'gestionnaire' && (
        <div className="mx-auto mt-3 max-w-sm overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
          <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Gestionnaire de noms</span><span className="text-navy/40">✕</span></div>
          <div className="bg-white p-2">
            <div className="mb-2 flex gap-1 text-[10px]">
              <span className="rounded border border-navy/20 bg-[#f0f0f0] px-2 py-0.5 text-navy/50">Nouveau…</span>
              <span className="rounded border border-navy/20 bg-[#f0f0f0] px-2 py-0.5 text-navy/50">Modifier…</span>
              <button onClick={() => sel !== null && setEtape(2)} disabled={sel === null} className={`rounded border-2 px-2 py-0.5 font-bold ${sel !== null ? 'animate-pulse border-mint bg-mint/15 text-navy' : 'border-navy/20 bg-[#f0f0f0] text-navy/35'}`}>Supprimer</button>
            </div>
            <div className="overflow-hidden rounded border border-navy/15">
              <div className="grid grid-cols-3 bg-navy/5 text-[9px] font-semibold text-navy/50"><span className="px-2 py-0.5">Nom</span><span className="px-2 py-0.5">Valeur</span><span className="px-2 py-0.5">Fait référence à</span></div>
              {noms.map((n, i) => (
                <button key={i} onClick={() => setSel(i)} className={`grid w-full grid-cols-3 text-left ${sel === i ? 'bg-[#2f5fd0] text-white' : 'text-navy/80 hover:bg-navy/5'}`}>
                  <span className="px-2 py-1 font-mono">{n.nom}</span><span className="px-2 py-1">{n.valeur}</span><span className="truncate px-2 py-1 font-mono">{n.ref}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Visuel({ v }) {
  if (!v) return null
  if (v.type === 'rubanzones') return <RubanZones />
  if (v.type === 'deuxtableaux') return <DeuxTableaux v={v} />
  if (v.type === 'definirnom') return <DefinirNom v={v} />
  if (v.type === 'gestionnairenoms') return <GestionnaireNoms v={v} />
  if (v.type === 'mfctableau') return <MFCTableau v={v} />
  if (v.type === 'mfcmenu') return <MFCMenu v={v} />
  if (v.type === 'mfcdialog') return <MFCDialog v={v} />
  if (v.type === 'nouvelleregle') return <NouvelleRegle v={v} />
  if (v.type === 'gestionregles') return <GestionRegles v={v} />
  if (v.type === 'regleicones') return <RegleIcones v={v} />
  if (v.type === 'erreursexcel') return <ErreursExcel v={v} />
  if (v.type === 'vuetcd') return <VueTCD v={v} />
  if (v.type === 'consoliderdialog') return <ConsoliderDialog v={v} />
  if (v.type === 'champstcd') return <ChampsTCD v={v} />
  if (v.type === 'relationdialog') return <RelationDialog v={v} />
  if (v.type === 'gererrelations') return <GererRelations v={v} />
  if (v.type === 'glisserchamptcd') return <GlisserChampTCD />
  if (v.type === 'planconso') return <PlanConso />
  if (v.type === 'classeuraxe') return <ClasseurAxe v={v} />
  if (v.type === 'graphique') return <Graphique v={v} />
  if (v.type === 'typesgraphiques') return <TypesGraphiques />
  if (v.type === 'soustypesgraphiques') return <SousTypesGraphiques />
  if (v.type === 'typegraphiquedialog') return <TypeGraphiqueDialog v={v} />
  if (v.type === 'recommandedialog') return <RecommandeDialog />
  if (v.type === 'titregraphique') return <TitreGraphique />
  if (v.type === 'stylesgraphique') return <StylesGraphiqueGalerie />
  if (v.type === 'selectionactive') return <SelectionActive v={v} />
  if (v.type === 'clicdroitgraphique') return <ClicDroitGraphique v={v} />
  if (v.type === 'clicdroitonglet') return <ClicDroitOnglet v={v} />
  if (v.type === 'voletformat') return <VoletFormat v={v} />
  if (v.type === 'pinceaugraphique') return <PinceauGraphique />
  if (v.type === 'filtregraphique') return <FiltreGraphique />
  if (v.type === 'galeriegraphiques') return <GalerieGraphiques />
  if (v.type === 'deplacergraphique') return <DeplacerGraphique />
  if (v.type === 'redimensionnergraphique') return <RedimensionnerGraphique />
  if (v.type === 'ongletscontextuels') return <OngletsContextuels />
  if (v.type === 'boutonsgraphique') return <BoutonsGraphique v={v} />
  if (v.type === 'formataxe') return <FormatAxe />
  if (v.type === 'selectionnerdonnees') return <SelectionnerDonnees v={v} />
  if (v.type === 'intervertirgraphique') return <IntervertirGraphique />
  if (v.type === 'deplacergraphiquedialog') return <DeplacerGraphiqueDialog v={v} />
  if (v.type === 'backstageimprimer') return <BackstageImprimer v={v} />
  if (v.type === 'imprimergraphique') return <ImprimerGraphique />
  if (v.type === 'sparklines') return <Sparklines v={v} />
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
  if (v.type === 'renommeronglet') return <RenommerOnglet />
  if (v.type === 'ajouteronglet') return <AjouterOnglet />
  if (v.type === 'deplaceronglet') return <DeplacerOnglet />
  if (v.type === 'palette') return <PaletteCouleurs v={v} />
  if (v.type === 'deplacercopier') return <DeplacerCopierDialog v={v} />
  if (v.type === 'touche') return <ToucheClavier v={v} />
  if (v.type === 'deuxclasseurs') return <DeuxClasseurs v={v} />
  if (v.type === 'liaisonsdialog') return <LiaisonsDialog v={v} />
  if (v.type === 'collagespecialdialog') return <CollageSpecialDialog />
  if (v.type === 'collerdropdown') return <CollerDropdown />
  if (v.type === 'deplacerfeuille') return <DeplacerCopierFeuille />
  if (v.type === 'protegerfeuilledialog') return <ProtegerFeuilleDialog />
  if (v.type === 'tableaudonnees') return <TableauDonnees v={v} />
  if (v.type === 'filtremenu') return <FiltreMenu v={v} />
  if (v.type === 'tridialog') return <TriDialog v={v} />
  if (v.type === 'soustotaldialog') return <SousTotalDialog v={v} />
  if (v.type === 'formulaire') return <Formulaire v={v} />
  if (v.type === 'figervolets') return <FigerVolets />
  if (v.type === 'sautspage') return <SautsPage />
  if (v.type === 'extensiontableau') return <ExtensionTableau />
  if (v.type === 'saisieauto') return <SaisieAuto />
  if (v.type === 'plan') return <Plan />
  if (v.type === 'barreaccesrapide') return <BarreAccesRapide />
  if (v.type === 'apercutitres') return <ApercuTitres />
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
  if (v.type === 'listedialog') return <ListeDialog v={v} />
  if (v.type === 'barreformule') return <BarreFormule />
  if (v.type === 'barrefx') return <BarreFx v={v} />
  if (v.type === 'zonenom') return <ZoneNom v={v} />
  if (v.type === 'formule') {
    return (
      <div className="mt-3 flex animate-fade-up items-start gap-2 rounded-xl border-2 border-mint/45 bg-mint/15 px-4 py-3 shadow-sm">
        <span className="shrink-0 font-mono text-sm italic text-mint/70">fx</span>
        <span className={`min-w-0 break-all font-mono leading-snug text-navy ${v.formule.length > 42 ? 'text-sm' : 'text-lg'}`}>{coloreFormule(v.formule)}</span>
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
    // Chaque étape est soit une chaîne, soit { texte, capture } pour illustrer l'étape
    // par sa propre capture d'écran (ruban, tableur, boîte de dialogue…).
    return (
      <ol className="mt-3 space-y-2">
        {v.items.map((it, i) => {
          const texte = typeof it === 'string' ? it : it.texte
          const capture = typeof it === 'string' ? null : it.capture
          return (
            <li key={i} className="rounded-xl border border-navy/10 bg-navy/5 p-3 animate-fade-up" style={{ animationDelay: `${i * 130}ms` }}>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint text-xs font-bold text-navy-deep">{i + 1}</span>
                <span className="text-sm text-navy/85">{gras(texte)}</span>
              </div>
              {capture && <div className="mt-2 pl-9">{<CaptureInline c={capture} />}</div>}
            </li>
          )
        })}
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

// Mini-question à RÉESSAI : une mauvaise réponse ne révèle pas la bonne, le Shifu
// encourage et l'élève retente jusqu'à trouver (cycle : se tromper → corriger → réussir).
const REUSSITES_Q = ['Excellent, du premier coup ! 🥋', 'Et voilà, bien vu ! 🎯', 'Exactement ! 💪', 'Précis comme un coup de Wing Chun ! 🥋']
const ENCOURAGEMENTS_Q = ['Pas celle-là… observe bien et retente ! 🧘', 'Presque ! Relis la question, tu l\'as.', 'Non, mais tu chauffes. Essaie encore !']

// ---------- Interactions actives (palier 1) : l'élève AGIT, il ne lit pas ----------

// « Trouve l'erreur » : l'élève doit CLIQUER la cellule fautive dans le tableau.
// Après 2 essais ratés, l'indice s'affiche. Bloque le bouton Continuer jusqu'à trouver.
function TrouveErreur({ v, onResolu, onErreur }) {
  const { entetes = [], lignes = [], erreur, indice, explication, consigne } = v
  const [essais, setEssais] = useState([])
  const [trouve, setTrouve] = useState(false)
  const cle = (r, c) => `${r}-${c}`
  const clic = (r, c) => {
    if (trouve) return
    if (r === erreur.ligne && c === erreur.col) {
      setTrouve(true)
      onResolu && onResolu()
    } else if (!essais.includes(cle(r, c))) {
      setEssais((e) => [...e, cle(r, c)])
      onErreur && onErreur()
    }
  }
  return (
    <div className="mt-3">
      {consigne && <p className="mb-2 rounded-xl bg-navy/5 px-3 py-2 text-center text-sm font-bold text-navy">🔍 {consigne}</p>}
      <div className="mx-auto w-fit overflow-hidden rounded-md border border-navy/15 shadow">
        <table className="border-collapse text-[12px]">
          <thead>
            <tr>{entetes.map((h, i) => (<th key={i} className="border-b-2 border-mint bg-mint/25 px-4 py-1.5 text-left font-bold text-navy">{h}</th>))}</tr>
          </thead>
          <tbody>
            {lignes.map((row, r) => (
              <tr key={r} className={r % 2 ? 'bg-navy/[0.03]' : 'bg-white'}>
                {row.map((cell, c) => {
                  const estBonne = trouve && r === erreur.ligne && c === erreur.col
                  const rate = essais.includes(cle(r, c))
                  return (
                    <td key={c} onClick={() => clic(r, c)} className={`cursor-pointer border-b border-navy/10 px-4 py-1.5 transition ${estBonne ? 'bg-mint/30 font-bold text-navy ring-2 ring-inset ring-mint' : rate ? 'bg-red-500/10 text-navy/40' : 'text-navy/85 hover:bg-mint/10'}`}>{cell || ' '}</td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {trouve ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-mint/15 px-3 py-2 text-sm text-navy/90">
          <span className="font-bold text-mint">✓ {essais.length === 0 ? 'Œil de lynx, du premier coup ! 🥋' : 'Trouvé ! 🥋'}</span> {explication}
        </p>
      ) : essais.length > 0 ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-navy/10 px-3 py-2 text-sm font-medium text-navy/90">
          {essais.length >= 2 && indice ? <><span className="font-bold">Indice :</span> {indice}</> : ENCOURAGEMENTS_Q[(essais.length - 1) % ENCOURAGEMENTS_Q.length]}
        </p>
      ) : null}
    </div>
  )
}

// Collage spécial > Transposer, en action : le tableau est d'abord EN LIGNE ; l'élève
// choisit « Transposer » dans la fenêtre du collage spécial, et le tableau bascule EN
// COLONNE (animé). On voit l'état initial AVANT, puis la transposition APRÈS.
function CollageTranspose({ v, onResolu, onErreur }) {
  const source = v.valeurs || ['janvier', 'février', 'mars']
  const [fait, setFait] = useState(false)
  const [rates, setRates] = useState([])
  const options = [
    { label: 'Coller (tout)', icone: '📋' },
    { label: 'Formules', icone: 'ƒx' },
    { label: 'Valeurs', icone: '123' },
    { label: 'Mise en forme', icone: '🖌' },
    { label: 'Transposer', icone: '⇄', cible: true },
  ]
  const clic = (opt) => {
    if (fait) return
    if (opt.cible) {
      setFait(true)
      onResolu && onResolu()
    } else if (!rates.includes(opt.label)) {
      setRates((r) => [...r, opt.label])
      onErreur && onErreur()
    }
  }
  return (
    <div className="mt-3">
      <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-wide text-navy/45">{fait ? 'Après : transposé (en colonne)' : 'Avant : le tableau en ligne'}</p>
      <div className="flex min-h-[96px] items-center justify-center">
        {!fait ? (
          <div className="overflow-hidden rounded-md border border-navy/15 shadow">
            <div className="flex">
              {source.map((s, i) => (
                <div key={i} className={`min-w-[80px] px-3 py-1.5 text-center text-xs text-navy/90 ${i === 0 ? '' : 'border-l border-navy/10'}`}>{s}</div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border border-mint/50 shadow">
            {source.map((s, i) => (
              <div key={i} className="animate-fade-up border-b border-navy/10 bg-mint/15 px-4 py-1.5 text-center text-xs font-medium text-navy" style={{ animationDelay: `${i * 0.12}s` }}>{s}</div>
            ))}
          </div>
        )}
      </div>
      <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-md border border-navy/20 bg-white text-[11px] shadow-xl">
        <div className="border-b border-navy/10 bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80">Collage spécial</div>
        {options.map((opt, i) => {
          const bon = fait && opt.cible
          const rate = rates.includes(opt.label)
          const cliquable = !fait && !rate
          return (
            <div
              key={i}
              onClick={cliquable ? () => clic(opt) : undefined}
              className={`flex items-center gap-2 px-3 py-1.5 transition ${cliquable ? 'cursor-pointer hover:bg-mint/10' : ''} ${bon ? 'bg-mint/20 font-bold text-navy' : rate ? 'text-navy/30' : 'text-navy/80'}`}
            >
              <span className="grid h-5 w-5 place-items-center rounded-sm border border-navy/15 text-[10px]">{opt.icone}</span>
              <span>{opt.label}</span>
            </div>
          )
        })}
      </div>
      {fait ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-mint/15 px-3 py-2 text-sm text-navy/90">
          <span className="font-bold text-mint">✓ Transposé ! 🥋</span> {v.explication || 'Le tableau qui était en ligne est maintenant en colonne : les lignes et les colonnes ont été échangées.'}
        </p>
      ) : rates.length > 0 ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-navy/10 px-3 py-2 text-sm font-medium text-navy/90">Ce n'est pas cette option. Cherche celle qui échange lignes et colonnes.</p>
      ) : (
        <p className="mt-2 rounded-xl bg-navy/5 px-3 py-2 text-center text-sm font-bold text-navy">👆 Dans la fenêtre, clique l'option qui échange lignes et colonnes</p>
      )}
    </div>
  )
}

// « Sélectionne la plage » : l'élève choisit lui-même la plage à calculer en cliquant
// la 1re puis la dernière cellule (comme un cliquer-glisser). Quand la plage est bonne,
// la formule se complète (ex. =SOMME(B2:B4)). Sert à SOMME, MOYENNE, MIN/MAX…
function SelectPlage({ v, onResolu, onErreur }) {
  const { consigne, cols = [], rows = [], cells = {}, debut, fin, formulePrefixe = '=SOMME(', resultat, explication } = v
  const [anchor, setAnchor] = useState(null)
  const [ok, setOk] = useState(false)
  const [rate, setRate] = useState(false)
  const parse = (id) => ({ c: (id.match(/[A-Z]+/) || [''])[0], r: parseInt((id.match(/\d+/) || ['0'])[0], 10) })
  const idsEntre = (a, b) => {
    const A = parse(a), B = parse(b)
    if (A.c === B.c) {
      const [r1, r2] = [A.r, B.r].sort((x, y) => x - y)
      const out = []
      for (let r = r1; r <= r2; r++) out.push(A.c + r)
      return out
    }
    if (A.r === B.r) {
      const i1 = cols.indexOf(A.c), i2 = cols.indexOf(B.c)
      if (i1 < 0 || i2 < 0) return null
      const [c1, c2] = [i1, i2].sort((x, y) => x - y)
      const out = []
      for (let i = c1; i <= c2; i++) out.push(cols[i] + A.r)
      return out
    }
    return null
  }
  const cibleIds = idsEntre(debut, fin) || []
  const memeEnsemble = (a, b) => a && b && a.length === b.length && a.every((x) => b.includes(x))
  const rangeLabel = cibleIds.length ? `${cibleIds[0]}:${cibleIds[cibleIds.length - 1]}` : ''
  const formuleOk = `${formulePrefixe}${rangeLabel})`
  const clic = (id) => {
    if (ok) return
    if (!anchor) {
      setAnchor(id)
      return
    }
    const sel = idsEntre(anchor, id)
    if (memeEnsemble(sel, cibleIds)) {
      setOk(true)
      onResolu && onResolu()
    } else {
      setRate(true)
      onErreur && onErreur()
      setTimeout(() => {
        setRate(false)
        setAnchor(null)
      }, 800)
    }
  }
  const dansSel = (id) => ok && cibleIds.includes(id)
  return (
    <div className="mt-3">
      {consigne && <p className="mb-2 rounded-xl bg-navy/5 px-3 py-2 text-center text-sm font-bold text-navy">👆 {consigne}</p>}
      <div className="overflow-hidden rounded-xl border border-navy/10 bg-white shadow-lg">
        <div className="flex items-center gap-2 border-b border-navy/10 bg-navy/5 px-3 py-1.5 text-xs">
          <span className="font-bold text-navy/50">fx</span>
          <span className="font-mono text-navy/90">{ok ? coloreFormule(formuleOk) : formulePrefixe ? coloreFormule(formulePrefixe) : <span className="text-navy/30">|</span>}</span>
        </div>
        <div className="grid text-xs" style={{ gridTemplateColumns: `28px repeat(${cols.length}, 1fr)` }}>
          <div className="bg-navy/5" />
          {cols.map((c) => (
            <div key={c} className="border-b border-l border-navy/10 bg-navy/10 py-1 text-center text-navy/50">{c}</div>
          ))}
          {rows.map((r) => (
            <div key={r} className="contents">
              <div className="border-b border-navy/10 bg-navy/10 py-1 text-center text-navy/50">{r}</div>
              {cols.map((c) => {
                const id = c + r
                const cell = cells[id] || {}
                const estResultat = id === resultat
                const contenu = estResultat && ok ? formuleOk : cell.t
                const estFormule = typeof contenu === 'string' && contenu.startsWith('=')
                const sel = dansSel(id)
                const estAnchor = anchor === id && !ok
                const estRate = rate && anchor === id
                const cliquable = !cell.entete && !ok && !estResultat
                let cls = 'text-navy/90'
                if (cell.entete) cls = 'bg-navy/10 font-bold text-navy/70'
                else if (sel) cls = 'bg-sky-500/25 font-bold text-navy ring-1 ring-inset ring-sky-400'
                else if (estRate) cls = 'bg-red-500/15 text-navy/50'
                else if (estAnchor) cls = 'bg-mint/30 ring-2 ring-inset ring-mint'
                else cls = 'text-navy/90 hover:bg-mint/10'
                return (
                  <div
                    key={id}
                    onClick={cliquable ? () => clic(id) : undefined}
                    className={`min-h-[30px] border-b border-l border-navy/10 px-2 py-1 ${cell.num ? 'text-right' : ''} ${cliquable ? 'cursor-pointer' : ''} ${cls}`}
                  >
                    {estFormule ? <span className="font-mono text-[10px] leading-tight">{coloreFormule(contenu)}</span> : contenu || ''}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      {ok ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-mint/15 px-3 py-2 text-sm text-navy/90">
          <span className="font-bold text-mint">✓ Plage {rangeLabel} sélectionnée ! 🥋</span> {explication}
        </p>
      ) : anchor ? (
        <p className="mt-2 rounded-xl bg-navy/10 px-3 py-2 text-sm font-medium text-navy/90">{rate ? 'Pas tout à fait cette plage. On recommence : reclique la première cellule.' : `Première cellule : ${anchor}. Maintenant clique la DERNIÈRE cellule de la plage.`}</p>
      ) : null}
    </div>
  )
}

// « Clique la suggestion » : quand on tape le début d'une fonction, Excel propose une liste ;
// l'élève clique lui-même la bonne fonction (au lieu de la voir déjà choisie).
function ChoixSuggestion({ v, onResolu, onErreur }) {
  const { saisie = '=', items = [], cible, explication } = v
  const [rates, setRates] = useState([])
  const [trouve, setTrouve] = useState(false)
  const clic = (nom) => {
    if (trouve) return
    if (nom === cible) {
      setTrouve(true)
      onResolu && onResolu()
    } else if (!rates.includes(nom)) {
      setRates((r) => [...r, nom])
      onErreur && onErreur()
    }
  }
  return (
    <div className="mt-3">
      <div className="mx-auto max-w-xs overflow-hidden rounded-md border border-navy/20 bg-white text-[11px] shadow-xl">
        <div className="border-b border-navy/10 bg-navy/5 px-3 py-1.5 font-mono text-navy/80">{saisie}<span className="animate-pulse">|</span></div>
        {items.map((it, i) => {
          const nom = typeof it === 'string' ? it : it.nom
          const desc = typeof it === 'object' ? it.desc : null
          const bon = trouve && nom === cible
          const rate = rates.includes(nom)
          const cliquable = !trouve && !rate
          return (
            <div
              key={i}
              onClick={cliquable ? () => clic(nom) : undefined}
              className={`flex items-center gap-2 px-3 py-1.5 transition ${cliquable ? 'cursor-pointer hover:bg-mint/10' : ''} ${bon ? 'bg-mint/20' : rate ? 'opacity-30' : ''}`}
            >
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded-sm bg-[#107c41] text-[8px] font-bold text-white">fx</span>
              <span className={`font-mono ${bon ? 'font-bold text-navy' : 'text-navy/85'}`}>{nom}</span>
              {desc && <span className="truncate text-[9px] text-navy/45">{desc}</span>}
            </div>
          )
        })}
      </div>
      {trouve ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-mint/15 px-3 py-2 text-sm text-navy/90">
          <span className="font-bold text-mint">✓ {rates.length === 0 ? 'Bien vu, du premier coup ! 🥋' : 'Voilà ! 🥋'}</span> {explication}
        </p>
      ) : rates.length > 0 ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-navy/10 px-3 py-2 text-sm font-medium text-navy/90">{ENCOURAGEMENTS_Q[(rates.length - 1) % ENCOURAGEMENTS_Q.length]}</p>
      ) : null}
    </div>
  )
}

// « Clique sur… » : l'élève DÉSIGNE le bon élément directement sur une vraie capture
// Excel (cellule d'un tableur, bouton d'un ruban, ou entrée de menu). Le geste actif
// qui remplace « regarde cette capture » par « fais-le ». Cycle réessai + comptage.
function CliqueCible({ v, onResolu, onErreur }) {
  const { consigne, support = 'tableur', cible, explication } = v
  const [rates, setRates] = useState([])
  const [trouve, setTrouve] = useState(false)
  // `cible` peut être une seule valeur OU un tableau (ex. « clique n'importe quelle cellule de la liste »).
  const estCible = (val) => (Array.isArray(cible) ? cible.includes(val) : val === cible)
  const choisir = (val) => {
    if (trouve) return
    if (estCible(val)) {
      setTrouve(true)
      onResolu && onResolu()
    } else if (!rates.includes(val)) {
      setRates((r) => [...r, val])
      onErreur && onErreur()
    }
  }

  let support_ui = null
  if (support === 'tableur') {
    const { cols = [], rows = [], cells = {}, formule, resultat, feuilles, feuilleActive } = v
    // Quand on clique une cellule référencée, la formule se complète dans la cellule résultat
    // (ex. clic sur A2 → C2 affiche =A2), exactement comme dans Excel.
    const construitFormule = trouve && formule && resultat && cible !== resultat
    const formuleAffichee = construitFormule ? formule + cible : formule
    support_ui = (
      <div className="animate-fade-up overflow-hidden rounded-xl border border-navy/10 bg-white shadow-lg">
        <div className="flex items-center gap-2 border-b border-navy/10 bg-navy/5 px-3 py-1.5 text-xs">
          <span className="font-bold text-navy/50">fx</span>
          <span className="font-mono text-navy/90">{formuleAffichee ? coloreFormule(formuleAffichee) : <span className="text-navy/30">|</span>}</span>
        </div>
        <div className="grid text-xs" style={{ gridTemplateColumns: `28px repeat(${cols.length}, 1fr)` }}>
          <div className="bg-navy/5" />
          {cols.map((c) => (
            <div key={c} className="border-b border-l border-navy/10 bg-navy/10 py-1 text-center text-navy/50">{c}</div>
          ))}
          {rows.map((r) => (
            <div key={r} className="contents">
              <div className="border-b border-navy/10 bg-navy/10 py-1 text-center text-navy/50">{r}</div>
              {cols.map((c) => {
                const id = c + r
                const cell = cells[id] || {}
                // La cellule résultat montre la formule qui se construit ; les autres, leur contenu.
                const contenu = id === resultat && construitFormule ? formuleAffichee : cell.t
                const estFormule = typeof contenu === 'string' && contenu.startsWith('=')
                const bon = trouve && estCible(id)
                const refBleu = bon && construitFormule // la cellule cliquée devient une référence bleue
                const rate = rates.includes(id)
                const cliquable = !cell.entete && !trouve && !rate
                let cls = 'text-navy/90'
                if (cell.entete) cls = 'bg-navy/10 font-bold text-navy/70'
                else if (refBleu) cls = 'bg-sky-500/25 font-bold text-navy ring-2 ring-inset ring-sky-400'
                else if (bon) cls = 'bg-mint/40 font-bold text-navy ring-2 ring-inset ring-mint'
                else if (rate) cls = 'bg-red-500/10 text-navy/35'
                else cls = 'text-navy/90 hover:bg-mint/10'
                return (
                  <div
                    key={id}
                    onClick={cliquable ? () => choisir(id) : undefined}
                    className={`min-h-[30px] border-b border-l border-navy/10 px-2 py-1 ${cell.num ? 'text-right' : ''} ${cliquable ? 'cursor-pointer' : ''} ${cls}`}
                  >
                    {estFormule ? <span className="font-mono text-[10px] leading-tight">{coloreFormule(contenu)}</span> : contenu || ''}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        {feuilles && (
          <div className="flex items-end gap-1 border-t border-navy/10 bg-navy/5 px-2 pt-1 text-[10px]">
            {feuilles.map((f) => (
              <span key={f} className={`rounded-t px-2.5 py-0.5 ${f === feuilleActive ? 'bg-white font-bold text-navy' : 'bg-navy/10 text-navy/50'}`}>{f}</span>
            ))}
          </div>
        )}
      </div>
    )
  } else if (support === 'ruban') {
    const { onglets = ['Fichier', 'Accueil', 'Insertion', 'Mise en page', 'Formules', 'Données', 'Révision', 'Affichage'], actif = 'Accueil', groupes = [], groupeNom } = v
    support_ui = (
      <div className="mx-auto max-w-md animate-fade-up overflow-hidden rounded-md border border-navy/15 text-[10px] shadow-lg">
        <div className="flex gap-0.5 bg-[#f3f3f3] px-2 pt-1">
          {onglets.map((o) => (<span key={o} className={`rounded-t px-2 py-1 ${o === actif ? 'bg-white font-bold text-[#0a7a3d]' : 'text-navy/55'}`}>{o}</span>))}
        </div>
        <div className="flex items-start gap-2 bg-white px-2 py-2">
          <div className="rounded-md border border-navy/15 bg-navy/[0.02] px-1.5 pb-1 pt-1.5">
            <div className="flex items-end gap-1">
              {groupes.map((g, i) => {
                const bon = trouve && g.label === cible
                const rate = rates.includes(g.label)
                const cliquable = !trouve && !rate
                return (
                  <div
                    key={i}
                    onClick={cliquable ? () => choisir(g.label) : undefined}
                    className={`flex w-16 flex-col items-center gap-1 rounded px-1 py-1 text-center transition ${cliquable ? 'cursor-pointer hover:bg-mint/10' : ''} ${bon ? 'bg-mint/20 ring-2 ring-mint' : rate ? 'opacity-30' : ''}`}
                  >
                    <span className={`grid h-7 w-7 place-items-center rounded text-sm ${g.icone === 'fx' ? 'bg-[#107c41] font-bold italic text-white' : 'text-navy/70'}`}>{g.icone}</span>
                    <span className="leading-tight text-navy/75">{g.label.split('\n').map((l, j) => (<span key={j} className="block">{l}</span>))}</span>
                  </div>
                )
              })}
            </div>
            {groupeNom && <div className="mt-1 border-t border-navy/10 pt-0.5 text-center text-[9px] font-semibold text-navy/60">{groupeNom}</div>}
          </div>
        </div>
      </div>
    )
  } else if (support === 'menu') {
    const { items = [] } = v
    support_ui = (
      <div className="mx-auto max-w-xs animate-fade-up overflow-hidden rounded-md border border-navy/20 bg-white text-[11px] shadow-xl">
        {items.map((it, i) => {
          const label = typeof it === 'string' ? it : it.label
          if (label === '-') return <div key={i} className="my-0.5 border-t border-navy/10" />
          const bon = trouve && i === cible
          const rate = rates.includes(i)
          const cliquable = !trouve && !rate
          return (
            <div
              key={i}
              onClick={cliquable ? () => choisir(i) : undefined}
              className={`flex items-center gap-2 px-3 py-1.5 transition ${cliquable ? 'cursor-pointer hover:bg-mint/10' : ''} ${bon ? 'bg-mint/20 font-bold text-navy' : rate ? 'text-navy/30' : 'text-navy/80'}`}
            >
              {typeof it === 'object' && it.icone && <span className="w-4 text-center">{it.icone}</span>}
              <span>{label}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="mt-3">
      {consigne && <p className="mb-2 rounded-xl bg-navy/5 px-3 py-2 text-center text-sm font-bold text-navy">👆 {consigne}</p>}
      {support_ui}
      {trouve ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-mint/15 px-3 py-2 text-sm text-navy/90">
          <span className="font-bold text-mint">✓ {rates.length === 0 ? 'Pile dessus, du premier coup ! 🥋' : 'Voilà ! 🥋'}</span> {explication}
        </p>
      ) : rates.length > 0 ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-navy/10 px-3 py-2 text-sm font-medium text-navy/90">{ENCOURAGEMENTS_Q[(rates.length - 1) % ENCOURAGEMENTS_Q.length]}</p>
      ) : null}
    </div>
  )
}

// « Construis la formule » : l'élève BÂTIT une fonction multi-arguments en manipulant,
// geste par geste (cliquer la cellule-clé, sélectionner une plage sur un autre onglet,
// choisir le n° de colonne, choisir FAUX). La formule s'écrit toute seule dans la barre
// au fil des gestes ; à la fin, le résultat s'affiche dans la cellule. Générique : piloté
// par `sequence` (étapes de type 'clic' | 'plage' | 'choix'), donc réutilisable pour
// RECHERCHEV/RECHERCHEX/SI… Aucune consigne ne nomme la réponse : on FAIT d'abord.
function ConstruitFormule({ v, onResolu, onErreur }) {
  const { prefixe = '=', grilles = {}, sequence = [], resultat, resultatValeur, resultatFeuille, explication } = v
  const [etape, setEtape] = useState(0)
  const [faits, setFaits] = useState([])
  const [anchor, setAnchor] = useState(null)
  const [feuilleVue, setFeuilleVue] = useState(null) // onglet cliqué par l'élève (formules inter-feuilles)
  const [ongletAnchor, setOngletAnchor] = useState(null) // 1re feuille d'une sélection 3D (Shift)
  const [rate, setRate] = useState(false)
  const [rates, setRates] = useState([])
  const feuilles = Object.keys(grilles)
  const fini = etape >= sequence.length
  const stepC = sequence[etape] || {}
  const feuilleFin = resultatFeuille || feuilles[0]
  const feuilleActive = fini ? feuilleFin : stepC.feuille || feuilleVue || feuilles[0]
  const grille = grilles[feuilleActive] || { cols: [], rows: [], cells: {} }
  const formule = prefixe + faits.join('')
  // Pendant une étape « suggestion », on affiche aussi les lettres déjà tapées (ex : =ARRONDI).
  // On retire un « = » de tête pour ne pas le doubler avec le préfixe.
  const enSaisie = !fini && stepC.type === 'suggestion' ? (stepC.saisie || '').replace(/^=/, '') : ''
  const formuleAff = formule + enSaisie

  const parse = (id) => ({ c: (id.match(/[A-Z]+/) || [''])[0], r: parseInt((id.match(/\d+/) || ['0'])[0], 10) })
  const idsEntre = (a, b, cols) => {
    const A = parse(a), B = parse(b)
    if (A.c === B.c) {
      const [r1, r2] = [A.r, B.r].sort((x, y) => x - y)
      const out = []
      for (let r = r1; r <= r2; r++) out.push(A.c + r)
      return out
    }
    if (A.r === B.r) {
      const i1 = cols.indexOf(A.c), i2 = cols.indexOf(B.c)
      if (i1 < 0 || i2 < 0) return null
      const [c1, c2] = [i1, i2].sort((x, y) => x - y)
      const out = []
      for (let i = c1; i <= c2; i++) out.push(cols[i] + A.r)
      return out
    }
    // plage rectangulaire (plusieurs lignes ET colonnes)
    const i1 = cols.indexOf(A.c), i2 = cols.indexOf(B.c)
    if (i1 < 0 || i2 < 0) return null
    const [c1, c2] = [i1, i2].sort((x, y) => x - y)
    const [r1, r2] = [A.r, B.r].sort((x, y) => x - y)
    const out = []
    for (let r = r1; r <= r2; r++) for (let i = c1; i <= c2; i++) out.push(cols[i] + r)
    return out
  }
  const memeEnsemble = (a, b) => a && b && a.length === b.length && a.every((x) => b.includes(x))
  const plageCible = stepC.type === 'plage' ? idsEntre(stepC.debut, stepC.fin, grille.cols) || [] : []

  const finirEtape = (ajoute) => {
    setFaits((f) => [...f, ajoute])
    setAnchor(null)
    setOngletAnchor(null)
    setRates([])
    setEtape((e) => e + 1)
  }
  // On débloque « Continuer » APRÈS le commit (pas pendant le rendu, sinon React râle
  // qu'on met à jour le parent en plein rendu).
  useEffect(() => {
    if (etape >= sequence.length) onResolu && onResolu()
  }, [etape])
  const raterCourt = () => {
    setRate(true)
    onErreur && onErreur()
    setTimeout(() => {
      setRate(false)
      setAnchor(null)
      setOngletAnchor(null)
    }, 800)
  }
  const clicCellule = (id) => {
    if (fini) return
    if (stepC.type === 'clic') {
      if (id === stepC.cible) finirEtape(stepC.ajoute)
      else raterCourt()
    } else if (stepC.type === 'plage') {
      if (!anchor) {
        setAnchor(id)
        return
      }
      const sel = idsEntre(anchor, id, grille.cols)
      if (memeEnsemble(sel, plageCible)) finirEtape(stepC.ajoute)
      else raterCourt()
    }
  }
  const clicChoix = (val) => {
    if (fini) return
    if (val === stepC.cible) finirEtape(stepC.ajoute)
    else if (!rates.includes(val)) {
      setRates((r) => [...r, val])
      onErreur && onErreur()
    }
  }
  // Étape « suggestion » : l'élève choisit la bonne fonction dans l'autocomplétion.
  const clicSuggestion = (nom) => {
    if (fini) return
    if (nom === stepC.cible) finirEtape(stepC.ajoute)
    else if (!rates.includes(nom)) {
      setRates((r) => [...r, nom])
      onErreur && onErreur()
    }
  }
  // Étape « onglet »/« ongletplage » : l'élève clique l'onglet d'une autre feuille
  // (formule inter-feuilles =Janvier!B5, ou référence 3D =SOMME(AIN:Cantal!C10)).
  const clicOnglet = (f) => {
    if (fini) return
    if (stepC.type === 'onglet') {
      if (f === stepC.cible) { setFeuilleVue(f); finirEtape(stepC.ajoute) }
      else raterCourt()
    } else if (stepC.type === 'ongletplage') {
      if (!ongletAnchor) {
        if (f === stepC.debut) { setOngletAnchor(f); setFeuilleVue(f) }
        else raterCourt()
      } else if (f === stepC.fin) { setFeuilleVue(stepC.debut); finirEtape(stepC.ajoute) }
      else raterCourt()
    }
  }
  const idxFeuille = (f) => feuilles.indexOf(f)
  const dansPlageOnglets = (f) => {
    if (stepC.type !== 'ongletplage') return false
    const [i1, i2] = [idxFeuille(ongletAnchor || stepC.debut), idxFeuille(stepC.fin)].sort((a, b) => a - b)
    const i = idxFeuille(f)
    return i >= 0 && i >= i1 && i <= i2
  }

  const choixOptions = (stepC.options || []).map((o) => (typeof o === 'string' ? { label: o, val: o } : o))

  return (
    <div className="mt-3">
      {!fini && stepC.consigne && (
        <p className="mb-2 rounded-xl bg-navy/5 px-3 py-2 text-center text-sm font-bold text-navy">👆 {stepC.consigne}</p>
      )}
      <div className="overflow-hidden rounded-xl border border-navy/10 bg-white shadow-lg">
        <div className="flex items-center gap-2 border-b border-navy/10 bg-navy/5 px-3 py-1.5 text-xs">
          <span className="font-bold text-navy/50">fx</span>
          <span className="font-mono text-navy/90">{coloreFormule(formuleAff)}<span className="animate-pulse text-navy/40">{fini ? '' : '|'}</span></span>
        </div>
        <div className="grid text-xs" style={{ gridTemplateColumns: `28px repeat(${grille.cols.length}, 1fr)` }}>
          <div className="bg-navy/5" />
          {grille.cols.map((c) => (
            <div key={c} className="border-b border-l border-navy/10 bg-navy/10 py-1 text-center text-navy/50">{c}</div>
          ))}
          {grille.rows.map((r) => (
            <div key={r} className="contents">
              <div className="border-b border-navy/10 bg-navy/10 py-1 text-center text-navy/50">{r}</div>
              {grille.cols.map((c) => {
                const id = c + r
                const cell = (grille.cells || {})[id] || {}
                const estResultat = id === resultat && feuilleActive === feuilleFin
                const montreValeur = fini && resultatValeur != null
                let contenu = cell.t
                if (estResultat) contenu = montreValeur ? resultatValeur : formuleAff
                const estFormule = typeof contenu === 'string' && contenu.startsWith('=')
                const dansPlage = anchor && stepC.type === 'plage' && idsEntre(anchor, id, grille.cols) && memeEnsemble(idsEntre(anchor, id, grille.cols), plageCible)
                const estAnchor = anchor === id
                const estRate = rate && (estAnchor || stepC.type === 'clic')
                const cliquable = !cell.entete && !fini && (stepC.type === 'clic' || stepC.type === 'plage') && !estResultat
                let cls = 'text-navy/90'
                if (cell.entete) cls = 'bg-navy/10 font-bold text-navy/70'
                else if (estResultat && montreValeur) cls = 'bg-mint/25 font-bold text-mint-dark'
                else if (plageCible.includes(id) && (dansPlage || (stepC.type === 'plage' && anchor && estAnchor))) cls = 'bg-sky-500/25 font-bold text-navy ring-1 ring-inset ring-sky-400'
                else if (estAnchor) cls = 'bg-mint/30 ring-2 ring-inset ring-mint'
                else if (estRate) cls = 'bg-red-500/15 text-navy/50'
                else if (cliquable) cls = 'text-navy/90 hover:bg-mint/10'
                return (
                  <div
                    key={id}
                    onClick={cliquable ? () => clicCellule(id) : undefined}
                    className={`min-h-[30px] border-b border-l border-navy/10 px-2 py-1 ${cell.num ? 'text-right' : ''} ${cliquable ? 'cursor-pointer' : ''} ${cls}`}
                  >
                    {estFormule ? <span className="font-mono text-[10px] leading-tight">{coloreFormule(contenu)}</span> : contenu || ''}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        {feuilles.length > 1 && (
          <div className="flex flex-wrap items-end gap-1 border-t border-navy/10 bg-navy/5 px-2 pt-1 text-[10px]">
            {feuilles.map((f) => {
              const actif = f === feuilleActive
              const ongletStep = !fini && (stepC.type === 'onglet' || stepC.type === 'ongletplage')
              if (ongletStep) {
                const estCible = stepC.type === 'onglet' ? f === stepC.cible : dansPlageOnglets(f)
                const pulse = stepC.type === 'onglet' ? f === stepC.cible : f === (ongletAnchor ? stepC.fin : stepC.debut)
                return (
                  <button key={f} onClick={() => clicOnglet(f)} className={`rounded-t px-2.5 py-0.5 ${estCible ? 'bg-mint/25 font-bold text-navy ring-1 ring-inset ring-mint' : actif ? 'bg-white font-semibold text-navy/70' : 'bg-navy/10 text-navy/50 hover:bg-navy/20'} ${pulse ? 'animate-pulse' : ''}`}>{f}</button>
                )
              }
              return <span key={f} className={`rounded-t px-2.5 py-0.5 ${actif ? 'bg-white font-bold text-navy' : 'bg-navy/10 text-navy/50'}`}>{f}</span>
            })}
          </div>
        )}
      </div>

      {!fini && stepC.type === 'choix' && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {choixOptions.map((o) => {
            const rate = rates.includes(o.val)
            return (
              <button
                key={o.val}
                onClick={rate ? undefined : () => clicChoix(o.val)}
                className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${rate ? 'border-navy/10 text-navy/30' : 'border-navy/15 text-navy hover:border-mint hover:bg-mint/10'}`}
              >
                {o.label}
              </button>
            )
          })}
        </div>
      )}

      {!fini && stepC.type === 'suggestion' && (
        <div className="mx-auto mt-3 max-w-sm overflow-hidden rounded-md border border-navy/20 bg-white text-xs shadow-xl">
          {(stepC.items || []).map((it) => {
            const nom = typeof it === 'string' ? it : it.nom
            const rate = rates.includes(nom)
            const cible = nom === stepC.cible
            return (
              <div key={nom}>
                <button onClick={rate ? undefined : () => clicSuggestion(nom)} className={`flex w-full items-center gap-2 px-3 py-1.5 text-left font-mono ${rate ? 'text-navy/25' : cible ? 'bg-[#dbe6fb] text-navy hover:bg-[#cddcf7]' : 'text-navy/80 hover:bg-mint/10'}`}>
                  <span className="grid h-4 w-5 shrink-0 place-items-center rounded bg-[#107c41] text-[8px] font-bold italic text-white">fx</span>{nom}
                </button>
                {cible && it.desc && <p className="bg-[#fdf6e3] px-3 py-1 text-[10px] italic text-navy/55">{it.desc}</p>}
              </div>
            )
          })}
        </div>
      )}

      {!fini && stepC.type === 'saisir' && (
        <div className="mt-3 flex justify-center">
          <button onClick={() => finirEtape(stepC.ajoute)} className="flex animate-pulse items-center gap-2 rounded-xl border-2 border-mint bg-mint/15 px-4 py-2 text-sm font-bold text-navy">
            <span className="text-base leading-none">⌨</span> Tape <span className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-[13px]">{stepC.label || stepC.ajoute}</span>
          </button>
        </div>
      )}

      {fini ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-mint/15 px-3 py-2 text-sm text-navy/90">
          <span className="font-bold text-mint">✓ Formule construite ! 🥋</span> {explication}
        </p>
      ) : stepC.type === 'plage' && anchor ? (
        <p className="mt-2 rounded-xl bg-navy/10 px-3 py-2 text-sm font-medium text-navy/90">{rate ? 'Pas tout à fait cette plage. Reclique la première cellule.' : `Première cellule : ${anchor}. Clique maintenant la DERNIÈRE cellule de la plage.`}</p>
      ) : rate || rates.length > 0 ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-navy/10 px-3 py-2 text-sm font-medium text-navy/90">{ENCOURAGEMENTS_Q[(Math.max(rates.length, 1) - 1) % ENCOURAGEMENTS_Q.length]}</p>
      ) : null}
    </div>
  )
}

// « Lequel choisir ? » : la DÉCOUVERTE avant l'explication — 2 ou 3 propositions
// (mini-tableaux), l'élève clique la bonne AVANT que le Shifu n'explique la règle.
// Liste de données VIVANTE : le user agit (met sous forme de tableau, trie, filtre…)
// et VOIT le résultat changer (le tableau se transforme, se réordonne, se filtre, s'étend).
// mode: 'creertableau' | 'trier' | 'filtrer'
function ListeInteractive({ v, onResolu }) {
  const {
    mode = 'creertableau', colonnes = [], lignes = [], triCol = 0, triLabel = 'Trier du plus grand au plus petit',
    filtreCol = 0, garder = [], nouvelle = [], colCible = 1, amorce = 'Par', complet = 'Paris',
    nouvelleForm = [], stCol = 1, stTotalCol = 2, resultat = '',
  } = v
  const num = (s) => { const n = parseInt(String(s).replace(/[^\d-]/g, ''), 10); return isNaN(n) ? null : n }
  const eur = (n) => n.toLocaleString('fr-FR').replace(/ /g, ' ') + ' €'
  const [rows, setRows] = useState(lignes)
  const [estTable, setEstTable] = useState(mode !== 'creertableau')
  const [etape, setEtape] = useState(0) // creertableau : 0 liste brute, 1 boîte, 2 tableau, 3 étendu
  const [menuCol, setMenuCol] = useState(null)
  const [coches, setCoches] = useState(() => { const o = {}; [...new Set(lignes.map((l) => l[filtreCol]))].forEach((val) => (o[val] = true)); return o })
  const [funnel, setFunnel] = useState(false)
  const [ghost, setGhost] = useState(false)        // saisieauto : suggestion grise affichée
  const [menuCible, setMenuCible] = useState(false) // listechoix : liste déroulante ouverte
  const [valChoisie, setValChoisie] = useState(null) // listechoix : valeur choisie affichée dans la cellule
  const [form, setForm] = useState(null)           // formulaire : valeurs (null tant que « Nouveau »)
  const [dialog, setDialog] = useState(false)      // soustotal / reptitres : boîte ouverte
  const [champRep, setChampRep] = useState(false)  // reptitres : champ « lignes à répéter » rempli
  const [fait, setFait] = useState(false)
  useEffect(() => { if (fait) onResolu && onResolu() }, [fait])
  const distinctes = [...new Set(lignes.map((l) => l[filtreCol]))]
  const distinctesCible = [...new Set(lignes.map((l) => l[colCible]))]

  const trier = () => { setRows((r) => [...r].sort((a, b) => { const x = num(a[triCol]), y = num(b[triCol]); return x != null ? y - x : String(b[triCol]).localeCompare(String(a[triCol])) })); setMenuCol(null); setFait(true) }
  const appliquerFiltre = () => { setRows(lignes.filter((l) => coches[l[filtreCol]])); setMenuCol(null); setFunnel(true); setFait(true) }
  const clicFleche = (ci) => { if (fait) return; if ((mode === 'trier' && ci === triCol) || (mode === 'filtrer' && ci === filtreCol)) setMenuCol(menuCol === ci ? null : ci) }
  const rowsSousTotal = () => {
    const out = []; let grp = null, somme = 0, total = 0
    const flush = () => { if (grp != null) { const l = Array(colonnes.length).fill(''); l[stCol] = `Total ${grp}`; l[stTotalCol] = eur(somme); out.push({ st: true, cells: l }) } }
    lignes.forEach((li) => { const g = li[stCol], val = num(li[stTotalCol]) || 0; if (g !== grp) { flush(); grp = g; somme = 0 } somme += val; total += val; out.push({ cells: li }) })
    flush(); const tg = Array(colonnes.length).fill(''); tg[stCol] = 'Total général'; tg[stTotalCol] = eur(total); out.push({ st: true, grand: true, cells: tg }); return out
  }

  const consigne = () => {
    switch (mode) {
      case 'creertableau': return etape === 0 ? 'Clique **Mettre sous forme de tableau** pour transformer ta liste.' : etape === 1 ? 'Vérifie que **« Mon tableau comporte des en-têtes »** est coché, puis **OK**.' : 'Ta liste est un tableau ! **Clique la ligne vide** en dessous pour l\'étendre.'
      case 'trier': return menuCol === triCol ? `Clique **${triLabel}**.` : `Clique la **flèche ▾** de la colonne « ${colonnes[triCol]} ».`
      case 'filtrer': return menuCol === filtreCol ? `Décoche tout sauf **${garder.join(', ')}**, puis **OK**.` : `Clique la **flèche ▾** de la colonne « ${colonnes[filtreCol]} ».`
      case 'listechoix': return menuCible ? 'Choisis une **ville** dans la liste.' : `Clique la **flèche ▾** de la cellule vide (colonne « ${colonnes[colCible]} »).`
      case 'saisieauto': return !ghost ? `Commence à taper **« ${amorce} »** dans la cellule vide.` : `Excel propose **« ${complet} »** en gris : appuie sur **Entrée**.`
      case 'soustotal': return dialog ? 'Vérifie les réglages (Ville · Somme · CA), puis **OK**.' : 'Clique **Sous-total** pour regrouper par ville.'
      case 'formulaire': return form == null ? 'Clique **Nouveau** pour saisir une ligne.' : 'Les champs sont remplis : clique **Ajouter** pour l\'insérer dans le tableau.'
      case 'reptitres': return !dialog ? 'Clique **Imprimer les titres** pour régler la répétition.' : !champRep ? 'Clique **Lignes à répéter en haut** (la ligne de titres), puis **OK**.' : 'Clique **OK** : les titres apparaissent en haut de la page 2.'
      default: return ''
    }
  }

  const affiche = mode === 'soustotal' && fait ? rowsSousTotal() : rows.map((c) => ({ cells: c }))
  const grilleVisible = mode !== 'reptitres'

  return (
    <div className="mt-3">
      <div className={`rounded-xl border px-3 py-2 text-sm ${fait ? 'border-mint/40 bg-mint/[0.07]' : 'border-navy/10 bg-navy/5'}`}>
        {fait ? <span className="font-bold text-mint">✓ {resultat}</span> : <span className="text-navy/85">👆 {gras(consigne())}</span>}
      </div>

      {grilleVisible && (
        <div className="mx-auto mt-3 max-w-md overflow-hidden rounded-lg border border-navy/15 text-[11px] shadow">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${colonnes.length}, 1fr)` }}>
            {colonnes.map((c, ci) => {
              const cliquable = (mode === 'trier' && ci === triCol) || (mode === 'filtrer' && ci === filtreCol)
              return (
                <div key={ci} className={`flex items-center justify-between gap-1 border-b border-navy/10 px-2 py-1.5 font-bold ${estTable ? 'bg-mint text-white' : 'bg-navy/10 text-navy/70'}`}>
                  <span>{c}</span>
                  {estTable && (mode === 'trier' || mode === 'filtrer') && <button onClick={() => clicFleche(ci)} className={`grid h-4 w-4 shrink-0 place-items-center rounded-sm bg-white/25 text-[9px] ${cliquable && !fait ? 'animate-pulse ring-1 ring-white' : ''}`}>{funnel && ci === filtreCol ? '▽' : '▾'}</button>}
                </div>
              )
            })}
            {affiche.map((r, ri) => r.cells.map((cell, ci) => (
              <div key={ri + '-' + ci} className={`border-b border-navy/5 px-2 py-1 ${r.grand ? 'bg-navy/10 font-bold' : r.st ? 'bg-mint/15 font-semibold' : estTable && ri % 2 ? 'bg-mint/[0.08]' : 'bg-white'} ${ci === colonnes.length - 1 ? 'text-right font-mono' : ''} text-navy/85`}>{cell}</div>
            )))}
            {(mode === 'listechoix' || mode === 'saisieauto') && !fait && colonnes.map((c, ci) => {
              if (ci !== colCible) return <div key={'t' + ci} className="border-b border-navy/5 bg-white px-2 py-1 text-navy/25">{ci === 0 ? '(nouvelle)' : ''}</div>
              return (
                <div key={'t' + ci} className="relative border-b border-navy/5 bg-white px-1 py-1">
                  {mode === 'listechoix' ? (
                    <>
                      <button onClick={() => setMenuCible(!menuCible)} className={`flex w-full items-center justify-between rounded-sm border px-1.5 py-0.5 ${valChoisie ? 'border-navy/25 font-semibold text-navy' : 'animate-pulse border-mint text-navy/40 ring-1 ring-mint'}`}><span>{valChoisie || 'choisir…'}</span><span className="ml-1 text-navy/40">▾</span></button>
                    </>
                  ) : (
                    <span className="font-mono text-navy/80">{ghost ? <>{amorce}<span className="text-navy/30">{complet.slice(amorce.length)}</span></> : <span className="animate-pulse text-navy/30">saisie…</span>}</span>
                  )}
                </div>
              )
            })}
            {mode === 'creertableau' && estTable && etape >= 2 && (
              <button onClick={() => { if (etape === 2) { setRows((r) => [...r, nouvelle]); setEtape(3); setFait(true) } }} style={{ gridColumn: `1 / ${colonnes.length + 1}` }}
                className={`px-2 py-1.5 text-left text-navy/40 ${etape === 2 ? 'animate-pulse bg-mint/10 ring-1 ring-inset ring-mint' : ''}`}>＋ clique pour saisir une nouvelle ligne…</button>
            )}
          </div>
        </div>
      )}

      {mode === 'listechoix' && menuCible && !fait && (
        <div className="mx-auto mt-2 w-44 overflow-hidden rounded-md border border-navy/20 bg-white text-[11px] shadow-xl">
          <p className="border-b border-navy/10 bg-navy/5 px-2 py-1 text-[10px] font-semibold text-navy/50">Valeurs de « {colonnes[colCible]} »</p>
          {distinctesCible.map((val) => <button key={val} onClick={() => { setValChoisie(val); setMenuCible(false); setFait(true) }} className="block w-full px-2 py-1.5 text-left font-mono text-navy/80 hover:bg-mint/15">{val}</button>)}
        </div>
      )}
      {mode === 'creertableau' && etape === 0 && (
        <div className="mt-3 flex justify-center"><button onClick={() => setEtape(1)} className="animate-pulse rounded-md border-2 border-mint bg-mint/15 px-4 py-2 text-sm font-bold text-navy">▧ Mettre sous forme de tableau</button></div>
      )}
      {mode === 'creertableau' && etape === 1 && (
        <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
          <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Créer un tableau</span><span className="text-navy/40">✕</span></div>
          <div className="space-y-2 bg-white p-3">
            <div className="flex items-center gap-2"><span className="text-navy/60">Où sont les données ?</span><span className="rounded-sm border border-navy/25 px-2 py-1 font-mono text-navy/70">=$A$1:$C$5</span></div>
            <div className="flex items-center gap-2 text-navy/80"><span className="grid h-4 w-4 shrink-0 place-items-center rounded-sm border border-mint bg-mint text-[9px] text-white">✓</span>Mon tableau comporte des en-têtes</div>
            <div className="flex justify-end gap-2 border-t border-navy/10 pt-2"><button onClick={() => { setEstTable(true); setEtape(2) }} className="animate-pulse rounded-sm border-2 border-mint bg-mint/15 px-5 py-0.5 font-bold text-navy">OK</button><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5 text-navy/60">Annuler</span></div>
          </div>
        </div>
      )}

      {menuCol !== null && mode === 'trier' && (
        <div className="mx-auto mt-2 w-60 overflow-hidden rounded-md border border-navy/20 bg-white py-1 text-[11px] shadow-xl">
          {[triLabel, 'Trier du plus petit au plus grand'].map((opt, i) => (
            <button key={i} onClick={() => i === 0 && trier()} className={`block w-full px-3 py-1.5 text-left ${i === 0 ? 'animate-pulse bg-mint/15 font-semibold text-navy ring-1 ring-inset ring-mint' : 'text-navy/45'}`}>{opt}</button>
          ))}
        </div>
      )}
      {menuCol !== null && mode === 'filtrer' && (
        <div className="mx-auto mt-2 w-48 overflow-hidden rounded-md border border-navy/20 bg-white p-2 text-[11px] shadow-xl">
          {distinctes.map((val) => (
            <button key={val} onClick={() => setCoches((c) => ({ ...c, [val]: !c[val] }))} className="flex w-full items-center gap-2 px-1 py-1 text-left text-navy/80">
              <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-sm border text-[9px] text-white ${coches[val] ? 'border-mint bg-mint' : 'border-navy/30'}`}>{coches[val] && '✓'}</span>{val}
            </button>
          ))}
          <div className="mt-1 flex justify-end border-t border-navy/10 pt-1"><button onClick={appliquerFiltre} className="animate-pulse rounded-sm border-2 border-mint bg-mint/15 px-4 py-0.5 font-bold text-navy">OK</button></div>
        </div>
      )}

      {mode === 'saisieauto' && !fait && (
        <div className="mt-3 flex justify-center">
          {!ghost
            ? <button onClick={() => setGhost(true)} className="flex animate-pulse items-center gap-2 rounded-xl border-2 border-mint bg-mint/15 px-4 py-2 text-sm font-bold text-navy"><span>⌨</span> Tape <span className="rounded bg-white/70 px-1.5 py-0.5 font-mono">{amorce}</span></button>
            : <button onClick={() => setFait(true)} className="animate-pulse rounded-xl border-2 border-mint bg-mint/15 px-4 py-2 text-sm font-bold text-navy">⏎ Entrée — valider « {complet} »</button>}
        </div>
      )}

      {mode === 'soustotal' && !fait && !dialog && (
        <div className="mt-3 flex justify-center"><button onClick={() => setDialog(true)} className="animate-pulse rounded-md border-2 border-mint bg-mint/15 px-4 py-2 text-sm font-bold text-navy">Σ Sous-total</button></div>
      )}
      {mode === 'soustotal' && dialog && !fait && (
        <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
          <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Sous-total</span><span className="text-navy/40">✕</span></div>
          <div className="space-y-2 bg-white p-3">
            <div className="flex items-center gap-2"><span className="w-36 shrink-0 text-right text-navy/60">À chaque changement de :</span><span className="flex-1 rounded-sm border border-navy/25 px-2 py-0.5 text-navy/80">Ville ▾</span></div>
            <div className="flex items-center gap-2"><span className="w-36 shrink-0 text-right text-navy/60">Utiliser la fonction :</span><span className="flex-1 rounded-sm border border-navy/25 px-2 py-0.5 text-navy/80">Somme ▾</span></div>
            <p className="text-navy/60">Ajouter un sous-total à :</p>
            <div className="flex items-center gap-2 text-navy/80"><span className="grid h-4 w-4 place-items-center rounded-sm border border-mint bg-mint text-[9px] text-white">✓</span>CA</div>
            <div className="flex justify-end gap-2 border-t border-navy/10 pt-2"><button onClick={() => { setDialog(false); setFait(true) }} className="animate-pulse rounded-sm border-2 border-mint bg-mint/15 px-5 py-0.5 font-bold text-navy">OK</button><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5 text-navy/60">Annuler</span></div>
          </div>
        </div>
      )}

      {mode === 'formulaire' && !fait && (
        <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
          <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Feuille1</span><span className="text-navy/40">✕</span></div>
          <div className="space-y-1.5 bg-white p-3">
            {colonnes.map((c, i) => (
              <div key={i} className="flex items-center gap-2"><span className="w-16 shrink-0 text-right text-navy/60">{c} :</span><span className={`min-w-0 flex-1 rounded-sm border px-2 py-1 font-mono ${form ? 'border-navy/30 text-navy' : 'border-navy/20 text-navy/30'}`}>{form ? form[i] : ' '}</span></div>
            ))}
            <div className="flex justify-end gap-2 border-t border-navy/10 pt-2">
              {form == null
                ? <button onClick={() => setForm(nouvelleForm)} className="animate-pulse rounded-sm border-2 border-mint bg-mint/15 px-4 py-0.5 font-bold text-navy">Nouveau</button>
                : <button onClick={() => { setRows((r) => [...r, form]); setFait(true) }} className="animate-pulse rounded-sm border-2 border-mint bg-mint/15 px-4 py-0.5 font-bold text-navy">Ajouter</button>}
            </div>
          </div>
        </div>
      )}

      {mode === 'reptitres' && (
        <>
          <div className="mx-auto mt-3 flex max-w-md gap-3">
            {[0, 1].map((pg) => (
              <div key={pg} className="flex-1 rounded border border-navy/15 bg-white p-1.5 shadow-sm">
                <p className="mb-1 text-center text-[8px] uppercase tracking-wide text-navy/40">Page {pg + 1}</p>
                {pg === 0 || champRep ? (
                  <div className="grid grid-cols-3 bg-mint text-[8px] font-bold text-white">{colonnes.map((c, i) => <span key={i} className="px-1 py-0.5">{c}</span>)}</div>
                ) : (
                  <div className="bg-navy/5 px-1 py-0.5 text-center text-[8px] italic text-navy/30">(sans titres)</div>
                )}
                {(pg === 0 ? lignes.slice(0, 2) : lignes.slice(2, 4)).map((l, ri) => (
                  <div key={ri} className="grid grid-cols-3 text-[8px]">{l.map((cell, ci) => <span key={ci} className="border-b border-navy/5 px-1 py-0.5 text-navy/80">{cell}</span>)}</div>
                ))}
              </div>
            ))}
          </div>
          {!dialog && !fait && <div className="mt-3 flex justify-center"><button onClick={() => setDialog(true)} className="animate-pulse rounded-md border-2 border-mint bg-mint/15 px-4 py-2 text-sm font-bold text-navy">📄 Imprimer les titres</button></div>}
          {dialog && !fait && (
            <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
              <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Mise en page</span><span className="text-navy/40">✕</span></div>
              <div className="space-y-2 bg-white p-3">
                <div className="flex items-center gap-2"><span className="shrink-0 text-navy/60">Lignes à répéter en haut :</span><button onClick={() => setChampRep(true)} className={`min-w-0 flex-1 rounded-sm border px-2 py-1 text-left font-mono ${champRep ? 'border-navy/30 text-navy' : 'animate-pulse border-mint text-navy/35 ring-1 ring-mint'}`}>{champRep ? '$1:$1' : 'clique la ligne de titres…'}</button></div>
                <div className="flex justify-end gap-2 border-t border-navy/10 pt-2"><button onClick={() => { if (champRep) { setDialog(false); setFait(true) } }} disabled={!champRep} className={`rounded-sm border-2 px-5 py-0.5 font-bold ${champRep ? 'animate-pulse border-mint bg-mint/15 text-navy' : 'border-navy/15 bg-navy/5 text-navy/35'}`}>OK</button><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5 text-navy/60">Annuler</span></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const GRAPHE_DEF = { cats: ['Jan', 'Fév', 'Mar', 'Avr'], series: [{ nom: 'Ventes', vals: [12, 19, 15, 24] }] }
// Graphe SVG VIVANT : rendu réel (barres groupées, courbes, aires, barres horizontales,
// secteurs) qui reflète l'état (type, éléments affichés, couleurs, échelle, sélection,
// thème, taille). C'est le cœur du chapitre « graphiques » : le user agit, le graphe change.
function GrapheSVG({ data, type = 'histogramme', titre = '', options = {}, selection = null, theme = 'clair', echelle = 1, axeMin, axeMax, secondaire }) {
  const cats = data.cats || []
  const series = (data.series || []).filter((s) => !s.masque)
  const COUL = ['#41c1ba', '#0a335d', '#e8853a', '#8b5cf6']
  const coul = (s, i) => s.couleur || COUL[i % COUL.length]
  const sombre = theme === 'sombre'
  const fg = sombre ? '#e8eef6' : '#5b6b7f'
  const bg = sombre ? '#16243f' : '#ffffff'
  const grille = sombre ? 'rgba(255,255,255,.12)' : 'rgba(10,51,93,.10)'
  const W = 340, H = 210, ML = 34, MR = 12, MT = 30, MB = 26
  const pW = W - ML - MR, pH = H - MT - MB
  const toutes = series.flatMap((s) => s.vals)
  const vmax = axeMax != null ? axeMax : Math.ceil((Math.max(1, ...toutes) * 1.15) / 5) * 5
  const vmin = axeMin != null ? axeMin : 0
  const y = (v) => MT + pH - ((v - vmin) / (vmax - vmin || 1)) * pH
  const ticks = [0, 1, 2, 3, 4].map((i) => vmin + ((vmax - vmin) * i) / 4)
  const gW = pW / (cats.length || 1)
  const selSerie = (i) => selection === `serie:${i}`
  const secId = secondaire // index de la série tracée en courbe sur l'axe secondaire (mixte)
  const s2max = secId != null ? Math.ceil((Math.max(1, ...(series[secId]?.vals || [1])) * 1.15) / 10) * 10 : 0
  const y2 = (v) => MT + pH - (v / (s2max || 1)) * pH

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: `${Math.round(100 * echelle)}%`, maxWidth: '100%', transition: 'width .25s' }} className="mx-auto block">
      <rect x="0" y="0" width={W} height={H} rx="6" fill={bg} stroke={selection === 'zone' ? '#41c1ba' : sombre ? '#0a2544' : '#e7e2d6'} strokeWidth={selection === 'zone' ? 2 : 1} />
      {options.titre !== false && <text x={W / 2} y="18" textAnchor="middle" fontSize="12" fontWeight="700" fill={selection === 'titre' ? '#e8853a' : sombre ? '#fff' : '#0a335d'} style={selection === 'titre' ? { outline: '1px dashed #e8853a' } : undefined}>{titre}</text>}
      {selection === 'titre' && <rect x={W / 2 - 60} y="6" width="120" height="16" fill="none" stroke="#e8853a" strokeDasharray="3 2" />}
      {/* quadrillage + axe Y */}
      {options.quadrillage !== false && ticks.map((t, i) => <line key={i} x1={ML} x2={W - MR} y1={y(t)} y2={y(t)} stroke={grille} strokeWidth="1" />)}
      {ticks.map((t, i) => <text key={i} x={ML - 5} y={y(t) + 3} textAnchor="end" fontSize="8" fill={fg}>{Math.round(t)}</text>)}
      <line x1={ML} x2={ML} y1={MT} y2={MT + pH} stroke={selection === 'axeY' ? '#41c1ba' : fg} strokeWidth={selection === 'axeY' ? 2.5 : 1} />
      <line x1={ML} x2={W - MR} y1={MT + pH} y2={MT + pH} stroke={fg} strokeWidth="1" />
      {/* tracé selon le type */}
      {(type === 'histogramme' || type === 'barres') && cats.map((c, ci) => {
        const n = series.length, bw = (gW * 0.7) / n
        return series.map((s, si) => {
          const bx = ML + ci * gW + gW * 0.15 + si * bw
          const bh = MT + pH - y(s.vals[ci])
          return <rect key={ci + '-' + si} x={bx} y={y(s.vals[ci])} width={bw - 1} height={Math.max(0, bh)} rx="1.5" fill={coul(s, si)} opacity={selection && !selSerie(si) && selection.startsWith('serie') ? 0.35 : 1} stroke={selSerie(si) ? '#0a335d' : 'none'} strokeWidth={selSerie(si) ? 1.5 : 0} />
        })
      })}
      {(type === 'courbe' || type === 'aires') && series.map((s, si) => {
        const pts = cats.map((c, ci) => `${ML + ci * gW + gW / 2},${y(s.vals[ci])}`).join(' ')
        return (
          <g key={si} opacity={selection && !selSerie(si) && selection.startsWith('serie') ? 0.35 : 1}>
            {type === 'aires' && <polygon points={`${ML + gW / 2},${MT + pH} ${pts} ${ML + (cats.length - 1) * gW + gW / 2},${MT + pH}`} fill={coul(s, si)} opacity="0.25" />}
            <polyline points={pts} fill="none" stroke={coul(s, si)} strokeWidth={selSerie(si) ? 3.5 : 2.2} />
            {cats.map((c, ci) => <circle key={ci} cx={ML + ci * gW + gW / 2} cy={y(s.vals[ci])} r={selSerie(si) ? 3.5 : 2.5} fill={coul(s, si)} />)}
          </g>
        )
      })}
      {type === 'secteurs' && (() => {
        const vals = series[0]?.vals || [], tot = vals.reduce((a, b) => a + b, 0) || 1
        let ang = -Math.PI / 2; const cx = ML + pW / 2, cy = MT + pH / 2, r = Math.min(pW, pH) / 2 - 4
        return vals.map((v, i) => { const a0 = ang, a1 = ang + (v / tot) * 2 * Math.PI; ang = a1; const large = a1 - a0 > Math.PI ? 1 : 0; const d = `M${cx},${cy} L${cx + r * Math.cos(a0)},${cy + r * Math.sin(a0)} A${r},${r} 0 ${large} 1 ${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)} Z`; return <path key={i} d={d} fill={COUL[i % COUL.length]} /> })
      })()}
      {/* série secondaire en courbe (graphe mixte) */}
      {secId != null && series[secId] && (
        <>
          <polyline points={cats.map((c, ci) => `${ML + ci * gW + gW / 2},${y2(series[secId].vals[ci])}`).join(' ')} fill="none" stroke={coul(series[secId], secId)} strokeWidth="2.5" />
          {cats.map((c, ci) => <circle key={ci} cx={ML + ci * gW + gW / 2} cy={y2(series[secId].vals[ci])} r="2.5" fill={coul(series[secId], secId)} />)}
          <line x1={W - MR} x2={W - MR} y1={MT} y2={MT + pH} stroke={coul(series[secId], secId)} strokeWidth="1.5" />
        </>
      )}
      {/* étiquettes X */}
      {type !== 'secteurs' && cats.map((c, ci) => <text key={ci} x={ML + ci * gW + gW / 2} y={MT + pH + 12} textAnchor="middle" fontSize="8" fill={fg}>{c}</text>)}
      {/* étiquettes de données */}
      {options.etiquettes && (type === 'histogramme') && cats.map((c, ci) => series.map((s, si) => {
        const n = series.length, bw = (gW * 0.7) / n, bx = ML + ci * gW + gW * 0.15 + si * bw + bw / 2
        return <text key={ci + '-' + si} x={bx} y={y(s.vals[ci]) - 2} textAnchor="middle" fontSize="7" fontWeight="700" fill={sombre ? '#fff' : '#0a335d'}>{s.vals[ci]}</text>
      }))}
      {/* légende */}
      {options.legende && series.length > 0 && (
        <g>{series.map((s, si) => (
          <g key={si} transform={`translate(${ML + si * 84}, ${H - 6})`}>
            <rect x="0" y="-7" width="9" height="9" rx="1.5" fill={coul(s, si)} />
            <text x="13" y="0" fontSize="8" fill={fg}>{s.nom}</text>
          </g>
        ))}</g>
      )}
    </svg>
  )
}

// Wrapper interactif du graphe : chaque mode = une manipulation où le user AGIT et voit
// le graphe changer. Voir le tableau `bloque` + dispatch. Un seul composant, config via v.mode.
function GraphiqueInteractif({ v, onResolu }) {
  const {
    mode = 'inserer', donnees, titre = 'Ventes par mois', typeInitial = 'histogramme', typeCible = 'courbe',
    element = 'serie:0', couleurCible = '#e8853a', styleCible = 2, elementBascule = 'etiquettes',
    filtreCat, axeMinCible = 10, titreCible = 'Chiffre d\'affaires 2025', resultat = '',
  } = v
  const [type, setType] = useState(typeInitial)
  const [data, setData] = useState(donnees || GRAPHE_DEF)
  const [sel, setSel] = useState(null)
  const [opts, setOpts] = useState({ titre: true, legende: (donnees?.series?.length || 1) > 1, etiquettes: false, quadrillage: true })
  const [theme, setTheme] = useState('clair')
  const [echelle, setEchelle] = useState(1)
  const [axeMin, setAxeMin] = useState(0)
  const [tCourant, setTitre] = useState(titre)
  const [sousMenu, setSousMenu] = useState(false) // liste « Sélection active » ouverte
  const [dialog, setDialog] = useState(false)
  const [insere, setInsere] = useState(mode !== 'inserer')
  const [selectionne, setSelectionne] = useState(mode !== 'supprimer') // graphe sélectionné (départ : oui, sauf pour la suppression)
  const [supprime, setSupprime] = useState(false)
  const [cachees, setCachees] = useState([]) // catégories masquées (mode filtre)
  const [feuille, setFeuille] = useState(false)
  const [saisieTitre, setSaisieTitre] = useState(false)
  const [menuContext, setMenuContext] = useState(false) // menu clic droit (supprimer)
  const [axeSec, setAxeSec] = useState(false) // combine : « Nb ventes » sur l'axe secondaire
  const [fait, setFait] = useState(false)
  useEffect(() => { if (fait) onResolu && onResolu() }, [fait])
  // Glissement RÉEL de la poignée d'angle (redimensionner) : on suit le pointeur.
  const onHandleDown = (e) => {
    e.preventDefault(); e.stopPropagation()
    const sx = e.clientX, sy = e.clientY, se = echelle
    const move = (ev) => { const d = (ev.clientX - sx + (ev.clientY - sy)) / 260; setEchelle(Math.min(1.5, Math.max(0.7, se + d))) }
    const up = (ev) => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); const d = (ev.clientX - sx + (ev.clientY - sy)) / 260; if (se + d >= 1.18) setFait(true); else setEchelle(1) }
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up)
  }

  const GALERIE = [{ t: 'histogramme', i: '📊', l: 'Histogramme' }, { t: 'courbe', i: '📈', l: 'Courbe' }, { t: 'aires', i: '⛰', l: 'Aires' }, { t: 'secteurs', i: '🥧', l: 'Secteurs' }, { t: 'barres', i: '📶', l: 'Barres' }]
  const consigne = () => {
    switch (mode) {
      case 'inserer': return !insere ? 'Clique un **type de graphique** dans la galerie pour l\'insérer.' : `Change de type : clique **${GALERIE.find((g) => g.t === typeCible)?.l}** pour voir le graphe se transformer.`
      case 'type': return `Clique **${GALERIE.find((g) => g.t === typeCible)?.l}** : le graphe passe d\'histogramme à ${GALERIE.find((g) => g.t === typeCible)?.l.toLowerCase()}.`
      case 'redimensionner': return 'Attrape le **carré (poignée) du coin bas-droit** et **tire-le** vers l\'extérieur pour agrandir le graphe.'
      case 'ongletscontextuels': return selectionne ? 'Les onglets **Création** et **Format** sont là. **Clique en dehors** du graphe pour les faire disparaître.' : 'Vois : les onglets contextuels ont disparu. **Reclique le graphe** pour les faire revenir.'
      case 'selectionformat': return sousMenu ? 'Choisis **Série « Ventes »** dans la liste.' : sel === element ? 'Choisis une **couleur** pour repeindre la série.' : 'Ouvre la **Sélection active** (▾) pour choisir un élément à mettre en forme.'
      case 'style': return `Clique le **Style ${styleCible}** : le graphe change complètement d\'habillage.`
      case 'elements': return `Ouvre le **＋**, puis coche **${elementBascule === 'etiquettes' ? 'Étiquettes de données' : elementBascule}** pour l\'ajouter au graphe.`
      case 'filtre': return `Ouvre le **▽ filtre**, décoche **${filtreCat}**, puis Applique : sa barre disparaît.`
      case 'titre': return saisieTitre ? `Tape le nouveau titre (ex. « ${titreCible} »), puis **Entrée**.` : '**Double-clique le titre**, en haut du graphe, pour le modifier.'
      case 'axe': return sel === 'axeY' ? `Monte le **Minimum** de l\'axe à ${axeMinCible} : les écarts se creusent.` : 'Ouvre la Sélection active et choisis **Axe vertical (Valeurs)**.'
      case 'intervertir': return 'Onglet **Création de graphique** : clique **Intervertir les lignes/colonnes**. Les séries et les catégories s\'échangent.'
      case 'supprimer': return !selectionne ? 'Clique le graphe pour le **sélectionner** (les poignées apparaissent).' : menuContext ? 'Clique **Supprimer** dans le menu.' : '**Clic droit** sur le graphe, puis **Supprimer**.'
      case 'deplacerfeuille': return dialog ? 'Choisis **Nouvelle feuille**, puis **OK**.' : 'Onglet **Création de graphique** : clique **Déplacer le graphique**.'
      case 'combine': return dialog ? 'Coche **Tracer sur l\'axe secondaire** pour « Nb ventes », puis **OK**.' : 'Onglet **Insertion** : clique **Graphique combiné**.'
      case 'sparkline': return dialog ? 'Vérifie la **plage** et l\'**emplacement**, puis **OK**.' : 'Onglet **Insertion** > **Sparklines** > **Courbe**.'
      default: return ''
    }
  }

  const ongletsVisibles = selectionne && !supprime
  const src = donnees || GRAPHE_DEF
  const dataAff = mode === 'filtre'
    ? { cats: src.cats.filter((c) => !cachees.includes(c)), series: src.series.map((s) => ({ ...s, vals: s.vals.filter((_, i) => !cachees.includes(src.cats[i])) })) }
    : data
  const petitGraphe = (extra) => <GrapheSVG data={dataAff} type={type} titre={tCourant} options={opts} selection={sel} theme={theme} echelle={echelle} axeMin={mode === 'axe' ? axeMin : undefined} secondaire={mode === 'combine' && fait ? 1 : undefined} {...extra} />
  const spk = mode === 'sparkline' ? (donnees || { entetes: ['Produit', 'Jan', 'Fév', 'Mar', 'Avr'], lignes: [['Ebook Excel', 8, 12, 10, 16], ['Ebook Shaolin', 20, 16, 17, 12]] }) : null
  const miniSpark = (vals) => { const mn = Math.min(...vals), mx = Math.max(...vals), w = 46, h = 16; const pts = vals.map((val, i) => `${(i / (vals.length - 1)) * w},${h - ((val - mn) / ((mx - mn) || 1)) * (h - 3) - 1.5}`).join(' '); return <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}><polyline points={pts} fill="none" stroke="#41c1ba" strokeWidth="1.5" />{vals.map((val, i) => <circle key={i} cx={(i / (vals.length - 1)) * w} cy={h - ((val - mn) / ((mx - mn) || 1)) * (h - 3) - 1.5} r="1.2" fill="#41c1ba" />)}</svg> }

  return (
    <div className="mt-3">
      <div className={`rounded-xl border px-3 py-2 text-sm ${fait ? 'border-mint/40 bg-mint/[0.07]' : 'border-navy/10 bg-navy/5'}`}>
        {fait ? <span className="font-bold text-mint">✓ {resultat}</span> : <span className="text-navy/85">👆 {gras(consigne())}</span>}
      </div>

      {/* Ruban avec onglets contextuels (mode ongletscontextuels) */}
      {mode === 'ongletscontextuels' && (
        <div className="mx-auto mt-3 max-w-md overflow-hidden rounded-t-md border border-navy/15 bg-[#f3f1ea] px-2 py-1 text-[10px]">
          {['Fichier', 'Accueil', 'Insertion', 'Données'].map((o) => <span key={o} className="mr-2 text-navy/50">{o}</span>)}
          {ongletsVisibles && <><span className="mr-2 rounded bg-[#1a7a44]/15 px-1 font-bold text-[#1a7a44]">Création de graphique</span><span className="rounded bg-[#7a1a5a]/15 px-1 font-bold text-[#7a1a5a]">Format</span></>}
        </div>
      )}

      {/* Le graphe (ou la galerie d'insertion, ou la zone vide après suppression) */}
      {mode === 'inserer' && !insere ? (
        <div className="mx-auto mt-3 grid max-w-md grid-cols-5 gap-1">
          {GALERIE.map((g) => (
            <button key={g.t} onClick={() => { setType(g.t === 'histogramme' ? 'histogramme' : g.t); setInsere(true) }} className="flex flex-col items-center gap-1 rounded-md border border-navy/15 bg-white py-2 text-[9px] text-navy/70 hover:border-mint hover:bg-mint/10">
              <span className="text-base">{g.i}</span>{g.l}
            </button>
          ))}
        </div>
      ) : mode === 'sparkline' ? (
        <div className="mx-auto mt-3 max-w-md overflow-x-auto rounded-lg border border-navy/15 text-[10px] shadow">
          <div className="grid w-full" style={{ gridTemplateColumns: `0.9fr repeat(${spk.entetes.length - 1}, 0.46fr) 1.15fr` }}>
            {[...spk.entetes, 'Tendance'].map((h, i) => <div key={i} className={`border-b border-navy/10 bg-navy/10 px-1.5 py-1 font-bold text-navy/70 ${i > 0 && i < spk.entetes.length ? 'text-right' : ''}`}>{h}</div>)}
            {spk.lignes.map((row, ri) => (
              <div key={ri} className="contents">
                {row.map((cell, ci) => <div key={ci} className={`border-b border-navy/5 px-1.5 py-1 ${ci === 0 ? 'text-navy/85' : 'text-right font-mono text-navy/70'}`}>{cell}</div>)}
                <div className={`grid place-items-center border-b border-l border-navy/5 px-1 py-1 ${!fait ? 'animate-pulse bg-mint/[0.08]' : ''}`}>{fait ? miniSpark(row.slice(1)) : <span className="text-navy/25">—</span>}</div>
              </div>
            ))}
          </div>
        </div>
      ) : supprime ? (
        <div className="mx-auto mt-3 flex h-40 max-w-md items-center justify-center rounded-lg border-2 border-dashed border-navy/15 bg-white text-sm text-navy/40">Le graphique a été supprimé.</div>
      ) : (
        <div className="relative mx-auto mt-3 w-full max-w-md">
          <div
            onClick={() => { if ((mode === 'ongletscontextuels' || mode === 'supprimer') && !selectionne) { setSelectionne(true); if (mode === 'ongletscontextuels') setFait(true) } }}
            onContextMenu={(e) => { if (mode === 'supprimer' && selectionne) { e.preventDefault(); setMenuContext(true) } }}
            className={`rounded-lg border-2 bg-white p-1 ${selectionne && (mode === 'ongletscontextuels' || mode === 'supprimer' || mode === 'redimensionner' || mode === 'titre') ? 'border-mint' : 'border-transparent'}`}
          >
            {mode === 'titre' && saisieTitre && !fait ? petitGraphe({ options: { ...opts, titre: false } }) : petitGraphe()}
          </div>
          {/* Poignées de redimensionnement : la poignée du coin bas-droit se tire vraiment */}
          {mode === 'redimensionner' && !fait && [['-top-1.5 -left-1.5', 'nwse-resize'], ['-top-1.5 left-1/2 -translate-x-1/2', 'ns-resize'], ['-top-1.5 -right-1.5', 'nesw-resize'], ['top-1/2 -right-1.5 -translate-y-1/2', 'ew-resize'], ['-bottom-1.5 -right-1.5', 'nwse-resize'], ['-bottom-1.5 left-1/2 -translate-x-1/2', 'ns-resize'], ['-bottom-1.5 -left-1.5', 'nesw-resize'], ['top-1/2 -left-1.5 -translate-y-1/2', 'ew-resize']].map(([pos, cur], i) => {
            const br = i === 4
            return <span key={i} onPointerDown={br ? onHandleDown : undefined} style={{ cursor: cur, touchAction: 'none' }} className={`absolute ${pos} h-3 w-3 rounded-sm border border-navy bg-white ${br ? 'animate-pulse ring-2 ring-mint' : ''}`} />
          })}
          {/* Le titre se modifie directement sur le graphe (double-clic) */}
          {mode === 'titre' && !fait && !saisieTitre && <div onDoubleClick={() => setSaisieTitre(true)} className="absolute inset-x-0 top-0 h-7 cursor-text" />}
          {mode === 'titre' && !fait && saisieTitre && (
            <input autoFocus placeholder={titreCible} onKeyDown={(e) => { if (e.key === 'Enter') { setTitre(e.currentTarget.value.trim() || titreCible); setFait(true) } }} onBlur={(e) => { setTitre(e.currentTarget.value.trim() || titreCible); setFait(true) }} className="absolute left-1/2 top-1 w-56 -translate-x-1/2 rounded border border-mint bg-white px-1 text-center text-[12px] font-bold text-navy outline-none ring-1 ring-mint placeholder:font-normal placeholder:text-navy/30" />
          )}
          {/* Menu clic droit → Supprimer */}
          {mode === 'supprimer' && menuContext && !fait && (
            <div className="absolute left-1/2 top-10 z-20 w-40 -translate-x-1/2 overflow-hidden rounded-md border border-navy/20 bg-white py-1 text-[11px] shadow-xl">
              {[{ i: '✂️', l: 'Couper' }, { i: '📋', l: 'Copier' }, '-', { i: '🗑', l: 'Supprimer', cible: true }].map((it, i) => it === '-' ? <div key={i} className="my-1 border-t border-navy/10" /> : <button key={i} onClick={() => { if (it.cible) { setSupprime(true); setFait(true) } }} disabled={!it.cible} className={`flex w-full items-center gap-2 px-3 py-1 text-left ${it.cible ? 'animate-pulse bg-mint/15 font-semibold text-navy ring-1 ring-inset ring-mint' : 'text-navy/40'}`}><span>{it.i}</span>{it.l}</button>)}
            </div>
          )}
        </div>
      )}

      {/* Vrai ruban « Création de graphique » (intervertir / déplacer le graphique) */}
      {(mode === 'intervertir' || mode === 'deplacerfeuille') && !fait && !dialog && (
        <div className="mx-auto mt-3 max-w-md overflow-hidden rounded-md border border-navy/15 bg-white text-[10px] shadow">
          <div className="flex gap-2.5 border-b border-navy/10 bg-[#f3f1ea] px-2 py-1">{['Fichier', 'Accueil', 'Insertion', 'Création de graphique', 'Format'].map((o) => <span key={o} className={o === 'Création de graphique' ? 'rounded bg-[#1a7a44]/15 px-1 font-bold text-[#1a7a44]' : 'text-navy/50'}>{o}</span>)}</div>
          <div className="flex items-stretch gap-2 p-2">
            {mode === 'intervertir' ? (
              <>
                <button onClick={() => { setData((d) => { const nc = d.series.map((s) => s.nom); const ns = d.cats.map((c, ci) => ({ nom: c, vals: d.series.map((s) => s.vals[ci]) })); return { cats: nc, series: ns } }); setFait(true) }} className="flex w-24 animate-pulse flex-col items-center gap-1 rounded bg-mint/15 p-1 text-center ring-1 ring-mint"><span className="text-base">🔁</span><span className="leading-tight text-navy/75">Intervertir les lignes/colonnes</span></button>
                <div className="flex w-24 flex-col items-center gap-1 rounded p-1 text-center opacity-50"><span className="text-base">⊞</span><span className="leading-tight text-navy/60">Sélectionner des données</span></div>
                <span className="self-end pb-0.5 text-[8px] uppercase tracking-wide text-navy/35">Données</span>
              </>
            ) : (
              <>
                <button onClick={() => setDialog(true)} className="flex w-24 animate-pulse flex-col items-center gap-1 rounded bg-mint/15 p-1 text-center ring-1 ring-mint"><span className="text-base">↗</span><span className="leading-tight text-navy/75">Déplacer le graphique</span></button>
                <span className="self-end pb-0.5 text-[8px] uppercase tracking-wide text-navy/35">Emplacement</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Clic « en dehors » (ongletscontextuels) */}
      {mode === 'ongletscontextuels' && !fait && selectionne && (
        <button onClick={() => setSelectionne(false)} className="mx-auto mt-2 block rounded-md border border-dashed border-navy/25 px-4 py-2 text-xs text-navy/50 hover:bg-navy/5">⤴ Clique ici (en dehors du graphe)</button>
      )}

      {/* Galerie de types (inserer étape 2 / type / intervertir n'en a pas) */}
      {((mode === 'inserer' && insere) || mode === 'type') && !fait && (
        <div className="mx-auto mt-3 flex max-w-md flex-wrap justify-center gap-1">
          {GALERIE.map((g) => (
            <button key={g.t} onClick={() => { if (g.t === typeCible) { setType(typeCible); setFait(true) } else setType(g.t) }} className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] ${type === g.t ? 'border-mint bg-mint/15 font-bold text-navy' : 'border-navy/15 text-navy/60'} ${g.t === typeCible ? 'animate-pulse ring-1 ring-mint' : ''}`}>
              <span>{g.i}</span>{g.l}
            </button>
          ))}
        </div>
      )}

      {/* Graphique combiné : vrai ruban Insertion + boîte axe secondaire */}
      {mode === 'combine' && !fait && !dialog && (
        <div className="mx-auto mt-3 max-w-md overflow-hidden rounded-md border border-navy/15 bg-white text-[10px] shadow">
          <div className="flex gap-2.5 border-b border-navy/10 bg-[#f3f1ea] px-2 py-1">{['Fichier', 'Accueil', 'Insertion', 'Données'].map((o) => <span key={o} className={o === 'Insertion' ? 'rounded bg-navy/10 px-1 font-bold text-navy' : 'text-navy/50'}>{o}</span>)}</div>
          <div className="flex items-stretch gap-2 p-2">
            <button onClick={() => setDialog(true)} className="flex w-24 animate-pulse flex-col items-center gap-1 rounded bg-mint/15 p-1 text-center ring-1 ring-mint"><span className="text-base">📊📈</span><span className="leading-tight text-navy/75">Graphique combiné</span></button>
            <span className="self-end pb-0.5 text-[8px] uppercase tracking-wide text-navy/35">Graphiques</span>
          </div>
        </div>
      )}
      {mode === 'combine' && dialog && !fait && (
        <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
          <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Insérer un graphique combiné</span><span className="text-navy/40">✕</span></div>
          <div className="space-y-2 bg-white p-3">
            <p className="text-navy/55">Type de graphique pour chaque série :</p>
            <div className="flex items-center justify-between gap-2"><span className="text-navy/70">CA (k€)</span><span className="rounded border border-navy/20 px-2 py-0.5 text-navy/60">Histogramme groupé ▾</span></div>
            <div className="flex items-center justify-between gap-2"><span className="text-navy/70">Nb ventes</span><span className="rounded border border-navy/20 px-2 py-0.5 text-navy/60">Courbe ▾</span></div>
            <button onClick={() => setAxeSec(!axeSec)} className="flex w-full items-center gap-2 text-left text-navy/80"><span className={`grid h-4 w-4 shrink-0 place-items-center rounded-sm border text-[9px] text-white ${axeSec ? 'border-mint bg-mint' : 'animate-pulse border-mint ring-1 ring-mint'}`}>{axeSec && '✓'}</span>Tracer « Nb ventes » sur l'axe secondaire</button>
            <div className="flex justify-end gap-2 border-t border-navy/10 pt-2"><button onClick={() => { if (axeSec) { setDialog(false); setFait(true) } }} disabled={!axeSec} className={`rounded-sm border-2 px-5 py-0.5 font-bold ${axeSec ? 'animate-pulse border-mint bg-mint/15 text-navy' : 'border-navy/15 bg-navy/5 text-navy/35'}`}>OK</button><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5 text-navy/60">Annuler</span></div>
          </div>
        </div>
      )}

      {/* Sparkline : vrai ruban Insertion + boîte plage/emplacement */}
      {mode === 'sparkline' && !fait && !dialog && (
        <div className="mx-auto mt-3 max-w-md overflow-hidden rounded-md border border-navy/15 bg-white text-[10px] shadow">
          <div className="flex gap-2.5 border-b border-navy/10 bg-[#f3f1ea] px-2 py-1">{['Fichier', 'Accueil', 'Insertion', 'Données'].map((o) => <span key={o} className={o === 'Insertion' ? 'rounded bg-navy/10 px-1 font-bold text-navy' : 'text-navy/50'}>{o}</span>)}</div>
          <div className="flex items-stretch gap-2 p-2">
            <button onClick={() => setDialog(true)} className="flex w-20 animate-pulse flex-col items-center gap-1 rounded bg-mint/15 p-1 text-center ring-1 ring-mint"><span className="text-base">〰</span><span className="leading-tight text-navy/75">Courbe</span></button>
            <div className="flex w-20 flex-col items-center gap-1 rounded p-1 text-center opacity-50"><span className="text-base">▁▃▅</span><span className="leading-tight text-navy/60">Histogramme</span></div>
            <span className="self-end pb-0.5 text-[8px] uppercase tracking-wide text-navy/35">Sparklines</span>
          </div>
        </div>
      )}
      {mode === 'sparkline' && dialog && !fait && (
        <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
          <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Créer des graphiques sparkline</span><span className="text-navy/40">✕</span></div>
          <div className="space-y-2 bg-white p-3">
            <div className="flex items-center gap-2"><span className="w-28 shrink-0 text-right text-navy/60">Plage de données :</span><span className="flex-1 rounded-sm border border-navy/25 px-2 py-1 font-mono text-navy/70">B2:E3</span></div>
            <div className="flex items-center gap-2"><span className="w-28 shrink-0 text-right text-navy/60">Emplacement :</span><span className="flex-1 rounded-sm border border-navy/25 px-2 py-1 font-mono text-navy/70">F2:F3</span></div>
            <div className="flex justify-end gap-2 border-t border-navy/10 pt-2"><button onClick={() => { setDialog(false); setFait(true) }} className="animate-pulse rounded-sm border-2 border-mint bg-mint/15 px-5 py-0.5 font-bold text-navy">OK</button><span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5 text-navy/60">Annuler</span></div>
          </div>
        </div>
      )}

      {/* Sélection active + couleur (selectionformat / axe) */}
      {(mode === 'selectionformat' || mode === 'axe') && !fait && (
        <div className="mx-auto mt-3 max-w-md">
          <button onClick={() => setSousMenu(!sousMenu)} className="flex w-56 items-center justify-between rounded-md border border-navy/25 bg-white px-2 py-1 text-[11px] text-navy/80">
            <span>{sel === element ? 'Série « Ventes »' : sel === 'axeY' ? 'Axe vertical (Valeurs)' : 'Sélection active…'}</span><span className="text-navy/40">▾</span>
          </button>
          {sousMenu && (
            <div className="mt-1 w-56 overflow-hidden rounded-md border border-navy/20 bg-white text-[11px] shadow-xl">
              {['Zone de graphique', 'Série « Ventes »', 'Axe vertical (Valeurs)', 'Titre du graphique', 'Légende'].map((it) => {
                const cible = (mode === 'selectionformat' && it === 'Série « Ventes »') || (mode === 'axe' && it === 'Axe vertical (Valeurs)')
                return <button key={it} onClick={() => { if (cible) { setSel(mode === 'axe' ? 'axeY' : element); setSousMenu(false) } }} className={`block w-full px-2 py-1 text-left ${cible ? 'animate-pulse bg-mint/15 font-semibold text-navy' : 'text-navy/45'}`}>{it}</button>
              })}
            </div>
          )}
          {mode === 'selectionformat' && sel === element && (
            <div className="mt-2 flex items-center gap-2"><span className="text-[11px] text-navy/60">Remplissage :</span>{['#e8853a', '#41c1ba', '#0a335d', '#8b5cf6'].map((c) => <button key={c} onClick={() => { setData((d) => ({ ...d, series: d.series.map((s, i) => (i === 0 ? { ...s, couleur: c } : s)) })); if (c === couleurCible) setFait(true) }} style={{ background: c }} className={`h-6 w-6 rounded ${c === couleurCible ? 'animate-pulse ring-2 ring-offset-1 ring-navy' : 'ring-1 ring-black/10'}`} />)}</div>
          )}
          {mode === 'axe' && sel === 'axeY' && (
            <div className="mt-2 flex items-center gap-2 text-[11px] text-navy/70"><span>Minimum :</span><button onClick={() => { setAxeMin(0) }} className={`rounded border px-2 py-0.5 ${axeMin === 0 ? 'border-mint font-bold' : 'border-navy/20'}`}>0</button><button onClick={() => { setAxeMin(axeMinCible); setFait(true) }} className="animate-pulse rounded border-2 border-mint bg-mint/15 px-2 py-0.5 font-bold text-navy">{axeMinCible}</button></div>
          )}
        </div>
      )}

      {/* Styles */}
      {mode === 'style' && !fait && (
        <div className="mx-auto mt-3 flex max-w-md justify-center gap-2">
          {[1, 2, 3].map((n) => (
            <button key={n} onClick={() => { if (n === styleCible) { setTheme(n === 3 ? 'sombre' : 'clair'); setData((d) => ({ ...d, series: d.series.map((s, i) => ({ ...s, couleur: n === 2 ? '#2f5fd0' : undefined })) })); setFait(true) } else { setTheme(n === 3 ? 'sombre' : 'clair') } }} className={`rounded-md border px-3 py-2 text-[10px] ${n === styleCible ? 'animate-pulse border-mint bg-mint/15 font-bold text-navy ring-1 ring-mint' : 'border-navy/15 text-navy/60'}`}>Style {n}</button>
          ))}
        </div>
      )}

      {/* Éléments (+) */}
      {mode === 'elements' && !fait && (
        <div className="mx-auto mt-3 w-52 overflow-hidden rounded-md border border-navy/20 bg-white py-1 text-[11px] shadow-xl">
          <p className="border-b border-navy/10 px-3 py-1 font-semibold text-navy/60">＋ Éléments de graphique</p>
          {[['titre', 'Titre du graphique'], ['etiquettes', 'Étiquettes de données'], ['quadrillage', 'Quadrillage'], ['legende', 'Légende']].map(([k, l]) => (
            <button key={k} onClick={() => { setOpts((o) => ({ ...o, [k]: !o[k] })); if (k === elementBascule) setFait(true) }} className="flex w-full items-center gap-2 px-3 py-1 text-left text-navy/80">
              <span className={`grid h-4 w-4 place-items-center rounded-sm border text-[9px] text-white ${opts[k] ? 'border-mint bg-mint' : k === elementBascule ? 'animate-pulse border-mint ring-1 ring-mint' : 'border-navy/30'}`}>{opts[k] && '✓'}</span>{l}
            </button>
          ))}
        </div>
      )}

      {/* Filtre */}
      {mode === 'filtre' && !fait && (
        <div className="mx-auto mt-3 w-48 overflow-hidden rounded-md border border-navy/20 bg-white p-2 text-[11px] shadow-xl">
          <p className="mb-1 font-semibold text-navy/60">▽ Filtre — Catégories</p>
          {src.cats.map((c) => {
            const coche = !cachees.includes(c)
            return <button key={c} onClick={() => setCachees((h) => (h.includes(c) ? h.filter((x) => x !== c) : [...h, c]))} className="flex w-full items-center gap-2 px-1 py-1 text-left text-navy/80"><span className={`grid h-4 w-4 place-items-center rounded-sm border text-[9px] text-white ${coche ? 'border-mint bg-mint' : c === filtreCat ? 'animate-pulse border-mint ring-1 ring-mint' : 'border-navy/30'}`}>{coche && '✓'}</span>{c}</button>
          })}
          <div className="mt-1 flex justify-end border-t border-navy/10 pt-1"><button onClick={() => { if (cachees.includes(filtreCat)) setFait(true) }} className="rounded-sm border-2 border-mint bg-mint/15 px-3 py-0.5 font-bold text-navy">Appliquer</button></div>
        </div>
      )}

      {/* Déplacer vers une feuille : la boîte (déclenchée par le ruban ci-dessus) */}
      {mode === 'deplacerfeuille' && dialog && !fait && (
          <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
            <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>Déplacer le graphique</span><span className="text-navy/40">✕</span></div>
            <div className="space-y-2 bg-white p-3">
              <button onClick={() => { setFeuille(true) }} className={`flex w-full items-center gap-2 text-left ${feuille ? 'text-navy' : 'animate-pulse text-navy/60'}`}><span className={`grid h-4 w-4 place-items-center rounded-full border text-[9px] ${feuille ? 'border-mint bg-mint text-white' : 'border-mint ring-1 ring-mint'}`}>{feuille && '●'}</span>Nouvelle feuille : <span className="font-mono">Graphique1</span></button>
              <div className="flex items-center gap-2 text-navy/45"><span className="h-4 w-4 rounded-full border border-navy/30" />Objet dans : Feuil1 ▾</div>
              <div className="flex justify-end border-t border-navy/10 pt-2"><button onClick={() => { if (feuille) setFait(true) }} disabled={!feuille} className={`rounded-sm border-2 px-5 py-0.5 font-bold ${feuille ? 'animate-pulse border-mint bg-mint/15 text-navy' : 'border-navy/15 bg-navy/5 text-navy/35'}`}>OK</button></div>
            </div>
          </div>
      )}
    </div>
  )
}

// Boîte de dialogue Excel générique et interactive : l'élève remplit les contrôles
// REQUIS (cases à cocher, champs, listes déroulantes), puis clique OK → résultat.
// champs: [{ type:'case'|'champ'|'liste', label, valeur, options, coche, requis }]
function BoiteDialogue({ v, onResolu }) {
  const { titre = 'Boîte de dialogue', intro, champs = [], boutonOK = 'OK', resultat = '' } = v
  const [vals, setVals] = useState(() => { const o = {}; champs.forEach((c, i) => { o[i] = c.type === 'case' ? !!c.coche : (c.requis ? null : (c.valeur ?? '')) }); return o })
  const [ouverte, setOuverte] = useState(null)
  const [fini, setFini] = useState(false)
  useEffect(() => { if (fini) onResolu && onResolu() }, [fini])

  const satisfait = (c, i) => !c.requis || (c.type === 'case' ? vals[i] === true : vals[i] != null && vals[i] !== '')
  const pretOK = champs.every((c, i) => satisfait(c, i))
  const doitAgir = (c, i) => !fini && c.requis && !satisfait(c, i)
  const activer = (c, i) => {
    if (fini) return
    if (c.type === 'case') setVals((s) => ({ ...s, [i]: !s[i] }))
    else if (c.type === 'champ') setVals((s) => ({ ...s, [i]: c.valeur }))
    else setOuverte((o) => (o === i ? null : i))
  }
  const choisirListe = (i, opt) => { setVals((s) => ({ ...s, [i]: opt })); setOuverte(null) }

  return (
    <div className="mt-3">
      <div className={`rounded-xl border px-3 py-2 text-sm ${fini ? 'border-mint/40 bg-mint/[0.07]' : 'border-navy/10 bg-navy/5'}`}>
        {fini ? <span className="font-bold text-mint">✓ {resultat}</span> : <span className="text-navy/85">👆 Remplis la boîte, puis clique <b>{boutonOK}</b>.</span>}
      </div>
      {!fini && (
        <div className="mx-auto mt-3 max-w-xs overflow-hidden rounded-lg border border-navy/25 text-[11px] shadow-xl">
          <div className="flex items-center justify-between bg-[#e9e9e9] px-3 py-1.5 font-semibold text-navy/80"><span>{titre}</span><span className="text-navy/40">✕</span></div>
          <div className="space-y-2 bg-white p-3">
            {intro && <p className="text-navy/55">{intro}</p>}
            {champs.map((c, i) => {
              if (c.type === 'case') {
                const on = vals[i] === true
                return (
                  <button key={i} onClick={() => activer(c, i)} className="flex w-full items-start gap-2 text-left text-navy/80">
                    <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-sm border text-[9px] text-white ${on ? 'border-mint bg-mint' : doitAgir(c, i) ? 'animate-pulse border-mint ring-1 ring-mint' : 'border-navy/30'}`}>{on && '✓'}</span>
                    <span>{c.label}</span>
                  </button>
                )
              }
              if (c.type === 'champ') {
                const rempli = vals[i] != null && vals[i] !== ''
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-24 shrink-0 text-right text-navy/60">{c.label} :</span>
                    <button onClick={() => activer(c, i)} className={`min-w-0 flex-1 rounded-sm border px-2 py-1 text-left font-mono ${rempli ? 'border-navy/30 text-navy' : doitAgir(c, i) ? 'animate-pulse border-mint text-navy/35 ring-1 ring-mint' : 'border-navy/25 text-navy/40'}`}>{rempli ? vals[i] : (c.requis ? 'clique pour remplir…' : (c.valeur ?? ''))}</button>
                  </div>
                )
              }
              const val = vals[i]
              return (
                <div key={i} className="relative flex items-center gap-2">
                  <span className="w-24 shrink-0 text-right text-navy/60">{c.label} :</span>
                  <button onClick={() => activer(c, i)} className={`flex min-w-0 flex-1 items-center justify-between rounded-sm border px-2 py-1 text-left ${val ? 'border-navy/30 text-navy' : doitAgir(c, i) ? 'animate-pulse border-mint text-navy/50 ring-1 ring-mint' : 'border-navy/25 text-navy/50'}`}><span className="truncate">{val || 'choisir…'}</span><span className="ml-1 text-navy/40">▾</span></button>
                  {ouverte === i && (
                    <div className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-md border border-navy/20 bg-white shadow-xl">
                      {(c.options || []).map((opt) => <button key={opt} onClick={() => choisirListe(i, opt)} className="block w-full px-2 py-1.5 text-left hover:bg-mint/15">{opt}</button>)}
                    </div>
                  )}
                </div>
              )
            })}
            <div className="flex justify-end gap-2 border-t border-navy/10 pt-2">
              <button onClick={() => pretOK && setFini(true)} disabled={!pretOK} className={`rounded-sm border-2 px-5 py-0.5 font-bold ${pretOK ? 'animate-pulse border-mint bg-mint/15 text-navy' : 'border-navy/15 bg-navy/5 text-navy/35'}`}>{boutonOK}</button>
              <span className="rounded-sm border border-navy/25 bg-[#f0f0f0] px-3 py-0.5 text-navy/60">Annuler</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Manipulation directe de la barre d'onglets (feuilles). Un mode = une action :
// renommer (double-clic), ajouter (bouton +), deplacer (clic onglet puis emplacement),
// colorer (clic droit > Couleur d'onglet), grouper (Ctrl+clic multiple), masquer (clic droit > Masquer).
function OngletsInteractif({ v, onResolu }) {
  const { mode = 'renommer', onglets = [], cible, cibles = [], nouveauNom = 'Budget', nouveau = 'Feuil2', couleur = '#e8853a', versIndex = 0, resultat = '' } = v
  const [liste, setListe] = useState(onglets)
  const [etape, setEtape] = useState(0) // 0 = action, 1 = sous-étape (saisie/menu), 2 = fini
  const [menu, setMenu] = useState(false)
  const [palette, setPalette] = useState(false)
  const [sel, setSel] = useState([])
  const [grab, setGrab] = useState(false)
  const [couleurs, setCouleurs] = useState({})
  const [caches, setCaches] = useState([])
  const [actif, setActif] = useState(cible || onglets[0])
  const fait = etape >= 2
  useEffect(() => { if (fait) onResolu && onResolu() }, [etape])
  useEffect(() => {
    if (mode === 'grouper' && !fait && cibles.length && sel.length === cibles.length && cibles.every((c) => sel.includes(c))) setEtape(2)
  }, [sel])
  const PALETTE = ['#e8853a', '#41c1ba', '#2f5fd0', '#d64550', '#8b5cf6', '#3aa757']

  const consigne = () => {
    switch (mode) {
      case 'renommer': return etape === 0 ? `**Double-clique** l'onglet « ${cible} » pour le renommer.` : 'Le nouveau nom est tapé : appuie sur **Entrée** pour valider.'
      case 'ajouter': return 'Clique le bouton **+** (à droite des onglets) pour ajouter une feuille.'
      case 'deplacer': return grab ? `Clique la **flèche de dépôt** tout à gauche pour y placer « ${cible} ».` : `**Attrape** l'onglet « ${cible} » (clique-le) pour le déplacer.`
      case 'colorer': return palette ? 'Choisis une **couleur** dans la palette.' : menu ? 'Clique **Couleur d\'onglet**.' : `Fais un **clic droit** sur l'onglet « ${cible} ».`
      case 'grouper': return `Garde **Ctrl** enfoncé et clique **${cibles.join(' puis ')}** pour les sélectionner ensemble.`
      case 'masquer': return menu ? 'Clique **Masquer**.' : `Fais un **clic droit** sur l'onglet « ${cible} », puis Masquer.`
      default: return ''
    }
  }

  const clicTab = (f) => {
    if (fait) return
    setActif(f)
    if (mode === 'deplacer') { if (!grab && f === cible) setGrab(true) }
    else if ((mode === 'colorer' || mode === 'masquer') && f === cible) { setMenu(true); setPalette(false) }
    else if (mode === 'grouper') setSel((s) => (s.includes(f) ? s.filter((x) => x !== f) : [...s, f]))
  }
  const dblTab = (f) => { if (!fait && mode === 'renommer' && f === cible) setEtape(1) }
  const deposer = () => { if (grab) { setListe((l) => { const a = l.filter((x) => x !== cible); a.splice(versIndex, 0, cible); return a }); setEtape(2) } }
  const choisirCouleur = (c) => { setCouleurs((m) => ({ ...m, [cible]: c })); setEtape(2) }

  const visibles = liste.filter((f) => !caches.includes(f))
  const tabCls = (f) => {
    if (sel.includes(f)) return 'bg-mint/25 font-bold text-navy ring-1 ring-inset ring-mint'
    if (f === actif) return 'bg-white font-bold text-navy'
    return 'bg-navy/10 text-navy/60 hover:bg-navy/20'
  }
  const pulseTab = (f) => !fait && f === cible && (
    (mode === 'renommer' && etape === 0) ||
    (mode === 'deplacer' && !grab) ||
    ((mode === 'colorer' || mode === 'masquer') && !menu)
  )

  return (
    <div className="mt-3">
      <div className={`rounded-xl border px-3 py-2 text-sm ${fait ? 'border-mint/40 bg-mint/[0.07]' : 'border-navy/10 bg-navy/5'}`}>
        {fait ? <span className="font-bold text-mint">✓ {resultat}</span> : <span className="text-navy/85">👆 {gras(consigne())}</span>}
      </div>

      <div className="mx-auto mt-3 max-w-md overflow-hidden rounded-lg border border-navy/15 bg-white shadow">
        <div className="grid place-items-center gap-1 px-3 py-6 text-center text-[11px] text-navy/40">
          <span className="text-2xl">📄</span>
          <span>Feuille active : <span className="font-bold text-navy/70">{fait && mode === 'renommer' ? nouveauNom : actif}</span></span>
        </div>
        <div className="flex flex-wrap items-end gap-1 border-t border-navy/10 bg-[#f3f1ea] px-2 pt-1 text-[11px]">
          {visibles.map((f, i) => {
            const enSaisie = mode === 'renommer' && etape >= 1 && f === cible
            const nomAff = fait && mode === 'renommer' && f === cible ? nouveauNom : f
            return (
              <div key={f} className="flex items-end">
                {mode === 'deplacer' && grab && i === versIndex && (
                  <button onClick={deposer} className="mr-1 animate-pulse rounded bg-mint/20 px-1 text-mint ring-1 ring-mint" title="Déposer ici">▸</button>
                )}
                {enSaisie ? (
                  <span className="rounded-t border border-b-0 border-mint bg-white px-2 py-0.5 font-mono text-navy ring-1 ring-mint">{nouveauNom}<span className="animate-pulse">|</span></span>
                ) : (
                  <button
                    onClick={() => clicTab(f)}
                    onDoubleClick={() => dblTab(f)}
                    style={couleurs[f] ? { borderBottom: `3px solid ${couleurs[f]}` } : undefined}
                    className={`rounded-t px-2.5 py-0.5 ${tabCls(f)} ${pulseTab(f) ? 'animate-pulse ring-1 ring-inset ring-mint' : ''}`}
                  >{nomAff}</button>
                )}
              </div>
            )
          })}
          <button
            onClick={() => { if (!fait && mode === 'ajouter') { setListe((l) => [...l, nouveau]); setActif(nouveau); setEtape(2) } }}
            className={`ml-1 rounded px-1.5 py-0.5 font-bold ${!fait && mode === 'ajouter' ? 'animate-pulse bg-mint/20 text-mint ring-1 ring-mint' : 'text-navy/40'}`}
          >+</button>
        </div>
      </div>

      {mode === 'renommer' && etape === 1 && (
        <div className="mt-2 flex justify-center"><button onClick={() => setEtape(2)} className="animate-pulse rounded-md border-2 border-mint bg-mint/15 px-4 py-1.5 text-[12px] font-bold text-navy">⏎ Entrée</button></div>
      )}

      {menu && !palette && (mode === 'colorer' || mode === 'masquer') && (
        <div className="mx-auto mt-2 w-52 overflow-hidden rounded-md border border-navy/20 bg-white py-1 text-[11px] shadow-xl">
          {[{ l: 'Renommer' }, { l: 'Couleur d\'onglet', fleche: true, cible: mode === 'colorer' }, { l: 'Masquer', cible: mode === 'masquer' }].map((it, i) => (
            <button key={i} onClick={() => { if (it.cible) { if (mode === 'colorer') setPalette(true); else { setCaches((c) => [...c, cible]); setEtape(2) } } }} disabled={!it.cible}
              className={`flex w-full items-center justify-between px-3 py-1.5 text-left ${it.cible ? 'animate-pulse bg-mint/15 font-semibold text-navy ring-1 ring-inset ring-mint' : 'text-navy/40'}`}>
              <span>{it.l}</span>{it.fleche && <span>▸</span>}
            </button>
          ))}
        </div>
      )}

      {palette && mode === 'colorer' && (
        <div className="mx-auto mt-2 flex w-52 flex-wrap gap-2 rounded-md border border-navy/20 bg-white p-2 shadow-xl">
          {PALETTE.map((c) => (
            <button key={c} onClick={() => choisirCouleur(c)} style={{ background: c }} className={`h-6 w-6 rounded ${c === couleur ? 'animate-pulse ring-2 ring-offset-1 ring-navy' : 'ring-1 ring-black/10'}`} />
          ))}
        </div>
      )}
    </div>
  )
}

// « Lequel choisir ? » : la DÉCOUVERTE avant l'explication — 2 ou 3 propositions
// (mini-tableaux), l'élève clique la bonne AVANT que le Shifu n'explique la règle.
function ChoixTableau({ v, onResolu, onErreur }) {
  const { options = [], bonne = 0, explication } = v
  const [essais, setEssais] = useState([])
  const [trouve, setTrouve] = useState(false)
  const clic = (i) => {
    if (trouve) return
    if (i === bonne) {
      setTrouve(true)
      onResolu && onResolu()
    } else if (!essais.includes(i)) {
      setEssais((e) => [...e, i])
      onErreur && onErreur()
    }
  }
  return (
    <div className="mt-3">
      <div className={`grid gap-3 ${options.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
        {options.map((opt, i) => {
          const etat = trouve && i === bonne ? 'bonne' : essais.includes(i) ? 'rate' : 'neutre'
          return (
            <button
              key={i}
              disabled={trouve || essais.includes(i)}
              onClick={() => clic(i)}
              className={`rounded-xl border-2 p-2 text-left transition ${etat === 'bonne' ? 'border-mint bg-mint/10' : etat === 'rate' ? 'border-red-400/40 bg-red-500/5 opacity-50' : 'border-navy/15 bg-white hover:border-mint/60'}`}
            >
              {opt.titre && <p className="mb-1 text-center text-[11px] font-bold text-navy/60">{opt.titre}</p>}
              <div className="overflow-hidden rounded-md border border-navy/10">
                <table className="w-full border-collapse text-[10px]">
                  <thead>
                    <tr>{opt.tableau.entetes.map((h, j) => (<th key={j} className={`border-b px-2 py-1 text-left font-bold ${h ? 'border-mint/60 bg-mint/20 text-navy' : 'border-navy/10 bg-navy/5'}`}>{h || ' '}</th>))}</tr>
                  </thead>
                  <tbody>
                    {opt.tableau.lignes.map((row, r) => (
                      <tr key={r}>{row.map((cell, c) => (<td key={c} className="border-b border-navy/5 px-2 py-0.5 text-navy/80">{cell || ' '}</td>))}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {etat === 'bonne' && <p className="mt-1 text-center text-[11px] font-bold text-mint">✓ Celui-ci !</p>}
            </button>
          )
        })}
      </div>
      {trouve ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-mint/15 px-3 py-2 text-sm text-navy/90">
          <span className="font-bold text-mint">✓ {essais.length === 0 ? 'Excellent instinct, du premier coup ! 🥋' : 'Trouvé ! 🥋'}</span> {explication}
        </p>
      ) : essais.length > 0 ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-navy/10 px-3 py-2 text-sm font-medium text-navy/90">{ENCOURAGEMENTS_Q[(essais.length - 1) % ENCOURAGEMENTS_Q.length]}</p>
      ) : null}
    </div>
  )
}

// « Vrai ou faux ? » : une affirmation, deux gros boutons. Se trompe ? Il retente.
function VraiFaux({ v, onResolu, onErreur }) {
  const { affirmation, bonne, explication } = v
  const [choix, setChoix] = useState(null)
  const [trouve, setTrouve] = useState(false)
  const [rate, setRate] = useState(false)
  const clic = (val) => {
    if (trouve) return
    setChoix(val)
    if (val === bonne) {
      setTrouve(true)
      onResolu && onResolu()
    } else {
      setRate(true)
      onErreur && onErreur()
    }
  }
  return (
    <div className="mt-3">
      <p className="rounded-xl border border-mint/50 bg-mint/25 px-4 py-3 text-center font-mono text-sm leading-relaxed text-navy shadow-sm">{affirmation}</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {[{ label: 'VRAI', val: true }, { label: 'FAUX', val: false }].map((o) => {
          const estBon = trouve && o.val === bonne
          const estRate = rate && choix === o.val && o.val !== bonne
          return (
            <button
              key={o.label}
              disabled={trouve || estRate}
              onClick={() => clic(o.val)}
              className={`rounded-xl border-2 py-3 font-display text-xl transition ${estBon ? 'border-mint bg-mint/15 text-mint' : estRate ? 'border-red-400/50 bg-red-500/10 text-red-400 opacity-60' : 'border-navy/15 bg-white text-navy hover:border-mint/60'}`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
      {trouve ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-mint/15 px-3 py-2 text-sm text-navy/90">
          <span className="font-bold text-mint">✓ {!rate ? 'Excellent, du premier coup ! 🥋' : 'Voilà ! 🥋'}</span> {explication}
        </p>
      ) : rate ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-navy/10 px-3 py-2 text-sm font-medium text-navy/90">Hmm… relis bien l'affirmation et retente ! 🧘</p>
      ) : null}
    </div>
  )
}

function Question({ q, onResolu, onErreur }) {
  const [essais, setEssais] = useState([])
  const [trouve, setTrouve] = useState(false)
  const clic = (i) => {
    if (trouve) return
    if (i === q.bonne) {
      setTrouve(true)
      onResolu && onResolu()
    } else if (!essais.includes(i)) {
      setEssais((e) => [...e, i])
      onErreur && onErreur()
    }
  }
  return (
    <div className="mt-3">
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let cls = 'border-navy/10 bg-navy/5'
          if (trouve && i === q.bonne) cls = 'border-mint/60 bg-mint/15'
          else if (essais.includes(i)) cls = 'border-red-400/50 bg-red-500/10 opacity-55'
          return (
            <button
              key={i}
              disabled={trouve || essais.includes(i)}
              onClick={() => clic(i)}
              className={`flex w-full items-center gap-2 rounded-xl border px-4 py-3 text-left font-mono text-sm transition ${cls}`}
            >
              {coloreFormule(opt)}
            </button>
          )
        })}
      </div>
      {trouve ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-mint/15 px-3 py-2 text-sm text-navy/90">
          <span className="font-bold text-mint">✓ {essais.length === 0 ? REUSSITES_Q[q.bonne % REUSSITES_Q.length] : 'Trouvé ! La persévérance paie. 🥋'}</span>{' '}
          {q.explication}
        </p>
      ) : essais.length > 0 ? (
        <p className="mt-2 animate-fade-up rounded-xl bg-navy/10 px-3 py-2 text-sm font-medium text-navy/90">
          {ENCOURAGEMENTS_Q[(essais.length - 1) % ENCOURAGEMENTS_Q.length]}
        </p>
      ) : null}
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

// La poignée de recopie qu'on TIRE soi-même : la 1re cellule est remplie, une poignée
// verte est à son coin bas-droit ; l'élève l'attrape et Excel complète la suite (mois,
// jours) ou recopie la formule. Interaction bloquante : il faut la tirer pour continuer.
function TirePoignee({ onResolu, v = {} }) {
  const {
    entetes,
    depart = 'janvier',
    suite = ['février', 'mars', 'avril'],
    nombres = false,
    formule = false,
    promptMsg = '👆 Attrape la poignée verte (coin bas-droit de la 1re case) et tire vers la droite',
    okMsg = '✓ Excel complète la suite tout seul, sans rien retaper !',
  } = v
  const [rempli, setRempli] = useState(false)
  const vertical = v.sens === 'bas'
  const cols = entetes || ['A', 'B', 'C', 'D', 'E', 'F'].slice(0, 1 + suite.length)
  const colonne = (entetes && entetes[0]) || 'B'
  const nextCol = String.fromCharCode(colonne.charCodeAt(0) + 1) // colonne vide à droite pour voir la poignée
  const departRow = v.departRow || 2
  const tirer = () => {
    if (!rempli) {
      setRempli(true)
      onResolu && onResolu()
    }
  }
  const rendre = (t) => (formule && typeof t === 'string' && t.startsWith('=') ? <span className="font-mono text-[10px]">{coloreFormule(t)}</span> : t)
  const cellCls = `relative min-h-[30px] border-b border-l border-navy/10 px-2 py-1 ${nombres ? 'text-right' : ''}`
  // La vraie poignée de recopie d'Excel : la croix noire (+) au coin bas-droit de la cellule.
  const poignee = (
    <button
      onClick={tirer}
      title="Tirer la poignée de recopie"
      className={`absolute -bottom-2.5 -right-2.5 z-20 grid h-5 w-5 place-items-center leading-none ${rempli ? '' : 'cursor-crosshair'}`}
    >
      <span className={`font-black leading-none text-[#0a1f33] ${rempli ? 'text-sm' : 'animate-glow text-lg'}`}>+</span>
    </button>
  )
  return (
    <div className="mt-3">
      <div className="select-none overflow-hidden rounded-xl border border-navy/10 bg-white shadow-lg">
        {vertical ? (
          <div className="grid text-xs" style={{ gridTemplateColumns: '26px 1fr 1fr' }}>
            <div className="bg-navy/10" />
            <div className="border-b border-l border-navy/10 bg-navy/10 py-1 text-center text-navy/50">{colonne}</div>
            <div className="border-b border-l border-navy/10 bg-navy/10 py-1 text-center text-navy/50">{nextCol}</div>
            <div className="border-b border-navy/10 bg-navy/10 py-1 text-center text-navy/50">{departRow}</div>
            <div className={`${cellCls} font-medium text-navy ring-2 ring-inset ring-navy/40`}>
              {rendre(depart)}
              {poignee}
            </div>
            <div className={cellCls} />
            {suite.map((val, i) => (
              <div key={i} className="contents">
                <div className="border-b border-navy/10 bg-navy/10 py-1 text-center text-navy/50">{departRow + 1 + i}</div>
                <div className={`${cellCls} ${rempli ? 'animate-fade-up bg-mint/15 font-medium text-navy' : ''}`} style={rempli ? { animationDelay: `${i * 0.12}s` } : undefined}>
                  {rempli ? rendre(val) : ''}
                </div>
                <div className={cellCls} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid text-xs" style={{ gridTemplateColumns: `26px repeat(${cols.length}, 1fr)` }}>
            <div className="bg-navy/10" />
            {cols.map((c) => (
              <div key={c} className="border-b border-l border-navy/10 bg-navy/10 py-1 text-center text-navy/50">{c}</div>
            ))}
            {/* ligne 1 : la valeur de départ + la poignée à son coin */}
            <div className="border-b border-navy/10 bg-navy/10 py-1 text-center text-navy/50">1</div>
            <div className={`${cellCls} font-medium text-navy ring-2 ring-inset ring-navy/40`}>
              {rendre(depart)}
              {poignee}
            </div>
            {suite.map((val, i) => (
              <div
                key={i}
                className={`${cellCls} ${rempli ? 'animate-fade-up bg-mint/15 font-medium text-navy' : ''}`}
                style={rempli ? { animationDelay: `${i * 0.12}s` } : undefined}
              >
                {rempli ? rendre(val) : ''}
              </div>
            ))}
            {/* ligne 2 : vide, pour bien voir la poignée au coin de la 1re case */}
            <div className="bg-navy/10 py-1 text-center text-navy/50">2</div>
            {cols.map((c) => (
              <div key={'r2' + c} className="min-h-[28px] border-l border-navy/10" />
            ))}
          </div>
        )}
      </div>
      <p className="mt-3 rounded-full bg-mint/15 px-3 py-2 text-center text-sm font-bold text-mint">{rempli ? okMsg : promptMsg}</p>
    </div>
  )
}

// La balise « Options de recopie » qu'on CLIQUE : après la recopie, la petite étiquette
// apparaît ; l'élève clique dessus et le menu des options se déploie (jours ouvrés, mois…).
function BaliseSeries({ v, onResolu }) {
  const { options = ['Copier les cellules', 'Incrémenter une série', 'Incrémenter les jours ouvrés', 'Incrémenter les mois', 'Incrémenter les années'], sel = 1 } = v
  const [ouvert, setOuvert] = useState(false)
  const clic = () => {
    if (!ouvert) {
      setOuvert(true)
      onResolu && onResolu()
    }
  }
  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div className="relative">
        <div className="overflow-hidden rounded-md border border-navy/15 shadow">
          <div className="grid text-[10px]" style={{ gridTemplateColumns: '24px repeat(3, 78px)' }}>
            <div className="bg-navy/10" />
            {['A', 'B', 'C'].map((c) => (
              <div key={c} className="border-b border-l border-navy/10 bg-navy/10 py-1 text-center text-navy/50">{c}</div>
            ))}
            {/* ligne 1 : la série de dates */}
            <div className="border-b border-navy/10 bg-navy/10 py-1 text-center text-navy/50">1</div>
            <div className="border-b border-l border-navy/10 px-1.5 py-1 text-navy/90">01/05/2025</div>
            <div className="border-b border-l border-navy/10 bg-mint/30 px-1.5 py-1 font-semibold text-navy">02/05/2025</div>
            <div className="border-b border-l border-navy/10 bg-mint/30 px-1.5 py-1 font-semibold text-navy">03/05/2025</div>
            {/* ligne 2 : vide, la balise se pose ici, SOUS C1 (sans cacher la date) */}
            <div className="bg-navy/10 py-1 text-center text-navy/50">2</div>
            <div className="min-h-[26px] border-l border-navy/10" />
            <div className="min-h-[26px] border-l border-navy/10" />
            <div className="min-h-[26px] border-l border-navy/10" />
          </div>
        </div>
        <button onClick={clic} title="Options de recopie" className={`absolute right-0 top-[46px] flex items-center gap-1 rounded-sm border bg-white px-1.5 py-1 shadow-md ${ouvert ? 'border-navy/20' : 'animate-glow cursor-pointer border-navy/40'}`}>
          <svg width="14" height="14" viewBox="0 0 12 12">
            <rect x="1" y="1" width="10" height="10" rx="1" fill="none" stroke="#0a335d" strokeWidth="1" />
            <rect x="1.5" y="6.5" width="9" height="4.5" fill="#0a335d" opacity="0.45" />
          </svg>
          <span className="text-[9px] leading-none text-navy/60">▾</span>
        </button>
      </div>
      {!ouvert ? (
        <p className="rounded-full bg-mint/15 px-4 py-2 text-center text-sm font-bold text-mint">👆 Clique la balise « Options de recopie » (en bas à droite)</p>
      ) : (
        <div className="animate-fade-up w-64 overflow-hidden rounded-md border border-navy/20 bg-white py-1 text-xs shadow-xl">
          {options.map((o, i) => (
            <div key={i} className={`px-3 py-1.5 ${i === sel ? 'bg-mint/20 font-bold text-navy' : 'text-navy/80'}`}>{i === sel ? '● ' : '○ '}{o}</div>
          ))}
        </div>
      )}
    </div>
  )
}

// « Annule ta saisie » : une faute de frappe dans la barre de formule ; l'élève clique la
// croix rouge ✕ et le mot disparaît (la cellule redevient vide). Interaction bloquante.
function AnnuleSaisie({ v, onResolu }) {
  const { saisie = 'Réunionn', cellule = 'A2' } = v
  const [efface, setEfface] = useState(false)
  const clic = () => {
    if (!efface) {
      setEfface(true)
      onResolu && onResolu()
    }
  }
  return (
    <div className="mt-3">
      <div className="overflow-hidden rounded-xl border border-navy/10 bg-white shadow-lg">
        <div className="flex items-center gap-2 border-b border-navy/10 bg-navy/5 px-3 py-1.5 text-xs">
          <span className="w-8 text-navy/45">{cellule}</span>
          <button onClick={clic} title="Annuler la saisie" className={`grid h-5 w-5 place-items-center rounded-sm border text-[13px] font-bold ${efface ? 'border-navy/15 text-navy/25' : 'animate-glow cursor-pointer border-red-400 text-red-500 hover:bg-red-50'}`}>✕</button>
          <span className="grid h-5 w-5 place-items-center rounded-sm border border-navy/15 text-[13px] font-bold text-mint">✓</span>
          <span className="font-mono text-navy/90">{efface ? <span className="text-navy/30">|</span> : saisie}</span>
        </div>
        <div className="grid text-xs" style={{ gridTemplateColumns: '26px 1fr 1fr' }}>
          <div className="bg-navy/5" />
          <div className="border-b border-l border-navy/10 bg-navy/10 py-1 text-center text-navy/50">A</div>
          <div className="border-b border-l border-navy/10 bg-navy/10 py-1 text-center text-navy/50">B</div>
          <div className="border-b border-navy/10 bg-navy/10 py-1 text-center text-navy/50">2</div>
          <div className="min-h-[30px] border-b border-l border-navy/10 px-2 py-1 text-navy/90 ring-2 ring-inset ring-navy/40">{efface ? '' : saisie}</div>
          <div className="min-h-[30px] border-b border-l border-navy/10" />
        </div>
      </div>
      <p className="mt-3 rounded-full bg-mint/15 px-4 py-2 text-center text-sm font-bold text-mint">{efface ? '✓ La saisie disparaît : la cellule redevient vide. (La touche Échap fait pareil.)' : '👆 Tu t\'es trompé(e). Clique la croix rouge ✕ de la barre de formule pour annuler'}</p>
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
  // Pour le journal d'apprentissage : erreurs sur les interactions + temps passé.
  const erreursRef = useRef(0)
  const debutRef = useRef(Date.now())
  const s = steps[etape]
  const dernier = etape >= steps.length - 1
  const bloque = ['question', 'elargir', 'doubleclic', 'trouvererreur', 'choixtableau', 'vraifaux', 'cliquecible', 'tirepoignee', 'selectplage', 'choixsuggestion', 'baliseclic', 'annulesaisie', 'collagetranspose', 'construitformule', 'tcdbuilder', 'tcdscene', 'sommeauto', 'stylebuilder', 'entetebuilder', 'assistantformule', 'remplacer', 'convertirwizard', 'zonenombuilder', 'rubannommage', 'ongletsinteractif', 'boitedialogue', 'listeinteractive', 'graphiqueinteractif'].includes(s.visuel?.type) && !resolu

  useEffect(() => {
    setResolu(false)
    window.scrollTo({ top: 0 })
  }, [etape])

  const noterErreur = () => {
    erreursRef.current += 1
  }
  const stats = (passe = false) => ({
    erreurs: erreursRef.current,
    duree: Math.round((Date.now() - debutRef.current) / 1000),
    passe,
  })

  const avancer = () => {
    if (dernier) (onTermine || onQuitter)(stats())
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
          onClick={() => (onTermine || onQuitter)(stats(true))}
          className="shrink-0 text-xs font-bold text-navy/40 transition hover:text-navy"
        >
          Je connais, passer ›
        </button>
      </div>

      <div className="mx-auto w-full max-w-2xl flex-1 px-5 py-6">
        <div className="flex min-h-[320px] flex-col" key={etape}>
          <ShifuDit message={s.dit} humeur={s.humeur || 'accueil'} size={72} />
          {s.visuel?.type === 'question' ? (
            <Question q={s.visuel} onResolu={() => setResolu(true)} onErreur={noterErreur} />
          ) : s.visuel?.type === 'elargir' ? (
            <Elargir v={s.visuel} onResolu={() => setResolu(true)} />
          ) : s.visuel?.type === 'doubleclic' ? (
            <DoubleClic onResolu={() => setResolu(true)} />
          ) : s.visuel?.type === 'trouvererreur' ? (
            <TrouveErreur v={s.visuel} onResolu={() => setResolu(true)} onErreur={noterErreur} />
          ) : s.visuel?.type === 'choixtableau' ? (
            <ChoixTableau v={s.visuel} onResolu={() => setResolu(true)} onErreur={noterErreur} />
          ) : s.visuel?.type === 'vraifaux' ? (
            <VraiFaux v={s.visuel} onResolu={() => setResolu(true)} onErreur={noterErreur} />
          ) : s.visuel?.type === 'cliquecible' ? (
            <CliqueCible v={s.visuel} onResolu={() => setResolu(true)} onErreur={noterErreur} />
          ) : s.visuel?.type === 'tirepoignee' ? (
            <TirePoignee v={s.visuel} onResolu={() => setResolu(true)} />
          ) : s.visuel?.type === 'selectplage' ? (
            <SelectPlage v={s.visuel} onResolu={() => setResolu(true)} onErreur={noterErreur} />
          ) : s.visuel?.type === 'choixsuggestion' ? (
            <ChoixSuggestion v={s.visuel} onResolu={() => setResolu(true)} onErreur={noterErreur} />
          ) : s.visuel?.type === 'baliseclic' ? (
            <BaliseSeries v={s.visuel} onResolu={() => setResolu(true)} />
          ) : s.visuel?.type === 'annulesaisie' ? (
            <AnnuleSaisie v={s.visuel} onResolu={() => setResolu(true)} />
          ) : s.visuel?.type === 'collagetranspose' ? (
            <CollageTranspose v={s.visuel} onResolu={() => setResolu(true)} onErreur={noterErreur} />
          ) : s.visuel?.type === 'construitformule' ? (
            <ConstruitFormule v={s.visuel} onResolu={() => setResolu(true)} onErreur={noterErreur} />
          ) : s.visuel?.type === 'tcdbuilder' ? (
            <TcdBuilder v={s.visuel} onResolu={() => setResolu(true)} onErreur={noterErreur} />
          ) : s.visuel?.type === 'tcdscene' ? (
            <TcdScene v={s.visuel} onResolu={() => setResolu(true)} onErreur={noterErreur} />
          ) : s.visuel?.type === 'sommeauto' ? (
            <SommeAuto onResolu={() => setResolu(true)} />
          ) : s.visuel?.type === 'stylebuilder' ? (
            <StyleBuilder onResolu={() => setResolu(true)} />
          ) : s.visuel?.type === 'entetebuilder' ? (
            <EntetreBuilder onResolu={() => setResolu(true)} />
          ) : s.visuel?.type === 'assistantformule' ? (
            <AssistantFormule v={s.visuel} onResolu={() => setResolu(true)} onErreur={noterErreur} />
          ) : s.visuel?.type === 'remplacer' ? (
            <Remplacer onResolu={() => setResolu(true)} />
          ) : s.visuel?.type === 'convertirwizard' ? (
            <ConvertirWizard onResolu={() => setResolu(true)} />
          ) : s.visuel?.type === 'zonenombuilder' ? (
            <ZoneNomBuilder v={s.visuel} onResolu={() => setResolu(true)} />
          ) : s.visuel?.type === 'rubannommage' ? (
            <RubanNommage v={s.visuel} onResolu={() => setResolu(true)} />
          ) : s.visuel?.type === 'ongletsinteractif' ? (
            <OngletsInteractif v={s.visuel} onResolu={() => setResolu(true)} />
          ) : s.visuel?.type === 'boitedialogue' ? (
            <BoiteDialogue v={s.visuel} onResolu={() => setResolu(true)} />
          ) : s.visuel?.type === 'listeinteractive' ? (
            <ListeInteractive v={s.visuel} onResolu={() => setResolu(true)} />
          ) : s.visuel?.type === 'graphiqueinteractif' ? (
            <GraphiqueInteractif v={s.visuel} onResolu={() => setResolu(true)} />
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
                  : s.visuel?.type === 'trouvererreur'
                    ? 'Clique la cellule fautive'
                    : s.visuel?.type === 'choixtableau'
                      ? 'Choisis une proposition'
                      : s.visuel?.type === 'vraifaux'
                        ? 'Vrai ou faux ?'
                        : s.visuel?.type === 'cliquecible'
                          ? 'Clique le bon élément'
                          : s.visuel?.type === 'tirepoignee'
                            ? 'Tire la poignée de recopie'
                            : s.visuel?.type === 'selectplage'
                              ? 'Sélectionne la plage'
                              : s.visuel?.type === 'choixsuggestion'
                                ? 'Clique la bonne fonction'
                                : s.visuel?.type === 'baliseclic'
                                  ? 'Clique la balise'
                                  : s.visuel?.type === 'annulesaisie'
                                    ? 'Clique la croix rouge'
                                    : s.visuel?.type === 'collagetranspose'
                                      ? 'Clique Transposer'
                                      : s.visuel?.type === 'construitformule'
                                        ? 'Construis la formule'
                                        : s.visuel?.type === 'tcdbuilder'
                                          ? 'Dépose les champs'
                                          : s.visuel?.type === 'tcdscene'
                                            ? 'Fais l\'action sur le TCD'
                                            : s.visuel?.type === 'sommeauto'
                                              ? 'Clique le bouton ∑'
                                              : s.visuel?.type === 'stylebuilder'
                                                ? 'Crée ton style pas à pas'
                                                : s.visuel?.type === 'entetebuilder'
                                                  ? 'Compose ton en-tête'
                                                  : s.visuel?.type === 'assistantformule'
                                                    ? 'Suis l\'assistant fonction'
                                                    : s.visuel?.type === 'remplacer'
                                                      ? 'Fais le remplacement'
                                                      : s.visuel?.type === 'convertirwizard'
                                                        ? 'Suis l\'assistant Conversion'
                                                        : s.visuel?.type === 'zonenombuilder'
                                                          ? 'Utilise la Zone Nom'
                                                          : s.visuel?.type === 'rubannommage'
                                                            ? 'Fais l\'action pas à pas'
                                                            : s.visuel?.type === 'ongletsinteractif'
                                                              ? 'Agis sur l\'onglet'
                                                              : s.visuel?.type === 'boitedialogue'
                                                                ? 'Remplis la boîte'
                                                                : s.visuel?.type === 'listeinteractive'
                                                                  ? 'Agis sur la liste'
                                                                  : s.visuel?.type === 'graphiqueinteractif'
                                                                    ? 'Agis sur le graphique'
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
