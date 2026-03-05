# MODUL 7: Final Projesi - Kampus Digitals E-Commerce Platform

> Video: [YouTube Playlist](https://www.youtube.com/watch?v=fV6UCxSjxUE&list=PL9VRN2-Oku1lvLCq3mzUzaj88-CcVTNlX) uzerinden bu modulun uygulama videosunu izleyebilirsiniz.

## Proje Hedefi

Gercek dunya senaryosu: Mikroservis mimarisinde e-ticaret platformu deploy edin.

### Mimari:
```
                    +------------------+
                    |    Frontend      |
                    |  (Nginx:40090)   |
                    +--------+---------+
                             |
                    +--------v---------+
                    |   API Gateway    |
                    | (Node.js:40001)  |
                    +--------+---------+
                             |
            +----------------+----------------+
            |                |                |
   +--------v--------+ +-----v------+ +-------v--------+
   | Product Service | |   Redis    | | Order Service  |
   | (Flask:5000)    | |  (Cache)   | | (Node:5001)    |
   +--------+--------+ +------------+ +-------+--------+
            |                                  |
            +----------------+-----------------+
                             |
                    +--------v---------+
                    |   PostgreSQL     |
                    |    (orders)      |
                    +------------------+
```

### Servisler:

| Servis | Teknoloji | Port | Aciklama |
|--------|-----------|------|----------|
| Frontend | Nginx | 40090 | Web arayuzu |
| API Gateway | Node.js | 40001 | Tum API isteklerini yonlendirir |
| Product Service | Python Flask | 5000 (internal) | Urun yonetimi |
| Order Service | Node.js | 5001 (internal) | Siparis yonetimi |
| PostgreSQL | PostgreSQL 15 | 5432 (internal) | Veritabani |
| Redis | Redis 7 | 6379 (internal) | Cache |

## Uygulama

### Proje Yapisi Olustur

```bash
mkdir -p ~/Kampus_Docker_Project/07-Final-Project/Dockerfiles/{product-service,order-service,api-gateway,frontend}
cd ~/Kampus_Docker_Project/07-Final-Project
```

### Product Service (Python Flask)

```bash
cd Dockerfiles/product-service

cat > app.py << 'EOF'
from flask import Flask, jsonify
import os
import json
import redis

app = Flask(__name__)

# Redis connection
redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'redis'),
    port=6379,
    decode_responses=True
)

# Sample products
PRODUCTS = [
    {"id": 1, "name": "Laptop", "price": 999.99, "stock": 50},
    {"id": 2, "name": "Smartphone", "price": 699.99, "stock": 100},
    {"id": 3, "name": "Headphones", "price": 149.99, "stock": 200},
    {"id": 4, "name": "Keyboard", "price": 79.99, "stock": 150},
    {"id": 5, "name": "Mouse", "price": 49.99, "stock": 300},
]

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "service": "product-service"})

@app.route('/api/products')
def get_products():
    # Try to get from cache
    cached = redis_client.get('products')
    if cached:
        return jsonify({"source": "cache", "products": json.loads(cached)})

    # Cache miss - store in Redis
    redis_client.setex('products', 60, json.dumps(PRODUCTS))
    return jsonify({"source": "database", "products": PRODUCTS})

@app.route('/api/products/<int:product_id>')
def get_product(product_id):
    product = next((p for p in PRODUCTS if p['id'] == product_id), None)
    if product:
        return jsonify(product)
    return jsonify({"error": "Product not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
EOF

cat > requirements.txt << 'EOF'
Flask==3.0.0
redis==5.0.1
Werkzeug==3.0.1
EOF

cat > Dockerfile << 'EOF'
FROM python:3.11-slim
LABEL maintainer="kampus@example.com"
LABEL service="product-service"

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .

USER appuser
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/health')" || exit 1

CMD ["python", "app.py"]
EOF

cd ../..
```

> **Onemli Noktalar:**
> - `adduser/addgroup`: Container icinde root yerine ozel kullanici olusturuyoruz (guvenlik best practice)
> - `USER appuser`: Bu satirdan sonraki komutlar root degil appuser olarak calisir
> - `HEALTHCHECK`: Container saglik durumunu kontrol eder. `curl` yerine `python` kullaniyoruz cunku slim image'da curl yok

### Order Service (Node.js)

```bash
cd Dockerfiles/order-service

cat > server.js << 'EOF'
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST || 'db',
    port: 5432,
    user: process.env.DB_USER || 'kampus',
    password: process.env.DB_PASS || 'kampus123',
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

const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`Order service running on port ${port}`);
});
EOF

cat > package.json << 'EOF'
{
    "name": "order-service",
    "version": "1.0.0",
    "main": "server.js",
    "dependencies": {
        "express": "^4.18.2",
        "pg": "^8.11.3"
    }
}
EOF

cat > Dockerfile << 'EOF'
FROM node:18-alpine
LABEL maintainer="kampus@example.com"
LABEL service="order-service"

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY server.js .

USER appuser
EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5001/health || exit 1

CMD ["node", "server.js"]
EOF

cd ../..
```

### API Gateway (Node.js)

```bash
cd Dockerfiles/api-gateway

cat > server.js << 'EOF'
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
EOF

cat > package.json << 'EOF'
{
    "name": "api-gateway",
    "version": "1.0.0",
    "main": "server.js",
    "dependencies": {
        "express": "^4.18.2",
        "cors": "^2.8.5",
        "axios": "^1.6.2"
    }
}
EOF

cat > Dockerfile << 'EOF'
FROM node:18-alpine
LABEL maintainer="kampus@example.com"
LABEL service="api-gateway"

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY server.js .

USER appuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
EOF

cd ../..
```

> **Not:** Alpine image'larda `curl` yerine `wget` kullaniyoruz cunku Alpine'da wget yuklu gelir.

### Frontend (Nginx)

```bash
cd Dockerfiles/frontend

cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kampus Digitals E-Commerce</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', sans-serif; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        header { background: #2c3e50; color: white; padding: 20px; margin-bottom: 20px; }
        header h1 { font-size: 24px; }
        .status { display: flex; gap: 10px; margin-top: 10px; }
        .status-item { padding: 5px 10px; border-radius: 4px; font-size: 12px; }
        .status-healthy { background: #27ae60; }
        .status-unhealthy { background: #e74c3c; }
        .status-checking { background: #f39c12; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .card h3 { color: #2c3e50; margin-bottom: 10px; }
        .price { color: #27ae60; font-size: 24px; font-weight: bold; }
        .stock { color: #7f8c8d; font-size: 14px; margin-top: 5px; }
        button { background: #3498db; color: white; border: none; padding: 10px 20px;
                 border-radius: 4px; cursor: pointer; margin-top: 10px; }
        button:hover { background: #2980b9; }
        .orders { margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ecf0f1; }
        th { background: #34495e; color: white; }
        #message { padding: 10px; margin: 10px 0; border-radius: 4px; display: none; }
        .success { background: #d5f4e6; color: #27ae60; }
        .error { background: #fadbd8; color: #e74c3c; }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>Kampus Digitals E-Commerce Platform</h1>
            <div class="status">
                <span id="gateway-status" class="status-item status-checking">Gateway: Checking...</span>
                <span id="products-status" class="status-item status-checking">Products: Checking...</span>
                <span id="orders-status" class="status-item status-checking">Orders: Checking...</span>
            </div>
        </div>
    </header>

    <div class="container">
        <div id="message"></div>

        <h2>Products</h2>
        <div id="products" class="grid"></div>

        <div class="orders">
            <h2>Recent Orders</h2>
            <table>
                <thead>
                    <tr><th>ID</th><th>Customer</th><th>Product ID</th><th>Quantity</th><th>Date</th></tr>
                </thead>
                <tbody id="orders"></tbody>
            </table>
        </div>
    </div>

    <script>
        const API_URL = 'http://localhost:40001';

        async function checkHealth() {
            try {
                const res = await fetch(`${API_URL}/health`);
                updateStatus('gateway-status', res.ok);
            } catch { updateStatus('gateway-status', false); }

            try {
                const res = await fetch(`${API_URL}/api/products`);
                updateStatus('products-status', res.ok);
            } catch { updateStatus('products-status', false); }

            try {
                const res = await fetch(`${API_URL}/api/orders`);
                updateStatus('orders-status', res.ok);
            } catch { updateStatus('orders-status', false); }
        }

        function updateStatus(id, healthy) {
            const el = document.getElementById(id);
            el.className = `status-item ${healthy ? 'status-healthy' : 'status-unhealthy'}`;
            el.textContent = el.textContent.split(':')[0] + ': ' + (healthy ? 'Healthy' : 'Down');
        }

        async function loadProducts() {
            try {
                const res = await fetch(`${API_URL}/api/products`);
                const data = await res.json();
                const products = data.products || data;

                document.getElementById('products').innerHTML = products.map(p => `
                    <div class="card">
                        <h3>${p.name}</h3>
                        <div class="price">$${p.price}</div>
                        <div class="stock">Stock: ${p.stock}</div>
                        <button onclick="orderProduct(${p.id}, '${p.name}')">Order Now</button>
                    </div>
                `).join('');
            } catch (err) {
                document.getElementById('products').innerHTML = '<p>Failed to load products</p>';
            }
        }

        async function loadOrders() {
            try {
                const res = await fetch(`${API_URL}/api/orders`);
                const orders = await res.json();

                document.getElementById('orders').innerHTML = orders.map(o => `
                    <tr>
                        <td>${o.id}</td>
                        <td>${o.customer_name}</td>
                        <td>${o.product_id}</td>
                        <td>${o.quantity}</td>
                        <td>${new Date(o.created_at).toLocaleString()}</td>
                    </tr>
                `).join('') || '<tr><td colspan="5">No orders yet</td></tr>';
            } catch {
                document.getElementById('orders').innerHTML = '<tr><td colspan="5">Failed to load orders</td></tr>';
            }
        }

        async function orderProduct(productId, productName) {
            const customer = prompt('Enter your name:');
            if (!customer) return;

            const quantity = parseInt(prompt('Quantity:', '1'));
            if (!quantity || quantity < 1) return;

            try {
                const res = await fetch(`${API_URL}/api/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ customer_name: customer, product_id: productId, quantity })
                });

                if (res.ok) {
                    showMessage(`Order placed for ${quantity}x ${productName}!`, 'success');
                    loadOrders();
                } else {
                    showMessage('Failed to place order', 'error');
                }
            } catch {
                showMessage('Order service unavailable', 'error');
            }
        }

        function showMessage(text, type) {
            const el = document.getElementById('message');
            el.textContent = text;
            el.className = type;
            el.style.display = 'block';
            setTimeout(() => el.style.display = 'none', 3000);
        }

        // Initialize
        checkHealth();
        loadProducts();
        loadOrders();
        setInterval(checkHealth, 30000);
    </script>
