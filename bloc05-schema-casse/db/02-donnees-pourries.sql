-- === Members ===
INSERT INTO members (id, full_name, email, phone, joined_on) VALUES ('1', 'Camille Rousseau', 'camille@example.org', '0612345678', '2025-01-12');
INSERT INTO members (id, full_name, email, phone, joined_on) VALUES ('2', 'Malik Benali', 'malik@example.org', '0698765432', '2025-03-12');
INSERT INTO members (id, full_name, email, phone, joined_on) VALUES ('3', 'Sofia Marchetti', 'sofia@example.org', '0677889900', '2025-02-28');
INSERT INTO members (id, full_name, email, phone, joined_on) VALUES ('4', 'Youssef Amrani', 'youssef@example.org', '0644556677', '2025-04-01');
-- ↓ id already taken
INSERT INTO members (id, full_name, email, phone, joined_on) VALUES ('3', 'Sofia Marchetti', 'sofia.m@example.org', '0677889900', '2025-02-28');
-- ↓ email already used by Camille
INSERT INTO members (id, full_name, email, phone, joined_on) VALUES ('5', 'Tomás Ferreira', 'camille@example.org', '0611223344', '2025-03-04');
-- ↓ empty name and something that is not an email
INSERT INTO members (id, full_name, email, phone, joined_on) VALUES ('6', '', 'not-an-email', '06 55 44 33 22', '2025-04-02');
-- ↓ missing email
INSERT INTO members (id, full_name, email, phone, joined_on) VALUES ('7', 'Ana Kowalski', NULL, '0600000000', '2025-04-03');
-- ↓ impossible date
INSERT INTO members (id, full_name, email, phone, joined_on) VALUES ('8', 'Léa Vasseur', 'lea@example.org', '0611111111', '2025-13-45');
-- ↓ date spelled out
INSERT INTO members (id, full_name, email, phone, joined_on) VALUES ('9', 'Hugo Pereira', 'hugo@example.org', '0622222222', 'March 2025');
-- ↓ non-numeric id
INSERT INTO members (id, full_name, email, phone, joined_on) VALUES ('ten', 'Nour Haddad', 'nour@example.org', '0633333333', '2025-04-05');

-- === Workshops ===
INSERT INTO workshops (id, title, hosted_by, price, seats) VALUES ('1', 'Woodturning basics', '1', '35', '8');
INSERT INTO workshops (id, title, hosted_by, price, seats) VALUES ('2', '3D printing', '2', '0', '12');
-- ↓ negative price
INSERT INTO workshops (id, title, hosted_by, price, seats) VALUES ('3', 'Arc welding', '2', '-40', '4');
-- ↓ host does not exist
INSERT INTO workshops (id, title, hosted_by, price, seats) VALUES ('4', 'Japanese bookbinding', '99', '25', '6');
-- ↓ price spelled out
INSERT INTO workshops (id, title, hosted_by, price, seats) VALUES ('5', 'Open day', '1', 'free', '30');
-- ↓ negative capacity
INSERT INTO workshops (id, title, hosted_by, price, seats) VALUES ('6', 'Sharpening', '1', '15', '-3');

-- === Membership fees ===
INSERT INTO membership_fees (id, member_id, amount, paid_on, method) VALUES ('1', '1', '45', '2025-01-12', 'card');
INSERT INTO membership_fees (id, member_id, amount, paid_on, method) VALUES ('2', '2', '45', '2025-03-12', 'cheque');
-- ↓ member does not exist
INSERT INTO membership_fees (id, member_id, amount, paid_on, method) VALUES ('3', '404', '45', '2025-03-15', 'card');
-- ↓ negative amount
INSERT INTO membership_fees (id, member_id, amount, paid_on, method) VALUES ('4', '1', '-45', '2025-04-01', 'card');
-- ↓ decimal comma and February 30th
INSERT INTO membership_fees (id, member_id, amount, paid_on, method) VALUES ('5', '3', '45,50', '2025-02-30', 'cash');
-- ↓ zero amount
INSERT INTO membership_fees (id, member_id, amount, paid_on, method) VALUES ('6', '4', '0', '2025-05-01', 'card');
-- ↓ missing member and unknown payment method
INSERT INTO membership_fees (id, member_id, amount, paid_on, method) VALUES ('7', NULL, '45', '2025-06-01', 'bitcoin');

-- === Attendances ===
INSERT INTO attendances (id, member_id, workshop_id, attended) VALUES ('1', '1', '1', 'true');
INSERT INTO attendances (id, member_id, workshop_id, attended) VALUES ('2', '2', '1', 'false');
-- ↓ exact duplicate of the member/workshop pair
INSERT INTO attendances (id, member_id, workshop_id, attended) VALUES ('3', '1', '1', 'true');
-- ↓ workshop does not exist
INSERT INTO attendances (id, member_id, workshop_id, attended) VALUES ('4', '2', '77', 'false');
-- ↓ member does not exist
INSERT INTO attendances (id, member_id, workshop_id, attended) VALUES ('5', '88', '1', 'true');
-- ↓ free-text attendance
INSERT INTO attendances (id, member_id, workshop_id, attended) VALUES ('6', '3', '2', 'maybe');
