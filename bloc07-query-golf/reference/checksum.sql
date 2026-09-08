-- reference/checksum.sql - l'empreinte du résultat, à la main.
-- `./verifier.sh` fait exactement ça pour vous, sur les deux requêtes.
-- Ce fichier est là pour que vous voyiez le mécanisme, pas pour être joué.
--
--   docker compose exec -T db psql -U golf -d golf < reference/checksum.sql
--
-- Le principe : on enveloppe la requête dans une CTE `result`, on recolle
-- toutes les lignes en une seule chaîne triée, et on en prend le md5.
-- Une virgule qui bouge, un capteur qui manque, un arrondi différent :
-- le md5 change du tout au tout.
--
-- Empreinte attendue : 85db24eb3a239c5dfb195fa6f2d94e3f
--
-- Pour tester VOTRE version, remplacez le corps de la CTE `result`.

WITH result AS (
  SELECT
    s.name,
    s.area,
    count(*)               AS reading_count,
    round(avg(r.value), 3) AS average,
    round(min(r.value), 3) AS minimum,
    round(max(r.value), 3) AS maximum
  FROM readings r
  JOIN sensors s ON s.id = r.sensor_id
  WHERE date_trunc('day', r.recorded_at) >= DATE '2025-01-01'
    AND date_trunc('day', r.recorded_at) <  DATE '2025-04-01'
    AND upper(r.quality) = 'OK'
  GROUP BY s.name, s.area
)
SELECT md5(string_agg(
         name || '|' || area || '|' || reading_count || '|' ||
         average || '|' || minimum || '|' || maximum,
         E'\n' ORDER BY name)) AS fingerprint
  FROM result;
