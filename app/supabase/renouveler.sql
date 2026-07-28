-- Renouveler l'abonnement d'un groupe.
-- À exécuter dans Supabase (SQL Editor) quand la facture de renouvellement est payée.
--
-- Il suffit de renseigner le code du groupe et la durée, puis Run.
-- La nouvelle échéance repart de la date de fin actuelle si elle n'est pas encore
-- passée (pas de jours perdus si tu renouvelles en avance), sinon d'aujourd'hui.

do $$
declare
  -- ------------------------------------------------------- à personnaliser
  v_code       text := 'ESC-AB2C3D';  -- le code d'invitation du groupe
  v_duree_mois integer := 12;         -- durée ajoutée
  -- -----------------------------------------------------------------------

  g public.groupes%rowtype;
  v_depart date;
  v_nouvelle_fin date;
begin
  select * into g from public.groupes where code = upper(trim(v_code));
  if not found then
    raise exception 'Aucun groupe avec le code %.', v_code;
  end if;

  v_depart := greatest(coalesce(g.date_fin, current_date), current_date);
  v_nouvelle_fin := v_depart + (v_duree_mois || ' months')::interval;

  update public.groupes
    set date_fin = v_nouvelle_fin,
        actif = true  -- on réactive au cas où il aurait été coupé
  where id = g.id;

  raise notice '--------------------------------------------------';
  raise notice 'Abonnement renouvelé : % / %', (select nom from public.organisations where id = g.organisation_id), g.nom;
  raise notice 'Ancienne échéance : %', coalesce(g.date_fin::text, '(aucune)');
  raise notice 'Nouvelle échéance : %', v_nouvelle_fin;
  raise notice '--------------------------------------------------';
end $$;
