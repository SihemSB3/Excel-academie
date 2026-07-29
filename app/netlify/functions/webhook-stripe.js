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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// On appelle l'API REST de Supabase directement avec fetch, plutôt que la
// librairie @supabase/supabase-js : dans une fonction serverless en Node 20,
// cette librairie plante à l'initialisation (WebSocket temps réel indisponible).
// Un simple fetch est plus léger et suffit largement pour écrire une ligne.
const SB_URL = process.env.SUPABASE_URL
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const sbHeaders = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' }

// Date AAAA-MM-JJ à partir d'un timestamp Stripe (secondes).
const dateDe = (ts) => new Date(ts * 1000).toISOString().slice(0, 10)

// Fin de la période payée. Selon la version de l'API Stripe, la date est portée
// par l'abonnement lui-même ou par sa ligne d'abonnement ; on gère les deux, avec
// un filet de 31 jours si Stripe ne la fournit pas (corrigé au paiement suivant).
const finPeriode = (sub) => {
  const ts = sub?.items?.data?.[0]?.current_period_end ?? sub?.current_period_end
  return dateDe(ts || Math.floor(Date.now() / 1000) + 31 * 86400)
}

// Upsert : crée le profil s'il manque (ex. compte créé avant la table profils),
// sinon fusionne. Écrit par le service_role, seul habilité sur les champs premium.
async function upsertProfil(userId, champs) {
  const r = await fetch(`${SB_URL}/rest/v1/profils`, {
    method: 'POST',
    headers: { ...sbHeaders, Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ user_id: userId, ...champs }),
  })
  if (!r.ok) throw new Error(`Supabase ${r.status} : ${await r.text()}`)
}

// Mise à jour par client Stripe (le profil existe déjà à ce stade).
async function majParClient(customerId, champs) {
  const r = await fetch(`${SB_URL}/rest/v1/profils?stripe_customer_id=eq.${encodeURIComponent(customerId)}`, {
    method: 'PATCH',
    headers: { ...sbHeaders, Prefer: 'return=minimal' },
    body: JSON.stringify(champs),
  })
  if (!r.ok) throw new Error(`Supabase ${r.status} : ${await r.text()}`)
}

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
        await upsertProfil(userId, { premium_a_vie: true, stripe_customer_id: s.customer })
      } else if (userId && s.mode === 'subscription') {
        // Abonnement mensuel : accès jusqu'à la fin de la période payée.
        const sub = await stripe.subscriptions.retrieve(s.subscription)
        await upsertProfil(userId, {
          premium_jusqu_au: finPeriode(sub),
          stripe_customer_id: s.customer,
        })
      }
    } else if (event.type === 'invoice.paid') {
      // Renouvellement mensuel : on repousse l'échéance. On retrouve le compte par
      // le client Stripe enregistré lors du premier paiement.
      const inv = event.data.object
      if (inv.subscription && inv.customer) {
        const sub = await stripe.subscriptions.retrieve(inv.subscription)
        await majParClient(inv.customer, { premium_jusqu_au: finPeriode(sub) })
      }
    } else if (event.type === 'charge.refunded') {
      // Remboursement TOTAL : on retire l'accès premium. On retrouve le compte par
      // l'user_id porté dans les métadonnées du paiement, sinon par le client Stripe.
      const ch = event.data.object
      if (ch.refunded) {
        const retire = { premium_a_vie: false, premium_jusqu_au: null }
        let userId = ch.metadata?.user_id
        if (!userId && ch.payment_intent) {
          const pi = await stripe.paymentIntents.retrieve(ch.payment_intent)
          userId = pi.metadata?.user_id
        }
        if (userId) await upsertProfil(userId, retire)
        else if (ch.customer) await majParClient(ch.customer, retire)
      }
    }
    // customer.subscription.deleted : rien à faire. premium_jusqu_au reflète déjà
    // la date de fin payée ; l'accès s'éteint tout seul à cette date.

    return new Response('ok', { status: 200 })
  } catch (e) {
    return new Response(`Erreur de traitement : ${e.message}`, { status: 500 })
  }
}
