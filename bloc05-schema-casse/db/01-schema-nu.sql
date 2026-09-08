CREATE TABLE members (
  id           TEXT,
  full_name    TEXT,
  email        TEXT,
  phone        TEXT,
  joined_on    TEXT
);

CREATE TABLE workshops (
  id          TEXT,
  title       TEXT,
  hosted_by   TEXT,
  price       TEXT,
  seats       TEXT
);

CREATE TABLE membership_fees (
  id          TEXT,
  member_id   TEXT,
  amount      TEXT,
  paid_on     TEXT,
  method      TEXT
);

CREATE TABLE attendances (
  id           TEXT,
  member_id    TEXT,
  workshop_id  TEXT,
  attended     TEXT
);
