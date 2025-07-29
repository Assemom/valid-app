const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true
};

const dbName = process.env.DB_NAME;

async function initializeDatabase() {
  // Connect to MySQL server (no DB yet)
  const connection = await mysql.createConnection(dbConfig);
  // Create DB if not exists
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  // Use the DB
  await connection.query(`USE \`${dbName}\``);
  // Create table if not exists
  await connection.query(`CREATE TABLE IF NOT EXISTS programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE
  )`);
  return connection;
}

module.exports = { initializeDatabase }; 