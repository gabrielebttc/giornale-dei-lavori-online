const jwt = require('jsonwebtoken');

/**
 * Genera access token e refresh token per un dato userId.
 * Le scadenze vengono lette dalle variabili d'ambiente.
 */
function generateTokens(userId) {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
}

/**
 * Imposta il refresh token come cookie HttpOnly nella risposta.
 */
function setRefreshCookie(res, refreshToken) {
  const days = parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || '7');
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: days * 24 * 60 * 60 * 1000,
  });
}

module.exports = { generateTokens, setRefreshCookie };
