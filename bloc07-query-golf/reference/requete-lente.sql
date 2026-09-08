-- reference/requete-lente.sql - NE PAS MODIFIER.
-- C'est l'« avant » : le point de comparaison de tout l'atelier.
-- Travaillez dans ma-solution/ma-requete.sql, qui en est une copie.
--
-- Monthly report: average, minimum and maximum per sensor
-- for the trustworthy readings of the first quarter of 2025.
--
-- This query reads the whole table. Make it fast,
-- WITHOUT changing a single line of its result.

SELECT
  s.name,
  s.area,
  count(*)                        AS reading_count,
  round(avg(r.value), 3)          AS average,
  round(min(r.value), 3)          AS minimum,
  round(max(r.value), 3)          AS maximum
FROM readings r
JOIN sensors s ON s.id = r.sensor_id
WHERE date_trunc('day', r.recorded_at) >= DATE '2025-01-01'
  AND date_trunc('day', r.recorded_at) <  DATE '2025-04-01'
  AND upper(r.quality) = 'OK'
GROUP BY s.name, s.area
ORDER BY s.name;
