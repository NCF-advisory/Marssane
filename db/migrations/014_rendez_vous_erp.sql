-- Gestion des rendez-vous depuis l'ERP authentifié uniquement.
-- Le rôle applicatif ne peut ni créer un rendez-vous ni modifier son horaire.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'erp_app') then
    grant select (id, nom, email, debut, fin, statut, created_at, annule_at)
      on public.rendez_vous to erp_app;
    grant update (statut, annule_at) on public.rendez_vous to erp_app;
    create policy rendez_vous_erp_lecture on public.rendez_vous
      for select to erp_app using (true);
    create policy rendez_vous_erp_annulation on public.rendez_vous
      for update to erp_app using (statut = 'confirme')
      with check (statut = 'annule' and annule_at is not null);
  end if;
end $$;