</body>
</html>
EOF

cat > Dockerfile << 'EOF'
FROM nginx:alpine
LABEL maintainer="kampus@example.com"
LABEL service="frontend"

COPY index.html /usr/share/nginx/html/
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1
EOF

cd ../..
```

### Database Init Script

```bash
cat > init.sql << 'EOF'
-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample orders
INSERT INTO orders (customer_name, product_id, quantity, status) VALUES
    ('John Doe', 1, 2, 'completed'),
    ('Jane Smith', 2, 1, 'shipped'),
    ('Bob Wilson', 3, 3, 'pending');
EOF
```

### Docker Compose

```bash
cat > docker-compose.yml << 'EOF'
services:
  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: ecommerce-db
    restart: always
    environment:
      POSTGRES_USER: kampus
      POSTGRES_PASSWORD: kampus123
      POSTGRES_DB: orders
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - backend-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U kampus -d orders"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: ecommerce-redis
    restart: always
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - backend-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Product Service (Python Flask)
  product-service:
    build:
      context: ./Dockerfiles/product-service
      dockerfile: Dockerfile
    container_name: ecommerce-products
    restart: always
    environment:
      REDIS_HOST: redis
    networks:
      - backend-network
    depends_on:
      redis:
        condition: service_healthy

  # Order Service (Node.js)
  order-service:
    build:
      context: ./Dockerfiles/order-service
      dockerfile: Dockerfile
    container_name: ecommerce-orders
    restart: always
    environment:
      DB_HOST: db
      DB_USER: kampus
      DB_PASS: kampus123
      DB_NAME: orders
      PORT: 5001
    networks:
      - backend-network
    depends_on:
      db:
        condition: service_healthy

  # API Gateway (Node.js)
  api-gateway:
    build:
      context: ./Dockerfiles/api-gateway
      dockerfile: Dockerfile
    container_name: ecommerce-gateway
    restart: always
    ports:
      - "40001:3000"
    environment:
      PRODUCT_SERVICE_URL: http://product-service:5000
      ORDER_SERVICE_URL: http://order-service:5001
    networks:
      - backend-network
      - frontend-network
    depends_on:
      - product-service
      - order-service

  # Frontend (Nginx)
  frontend:
    build:
      context: ./Dockerfiles/frontend
      dockerfile: Dockerfile
    container_name: ecommerce-frontend
    restart: always
    ports:
      - "40090:80"
    networks:
      - frontend-network
    depends_on:
      - api-gateway

