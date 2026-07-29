// Fonction Netlify : ouvre le portail client Stripe (Billing Portal), où
// l'abonné peut voir, mettre à jour ou résilier son abonnement lui-même.
//
// Sécurité : on ne fait PAS confiance à un identifiant client envoyé par le
// navigateur. On lit le profil avec le token de l'utilisateur (RLS = sa propre
// ligne), on en tire son stripe_customer_id, et on ouvre SON portail à lui.
//
// Prérequis Stripe : activer le portail client (Réglages > Facturation >
// Portail client) et y autoriser l'annulation d'abonnement.

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const SB_URL = process.env.SUPABASE_URL
const SB_ANON = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

export default async (req) => {
  if (req.method !== 'POST') return new Response('Méthode non autorisée', { status: 405 })

  try {
    const { token } = await req.json()
    if (!token) return new Response('Non authentifié', { status: 401 })

    // Profil de l'utilisateur, lu avec SON jeton : RLS ne renvoie que sa ligne.
    const r = await fetch(`${SB_URL}/rest/v1/profils?select=stripe_customer_id`, {
      headers: { apikey: SB_ANON, Authorization: `Bearer ${token}` },
    })
    const rows = await r.json()
    const customerId = rows?.[0]?.stripe_customer_id
    if (!customerId) return new Response("Aucun abonnement à gérer sur ce compte.", { status: 400 })

    const site = process.env.SITE_URL || new URL(req.url).origin
    const portail = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: site })
    return Response.json({ url: portail.url })
  } catch (e) {
    return new Response(`Erreur d'ouverture du portail : ${e.message}`, { status: 500 })
  }
}
