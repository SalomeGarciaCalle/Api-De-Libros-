const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'lib_user',      // <-- tu usuario
  password: '1234',      // <-- tu contraseña
  database: 'librarydb', // <-- tu base
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
