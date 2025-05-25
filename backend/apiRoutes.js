const express = require('express');
const pool = require('./db');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Importa il modulo JWT
const bcrypt = require('bcrypt'); // Per confrontare le password hashate
const authenticateToken = require('./auth');

router.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()'); // Query di prova
    res.json({ message: 'Connessione riuscita!', time: result.rows[0] });
  } catch (error) {
    console.error('Errore nella connessione al database:', error);
    res.status(500).json({ error: 'Errore nella connessione al database' });
  }
});

router.get('/db/:table', async (req, res) => {
  const tableName = req.params.table;

  try {
    // Query dinamica per selezionare tutti i record dalla tabella
    const result = await pool.query(`SELECT * FROM ${tableName}`);
    
    // Restituire i record come risposta JSON
    res.json(result.rows);
  } catch (error) {
    console.error('Errore durante la query:', error);
    res.status(500).send('Errore nel recupero dei dati dal database');
  }
});

router.get('/user-types', async (req, res) => {
  try {
    // Recupera tutti i tipi di utente tranne quello con id = 1 (admin)
    const result = await pool.query('SELECT id, name FROM user_type WHERE id != 1');
    res.json(result.rows);
  } catch (error) {
    console.error('Errore durante il recupero dei tipi di utente:', error);
    res.status(500).json({ error: 'Errore durante il recupero dei tipi di utente' });
  }
});

router.post('/building-sites', async (req, res) => {
  const { name, notes, city, address, lat, lng } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Il campo "name" è obbligatorio' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO building_sites (name, notes, city, address, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, notes || null, city || null, address || null, lat || null, lng || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Errore durante l\'inserimento del record:', error);
    res.status(500).json({ error: 'Errore durante l\'inserimento del record' });
  }
});

router.get('/building-sites', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM building_sites');
    res.json(result.rows);
  } catch (error) {
    console.error('Errore durante il recupero dei building sites:', error);
    res.status(500).json({ error: 'Errore durante il recupero dei building sites' });
  }
});

router.get('/get-record/:table/:id', async (req, res) => {
  const tableName = req.params.table;
  const id = req.params.id;

  try {
    const result = await pool.query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record non trovato' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Errore durante la query:', error);
    res.status(500).send('Errore nel recupero dei dati dal database');
  }
});

router.get('/daily-presence') => {
  user_type_id = 1;
  building_site_id = 4;

  try {
    const result = await pool.query(`SELECT U.first_name, U.last_name FROM users U JOIN users_bulding_sites UB ON U.id = UB.user_id JOIN building_sites BS ON UB.site_id = BS.id JOIN user_types UT ON U.id = UT.user_id WHERE UT.user_type_id != $1 AND BS.id = $2 ORDER BY U.last_name`, [id, building_site_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record non trovato' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Errore durante la query:', error);
    res.status(500).send('Errore nel recupero dei dati dal database');
  }
}

module.exports = router;
