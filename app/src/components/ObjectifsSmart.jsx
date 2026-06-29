import { useState } from 'react'
import { Bouton } from './ui'
import { ShifuDit } from './Shifu'
import { useProgressCtx } from '../store/ProgressContext'
import { ceintureInfo } from '../lib/belts'

// Les 5 raisons d'un objectif SMART, reprises de l'ebook (page « POURQUOI ? »).
const RAISONS = [
  {
    n: '01',
    titre: 'Tu gagnes en clarté',
    texte: 'Un objectif SMART t\'aide à savoir précisément pourquoi tu es là. Au lieu de « Je veux apprendre Excel », tu dis : « Je veux maîtriser les formules de base pour gérer mes dépenses mensuelles d\'ici 7 jours. »',
    tag: 'Tu n\'apprends pas pour « apprendre », tu apprends pour réaliser quelque chose de concret.',
  },
  {
    n: '02',
    titre: 'Tu évites de te disperser',
    texte: 'Excel est immense (tableaux, fonctions, mises en forme, TCD, macros…). Sans objectif clair, tu risques de papillonner d\'un sujet à l\'autre, de t\'éparpiller et de perdre ta motivation.',
  },
  {
    n: '03',
    titre: 'Tu mesures tes progrès',
    texte: 'Un objectif mesurable te permet de dire : « Avant, je ne savais pas faire une formule. Maintenant, je fais des sommes automatiques et j\'utilise les références absolues. »',
    tag: 'Ça te donne confiance et te pousse à continuer.',
  },
  {
    n: '04',
    titre: 'Tu respectes ton rythme',
    texte: 'L\'objectif SMART t\'aide à fixer une durée réaliste, adaptée à ton emploi du temps. Pas besoin d\'aller vite : juste au bon rythme, pour tenir dans la durée.',
  },
  {
    n: '05',
    titre: 'Tu restes connecté·e à ta valeur',
    texte: 'Formuler un objectif te pousse à te demander : pourquoi c\'est important pour moi ? En quoi ça va changer mon quotidien ? Quel impact dans ma vie, pro ou perso ?',
  },
]

// Les 5 critères SMART, repris de l'ebook (question + exemple pour chacun).
const CRITERES = [
  { k: 'S', nom: 'Spécifique', q: "Qu'est-ce que tu veux apprendre précisément ?", ex: 'Ex : utiliser la fonction SI dans un tableau' },
  { k: 'M', nom: 'Mesurable', q: "Comment sauras-tu que c'est atteint ?", ex: "Ex : je l'utilise sans modèle, dans 2 cas" },
  { k: 'A', nom: 'Atteignable', q: "Comment vas-tu t'y prendre pour y arriver ?", ex: 'Ex : suivre le module + 2 exercices corrigés' },
  { k: 'R', nom: 'Réaliste', q: "Pourquoi c'est important pour toi maintenant ?", ex: 'Ex : analyser mes ventes, automatiser une tâche' },
  { k: 'T', nom: 'Temporel', q: "Pour quand veux-tu l'avoir atteint ?", ex: 'Ex : avant dimanche soir' },
]

