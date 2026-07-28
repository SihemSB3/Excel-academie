-- Créer un client : une organisation, un groupe et son formateur.
-- À exécuter dans Supabase (SQL Editor) quand un client signe.
--
-- AVANT de lancer ce script :
--   1. Créer le compte du formateur dans Supabase, menu Authentication > Users >
--      Add user (email + mot de passe provisoire, cocher "Auto Confirm User").
--   2. Remplacer les quatre valeurs ci-dessous.
--   3. Exécuter, puis transmettre au formateur ses identifiants et le lien
--      d'invitation affiché à la fin.

do $$
declare
  -- ------------------------------------------------------- à personnaliser
  v_organisation text := 'ESC Rive Gauche';
  v_groupe       text := 'Bachelor 2, groupe A';
  v_email_form   text := 'c.rousseau@esc-rive-gauche.fr';
  v_licences     integer := 30;
  -- Restreindre les inscriptions à un domaine d'adresse (NULL = pas de restriction).
  v_domaine      text := null;  -- ex. 'esc-rive-gauche.fr'
  -- -----------------------------------------------------------------------

  v_org_id uuid;
  v_grp_id uuid;
  v_form_id uuid;
  v_code text;
begin
  select id into v_form_id from auth.users where lower(email) = lower(v_email_form);
  if v_form_id is null then
    raise exception 'Compte introuvable pour %. Créez-le d''abord dans Authentication > Users.', v_email_form;
  end if;

  -- Code d'invitation : lisible, sans caractères ambigus (ni O/0 ni I/1).
  v_code := upper(
    regexp_replace(left(v_organisation, 3), '[^a-zA-Z]', '', 'g') || '-' ||
    substr(translate(encode(gen_random_bytes(6), 'base64'), '+/=OI01l', 'ABCDEFGH'), 1, 6)
  );

  insert into public.organisations (nom) values (v_organisation) returning id into v_org_id;

  insert into public.groupes (organisation_id, nom, code, licences, domaine_email)
  values (v_org_id, v_groupe, v_code, v_licences, v_domaine)
  returning id into v_grp_id;

  insert into public.membres (groupe_id, user_id, role)
  values (v_grp_id, v_form_id, 'formateur');

  raise notice '--------------------------------------------------';
  raise notice 'Client créé : % / %', v_organisation, v_groupe;
  raise notice 'Formateur   : %', v_email_form;
  raise notice 'Licences    : %', v_licences;
  raise notice 'Lien à transmettre au formateur :';
  raise notice '  https://lartdudigital.fr/?groupe=%', v_code;
  raise notice '--------------------------------------------------';
end $$;
