-- Seed minimale coerente con lo schema attuale.
-- Nota: in questo schema users <-> user_type e una relazione M:N tramite users_user_type.

-- Inserimento utente proprietario (owner root)
INSERT INTO users (id, first_name, last_name, username, email, password, phone, notes, owner_id)
VALUES (1, 'Admin', 'Root', 'admin', 'admin@example.local', 'CHANGE_ME', NULL, 'Utente seed', 1)
ON CONFLICT (id) DO NOTHING;

-- Inserimento tipi utente
INSERT INTO user_type (id, name, owner_id) VALUES (1, 'admin', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_type (id, name, owner_id) VALUES (2, 'ispettore di cantiere', 1)
ON CONFLICT (id) DO NOTHING;

-- Associazione utente <-> tipo utente
INSERT INTO users_user_type (user_id, user_type_id)
VALUES (1, 1)
ON CONFLICT DO NOTHING;

-- Allinea le sequence al massimo id presente
SELECT setval('public.user_type_id_seq', COALESCE((SELECT MAX(id) FROM public.user_type), 1), true);
SELECT setval('public.users_id_seq', COALESCE((SELECT MAX(id) FROM public.users), 1), true);