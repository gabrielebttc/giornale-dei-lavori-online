const express = require('express');
const pool = require('./db');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Importa il modulo JWT
const bcrypt = require('bcrypt'); // Per confrontare le password hashate
const authenticateToken = require('./authMiddleware'); // Middleware di autenticazione
const ExcelJS = require('exceljs');
const moment = require('moment');

router.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()'); // Query di prova
    res.json({ message: 'Connessione riuscita!', time: result.rows[0] });
  } catch (error) {
    console.error('Errore nella connessione al database:', error);
    res.status(500).json({ error: 'Errore nella connessione al database' });
  }
});

router.get('/db/:table', authenticateToken, async (req, res) => {
  const tableName = req.params.table;
  const ownerId = req.user.id;

  // Elenco delle tabelle che richiedono il filtro per owner_id
  const restrictedTables = ['users', 'building_sites', 'daily_notes', 'companies', 'daily_presences', 'user_type'];

  // Costruisci la query di base
  let query = `SELECT * FROM ${tableName}`;
  const queryParams = [];

  // Aggiungi la clausola WHERE solo se la tabella è nell'elenco ristretto
  if (restrictedTables.includes(tableName)) {
    query += ' WHERE owner_id = $1';
    queryParams.push(ownerId);
  }

  try {
    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Errore durante la query:', error);
    res.status(500).send('Errore nel recupero dei dati dal database');
  }
});

router.get('/user-types', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM user_type WHERE id != 17'); // Assumo che l'id 17 sia l'admin
    res.json(result.rows);
  } catch (error) {
    console.error('Errore durante il recupero dei tipi di utente:', error);
    res.status(500).json({ error: 'Errore durante il recupero dei tipi di utente' });
  }
});

