-- La Méthode Excel — groupes, formateurs et suivi
-- À coller dans Supabase : SQL Editor > New query > coller > Run.
-- Complète schema.sql (qui crée la table progression). Ne le remplace pas.
--
-- Ce que ça met en place :
--   profils        : prénom, nom et rôle de chaque compte
--   organisations  : le client (une école, une entreprise, un organisme)
--   groupes        : une promo ou une équipe, avec son code d'invitation et ses licences
--   membres        : qui appartient à quel groupe, et avec quel rôle
--   jalons         : le rythme attendu (date + nombre de chapitres)
-- Plus les règles de sécurité : un formateur ne lit QUE les données de ses groupes.

-- ------------------------------------------------- résultats des quiz
-- Meilleur score par quiz, en pourcentage. Sans cette colonne, le tableau de
-- bord du formateur ne peut pas afficher de moyenne aux quiz.
alter table public.progression add column if not exists quiz jsonb not null default '{}'::jsonb;

-- ---------------------------------------------------------------- profils

create table if not exists public.profils (
  user_id uuid primary key references auth.users on delete cascade,
  prenom text not null default '',
  nom text not null default '',
  -- Abonnement particulier (B2C). L'accès complet est accordé si premium_a_vie,
  -- ou si premium_jusqu_au est dans le futur, ou (géré ailleurs) si l'utilisateur
  -- est membre d'un groupe B2B actif.
  premium_a_vie boolean not null default false,
  premium_jusqu_au date,
  -- Rempli par le webhook Stripe pour relier le compte à son client Stripe.
  stripe_customer_id text,
  cree_le timestamptz not null default now()
);

-- Pour les bases déjà installées avant l'ajout du premium (sans effet si déjà présent).
alter table public.profils add column if not exists premium_a_vie boolean not null default false;
alter table public.profils add column if not exists premium_jusqu_au date;
alter table public.profils add column if not exists stripe_customer_id text;

alter table public.profils enable row level security;

create policy "lecture de son profil" on public.profils
  for select using (auth.uid() = user_id);
create policy "creation de son profil" on public.profils
  for insert with check (auth.uid() = user_id);
create policy "mise a jour de son profil" on public.profils
  for update using (auth.uid() = user_id);

-- Sécurité : un utilisateur ne peut écrire QUE son prénom et son nom. Les champs
-- premium (premium_a_vie, premium_jusqu_au, stripe_customer_id) ne sont modifiables
-- que côté serveur (service_role, via le webhook Stripe), jamais depuis le navigateur.
-- Sans ça, n'importe qui pourrait se donner l'accès premium en une requête.
revoke insert, update on public.profils from authenticated;
grant insert (user_id, prenom, nom) on public.profils to authenticated;
grant update (prenom, nom) on public.profils to authenticated;

