// Fonction Netlify : crée une session Stripe Checkout pour l'abonnement à l'app.
// Appelée par l'écran Premium avec { plan: 'vie' | 'mois', userId, email }.
// Renvoie l'URL de paiement Stripe, vers laquelle l'app redirige l'utilisateur.
//
// Variables d'environnement Netlify nécessaires :
//   STRIPE_SECRET_KEY   la clé secrète Stripe (sk_live_… ou sk_test_…)
//   SITE_URL            l'adresse publique de l'app (pour le retour après paiement)
//   STRIPE_PRICE_VIE    (optionnel) l'ID du tarif 129 € à vie, sinon valeur par défaut
//   STRIPE_PRICE_MOIS   (optionnel) l'ID du tarif 19,90 €/mois, sinon valeur par défaut

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Le tarif à vie est un paiement unique ; le mensuel est un abonnement récurrent.
const PLANS = {
  vie: { price: process.env.STRIPE_PRICE_VIE || 'price_1TyVzGLzM0RNdUkG9BH9aiSL', mode: 'payment' },
  mois: { price: process.env.STRIPE_PRICE_MOIS || 'price_1TyVzGLzM0RNdUkGslPZWE86', mode: 'subscription' },
}

export default async (req) => {
  if (req.method !== 'POST') return new Response('Méthode non autorisée', { status: 405 })

  try {
    const { plan, userId, email } = await req.json()
    const config = PLANS[plan]
    if (!config) return new Response('Plan inconnu', { status: 400 })
    if (!userId) return new Response('Utilisateur manquant', { status: 400 })

    const site = process.env.SITE_URL || new URL(req.url).origin

    const session = await stripe.checkout.sessions.create({
      mode: config.mode,
      line_items: [{ price: config.price, quantity: 1 }],
      // Sert à retrouver le compte à débloquer côté webhook.
      client_reference_id: userId,
      customer_email: email || undefined,
      allow_promotion_codes: true,
      // user_id porté aussi par le paiement/abonnement : indispensable pour
      // retrouver le compte lors d'un remboursement (charge.refunded).
      metadata: { user_id: userId },
      ...(config.mode === 'payment'
        ? { payment_intent_data: { metadata: { user_id: userId } } }
        : { subscription_data: { metadata: { user_id: userId } } }),
      success_url: `${site}/?paiement=ok`,
      cancel_url: `${site}/?paiement=annule`,
    })

    return Response.json({ url: session.url })
  } catch (e) {
    return new Response(`Erreur de création du paiement : ${e.message}`, { status: 500 })
  }
}
