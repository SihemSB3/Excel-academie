import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseActif } from '../lib/supabase'

const AuthContext = createContext(null)

// Suit la session Supabase (connecté/déconnecté). Reste neutre tant que les
// clés Supabase ne sont pas renseignées (voir supabaseActif).
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [chargement, setChargement] = useState(true)
  // Vrai quand l'utilisateur revient d'un lien « mot de passe oublié » : il faut
  // alors lui faire choisir un nouveau mot de passe avant tout le reste.
  const [recuperation, setRecuperation] = useState(false)

  useEffect(() => {
    if (!supabaseActif) {
      setChargement(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChargement(false)
    })
    const { data: ecoute } = supabase.auth.onAuthStateChange((evenement, s) => {
      setSession(s)
      if (evenement === 'PASSWORD_RECOVERY') setRecuperation(true)
    })
    return () => ecoute.subscription.unsubscribe()
  }, [])

  const value = {
    session,
    utilisateur: session?.user ?? null,
    chargement,
    recuperation,
    terminerRecuperation: () => setRecuperation(false),
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider')
  return ctx
}