-- Le prénom et le nom sont saisis à l'inscription et transmis dans les métadonnées
-- du compte. On les recopie ici pour pouvoir les afficher au formateur.
create or replace function public.creer_profil()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profils (user_id, prenom, nom)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'prenom', ''),
    coalesce(new.raw_user_meta_data ->> 'nom', '')
  )
  on conflict (user_id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created_profil on auth.users;
create trigger on_auth_user_created_profil
  after insert on auth.users
  for each row execute function public.creer_profil();

-- --------------------------------------------------- organisations et groupes

create table if not exists public.organisations (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  cree_le timestamptz not null default now()
);

create table if not exists public.groupes (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations on delete cascade,
  nom text not null,
  -- Code d'invitation : c'est la fin de l'URL de rattachement.
  code text not null unique,
  licences integer not null default 10 check (licences > 0),
  -- Si renseigné, seules les adresses de ce domaine peuvent rejoindre (ex. 'esc-rive-gauche.fr').
  domaine_email text,
  -- Abonnement : la formule vendue et la période de 12 mois.
  formule text check (formule in ('decouverte', 'equipe', 'etablissement', 'partenaire')),
  date_debut date not null default current_date,
  -- Échéance indicative : sert à relancer à J-30. C'est "actif" qui coupe l'accès, pas cette date.
  date_fin date,
  actif boolean not null default true,
  cree_le timestamptz not null default now()
);

-- Pour les bases déjà installées avant l'ajout de l'abonnement (sans effet si déjà présent).
alter table public.groupes add column if not exists formule text check (formule in ('decouverte', 'equipe', 'etablissement', 'partenaire'));
alter table public.groupes add column if not exists date_debut date not null default current_date;
alter table public.groupes add column if not exists date_fin date;

create table if not exists public.membres (
  groupe_id uuid not null references public.groupes on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  role text not null default 'apprenant' check (role in ('apprenant', 'formateur')),
  rejoint_le timestamptz not null default now(),
  primary key (groupe_id, user_id)
);

create index if not exists membres_user_idx on public.membres (user_id);

create table if not exists public.jalons (
  id uuid primary key default gen_random_uuid(),
  groupe_id uuid not null references public.groupes on delete cascade,
  date date not null,
  chapitres integer not null check (chapitres between 0 and 13)
);

create index if not exists jalons_groupe_idx on public.jalons (groupe_id);

-- ------------------------------------------------------- fonctions d'appui
-- En SECURITY DEFINER : une politique de sécurité qui interrogerait `membres`
-- directement provoquerait une récursion infinie.

create or replace function public.mes_groupes()
returns setof uuid language sql security definer stable set search_path = public as $$
  select groupe_id from public.membres where user_id = auth.uid()
$$;

create or replace function public.mes_groupes_formateur()
returns setof uuid language sql security definer stable set search_path = public as $$
  select groupe_id from public.membres where user_id = auth.uid() and role = 'formateur'
$$;

-- ------------------------------------------------------------- sécurité RLS

alter table public.organisations enable row level security;
alter table public.groupes enable row level security;
alter table public.membres enable row level security;
alter table public.jalons enable row level security;

-- Groupes : visibles par leurs membres, modifiables par leurs formateurs.
create policy "lecture de ses groupes" on public.groupes
  for select using (id in (select public.mes_groupes()));
create policy "le formateur modifie son groupe" on public.groupes
  for update using (id in (select public.mes_groupes_formateur()));

create policy "lecture de son organisation" on public.organisations
  for select using (
    id in (select organisation_id from public.groupes where id in (select public.mes_groupes()))
  );

-- Membres : un apprenant ne voit que sa propre ligne, un formateur voit tout son groupe.
create policy "lecture des membres de ses groupes" on public.membres
  for select using (
    user_id = auth.uid() or groupe_id in (select public.mes_groupes_formateur())
  );
create policy "le formateur retire un membre" on public.membres
  for delete using (groupe_id in (select public.mes_groupes_formateur()));

-- Jalons : lus par tous les membres, écrits par le formateur seul.
create policy "lecture des jalons de ses groupes" on public.jalons
  for select using (groupe_id in (select public.mes_groupes()));
create policy "le formateur gere les jalons" on public.jalons
  for all using (groupe_id in (select public.mes_groupes_formateur()))
  with check (groupe_id in (select public.mes_groupes_formateur()));

-- Progression : en plus de la lecture de sa propre ligne (schema.sql), un
-- formateur lit celle des membres de ses groupes. Jamais celle des autres.
drop policy if exists "lecture des progressions de ses groupes" on public.progression;
create policy "lecture des progressions de ses groupes" on public.progression
  for select using (
    user_id in (
      select m.user_id from public.membres m
      where m.groupe_id in (select public.mes_groupes_formateur())
    )
  );

-- Profils : même principe, le formateur a besoin des noms pour son tableau de bord.
drop policy if exists "lecture des profils de ses groupes" on public.profils;
create policy "lecture des profils de ses groupes" on public.profils
  for select using (
    user_id in (
      select m.user_id from public.membres m
      where m.groupe_id in (select public.mes_groupes_formateur())
    )
  );

-- --------------------------------------------------------- rejoindre un groupe

-- Aperçu avant confirmation : renvoie le nom du groupe et de l'organisation à
-- partir du code, sans rien modifier. Sert à l'écran « Vous rejoignez … ».
create or replace function public.apercu_groupe(code_saisi text)
returns table (groupe_nom text, organisation_nom text, complet boolean)
language sql security definer stable set search_path = public as $$
  select g.nom,
         o.nom,
         (select count(*) from public.membres m where m.groupe_id = g.id and m.role = 'apprenant') >= g.licences
  from public.groupes g
  join public.organisations o on o.id = g.organisation_id
  where g.code = upper(trim(code_saisi)) and g.actif
$$;

-- Rattachement effectif. Vérifie l'existence du groupe, le nombre de licences
-- restantes et, si le groupe l'impose, le domaine de l'adresse email.
create or replace function public.rejoindre_groupe(code_saisi text)
returns text language plpgsql security definer set search_path = public as $$
declare
  g public.groupes%rowtype;
  inscrits integer;
  email_utilisateur text;
begin
  if auth.uid() is null then
    return 'non_connecte';
  end if;

  select * into g from public.groupes where code = upper(trim(code_saisi)) and actif;
  if not found then
    return 'code_inconnu';
  end if;

  if exists (select 1 from public.membres where groupe_id = g.id and user_id = auth.uid()) then
    return 'deja_membre';
  end if;

  select count(*) into inscrits
  from public.membres where groupe_id = g.id and role = 'apprenant';
  if inscrits >= g.licences then
    return 'licences_epuisees';
  end if;

  if g.domaine_email is not null then
    select email into email_utilisateur from auth.users where id = auth.uid();
    if lower(email_utilisateur) not like '%@' || lower(g.domaine_email) then
      return 'domaine_refuse';
    end if;
  end if;

  insert into public.membres (groupe_id, user_id, role) values (g.id, auth.uid(), 'apprenant');
  return 'ok';
end; $$;

revoke all on function public.rejoindre_groupe(text) from public;
grant execute on function public.rejoindre_groupe(text) to authenticated;
grant execute on function public.apercu_groupe(text) to authenticated, anon;
