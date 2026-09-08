-- Bloc 6 - la requete unique (palier Or)
--
-- Le meme raisonnement, d'un seul tenant : chaque CTE est une etape de
-- l'enquete, et la jointure finale ne garde que qui satisfait les trois
-- conditions a la fois.
--
--   docker compose exec -T db psql -U investigation -d investigation < correction/requete-unique.sql

WITH saw AS (
  SELECT id, storage_area FROM tools WHERE name ILIKE '%plunge saw%'
),
present AS (
  SELECT DISTINCT m.id, m.name
    FROM badge_events e
    JOIN members m ON m.badge = e.badge
    JOIN saw s ON s.storage_area = e.door
   WHERE e.direction = 'in'
     AND e.occurred_at BETWEEN '2026-03-12 22:00' AND '2026-03-13 06:00'
),
without_loan AS (
  SELECT p.* FROM present p
   WHERE NOT EXISTS (
     SELECT 1 FROM tool_loans l
      WHERE l.member_id = p.id
        AND l.borrowed_at BETWEEN '2026-03-12 22:00' AND '2026-03-13 06:00')
),
red_bag AS (
  SELECT member_id FROM lockers WHERE declared_contents ILIKE '%red sports bag%'
),
quiet_exit AS (
  SELECT m.id FROM badge_events e JOIN members m ON m.badge = e.badge
   WHERE e.door = 'Service door'
     AND e.occurred_at BETWEEN '2026-03-12 22:00' AND '2026-03-13 06:00'
)
SELECT w.name AS culprit
  FROM without_loan w
  JOIN red_bag r ON r.member_id = w.id
  JOIN quiet_exit q ON q.id = w.id;
