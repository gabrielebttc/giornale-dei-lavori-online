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

// ─── Template editor URL (chiamato dal frontend, autenticato via JWT) ──────────

// GET /api/collabora/editor-url/template/:templateId
router.get('/editor-url/template/:templateId', authenticateToken, async (req, res) => {
    const { templateId } = req.params;

    try {
        const result = await pool.query(
            'SELECT id, name FROM file_templates WHERE id = $1 AND owner_id = $2',
            [Number(templateId), req.user.id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Template non trovato o non autorizzato' });
        }

        const token = createWopiToken(templateId, req.user.id);
        const ttlMs = 2 * 60 * 60 * 1000;
        const collaboraUrl = process.env.COLLABORA_URL || 'http://localhost:9980';
        const wopiBaseUrl = process.env.WOPI_BASE_URL || 'http://localhost:3001';
        const wopiSrc = `${wopiBaseUrl}/api/collabora/wopi/templates/${templateId}`;

        const editorUrl =
            `${collaboraUrl}/browser/dist/cool.html` +
            `?WOPISrc=${encodeURIComponent(wopiSrc)}` +
            `&access_token=${token}` +
            `&access_token_ttl=${ttlMs}` +
            `&lang=it`;

        res.json({ editorUrl, fileName: result.rows[0].name });
    } catch (error) {
        console.error('collabora editor-url template error:', error);
        res.status(500).json({ error: "Errore nella generazione dell'URL editor" });
    }
});

// ─── Template CRUD ────────────────────────────────────────────────────────────

// POST /api/collabora/templates/new — crea un template vuoto
router.post('/templates/new', authenticateToken, async (req, res) => {
    const { fileName, fileType } = req.body;
    if (!fileName || !fileType) {
        return res.status(400).json({ error: 'Parametri mancanti' });
    }
    const storageKey = `templates/${req.user.id}_${Date.now()}_${fileName}`;
    try {
        const result = await pool.query(
            `INSERT INTO file_templates (name, file_type, storage_key, tag, owner_id)
             VALUES ($1, $2, $3, 'collabora_new', $4)
             RETURNING id, name`,
            [fileName, fileType, storageKey, req.user.id]
        );
        res.status(201).json({ templateId: result.rows[0].id, fileName: result.rows[0].name });
    } catch (error) {
        console.error('collabora templates/new error:', error);
        res.status(500).json({ error: 'Errore nella creazione del template' });
    }
});

// GET /api/collabora/templates — lista template dell'utente
router.get('/templates', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, file_type, created_at
             FROM file_templates
             WHERE owner_id = $1 AND (tag IS NULL OR tag != 'collabora_new')
             ORDER BY created_at DESC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('collabora templates list error:', error);
        res.status(500).json({ error: 'Errore nel recupero dei template' });
    }
});

// PATCH /api/collabora/templates/:id/rename — rinomina un template
router.patch('/templates/:id/rename', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Nome mancante' });
    try {
        const result = await pool.query(
            'UPDATE file_templates SET name = $1 WHERE id = $2 AND owner_id = $3 RETURNING id, name',
            [name.trim(), Number(id), req.user.id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Template non trovato' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('template rename error:', error);
        res.status(500).json({ error: 'Errore rinomina template' });
    }
});

// DELETE /api/collabora/templates/:id
router.delete('/templates/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM file_templates WHERE id = $1 AND owner_id = $2 RETURNING storage_key',
            [Number(id), req.user.id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Template non trovato o non autorizzato' });
        }
        const { deleteFile } = require('./backblaze');
        try { await deleteFile(result.rows[0].storage_key); } catch { /* ignora errori B2 */ }
        res.json({ success: true });
    } catch (error) {
        console.error('collabora templates delete error:', error);
        res.status(500).json({ error: 'Errore nella cancellazione del template' });
    }
});