// Écran montré après une ceinture (ou depuis le tableau de bord) :
// d'abord POURQUOI un objectif SMART (animé), puis la fiche SMART à remplir.
export default function ObjectifsSmart({ onTerminer }) {
  const { etat } = useProgressCtx()
  const derniere = etat.ceintures[etat.ceintures.length - 1] || null
  const info = ceintureInfo(derniere)

  const message = derniere
    ? `Te voilà **ceinture ${info.label.toLowerCase()}** 🥋. Avant de continuer, fixe-toi un cap.`
    : 'Avant de continuer, fixe-toi un cap.'

  const [vue, setVue] = useState('pourquoi') // 'pourquoi' | 'fiche'
  const [idx, setIdx] = useState(1) // nombre de raisons révélées (elles s'accumulent sur la page)
  const [vals, setVals] = useState({ S: '', M: '', A: '', R: '', T: '' })
  const set = (k, v) => setVals((s) => ({ ...s, [k]: v }))
  const pret = vals.S.trim().length > 0 // au moins le « Spécifique »

  const valider = () => {
    if (pret) {
      const resume = vals.T.trim() ? `${vals.S.trim()} — ${vals.T.trim()}` : vals.S.trim()
      try {
        localStorage.setItem('excel-dojo-objectif', resume)
        localStorage.setItem('excel-dojo-objectif-smart', JSON.stringify(vals))
      } catch {
        /* stockage indisponible */
      }
    }
    onTerminer()
  }

  // --- Vue « Pourquoi ? » : les raisons s'accumulent sur la même page (petit bouton « lire la suite »). ---
  if (vue === 'pourquoi') {
    const total = RAISONS.length
    const visibles = RAISONS.slice(0, idx)
    return (
      <div className="flex flex-1 flex-col px-5 py-8">
        <p className="text-xs font-bold uppercase tracking-wide text-mint">Objectifs SMART</p>
        <div className="mt-1 flex items-center gap-3">
          <span className="grid h-14 w-14 shrink-0 animate-float place-items-center rounded-full bg-mint/20 ring-2 ring-mint/40">
            <span className="font-display text-3xl leading-none text-mint">?</span>
          </span>
          <h2 className="font-display text-2xl leading-tight text-navy">Pourquoi un objectif SMART ?</h2>
        </div>

        <div className="mt-4">
          <ShifuDit humeur="content" size={68} message={message} />
        </div>

        <div className="mt-4 space-y-3">
          {visibles.map((r) => (
            <div key={r.n} className="animate-fade-up rounded-2xl border border-navy/10 bg-navy/5 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint font-display text-base text-navy-deep">{r.n}</span>
                <p className="font-display text-lg leading-tight text-navy">{r.titre}</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-navy/80">{r.texte}</p>
              {r.tag && <p className="mt-2 rounded-xl bg-mint/15 px-3 py-1.5 text-xs font-bold text-mint">{r.tag}</p>}
            </div>
          ))}
        </div>

        {idx < total ? (
          <button
            onClick={() => setIdx(idx + 1)}
            className="mx-auto mt-4 flex items-center gap-1.5 rounded-full bg-mint/15 px-5 py-2 text-sm font-bold text-mint transition hover:bg-mint/25"
          >
            Lire la suite ({idx}/{total}) <span className="text-base leading-none">↓</span>
          </button>
        ) : (
          <div className="mt-5">
            <Bouton onClick={() => setVue('fiche')}>Créer ma fiche SMART →</Bouton>
          </div>
        )}

        <button onClick={onTerminer} className="mt-3 block w-full text-center text-xs text-navy/40 transition hover:text-navy/70">
          Plus tard
        </button>
      </div>
    )
  }

  // --- Vue « Fiche SMART » : les 5 critères à remplir. ---
  return (
    <div className="flex flex-1 flex-col px-5 py-8">
      <button onClick={() => setVue('pourquoi')} className="mb-2 self-start text-xs text-navy/50 transition hover:text-navy">
        ‹ Pourquoi un objectif SMART
      </button>
      <p className="text-xs font-bold uppercase tracking-wide text-mint">Ton objectif SMART</p>
      <h2 className="mt-1 font-display text-3xl text-navy">Fixe ton cap</h2>

      <p className="mt-3 text-sm text-navy/70">
        Remplis ta <span className="font-bold text-navy">fiche SMART</span> : un objectif clair, c'est un objectif qu'on atteint.
      </p>

      <div className="mt-3 space-y-2.5">
        {CRITERES.map((c) => (
          <div key={c.k} className="rounded-2xl border border-navy/10 bg-navy/5 p-3">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mint font-display text-lg text-navy-deep">{c.k}</span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-mint">{c.nom}</p>
                <p className="text-xs leading-snug text-navy/60">{c.q}</p>
              </div>
            </div>
            <input
              value={vals[c.k]}
              onChange={(e) => set(c.k, e.target.value)}
              placeholder={c.ex}
              className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-mint"
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Bouton onClick={valider} disabled={!pret}>
          C'est noté 🎯
        </Bouton>
        <button onClick={onTerminer} className="mt-3 block w-full text-center text-xs text-navy/40 transition hover:text-navy/70">
          Plus tard
        </button>
      </div>
    </div>
  )
}
