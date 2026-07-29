# Brancher le paiement Stripe (à faire une fois)

Deux fonctions serveur gèrent le paiement :
- `functions/creer-paiement.js` : crée la session de paiement au clic sur « Choisir ».
- `functions/webhook-stripe.js` : débloque l'accès premium du compte après paiement.

Rien ne fonctionne tant que les variables ci-dessous ne sont pas réglées dans Netlify.

---

## 1. Variables d'environnement Netlify

Netlify : **Site settings > Environment variables > Add a variable**. À régler :

| Variable | Valeur | Secret ? |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://mrllrnqixxbweskanqda.supabase.co` | non |
| `VITE_SUPABASE_ANON_KEY` | la clé anon (Supabase > Settings > API > `anon public`) | non (publique) |
| `SUPABASE_URL` | `https://mrllrnqixxbweskanqda.supabase.co` | non |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Settings > API > `service_role` | **OUI, secret** |
| `STRIPE_SECRET_KEY` | Stripe > Développeurs > Clés API > clé **secrète** (`sk_…`) | **OUI, secret** |
| `STRIPE_WEBHOOK_SECRET` | fourni à l'étape 2 (`whsec_…`) | **OUI, secret** |
| `SITE_URL` | l'adresse publique de l'app (ex. `https://excelacademie.netlify.app`) | non |

> Les Price IDs (129 € à vie, 19,90 €/mois) sont déjà dans le code. Pour les
> surcharger (ex. passer en mode test), ajouter `STRIPE_PRICE_VIE` et
> `STRIPE_PRICE_MOIS`.

⚠️ `SUPABASE_SERVICE_ROLE_KEY` et `STRIPE_SECRET_KEY` sont **secrètes** : elles ne
vont QUE dans Netlify, jamais dans le code, jamais dans le navigateur, jamais dans un chat.

---

## 2. Créer le webhook dans Stripe

1. Stripe > **Développeurs > Webhooks > Ajouter un endpoint**.
2. URL : `https://<ton-app>/.netlify/functions/webhook-stripe`
3. Événements à envoyer :
   - `checkout.session.completed`
   - `invoice.paid`
   - `customer.subscription.deleted`
   - `charge.refunded` (retire l'accès premium en cas de remboursement)
4. Valider, puis copier le **secret de signature** (`whsec_…`) et le coller dans
   la variable Netlify `STRIPE_WEBHOOK_SECRET`.

> ⚠️ Si le webhook existe déjà (test ou live), **ajoute `charge.refunded`** à sa
> liste d'événements, sinon les remboursements ne retireront pas l'accès.

## 2 bis. Activer le portail client (gestion / résiliation de l'abonnement)

L'espace « Mon compte » de l'app laisse l'abonné gérer et résilier son abonnement
via le portail Stripe. Il faut l'activer une fois :

1. Stripe > **Réglages > Facturation > Portail client**.
2. **Activer** le portail, et autoriser l'**annulation des abonnements**.
3. À faire séparément en mode **test** et en mode **live**.

(La fonction `portail-client.js` réutilise `VITE_SUPABASE_ANON_KEY`, déjà réglée ;
rien de plus à ajouter côté variables.)

---

## 3. Tester (fortement conseillé : en mode Test d'abord)

En **mode Test** de Stripe : mêmes étapes, mais avec les clés de test (`sk_test_`)
et les Price IDs de test ci-dessous, à mettre dans Netlify :

| Variable | Price ID de test | Tarif |
|---|---|---|
| `STRIPE_PRICE_VIE` | `price_1TyWF2LzM0RNdUkGEBgkbyIU` | 129 € à vie (paiement unique) |
| `STRIPE_PRICE_MOIS` | `price_1TyWFVLzM0RNdUkGR7pLUgd8` | 19,90 €/mois (récurrent) |

(Sans ces deux variables, le code utilise les Price IDs **live** par défaut, qui
ne marchent pas avec une clé secrète de test.)

1. Se connecter à l'app avec un vrai compte.
2. Cliquer sur un chapitre premium → écran d'abonnement → « Choisir ».
3. Payer avec la carte de test `4242 4242 4242 4242`, date future, CVC quelconque.
4. Vérifier dans Supabase (table `profils`) que `premium_a_vie` (à vie) ou
   `premium_jusqu_au` (mensuel) s'est bien rempli pour ce compte.
5. Recharger l'app : le contenu premium est débloqué.

Quand tout marche en test, basculer les clés Netlify en **live** (`sk_live_`,
webhook live, Price IDs live) et refaire un dernier essai avec un vrai paiement.

---

## Rappel sécurité

Avant le premier déploiement réel, **régénérer les jetons** `SUPABASE_ACCESS_TOKEN`
et `GITHUB_TOKEN` (ils sont passés dans une conversation). Voir la note dédiée.
