-- Incremental backup - 2026-03-08 02:00:00 (delta since 2026-03-06)
INSERT INTO customers (id, name, email) VALUES
  (5, 'Ana Kowalski', 'ana@example.org');
SELECT setval('customers_id_seq', 5);

INSERT INTO orders (id, customer_id, reference, total_cents, placed_at) VALUES
  (6, 5, 'CMD-2026-0006',  9800, '2026-03-06 11:20:00'),
  (7, 2, 'CMD-2026-0007', 22300, '2026-03-07 15:45:00');
SELECT setval('orders_id_seq', 7);

INSERT INTO order_lines (order_id, label, quantity, price_cents) VALUES
  (6, 'Sandpaper grit 120', 20, 490),
  (7, 'Folding workbench', 1, 22300);
