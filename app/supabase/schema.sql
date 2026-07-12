-- Excel Dojo — schéma de la base de données
-- À coller dans Supabase : menu "SQL Editor" > New query > coller > Run.
-- Crée une ligne de progression par utilisateur, reliée à son compte (auth.users).

create table if not exists public.progression (
  user_id uuid primary key references auth.users on delete cascade,
  xp integer not null default 0,
  ceintures text[] not null default '{}',
  ecrans_valides jsonb not null default '{}'::jsonb,
  chapitres_termines integer[] not null default '{}',
  journal jsonb not null default '{}'::jsonb,
  streak jsonb not null default '{"jour": null, "serie": 0}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Sécurité (Row Level Security) : chacun ne lit et ne modifie QUE sa propre progression.
alter table public.progression enable row level security;

create policy "lecture de sa progression"
  on public.progression for select
  using (auth.uid() = user_id);

create policy "creation de sa progression"
  on public.progression for insert
  with check (auth.uid() = user_id);

create policy "mise a jour de sa progression"
  on public.progression for update
  using (auth.uid() = user_id);

-- À chaque inscription, on crée automatiquement une ligne de progression vide.
create or replace function public.creer_progression()
returns trigger language plpgsql security definer as $$
begin
  insert into public.progression (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.creer_progression();

-- Empêche de marquer un chapitre "terminé" en sautant des chapitres, même via
-- un appel direct à l'API Supabase (contourne les vérifications côté client).
-- Un chapitre ne peut être ajouté à chapitres_termines que s'il suit immédiatement
-- le plus grand chapitre déjà marqué terminé (ou si c'est le chapitre 1).
create or replace function public.verifier_ordre_chapitres()
returns trigger language plpgsql as $$
declare
  max_nouveau integer;
  max_ancien integer;
begin
  select coalesce(max(v), 0) into max_nouveau from unnest(new.chapitres_termines) as v;

  if tg_op = 'INSERT' then
    max_ancien := 0;
  else
    select coalesce(max(v), 0) into max_ancien from unnest(old.chapitres_termines) as v;
  end if;

  if max_nouveau > max_ancien + 1 then
    raise exception 'Chapitres a terminer dans l''ordre (tentative de valider % alors que % etait le dernier termine)', max_nouveau, max_ancien;
  end if;

  return new;
end; $$;

drop trigger if exists on_progression_ordre_chapitres on public.progression;
create trigger on_progression_ordre_chapitres
  before insert or update on public.progression
  for each row execute function public.verifier_ordre_chapitres();
