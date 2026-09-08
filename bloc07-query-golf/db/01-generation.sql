CREATE TABLE sensors (
  id    SERIAL PRIMARY KEY,
  name  TEXT NOT NULL,
  area  TEXT NOT NULL,
  unit  TEXT NOT NULL
);

CREATE TABLE readings (
  id           BIGSERIAL PRIMARY KEY,
  sensor_id    INTEGER      NOT NULL REFERENCES sensors (id),
  recorded_at  TIMESTAMPTZ  NOT NULL,
  value        NUMERIC(8,3) NOT NULL,
  quality      TEXT         NOT NULL
);

INSERT INTO sensors (name, area, unit) VALUES
  ('Wood shop temperature',  'Wood shop',  '°C'),
  ('Wood shop humidity',     'Wood shop',  '%'),
  ('Metal shop temperature', 'Metal shop', '°C'),
  ('Particulate matter',     'Wood shop',  'µg/m³'),
  ('Power consumption',      'Building',   'kWh'),
  ('Noise level',            'Metal shop', 'dB'),
  ('Fablab temperature',     'Fablab',     '°C'),
  ('Fablab CO2',             'Fablab',     'ppm');

-- 4 000 000 relevés, un toutes les 40 secondes, d'aout 2021 a aout 2026.
-- Le trimestre demande par le rapport (Q1 2025) ne represente que ~5 %
-- des lignes : c'est tout l'interet d'aller les chercher par un index
-- plutot que de relire la table entiere.
INSERT INTO readings (sensor_id, recorded_at, value, quality)
SELECT
  1 + (i % 8),
  TIMESTAMPTZ '2021-08-01 00:00:00' + i * INTERVAL '40 seconds',
  CASE 1 + (i % 8)
    WHEN 1 THEN 18 + 6 * sin(i / 900.0)
    WHEN 2 THEN 45 + 15 * sin(i / 1300.0)
    WHEN 3 THEN 16 + 8 * sin(i / 800.0)
    WHEN 4 THEN 12 + 10 * abs(sin(i / 400.0))
    WHEN 5 THEN 3 + 2 * abs(sin(i / 250.0))
    WHEN 6 THEN 55 + 25 * abs(sin(i / 180.0))
    WHEN 7 THEN 19 + 4 * sin(i / 1100.0)
    ELSE 420 + 380 * abs(sin(i / 600.0))
  END,
  CASE WHEN i % 997 = 0 THEN 'suspect' ELSE 'ok' END
FROM generate_series(1, 4000000) AS i;

-- VACUUM et pas seulement ANALYZE : il renseigne la visibility map, sans
-- laquelle PostgreSQL ne peut jamais choisir un Index Only Scan.
VACUUM ANALYZE readings;
VACUUM ANALYZE sensors;
