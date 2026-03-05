const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST || 'db',
    port: 5432,
    user: process.env.DB_USER || 'techflow',
    password: process.env.DB_PASS || 'techflow123',
    database: process.env.DB_NAME || 'orders'
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'order-service' });
});

// Get all orders
app.get('/api/orders', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 50');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create order
app.post('/api/orders', async (req, res) => {
    const { customer_name, product_id, quantity } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO orders (customer_name, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [customer_name, product_id, quantity]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get order by ID
app.get('/api/orders/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`Order service running on port ${port}`);
});
