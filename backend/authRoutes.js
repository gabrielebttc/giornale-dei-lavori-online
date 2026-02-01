const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const authenticateToken = require('./authMiddleware');

router.post('/register', async (req, res) => {
    const { first_name, last_name, username, email, password, phone } = req.body;
    const client = await pool.connect();
    ownerId = 1; // Questo è l'utente admin -> usato solo dal proprietario dell'app

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
                u.email = $1 AND uut.user_type_id = 2;
        `;/* uut.user_type_id = 2 è ispettore di cantiere */
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
            "SELECT id FROM user_type WHERE id = 2"
        );
        
        // Verifica se il tipo "admin" esiste nel database
        if (adminTypeResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(500).json({ message: 'Tipo utente con id = 2 non trovato nel database. Assicurati che esista un user_type con name=\'admin\'.' });
        }
        const adminTypeId = adminTypeResult.rows[0].id;

        // 3. Associa il nuovo utente al tipo "admin"
        await client.query(
            'INSERT INTO users_user_type (user_id, user_type_id) VALUES ($1, $2)',
            [newUserId, adminTypeId]
        );

        // --- INIZIO DATI DI ESEMPIO ---

        // --- CONFIGURAZIONE DATI EXTRA ---
        const aziendeExtra = [
            { name: 'BRUNO E FRETTO SRL', notes: 'POS - DURC - CAMERALE - Patente a credito' },
            { name: 'Sicurezza Totale S.p.A.', notes: 'Consulenza sicurezza e DPI' },
            { name: 'Scavi e Movimento Terra G.B.', notes: 'Mezzi pesanti e scavi' }
        ];

        const lavoratoriExtra = [
            { first: 'Russo Morto', last: 'Salvatore', note: 'Carpentiere - Visita medica, UNILAV, DPI' },
            { first: 'Vasile Marian', last: 'Cristian', note: 'Manovale - Visita medica, UNILAV, DPI' },
            { first: 'Barrera', last: 'Mirko', note: 'Manovale - Visita medica, UNILAV, DPI' },
            { first: 'Cuffaro', last: 'Giuseppe', note: 'Visita medica, UNILAV, DPI' },
            { first: 'Esposito', last: 'Gennaro', note: 'Gruista - Visita medica ok' }
        ];

        // --- 1. Inserimento Aziende ---
        const companyIds = [];
        for (const az of aziendeExtra) {
            const res = await client.query(
                'INSERT INTO companies (name, notes, owner_id) VALUES ($1, $2, $3) RETURNING id',
                [az.name, az.notes, newUserId]
            );
            companyIds.push(res.rows[0].id);
        }

        // --- 2. Inserimento Lavoratori ---
        const workerIds = [testWorkerId]; // Includiamo Giustino creato prima
        for (const lav of lavoratoriExtra) {
            const res = await client.query(
                'INSERT INTO users (first_name, last_name, notes, owner_id) VALUES ($1, $2, $3, $4) RETURNING id',
                [lav.first, lav.last, lav.note, newUserId]
            );
            const wid = res.rows[0].id;
            workerIds.push(wid);

            // Colleghiamo ogni lavoratore al cantiere e a una ditta a caso tra quelle nuove
            await client.query('INSERT INTO users_building_sites (user_id, site_id) VALUES ($1, $2)', [wid, testBuildingSiteId]);
            await client.query('INSERT INTO users_companies (user_id, company_id) VALUES ($1, $2)', [wid, companyIds[Math.floor(Math.random() * companyIds.length)]]);
        }

        // --- 3. Generazione Note e Presenze per i prossimi 10 giorni ---
        for (let i = 0; i < 10; i++) {
            // Calcoliamo la data (oggi + i giorni)
            const dateQuery = `CURRENT_DATE + interval '${i} days'`;

            // Inseriamo la nota giornaliera (Rapportino)
            await client.query(
                `INSERT INTO daily_notes (date, building_site_id, notes, other_notes, personal_notes, owner_id) 
                VALUES (${dateQuery}, $1, $2, $3, $4, $5)
                ON CONFLICT (building_site_id, date) DO NOTHING`,
                [testBuildingSiteId, `Lavori giorno ${i+1}: progressione cantiere`, 'Nulla da segnalare', 'Verificare materiali domani', newUserId]
            );

            // Inseriamo le presenze per TUTTI i lavoratori (6 in totale)
            for (const wid of workerIds) {
                await client.query(
                    `INSERT INTO daily_presences (building_site_id, user_id, date, is_present, owner_id) 
                    VALUES ($1, $2, ${dateQuery}, 'present', $3)`,
                    [testBuildingSiteId, wid, newUserId]
                );
            }
        }

        // --- FINE DATI DI ESEMPIO ---

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
        // per verificare che l'utente esista E che abbia il ruolo di admin (user_type_id = 2).
        const userQuery = `
            SELECT 
                u.* FROM 
                users u
            JOIN
                users_user_type uut ON u.id = uut.user_id
            WHERE 
                u.email = $1 AND uut.user_type_id = 2
        `;/* uut.user_type_id = 2 è ispettore di cantiere */
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