-- Votre schéma. Durcissez-le colonne par colonne jusqu'à ce que
-- 02-donnees-pourries.sql échoue sur les 20 lignes aberrantes, et seulement
-- sur celles-là.
--
-- Gardez les quatre DROP : le schéma nu est recréé au démarrage du conteneur,
-- et ils vous permettent de rejouer ce fichier autant de fois que nécessaire.

DROP TABLE IF EXISTS attendances CASCADE;
DROP TABLE IF EXISTS membership_fees CASCADE;
DROP TABLE IF EXISTS workshops CASCADE;
DROP TABLE IF EXISTS members CASCADE;

CREATE TABLE members (
  id           TEXT,
  full_name    TEXT,
  email        TEXT,
  phone        TEXT,
  joined_on    TEXT
);

CREATE TABLE workshops (
  id          TEXT,
  title       TEXT,
  hosted_by   TEXT,
  price       TEXT,
  seats       TEXT
);

CREATE TABLE membership_fees (
  id          TEXT,
  member_id   TEXT,
  amount      TEXT,
  paid_on     TEXT,
  method      TEXT
);

CREATE TABLE attendances (
  id           TEXT,
  member_id    TEXT,
  workshop_id  TEXT,
  attended     TEXT
);
