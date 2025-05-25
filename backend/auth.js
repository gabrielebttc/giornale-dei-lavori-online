const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Recupera il token dall'header Authorization

  if (!token) {
    return res.status(401).json({ error: 'Accesso negato. Token mancante.' });
  }

  try {
    // Verifica il token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Aggiungi i dati dell'utente alla richiesta
    next(); // Passa al prossimo middleware o route handler
  } catch (error) {
    return res.status(403).json({ error: 'Token non valido.' });
  }
};

module.exports = authenticateToken;