import { useEffect, useState } from 'react'
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
import EspaceFormateur from './components/EspaceFormateur'
import Rejoindre from './components/Rejoindre'
import SuiviGroupe from './components/SuiviGroupe'
import Premium from './components/Premium'
import { codeDepuisUrl, nettoyerUrl, chargerMesGroupes, chargerStatutPremium } from './lib/groupes'
import { estChapitreGratuit } from './data/chapitres'
import { LECONS_FONCTIONS } from './data/lecons-fonctions'

const CLE_ONBOARD = 'excel-dojo-onboarded'

// Espace formateur de démonstration, ouvert par l'URL ?formateur=demo.
// Sert uniquement aux rendez-vous commerciaux : données fictives, aucun compte
// requis, aucun impact sur le parcours des apprenants.
const demoFormateurDemandee = () => {
  try {
    return new URLSearchParams(window.location.search).get('formateur') === 'demo'
  } catch {
    return false
  }
}

// Aperçu du verrou freemium en local (Supabase endormi) : ?apercu=verrou force
// l'état « non abonné » pour voir le paywall et les cadenas sans base ni compte.
// Sans effet en production, où l'accès vient du vrai statut premium.
const apercuVerrouDemande = () => {
  try {
    return new URLSearchParams(window.location.search).get('apercu') === 'verrou'
  } catch {
    return false
  }
}

export default function App() {
  const { session, chargement } = useAuth()
  const [demoFormateur, setDemoFormateur] = useState(demoFormateurDemandee)
  // Lien d'invitation d'un formateur : …/?groupe=ESC-B2A-7F3K
  const [codeGroupe, setCodeGroupe] = useState(codeDepuisUrl)
  // Groupe encadré par l'utilisateur, s'il est formateur. undefined = pas encore su.
  const [groupeEncadre, setGroupeEncadre] = useState(undefined)
  const [voirCommeApprenant, setVoirCommeApprenant] = useState(false)
  const apercuVerrou = apercuVerrouDemande()
  // Accès complet au contenu premium. En local/démo tout est ouvert (sauf aperçu
  // forcé). En production : abonné premium, ou membre d'un groupe école/entreprise.
  const [acces, setAcces] = useState(() => (supabaseActif ? undefined : !apercuVerrou))

  const userId = session?.user?.id
  useEffect(() => {
    // Local/démo : Supabase endormi, on n'interroge rien et tout est ouvert.
    if (!supabaseActif) {
      setGroupeEncadre(null)
      setAcces(!apercuVerrou)
      return
    }
    if (!userId) {
      setGroupeEncadre(null)
      setAcces(false)
      return
    }
    let annule = false
    Promise.all([chargerMesGroupes(), chargerStatutPremium(userId)]).then(([groupes, premium]) => {
      if (annule) return
      setGroupeEncadre(groupes.find((g) => g.role === 'formateur') || null)
      setAcces(Boolean(premium) || groupes.length > 0)
    })
    return () => {
      annule = true
    }
  }, [userId, apercuVerrou])
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
  // Verrou freemium : un chapitre payant ou une leçon « accès direct » renvoie
  // vers l'écran d'abonnement tant que l'utilisateur n'a pas l'accès complet.
  const ouvrirChapitre = (n, moduleInitial = null) => {
    if (acces === false && !estChapitreGratuit(n)) return setVue({ ecran: 'premium' })
    setVue({ ecran: 'chapitre', chapitre: n, moduleInitial })
  }
  // La section « accès direct » n'ouvre que des fonctions avancées, toutes premium.
  const ouvrirDemo = (f) => {
    if (acces === false) return setVue({ ecran: 'premium' })
    setVue({ ecran: 'demo', fonction: f })
  }
  const ouvrirPremium = () => setVue({ ecran: 'premium' })
  // Lance le paiement Stripe : la fonction Netlify crée la session et renvoie
  // l'URL de Checkout, vers laquelle on redirige.
  const lancerPaiement = async (plan) => {
    const user = session?.user
    if (!user) return ouvrirConnexion()
    const reponse = await fetch('/.netlify/functions/creer-paiement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, userId: user.id, email: user.email }),
    })
    if (!reponse.ok) throw new Error(await reponse.text())
    const { url } = await reponse.json()
    if (!url) throw new Error('URL de paiement manquante')
    window.location.href = url
  }
  const ouvrirObjectifs = () => setVue({ ecran: 'objectifs' })
  const ouvrirConnexion = () => setVue({ ecran: 'connexion' })
  const retourDojo = () => setVue({ ecran: 'dashboard' })

  if (demoFormateur) {
    return (
      <EspaceFormateur
        onQuitter={() => {
          setDemoFormateur(false)
          try {
            window.history.replaceState(null, '', window.location.pathname)
          } catch {
            /* historique indisponible */
          }
        }}
      />
    )
  }

  // Le rattachement passe avant tout le reste : l'apprenant arrive par ce lien,
  // il doit voir son établissement et sa promo avant même l'intro.
  if (codeGroupe) {
    return (
      <Rejoindre
        code={codeGroupe}
        onTermine={() => {
          nettoyerUrl()
          setCodeGroupe(null)
        }}
      />
    )
  }

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

  // Aiguillage selon le rôle : un formateur arrive sur le suivi de son groupe,
  // un apprenant sur le dojo. Le formateur peut basculer pour explorer le parcours.
  if (supabaseActif && groupeEncadre === undefined) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-cream">
        <p className="text-sm text-navy/40">Chargement…</p>
      </div>
    )
  }

  if (groupeEncadre && !voirCommeApprenant) {
    return <SuiviGroupe groupe={groupeEncadre} onQuitter={() => setVoirCommeApprenant(true)} />
  }

  return (
    <ProgressProvider>
      {/* Sur grand écran : barre latérale + grande zone de contenu. Sur mobile : colonne unique. */}
      <div className="flex min-h-screen w-full overflow-x-hidden bg-cream">
        <Sidebar retourDojo={retourDojo} onConnexion={ouvrirConnexion} />
        <main className="flex min-h-screen min-w-0 flex-1 flex-col bg-cream shadow-2xl">
          {vue.ecran === 'dashboard' && <Dashboard onOuvrirChapitre={ouvrirChapitre} onOuvrirDemo={ouvrirDemo} onOuvrirObjectifs={ouvrirObjectifs} onOuvrirConnexion={ouvrirConnexion} onOuvrirPremium={ouvrirPremium} acces={acces} />}
          {vue.ecran === 'chapitre' && <ChapterFlow chapitre={vue.chapitre} moduleInitial={vue.moduleInitial} onQuitter={retourDojo} />}
          {vue.ecran === 'demo' && <LeconNarree lecon={LECONS_FONCTIONS[vue.fonction]} onQuitter={retourDojo} />}
          {vue.ecran === 'objectifs' && <ObjectifsSmart onTerminer={retourDojo} />}
          {vue.ecran === 'premium' && <Premium onRetour={retourDojo} onChoisir={supabaseActif ? lancerPaiement : undefined} />}
          {vue.ecran === 'connexion' && <Auth onRetour={retourDojo} onConnecte={retourDojo} />}
        </main>
        <SifuChat />
        {/* Le formateur explore le parcours : on lui laisse un retour visible. */}
        {groupeEncadre && voirCommeApprenant && (
          <button
            onClick={() => setVoirCommeApprenant(false)}
            className="fixed bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-cream shadow-lg transition hover:bg-navy-deep"
          >
            Retour au suivi de mon groupe
          </button>
        )}
      </div>
    </ProgressProvider>
  )
}
