const { Pool, types } = require('pg');
require('dotenv').config({ path: './.env' });

// OID 1082 è il tipo DATE (senza orario)
// Diciamo al driver di restituire il valore così come stringa ("2026-06-19")
types.setTypeParser(1082, function(val) {
  return val; 
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Usa la variabile d'ambiente
});

module.exports = pool;
