const express = require('express');
const router = express.Router();
const pool = require('./db');
const authenticateToken = require('./authMiddleware');

// GET /api/templates-manager/templates
// Restituisce tutti i template dello user autenticato
router.get('/templates', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM templates WHERE owner_id = $1 ORDER BY updated_at DESC',
      [req.user.id]
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Errore durante il recupero dei template:', error);
    return res.status(500).json({ error: 'Errore durante il recupero dei template.' });
  }
});

// GET /api/templates-manager/templates/:templateId
// Restituisce un singolo template dello user autenticato
router.get('/templates/:templateId', authenticateToken, async (req, res) => {
  const { templateId } = req.params;

  if (!Number.isInteger(Number(templateId)) || Number(templateId) <= 0) {
    return res.status(400).json({ error: 'templateId non valido.' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM templates WHERE id = $1 AND owner_id = $2',
      [Number(templateId), req.user.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Template non trovato o non autorizzato.' });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Errore durante il recupero del template:', error);
    return res.status(500).json({ error: 'Errore durante il recupero del template.' });
  }
});

// POST /api/templates-manager/templates
// Crea un nuovo template
router.post('/templates', authenticateToken, async (req, res) => {
  const { name, content_json } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Il campo "name" è obbligatorio.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO templates (name, content_json, owner_id)
       VALUES ($1, $2::jsonb, $3)
       RETURNING *`,
      [
        String(name).trim(),
        content_json !== undefined ? JSON.stringify(content_json) : null,
        req.user.id,
      ]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Errore durante la creazione del template:', error);
    return res.status(500).json({ error: 'Errore durante la creazione del template.' });
  }
});

// PUT /api/templates-manager/templates/:templateId
// Modifica un template esistente
router.put('/templates/:templateId', authenticateToken, async (req, res) => {
  const { templateId } = req.params;
  const { name, content_json } = req.body;

  if (!Number.isInteger(Number(templateId)) || Number(templateId) <= 0) {
    return res.status(400).json({ error: 'templateId non valido.' });
  }

  if (name !== undefined && !String(name).trim()) {
    return res.status(400).json({ error: 'Il campo "name" non può essere vuoto.' });
  }

  const updates = [];
  const values = [];

  if (name !== undefined) {
    values.push(String(name).trim());
    updates.push(`name = $${values.length}`);
  }

  if (content_json !== undefined) {
    values.push(JSON.stringify(content_json));
    updates.push(`content_json = $${values.length}::jsonb`);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'Nessun campo da aggiornare.' });
  }

  try {
    values.push(Number(templateId));
    values.push(req.user.id);

    const query = `
      UPDATE templates
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${values.length - 1} AND owner_id = $${values.length}
      RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Template non trovato o non autorizzato.' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Errore durante la modifica del template:', error);
    return res.status(500).json({ error: 'Errore durante la modifica del template.' });
  }
});

module.exports = router;
