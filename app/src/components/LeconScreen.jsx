import { useState } from 'react'
import { useProgressCtx } from '../store/ProgressContext'
import { Bouton } from './ui'
import { NinjaIcon } from './icons'

const D = (ms) => ({ animationDelay: `${ms}ms` })

const ACCEPTE = {
  barre_acces_rapide: ['barre_acces_rapide'],
  ruban: ['ruban', 'onglet_accueil'],
  onglet_accueil: ['onglet_accueil'],
  barre_formule: ['barre_formule'],
  cellule_A1: ['A1'],
  'A1:A5': ['A1', 'A2', 'A3', 'A4', 'A5'],
  graphique: ['graphique'],
}
const LABEL = {
  barre_acces_rapide: "la barre d'accès rapide",
  ruban: 'le ruban',
  onglet_accueil: "l'onglet Accueil",
  barre_formule: 'la barre de formule',
  cellule_A1: 'la cellule A1',
  'A1:A5': 'la plage A1:A5',
  graphique: 'le graphique',
}

// --- Coloration syntaxique légère ---
function coloreFormule(str) {
  const re = /(\$?[A-Z]+\$?\d+(?::\$?[A-Z]+\$?\d+)?)|([A-Z]{2,})(?=\()|("[^"]*")|(=)/g
  const out = []
  let last = 0
  let k = 0
  let m
  while ((m = re.exec(str)) !== null) {
    if (m.index > last) out.push(<span key={k++}>{str.slice(last, m.index)}</span>)
    let c = ''
    if (m[1]) c = 'text-sky-600'
    else if (m[2]) c = 'text-amber-600'
    else if (m[3]) c = 'text-emerald-600'
    else if (m[4]) c = 'text-mint font-bold'
    out.push(
      <span key={k++} className={c}>
        {m[0]}
      </span>,
    )
    last = m.index + m[0].length
  }
  if (last < str.length) out.push(<span key={k++}>{str.slice(last)}</span>)
  return out
}

function coloreAdresse(s) {
  return s.split('').map((ch, i) => (ch === '$' ? <span key={i} className="text-mint">{ch}</span> : <span key={i}>{ch}</span>))
}

// --- Blocs visuels d'explication ---
function BlocFormules({ items }) {
  return (
    <div className="mt-3 space-y-2">
      {items.map((f, i) => (
        <div
          key={i}
          className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-navy/10 bg-[#ffffff] p-3 animate-fade-up"
          style={D(i * 130)}
        >
          <span className="rounded-md bg-cream px-2 py-1 font-mono text-sm text-navy">{coloreFormule(f.formule)}</span>
          <span className="text-navy/40">→</span>
          <span className="text-sm text-navy/80">{f.role}</span>
        </div>
      ))}
    </div>
  )
}

function BlocAdresses({ items }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {items.map((a, i) => (
        <div key={i} className="rounded-xl border border-navy/10 bg-navy/5 p-3 animate-fade-up" style={D(i * 110)}>
          <div className="font-mono text-2xl font-bold tracking-wide text-navy">{coloreAdresse(a.notation)}</div>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-mint/80">{a.categorie}</p>
          <p className="text-xs leading-snug text-navy/70">{a.explication}</p>
        </div>
      ))}
    </div>
  )
}

function BlocPoints({ items }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex items-start gap-2 animate-fade-up" style={D(i * 90)}>
          <span className="mt-0.5 text-mint">✓</span>
          <span className="text-sm text-navy/85">{t}</span>
        </li>
      ))}
    </ul>
  )
}

function Blocs({ blocs }) {
  return (
    <>
      {blocs.map((b, i) => {
        if (b.type === 'texte') return <p key={i} className="mt-3 leading-relaxed text-navy/85 animate-fade-up">{b.valeur}</p>
        if (b.type === 'formules') return <BlocFormules key={i} items={b.items} />
        if (b.type === 'adresses') return <BlocAdresses key={i} items={b.items} />
        if (b.type === 'points') return <BlocPoints key={i} items={b.items} />
        return null
      })}
    </>
  )
}

