-- Bloc 5 - le schéma durci
--
-- Une réponse possible. Rejoue-le autant de fois que tu veux : les DROP en
-- tête repartent d'une base propre.
--
--   docker compose exec -T db psql -U club -d club < correction/03-schema-durci.sql
--   docker compose exec -T db psql -U club -d club < db/02-donnees-pourries.sql
--
-- Attendu : 20 erreurs, 10 lignes en base.

DROP TABLE IF EXISTS members CASCADE;
CREATE TABLE members (
  id         SERIAL PRIMARY KEY,
  full_name  TEXT NOT NULL CHECK (length(trim(full_name)) > 0),
  email      TEXT NOT NULL UNIQUE CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone      TEXT,
  joined_on  DATE NOT NULL
);

DROP TABLE IF EXISTS workshops CASCADE;
CREATE TABLE workshops (
  id        SERIAL PRIMARY KEY,
  title     TEXT    NOT NULL CHECK (length(trim(title)) > 0),
  hosted_by INTEGER NOT NULL REFERENCES members (id),
  price     NUMERIC(6,2) NOT NULL CHECK (price >= 0),
  seats     INTEGER NOT NULL CHECK (seats > 0)
);

DROP TABLE IF EXISTS membership_fees CASCADE;
CREATE TABLE membership_fees (
  id         SERIAL PRIMARY KEY,
  member_id  INTEGER NOT NULL REFERENCES members (id),
  amount     NUMERIC(6,2) NOT NULL CHECK (amount > 0),
  paid_on    DATE NOT NULL,
  method     TEXT NOT NULL CHECK (method IN ('card', 'cheque', 'cash', 'transfer'))
);

DROP TABLE IF EXISTS attendances CASCADE;
CREATE TABLE attendances (
  id          SERIAL PRIMARY KEY,
  member_id   INTEGER NOT NULL REFERENCES members (id),
  workshop_id INTEGER NOT NULL REFERENCES workshops (id),
  attended    BOOLEAN NOT NULL,
  UNIQUE (member_id, workshop_id)
);