// POST /api/collabora/create-from-template/:templateId
// Copia il file template su B2 e crea un nuovo record in files
router.post('/create-from-template/:templateId', authenticateToken, async (req, res) => {
    const { templateId } = req.params;
    const { buildingSiteId, date } = req.body;
    if (!buildingSiteId || !date) {
        return res.status(400).json({ error: 'Parametri mancanti' });
    }

    try {
        const tmplResult = await pool.query(
            'SELECT name, file_type, storage_key, tag FROM file_templates WHERE id = $1 AND owner_id = $2',
            [Number(templateId), req.user.id]
        );
        if (tmplResult.rowCount === 0) {
            return res.status(404).json({ error: 'Template non trovato' });
        }
        const tmpl = tmplResult.rows[0];

        const { randomUUID } = require('crypto');
        const path = require('path');
        const ext = path.extname(tmpl.name);
        const newStorageKey = `uploads/${randomUUID()}-site${buildingSiteId}${ext}`;

        // Copia il contenuto del template sul nuovo storage key
        if (tmpl.tag !== 'collabora_new') {
            const { getDownloadUrl, uploadBuffer } = require('./backblaze');
            const downloadUrl = await getDownloadUrl(tmpl.storage_key);
            const fileResponse = await fetch(downloadUrl);
            if (!fileResponse.ok) throw new Error('Errore download template da B2');
            const buffer = Buffer.from(await fileResponse.arrayBuffer());
            await uploadBuffer(newStorageKey, buffer, tmpl.file_type);
        }

        const fileResult = await pool.query(
            `INSERT INTO files (name, file_type, storage_key, building_site_id, owner_id, date, tag)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, name`,
            [
                tmpl.name,
                tmpl.file_type,
                newStorageKey,
                Number(buildingSiteId),
                req.user.id,
                date,
                tmpl.tag === 'collabora_new' ? 'collabora_new' : null,
            ]
        );

        res.status(201).json({ fileId: fileResult.rows[0].id, fileName: fileResult.rows[0].name });
    } catch (error) {
        console.error('create-from-template error:', error);
        res.status(500).json({ error: 'Errore nella creazione del documento dal template' });
    }
});

// ─── WOPI endpoints per template ─────────────────────────────────────────────

// GET /api/collabora/wopi/templates/:templateId — CheckFileInfo
router.get('/wopi/templates/:templateId', wopiAuth, async (req, res) => {
    const { templateId } = req.params;
    const { userId } = req.wopiUser;

    try {
        const result = await pool.query(
            `SELECT t.id, t.name, t.file_type, t.storage_key, t.tag,
                    u.first_name, u.last_name
             FROM file_templates t
             JOIN users u ON u.id = $2
             WHERE t.id = $1`,
            [Number(templateId), Number(userId)]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Template non trovato' });

        const tmpl = result.rows[0];
        let size = 0;
        if (tmpl.tag !== 'collabora_new') {
            const meta = await getFileMetadata(tmpl.storage_key);
            size = meta.size;
        }

        res.json({
            BaseFileName: tmpl.name,
            Size: size,
            OwnerId: String(userId),
            UserId: String(userId),
            UserFriendlyName: `${tmpl.first_name} ${tmpl.last_name}`,
            UserCanWrite: true,
            UserCanRename: false,
            DisablePrint: false,
            DisableExport: false,
            DisableCopy: false,
        });
    } catch (error) {
        console.error('WOPI template CheckFileInfo error:', error);
        res.status(500).json({ error: 'Errore WOPI CheckFileInfo' });
    }
});

// GET /api/collabora/wopi/templates/:templateId/contents — GetFile
router.get('/wopi/templates/:templateId/contents', wopiAuth, async (req, res) => {
    const { templateId } = req.params;

    try {
        const result = await pool.query(
            'SELECT storage_key, name, file_type, tag FROM file_templates WHERE id = $1',
            [Number(templateId)]
        );
        if (result.rowCount === 0) return res.status(404).end();

        const { storage_key, name, file_type, tag } = result.rows[0];

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
        const { Readable } = require('stream');
        Readable.fromWeb(fileResponse.body).pipe(res);
    } catch (error) {
        console.error('WOPI template GetFile error:', error);
        res.status(500).end();
    }
});

// POST /api/collabora/wopi/templates/:templateId/contents — PutFile
router.post(
    '/wopi/templates/:templateId/contents',
    wopiAuth,
    express.raw({ type: '*/*', limit: '50mb' }),
    async (req, res) => {
        const { templateId } = req.params;
        try {
            const result = await pool.query(
                'SELECT storage_key, file_type FROM file_templates WHERE id = $1',
                [Number(templateId)]
            );
            if (result.rowCount === 0) return res.status(404).end();

            const { storage_key, file_type } = result.rows[0];
            await uploadBuffer(storage_key, req.body, file_type || 'application/octet-stream');

            await pool.query(
                "UPDATE file_templates SET tag = NULL WHERE id = $1 AND tag = 'collabora_new'",
                [Number(templateId)]
            );

            res.status(200).json({ LastModifiedTime: new Date().toISOString() });
        } catch (error) {
            console.error('WOPI template PutFile error:', error);
            res.status(500).end();
        }
    }
);

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
