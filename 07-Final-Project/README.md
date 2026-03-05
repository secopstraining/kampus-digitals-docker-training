# Kampus Digitals E-Commerce Platform

Mikroservis mimarisinde e-ticaret platformu.

## Mimari

```
                    ┌─────────────────┐
                    │    Frontend     │
                    │  (Nginx:40090)  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   API Gateway   │
                    │ (Node.js:40001) │
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

| Servis | Teknoloji | Port | Erisim | Aciklama |
|--------|-----------|------|--------|----------|
| Frontend | Nginx | 40090 | External (host:40090) | Web arayuzu |
| API Gateway | Node.js | 40001 | External (host:40001) | Tum API isteklerini yonlendirir |
| Product Service | Python Flask | 5000 | Internal | Urun yonetimi |
| Order Service | Node.js | 5001 | Internal | Siparis yonetimi |
| PostgreSQL | PostgreSQL 15 | 5432 | Internal | Veritabani |
| Redis | Redis 7 | 6379 | Internal | Cache |

> **Not:** "Internal" servisler sadece Docker network icinden erisilebilir, host'tan dogrudan erisilemez. "External" servisler `ports` ile host'a publish edilmistir.

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
curl http://localhost:40001/health
```

### Products
```bash
# Tum urunler
curl http://localhost:40001/api/products

# Tek urun
curl http://localhost:40001/api/products/1
```

### Orders
```bash
# Tum siparisler
curl http://localhost:40001/api/orders

# Yeni siparis
curl -X POST http://localhost:40001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Test User","product_id":1,"quantity":2}'
```

## Frontend
Tarayicide: http://localhost:40090

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
