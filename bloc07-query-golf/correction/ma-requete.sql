-- Bloc 7 - la requete reecrite
--
-- Seul le WHERE a change. Plus aucune fonction appliquee aux colonnes
-- filtrees : le predicat redevient sargable, donc indexable.
--
--   date_trunc('day', r.recorded_at) >= DATE '2025-01-01'  ->  r.recorded_at >= DATE '2025-01-01'
--   date_trunc('day', r.recorded_at) <  DATE '2025-04-01'  ->  r.recorded_at <  DATE '2025-04-01'
--   upper(r.quality) = 'OK'                                ->  r.quality = 'ok'
--
-- Les alias de colonnes sont inchanges : c'est sur eux que porte l'empreinte.

SELECT
  s.name,
  s.area,
  count(*)                        AS reading_count,
  round(avg(r.value), 3)          AS average,
  round(min(r.value), 3)          AS minimum,
  round(max(r.value), 3)          AS maximum
FROM readings r
JOIN sensors s ON s.id = r.sensor_id
WHERE r.recorded_at >= DATE '2025-01-01'
  AND r.recorded_at <  DATE '2025-04-01'
  AND r.quality = 'ok'
GROUP BY s.name, s.area
ORDER BY s.name;
