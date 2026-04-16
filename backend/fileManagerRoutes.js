const express = require('express');
const router = express.Router();
const pool = require('./db');
const authenticateToken = require('./authMiddleware');
const { getUploadUrl, getDownloadUrl, deleteFile } = require('./backblaze');

router.post('/get-upload-link', authenticateToken, async (req, res) => {
    const { fileName, fileType, buildingSiteId } = req.body;

    try {
        const siteCheck = await pool.query(
            'SELECT id FROM building_sites WHERE id = $1 AND owner_id = $2',
            [Number(buildingSiteId), req.user.id]
        );

        if (siteCheck.rowCount === 0) {
            return res.status(404).json({ error: 'Cantiere non trovato o non autorizzato' });
        }

        const { url, storageKey } = await getUploadUrl(fileName, fileType, buildingSiteId);

        res.status(200).json({ uploadUrl: url, storageKey });
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: `Errore nella generazione dell'URL: ${error}` });
    }
});

router.post('/confirm-file-upload', authenticateToken, async (req, res) => {
    const { storageKey, originalName, buildingSiteId, mimeType, date, projectId } = req.body;
    const finalMimeType = mimeType.substring(0, 36);

    try {
        const siteCheck = await pool.query(
            'SELECT id FROM building_sites WHERE id = $1 AND owner_id = $2',
            [Number(buildingSiteId), req.user.id]
        );

        if (siteCheck.rowCount === 0) {
            return res.status(404).json({ error: 'Cantiere non trovato o non autorizzato' });
        }

        let finalProjectId = null;
        if (projectId !== undefined && projectId !== null && projectId !== '') {
            const projectCheck = await pool.query(
                'SELECT id FROM projects WHERE id = $1 AND building_site_id = $2 AND owner_id = $3',
                [Number(projectId), Number(buildingSiteId), req.user.id]
            );

            if (projectCheck.rowCount === 0) {
                return res.status(404).json({ error: 'Progetto non trovato o non autorizzato' });
            }

            finalProjectId = Number(projectId);
        }

        const query = `
            INSERT INTO files (storage_key, name, building_site_id, owner_id, file_type, date, project_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
        
        const values = [storageKey, originalName, buildingSiteId, req.user.id, finalMimeType, date, finalProjectId];
        const result = await pool.query(query, values);

        res.json({ success: true, file: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Errore nel salvataggio dei dati: ${error}` });
    }
});

router.post('/get-download-link', authenticateToken, async (req, res) => {
    try {
        const { storageKey } = req.body;

        const fileCheck = await pool.query(
            'SELECT id FROM files WHERE storage_key = $1 AND owner_id = $2',
            [storageKey, req.user.id]
        );

        if (fileCheck.rowCount === 0) {
            return res.status(404).json({ error: 'File non trovato o non autorizzato' });
        }

        const uploadUrl = await getDownloadUrl(storageKey);

        res.status(200).json({ uploadUrl });
    } catch {
        res.status(500).json({ error: "Errore nella generazione dell'URL" });
    }
});

router.get('/files/:buildingSiteId', authenticateToken, async (req, res) => {
    try {
        const { buildingSiteId } = req.params;
        const resultFiles = await pool.query(
            'SELECT * FROM files WHERE building_site_id = $1 AND owner_id = $2 ORDER BY date ASC, uploaded_at ASC',
            [buildingSiteId, req.user.id]
        );
        
        res.status(200).json(resultFiles.rows);
    } catch {
        res.status(500).json({ error: "Errore durante il recupero dei files dal database" });
    }
});

router.delete('/delete-file/:storage_key', authenticateToken, async (req, res) => {
    const { storage_key } = req.params;

    try {
        const fileCheck = await pool.query(
            'SELECT id FROM files WHERE storage_key = $1 AND owner_id = $2',
            [storage_key, req.user.id]
        );

        if (fileCheck.rowCount === 0) {
            return res.status(404).json({ error: 'File non trovato o non autorizzato' });
        }

        await deleteFile(storage_key);
        res.status(200).json({ success: true, message: "File eliminato" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Errore durante l'eliminazione" });
    }
});

// GET /api/file-manager/files/:id/meta — restituisce i metadati di un singolo file
router.get('/files/:id/meta', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT id, name, date FROM files WHERE id = $1 AND owner_id = $2',
            [Number(id), req.user.id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'File non trovato o non autorizzato' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Errore recupero metadati file:', error);
        res.status(500).json({ error: 'Errore durante il recupero' });
    }
});

// PATCH /api/file-manager/files/:id — aggiorna nome e/o data di un file
router.patch('/files/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, date } = req.body;

    if (!name && !date) {
        return res.status(400).json({ error: 'Nessun campo da aggiornare' });
    }

    try {
        const check = await pool.query(
            'SELECT id FROM files WHERE id = $1 AND owner_id = $2',
            [Number(id), req.user.id]
        );
        if (check.rowCount === 0) {
            return res.status(404).json({ error: 'File non trovato o non autorizzato' });
        }

        const fields = [];
        const values = [];
        let idx = 1;
        if (name) { fields.push(`name = $${idx++}`); values.push(name); }
        if (date) { fields.push(`date = $${idx++}`); values.push(date); }
        values.push(Number(id));

        const result = await pool.query(
            `UPDATE files SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, name, date`,
            values
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Errore aggiornamento file:', error);
        res.status(500).json({ error: "Errore durante l'aggiornamento" });
    }
});

module.exports = router;