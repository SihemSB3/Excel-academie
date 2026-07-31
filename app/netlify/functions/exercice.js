// Fonction Netlify : délivre le lien Google Sheets d'un exercice, après
// vérification de l'accès. Même principe que guide-pdf : les liens ne sont plus
// dans le bundle client (voir _exercices.js), ils vivent côté serveur.
//
// Règle d'accès :
//   exercices des chapitres 1-2 -> tout compte connecté (freemium)
//   les autres                  -> abonnement premium, ou membre d'un groupe B2B
//
// Variables Netlify : SUPABASE_URL, SUPABASE_ANON_KEY (ou VITE_SUPABASE_ANON_KEY).

import { EXERCICES, EX_GRATUITS } from './_exercices.js'

const SB_URL = process.env.SUPABASE_URL
const SB_ANON = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

// Lecture faite avec le jeton de l'utilisateur : la sécurité RLS ne renvoie que
// ses propres lignes. On ne fait jamais confiance à un identifiant du navigateur.
const lireAvecSonJeton = async (token, chemin) => {
  const r = await fetch(`${SB_URL}/rest/v1/${chemin}`, {
    headers: { apikey: SB_ANON, Authorization: `Bearer ${token}` },
  })
  if (!r.ok) return null
  return r.json()
}

const aUnAccesComplet = async (token) => {
  const profils = await lireAvecSonJeton(token, 'profils?select=premium_a_vie,premium_jusqu_au')
  const p = profils?.[0]
  if (p?.premium_a_vie) return true
  const aujourdhui = new Date().toISOString().slice(0, 10)
  if (p?.premium_jusqu_au && p.premium_jusqu_au >= aujourdhui) return true
  const membres = await lireAvecSonJeton(token, 'membres?select=groupe_id&limit=1')
  return Array.isArray(membres) && membres.length > 0
}

export default async (req) => {
  if (req.method !== 'POST') return new Response('Méthode non autorisée', { status: 405 })

  try {
    const { token, ex } = await req.json()
    if (!token) return new Response('Non authentifié', { status: 401 })

    const url = EXERCICES[ex]
    if (!url) return new Response('Exercice inconnu', { status: 404 })

    // Le jeton est-il valide ?
    const rUser = await fetch(`${SB_URL}/auth/v1/user`, {
      headers: { apikey: SB_ANON, Authorization: `Bearer ${token}` },
    })
    if (!rUser.ok) return new Response('Session expirée, reconnecte-toi.', { status: 401 })

    if (!EX_GRATUITS.has(ex) && !(await aUnAccesComplet(token))) {
      return new Response('Cet exercice fait partie du contenu premium.', { status: 403 })
    }

    return Response.json({ url })
  } catch (e) {
    return new Response(`Erreur : ${e.message}`, { status: 500 })
  }
}