router.post('/building-sites', authenticateToken, async (req, res) => {
  const { name, notes, city, address, lat, lng, startDate, endDate } = req.body;
  const ownerId = req.user.id;

  if (!name || !startDate) {
    return res.status(400).json({ error: 'I campi "name" e "start_date" sono obbligatori' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO building_sites (name, notes, city, address, latitude, longitude, start_date, end_date, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [
        name,
        notes || null,
        city || null,
        address || null,
        lat || null,
        lng || null,
        startDate,
        endDate || null,
        ownerId
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Errore durante l\'inserimento del cantiere:', error);
    res.status(500).json({ error: 'Errore durante l\'inserimento del cantiere' });
  }
});

router.get('/building-sites', authenticateToken, async (req, res) => {
  const ownerId = req.user.id;
  try {
    const result = await pool.query('SELECT * FROM building_sites WHERE owner_id = $1', [ownerId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Errore durante il recupero dei building sites:', error);
    res.status(500).json({ error: 'Errore durante il recupero dei building sites' });
  }
});

router.get('/building-sites/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT
        id,
        name,
        notes,
        city,
        address,
        latitude,
        longitude,
        TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date,
        TO_CHAR(end_date, 'YYYY-MM-DD') AS end_date
       FROM building_sites
       WHERE id = $1 AND owner_id = $2`,
      [id, ownerId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cantiere non trovato o non sei autorizzato.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Errore nel recupero del cantiere:', error);
    res.status(500).json({ error: 'Errore del server.' });
  }
});

router.put('/building-sites/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, notes, city, address, latitude, longitude, start_date, end_date } = req.body;
  const ownerId = req.user.id;

  if (!name || !city || !latitude || !longitude || !start_date) {
    return res.status(400).json({ message: 'Nome, città, coordinate e data di inizio sono obbligatori.' });
  }

  // 🛠️ MODIFICA 1: Formatta le date per evitare il problema del fuso orario.
  // Questo passo è corretto.
  const startDateFormatted = new Date(start_date).toISOString().split('T')[0];
  const endDateFormatted = end_date ? new Date(end_date).toISOString().split('T')[0] : null;

  try {
    const result = await pool.query(
      `UPDATE building_sites 
       SET name = $1, notes = $2, city = $3, address = $4, latitude = $5, longitude = $6, start_date = $7, end_date = $8
       WHERE id = $9 AND owner_id = $10 
       RETURNING *`,
      // 🛠️ MODIFICA 2: Usa le variabili formattate nell'array dei parametri.
      [name, notes, city, address, latitude, longitude, startDateFormatted, endDateFormatted, id, ownerId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Cantiere non trovato o non sei autorizzato.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del cantiere:', error);
    res.status(500).json({ error: 'Errore del server durante l\'aggiornamento.' });
  }
});

router.get('/get-all-workers', authenticateToken, async (req, res) => {
  const { buildingSiteId } = req.query;
  const ownerId = req.user.id;

  try {
    let query;
    if (!buildingSiteId) {
      // Per recuperare tutti i lavoratori di un utente
      query = `
        SELECT
          u.id AS user_id, 
          u.first_name, 
          u.last_name, 
          u.email, 
          u.phone,
          u.notes, -- Aggiunto il campo notes
          ARRAY_AGG(DISTINCT c.id) FILTER (WHERE c.id IS NOT NULL) AS company_ids,
          ARRAY_AGG(DISTINCT c.name) FILTER (WHERE c.name IS NOT NULL) AS company_names,
          ARRAY_AGG(DISTINCT bs.id) FILTER (WHERE bs.id IS NOT NULL) AS building_site_ids,
          ARRAY_AGG(DISTINCT bs.name) FILTER (WHERE bs.name IS NOT NULL) AS building_site_names,
          ARRAY_AGG(DISTINCT ut.name) FILTER (WHERE ut.name IS NOT NULL) AS user_types
        FROM users AS u
        LEFT JOIN users_companies AS uc ON u.id = uc.user_id
        LEFT JOIN companies AS c ON uc.company_id = c.id AND c.owner_id = $1
        LEFT JOIN users_building_sites AS ubs ON u.id = ubs.user_id
        LEFT JOIN building_sites AS bs ON ubs.site_id = bs.id AND bs.owner_id = $1
        LEFT JOIN users_user_type AS uut ON u.id = uut.user_id
        LEFT JOIN user_type AS ut ON uut.user_type_id = ut.id
        WHERE u.owner_id = $1
        GROUP BY u.id;
      `;
    } else {
      // Per recuperare i lavoratori associati a un cantiere specifico dell'utente
      query = `
        SELECT
          u.id AS user_id, 
          u.first_name, 
          u.last_name, 
          u.email, 
          u.phone,
          u.notes, -- Aggiunto il campo notes
          ARRAY_AGG(DISTINCT c.id) FILTER (WHERE c.id IS NOT NULL) AS company_ids,
          ARRAY_AGG(DISTINCT c.name) FILTER (WHERE c.name IS NOT NULL) AS company_names,
          ARRAY_AGG(DISTINCT ut.name) FILTER (WHERE ut.name IS NOT NULL) AS user_types
        FROM users AS u
        LEFT JOIN users_companies AS uc ON u.id = uc.user_id
        LEFT JOIN companies AS c ON uc.company_id = c.id AND c.owner_id = $1
        JOIN users_building_sites AS ubs ON u.id = ubs.user_id
        LEFT JOIN users_user_type AS uut ON u.id = uut.user_id
        LEFT JOIN user_type AS ut ON uut.user_type_id = ut.id
        WHERE ubs.site_id = $2 AND u.owner_id = $1
        GROUP BY u.id;
      `;
    }
    const result = await pool.query(query, buildingSiteId ? [ownerId, buildingSiteId] : [ownerId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Errore durante la query:', error);
    res.status(500).json({ error: 'Errore durante il recupero dei dati' });
  }
});

router.post('/add-worker', authenticateToken, async (req, res) => {
  const { firstName, lastName, username, email, password, phone, companyIds, buildingSiteId, userTypeIds } = req.body;
  const ownerId = req.user.id;

  try {
    const userResult = await pool.query(
      `INSERT INTO users (first_name, last_name, username, email, password, phone, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        firstName,
        lastName,
        username || null,
        email || null,
        password || null,
        phone || null,
        ownerId
      ]
    );
    const newUserId = userResult.rows[0].id;

    if (companyIds && companyIds.length > 0) {
      const companyQueries = companyIds.map((companyId) =>
        pool.query(`INSERT INTO users_companies (user_id, company_id) VALUES ($1, $2)`, [newUserId, companyId])
      );
      await Promise.all(companyQueries);
    }

    if (buildingSiteId) {
      await pool.query(
        `INSERT INTO users_building_sites (user_id, site_id) VALUES ($1, $2)`,
        [newUserId, buildingSiteId]
      );
    }

    if (userTypeIds && userTypeIds.length > 0) {
      const userTypeQueries = userTypeIds.map((typeId) =>
        pool.query(`INSERT INTO users_user_type (user_id, user_type_id) VALUES ($1, $2)`, [newUserId, typeId])
      );
      await Promise.all(userTypeQueries);
    }

    res.status(201).json({ message: 'Worker added successfully', userId: newUserId });
  } catch (error) {
    console.error('Errore durante l\'inserimento del worker:', error);
    res.status(500).json({ error: 'Errore durante l\'inserimento del worker' });
  }
});

router.delete('/delete-record/:table/:id', authenticateToken, async (req, res) => {
  const { table, id } = req.params;
  const ownerId = req.user.id;

  // Protezione aggiuntiva per evitare eliminazioni accidentali
  if (table === 'users' && id == ownerId) {
    // Gestisce l'eliminazione del proprio account
    return res.status(403).json({ error: 'Usa la rotta specifica per eliminare il tuo account.' });
  }

  try {
    const result = await pool.query(`DELETE FROM ${table} WHERE id = $1 AND owner_id = $2 RETURNING *`, [id, ownerId]);
    if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Record non trovato o non sei autorizzato.' });
    }
    res.status(200).json({ message: 'Record eliminato con successo' });
  } catch (error) {
    console.error('Errore durante l\'eliminazione del record:', error);
    res.status(500).json({ error: 'Errore durante l\'eliminazione del record' });
  }
});

router.post('/add-users_building_sites-record', authenticateToken, async (req, res) => {
  const { userId, siteId } = req.body;
  const ownerId = req.user.id;

  try {
    const siteResult = await pool.query('SELECT owner_id FROM building_sites WHERE id = $1', [siteId]);
    if (siteResult.rows.length === 0 || siteResult.rows[0].owner_id !== ownerId) {
        return res.status(403).json({ error: 'Non sei autorizzato a modificare questo cantiere.' });
    }

    await pool.query(
      `INSERT INTO users_building_sites (user_id, site_id) VALUES ($1, $2)`,
      [userId, siteId]
    );
    res.status(201).json({ message: 'Record aggiunto con successo in users_building_sites' });
  } catch (error) {
    console.error('Errore durante l\'inserimento del record:', error);
    res.status(500).json({ error: 'Errore durante l\'inserimento del record' });
  }
});

router.put('/modify-worker/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, notes, companyIds, userTypeIds } = req.body;
  const ownerId = req.user.id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Inizia una transazione
    
    // 1. Verifica che il worker appartenga all'utente
    const workerCheck = await client.query('SELECT owner_id FROM users WHERE id = $1', [id]);
    if (workerCheck.rows.length === 0 || workerCheck.rows[0].owner_id !== ownerId) {
        await client.query('ROLLBACK');
        return res.status(403).json({ error: 'Non sei autorizzato a modificare questo lavoratore.' });
    }

    // 2. Aggiorna i dati dell'utente
    await client.query(
      `UPDATE users
       SET first_name = $1,
           last_name = $2,
           email = $3,
           phone = $4,
           notes = $5
       WHERE id = $6`,
      [firstName, lastName, email, phone, notes, id]
    );

    // 3. Gestisce le associazioni con le aziende
    if (Array.isArray(companyIds)) {
      await client.query('DELETE FROM users_companies WHERE user_id = $1', [id]);
      for (const companyId of companyIds) {
        await client.query('INSERT INTO users_companies (user_id, company_id) VALUES ($1, $2)', [id, companyId]);
      }
    }

    // 4. Gestisce le associazioni con le mansioni
    if (Array.isArray(userTypeIds)) {
      await client.query('DELETE FROM users_user_type WHERE user_id = $1', [id]);
      for (const userTypeId of userTypeIds) {
        await client.query('INSERT INTO users_user_type (user_id, user_type_id) VALUES ($1, $2)', [id, userTypeId]);
      }
    }

    await client.query('COMMIT'); // Commit della transazione
    res.status(200).json({ message: 'Worker modificato con successo' });
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback in caso di errore
    console.error('Errore durante la modifica del worker:', error);
    res.status(500).json({ error: 'Errore durante la modifica del worker' });
  } finally {
    client.release();
  }
});

