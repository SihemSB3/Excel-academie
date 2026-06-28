import { useState } from 'react'
import { useProgressCtx } from '../store/ProgressContext'
import { Bouton } from './ui'
import { Shifu } from './Shifu'

export default function Quiz({ module, onTermine }) {
  const { validerEcran } = useProgressCtx()
  const questions = module.questions
  const [i, setI] = useState(0)
  const [selection, setSelection] = useState([])
  const [valide, setValide] = useState(false)
  const [score, setScore] = useState(0)
  const [fini, setFini] = useState(false)

  const q = questions[i]
  const correctes = q.reponses_correctes || []

  const basculer = (idx) => {
    if (valide) return
    setSelection((s) => (s.includes(idx) ? s.filter((x) => x !== idx) : [...s, idx]))
  }

  const valider = () => {
    const bon = selection.length === correctes.length && selection.every((x) => correctes.includes(x))
    if (bon) setScore((s) => s + 1)
    setValide(true)
  }

  const suivant = () => {
    if (i + 1 < questions.length) {
      setI(i + 1)
      setSelection([])
      setValide(false)
      window.scrollTo({ top: 0 })
    } else {
      setFini(true)
    }
  }

  const recommencer = () => {
    setI(0)
    setScore(0)
    setSelection([])
    setValide(false)
    setFini(false)
  }

  if (fini) {
    const seuil = module.seuil_reussite || questions.length
    const reussi = score >= seuil
    return (
      <div className="animate-fade-up px-5 py-10 text-center">
        <div className="flex animate-float justify-center">
          <Shifu humeur={reussi ? 'fier' : 'pensif'} size={120} />
        </div>
        <h2 className="mt-3 font-display text-4xl text-navy">
          {score}/{questions.length}
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-navy/70">
          {reussi
            ? 'Quiz réussi. Tu peux débloquer ta ceinture.'
            : `Il te faut ${seuil} bonnes réponses. Reprends, un guerrier persévère.`}
        </p>
        <div className="mt-8">
          {reussi ? (
            <Bouton
              onClick={() => {
                validerEcran(module.id, module.xp_reussite || 0)
                onTermine()
              }}
            >
              Continuer
            </Bouton>
          ) : (
            <Bouton variant="ghost" onClick={recommencer}>
              Réessayer
            </Bouton>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-up px-5 py-6">
      <p className="text-xs font-bold uppercase tracking-wide text-mint">
        Quiz · {i + 1}/{questions.length}
      </p>
      <h2 className="mt-1 font-display text-2xl leading-tight text-navy">{q.question}</h2>
      {q.multi && <p className="mt-1 text-xs text-navy/40">Plusieurs réponses possibles.</p>}

      <div className="mt-4 space-y-2">
        {q.options.map((opt, idx) => {
          const choisi = selection.includes(idx)
          const estCorrecte = correctes.includes(idx)
          let cls = 'border-navy/10 bg-navy/5'
          if (valide) {
            if (estCorrecte) cls = 'border-mint/60 bg-mint/15'
            else if (choisi) cls = 'border-red-400/50 bg-red-500/10'
          } else if (choisi) {
            cls = 'border-mint/60 bg-mint/10'
          }
          return (
            <button
              key={idx}
              onClick={() => basculer(idx)}
              disabled={valide}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${cls}`}
            >
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-xs ${
                  choisi || (valide && estCorrecte) ? 'border-mint bg-mint text-navy-deep' : 'border-navy/30'
                }`}
              >
                {valide && estCorrecte ? '✓' : choisi ? '•' : ''}
              </span>
              <span className="text-sm text-navy/90">{opt}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        {valide ? (
          <Bouton onClick={suivant}>
            {i + 1 < questions.length ? 'Question suivante' : 'Voir mon score'}
          </Bouton>
        ) : (
          <Bouton onClick={valider} disabled={selection.length === 0}>
            Valider
          </Bouton>
        )}
      </div>
    </div>
  )
}
