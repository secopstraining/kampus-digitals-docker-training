# Kampus Digitals Docker Bootcamp - Bitirme Projesi

Docker Bootcamp kapsaminda tamamlanan tum moduller.

## Video Egitimler

Tum modullerin uygulama videolarina YouTube playlist uzerinden ulasabilirsiniz:

[Kampus Digitals Docker Bootcamp - YouTube Playlist](https://www.youtube.com/watch?v=fV6UCxSjxUE&list=PL9VRN2-Oku1lvLCq3mzUzaj88-CcVTNlX)

## Egitim Dokumantasyonu

Egitimin adim adim takip edilecegi dokumanlara `docs/` dizininden ulasabilirsiniz. Her modul, teori, uygulama ve kontrol noktasi icermektedir:

| Modul | Konu | Dokuman |
|-------|------|---------|
| Giris | Proje hikayesi, gereksinimler ve modul yapisi | [docs/00-giris.md](docs/00-giris.md) |
| Modul 1 | Docker Kurulumu ve Temel Yapi | [docs/01-kurulum.md](docs/01-kurulum.md) |
| Modul 2 | Temel Docker Komutlari | [docs/02-temel-komutlar.md](docs/02-temel-komutlar.md) |
| Modul 3 | Docker Image Olusturma ve Dockerfile | [docs/03-dockerfile.md](docs/03-dockerfile.md) |
| Modul 4 | Docker Compose - Multi-Container Uygulamalar | [docs/04-compose.md](docs/04-compose.md) |
| Modul 5 | Docker Storage - Volume ve Bind Mounts | [docs/05-storage.md](docs/05-storage.md) |
| Modul 6 | Docker Networking | [docs/06-networking.md](docs/06-networking.md) |
| Modul 7 | Final Projesi - Kampus Digitals E-Commerce Platform | [docs/07-final-proje.md](docs/07-final-proje.md) |
| Ek Konular | Environment Variables, Registry, WSL2 Rehberi | [docs/08-ek-konular.md](docs/08-ek-konular.md) |
| Temizlik | Temizlik ve Basari Kriterleri | [docs/09-temizlik.md](docs/09-temizlik.md) |

> **Baslangic:** [docs/00-giris.md](docs/00-giris.md) dosyasindan baslayin ve modulleri sirayla takip edin.

## Proje Yapisi

```
Kampus_Docker_Project/
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
docker build -t kampus-flask:v1 .
docker run -d -p 40500:5000 --name flask-app kampus-flask:v1
curl http://localhost:40500
```

### Modul 4 - Full Stack
```bash
cd 04-Compose/fullstack
docker compose up -d --build
curl http://localhost:40501/api/health
```

### Modul 7 - E-Commerce Platform
```bash
cd 07-Final-Project
docker compose up -d --build
# Frontend: http://localhost:40090
# API: http://localhost:40001
```

## Portlar

| Servis | Port |
|--------|------|
| Flask App | 40500 |
| Node API | 40300 |
| WordPress | 40080 |
| Full Stack API | 40501 |
| Full Stack Frontend | 40081 |
| E-Commerce Frontend | 40090 |
| E-Commerce API Gateway | 40001 |

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