router.post('/add-company', authenticateToken, async (req, res) => {
  const { name, notes } = req.body;
  const ownerId = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO companies (name, notes, owner_id) VALUES ($1, $2, $3) RETURNING *`,
      [name, notes, ownerId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Errore durante l\'inserimento della company:', error);
    res.status(500).json({ error: 'Errore durante l\'inserimento della company' });
  }
});

router.put('/modify-company/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const ownerId = req.user.id;

  try {
    const result = await pool.query(
      `UPDATE companies SET name = $1 WHERE id = $2 AND owner_id = $3 RETURNING *`,
      [name, id, ownerId]
    );
    if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Azienda non trovata o non sei autorizzato.' });
    }
    res.status(200).json({ message: 'Company modificata con successo' });
  } catch (error) {
    console.error('Errore durante la modifica della company:', error);
    res.status(500).json({ error: 'Errore durante la modifica della company' });
  }
});

router.post('/add-users_companies-record', authenticateToken, async (req, res) => {
  const { userId, companyId } = req.body;
  const ownerId = req.user.id;

  try {
    const companyResult = await pool.query('SELECT owner_id FROM companies WHERE id = $1', [companyId]);
    if (companyResult.rows.length === 0 || companyResult.rows[0].owner_id !== ownerId) {
      return res.status(403).json({ error: 'Non sei autorizzato a modificare questa azienda.' });
    }

    await pool.query(
      `INSERT INTO users_companies (user_id, company_id) VALUES ($1, $2)`,
      [userId, companyId]
    );
    res.status(201).json({ message: 'Record aggiunto con successo in users_companies' });
  } catch (error) {
    console.error('Errore durante l\'inserimento del record:', error);
    res.status(500).json({ error: 'Errore durante l\'inserimento del record' });
  }
});

router.post('/add-daily_presences-record', authenticateToken, async (req, res) => {
  const { buildingSiteId, userId, presenceDate, isPresent, notes } = req.body;
  const ownerId = req.user.id;

  try {
    const siteResult = await pool.query('SELECT owner_id FROM building_sites WHERE id = $1', [buildingSiteId]);
    if (siteResult.rows.length === 0 || siteResult.rows[0].owner_id !== ownerId) {
      return res.status(403).json({ error: 'Non sei autorizzato a modificare le presenze per questo cantiere.' });
    }

    const existsResult = await pool.query(
      `SELECT id FROM daily_presences WHERE date = $1 AND user_id = $2`,
      [presenceDate, userId]
    );

    if (existsResult.rows.length > 0) {
      const recordId = existsResult.rows[0].id;
      await pool.query(
        `UPDATE daily_presences
         SET building_site_id = $1, is_present = $2, notes = $3
         WHERE id = $4`,
        [buildingSiteId, isPresent, notes, recordId]
      );
      res.status(200).json({ message: 'Record aggiornato con successo' });
    } else {
      await pool.query(
        `INSERT INTO daily_presences (building_site_id, user_id, date, is_present, notes)
         VALUES ($1, $2, $3, $4, $5)`,
        [buildingSiteId, userId, presenceDate, isPresent, notes]
      );
      res.status(201).json({ message: 'Record aggiunto con successo' });
    }
  } catch (error) {
    console.error('Errore durante l\'inserimento o aggiornamento del record:', error);
    res.status(500).json({ error: 'Errore durante l\'inserimento o aggiornamento del record' });
  }
});

router.get('/daily-presences', authenticateToken, async (req, res) => {
  const { buildingSiteId, date } = req.query;
  const ownerId = req.user.id;

  if (!buildingSiteId || !date) {
    return res.status(400).json({ message: 'buildingSiteId and date are required' });
  }
  
  try {
    const siteResult = await pool.query('SELECT owner_id FROM building_sites WHERE id = $1', [buildingSiteId]);
    if (siteResult.rows.length === 0 || siteResult.rows[0].owner_id !== ownerId) {
      return res.status(403).json({ error: 'Non sei autorizzato a visualizzare le presenze per questo cantiere.' });
    }

    const query = `
      SELECT user_id, is_present AS status, notes
      FROM daily_presences
      WHERE building_site_id = $1 AND date = $2;
    `;
    const result = await pool.query(query, [buildingSiteId, date]);
    res.json(result.rows);
  } catch (error) {
    console.error('Errore nel recupero delle presenze:', error);
    res.status(500).json({ message: 'Errore nel recupero delle presenze.' });
  }
});

router.post('/daily-presences/save', authenticateToken, async (req, res) => {
  const { buildingSiteId, date, presences } = req.body;
  const ownerId = req.user.id; // L'ID del proprietario viene estratto dal token

  if (!buildingSiteId || !date || !Array.isArray(presences)) {
    return res.status(400).json({ message: 'buildingSiteId, date and presences are required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const siteResult = await client.query('SELECT owner_id FROM building_sites WHERE id = $1', [buildingSiteId]);
    if (siteResult.rows.length === 0 || siteResult.rows[0].owner_id !== ownerId) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Non sei autorizzato a salvare le presenze per questo cantiere.' });
    }

    await client.query(
      `DELETE FROM daily_presences WHERE building_site_id = $1 AND date = $2`,
      [buildingSiteId, date]
    );

    // Ho modificato la query per includere "owner_id"
    const insertQuery = `
      INSERT INTO daily_presences (building_site_id, user_id, date, is_present, notes, owner_id)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;

    for (const presence of presences) {
      const { user_id, status, notes } = presence;
      // Ho aggiunto "ownerId" come sesto parametro
      await client.query(insertQuery, [buildingSiteId, user_id, date, status, notes || null, ownerId]);
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Presenze salvate con successo!' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore nel salvataggio delle presenze:', error);
    res.status(500).json({ message: 'Errore nel salvataggio delle presenze.' });
  } finally {
    client.release();
  }
});

