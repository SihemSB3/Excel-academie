import { createContext, useContext } from 'react'
import { useProgress } from './useProgress'

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const value = useProgress()
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgressCtx() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgressCtx doit être utilisé dans un ProgressProvider')
  return ctx
}
