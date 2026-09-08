-- Incremental backup - 2026-03-13 02:00:00 (delta since 2026-03-12)
INSERT INTO customers (id, name, email) VALUES
  (8, 'Hugo Pereira', 'hugo@example.org');
SELECT setval('customers_id_seq', 8);

INSERT INTO orders (id, customer_id, reference, total_cents, placed_at) VALUES
  (12, 8, 'CMD-2026-0012', 6300, '2026-03-12 08:40:00'),
  (13, 5, 'CMD-2026-0013', 19900, '2026-03-12 19:15:00');
SELECT setval('orders_id_seq', 13);

INSERT INTO order_lines (order_id, label, quantity, price_cents) VALUES
  (12, 'Clamps x4', 1, 6300),
  (13, 'Orbital sander', 1, 19900);
