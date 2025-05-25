require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const http = require('http'); // Importa il modulo HTTP per creare il server
const pool = require('./db'); // Connessione al DB
const apiRoutes = require('./apiRoutes'); // Importa le rotte API
const { initializeSocket } = require('./socket'); // Inizializza il socket

const app = express();
const port = 3001;

app.use(cors({
  origin: ['http://localhost:5173'],  // Consenti richieste da queste origini
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS', 'HEAD'],  // Aggiungi tutti i metodi HTTP necessari
}));
app.use(express.json());

// Usa le API definite in apiRoutes.js
app.use('/api/', apiRoutes);

// Crea un server HTTP per supportare sia Express che WebSocket
const server = http.createServer(app);

// Inizializza il WebSocket
initializeSocket(server);

// Avvia il server
server.listen(port, () => {
  console.log(`Server in ascolto su http://localhost:${port}`);
});
