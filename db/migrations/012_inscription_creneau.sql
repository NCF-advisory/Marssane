-- 012_inscription_creneau.sql — Créneau souhaité par le pré-inscrit.
-- Postgres standard uniquement (portabilité Supabase → OVH, CDC §7.4).
-- Migration STRICTEMENT ADDITIVE : une colonne nullable, aucune donnée touchée.

-- Depuis le 03/09/2026, la formation Débutant est proposée sur trois créneaux
-- de deux après-midis (voir lib/creneaux.ts) et la modale de pré-inscription
-- demande lequel est souhaité.
--
-- Le libellé complet est stocké tel quel (« Mardi 15 et jeudi 17 septembre
-- 2026 »), y compris « Sans préférence » quand le prospect n'en a pas : la
-- valeur relue par l'admin est exactement celle qui a été soumise, sans table
-- de correspondance à maintenir ni migration à écrire quand les créneaux
-- changeront. Pas de contrainte CHECK pour la même raison — les libellés sont
-- du contenu, pas un état du domaine.
--
-- NULL = inscription antérieure à ce champ (aucun créneau n'a été demandé) ;
-- la colonne reste donc nullable, le formulaire public l'exigeant de son côté.
alter table inscriptions add column if not exists creneau text;
