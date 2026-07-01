import { chapitres, etapesChapitre } from '../data/chapitres'
import { useProgressCtx } from '../store/ProgressContext'
import { CEINTURES, ceintureInfo, indexCeinture } from '../lib/belts'
import { BeltGraphic, ProgressBar } from './ui'
import { ShifuBubble } from './Shifu'
import { MannequinBois } from './icons'
import { proverbeDuJour } from '../data/proverbes'

export default function Dashboard({ onOuvrirChapitre, onOuvrirDemo, onOuvrirObjectifs, onOuvrirConnexion }) {
  const { etat } = useProgressCtx()
  const derniere = etat.ceintures[etat.ceintures.length - 1] || null
  const info = ceintureInfo(derniere)
  const prochaine = CEINTURES[indexCeinture(derniere) + 1] || null

  const valides = (n) => Object.keys(etat.ecransValides).filter((k) => k.startsWith(`ch${n}-`)).length
  // MODE REVUE (temporaire) : tous les chapitres accessibles pour relire le ch.3 sans refaire 1 et 2.
  // Pour réactiver la progression : const estDebloque = (n) => n === 1 || etat.chapitresTermines.includes(n - 1)
  const estDebloque = () => true
  let objectif = null
  try {
    objectif = localStorage.getItem('excel-dojo-objectif')
  } catch {
    /* stockage indisponible */
  }

  return (
    <div className="relative isolate mx-auto w-full max-w-2xl animate-fade-up overflow-hidden px-5 pb-10 pt-8">
      <MannequinBois className="pointer-events-none absolute -right-6 top-20 -z-10 text-navy/[0.05]" size={150} />
      {/* Sur desktop, l'identité (logo, Shifu, ceinture) est dans la barre latérale : on masque ici. */}
      <header className="text-center lg:hidden">
        <p className="text-xs font-bold uppercase tracking-[.3em] text-mint">L'Art du Digital</p>
        <h1 className="font-display text-5xl leading-[0.95] text-navy">EXCEL ACADÉMIE</h1>
        <p className="mt-1.5 text-sm font-bold text-navy/55">La méthode Shaolin pour maîtriser Excel</p>
      </header>

      <div className="mt-5 lg:hidden">
        <ShifuBubble
          humeur={derniere ? 'content' : 'accueil'}
          message={
            derniere
              ? `Content de te revoir. Ta ceinture ${info.label.toLowerCase()} te va bien. On continue l'entraînement ?`
              : 'Bienvenue, jeune élève. Je suis ton Shifu. Ensemble, on va dompter Excel, une ceinture à la fois.'
          }
        />
      </div>

      <div className="mt-4 rounded-3xl bg-navy p-5 text-center shadow-lg lg:hidden">
        <div className="flex justify-center">
          <BeltGraphic ceinture={derniere || 'blanche'} size={120} />
        </div>
        <p className="mt-1 font-display text-2xl text-cream">
          {derniere ? `Ceinture ${info.label}` : 'Pas encore de ceinture'}
        </p>
        <p className="text-sm text-cream/70">{etat.xp} XP gagnés</p>
        {prochaine && (
          <p className="mt-2 text-xs text-cream/50">Prochaine étape : ceinture {prochaine.label.toLowerCase()}</p>
        )}
      </div>

      {/* Titre visible seulement sur desktop (l'identité étant dans la barre latérale) */}
      <h2 className="mb-1 hidden font-display text-3xl text-navy lg:block">Ton parcours</h2>
      <p className="mb-5 hidden text-sm text-navy/50 lg:block">
        Reprends là où tu t'es arrêté, jeune élève.
      </p>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-mint/25 bg-mint/10 px-4 py-3 lg:mt-0">
        <span className="text-xl">🔥</span>
        <p className="text-sm text-navy/90">
          <span className="font-bold text-mint">Entraînement du jour :</span> avance d'au moins une leçon.
        </p>
      </div>

      <button
        onClick={onOuvrirObjectifs}
        className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-navy/10 bg-navy/[0.03] px-4 py-3 text-left transition hover:bg-navy/[0.06]"
      >
        <span className="text-xl">🎯</span>
        <div className="min-w-0 flex-1">
          {objectif ? (
            <>
              <p className="text-xs font-bold uppercase tracking-wide text-mint/70">Ton objectif</p>
              <p className="truncate text-sm font-semibold text-navy">{objectif}</p>
            </>
          ) : (
            <p className="text-sm font-bold text-navy">Fixe ton objectif</p>
          )}
        </div>
        <span className="text-navy/40">›</span>
      </button>

      <div className="mt-3 rounded-2xl border border-navy/10 bg-navy/[0.03] px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-mint/70">Sagesse du Shifu</p>
        <p className="mt-1 text-sm italic text-navy/80">« {proverbeDuJour()} »</p>
      </div>

      <h2 className="mb-3 mt-7 font-display text-xl text-navy/80">La Voie</h2>
      <div className="space-y-3">
        {chapitres.map((ch) => {
          const total = etapesChapitre(ch)
          const fait = Math.min(valides(ch.chapitre), total)
          const debloque = estDebloque(ch.chapitre)
          const termine = etat.chapitresTermines.includes(ch.chapitre)
          const ceintureCh = ceintureInfo(ch.ceinture)
          return (
            <button
              key={ch.chapitre}
              disabled={!debloque}
              onClick={() => onOuvrirChapitre(ch.chapitre)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                debloque ? 'border-navy/10 bg-navy/5 hover:bg-navy/10' : 'border-navy/5 bg-navy/[.02] opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full font-display text-lg"
                  style={{ background: ceintureCh.couleur, color: '#16243f', border: `2px solid ${ceintureCh.bord}` }}
                >
                  {ch.chapitre}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-navy">{ch.titre}</p>
                  <p className="text-xs text-navy/50">
                    {!debloque
                      ? 'Verrouillé'
                      : termine
                        ? `Ceinture ${ceintureCh.label} obtenue ✓`
                        : `${fait}/${total} étapes`}
                  </p>
                </div>
                <span className="text-navy/40">{debloque ? '›' : '🔒'}</span>
              </div>
              {debloque && !termine && fait > 0 && (
                <div className="mt-3">
                  <ProgressBar valeur={fait} max={total} />
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-mint/30 bg-mint/10 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-mint">✨ Nouveau format</p>
        <p className="mt-1 text-sm text-navy/85">Le Shifu t'explique une fonction pas à pas, avec un mini-défi à la fin.</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            ['calculs', 'Faire des calculs'],
            ['saisie', 'Saisir des données'],
            ['recopie', 'Recopie & séries'],
            ['somme', 'La fonction SOMME'],
            ['references', 'Références $'],
            ['si', 'La fonction SI'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => onOuvrirDemo(id)}
              className="rounded-xl border border-navy/15 bg-navy/5 py-3 text-sm font-bold text-navy transition hover:bg-navy/10"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onOuvrirConnexion}
        className="mt-8 w-full rounded-2xl border border-navy/15 bg-navy/5 px-4 py-3 text-sm font-bold text-navy transition hover:bg-navy/10 lg:hidden"
      >
        Se connecter / créer un compte
      </button>

      <p className="mt-6 text-center text-[11px] text-navy/30">
        Pilote, chapitres 1 à 8 sur 13. Progression sauvegardée sur ton compte.
      </p>
    </div>
  )
}