volumes:
  postgres_data:
  redis_data:

networks:
  backend-network:
    driver: bridge
  frontend-network:
    driver: bridge
EOF
```

### Projeyi Baslat

```bash
# Build ve baslat
docker compose up -d --build

# Durum kontrol
docker compose ps

# Loglar
docker compose logs -f

# Eger init.sql otomatik calismadiysa:
docker compose exec db psql -U kampus -d orders -f /docker-entrypoint-initdb.d/init.sql
```

### Test

> **WSL2 Notu:** `curl` komutlarini WSL2 terminalinde calistirin. Tarayici testleri icin Windows tarayicinizda `localhost` adreslerini kullanabilirsiniz — Docker Desktop port yonlendirmesini otomatik yapar.

```bash
# API Gateway
curl http://localhost:40001/health

# Products
curl http://localhost:40001/api/products

# Orders
curl http://localhost:40001/api/orders

# Yeni siparis
curl -X POST http://localhost:40001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Test User","product_id":1,"quantity":2}'

# Frontend: Windows tarayicisinda http://localhost:40090 adresini acin
```

## Kontrol Noktasi 7 (Final)

```bash
cd ~/Kampus_Docker_Project/07-Final-Project

{
  echo "=== Kampus Digitals E-Commerce Platform ==="
  echo "Date: $(date)"
  echo ""
  echo "=== Services ==="
  docker compose ps
  echo ""
  echo "=== API Health ==="
  curl -s http://localhost:40001/health
  echo ""
  echo "=== Products ==="
  curl -s http://localhost:40001/api/products | head -100
  echo ""
  echo "=== Orders ==="
  curl -s http://localhost:40001/api/orders
} > deployment_proof.txt

cat deployment_proof.txt
```

---

[Onceki: Modul 6 - Docker Networking](06-networking.md) | [Sonraki: Ek Konular](08-ek-konular.md)