// Faux écran Excel, cliquable
function ExcelMock({ cible, onZone, vert = [], indice = null, fige = false }) {
  const cols = ['A', 'B', 'C', 'D']
  const rows = [1, 2, 3, 4, 5]
  const cls = (id, base) =>
    `${base} ${vert.includes(id) ? 'bg-mint/60 ring-2 ring-mint ring-inset' : indice === id ? 'ring-2 ring-mint ring-inset animate-pulse' : ''}`
  const clic = (id) => () => {
    if (!fige) onZone(id)
  }

  return (
    <div className="select-none overflow-hidden rounded-xl border border-navy/10 bg-[#ffffff] shadow-lg">
      <div className="flex items-center gap-2 bg-[#eceae3] px-2 py-1">
        <div onClick={clic('barre_acces_rapide')} className={cls('barre_acces_rapide', 'flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 hover:bg-navy/10')}>
          <span className="h-2.5 w-2.5 rounded-sm bg-navy/40" />
          <span className="h-2.5 w-2.5 rounded-sm bg-navy/40" />
          <span className="h-2.5 w-2.5 rounded-sm bg-navy/40" />
        </div>
        <span className="text-[10px] text-navy/30">Classeur1 — Excel</span>
      </div>
      <div onClick={clic('ruban')} className={cls('ruban', 'flex cursor-pointer items-center gap-3 bg-[#1f7a4d] px-3 py-1.5 text-[11px] text-navy hover:brightness-110')}>
        <span className="opacity-80">Fichier</span>
        <span
          onClick={(e) => {
            e.stopPropagation()
            clic('onglet_accueil')()
          }}
          className={cls('onglet_accueil', 'cursor-pointer rounded px-1 font-bold hover:bg-navy/20')}
        >
          Accueil
        </span>
        <span className="opacity-70">Insertion</span>
        <span className="opacity-70">Formules</span>
      </div>
      <div onClick={clic('barre_formule')} className={cls('barre_formule', 'flex cursor-pointer items-center gap-2 border-b border-navy/10 bg-navy/5 px-3 py-1 text-[11px] hover:bg-navy/10')}>
        <span className="font-bold text-navy/60">fx</span>
        <span className="text-navy/30">|</span>
      </div>
      <div className="relative">
        <div className="grid text-[10px]" style={{ gridTemplateColumns: '22px repeat(4, 1fr)' }}>
          <div className="bg-navy/5" />
          {cols.map((c) => (
            <div key={c} className="border-b border-l border-navy/10 bg-navy/10 py-0.5 text-center text-navy/50">
              {c}
            </div>
          ))}
          {rows.map((r) => (
            <div key={r} className="contents">
              <div className="bg-navy/10 text-center text-navy/50">{r}</div>
              {cols.map((c) => {
                const id = c + r
                return <div key={id} onClick={clic(id)} className={cls(id, 'h-6 cursor-pointer border-b border-l border-navy/5 hover:bg-navy/10')} />
              })}
            </div>
          ))}
        </div>
        {/* Graphique présent uniquement quand la consigne le demande (onglet contextuel) */}
        {cible === 'graphique' && (
          <div
            onClick={clic('graphique')}
            className={cls('graphique', 'absolute right-2 top-3 flex h-16 w-24 cursor-pointer items-end justify-center gap-1 rounded-md border border-navy/20 bg-[#eceae3] p-2 shadow-lg hover:bg-[#ffffff]')}
          >
            <span className="w-2.5 rounded-sm bg-sky-300" style={{ height: '40%' }} />
            <span className="w-2.5 rounded-sm bg-mint" style={{ height: '75%' }} />
            <span className="w-2.5 rounded-sm bg-amber-300" style={{ height: '55%' }} />
            <span className="w-2.5 rounded-sm bg-sky-300" style={{ height: '90%' }} />
          </div>
        )}
      </div>
    </div>
  )
}

