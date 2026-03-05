# TechFlow Docker Bootcamp - Bitirme Projesi

Docker Bootcamp kapsaminda tamamlanan tum moduller.

## Proje Yapisi

```
TechFlow_Docker_Project/
├── 01-Installation/          # Modul 1: Docker Kurulumu
├── 02-Commands/              # Modul 2: Temel Docker Komutlari
├── 03-Images/                # Modul 3: Docker Image Olusturma
│   ├── flask-app/           # Python Flask uygulamasi
│   └── node-app/            # Node.js API
├── 04-Compose/               # Modul 4: Docker Compose
│   ├── wordpress/           # WordPress + MySQL stack
│   └── fullstack/           # Full Stack (API + Frontend + PostgreSQL)
├── 05-Storage/               # Modul 5: Volume ve Bind Mounts
│   └── webapp/              # Live reload ornegi
├── 06-Networking/            # Modul 6: Docker Networking
├── 07-Final-Project/         # Modul 7: E-Commerce Platform
│   ├── Dockerfiles/
│   │   ├── product-service/  # Python Flask
│   │   ├── order-service/    # Node.js
│   │   ├── api-gateway/      # Node.js
│   │   └── frontend/         # Nginx
│   ├── docker-compose.yml
│   ├── init.sql
│   └── README.md
└── README.md
```

## Tamamlanan Moduller

### Modul 1: Docker Kurulumu
- Docker Engine kurulumu
- Docker servis yapisi (daemon, CLI, containerd)
- Hello World container testi

### Modul 2: Temel Docker Komutlari
- Container lifecycle (run, stop, start, rm)
- Image yonetimi (pull, push, rmi)
- Port mapping ve detached mode
- Container debug (logs, exec, inspect)

### Modul 3: Docker Image Olusturma
- Dockerfile yazimi
- Custom image build
- Layer caching optimizasyonu
- .dockerignore kullanimi

### Modul 4: Docker Compose
- Multi-container uygulamalar
- WordPress + MySQL stack
- Full Stack uygulama (API + Frontend + DB)
- Service bagimliliklari ve health checks

### Modul 5: Docker Storage
- Named volumes
- Bind mounts
- Data persistence
- Volume backup/restore

### Modul 6: Docker Networking
- Custom bridge networks
- Container DNS resolution
- Multi-network containers
- Network izolasyonu

### Modul 7: Final Projesi
- Mikroservis mimarisi
- 6 container orchestration
- Redis cache entegrasyonu
- Production-ready yapilandirma

## Calistirma

### Modul 3 - Flask App
```bash
cd 03-Images/flask-app
docker build -t techflow-flask:v1 .
docker run -d -p 5000:5000 --name flask-app techflow-flask:v1
curl http://localhost:5000
```

### Modul 4 - Full Stack
```bash
cd 04-Compose/fullstack
docker compose up -d --build
curl http://localhost:5001/api/health
```

### Modul 7 - E-Commerce Platform
```bash
cd 07-Final-Project
docker compose up -d --build
# Frontend: http://localhost:8090
# API: http://localhost:3001
```

## Portlar

| Servis | Port |
|--------|------|
| Flask App | 5000 |
| Node API | 3000 |
| WordPress | 8080 |
| Full Stack API | 5001 |
| Full Stack Frontend | 8081 |
| E-Commerce Frontend | 8090 |
| E-Commerce API Gateway | 3001 |

## Temizlik

```bash
# Tum container'lari durdur
docker stop $(docker ps -q)

# Tum container'lari sil
docker rm $(docker ps -aq)

# Kullanilmayan image'lari sil
docker image prune -a

# Kullanilmayan volume'lari sil
docker volume prune
```
