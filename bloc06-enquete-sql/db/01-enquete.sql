CREATE TABLE members (
  id     SERIAL PRIMARY KEY,
  name   TEXT NOT NULL,
  email  TEXT NOT NULL UNIQUE,
  badge  TEXT NOT NULL UNIQUE
);

CREATE TABLE tools (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  value_eur    NUMERIC(8,2) NOT NULL,
  storage_area TEXT NOT NULL
);

CREATE TABLE badge_events (
  id          SERIAL PRIMARY KEY,
  badge       TEXT NOT NULL REFERENCES members (badge),
  door        TEXT NOT NULL,
  occurred_at TIMESTAMP NOT NULL,
  direction   TEXT NOT NULL CHECK (direction IN ('in', 'out'))
);

CREATE TABLE tool_loans (
  id           SERIAL PRIMARY KEY,
  tool_id      INTEGER NOT NULL REFERENCES tools (id),
  member_id    INTEGER NOT NULL REFERENCES members (id),
  borrowed_at  TIMESTAMP NOT NULL,
  returned_at  TIMESTAMP
);

CREATE TABLE statements (
  id           SERIAL PRIMARY KEY,
  member_id    INTEGER NOT NULL REFERENCES members (id),
  collected_on DATE NOT NULL,
  content      TEXT NOT NULL
);

CREATE TABLE lockers (
  id                SERIAL PRIMARY KEY,
  member_id         INTEGER NOT NULL REFERENCES members (id),
  number            INTEGER NOT NULL,
  declared_contents TEXT
);

INSERT INTO members (name, email, badge) VALUES
  ('Camille Rousseau', 'camille@lescopeaux.org', 'B-1001'),
  ('Malik Benali',     'malik@lescopeaux.org',   'B-1002'),
  ('Sofia Marchetti',  'sofia@lescopeaux.org',   'B-1003'),
  ('Bruno Mercier',    'bruno@lescopeaux.org',   'B-1004'),
  ('Ana Kowalski',     'ana@lescopeaux.org',     'B-1005'),
  ('Youssef Amrani',   'youssef@lescopeaux.org', 'B-1006'),
  ('Léa Vasseur',      'lea@lescopeaux.org',     'B-1007'),
  ('Hugo Pereira',     'hugo@lescopeaux.org',    'B-1008');

INSERT INTO tools (name, value_eur, storage_area) VALUES
  ('Festool plunge saw', 720.00, 'Wood shop'),
  ('Router',             340.00, 'Wood shop'),
  ('Welding station',    890.00, 'Metal shop'),
  ('3D printer',        1250.00, 'Fablab'),
  ('Belt sander',        210.00, 'Wood shop');

-- Badge events for the night of 12 to 13 March 2026, plus surrounding days.
INSERT INTO badge_events (badge, door, occurred_at, direction) VALUES
  ('B-1001', 'Main entrance', '2026-03-12 18:02', 'in'),
  ('B-1001', 'Wood shop',     '2026-03-12 18:10', 'in'),
  ('B-1001', 'Wood shop',     '2026-03-12 20:45', 'out'),
  ('B-1001', 'Main entrance', '2026-03-12 20:52', 'out'),
  ('B-1007', 'Main entrance', '2026-03-12 19:30', 'in'),
  ('B-1007', 'Wood shop',     '2026-03-12 22:15', 'in'),
  ('B-1007', 'Wood shop',     '2026-03-12 23:02', 'out'),
  ('B-1007', 'Main entrance', '2026-03-12 23:10', 'out'),
  ('B-1002', 'Main entrance', '2026-03-12 21:40', 'in'),
  ('B-1002', 'Wood shop',     '2026-03-12 22:30', 'in'),
  ('B-1002', 'Wood shop',     '2026-03-13 00:15', 'out'),
  ('B-1002', 'Main entrance', '2026-03-13 00:22', 'out'),
  ('B-1005', 'Main entrance', '2026-03-12 23:50', 'in'),
  ('B-1005', 'Wood shop',     '2026-03-13 01:20', 'in'),
  ('B-1005', 'Wood shop',     '2026-03-13 01:35', 'out'),
  ('B-1005', 'Main entrance', '2026-03-13 02:05', 'out'),
  ('B-1004', 'Main entrance', '2026-03-13 00:58', 'in'),
  ('B-1004', 'Wood shop',     '2026-03-13 01:12', 'in'),
  ('B-1004', 'Wood shop',     '2026-03-13 01:44', 'out'),
  ('B-1004', 'Service door',  '2026-03-13 01:47', 'out'),
  ('B-1003', 'Main entrance', '2026-03-13 09:10', 'in'),
  ('B-1003', 'Fablab',        '2026-03-13 09:20', 'in'),
  ('B-1006', 'Main entrance', '2026-03-13 10:00', 'in'),
  ('B-1008', 'Main entrance', '2026-03-11 14:00', 'in'),
  ('B-1008', 'Wood shop',     '2026-03-11 14:15', 'in'),
  ('B-1008', 'Wood shop',     '2026-03-11 17:40', 'out');

-- Declared tool loans
INSERT INTO tool_loans (tool_id, member_id, borrowed_at, returned_at) VALUES
  (1, 1, '2026-03-12 18:15', '2026-03-12 20:40'),
  (2, 2, '2026-03-12 22:35', '2026-03-13 00:10'),
  (5, 7, '2026-03-12 22:20', '2026-03-12 23:00'),
  (3, 6, '2026-03-10 15:00', '2026-03-10 18:00'),
  (1, 8, '2026-03-11 14:20', '2026-03-11 17:30');

INSERT INTO statements (member_id, collected_on, content) VALUES
  (5, '2026-03-13', 'I came back for my things around half past one in the morning. I passed someone in the corridor carrying a large red sports bag, they seemed in a hurry.'),
  (2, '2026-03-13', 'I left around a quarter past midnight, everything was in order in the wood shop. The saw was on its rack.'),
  (7, '2026-03-13', 'I noticed nothing unusual, I left around eleven in the evening.'),
  (1, '2026-03-13', 'I returned the plunge saw before leaving, as always. The register confirms it.'),
  (3, '2026-03-14', 'I heard the service door has been latching badly lately, it does not always lock.');

INSERT INTO lockers (member_id, number, declared_contents) VALUES
  (1, 12, 'apron, gloves, safety glasses'),
  (2, 7,  'personal tool box'),
  (3, 3,  'bookbinding supplies'),
  (4, 21, 'large red sports bag, ear defenders'),
  (5, 15, 'lab coat, sketchbook'),
  (6, 9,  'welding overalls'),
  (7, 4,  'black backpack, thermos'),
  (8, 18, 'brown leather satchel');
