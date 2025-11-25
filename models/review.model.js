const pool = require('../config/db');

async function createReview({ userId, bookId, rating, comment }) {
  const [res] = await pool.execute(
    'INSERT INTO reviews (userId, bookId, rating, comment) VALUES (?, ?, ?, ?)',
    [userId, bookId, rating, comment]
  );
  return { id: res.insertId, userId, bookId, rating, comment };
}

async function getReviewsByBook(bookId) {
  const [rows] = await pool.execute(
    `SELECT r.*, u.email as userEmail FROM reviews r
     JOIN users u ON u.id = r.userId
     WHERE bookId = ? ORDER BY createdAt DESC`, [bookId]
  );
  return rows;
}

module.exports = { createReview, getReviewsByBook };
