-- Schema of the equipment rental workshop.

DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS rentals;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS renters;

CREATE TABLE renters (
  id          SERIAL PRIMARY KEY,
  full_name   TEXT        NOT NULL,
  email       TEXT        NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE items (
  id                SERIAL PRIMARY KEY,
  label             TEXT    NOT NULL,
  reference         TEXT    NOT NULL UNIQUE,
  daily_rate_cents  INTEGER NOT NULL CHECK (daily_rate_cents > 0),
  available         BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE rentals (
  id                    SERIAL PRIMARY KEY,
  renter_id             INTEGER NOT NULL REFERENCES renters (id),
  item_id               INTEGER NOT NULL REFERENCES items (id),
  start_date            DATE    NOT NULL,
  expected_return_date  DATE    NOT NULL,
  discount_percent      INTEGER NOT NULL DEFAULT 0,
  returned_at           DATE,
  total_cents           INTEGER,
  CHECK (expected_return_date >= start_date)
);

CREATE TABLE payments (
  id            SERIAL PRIMARY KEY,
  rental_id     INTEGER     NOT NULL REFERENCES rentals (id),
  amount_cents  INTEGER     NOT NULL CHECK (amount_cents > 0),
  paid_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rentals_renter ON rentals (renter_id);
CREATE INDEX idx_rentals_item ON rentals (item_id);
