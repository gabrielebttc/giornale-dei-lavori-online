-- Inserimento tipi utente
INSERT INTO user_type (id, name) VALUES (1, 'admin');
INSERT INTO user_type (id, name) VALUES (2, 'ispettore di cantiere');

-- Inserimento utente admin
-- Nota: ho aggiunto campi generici, adattali alla tua struttura reale
INSERT INTO users (id, first_name, last_name, user_type_id, owner_id) 
VALUES (1, 'admin', 'admin', 1, 1);

SELECT setval(
  pg_get_serial_sequence('user_type', 'id'), 
  (SELECT max(id) FROM user_type)
);
SELECT setval(
  pg_get_serial_sequence('users', 'id'), 
  (SELECT max(id) FROM users)
);