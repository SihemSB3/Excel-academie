# Procédure : ajouter une école qui signe

Cette procédure sert **à chaque fois qu'un client (école, entreprise, organisme) signe**.
Le schéma de base et la sécurité sont déjà installés une fois pour toutes, tu n'y touches plus.

Tu as deux façons de faire : **la manuelle** (tu fais tout toi-même) ou **demander à Claude** (plus rapide). Les deux donnent le même résultat.

---

## Ce qu'il te faut avant de commencer

- [ ] Le **nom de l'école** (ex. « ESC Rive Gauche »)
- [ ] Le **nom du groupe / de la promo** (ex. « Bachelor 2, groupe A »)
- [ ] L'**email du formateur** qui suivra le groupe
- [ ] Le **nombre de licences** achetées (nombre d'élèves max)
- [ ] Faut-il **restreindre à un domaine email** ? (ex. seules les adresses `@esc-rive-gauche.fr` peuvent rejoindre). Sinon, non.

---

## Étape 1 — Créer le compte du formateur (obligatoire, toujours en premier)

Le script d'ajout de client ne crée **pas** le compte du formateur. Tu dois le faire à la main avant.

1. Va sur supabase.com > projet **ExcelAcademie**
2. Menu de gauche : **Authentication** > **Users** > **Add user**
3. Renseigne l'**email du formateur** + un **mot de passe provisoire**
4. **Coche « Auto Confirm User »** (sinon le compte reste bloqué en attente d'email)
5. Valide

> Si tu oublies cette étape, le script s'arrêtera avec le message :
> « Compte introuvable pour ... Créez-le d'abord dans Authentication > Users. »

---

## Étape 2 — Créer l'organisation, le groupe et rattacher le formateur

### Option A — Manuelle (dans le navigateur)

1. Menu de gauche : **SQL Editor** > **New query**
2. Ouvre `creer-un-client.sql` sur ton Mac, copie tout, colle dans Supabase
3. En haut du script, **remplace les 4 valeurs** entre guillemets :
   - `v_organisation` = nom de l'école
   - `v_groupe` = nom de la promo
   - `v_email_form` = email du formateur (le même qu'à l'étape 1)
   - `v_licences` = nombre de licences
   - `v_domaine` = laisse `null`, ou mets `'domaine.fr'` pour restreindre
4. Clique sur **Run**
5. Regarde les messages en bas : tu verras le **code d'invitation** et le **lien à transmettre**, du type :
   `https://lartdudigital.fr/?groupe=ESC-AB2C3D`

### Option B — Demander à Claude

Dis-moi simplement, en une phrase :
> « Crée un client : école [nom], groupe [nom], formateur [email], [X] licences, domaine [aucun ou domaine.fr] »

Je lance le script via l'API Supabase et je te renvoie le **code** et le **lien d'invitation**.
(Tu dois quand même avoir fait l'étape 1 toi-même, je n'ai pas accès à la création de comptes.)

---

## Étape 3 — Transmettre au formateur

Envoie au formateur :

- [ ] Son **email de connexion** et son **mot de passe provisoire** (étape 1)
- [ ] Le **lien d'invitation** affiché à la fin du script (celui avec `?groupe=...`)
- [ ] Consigne : il partage ce lien à ses élèves pour qu'ils rejoignent le groupe

Les élèves qui ouvrent le lien créent leur compte et rejoignent automatiquement le groupe,
dans la limite des licences. Si le domaine est restreint, seules les bonnes adresses passent.

---

## Points de vigilance

- **Vérifie le domaine du lien.** Le script affiche `lartdudigital.fr`. Si l'app est servie
  sur une autre adresse, adapte le lien avant de l'envoyer.
- **Les licences.** Le compteur bloque les élèves au-delà du nombre acheté. Si l'école en
  reprend, il faudra augmenter `licences` sur le groupe.
- **Un formateur ne voit que ses groupes.** C'est garanti par la sécurité déjà testée.
  Pas besoin de le revérifier à chaque client.
- **Le code d'invitation est unique et sans caractères ambigus** (pas de O/0 ni I/1),
  donc facile à dicter au téléphone si besoin.
