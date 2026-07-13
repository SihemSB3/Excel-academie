import { useState } from 'react'
import { ProgressProvider } from './store/ProgressContext'
import { useAuth } from './store/AuthContext'
import { supabaseActif } from './lib/supabase'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ChapterFlow from './components/ChapterFlow'
import LeconNarree from './components/LeconNarree'
import Onboarding from './components/Onboarding'
import SifuChat from './components/SifuChat'
import ObjectifsSmart from './components/ObjectifsSmart'
import Auth from './components/Auth'
import { LECONS_FONCTIONS } from './data/lecons-fonctions'

const CLE_ONBOARD = 'excel-dojo-onboarded'

export default function App() {
  const { session, chargement } = useAuth()
  const [onboarde, setOnboarde] = useState(() => {
    try {
      return localStorage.getItem(CLE_ONBOARD) === '1'
    } catch {
      return true
    }
  })
  const terminerOnboarding = () => {
    try {
      localStorage.setItem(CLE_ONBOARD, '1')
    } catch {
      /* stockage indisponible */
    }
    setOnboarde(true)
  }
  const [vue, setVue] = useState({ ecran: 'dashboard' })
  const ouvrirChapitre = (n, moduleInitial = null) => setVue({ ecran: 'chapitre', chapitre: n, moduleInitial })
  const ouvrirDemo = (f) => setVue({ ecran: 'demo', fonction: f })
  const ouvrirObjectifs = () => setVue({ ecran: 'objectifs' })
  const ouvrirConnexion = () => setVue({ ecran: 'connexion' })
  const retourDojo = () => setVue({ ecran: 'dashboard' })

  if (!onboarde) {
    return (
      <div className="flex min-h-screen w-full overflow-x-hidden bg-cream">
        <Onboarding onTerminer={terminerOnboarding} />
      </div>
    )
  }

  // Compte obligatoire pour tout le contenu (y compris ch.1/2), le temps que
  // le vrai systeme d'abonnement (phase 2) soit branche : impossible d'ouvrir
  // le dojo sans etre connecte, meme via un lien partage.
  if (supabaseActif && chargement) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-cream">
        <p className="text-sm text-navy/40">Chargement…</p>
      </div>
    )
  }

  if (supabaseActif && !session) {
    return (
      <div className="flex min-h-screen w-full overflow-x-hidden bg-cream">
        <Auth onConnecte={() => {}} />
      </div>
    )
  }

  return (
    <ProgressProvider>
      {/* Sur grand écran : barre latérale + grande zone de contenu. Sur mobile : colonne unique. */}
      <div className="flex min-h-screen w-full overflow-x-hidden bg-cream">
        <Sidebar retourDojo={retourDojo} onConnexion={ouvrirConnexion} />
        <main className="flex min-h-screen min-w-0 flex-1 flex-col bg-cream shadow-2xl">
          {vue.ecran === 'dashboard' && <Dashboard onOuvrirChapitre={ouvrirChapitre} onOuvrirDemo={ouvrirDemo} onOuvrirObjectifs={ouvrirObjectifs} onOuvrirConnexion={ouvrirConnexion} />}
          {vue.ecran === 'chapitre' && <ChapterFlow chapitre={vue.chapitre} moduleInitial={vue.moduleInitial} onQuitter={retourDojo} />}
          {vue.ecran === 'demo' && <LeconNarree lecon={LECONS_FONCTIONS[vue.fonction]} onQuitter={retourDojo} />}
          {vue.ecran === 'objectifs' && <ObjectifsSmart onTerminer={retourDojo} />}
          {vue.ecran === 'connexion' && <Auth onRetour={retourDojo} onConnecte={retourDojo} />}
        </main>
        <SifuChat />
      </div>
    </ProgressProvider>
  )
}
