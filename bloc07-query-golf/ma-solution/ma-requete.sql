-- ma-solution/ma-requete.sql
-- VOTRE COPIE DE TRAVAIL. C'est ce fichier que ./verifier.sh mesure.
--
-- Regles du jeu :
--   * une seule requete SELECT dans ce fichier ;
--   * gardez exactement les memes alias de colonnes
--     (name, area, reading_count, average, minimum, maximum) :
--     c'est sur eux que l'empreinte est calculee ;
--   * les CREATE INDEX vont dans mon-index.sql, a cote, pas ici.
--
-- Au depart, c'est la copie conforme de reference/requete-lente.sql.
-- A vous de jouer.

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
