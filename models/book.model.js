const pool = require('../config/db');

async function getAllBooks() {
  const [rows] = await pool.query('SELECT * FROM books ORDER BY createdAt DESC');
  return rows;
}

async function getBookById(id) {
  const [rows] = await pool.execute('SELECT * FROM books WHERE id = ?', [id]);
  return rows[0];
}

async function createBook({ title, author, description, coverUrl, stock = 1, price = 0 }) {
  const [res] = await pool.execute(
    `INSERT INTO books (title, author, description, coverUrl, stock, price)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, author, description, coverUrl, stock, price]
  );
  return { id: res.insertId, title, author, description, coverUrl, stock, price };
}

async function updateBook(id, data) {
  const fields = [];
  const values = [];
  for (const key of ['title','author','description','coverUrl','stock','price']) {
    if (key in data) { fields.push(`${key} = ?`); values.push(data[key]); }
  }
  if (fields.length === 0) return getBookById(id);
  values.push(id);
  await pool.execute(`UPDATE books SET ${fields.join(', ')} WHERE id = ?`, values);
  return getBookById(id);
}

async function deleteBook(id) {
  await pool.execute('DELETE FROM books WHERE id = ?', [id]);
  return;
}

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