router.get('/get-daily-note', authenticateToken, async (req, res) => {
  const { buildingSiteId, date, noteType } = req.query;
  const ownerId = req.user.id;

  if (!buildingSiteId || !date || !noteType) {
    return res.status(400).json({ message: 'buildingSiteId, date, and noteType are required.' });
  }

  const validNoteTypes = ['notes', 'other_notes', 'personal_notes'];
  if (!validNoteTypes.includes(noteType)) {
    return res.status(400).json({ message: 'Invalid noteType provided.' });
  }

  try {
    const siteResult = await pool.query('SELECT owner_id FROM building_sites WHERE id = $1', [buildingSiteId]);
    if (siteResult.rows.length === 0 || siteResult.rows[0].owner_id !== ownerId) {
      return res.status(403).json({ error: 'Non sei autorizzato a visualizzare le note per questo cantiere.' });
    }

    const query = `
      SELECT ${noteType} AS note_value
      FROM daily_notes
      WHERE building_site_id = $1 AND date = $2;
    `;
    
    const result = await pool.query(query, [buildingSiteId, date]);
    
    if (result.rows.length > 0) {
      res.json({ noteValue: result.rows[0].note_value });
    } else {
      res.json({ noteValue: '' });
    }
  } catch (error) {
    console.error('Errore nel recupero della nota giornaliera:', error);
    res.status(500).json({ message: 'Errore nel recupero della nota.' });
  }
});

