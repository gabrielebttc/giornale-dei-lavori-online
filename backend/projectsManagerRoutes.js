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

  if (!date || isNaN(new Date(String(date)).getTime())) {
    return res.status(400).json({ error: 'Il campo "date" non e una data valida.' });
  }

  try {
    const siteCheck = await pool.query(
      'SELECT id FROM building_sites WHERE id = $1 AND owner_id = $2',
      [Number(building_site_id), req.user.id]
    );

    if (siteCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Cantiere non trovato o non autorizzato.' });
    }

    console.log("DATAAAA CHE STO CARICANDO SUL DB: ", String(date))

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

    console.log("DATAAAA CARICATA SUL DB (RETURING *): ", String(result.rows[0].date))
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Errore durante la creazione del progetto:', error);
    return res.status(500).json({ error: 'Errore durante la creazione del progetto.' });
  }
});

router.put('/projects/:projectId', authenticateToken, async (req, res) => {
  const { projectId } = req.params;
  const { name, content_json, metadata, building_site_id, date } = req.body;

  if (!Number.isInteger(Number(projectId)) || Number(projectId) <= 0) {
    return res.status(400).json({ error: 'projectId non valido.' });
  }

  if (name !== undefined && !String(name).trim()) {
    return res.status(400).json({ error: 'Il campo "name" non puo essere vuoto.' });
  }

  if (content_json !== undefined && content_json === null) {
    return res.status(400).json({ error: 'Il campo "content_json" non puo essere null.' });
  }

  if (building_site_id !== undefined && (!Number.isInteger(Number(building_site_id)) || Number(building_site_id) <= 0)) {
    return res.status(400).json({ error: 'Il campo "building_site_id" deve essere un intero positivo.' });
  }

  if (date !== undefined && (!date || isNaN(new Date(String(date)).getTime()))) {
    return res.status(400).json({ error: 'Il campo "date" non e una data valida.' });
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

  if (metadata !== undefined) {
    values.push(metadata === null ? null : JSON.stringify(metadata));
    updates.push(`metadata = $${values.length}::jsonb`);
  }

  if (building_site_id !== undefined) {
    values.push(Number(building_site_id));
    updates.push(`building_site_id = $${values.length}`);
  }

  if (date !== undefined) {
    values.push(String(date));
    updates.push(`date = $${values.length}`);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'Nessun campo da aggiornare.' });
  }

  try {
    if (building_site_id !== undefined) {
      const siteCheck = await pool.query(
        'SELECT id FROM building_sites WHERE id = $1 AND owner_id = $2',
        [Number(building_site_id), req.user.id]
      );

      if (siteCheck.rowCount === 0) {
        return res.status(404).json({ error: 'Cantiere non trovato o non autorizzato.' });
      }
    }

    values.push(Number(projectId));
    values.push(req.user.id);

    const query = `
      UPDATE projects
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${values.length - 1} AND owner_id = $${values.length}
      RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Progetto non trovato o non autorizzato.' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Errore durante la modifica del progetto:', error);
    return res.status(500).json({ error: 'Errore durante la modifica del progetto.' });
  }
});

router.get('/projects/:projectId', authenticateToken, async (req, res) => {
  const { projectId } = req.params;

  if (!Number.isInteger(Number(projectId)) || Number(projectId) <= 0) {
    return res.status(400).json({ error: 'projectId non valido.' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND owner_id = $2',
      [Number(projectId), req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Progetto non trovato o non autorizzato.' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Errore durante il recupero del progetto:', error);
    return res.status(500).json({ error: 'Errore durante il recupero del progetto.' });
  }
});

router.get('/building-sites/:buildingSiteId/projects', authenticateToken, async (req, res) => {
  const { buildingSiteId } = req.params;

  if (!Number.isInteger(Number(buildingSiteId)) || Number(buildingSiteId) <= 0) {
    return res.status(400).json({ error: 'buildingSiteId non valido.' });
  }

  try {
    const resultProjects = await pool.query(
      'SELECT id, name, content_json, metadata, created_at, updated_at, owner_id, building_site_id, date FROM projects WHERE building_site_id = $1 AND owner_id = $2 ORDER BY date ASC, created_at ASC',
      [Number(buildingSiteId), req.user.id]
    );

    console.log(`Progetti trovati per cantiere ${buildingSiteId}:`, resultProjects.rows);
    return res.status(200).json(resultProjects.rows);
  } catch (error) {
    console.error('Errore durante il recupero dei progetti per cantiere:', error);
    return res.status(500).json({ error: 'Errore durante il recupero dei progetti dal database' });
  }
});

module.exports = router;
