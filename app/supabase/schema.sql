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
