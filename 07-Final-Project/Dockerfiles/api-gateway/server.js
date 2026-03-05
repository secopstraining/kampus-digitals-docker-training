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

// Proxy helper - upstream hata kodlarini korur
function proxyError(err, res, serviceName) {
    if (err.response) {
        res.status(err.response.status).json(err.response.data);
    } else {
        res.status(502).json({ error: `${serviceName} unavailable` });
    }
}

// Products proxy
app.get('/api/products', async (req, res) => {
    try {
        const response = await axios.get(`${PRODUCT_SERVICE}/api/products`);
        res.json(response.data);
    } catch (err) {
        proxyError(err, res, 'Product service');
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const response = await axios.get(`${PRODUCT_SERVICE}/api/products/${req.params.id}`);
        res.json(response.data);
    } catch (err) {
        proxyError(err, res, 'Product service');
    }
});

// Orders proxy
app.get('/api/orders', async (req, res) => {
    try {
        const response = await axios.get(`${ORDER_SERVICE}/api/orders`);
        res.json(response.data);
    } catch (err) {
        proxyError(err, res, 'Order service');
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const response = await axios.post(`${ORDER_SERVICE}/api/orders`, req.body);
        res.status(201).json(response.data);
    } catch (err) {
        proxyError(err, res, 'Order service');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API Gateway running on port ${port}`);
});
