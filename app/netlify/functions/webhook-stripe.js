// Fonction Netlify : webhook Stripe. Débloque l'accès premium d'un compte après
// paiement, et prolonge l'abonnement à chaque renouvellement. C'est le SEUL
// endroit qui écrit les champs premium (les utilisateurs n'y ont pas accès).
//
// À déclarer dans Stripe (Développeurs > Webhooks) sur l'URL :
//   https://<ton-app>/.netlify/functions/webhook-stripe
// Événements à écouter : checkout.session.completed, invoice.paid,
//                        customer.subscription.deleted
//
// Variables d'environnement Netlify nécessaires :
//   STRIPE_SECRET_KEY           clé secrète Stripe
//   STRIPE_WEBHOOK_SECRET       secret de signature du webhook (whsec_…)
//   SUPABASE_URL                https://mrllrnqixxbweskanqda.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY   la clé service_role (secrète, JAMAIS côté navigateur)

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// Date AAAA-MM-JJ à partir d'un timestamp Stripe (secondes).
const dateDe = (ts) => new Date(ts * 1000).toISOString().slice(0, 10)

const majParUser = (userId, champs) => supabase.from('profils').update(champs).eq('user_id', userId)
const majParClient = (customerId, champs) => supabase.from('profils').update(champs).eq('stripe_customer_id', customerId)

export default async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  let event
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (e) {
    return new Response(`Signature invalide : ${e.message}`, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const s = event.data.object
      const userId = s.client_reference_id
      if (userId && s.mode === 'payment') {
        // Achat à vie : accès permanent.
        await majParUser(userId, { premium_a_vie: true, stripe_customer_id: s.customer })
      } else if (userId && s.mode === 'subscription') {
        // Abonnement mensuel : accès jusqu'à la fin de la période payée.
        const sub = await stripe.subscriptions.retrieve(s.subscription)
        await majParUser(userId, {
          premium_jusqu_au: dateDe(sub.current_period_end),
          stripe_customer_id: s.customer,
        })
      }
    } else if (event.type === 'invoice.paid') {
      // Renouvellement mensuel : on repousse l'échéance. On retrouve le compte par
      // le client Stripe enregistré lors du premier paiement.
      const inv = event.data.object
      if (inv.subscription && inv.customer) {
        const sub = await stripe.subscriptions.retrieve(inv.subscription)
        await majParClient(inv.customer, { premium_jusqu_au: dateDe(sub.current_period_end) })
      }
    }
    // customer.subscription.deleted : rien à faire. premium_jusqu_au reflète déjà
    // la date de fin payée ; l'accès s'éteint tout seul à cette date.

    return new Response('ok', { status: 200 })
  } catch (e) {
    return new Response(`Erreur de traitement : ${e.message}`, { status: 500 })
  }
}
