-- Incremental backup - 2026-03-10 02:00:00 (delta since 2026-03-08)
INSERT INTO customers (id, name, email) VALUES
  (6, 'Youssef Amrani', 'youssef@example.org');
SELECT setval('customers_id_seq', 6);

INSERT INTO orders (id, customer_id, reference, total_cents, placed_at) VALUES
  (8, 6, 'CMD-2026-0008', 5400, '2026-03-08 09:12:00'),
  (9, 1, 'CMD-2026-0009', 31200, '2026-03-09 17:33:00');
SELECT setval('orders_id_seq', 9);

INSERT INTO order_lines (order_id, label, quantity, price_cents) VALUES
  (8, 'Wood drill bit set', 2, 2700),
  (9, 'Electric planer', 1, 31200);
