-- Full backup - 2026-03-06 02:00:00
-- Les Copeaux association, production database.

DROP TABLE IF EXISTS order_lines, orders, customers CASCADE;

CREATE TABLE customers (
  id     SERIAL PRIMARY KEY,
  name   TEXT NOT NULL,
  email  TEXT NOT NULL UNIQUE
);

CREATE TABLE orders (
  id           SERIAL PRIMARY KEY,
  customer_id  INTEGER NOT NULL REFERENCES customers (id),
  reference    TEXT NOT NULL UNIQUE,
  total_cents  INTEGER NOT NULL,
  placed_at    TIMESTAMP NOT NULL
);

CREATE TABLE order_lines (
  id          SERIAL PRIMARY KEY,
  order_id    INTEGER NOT NULL REFERENCES orders (id),
  label       TEXT NOT NULL,
  quantity    INTEGER NOT NULL,
  price_cents INTEGER NOT NULL
);

INSERT INTO customers (id, name, email) VALUES
  (1, 'Camille Rousseau', 'camille@example.org'),
  (2, 'Malik Benali', 'malik@example.org'),
  (3, 'Sofia Marchetti', 'sofia@example.org'),
  (4, 'Bruno Mercier', 'bruno@example.org');
SELECT setval('customers_id_seq', 4);

INSERT INTO orders (id, customer_id, reference, total_cents, placed_at) VALUES
  (1, 1, 'CMD-2026-0001', 12500, '2026-03-02 10:15:00'),
  (2, 2, 'CMD-2026-0002',  3400, '2026-03-03 14:02:00'),
  (3, 1, 'CMD-2026-0003', 28900, '2026-03-04 09:47:00'),
  (4, 3, 'CMD-2026-0004',  7600, '2026-03-05 16:30:00'),
  (5, 4, 'CMD-2026-0005', 15200, '2026-03-05 18:05:00');
SELECT setval('orders_id_seq', 5);

INSERT INTO order_lines (order_id, label, quantity, price_cents) VALUES
  (1, 'Oak board 2m', 3, 4166),
  (2, 'Stainless screws x100', 1, 3400),
  (3, 'Walnut worktop', 2, 14450),
  (4, 'Wood glue 1L', 4, 1900),
  (5, 'Saw blades', 8, 1900);
