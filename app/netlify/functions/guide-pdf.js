// Fonction Netlify : délivre le guide PDF d'un chapitre, après vérification.
//
// Avant : les 13 liens Google Drive étaient écrits en clair dans le fichier
// JavaScript téléchargé par tout visiteur. N'importe qui pouvait récupérer les
// 13 guides sans compte ni paiement, et chaque téléchargement transmettait
// l'adresse IP de l'utilisateur à Google.
//
// Maintenant : les PDF vivent dans un bucket Supabase Storage PRIVÉ. Cette
// fonction vérifie qui demande quoi, puis génère un lien signé valable 60
// secondes. Aucun lien permanent n'existe côté navigateur.
//
// Règle d'accès (la même que pour les chapitres) :
//   chapitres 1 et 2 -> tout compte connecté
//   chapitres 3 à 13 -> abonnement premium, ou membre d'un groupe B2B
//
// Variables d'environnement Netlify nécessaires :
//   SUPABASE_URL, SUPABASE_ANON_KEY (ou VITE_SUPABASE_ANON_KEY), SUPABASE_SERVICE_ROLE_KEY

const SB_URL = process.env.SUPABASE_URL
const SB_ANON = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY

const CHAPITRES_GRATUITS = [1, 2]
const VALIDITE_LIEN_SECONDES = 60

// Lecture faite avec le jeton de l'utilisateur : les règles de sécurité de la
// base (RLS) ne lui renvoient que ses propres lignes. On ne fait donc jamais
// confiance à un identifiant qui viendrait du navigateur.
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

  // Pas d'abonnement individuel : l'accès peut venir d'un groupe école ou entreprise.
  const membres = await lireAvecSonJeton(token, 'membres?select=groupe_id&limit=1')
  return Array.isArray(membres) && membres.length > 0
}

export default async (req) => {
  if (req.method !== 'POST') return new Response('Méthode non autorisée', { status: 405 })

  try {
    const { token, chapitre } = await req.json()
    if (!token) return new Response('Non authentifié', { status: 401 })

    const n = Number(chapitre)
    if (!Number.isInteger(n) || n < 1 || n > 13) return new Response('Chapitre inconnu', { status: 400 })

    // Le jeton est-il valide, et à qui appartient-il ?
    const rUser = await fetch(`${SB_URL}/auth/v1/user`, {
      headers: { apikey: SB_ANON, Authorization: `Bearer ${token}` },
    })
    if (!rUser.ok) return new Response('Session expirée, reconnecte-toi.', { status: 401 })

    if (!CHAPITRES_GRATUITS.includes(n) && !(await aUnAccesComplet(token))) {
      return new Response('Ce guide fait partie du contenu premium.', { status: 403 })
    }

    // Lien signé, généré côté serveur avec la clé de service. Il expire vite :
    // même partagé, il ne sert à personne une minute plus tard.
    const rSign = await fetch(`${SB_URL}/storage/v1/object/sign/guides/chapitre-${n}.pdf`, {
      method: 'POST',
      headers: {
        apikey: SB_SERVICE,
        Authorization: `Bearer ${SB_SERVICE}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expiresIn: VALIDITE_LIEN_SECONDES }),
    })
    if (!rSign.ok) {
      return new Response("Ce guide n'est pas disponible pour le moment.", { status: 404 })
    }

    // L'API renvoie un chemin relatif, on le complète en URL absolue.
    const { signedURL } = await rSign.json()
    return Response.json({ url: `${SB_URL}/storage/v1${signedURL}` })
  } catch (e) {
    return new Response(`Erreur : ${e.message}`, { status: 500 })
  }
}
