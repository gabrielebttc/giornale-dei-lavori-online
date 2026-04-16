const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('./db');
const authenticateToken = require('./authMiddleware');
const { getDownloadUrl, uploadBuffer, getFileMetadata } = require('./backblaze');

// ─── WOPI token helpers ──────────────────────────────────────────────────────

function createWopiToken(fileId, userId) {
    return jwt.sign(
        { fileId: Number(fileId), userId: Number(userId), type: 'wopi' },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
    );
}

function verifyWopiToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.type !== 'wopi') return null;
        return decoded;
    } catch {
        return null;
    }
}

function wopiAuth(req, res, next) {
    const token = req.query.access_token;
    if (!token) return res.status(401).json({ error: 'Token mancante' });
    const decoded = verifyWopiToken(token);
    if (!decoded) return res.status(401).json({ error: 'Token non valido' });
    req.wopiUser = decoded;
    next();
}

// ─── Editor URL endpoint (chiamato dal frontend, autenticato via JWT utente) ─

// GET /api/collabora/editor-url/:fileId
// Restituisce l'URL dell'iframe Collabora + access_token WOPI
router.get('/editor-url/:fileId', authenticateToken, async (req, res) => {
    const { fileId } = req.params;

    try {
        const result = await pool.query(
            'SELECT id, name, file_type FROM files WHERE id = $1 AND owner_id = $2',
            [Number(fileId), req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'File non trovato o non autorizzato' });
        }

        const token = createWopiToken(fileId, req.user.id);
        const ttlMs = 2 * 60 * 60 * 1000;

        const collaboraUrl = process.env.COLLABORA_URL || 'http://localhost:9980';
        const wopiBaseUrl = process.env.WOPI_BASE_URL || 'http://localhost:3001';
        const wopiSrc = `${wopiBaseUrl}/api/collabora/wopi/files/${fileId}`;

        const editorUrl =
            `${collaboraUrl}/browser/dist/cool.html` +
            `?WOPISrc=${encodeURIComponent(wopiSrc)}` +
            `&access_token=${token}` +
            `&access_token_ttl=${ttlMs}` +
            `&lang=it`;

        res.json({ editorUrl, fileName: result.rows[0].name });
    } catch (error) {
        console.error('collabora editor-url error:', error);
        res.status(500).json({ error: "Errore nella generazione dell'URL editor" });
    }
});

// ─── New file creation endpoint (chiamato dal frontend, autenticato via JWT) ──

// POST /api/collabora/new-file
// Crea un placeholder nel DB con tag='collabora_new'; Collabora aprirà un doc vuoto
router.post('/new-file', authenticateToken, async (req, res) => {
    const { fileName, fileType, buildingSiteId, date } = req.body;

    if (!fileName || !fileType || !buildingSiteId || !date) {
        return res.status(400).json({ error: 'Parametri mancanti' });
    }

    // storage_key univoco — nessun file caricato su B2 ancora
    const storageKey = `collabora_new_${req.user.id}_${Date.now()}_${fileName}`;

    try {
        const result = await pool.query(
            `INSERT INTO files (name, tag, file_type, date, building_site_id, owner_id, storage_key)
             VALUES ($1, 'collabora_new', $2, $3, $4, $5, $6)
             RETURNING id, name`,
            [fileName, fileType, date, Number(buildingSiteId), req.user.id, storageKey]
        );

        const { id, name } = result.rows[0];
        res.status(201).json({ fileId: id, fileName: name });
    } catch (error) {
        console.error('collabora new-file error:', error);
        res.status(500).json({ error: 'Errore nella creazione del file' });
    }
});

// ─── WOPI endpoints (chiamati da Collabora server-to-server) ─────────────────

// GET /api/collabora/wopi/files/:fileId
// WOPI CheckFileInfo — restituisce i metadati del file a Collabora
router.get('/wopi/files/:fileId', wopiAuth, async (req, res) => {
    const { fileId } = req.params;
    const { userId } = req.wopiUser;

    try {
        const result = await pool.query(
            `SELECT f.id, f.name, f.file_type, f.storage_key, f.tag,
                    u.first_name, u.last_name
             FROM files f
             JOIN users u ON u.id = $2
             WHERE f.id = $1`,
            [Number(fileId), Number(userId)]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'File non trovato' });
        }

        const file = result.rows[0];

        // File nuovo: dimensione 0, Collabora creerà un documento vuoto
        let size = 0;
        if (file.tag !== 'collabora_new') {
            const meta = await getFileMetadata(file.storage_key);
            size = meta.size;
        }

        res.json({
            BaseFileName: file.name,
            Size: size,
            OwnerId: String(userId),
            UserId: String(userId),
            UserFriendlyName: `${file.first_name} ${file.last_name}`,
            UserCanWrite: true,
            UserCanRename: false,
            DisablePrint: false,
            DisableExport: false,
            DisableCopy: false,
        });
    } catch (error) {
        console.error('WOPI CheckFileInfo error:', error);
        res.status(500).json({ error: 'Errore WOPI CheckFileInfo' });
    }
});

// GET /api/collabora/wopi/files/:fileId/contents
// WOPI GetFile — scarica il file da B2 e lo invia a Collabora
router.get('/wopi/files/:fileId/contents', wopiAuth, async (req, res) => {
    const { fileId } = req.params;

    try {
        const result = await pool.query(
            'SELECT storage_key, name, file_type, tag FROM files WHERE id = $1',
            [Number(fileId)]
        );

        if (result.rowCount === 0) return res.status(404).end();

        const { storage_key, name, file_type, tag } = result.rows[0];

        // Documento nuovo: corpo vuoto (per spec WOPI Collabora crea un file vuoto)
        if (tag === 'collabora_new') {
            res.setHeader('Content-Type', file_type || 'application/octet-stream');
            res.setHeader('Content-Length', '0');
            return res.status(200).end();
        }

        const downloadUrl = await getDownloadUrl(storage_key);

        const fileResponse = await fetch(downloadUrl);
        if (!fileResponse.ok) return res.status(502).end();

        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(name)}"`);
        res.setHeader('Content-Type', file_type || 'application/octet-stream');

        // Pipe lo stream direttamente nella risposta
        const { Readable } = require('stream');
        const nodeStream = Readable.fromWeb(fileResponse.body);
        nodeStream.pipe(res);
    } catch (error) {
        console.error('WOPI GetFile error:', error);
        res.status(500).end();
    }
});

// POST /api/collabora/wopi/files/:fileId/contents
// WOPI PutFile — Collabora invia il file modificato, lo salviamo su B2
router.post(
    '/wopi/files/:fileId/contents',
    wopiAuth,
    express.raw({ type: '*/*', limit: '50mb' }),
    async (req, res) => {
        const { fileId } = req.params;

        try {
            const result = await pool.query(
                'SELECT storage_key, file_type FROM files WHERE id = $1',
                [Number(fileId)]
            );

            if (result.rowCount === 0) return res.status(404).end();

            const { storage_key, file_type } = result.rows[0];
            const buffer = req.body; // Buffer grazie a express.raw()

            await uploadBuffer(storage_key, buffer, file_type || 'application/octet-stream');

            // Rimuove il tag 'collabora_new' dopo il primo salvataggio
            await pool.query(
                "UPDATE files SET tag = NULL WHERE id = $1 AND tag = 'collabora_new'",
                [Number(fileId)]
            );

            res.status(200).json({ LastModifiedTime: new Date().toISOString() });
        } catch (error) {
            console.error('WOPI PutFile error:', error);
            res.status(500).end();
        }
    }
);

module.exports = router;
