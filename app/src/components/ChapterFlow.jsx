import { useState } from 'react'
import { getChapitre } from '../data/chapitres'
import { useProgressCtx } from '../store/ProgressContext'
import ChapterMap from './ChapterMap'
import ChapterPath from './ChapterPath'
import LeconScreen from './LeconScreen'
import Flashcards from './Flashcards'
import FicheMemo from './FicheMemo'
import Quiz from './Quiz'
import Checklist from './Checklist'
import BeltUnlock from './BeltUnlock'
import ObjectifsSmart from './ObjectifsSmart'
import LeconNarree from './LeconNarree'
import { LECONS_FONCTIONS } from '../data/lecons-fonctions'

// Un chapitre = un parcours. Mobile : carte verticale. PC : chemin horizontal animé.
export default function ChapterFlow({ chapitre, onQuitter }) {
  const ch = getChapitre(chapitre)
  const { etat, debloquerCeinture, validerEcran } = useProgressCtx()
  const [actif, setActif] = useState(null)
  const [celebration, setCelebration] = useState(false)
  const [smart, setSmart] = useState(false)

  if (!ch) return null
  if (smart)
    return (
      <ObjectifsSmart
        onTerminer={() => {
          try {
            localStorage.setItem('excel-dojo-smart-vu', '1')
          } catch {
            /* stockage indisponible */
          }
          onQuitter()
        }}
      />
    )
  if (celebration)
    return (
      <BeltUnlock
        recompense={ch.recompense}
        onContinuer={() => {
          let vu = true
          try {
            vu = localStorage.getItem('excel-dojo-smart-vu') === '1'
          } catch {
            /* stockage indisponible */
          }
          if (!vu) {
            setCelebration(false)
            setSmart(true)
          } else {
            onQuitter()
          }
        }}
      />
    )

  const estFait = (m) =>
    m.type === 'lecon' ? m.ecrans.every((e) => etat.ecransValides[e.id]) : Boolean(etat.ecransValides[m.id])
  const tousFaits = ch.modules.every(estFait)

  if (actif === null) {
    const mapProps = {
      ch,
      estFait,
      tousFaits,
      onOuvrir: (i) => {
        setActif(i)
        window.scrollTo({ top: 0 })
      },
      onQuitter,
      onReclamerCeinture: () => {
        debloquerCeinture(ch.recompense.ceinture_debloquee, ch.recompense.xp_bonus, ch.chapitre)
        setCelebration(true)
      },
    }
    return (
      <>
        <div className="flex flex-1 flex-col lg:hidden">
          <ChapterMap {...mapProps} />
        </div>
        <div className="hidden flex-1 flex-col lg:flex">
          <ChapterPath {...mapProps} />
        </div>
      </>
    )
  }

  const m = ch.modules[actif]
  const retour = () => {
    setActif(null)
    window.scrollTo({ top: 0 })
  }
  if (m.type === 'narration') {
    return (
      <LeconNarree
        lecon={LECONS_FONCTIONS[m.lecon]}
        onQuitter={retour}
        onTermine={() => {
          validerEcran(m.id, m.xp || 0)
          retour()
        }}
      />
    )
  }

  const props = { module: m, onTermine: retour }

  return (
    <div className="flex flex-1 flex-col">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-cream/90 px-4 py-3 backdrop-blur">
        <button
          onClick={retour}
          aria-label="Retour à la carte"
          className="text-2xl leading-none text-navy/60 hover:text-navy"
        >
          ‹
        </button>
        <p className="truncate text-xs font-bold uppercase tracking-wide text-navy/50">{ch.titre}</p>
      </div>
      <div className="mx-auto w-full max-w-2xl flex-1">
        {m.type === 'lecon' && <LeconScreen {...props} />}
        {m.type === 'flashcards' && <Flashcards {...props} />}
        {m.type === 'fiche_memo' && <FicheMemo {...props} />}
        {m.type === 'quiz' && <Quiz {...props} />}
        {m.type === 'checklist' && <Checklist {...props} />}
      </div>
    </div>
  )
}
