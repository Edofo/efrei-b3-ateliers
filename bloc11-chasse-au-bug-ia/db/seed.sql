-- Demo data.

INSERT INTO renters (full_name, email) VALUES
  ('Camille Rousseau', 'camille.rousseau@example.org'),
  ('Malik Benali',     'malik.benali@example.org'),
  ('Sofia Marchetti',  'sofia.marchetti@example.org');

INSERT INTO items (label, reference, daily_rate_cents, available) VALUES
  ('Hammer drill',        'DRIL-001', 1200, TRUE),
  ('Random orbit sander', 'SAND-014', 900,  TRUE),
  ('Rolling scaffold',    'SCAF-002', 4500, FALSE),
  ('Pressure washer',     'WASH-007', 2600, TRUE);

-- Ongoing rental over an ordinary weekend.
INSERT INTO rentals (renter_id, item_id, start_date, expected_return_date, discount_percent)
VALUES (1, 3, DATE '2026-09-11', DATE '2026-09-14', 0);

-- Spring rental: the site runs over four full days.
INSERT INTO rentals (renter_id, item_id, start_date, expected_return_date, discount_percent)
VALUES (2, 1, DATE '2027-03-26', DATE '2027-03-30', 10);

-- Already settled, kept for history.
INSERT INTO rentals (renter_id, item_id, start_date, expected_return_date, discount_percent, returned_at, total_cents)
VALUES (3, 2, DATE '2026-08-03', DATE '2026-08-06', 0, DATE '2026-08-06', 2700);

INSERT INTO payments (rental_id, amount_cents) VALUES (3, 2700);
