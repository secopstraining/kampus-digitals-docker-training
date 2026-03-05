const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

app.use(cors());

// PostgreSQL baglantisi
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: 5432,
  user: process.env.DB_USER || 'kampus',
  password: process.env.DB_PASS || 'kampus123',
  database: process.env.DB_NAME || 'kampusdb'
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
