require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const http = require('http');
const pool = require('./db');
const authRoutes = require('./authRoutes'); // Importa il router da authRoutes.js
const apiRoutes = require('./apiRoutes');
const { initializeSocket } = require('./socket');

const app = express();
const port = 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'https://localhost:5173', 'http://localhost:80', 'http://localhost', 'http://57.129.13.2', 'http://57.129.13.2:80', 'https://giornaledeilavori.gabrielebuttice.com'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS', 'HEAD'],
}));
app.use(express.json());

// Aggiungi le rotte di autenticazione
app.use('/api/auth', authRoutes);

// Usa le altre rotte API
app.use('/api/', apiRoutes);

const server = http.createServer(app);

initializeSocket(server);

server.listen(port, () => {
  console.log(`Server in ascolto su http://localhost:${port}`);
});