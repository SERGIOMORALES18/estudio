const mysql = require('mysql2/promise');

// configuración de la conexión; utiliza variables de entorno cuando sea posible
// para no tener credenciales en el código fuente.
// Ejemplo de export en Windows PowerShell:
//   $env:DB_USER='root'; $env:DB_PASSWORD='root123';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root123',
  database: process.env.DB_NAME || 'velvet',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
