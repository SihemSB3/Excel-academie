-- Test de sécurité : un formateur ne doit JAMAIS voir les apprenants d'un autre.
-- À exécuter dans Supabase (SQL Editor) APRÈS schema.sql et schema-groupes.sql.
--
-- Le principe : on crée deux écoles fictives avec un formateur et un apprenant
-- chacune, puis on se fait passer pour chaque formateur et on vérifie ce qu'il voit.
-- Le script s'arrête avec une erreur explicite au premier problème.
-- Il ne laisse aucune trace : tout est annulé à la fin (rollback).

begin;

do $$
declare
  form_a uuid; eleve_a uuid; form_b uuid; eleve_b uuid;
  org_a uuid; org_b uuid; grp_a uuid; grp_b uuid;
  vus integer;
begin
  -- ---------------------------------------------------------------- montage
  insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  values
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'form.a@test.local', '', now(), now(), now()),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'eleve.a@test.local', '', now(), now(), now()),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'form.b@test.local', '', now(), now(), now()),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'eleve.b@test.local', '', now(), now(), now());

  select id into form_a from auth.users where email = 'form.a@test.local';
  select id into eleve_a from auth.users where email = 'eleve.a@test.local';
  select id into form_b from auth.users where email = 'form.b@test.local';
  select id into eleve_b from auth.users where email = 'eleve.b@test.local';

  insert into public.organisations (nom) values ('École A') returning id into org_a;
  insert into public.organisations (nom) values ('École B') returning id into org_b;

  insert into public.groupes (organisation_id, nom, code, licences)
    values (org_a, 'Promo A', 'TEST-A', 10) returning id into grp_a;
  insert into public.groupes (organisation_id, nom, code, licences)
    values (org_b, 'Promo B', 'TEST-B', 10) returning id into grp_b;

  insert into public.membres (groupe_id, user_id, role) values
    (grp_a, form_a, 'formateur'), (grp_a, eleve_a, 'apprenant'),
    (grp_b, form_b, 'formateur'), (grp_b, eleve_b, 'apprenant');

  -- Chaque élève a une progression (créée par le déclencheur, on la remplit).
  -- On avance chapitre par chapitre : le déclencheur verifier_ordre_chapitres()
  -- interdit de sauter des chapitres, y compris pendant ce montage.
  update public.progression set chapitres_termines = '{1}' where user_id = eleve_a;
  update public.progression set xp = 100, chapitres_termines = '{1,2}' where user_id = eleve_a;
  update public.progression set chapitres_termines = '{1}' where user_id = eleve_b;
  update public.progression set chapitres_termines = '{1,2}' where user_id = eleve_b;
  update public.progression set xp = 500, chapitres_termines = '{1,2,3}' where user_id = eleve_b;

  -- ------------------------------------------------- test 1 : formateur A
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', json_build_object('sub', form_a, 'role', 'authenticated')::text, true);

  select count(*) into vus from public.progression where user_id = eleve_b;
  if vus <> 0 then
    raise exception 'ÉCHEC : le formateur A voit la progression de l''élève de B (% lignes)', vus;
  end if;

  select count(*) into vus from public.progression where user_id = eleve_a;
  if vus <> 1 then
    raise exception 'ÉCHEC : le formateur A ne voit pas son propre élève (% lignes)', vus;
  end if;

  select count(*) into vus from public.membres where groupe_id = grp_b;
  if vus <> 0 then
    raise exception 'ÉCHEC : le formateur A voit les membres du groupe B (% lignes)', vus;
  end if;

  -- ------------------------------------------------- test 2 : formateur B
  perform set_config('request.jwt.claims', json_build_object('sub', form_b, 'role', 'authenticated')::text, true);

  select count(*) into vus from public.progression where user_id = eleve_a;
  if vus <> 0 then
    raise exception 'ÉCHEC : le formateur B voit la progression de l''élève de A (% lignes)', vus;
  end if;

  -- ------------------------------------------------- test 3 : un apprenant
  perform set_config('request.jwt.claims', json_build_object('sub', eleve_a, 'role', 'authenticated')::text, true);

  select count(*) into vus from public.progression where user_id <> eleve_a;
  if vus <> 0 then
    raise exception 'ÉCHEC : un apprenant voit la progression des autres (% lignes)', vus;
  end if;

  -- ------------- test 4 : un apprenant ne peut pas se rattacher en direct
  begin
    insert into public.membres (groupe_id, user_id, role) values (grp_b, eleve_a, 'formateur');
    raise exception 'ÉCHEC : un apprenant a pu s''ajouter au groupe B comme formateur';
  exception
    when insufficient_privilege then null; -- comportement attendu
  end;

  perform set_config('role', 'postgres', true);
  raise notice 'SUCCÈS : les quatre tests de cloisonnement passent.';
end $$;

rollback;
