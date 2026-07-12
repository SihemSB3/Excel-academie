import { createContext, useContext, useEffect } from 'react'
import { useProgress } from './useProgress'
import { useAuth } from './AuthContext'
import { supabase, supabaseActif } from '../lib/supabase'

const ProgressContext = createContext(null)

const versSupabase = (etat) => ({
  xp: etat.xp,
  ceintures: etat.ceintures,
  ecrans_valides: etat.ecransValides,
  chapitres_termines: etat.chapitresTermines,
  journal: etat.journal,
  streak: etat.streak,
})

const depuisSupabase = (ligne) => ({
  xp: ligne.xp,
  ceintures: ligne.ceintures,
  ecransValides: ligne.ecrans_valides,
  chapitresTermines: ligne.chapitres_termines,
  journal: ligne.journal,
  streak: ligne.streak,
})

export function ProgressProvider({ children }) {
  const value = useProgress()
  const { session } = useAuth()
  const { etat, fusionnerEtDefinir } = value
  const userId = session?.user?.id

  // Au login (ou au chargement avec une session déjà active) : on récupère la
  // progression cloud et on la fusionne avec le local, jamais on n'écrase.
  useEffect(() => {
    if (!supabaseActif || !userId) return
    let annule = false
    supabase
      .from('progression')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!annule && data) fusionnerEtDefinir(depuisSupabase(data))
      })
    return () => {
      annule = true
    }
  }, [userId])

  // À chaque changement d'état, tant qu'on est connecté : on pousse vers Supabase (léger debounce).
  useEffect(() => {
    if (!supabaseActif || !userId) return
    const t = setTimeout(() => {
      supabase.from('progression').upsert({ user_id: userId, ...versSupabase(etat), updated_at: new Date().toISOString() })
    }, 800)
    return () => clearTimeout(t)
  }, [etat, userId])

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgressCtx() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgressCtx doit être utilisé dans un ProgressProvider')
  return ctx
}
