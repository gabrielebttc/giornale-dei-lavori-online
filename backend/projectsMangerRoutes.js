const express = require('express');
const router = express.Router();
const pool = require('./db');
const authenticateToken = require('./authMiddleware');

router.post('/projects', authenticateToken, async (req, res) => {
  const { name, content_json, metadata, building_site_id, date } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Il campo "name" e obbligatorio.' });
  }

  if (content_json === undefined || content_json === null) {
    return res.status(400).json({ error: 'Il campo "content_json" e obbligatorio.' });
  }

  if (!Number.isInteger(Number(building_site_id)) || Number(building_site_id) <= 0) {
    return res.status(400).json({ error: 'Il campo "building_site_id" deve essere un intero positivo.' });
  }

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
    return res.status(400).json({ error: 'Il campo "date" deve avere formato YYYY-MM-DD.' });
  }

  try {
    const siteCheck = await pool.query(
      'SELECT id FROM building_sites WHERE id = $1 AND owner_id = $2',
      [Number(building_site_id), req.user.id]
    );

    if (siteCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Cantiere non trovato o non autorizzato.' });
    }

    const result = await pool.query(
      `INSERT INTO projects (name, content_json, metadata, owner_id, building_site_id, date)
       VALUES ($1, $2::jsonb, $3::jsonb, $4, $5, $6)
       RETURNING *`,
      [
        String(name).trim(),
        JSON.stringify(content_json),
        metadata === undefined ? null : JSON.stringify(metadata),
        req.user.id,
        Number(building_site_id),
        date,
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Errore durante la creazione del progetto:', error);
    return res.status(500).json({ error: 'Errore durante la creazione del progetto.' });
  }
});

module.exports = router;
