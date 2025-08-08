const { Server } = require('socket.io');
const pool = require('./db'); // Importa la connessione al database

function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173', 'http://localhost:80', 'http://localhost'],
            methods: ["GET", "POST", 'PATCH', 'DELETE', 'PUT', 'OPTIONS', 'HEAD'],
        },
    });

    io.on("connection", (socket) => {
        io.emit("clientConnected");

        

        // Gestione della disconnessione
        socket.on("disconnect", () => {
            console.log(`Client disconnesso: ${socket.id}`);
        });
    });

    console.log("WebSocket inizializzato");

}


module.exports = { initializeSocket };
