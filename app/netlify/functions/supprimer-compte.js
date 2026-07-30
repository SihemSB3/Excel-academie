// Fonction Netlify : suppression définitive du compte par l'utilisateur lui-même.
//
// Droit à l'effacement (RGPD art. 17). Sans cette fonction, la demande passe par
// email et doit être traitée à la main sous un mois, avec charge de la preuve.
//
// Ordre des opérations, important :
//   1. vérifier le jeton, donc l'identité du demandeur
//   2. résilier l'abonnement Stripe s'il y en a un
//   3. supprimer le compte
//
// L'étape 2 n'est pas un détail : supprimer le compte sans résilier laisserait
// les prélèvements mensuels continuer sur une carte, pour un service auquel la
// personne n'a plus accès. C'est le pire scénario possible pour la réputation.
//
// La suppression du compte efface automatiquement progression, profil et
// rattachements aux groupes : toutes les tables référencent auth.users avec
// « on delete cascade ».
//
// Ce qui reste, et c'est légal : les factures chez Stripe, conservées 10 ans au
// titre des obligations comptables (article L123-22 du Code de commerce). Cette
// obligation prime sur le droit à l'effacement, et c'est annoncé à l'écran.
//
// Variables d'environnement Netlify nécessaires :
//   SUPABASE_URL, SUPABASE_ANON_KEY (ou VITE_SUPABASE_ANON_KEY),
//   SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const SB_URL = process.env.SUPABASE_URL
const SB_ANON = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY

// Résilie immédiatement les abonnements en cours du client. Sans effet s'il n'y
// en a pas. On n'interrompt jamais la suppression pour un échec ici : le compte
// doit disparaître même si Stripe est momentanément indisponible, quitte à
// traiter la résiliation à la main ensuite.
async function resilierAbonnements(customerId) {
  if (!customerId) return { resilies: 0, erreur: null }
  try {
    const abos = await stripe.subscriptions.list({ customer: customerId, status: 'active', limit: 100 })
    for (const a of abos.data) await stripe.subscriptions.cancel(a.id)
    return { resilies: abos.data.length, erreur: null }
  } catch (e) {
    return { resilies: 0, erreur: e.message }
  }
}

export default async (req) => {
  if (req.method !== 'POST') return new Response('Méthode non autorisée', { status: 405 })

  try {
    const { token } = await req.json()
    if (!token) return new Response('Non authentifié', { status: 401 })

    // Qui demande la suppression ? On le déduit du jeton, jamais d'un
    // identifiant envoyé par le navigateur.
    const rUser = await fetch(`${SB_URL}/auth/v1/user`, {
      headers: { apikey: SB_ANON, Authorization: `Bearer ${token}` },
    })
    if (!rUser.ok) return new Response('Session expirée, reconnecte-toi.', { status: 401 })
    const { id: userId } = await rUser.json()
    if (!userId) return new Response('Compte introuvable', { status: 401 })

    // Identifiant client Stripe, lu avec le jeton de l'utilisateur (RLS).
    const rProfil = await fetch(`${SB_URL}/rest/v1/profils?select=stripe_customer_id`, {
      headers: { apikey: SB_ANON, Authorization: `Bearer ${token}` },
    })
    const profils = rProfil.ok ? await rProfil.json() : []
    const { erreur: erreurStripe } = await resilierAbonnements(profils?.[0]?.stripe_customer_id)

    // Suppression définitive. Seule la clé de service peut le faire.
    const rDelete = await fetch(`${SB_URL}/auth/v1/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { apikey: SB_SERVICE, Authorization: `Bearer ${SB_SERVICE}` },
    })
    if (!rDelete.ok) {
      return new Response(`La suppression n'a pas abouti : ${await rDelete.text()}`, { status: 500 })
    }

    // erreurStripe non nul = compte bien supprimé, mais un abonnement peut
    // subsister côté Stripe et devra être résilié à la main.
    return Response.json({ ok: true, avertissementStripe: erreurStripe })
  } catch (e) {
    return new Response(`Erreur : ${e.message}`, { status: 500 })
  }
}
