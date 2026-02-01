/*
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

require('dotenv').config({ path: './.env' });

const { v4: uuidv4 } = require('uuid');
const path = require('path');

const s3 = new S3Client({
    endpoint: process.env.BACKBLAZE_ENDPOINT,
    region: process.env.BACKBLAZE_REGION,
    credentials: {
        accessKeyId: process.env.BACKBLAZE_ACCESS_KEY_ID,
        secretAccessKey: process.env.BACKBLAZE_SECRET_ACCESS_KEY,
    },
});

async function getUploadUrl(fileName, contentType, buildingSiteId) {
    const extension = path.extname(fileName); // es: .jpg
    const storageKey = `uploads/${uuidv4()}-site${buildingSiteId}${extension}`; // es: uploads/f47ac10b-58cc-4372-a567-0e02b2c3d479-site5.jpg

    const command = new PutObjectCommand({
        Bucket: process.env.BACKBLAZE_BUCKET_NAME,
        Key: storageKey,
        ContentType: contentType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 600 });
    
    return { url, storageKey };
}

async function getDownloadUrl(storageKey) {
    const command = new GetObjectCommand({
        Bucket: process.env.BACKBLAZE_BUCKET_NAME,
        Key: storageKey,
    });

    // L'URL scadrà tra 3600 secondi (1 ora)
    return await getSignedUrl(s3, command, { expiresIn: 3600 });
}

module.exports = { getUploadUrl, getDownloadUrl };
*/
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require('dotenv').config({ path: './.env' });
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const s3 = new S3Client({
    endpoint: process.env.BACKBLAZE_ENDPOINT,
    region: process.env.BACKBLAZE_REGION,
    credentials: {
        accessKeyId: process.env.BACKBLAZE_ACCESS_KEY_ID,
        secretAccessKey: process.env.BACKBLAZE_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
    // AGGIUNGI QUESTE DUE RIGHE:
    responseChecksumAlgorithm: undefined,
    requestChecksumCalculation: "WHEN_REQUIRED" 
});

async function getUploadUrl(fileName, contentType, buildingSiteId) {
    const extension = path.extname(fileName);
    const storageKey = `uploads/${uuidv4()}-site${buildingSiteId}${extension}`;

    const command = new PutObjectCommand({
        Bucket: process.env.BACKBLAZE_BUCKET_NAME,
        Key: storageKey,
        ContentType: contentType,
        // Forza l'assenza di checksum nel comando
        ChecksumAlgorithm: undefined 
    });

    // Usa questa configurazione per pulire l'URL dai parametri extra
    const url = await getSignedUrl(s3, command, { 
        expiresIn: 600
    });
    
    return { url, storageKey };
}

async function getDownloadUrl(storageKey) {
    const command = new GetObjectCommand({
        Bucket: process.env.BACKBLAZE_BUCKET_NAME,
        Key: storageKey,
    });
    return await getSignedUrl(s3, command, { expiresIn: 3600 });
}

module.exports = { getUploadUrl, getDownloadUrl };