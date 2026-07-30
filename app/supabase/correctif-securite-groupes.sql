-- CORRECTIF DE SÉCURITÉ — à passer une seule fois sur la base existante.
-- Supabase > SQL Editor > New query > coller > Run.
--
-- Problème corrigé : la politique « le formateur modifie son groupe » dit quelle
-- LIGNE un formateur peut modifier, mais pas quelles COLONNES. Un formateur
-- pouvait donc, depuis la console de son navigateur, s'attribuer des licences
-- illimitées, prolonger son échéance, réactiver un groupe coupé pour impayé,
-- ouvrir son groupe à toutes les adresses email, ou le rattacher à une autre
-- organisation.
--
-- Après ce correctif, un formateur ne peut plus que renommer sa promo.
-- Tout le reste (licences, dates, activation) se pilote côté vendeur.
--
-- Sans effet sur l'application : aucun écran n'écrit dans la table groupes.
-- Ce correctif est déjà intégré à schema-groupes.sql pour les futures installations.

revoke update on public.groupes from authenticated;
grant update (nom) on public.groupes to authenticated;

-- Vérification : la requête ci-dessous doit renvoyer UNE SEULE ligne, « nom ».
-- Si elle en renvoie plusieurs, le revoke n'a pas pris.
select column_name
from information_schema.column_privileges
where grantee = 'authenticated'
  and table_schema = 'public'
  and table_name = 'groupes'
  and privilege_type = 'UPDATE';
