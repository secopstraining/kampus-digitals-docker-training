# TechFlow E-Commerce Platform

Mikroservis mimarisinde e-ticaret platformu.

## Mimari

```
                    ┌─────────────────┐
                    │    Frontend     │
                    │   (Nginx:8090)  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   API Gateway   │
                    │  (Node.js:3001) │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
   ┌────────▼────────┐ ┌─────▼──────┐ ┌──────▼───────┐
   │ Product Service │ │   Redis    │ │Order Service │
   │ (Flask:5000)    │ │  (Cache)   │ │ (Node:5001)  │
   └────────┬────────┘ └────────────┘ └──────┬───────┘
            │                                 │
            └──────────┬─────────────────────┘
                       │
              ┌────────▼────────┐
              │   PostgreSQL    │
              │    (orders)     │
              └─────────────────┘
```

## Servisler

| Servis | Teknoloji | Port | Aciklama |
|--------|-----------|------|----------|
| Frontend | Nginx | 8090 | Web arayuzu |
| API Gateway | Node.js | 3001 | Tum API isteklerini yonlendirir |
| Product Service | Python Flask | 5000 | Urun yonetimi |
| Order Service | Node.js | 5001 | Siparis yonetimi |
| PostgreSQL | PostgreSQL 15 | 5432 | Veritabani |
| Redis | Redis 7 | 6379 | Cache |

## Kullanim

### Baslat
```bash
docker compose up -d --build
```

### Durdur
```bash
docker compose down
```

### Volume'lar dahil sil
```bash
docker compose down -v
```

### Loglar
```bash
docker compose logs -f
docker compose logs product-service
```

## API Endpoints

### Gateway Health
```bash
curl http://localhost:3001/health
```

### Products
```bash
# Tum urunler
curl http://localhost:3001/api/products

# Tek urun
curl http://localhost:3001/api/products/1
```

### Orders
```bash
# Tum siparisler
curl http://localhost:3001/api/orders

# Yeni siparis
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Test User","product_id":1,"quantity":2}'
```

## Frontend
Tarayicide: http://localhost:8090

## Network Izolasyonu

- **backend-network**: DB, Redis, Product Service, Order Service, API Gateway
- **frontend-network**: API Gateway, Frontend

API Gateway her iki network'e de baglidir (bridge rolunde).

## Volumes

- **postgres_data**: PostgreSQL verileri
- **redis_data**: Redis AOF dosyalari

## Health Checks

Tum servisler health check icermektedir:
- PostgreSQL: `pg_isready`
- Redis: `redis-cli ping`
- Services: HTTP health endpoints
