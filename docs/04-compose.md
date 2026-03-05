# MODUL 4: Docker Compose - Multi-Container Uygulamalar

> Video: [YouTube Playlist](https://www.youtube.com/watch?v=fV6UCxSjxUE&list=PL9VRN2-Oku1lvLCq3mzUzaj88-CcVTNlX) uzerinden bu modulun uygulama videosunu izleyebilirsiniz.

## Ne Ogreneceksiniz
- Docker Compose nedir ve neden kullanilir?
- docker-compose.yml syntax
- Multi-container uygulamalari yonetme
- Service'ler arasi network ve bagimliliklar
- Volume yonetimi Compose ile
- Environment variables ve secrets

> **On Bilgi:** Bu modulde `volumes` ve `networks` kavramlarini kullanacagiz. Bunlarin detaylari Modul 5 (Storage) ve Modul 6 (Networking) modullerinde anlatilacak. Simdilik Docker Compose'un bu kaynaklari otomatik olarak olusturdugunu ve yonettigini bilmeniz yeterlidir.

> **Onceki modul temizligi:** Devam etmeden once onceki modulden kalan container'lari temizleyin:
> ```bash
> docker stop $(docker ps -q) 2>/dev/null; docker rm $(docker ps -aq) 2>/dev/null
> ```

## Teori (Hizli Gecis)

### Docker Compose Nedir?
Birden fazla container'i tek bir YAML dosyasi ile tanimlama ve yonetme araci.

### Neden Gerekli?
```bash
# Docker CLI ile (zahmetli):
docker network create app-network
docker volume create db-data
docker run -d --name db --network app-network -v db-data:/var/lib/mysql mysql
docker run -d --name backend --network app-network -p 40500:5000 api-image
docker run -d --name frontend --network app-network -p 40080:80 web-image

# Docker Compose ile (kolay):
docker compose up -d
```

### Compose Yapisi:
```yaml
services:        # Container'lar
  web:
    image: nginx
    ports:
      - "40080:80"

networks:        # Network tanimlari
  app-network:

volumes:         # Volume tanimlari
  db-data:
```

> **NOT:** `version: '3.8'` satiri artik gerekli degil ve uyari veriyor. Kaldirin.

## Uygulama (Adim Adim)

### 4.1 Basit Compose: WordPress + MySQL

**Senaryo:** WordPress blogu kuruyoruz (2 container: WordPress + MySQL)

**ADIM 1: Proje Dizini**
```bash
mkdir -p ~/Kampus_Docker_Project/04-Compose/wordpress
cd ~/Kampus_Docker_Project/04-Compose/wordpress
```

**ADIM 2: docker-compose.yml Olustur**
```bash
cat > docker-compose.yml << 'EOF'
services:
  # MySQL Database
  db:
    image: mysql:8.0
    container_name: wordpress-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpass123
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wpuser
      MYSQL_PASSWORD: wppass123
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - wp-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-prootpass123"]
      interval: 10s
      timeout: 5s
      retries: 5

  # WordPress Application
  wordpress:
    image: wordpress:6.7
    container_name: wordpress-app
    restart: always
    ports:
      - "40080:80"
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: wpuser
      WORDPRESS_DB_PASSWORD: wppass123
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wp_data:/var/www/html
    networks:
      - wp-network
    depends_on:
      db:
        condition: service_healthy

volumes:
  db_data:
  wp_data:

networks:
  wp-network:
    driver: bridge
EOF
```

> **Dosya Aciklamasi:**
> - `services`: Container tanimlari
>   - `db`: MySQL container
>     - `image`: Docker Hub'dan mysql:8.0
>     - `restart: always`: Container crash olursa otomatik restart
>     - `environment`: MySQL konfigurasyonu
>     - `volumes`: Veri kaliciligi (db_data volume -> /var/lib/mysql)
>     - `networks`: Hangi network'e bagli
>   - `wordpress`: WordPress container
>     - `ports`: Host 40080 -> Container 80
>     - `depends_on`: db servisi baslamadan wordpress baslamaz
>     - `WORDPRESS_DB_HOST: db`: Service ismi ile DNS cozumlenir!
> - `volumes`: Named volume tanimlari (Docker yonetir)
> - `networks`: Custom network (izolasyon)

**ADIM 3: Compose ile Baslat**
```bash
# Tum servisleri baslat (detached mode)
docker compose up -d

# Cikti:
# [+] Running 4/4
#  Network wordpress_wp-network  Created
#  Volume "wordpress_db_data"    Created
#  Volume "wordpress_wp_data"    Created
#  Container wordpress-db        Started
#  Container wordpress-app       Started
```

**ADIM 4: Durum Kontrolu**
```bash
# Compose servisleri listele
docker compose ps

# Cikti:
# NAME              IMAGE              STATUS         PORTS
# wordpress-app     wordpress:6.7      Up 2 minutes   0.0.0.0:40080->80/tcp
# wordpress-db      mysql:8.0          Up 2 minutes   3306/tcp

# Log'lari izle
docker compose logs -f

# Sadece WordPress loglari
docker compose logs wordpress

# Resource kullanimi
docker compose top
```

**ADIM 5: Test Et**
> **WSL2 Notu:** Windows tarayicinizdan `http://localhost:40080` adresine gidebilirsiniz. Docker Desktop, WSL2 icindeki container portlarini otomatik olarak Windows'a yonlendirir.

```bash
# Tarayicida: http://localhost:40080
# WordPress kurulum ekrani gorunmeli!

# MySQL'e baglan (test)
docker compose exec db mysql -u wpuser -pwppass123 wordpress

# MySQL icinde:
# SHOW DATABASES;
# USE wordpress;
# SHOW TABLES;
# EXIT;
```

**ADIM 6: Compose Yonetim Komutlari**
```bash
# Servisleri durdur (container'lar durur ama silinmez)
docker compose stop

# Tekrar baslat
docker compose start

# Yeniden baslat
docker compose restart

# Servisleri durdur ve SIL (volume'lar kalir)
docker compose down

# Volume'lar dahil her seyi sil
docker compose down -v

# Sadece belirli servisi yeniden baslat
docker compose restart wordpress

# Yeni image build et ve baslat
docker compose up -d --build
```

### 4.2 Full Stack Uygulama: API + Frontend + Database

**Senaryo:** 3-tier web uygulamasi (Frontend + Node.js API + PostgreSQL)

**ADIM 1: Proje Yapisi**
```bash
mkdir -p ~/Kampus_Docker_Project/04-Compose/fullstack/{frontend,backend}
cd ~/Kampus_Docker_Project/04-Compose/fullstack
```

**ADIM 2: Backend API (Node.js)**
```bash
cd backend

# package.json
cat > package.json << 'EOF'
{
  "name": "kampus-api",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "cors": "^2.8.5"
  }
}
EOF

# server.js
cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());

const port = 5000;

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
EOF

# Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY server.js .
EXPOSE 5000
CMD ["node", "server.js"]
EOF

cd ..
```

**ADIM 3: Frontend (Basit HTML + Nginx)**
```bash
cd frontend

# index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Kampus Digitals App</title>
    <style>
        body { font-family: Arial; max-width: 800px; margin: 50px auto; }
        button { padding: 10px 20px; font-size: 16px; cursor: pointer; }
        #result { margin-top: 20px; padding: 20px; background: #f0f0f0; }
    </style>
</head>
<body>
    <h1>Kampus Digitals Full Stack Application</h1>
    <button onclick="checkHealth()">Check API Health</button>
    <button onclick="getUsers()">Get Users</button>
    <div id="result"></div>

    <script>
        const API_URL = 'http://localhost:40501';

        async function checkHealth() {
            try {
                const res = await fetch(`${API_URL}/api/health`);
                const data = await res.json();
                document.getElementById('result').innerHTML =
                    `<strong>Status:</strong> ${data.status}<br>
                     <strong>Time:</strong> ${data.timestamp}`;
            } catch (err) {
                document.getElementById('result').innerHTML = `<strong>Error:</strong> ${err.message}`;
            }
        }

        async function getUsers() {
            try {
                const res = await fetch(`${API_URL}/api/users`);
                const data = await res.json();
                document.getElementById('result').innerHTML =
                    `<strong>Users:</strong> ${JSON.stringify(data, null, 2)}`;
            } catch (err) {
                document.getElementById('result').innerHTML = `<strong>Error:</strong> ${err.message}`;
            }
        }
    </script>
</body>
</html>
EOF

# Dockerfile
cat > Dockerfile << 'EOF'
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
EXPOSE 80
EOF

cd ..
```

**ADIM 4: Database Init Script**
```bash
cat > init.sql << 'EOF'
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email) VALUES
    ('Alice Johnson', 'alice@kampusdigitals.com'),
    ('Bob Smith', 'bob@kampusdigitals.com'),
    ('Carol White', 'carol@kampusdigitals.com'),
    ('David Brown', 'david@kampusdigitals.com'),
    ('Eve Davis', 'eve@kampusdigitals.com');
EOF
```

**ADIM 5: Docker Compose (Ana Orkestrasyon)**
```bash
cat > docker-compose.yml << 'EOF'
services:
  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: kampus-db
    restart: always
    environment:
      POSTGRES_USER: kampus
      POSTGRES_PASSWORD: kampus123
      POSTGRES_DB: kampusdb
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - backend-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U kampus"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Node.js API
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: kampus-api
    restart: always
    ports:
      - "40501:5000"
    environment:
      DB_HOST: db
      DB_USER: kampus
      DB_PASS: kampus123
      DB_NAME: kampusdb
      NODE_ENV: production
    networks:
      - backend-network
      - frontend-network
    depends_on:
      db:
        condition: service_healthy

  # Frontend (Nginx)
  web:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: kampus-web
    restart: always
    ports:
      - "40081:80"
    networks:
      - frontend-network
    depends_on:
      - api

volumes:
  postgres_data:

networks:
  backend-network:
    driver: bridge
  frontend-network:
    driver: bridge
EOF
```

> **Gelismis Ozellikler:**
> - `healthcheck`: Container saglikli mi kontrol et
> - `depends_on + condition`: DB hazir olana kadar API baslamaz
> - Iki ayri network: Frontend-Backend izolasyonu
> - `build`: Image'i Dockerfile'dan build et

**ADIM 6: Tum Stack'i Baslat**
```bash
# Build ve baslat
docker compose up -d --build

# Ilerleme izle
docker compose logs -f

# Tum servisler hazir mi?
docker compose ps

# Health check
curl http://localhost:40501/api/health

# Frontend: Windows tarayicisinda http://localhost:40081 adresini acin
```

> **NOT:** Eger init.sql otomatik calismazsa (volume onceden varsa):
> ```bash
> docker compose exec db psql -U kampus -d kampusdb -f /docker-entrypoint-initdb.d/init.sql
> ```

## Kontrol Noktasi 4

```bash
cd ~/Kampus_Docker_Project/04-Compose

# Full stack test
{
  echo "=== Docker Compose Stack ==="
  cd fullstack && docker compose ps
  echo ""
  echo "=== Networks ==="
  docker network ls | grep fullstack
  echo ""
  echo "=== Volumes ==="
  docker volume ls | grep fullstack
  echo ""
  echo "=== API Health ==="
  curl -s http://localhost:40501/api/health
  echo ""
  echo "=== Database Test ==="
  docker compose exec db psql -U kampus -d kampusdb -c "SELECT COUNT(*) FROM users;"
} > compose_proof.txt

cat compose_proof.txt
```

## Sik Yapilan Hatalar

| Hata | Sebep | Cozum |
|------|-------|-------|
| service "db" didn't complete successfully | DB baslamadi | `docker compose logs db` kontrol et |
| Port cakismasi | Port kullanimda | Farkli port kullanin (40000+ serisi onerilir) |
| API DB'ye baglanmiyor | Service ismi yanlis | `DB_HOST: db` (service name) |
| depends_on calismiyor | Healthcheck yok | `condition: service_healthy` ekle |
| Volume izni sorunu | Permission denied | chmod veya Dockerfile'da USER |
| init.sql calismadi | Volume onceden vardi | Volume'u sil: `docker compose down -v` |
| Tarayicida sayfa acilmiyor | Docker Desktop kapali | Gorev cubugundaki Docker ikonunun yesil oldugundan emin olun |

## Anlama Testi

1. **`depends_on` ile `depends_on + condition: service_healthy` arasindaki fark nedir?**
   > `depends_on` sadece container'in baslamasini bekler. `condition: service_healthy` ise container'in healthcheck'i gecmesini (gercekten hazir olmasini) bekler. Database'ler icin ikincisi kritiktir.

2. **`docker compose down` ile `docker compose down -v` arasindaki fark nedir?**
   > `down` container ve network'leri siler ama volume'lar kalir (veri korunur). `down -v` volume'lari da siler (veri kaybolur!).

3. **Neden service ismi (`db`) ile container'lara baglanabiliyoruz? IP adresi kullanmak gerekmiyor mu?**
   > Docker Compose otomatik DNS olusturur. Service ismi hostname olarak cozumlenir. IP adreslerini kullanmak gereksiz ve hataya aciktir cunku container yeniden baslatildiginda IP degisebilir.

4. **`docker compose up --build` ne zaman gereklidir?**
   > Dockerfile veya kaynak kodda degisiklik yaptiysaniz. `--build` olmadan eski image kullanilir.

---

[Onceki: Modul 3 - Dockerfile](03-dockerfile.md) | [Sonraki: Modul 5 - Docker Storage](05-storage.md)
