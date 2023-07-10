const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: '12345',
  port: process.env.DB_PORT
});

// Consulta a la base de datos
pool.query('SELECT * FROM usuarios', (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log(res.rows);
  }
  //pool.end(); // Cierra la conexión cuando haya terminado la consulta
});

module.exports = pool;
