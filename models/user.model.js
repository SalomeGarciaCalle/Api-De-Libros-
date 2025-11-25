const pool = require('../config/db');

async function createUser(email, passwordHash, role = 'user') {
  const [result] = await pool.execute(
    'INSERT INTO users (email, passwordHash, role) VALUES (?, ?, ?)',
    [email, passwordHash, role]
  );
  return { id: result.insertId, email, role };
}

async function findUserByEmail(email) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function findUserById(id) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
}

module.exports = { createUser, findUserByEmail, findUserById };
