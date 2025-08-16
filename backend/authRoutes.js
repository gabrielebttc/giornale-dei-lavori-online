const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const authenticateToken = require('./authMiddleware'); // Importazione corretta del middleware

// Endpoint di Registrazione
/*router.post('/register', async (req, res) => {
    const { first_name, last_name, username, email, password, phone } = req.body;
    const client = await pool.connect();
    ownerId = 21;

    try {
        await client.query('BEGIN'); // Inizia la transazione

        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Inserisci il nuovo utente nella tabella "users"
        const newUserResult = await client.query(
            'INSERT INTO users (first_name, last_name, username, email, password, phone, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, first_name, last_name, username, email, phone',
            [first_name, last_name, username, email, hashedPassword, phone, ownerId]
        );
        const newUserId = newUserResult.rows[0].id;

        // 2. Trova l'ID del tipo di utente "admin"
        const adminTypeResult = await client.query(
            "SELECT id FROM user_type WHERE name = 'admin'"
        );
        
        // Verifica se il tipo "admin" esiste
        if (adminTypeResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(500).json({ message: 'Tipo utente "admin" non trovato nel database.' });
        }
        const adminTypeId = adminTypeResult.rows[0].id;

        // 3. Associa il nuovo utente al tipo "admin"
        await client.query(
            'INSERT INTO users_user_type (user_id, user_type_id) VALUES ($1, $2)',
            [newUserId, adminTypeId]
        );

        await client.query('COMMIT'); // Commit della transazione
        res.status(201).json({ message: 'Registrazione avvenuta con successo. L\'utente è stato registrato come admin.' });

    } catch (error) {
        await client.query('ROLLBACK'); // Rollback in caso di errore
        if (error.code === '23505') {
            return res.status(409).json({ message: 'L\'email o il username è già in uso.' });
        }
        console.error('Errore durante la registrazione:', error);
        res.status(500).json({ message: 'Errore del server durante la registrazione.' });
    } finally {
        client.release();
    }
});*/

//NEW REGISTRATION ENDPOINT
router.post('/register', async (req, res) => {
    const { first_name, last_name, username, email, password, phone } = req.body;
    const client = await pool.connect();
    ownerId = 21; // Assicurati che questo ownerId sia gestito correttamente nel contesto reale

    try {
        await client.query('BEGIN'); // Inizia la transazione

        // **NUOVO CONTROLLO: Verifica se esiste già un utente admin con questa email**
        const existingAdminUserQuery = `
            SELECT 
                u.id 
            FROM 
                users u
            JOIN
                users_user_type uut ON u.id = uut.user_id
            WHERE 
                u.email = $1 AND uut.user_type_id = 17;
        `;
        const existingAdminUserResult = await client.query(existingAdminUserQuery, [email]);

        if (existingAdminUserResult.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ message: 'L\'email è già in uso da un altro utente.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Inserisci il nuovo utente nella tabella "users"
        const newUserResult = await client.query(
            'INSERT INTO users (first_name, last_name, username, email, password, phone, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, first_name, last_name, username, email, phone',
            [first_name, last_name, username, email, hashedPassword, phone, ownerId]
        );
        const newUserId = newUserResult.rows[0].id;

        // 2. Trova l'ID del tipo di utente "admin"
        // Assicurati che un record 'admin' esista nella tabella user_type
        const adminTypeResult = await client.query(
            "SELECT id FROM user_type WHERE name = 'admin'"
        );
        
        // Verifica se il tipo "admin" esiste nel database
        if (adminTypeResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(500).json({ message: 'Tipo utente "admin" non trovato nel database. Assicurati che esista un user_type con name=\'admin\'.' });
        }
        const adminTypeId = adminTypeResult.rows[0].id;

        // 3. Associa il nuovo utente al tipo "admin"
        await client.query(
            'INSERT INTO users_user_type (user_id, user_type_id) VALUES ($1, $2)',
            [newUserId, adminTypeId]
        );

        await client.query('COMMIT'); // Commit della transazione
        res.status(201).json({ message: 'Registrazione avvenuta con successo. L\'utente è stato registrato.' });

    } catch (error) {
        await client.query('ROLLBACK'); // Rollback in caso di errore
        if (error.code === '23505') {
            // Questo errore cattura ancora violazioni di UNIQUE su email/username nella tabella 'users'
            // indipendentemente dal ruolo (ad esempio, se l'email è già usata da un non-admin).
            return res.status(409).json({ message: 'L\'username è già in uso.' });
        }
        console.error('Errore durante la registrazione:', error);
        res.status(500).json({ message: 'Errore del server durante la registrazione.' });
    } finally {
        client.release();
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // La query ora fa il JOIN con la tabella users_user_type
        // per verificare che l'utente esista E che abbia il ruolo di admin (user_type_id = 17).
        const userQuery = `
            SELECT 
                u.* FROM 
                users u
            JOIN
                users_user_type uut ON u.id = uut.user_id
            WHERE 
                u.email = $1 AND uut.user_type_id = 17
        `;
        const user = await pool.query(userQuery, [email]);
        
        if (user.rows.length === 0) {
            // Risposta generica per motivi di sicurezza, non specificando se l'errore è 
            // dovuto all'email o al ruolo
            return res.status(400).json({ message: 'Credenziali non valide.' });
        }

        // Verifica che l'hash della password esista prima di confrontarlo
        if (!user.rows[0].password) {
            return res.status(400).json({ message: 'Credenziali non valide.' });
        }
        
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Credenziali non valide.' });
        }

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.status(200).json({
            message: 'Login avvenuto con successo',
            token,
            user: user.rows[0]
        });
    } catch (error) {
        console.error('Errore durante il login:', error);
        res.status(500).json({ message: 'Errore del server durante il login.' });
    }
});

router.get('/profile', authenticateToken, async (req, res) => {
  try {
      const user = await pool.query('SELECT id, first_name, last_name, username, email, phone, notes FROM users WHERE id = $1', [req.user.id]);
      if (user.rows.length === 0) {
          return res.status(404).json({ message: 'Utente non trovato.' });
      }
      res.status(200).json(user.rows[0]);
  } catch (error) {
      console.error('Errore nel recupero del profilo:', error);
      res.status(500).json({ message: 'Errore del server.' });
  }
});

// Endpoint per l'aggiornamento del profilo (protetto)
router.put('/profile', authenticateToken, async (req, res) => {
  const { first_name, last_name, username, phone, notes } = req.body;
  const userId = req.user.id;

  try {
      const updateQuery = `
          UPDATE users 
          SET first_name = $1, last_name = $2, username = $3, phone = $4, notes = $5
          WHERE id = $6
          RETURNING id, first_name, last_name, username, email, phone, notes
      `;
      const updatedUser = await pool.query(updateQuery, [first_name, last_name, username, phone, notes, userId]);

      if (updatedUser.rows.length === 0) {
          return res.status(404).json({ message: 'Utente non trovato.' });
      }

      res.status(200).json(updatedUser.rows[0]);
  } catch (error) {
      if (error.code === '23505') { // Codice errore per violazione di UNIQUE (username)
          return res.status(409).json({ message: 'L\'username è già in uso.' });
      }
      console.error('Errore nell\'aggiornamento del profilo:', error);
      res.status(500).json({ message: 'Errore del server durante l\'aggiornamento.' });
  }
});

module.exports = router;