router.post('/add-daily-note', authenticateToken, async (req, res) => {
  const { buildingSiteId, date, noteType, noteValue } = req.body;
  const ownerId = req.user.id;

  if (!buildingSiteId || !date || !noteType || noteValue === undefined) {
    return res.status(400).json({ message: 'buildingSiteId, date, noteType, and noteValue are required.' });
  }

  const validNoteTypes = ['notes', 'other_notes', 'personal_notes'];
  if (!validNoteTypes.includes(noteType)) {
    return res.status(400).json({ message: 'Invalid noteType provided.' });
  }

  try {
    const siteResult = await pool.query('SELECT owner_id FROM building_sites WHERE id = $1', [buildingSiteId]);
    if (siteResult.rows.length === 0 || siteResult.rows[0].owner_id !== ownerId) {
      return res.status(403).json({ error: 'Non sei autorizzato a modificare le note per questo cantiere.' });
    }

    const query = `
      INSERT INTO daily_notes (building_site_id, date, ${noteType}, owner_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (building_site_id, date) DO UPDATE SET ${noteType} = $3;
    `;
    
    await pool.query(query, [buildingSiteId, date, noteValue, ownerId]);
    res.status(201).json({ message: 'Note added or updated successfully.' });
  } catch (error) {
    console.error(`Errore durante l'aggiunta o l'aggiornamento della nota (${noteType}):`, error);
    res.status(500).json({ message: 'Errore durante l\'operazione.' });
  }
});

