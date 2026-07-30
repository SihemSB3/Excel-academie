-- CORRECTIF — mettre les guides PDF à l'abri.
-- Supabase > SQL Editor > New query > coller > Run. À passer une seule fois.
--
-- Problème corrigé : les 13 guides étaient sur Google Drive, en liens publics
-- écrits en clair dans le fichier JavaScript téléchargé par tout visiteur.
-- N'importe qui pouvait les récupérer sans compte ni paiement, et chaque
-- téléchargement transmettait l'adresse IP de l'utilisateur à Google.
--
-- Après ce correctif, les PDF vivent dans un espace de stockage PRIVÉ. Seule la
-- fonction serveur guide-pdf.js peut en générer un lien, valable 60 secondes,
-- et seulement après avoir vérifié le compte et l'abonnement.

-- Espace de stockage privé (public = false : aucun accès direct par URL).
insert into storage.buckets (id, name, public)
values ('guides', 'guides', false)
on conflict (id) do update set public = false;

-- Aucune règle d'accès n'est créée volontairement : sans règle, ni un visiteur
-- ni un utilisateur connecté ne peut lire le contenu. Seule la clé de service,
-- détenue par le serveur et jamais exposée au navigateur, y accède.

-- Vérification : doit renvoyer une ligne avec public = false.
select id, name, public from storage.buckets where id = 'guides';
