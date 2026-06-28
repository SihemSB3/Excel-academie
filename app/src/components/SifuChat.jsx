import { useState, useRef, useEffect } from 'react'
import { chapitres } from '../data/chapitres'
import { Shifu } from './Shifu'

// Toutes les FAQ des chapitres, agrégées (pas d'IA générative : matching de mots-clés).
const FAQ = chapitres.flatMap((c) => c.faq || [])

function trouverReponse(question) {
  const t = question.toLowerCase()
  let best = null
  let score = 0
  for (const f of FAQ) {
    let s = 0
    for (const mot of f.mots_cles || []) {
      if (t.includes(String(mot).toLowerCase())) s += 1
    }
    if (s > score) {
      score = s
      best = f
    }
  }
  return score > 0 ? best.reponse : null
}

export default function SifuChat() {
  const [ouvert, setOuvert] = useState(false)
  const [messages, setMessages] = useState([
    { de: 'sifu', txt: 'Je suis le Sifu, ton coach. Pose-moi ta question sur Excel, ou choisis-en une ci-dessous.' },
  ])
  const [saisie, setSaisie] = useState('')
  const finRef = useRef(null)

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, ouvert])

  const envoyer = (texte) => {
    const q = (texte ?? saisie).trim()
    if (!q) return
    const rep = trouverReponse(q)
    const reponse =
      rep ||
      "Je n'ai pas encore la réponse exacte à celle-là. Essaie un mot-clé (poignée, somme, $, collage, série...) ou choisis une question ci-dessous."
    setMessages((m) => [...m, { de: 'moi', txt: q }, { de: 'sifu', txt: reponse }])
    setSaisie('')
  }

  return (
    <>
      <button
        onClick={() => setOuvert(true)}
        aria-label="Demander au Sifu"
        className="fixed bottom-4 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-navy text-2xl shadow-xl transition hover:scale-105 active:scale-95"
      >
        <span aria-hidden="true">🥋</span>
      </button>

      {ouvert && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/40 p-0 sm:items-center sm:p-4" onClick={() => setOuvert(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-[82vh] max-h-[620px] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-navy/10 bg-cream shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-center gap-2 bg-navy px-4 py-3 text-cream">
              <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-cream/10">
                <Shifu humeur="accueil" size={42} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold leading-tight">Le Sifu</p>
                <p className="text-[11px] text-cream/60">Ton coach Excel</p>
              </div>
              <button onClick={() => setOuvert(false)} aria-label="Fermer" className="text-2xl leading-none text-cream/70 hover:text-cream">
                ×
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${m.de === 'moi' ? 'ml-auto rounded-br-sm bg-mint/25 text-navy' : 'rounded-bl-sm bg-navy/5 text-navy/90'}`}
                >
                  {m.txt}
                </div>
              ))}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {FAQ.slice(0, 6).map((f, i) => (
                  <button
                    key={i}
                    onClick={() => envoyer(f.question)}
                    className="rounded-full border border-navy/15 bg-white px-2.5 py-1 text-[11px] text-navy/70 transition hover:bg-mint/10"
                  >
                    {f.question}
                  </button>
                ))}
              </div>
              <div ref={finRef} />
            </div>

            <div className="flex items-center gap-2 border-t border-navy/10 bg-cream p-3">
              <input
                value={saisie}
                onChange={(e) => setSaisie(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && envoyer()}
                placeholder="Ta question..."
                className="flex-1 rounded-full border border-navy/15 bg-white px-4 py-2 text-sm text-navy outline-none focus:border-mint"
              />
              <button
                onClick={() => envoyer()}
                aria-label="Envoyer"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint text-lg font-bold text-navy-deep"
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