router.delete('/unlink-worker-from-site/:buildingSiteId/:workerId', authenticateToken, async (req, res) => {
  const { buildingSiteId, workerId } = req.params;
  const ownerId = req.user.id;

  console.log(`Richiesta di disassociazione: cantiere ${buildingSiteId}, lavoratore ${workerId}`);

  try {
    // Verifica che l'utente sia l'owner del cantiere
    const siteResult = await pool.query('SELECT owner_id FROM building_sites WHERE id = $1', [buildingSiteId]);
    if (siteResult.rows.length === 0 || siteResult.rows[0].owner_id !== ownerId) {
      return res.status(403).json({ error: 'Non sei autorizzato a rimuovere un lavoratore da questo cantiere.' });
    }

    const result = await pool.query(
      'DELETE FROM users_building_sites WHERE site_id = $1 AND user_id = $2 RETURNING *',
      [buildingSiteId, workerId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Associazione non trovata' });
    }

    res.status(200).json({ message: 'Lavoratore rimosso dal cantiere con successo' });
  } catch (error) {
    console.error('Errore durante la disassociazione del lavoratore:', error);
    res.status(500).json({ error: 'Errore del server durante la disassociazione.' });
  }
});

router.get('/get-all-workers-not-in-building-site', authenticateToken, async (req, res) => {
  const { buildingSiteId } = req.query;
  const ownerId = req.user.id;

  if (!buildingSiteId) {
    return res.status(400).json({ error: 'buildingSiteId is required' });
  }

  try {
    // Verifico che il cantiere appartenga all'utente
    const siteCheck = await pool.query('SELECT owner_id FROM building_sites WHERE id = $1', [buildingSiteId]);
    if (siteCheck.rows.length === 0 || siteCheck.rows[0].owner_id !== ownerId) {
      return res.status(403).json({ error: 'Non sei autorizzato a visualizzare i lavoratori per questo cantiere.' });
    }

    const query = `
      SELECT 
        u.id AS user_id, 
        u.first_name, 
        u.last_name, 
        ARRAY_AGG(DISTINCT c.name) AS company_names,
        ARRAY_AGG(DISTINCT ut.name) AS user_types
      FROM users AS u
      LEFT JOIN users_companies AS uc ON u.id = uc.user_id
      LEFT JOIN companies AS c ON uc.company_id = c.id
      LEFT JOIN users_user_type AS uut ON u.id = uut.user_id
      LEFT JOIN user_type AS ut ON uut.user_type_id = ut.id
      WHERE u.owner_id = $1 AND u.id NOT IN (
        SELECT user_id FROM users_building_sites WHERE site_id = $2
      )
      GROUP BY u.id;
    `;
    const result = await pool.query(query, [ownerId, buildingSiteId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Errore durante la query per i lavoratori non nel cantiere:', error);
    res.status(500).json({ error: 'Errore durante il recupero dei dati' });
  }
});

router.post('/add-existing-worker-to-building-site', authenticateToken, async (req, res) => {
  const { userId, buildingSiteId } = req.body;
  const ownerId = req.user.id;

  if (!userId || !buildingSiteId) {
    return res.status(400).json({ error: 'userId and buildingSiteId are required' });
  }

  try {
    const siteCheck = await pool.query('SELECT owner_id FROM building_sites WHERE id = $1', [buildingSiteId]);
    if (siteCheck.rows.length === 0 || siteCheck.rows[0].owner_id !== ownerId) {
      return res.status(403).json({ error: 'Non sei autorizzato ad aggiungere un lavoratore a questo cantiere.' });
    }

    const query = `
      INSERT INTO users_building_sites (user_id, site_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, site_id) DO NOTHING;
    `;
    await pool.query(query, [userId, buildingSiteId]);
    res.status(201).json({ message: 'Lavoratore aggiunto con successo al cantiere.' });
  } catch (error) {
    console.error('Errore durante l\'aggiunta del lavoratore al cantiere:', error);
    res.status(500).json({ error: "Errore durante l'aggiunta del lavoratore." });
  }
});

router.post('/add-user_type', authenticateToken, async (req, res) => {
  const { name } = req.body;
  const ownerId = req.user.id; // L'ID del proprietario viene estratto dal token JWT

  // Validazione di base
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Il campo "name" è obbligatorio.' });
  }

  // **Nuovo controllo: Impedisce la creazione di un tipo di utente chiamato 'admin'**
  if (name.toLowerCase() === 'admin') {
    return res.status(403).json({ error: 'Non è possibile creare un tipo di utente chiamato "admin".' });
  }

  try {
    // Inserisce il nuovo user_type nel database, associandolo all'owner_id
    // Il controllo di unicità viene rimosso qui e nel catch.
    const result = await pool.query(
      'INSERT INTO user_type (name, owner_id) VALUES ($1, $2) RETURNING *',
      [name, ownerId]
    );

    // Invia una risposta di successo con i dati del nuovo record
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Rimosso il controllo per l'errore '23505' (violazione di UNIQUE)
    console.error('Errore durante l\'inserimento del tipo di utente:', error);
    res.status(500).json({ error: 'Errore del server durante l\'inserimento.' });
  }
});

router.post('/generate-excel', authenticateToken, async (req, res) => {
  const { buildingSiteId } = req.body;
  const ownerId = req.user.id;

  if (!buildingSiteId) {
    console.error('Errore: buildingSiteId è mancante nella richiesta.');
    return res.status(400).json({ message: 'buildingSiteId è richiesto.' });
  }

  const client = await pool.connect();
  console.log('Connessione al database stabilita.');

  try {
    const workbook = new ExcelJS.Workbook();
    console.log('Workbook creato.');

    // --- POPOLAMENTO FOGLIO 1 ---
    const worksheet1 = workbook.addWorksheet('Foglio 1');
    console.log('Foglio 1 creato.');
    
    // 1. SETTAGGI INIZIALI DEL FOGLIO 1
    worksheet1.properties.defaultRowHeight = 50;
    worksheet1.views = [{ state: 'frozen', ySplit: 4 }];
    worksheet1.getColumn('A').width = 5;
    worksheet1.getColumn('B').width = 5;
    worksheet1.getColumn('C').width = 5;
    worksheet1.getColumn('D').width = 5;
    worksheet1.getColumn('E').width = 50;
    worksheet1.getColumn('F').width = 50;
    for (let i = 7; i <= 26; i++) {
      const columnLetter = String.fromCharCode(65 + i - 1);
      worksheet1.getColumn(columnLetter).width = 11.2;
    }
    worksheet1.getRow(4).height = 64;

    // 2. UNIONE DELLE CELLE E INSERIMENTO TESTO FOGLIO 1
    worksheet1.mergeCells('A1:A4');
    worksheet1.getCell('A1').value = 'N°';
    worksheet1.mergeCells('B1:D4');
    worksheet1.getCell('B1').value = 'DATA';
    worksheet1.mergeCells('E1:E4');
    worksheet1.getCell('E1').value = "ANNOTAZIONI SPECIALI E GENERALI sull'andamento e modo di esecuzione dei lavori, sugli avvenimenti straordinari e sul tempo utilmente impiegato.";
    worksheet1.mergeCells('F1:F4');
    worksheet1.getCell('F1').value = "OSSERVAZIONI E ISTRUZIONI della direzione lavori, del responsabile del procedimento, del coordinatore per l’esecuzione, del collaudatore.";
    console.log('Celle e intestazioni Foglio 1 create.');

    // 3. GESTIONE DEI DATI FOGLIO 1
    const siteResult = await client.query(
      'SELECT start_date, end_date FROM building_sites WHERE id = $1 AND owner_id = $2',
      [buildingSiteId, ownerId]
    );

    console.log('Risultato query building_sites:', siteResult.rows[0] || 'Nessun cantiere trovato.');

    if (siteResult.rows.length === 0) {
      console.error('Errore: Cantiere non trovato o non autorizzato.');
      return res.status(404).json({ message: 'Cantiere non trovato.' });
    }

    const { start_date, end_date } = siteResult.rows[0];
    const endDate = end_date ? moment(end_date) : moment();
    const currentDate = moment(start_date);
    const dateRows = [];

    while (currentDate.isSameOrBefore(endDate)) {
      dateRows.push({
        day: currentDate.date(),
        month: currentDate.month() + 1,
        year: currentDate.year(),
        fullDate: currentDate.format('YYYY-MM-DD')
      });
      currentDate.add(1, 'days');
    }
    console.log(`Date generate per il report: ${dateRows.length}.`);

    const dailyNotesResult = await client.query(
      'SELECT date, notes, other_notes FROM daily_notes WHERE building_site_id = $1 AND owner_id = $2',
      [buildingSiteId, ownerId]
    );
    const dailyNotesMap = new Map();
    dailyNotesResult.rows.forEach(row => {
      dailyNotesMap.set(moment(row.date).format('YYYY-MM-DD'), {
        notes: row.notes,
        other_notes: row.other_notes
      });
    });

    console.log(`Note recuperate: ${dailyNotesMap.size}.`);

    const userTypesResult = await client.query(`
      SELECT DISTINCT ut.name, ut.id
      FROM users_building_sites ubs
      JOIN users_user_type uut ON ubs.user_id = uut.user_id
      JOIN user_type ut ON uut.user_type_id = ut.id
      WHERE ubs.site_id = $1 AND ut.owner_id = $2
    `, [buildingSiteId, ownerId]);
    
    const userTypes = userTypesResult.rows.map(row => row.name);
    const userTypeIds = userTypesResult.rows.map(row => row.id);

    console.log(`Tipi di utente trovati: ${userTypes.length}.`);

    const dailyPresencesResult = await client.query(`
      SELECT dp.date, uut.user_type_id, COUNT(dp.user_id) as count
      FROM daily_presences dp
      JOIN users_user_type uut ON dp.user_id = uut.user_id
      WHERE dp.building_site_id = $1 AND dp.owner_id = $2 AND dp.is_present = 'present'
      GROUP BY dp.date, uut.user_type_id
    `, [buildingSiteId, ownerId]);
    
    const dailyPresencesMap = new Map();
    dailyPresencesResult.rows.forEach(row => {
      const dateKey = moment(row.date).format('YYYY-MM-DD');
      if (!dailyPresencesMap.has(dateKey)) {
        dailyPresencesMap.set(dateKey, new Map());
      }
      dailyPresencesMap.get(dateKey).set(row.user_type_id, row.count);
    });

    // 4. POPOLAMENTO DEL FOGLIO 1
    let recordNumber = 1;
    dateRows.forEach(dateRow => {
      const notes = dailyNotesMap.get(dateRow.fullDate) || {};
      const presences = dailyPresencesMap.get(dateRow.fullDate) || new Map();
      const rowData = [
        recordNumber,
        dateRow.day,
        dateRow.month,
        dateRow.year,
        notes.notes || '',
        notes.other_notes || ''
      ];
      userTypeIds.forEach(typeId => {
        const count = presences.get(typeId) || null;
        rowData.push(count);
      });
      worksheet1.addRow(rowData);
      recordNumber++;
    });
    console.log('Righe del Foglio 1 popolate.');

    // Popola gli user type nella riga 4 del Foglio 1
    let userTypeCol = 7;
    if (userTypes.length > 0) {
      const mergedCells = `G1:${String.fromCharCode(65 + userTypeCol - 1 + userTypes.length - 1)}3`;
      worksheet1.mergeCells(mergedCells);
      worksheet1.getCell('G1').value = "Operai e mezzi d'opera impiegati dall'Impresa";
    }
    userTypes.forEach(userType => {
      const cell = worksheet1.getCell(4, userTypeCol);
      cell.value = userType;
      cell.alignment = { textRotation: 90, vertical: 'middle', horizontal: 'center' };
      userTypeCol++;
    });
    console.log('Intestazioni dei tipi di utente Foglio 1 aggiunte.');

    // 5. STILI E WRAP TEXT FOGLIO 1
    worksheet1.eachRow((row) => {
      row.eachCell(cell => {
        cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
        };
      });
    });
    console.log('Stili applicati a tutte le celle del Foglio 1.');

    // --- NUOVA SEZIONE: POPOLAMENTO FOGLIO 2 ---
    const worksheet2 = workbook.addWorksheet('Foglio 2');
    console.log('Foglio 2 creato.');

    // 1. IMPOSTA INTESTAZIONI E STILI FOGLIO 2
    worksheet2.columns = [
      { header: 'Nome', key: 'first_name', width: 20 },
      { header: 'Cognome', key: 'last_name', width: 20 },
      { header: 'Cellulare', key: 'phone', width: 15 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Note', key: 'notes', width: 40 },
      { header: 'Mansione', key: 'user_type', width: 20 },
      { header: 'Azienda', key: 'company', width: 25 },
    ];
    worksheet2.getRow(1).font = { bold: true };
    worksheet2.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet2.getRow(1).eachCell(cell => {
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
      };
    });
    console.log('Intestazioni Foglio 2 create.');
    
    // 2. GESTIONE DEI DATI FOGLIO 2
    const usersResult = await client.query(`
      SELECT
          u.first_name, u.last_name, u.phone, u.email, u.notes,
          ut.name AS user_type_name,
          c.name AS company_name
      FROM users_building_sites ubs
      JOIN users u ON ubs.user_id = u.id
      LEFT JOIN users_user_type uut ON u.id = uut.user_id
      LEFT JOIN user_type ut ON uut.user_type_id = ut.id
      LEFT JOIN users_companies uc ON u.id = uc.user_id
      LEFT JOIN companies c ON uc.company_id = c.id
      WHERE ubs.site_id = $1 AND u.owner_id = $2
    `, [buildingSiteId, ownerId]);

    // 3. POPOLAMENTO FOGLIO 2
    usersResult.rows.forEach(user => {
      worksheet2.addRow({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        email: user.email,
        notes: user.notes,
        user_type: user.user_type_name || 'N/A',
        company: user.company_name || 'N/A',
      });
    });
    console.log(`Righe del Foglio 2 popolate con ${usersResult.rows.length} utenti.`);

    // 4. STILI AGGIUNTIVI FOGLIO 2
    worksheet2.eachRow((row, rowNum) => {
        row.eachCell(cell => {
            cell.alignment = { vertical: 'middle', wrapText: true };
            cell.border = {
                top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
            };
        });
    });
    console.log('Stili applicati a tutte le celle del Foglio 2.');
    
    // --- 6. INVIO DEL FILE AL CLIENT ---
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=report_cantiere_${buildingSiteId}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
    console.log(`File Excel generato e inviato per il cantiere ${buildingSiteId}.`);

  } catch (error) {
    console.error('Errore durante la generazione del file Excel:', error);
    res.status(500).json({ message: 'Errore del server durante la generazione del file.' });
  } finally {
    client.release();
    console.log('Connessione al database chiusa.');
  }
});

module.exports = router;