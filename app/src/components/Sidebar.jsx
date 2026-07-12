import { chapitres } from '../data/chapitres'
import { useProgressCtx } from '../store/ProgressContext'
import { useAuth } from '../store/AuthContext'
import { supabase } from '../lib/supabase'
import { ceintureInfo } from '../lib/belts'
import { BeltGraphic, ProgressBar } from './ui'
import { Shifu } from './Shifu'

// Barre latérale visible uniquement sur grand écran (lg+). Panneau d'identité + statut.
export default function Sidebar({ retourDojo, onConnexion }) {
  const { etat } = useProgressCtx()
  const { utilisateur } = useAuth()
  const derniere = etat.ceintures[etat.ceintures.length - 1] || null
  const info = ceintureInfo(derniere)
  const faits = etat.chapitresTermines.length

  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-5 border-r border-navy/10 bg-cream/50 p-6 lg:flex">
      <button onClick={retourDojo} className="text-left">
        <p className="text-[11px] font-bold uppercase tracking-[.3em] text-mint">L'Art du Digital</p>
        <h1 className="font-display text-3xl leading-none text-navy">EXCEL ACADÉMIE</h1>
        <p className="mt-1.5 text-[11px] leading-snug text-navy/55">La méthode Shaolin pour maîtriser Excel</p>
      </button>

      <div className="flex items-center gap-3">
        <div className="shrink-0 animate-float">
          <Shifu humeur={derniere ? 'content' : 'accueil'} size={62} />
        </div>
        <p className="text-xs leading-relaxed text-navy/70">
          {derniere ? "Continue l'entraînement, élève." : "Bienvenue à l'académie, jeune élève."}
        </p>
      </div>

      <div className="rounded-2xl bg-navy/5 p-4 text-center">
        <div className="flex justify-center">
          <BeltGraphic ceinture={derniere || 'blanche'} size={96} />
        </div>
        <p className="mt-1 font-display text-xl text-navy">
          {derniere ? `Ceinture ${info.label}` : 'Pas de ceinture'}
        </p>
        <p className="text-sm text-navy/60">{etat.xp} XP</p>
      </div>

      <div>
        <div className="mb-1 flex justify-between text-xs text-navy/50">
          <span>Progression</span>
          <span>
            {faits}/{chapitres.length} chapitres
          </span>
        </div>
        <ProgressBar valeur={faits} max={chapitres.length} />
      </div>

      <div className="mt-auto space-y-3">
        {utilisateur ? (
          <div className="space-y-2">
            <p className="truncate text-center text-xs text-navy/50">{utilisateur.email}</p>
            <button
              onClick={() => supabase.auth.signOut()}
              className="w-full rounded-xl border border-navy/15 bg-navy/5 py-2.5 text-sm font-bold text-navy transition hover:bg-navy/10"
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <button
            onClick={onConnexion}
            className="w-full rounded-xl border border-navy/15 bg-navy/5 py-2.5 text-sm font-bold text-navy transition hover:bg-navy/10"
          >
            Se connecter
          </button>
        )}
        <p className="text-[11px] leading-relaxed text-navy/30">
          Apprends sur mobile, pratique les exercices sur ordinateur. Ta progression te suit partout.
        </p>
      </div>
    </aside>
  )
}
