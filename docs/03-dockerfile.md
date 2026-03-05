# MODUL 3: Docker Image Olusturma ve Dockerfile

> Video: [YouTube Playlist](https://www.youtube.com/watch?v=fV6UCxSjxUE&list=PL9VRN2-Oku1lvLCq3mzUzaj88-CcVTNlX) uzerinden bu modulun uygulama videosunu izleyebilirsiniz.

## Ne Ogreneceksiniz
- Dockerfile syntax ve best practices
- Multi-stage builds
- Layer caching mekanizmasi
- Custom image olusturma
- Image optimize etme teknikleri
- .dockerignore kullanimi

## Teori (Hizli Gecis)

### Base Image Varyantlari

Dockerfile yazarken dogru base image secimi onemlidir:

| Varyant | Ornek | Boyut | Aciklama |
|---------|-------|-------|----------|
| **full** | `python:3.11` | ~1 GB | Tam Debian, tum araclar dahil |
| **slim** | `python:3.11-slim` | ~150 MB | Minimal Debian, gereksiz paketler cikarilmis |
| **alpine** | `python:3.11-alpine` | ~50 MB | Alpine Linux, en kucuk boyut, bazi uyumsuzluklar olabilir |

> **Tavsiye:** Baslangic icin `slim` kullanin. Alpine bazi C kutuphanelerinde sorun cikarabilir. Production'da boyut kritikse Alpine deneyin.

### Dockerfile Nedir?
Image olusturmak icin kullanilan text dosyasi. Her satir bir "instruction" (komut) icerir.

### Image Layers (Katmanlar):
```
+---------------------+
|   Python App        |  <- Layer 5 (CMD)
+---------------------+
|   requirements.txt  |  <- Layer 4 (COPY)
+---------------------+
|   pip install       |  <- Layer 3 (RUN)
+---------------------+
|   Python 3.11       |  <- Layer 2 (FROM)
+---------------------+
|   Base OS           |  <- Layer 1
+---------------------+
```
Her layer cache'lenir. Degismeyen layer'lar yeniden build edilmez (hiz!).

### Temel Dockerfile Komutlari:

| Komut | Aciklama | Ornek |
|-------|----------|-------|
| FROM | Base image | `FROM ubuntu:22.04` |
| RUN | Build sirasinda komut calistir | `RUN apt update` |
| COPY | Dosya kopyala | `COPY app.py /app/` |
| ADD | COPY + extract (tar, url) | `ADD file.tar.gz /app/` |
| WORKDIR | Calisma dizini | `WORKDIR /app` |
| ENV | Environment variable | `ENV PORT=8080` |
| EXPOSE | Port bilgisi (dokumantasyon) | `EXPOSE 80` |
| CMD | Container baslangic komutu | `CMD ["python", "app.py"]` |
| ENTRYPOINT | Ana process | `ENTRYPOINT ["nginx"]` |

## Uygulama (Adim Adim)

> **Dosya Olusturma Yontemleri:** Bu dokumanda dosyalar `cat > dosya << 'EOF' ... EOF` komutuyla olusturulur. Bu komut WSL2 terminalinde sorunsuz calisir. Alternatif olarak:
> - WSL2 icinde `nano dosya_adi` editoru kullanabilirsiniz (kaydet: Ctrl+O, cik: Ctrl+X)
> - Windows tarafindan WSL2 dosyalarini VS Code ile acabilirsiniz: `code dosya_adi`
> - **UYARI:** Windows Notepad veya Explorer ile WSL2 dosyalarini **dogrudan duzenlemekten kacinin** — satir sonu karakterleri (CRLF vs LF) sorun cikarabilir.

### 3.1 Ilk Dockerfile: Basit Web Uygulamasi

**Senaryo:** Python Flask web uygulamasi container'ina alacagiz.

**ADIM 1: Proje Dizini Olustur**
```bash
mkdir -p ~/Kampus_Docker_Project/03-Images/flask-app
cd ~/Kampus_Docker_Project/03-Images/flask-app
```

**ADIM 2: Python Flask Uygulamasi**
```bash
cat > app.py << 'EOF'
from flask import Flask
import os

app = Flask(__name__)

@app.route('/')
def hello():
    return f"""
    <h1>Kampus Digitals Flask App</h1>
    <p>Container ID: {os.uname().nodename}</p>
    <p>Python Version: {os.sys.version}</p>
    <p>Environment: {os.getenv('ENV', 'production')}</p>
    """

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
EOF
```

**ADIM 3: Requirements Dosyasi**
```bash
cat > requirements.txt << 'EOF'
Flask==3.0.0
Werkzeug==3.0.1
EOF
```

**ADIM 4: Dockerfile Yaz**
```bash
cat > Dockerfile << 'EOF'
# Base image: Python 3.11 slim (kucuk boyut)
FROM python:3.11-slim

# Metadata (iyi pratik)
LABEL maintainer="kampus@example.com"
LABEL version="1.0"
LABEL description="Kampus Digitals Flask Web Application"

# Calisma dizini olustur
WORKDIR /app

# Requirements'i kopyala (layer caching icin once bu)
COPY requirements.txt .

# Python bagimliklarini kur
RUN pip install --no-cache-dir -r requirements.txt

# Uygulama dosyalarini kopyala
COPY app.py .

# Port bilgisi (dokumantasyon)
EXPOSE 5000

# Environment variable
ENV ENV=production

# Container baslatma komutu
CMD ["python", "app.py"]
EOF
```

> **Dockerfile Aciklamasi:**
> 1. `FROM`: Python 3.11-slim base image (debian tabanli, kucuk boyut)
> 2. `LABEL`: Metadata ekle (opsiyonel ama onerilen)
> 3. `WORKDIR`: /app dizinini olustur ve oraya gec
> 4. `COPY requirements.txt`: Sadece requirements'i kopyala (cache icin)
> 5. `RUN pip install`: Bagimliliklari kur
> 6. `COPY app.py`: Uygulama kodunu kopyala
> 7. `EXPOSE 5000`: Port 5000 kullanilacak (bilgilendirme)
> 8. `ENV`: Ortam degiskeni tanimla
> 9. `CMD`: Container baslatinca python app.py calistir

**ADIM 5: .dockerignore Olustur**
```bash
cat > .dockerignore << 'EOF'
# Python
__pycache__
*.pyc
*.pyo
*.pyd
.Python
env/
venv/

# Git
.git
.gitignore

# IDE
.vscode
.idea
*.swp

# Tests
tests/
*.test

# Documentation
README.md
docs/

# Logs
*.log
EOF
```

**ADIM 6: Image Build Et**
```bash
# Build komutu
docker build -t kampus-flask:v1 .

# -t: tag (isim:versiyon)
# . : Dockerfile'in bulundugu dizin (current directory)

# Build sureci:
# [1/6] FROM python:3.11-slim
# [2/6] WORKDIR /app
# [3/6] COPY requirements.txt .
# [4/6] RUN pip install...
# [5/6] COPY app.py .
# [6/6] CMD ["python", "app.py"]
```

**ADIM 7: Image'i Kontrol Et**
```bash
# Image olusturuldu mu?
docker images | grep kampus

# Cikti:
# kampus-flask   v1    abc123def456   1 minute ago   150MB

# Image detaylari
docker inspect kampus-flask:v1

# Image history (layer'lar)
docker history kampus-flask:v1
```

**ADIM 8: Container Calistir ve Test Et**
```bash
# Container baslat
docker run -d -p 40500:5000 --name flask-app kampus-flask:v1

# Calisiyor mu?
docker ps

# Log kontrol
docker logs flask-app

# Beklenen cikti:
#  * Running on all addresses (0.0.0.0)
#  * Running on http://127.0.0.1:5000

# Test et
curl http://localhost:40500

# Tarayicida: http://localhost:40500
```

### 3.2 Dockerfile Best Practices

**1. Layer Caching Optimizasyonu**

KOTU Pratik:
```dockerfile
COPY . .  # Her degisiklikte tum dosyalar kopyalanir
RUN pip install -r requirements.txt  # Her seferinde yeniden install
```

IYI Pratik:
```dockerfile
COPY requirements.txt .
RUN pip install -r requirements.txt  # Cache'lenir
COPY . .  # Sadece kod degisirse bu layer yenilenir
```

**2. RUN Komutlarini Birlestir**

KOTU (3 layer):
```dockerfile
RUN apt update
RUN apt install -y curl
RUN apt clean
```

IYI (1 layer):
```dockerfile
RUN apt update && \
    apt install -y curl && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*
```

**3. Multi-Stage Build (Ileri Seviye)**
```dockerfile
# Stage 1: Builder (gelistirme araclari ile)
FROM python:3.11 AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Stage 2: Runtime (sadece gerekli dosyalar)
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY app.py .
ENV PATH=/root/.local/bin:$PATH
CMD ["python", "app.py"]
```

### 3.3 Pratik: Node.js Uygulamasi

```bash
# Yeni proje
mkdir -p ~/Kampus_Docker_Project/03-Images/node-app
cd ~/Kampus_Docker_Project/03-Images/node-app

# package.json
cat > package.json << 'EOF'
{
  "name": "kampus-node",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF

# server.js
cat > server.js << 'EOF'
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'Kampus Digitals Node.js API',
    version: '1.0.0',
    container: process.env.HOSTNAME
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
EOF

# Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Package files once (cache icin)
COPY package*.json ./

# Install dependencies (--omit=dev kullan, --production deprecated)
RUN npm install --omit=dev

# Application code
COPY server.js .

EXPOSE 3000

CMD ["node", "server.js"]
EOF

# Build
docker build -t kampus-node:v1 .

# Run
docker run -d -p 40300:3000 --name node-api kampus-node:v1

# Test
curl http://localhost:40300
```

## Kontrol Noktasi 3

```bash
# Her iki uygulamayi calistir
docker ps

# Cikti:
# flask-app (port 40500)
# node-api (port 40300)

# Image boyutlarini karsilastir
docker images | grep kampus

# Layer history
docker history kampus-flask:v1
docker history kampus-node:v1

# Teslimat dosyasi
mkdir -p ~/Kampus_Docker_Project/03-Images
cd ~/Kampus_Docker_Project/03-Images

{
  echo "=== Custom Images ==="
  docker images | grep kampus
  echo ""
  echo "=== Running Containers ==="
  docker ps --filter "name=flask-app"
  docker ps --filter "name=node-api"
  echo ""
  echo "=== Flask Test ==="
  curl -s http://localhost:40500 | head -5
  echo ""
  echo "=== Node Test ==="
  curl -s http://localhost:40300
} > images_proof.txt
```

## Sik Yapilan Hatalar

| Hata | Sebep | Cozum |
|------|-------|-------|
| no such file or directory | COPY yolu yanlis | Dockerfile'in bulundugu dizindeki dosyalar |
| Build cok yavas | Cache kullanilmiyor | Requirements/package.json once COPY et |
| Image cok buyuk | Base image buyuk | alpine veya slim variant kullan |
| COPY failed | .dockerignore dosyayi disladi | .dockerignore kontrol et |
| Layer sayisi cok | Her RUN ayri | RUN komutlarini && ile birlestir |
| CRLF line ending hatasi | Windows editoru kullanildi | VS Code'da sag alttaki CRLF'i LF'e cevirin veya `dos2unix` kullanin |

## Anlama Testi

1. **Neden `COPY requirements.txt .` ve `RUN pip install` satirlarini `COPY . .` satirindan once yaziyoruz?**
   > Layer caching icin. Requirements degismezse pip install layer'i cache'den gelir. Sadece kod degisikliklerinde son layer yenilenir.

2. **`FROM python:3.11-slim` yerine `FROM python:3.11` kullansakk ne olur?**
   > Image boyutu ~150 MB yerine ~1 GB olur. Slim gereksiz paketleri (gcc, man pages vb.) icermez.

3. **`.dockerignore` dosyasi olmadan `COPY . .` yaparsak ne olur?**
   > `.git`, `node_modules`, `__pycache__` gibi gereksiz dosyalar da image'a kopyalanir. Image buyur ve build yavasar.

4. **`EXPOSE 5000` komutu portu otomatik olarak acar mi?**
   > Hayir. EXPOSE sadece dokumantasyon amaclidir. Portu acmak icin `docker run -p 40500:5000` kullanilmalidir.

---

[Onceki: Modul 2 - Temel Komutlar](02-temel-komutlar.md) | [Sonraki: Modul 4 - Docker Compose](04-compose.md)
