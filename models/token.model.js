const pool = require('../config/db');

async function saveRefreshToken(userId, token, expiresAt) {
  await pool.execute(
    'INSERT INTO refresh_tokens (userId, token, expiresAt) VALUES (?, ?, ?)',
    [userId, token, expiresAt]
  );
  return;
}

async function findRefreshToken(token) {
  const [rows] = await pool.execute('SELECT * FROM refresh_tokens WHERE token = ?', [token]);
  return rows[0];
}

async function deleteRefreshToken(token) {
  await pool.execute('DELETE FROM refresh_tokens WHERE token = ?', [token]);
  return;
}

module.exports = { saveRefreshToken, findRefreshToken, deleteRefreshToken };
