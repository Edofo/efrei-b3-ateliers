CREATE TABLE workshops (
  id        SERIAL PRIMARY KEY,
  title     TEXT        NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  capacity  INTEGER     NOT NULL
);

CREATE TABLE participants (
  id     SERIAL PRIMARY KEY,
  name   TEXT NOT NULL,
  email  TEXT NOT NULL UNIQUE
);

CREATE TABLE registrations (
  id             SERIAL PRIMARY KEY,
  workshop_id    INTEGER NOT NULL REFERENCES workshops (id),
  participant_id INTEGER NOT NULL REFERENCES participants (id),
  registered_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  cancelled      BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO workshops (title, starts_at, capacity) VALUES
  ('Woodturning basics',   now() + interval '10 days',  8),
  ('Arc welding',          now() + interval '3 days',   4),
  ('Japanese bookbinding', now() + interval '12 hours', 6),
  ('3D printing',          now() + interval '30 days', 12);

INSERT INTO participants (name, email) VALUES
  ('Camille Rousseau', 'camille@example.org'),
  ('Malik Benali',     'malik@example.org'),
  ('Sofia Marchetti',  'sofia@example.org'),
  ('Tomás Ferreira',   'tomas@example.org');

INSERT INTO registrations (workshop_id, participant_id) VALUES
  (1, 1), (1, 2), (2, 1), (2, 2), (2, 3), (2, 4);
