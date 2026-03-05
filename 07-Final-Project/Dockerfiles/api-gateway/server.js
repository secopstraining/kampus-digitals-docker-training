const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE_URL || 'http://product-service:5000';
const ORDER_SERVICE = process.env.ORDER_SERVICE_URL || 'http://order-service:5001';

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'api-gateway' });
});

// Products proxy
app.get('/api/products', async (req, res) => {
    try {
        const response = await axios.get(`${PRODUCT_SERVICE}/api/products`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Product service unavailable' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const response = await axios.get(`${PRODUCT_SERVICE}/api/products/${req.params.id}`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Product service unavailable' });
    }
});

// Orders proxy
app.get('/api/orders', async (req, res) => {
    try {
        const response = await axios.get(`${ORDER_SERVICE}/api/orders`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Order service unavailable' });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const response = await axios.post(`${ORDER_SERVICE}/api/orders`, req.body);
        res.status(201).json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Order service unavailable' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API Gateway running on port ${port}`);
});
