const express = require('express');
const router = express.Router();
const pool = require('./db');
const authenticateToken = require('./authMiddleware');
const { getUploadUrl, getDownloadUrl } = require('./backblaze');

router.post('/get-upload-link', authenticateToken, async (req, res) => {
    const { fileName, fileType, buildingSiteId } = req.body;

    try {
        const { url, storageKey } = await getUploadUrl(fileName, fileType, buildingSiteId);

        res.status(200).json({ uploadUrl: url, storageKey });
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: `Errore nella generazione dell'URL: ${error}` });
    }
});

router.post('/confirm-file-upload', authenticateToken, async (req, res) => {
    const { storageKey, originalName, buildingSiteId, mimeType } = req.body;

    try {
        const query = `
            INSERT INTO files (storage_key, name, building_site_id, owner_id, file_type)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        
        const values = [storageKey, originalName, buildingSiteId, req.user.id, mimeType];
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
        const uploadUrl = await getDownloadUrl(storageKey);

        res.status(200).json({ uploadUrl });
    } catch {
        res.status(500).json({ error: "Errore nella generazione dell'URL" });
    }
});

module.exports = router;