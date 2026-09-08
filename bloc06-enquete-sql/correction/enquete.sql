-- Bloc 6 - enquete.sql
--
-- Le rendu attendu : les requetes dans l'ordre, un commentaire par etape.
-- Ceci est une reponse possible, publiee apres l'atelier.
--
--   docker compose exec -T db psql -U investigation -d investigation < correction/enquete.sql

-- === 1. Ou etait rangee la scie ? ===
-- On part du lieu, pas du suspect : storage_area donne la porte a surveiller.
SELECT id, name, storage_area FROM tools WHERE name ILIKE '%plunge saw%';
-- => id 1, storage_area « Wood shop »

-- === 2. Qui est entre dans l'atelier bois cette nuit-la ? ===
-- La jointure se fait sur le BADGE, pas sur l'id : c'est le badge qui
--    apparait dans badge_events. 4 candidats.
SELECT m.name, e.occurred_at
  FROM badge_events e
  JOIN members m ON m.badge = e.badge
 WHERE e.door = 'Wood shop' AND e.direction = 'in'
   AND e.occurred_at BETWEEN '2026-03-12 22:00' AND '2026-03-13 06:00'
 ORDER BY e.occurred_at;

-- === 3. Qui n'a aucun emprunt declare cette nuit-la ? ===
-- NOT EXISTS elimine ceux qui ont declare un emprunt. Restent 2 personnes.
SELECT DISTINCT m.name
  FROM badge_events e
  JOIN members m ON m.badge = e.badge
 WHERE e.door = 'Wood shop' AND e.direction = 'in'
   AND e.occurred_at BETWEEN '2026-03-12 22:00' AND '2026-03-13 06:00'
   AND NOT EXISTS (
     SELECT 1 FROM tool_loans l
      WHERE l.member_id = m.id
        AND l.borrowed_at BETWEEN '2026-03-12 22:00' AND '2026-03-13 06:00');

-- === 4a. Les temoignages ===
-- Ana decrit quelqu'un avec un grand sac de sport rouge vers 1h30 :
--     elle temoigne, donc elle n'est pas la coupable.
SELECT m.name, s.content FROM statements s JOIN members m ON m.id = s.member_id;

-- === 4b. A qui appartient ce sac rouge ? ===
-- Le registre des casiers repond.
SELECT m.name FROM lockers l JOIN members m ON m.id = l.member_id
 WHERE l.declared_contents ILIKE '%red sports bag%';
-- => Bruno Mercier

-- === 5. La confirmation ===
-- La porte de service n'est utilisee qu'une fois dans tout le jeu de
--    donnees - et Sofia signale qu'elle ne se verrouille plus.
SELECT m.name, e.occurred_at FROM badge_events e JOIN members m ON m.badge = e.badge
 WHERE e.door = 'Service door';
-- => Bruno Mercier, 2026-03-13 01:47