function ExerciceList({ exercices }) {
  return (
    <div className="mt-5">
      <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-mint">
        <NinjaIcon size={20} className="text-mint" /> Entraînement
      </p>
      <div className="space-y-2">
        {exercices.map((ex) => (
          <a
            key={ex.n}
            href={ex.url_copie}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl border border-mint/40 bg-mint/10 px-4 py-3 transition hover:bg-mint/20"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mint font-bold text-navy-deep">{ex.n}</span>
            <span className="flex-1 text-sm text-navy/90">{ex.titre}</span>
            <span className="text-mint">↗</span>
          </a>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-navy/40">Chaque lien ouvre ta copie personnelle (onglet 1 = exercice, onglet 2 = correction).</p>
    </div>
  )
}

function EcranContenu({ ec, module, dernier, avancer }) {
  const aCapture = Boolean(ec.capture)
  const cible = ec.capture?.cible
  const [trouve, setTrouve] = useState(!aCapture)
  const [revele, setRevele] = useState(false)
  const [essais, setEssais] = useState(0)
  const [indice, setIndice] = useState(null)
  const fini = trouve || revele

  const montrer = () => {
    setRevele(true)
    setIndice(null)
  }

  const onZone = (id) => {
    if (fini) return
    if (ACCEPTE[cible]?.includes(id)) {
      setTrouve(true)
    } else {
      const n = essais + 1
      setEssais(n)
      if (n >= 2) setIndice(ACCEPTE[cible]?.[0])
      if (n >= 3) montrer() // après 3 essais, on donne la réponse et on débloque
    }
  }

  return (
    <div>
      <p className="animate-fade-up text-xs font-bold uppercase tracking-wide text-mint" style={D(0)}>
        {module.titre}
      </p>
      <h2 className="mt-1 animate-fade-up font-display text-3xl leading-tight text-navy" style={D(90)}>
        {ec.titre}
      </h2>

      {aCapture && (
        <div className="mt-4 animate-fade-up" style={D(190)}>
          <ExcelMock cible={cible} onZone={onZone} fige={fini} indice={indice} vert={fini ? ACCEPTE[cible] : []} />
          {trouve ? (
            <p className="mt-3 rounded-full bg-mint/20 px-3 py-2 text-center text-sm font-bold text-mint">✓ Bravo, c'est bien {LABEL[cible]}.</p>
          ) : revele ? (
            <p className="mt-3 rounded-2xl bg-navy/10 px-3 py-2 text-center text-sm font-bold text-navy/90">
              La réponse, c'est {LABEL[cible]} (surligné en vert). Tu peux continuer.
            </p>
          ) : (
            <>
              <p
                className={`mt-3 rounded-full px-3 py-2 text-center text-sm font-bold ${
                  essais > 0 ? 'bg-red-500/15 text-red-600' : 'bg-mint/15 text-mint'
                }`}
              >
                👆 {essais > 0 ? 'Presque, réessaie !' : ec.capture.consigne}
              </p>
              {essais > 0 && (
                <button onClick={montrer} className="mt-2 block w-full text-center text-xs text-navy/50 underline underline-offset-2 hover:text-navy">
                  Je ne trouve pas, montre-moi la réponse
                </button>
              )}
            </>
          )}
        </div>
      )}

      {ec.texte && (
        <p className="mt-4 animate-fade-up leading-relaxed text-navy/85" style={D(aCapture ? 290 : 190)}>
          {ec.texte}
        </p>
      )}

      {ec.blocs && (
        <div className="mt-1">
          <Blocs blocs={ec.blocs} />
        </div>
      )}

      {dernier && module.exercices?.length > 0 && (
        <div className="animate-fade-up" style={D(380)}>
          <ExerciceList exercices={module.exercices} />
        </div>
      )}

      <div className="mt-8 animate-fade-up" style={D(aCapture ? 400 : 290)}>
        <Bouton onClick={avancer} disabled={!fini}>
          {!fini ? 'Trouve le bon élément' : dernier ? 'Terminer la leçon' : 'Suivant'}
        </Bouton>
      </div>
    </div>
  )
}

export default function LeconScreen({ module, onTermine }) {
  const { validerEcran, estValide } = useProgressCtx()
  const ecrans = module.ecrans
  const [j, setJ] = useState(() => {
    const k = ecrans.findIndex((e) => !estValide(e.id))
    return k === -1 ? 0 : k
  })
  const ec = ecrans[j]
  const dernier = j === ecrans.length - 1

  const avancer = () => {
    validerEcran(ec.id, module.xp_par_ecran || 0)
    if (dernier) onTermine()
    else {
      setJ(j + 1)
      window.scrollTo({ top: 0 })
    }
  }

  return (
    <div className="px-5 py-6">
      <div className="mb-6 flex items-center gap-1.5">
        {ecrans.map((_, k) => (
          <span
            key={k}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              k < j ? 'bg-mint' : k === j ? 'bg-mint/60' : 'bg-navy/10'
            }`}
          />
        ))}
      </div>

      <EcranContenu key={ec.id} ec={ec} module={module} dernier={dernier} avancer={avancer} />
    </div>
  )
}
