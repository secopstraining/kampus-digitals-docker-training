# Docker Bootcamp Bitirme Projesi
## TechFlow Mikroservis Platformu (Hands-On Learning Edition)
### Duzeltilmis ve Guncel Versiyon

**Felsefe:** Bu proje bir sinav degildir. Her modul, bir onceki modulun uzerine insa edilir ve ogrenci yaparak ogrenir. Hata yapmak ogrenme surecinin parcasidir.

---

## Projenin Hikayesi

TechFlow sirketi monolitik uygulamasini mikroservislere geciriyor. Siz bu projenin DevOps muhendisi olarak gorevlendirildiniz. Sirket hedefleri net: containerization, hizli deployment, izole calisma ortamlari ve production-ready altyapi.

---

## Ogrenme Hedefleri

Bu projeyi tamamladiginizda sunlari yapiyor olacaksiniz:
- Docker kurulumu ve temel komutlari
- Container lifecycle yonetimi
- Custom Docker image olusturma ve Dockerfile yazma
- Multi-container uygulamalari Docker Compose ile yonetme
- Volume ve network yapilandirmasi
- Registry kullanimi ve image paylasimi
- Production best practices
- Container troubleshooting ve debugging

---

## Gereksinimler

### Sistem:
- **OS:** Ubuntu 22.04/24.04, Windows 10/11, veya macOS
- **CPU:** 2 core (onerilen 4 core)
- **RAM:** Minimum 4 GB (onerilen 8 GB)
- **Disk:** 20 GB bos alan
- **Network:** Internet erisimi

### Onerilen Ortam:
- VirtualBox/VMware uzerinde Ubuntu VM
- Windows: Docker Desktop for Windows
- macOS: Docker Desktop for Mac

---

## Modul Yapisi

Her modul su bolumleri icerir:
- **Ne Ogreneceksiniz:** Modulun hedefi
- **Teori (Hizli Gecis):** Kavramlarin ne oldugu
- **Uygulama (Adim Adim):** Yapilacaklar
- **Kontrol Noktasi:** Dogru yolda olup olmadiginizi test edin
- **Sik Yapilan Hatalar:** Dikkat edilmesi gerekenler
- **Anlama Testi:** Bu modulu gercekten anladiniz mi?

---

# MODUL 1: Docker Kurulumu ve Temel Yapi

## Ne Ogreneceksiniz
- Docker nedir ve neden kullanilir?
- Docker Engine mimarisi (daemon, CLI, containerd)
- Docker kurulumu (Ubuntu/Windows/Mac)
- Ilk container'inizi calistirma
- Docker'in dogru calistigini dogrulama

## Teori (Hizli Gecis)

### Docker Nedir?
Container teknolojisi kullanan bir platform. Uygulamalari ve bagimliklarini izole edilmis ortamlarda calistirir.

### VM vs Container:
```
Virtual Machine:
+---------------------+
|   App A   |  App B  |
+-----------+---------+
|   OS A    |  OS B   |
+---------------------+
|    Hypervisor       |
+---------------------+
|    Host OS          |
+---------------------+

Container:
+---------------------+
|   App A   |  App B  |
+-----------+---------+
|  Docker Engine      |
+---------------------+
|    Host OS          |
+---------------------+
```

### Avantajlar:
- Hafif (MB'lar vs GB'lar)
- Hizli baslatma (saniyeler vs dakikalar)
- Tutarli calisma ortami ("works on my machine" sorunu yok)
- Resource verimli

### Docker Mimarisi:
```
Docker CLI (docker command)
    |
    v
Docker Daemon (dockerd)
    |
    v
containerd
    |
    v
runc (container runtime)
```

## Uygulama (Adim Adim)

### 1.1 Docker Kurulumu (Ubuntu)

**ADIM 1: Eski Versiyonlari Temizle**
```bash
# Eski Docker versiyonlarini kaldir
sudo apt remove docker docker-engine docker.io containerd runc 2>/dev/null

# Sistem guncellemesi
sudo apt update
sudo apt upgrade -y
```

**ADIM 2: Gerekli Paketleri Kur**
```bash
# Temel araclar
sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

**ADIM 3: Docker GPG Key Ekle**
```bash
# Dizin olustur
sudo mkdir -p /etc/apt/keyrings

# Docker resmi GPG key (--yes flag ile uzerine yazma izni)
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg

# Okuma izni ver
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

**ADIM 4: Docker Repository Ekle**
```bash
# Repository ayarla
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

**ADIM 5: Docker Engine Kur**
```bash
# Paket listesini guncelle
sudo apt update

# Docker Engine, CLI ve containerd kur
sudo apt install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin

# Docker versiyonunu kontrol et
docker --version
# Beklenen: Docker version 24.0.x veya ustu
```

**ADIM 6: Docker Servisini Baslat ve Aktif Et**
```bash
# Docker servisini baslat
sudo systemctl start docker

# Boot'ta otomatik baslasin
sudo systemctl enable docker

# Servis durumunu kontrol et
sudo systemctl status docker

# Beklenen cikti:
# docker.service - Docker Application Container Engine
#      Active: active (running)
```

**ADIM 7: Kullaniciyi Docker Grubuna Ekle**
```bash
# Mevcut kullaniciyi docker grubuna ekle
sudo usermod -aG docker $USER

# Grup degisikligini aktif et (veya logout/login yap)
newgrp docker

# Test: sudo olmadan docker komutu
docker ps
# Hata vermiyorsa basarili!
```

> **Not:** `docker` grubu Docker daemon'a socket uzerinden erisim izni verir. Artik sudo kullanmadan Docker komutlari calistirabilirsiniz.

### 1.2 Docker Kurulum Testi

**Test 1: Hello World Container**
```bash
# Docker'in ilk test container'i
docker run hello-world

# Beklenen cikti:
# Hello from Docker!
# This message shows that your installation appears to be working correctly.
```

**Ne Oldu?**
1. Docker CLI komutu daemon'a gonderildi
2. Daemon local'de hello-world image'ini aradi (bulamadi)
3. Docker Hub'dan otomatik indirdi (pull)
4. Image'dan container olusturdu
5. Container calisti, mesaji gosterdi ve durdu

**Test 2: Sistem Bilgisi**
```bash
# Docker sistem bilgisi
docker info

# Onemli bilgiler:
# - Server Version
# - Storage Driver
# - Cgroup Driver
# - Containers (running/stopped)
# - Images
```

**Test 3: Ilk Interaktif Container**
```bash
# Ubuntu container'i interaktif modda calistir
docker run -it ubuntu bash

# Container icindesiniz! Prompt: root@<container-id>:/#

# Container icinde komutlar calistirin:
cat /etc/os-release
ls /
whoami

# Cikmak icin:
exit
```

## Kontrol Noktasi 1

```bash
# Asagidaki komutlari calistirin ve ciktilari kaydedin:
mkdir -p ~/TechFlow_Docker_Project/01-Installation
cd ~/TechFlow_Docker_Project/01-Installation

# Kurulum kaniti
{
  echo "=== Docker Installation Verification ==="
  echo ""
  echo "Docker Version:"
  docker --version
  echo ""
  echo "Docker Info (ilk 20 satir):"
  docker info 2>/dev/null | head -20
  echo ""
  echo "Images:"
  docker images
  echo ""
  echo "Containers:"
  docker ps -a
  echo ""
  echo "User Groups:"
  groups
} > docker_install_proof.txt

cat docker_install_proof.txt
```

**Beklenen Sonuclar:**
- Docker version 24.0+ gorunuyor
- Docker info calisiyor
- hello-world ve ubuntu image'lari var
- Durmus container'lar listede

## Sik Yapilan Hatalar

| Hata | Sebep | Cozum |
|------|-------|-------|
| Cannot connect to Docker daemon | Docker servisi calismiyor | `sudo systemctl start docker` |
| permission denied | User docker grubunda degil | `sudo usermod -aG docker $USER` + Logout/login |
| docker: command not found | PATH'de degil | `which docker` kontrol et, yeniden kur |
| Image pull hatasi | Network/proxy sorunu | `docker pull` manuel dene, proxy ayarla |

## Anlama Testi

1. **Docker daemon ve Docker CLI arasindaki fark nedir?**
   > CLI kullanici komutlarini alir, daemon arka planda calisir ve container'lari yonetir. API ile haberlesirler.

2. **`docker run hello-world` komutunu tekrar calistirirsaniz ne olur?**
   > Image zaten local'de oldugu icin pull yapmaz, direkt calistirir. Cok daha hizlidir.

3. **Container durdugunda ne olur? Veri kaybolur mu?**
   > Container durdurulur ama silinmez. `docker ps -a` ile gorulur. Veri container icinde kalir ama volume kullanmazsan container silindiginde kaybolur.

4. **Neden `sudo usermod -aG docker $USER` yapiyoruz?**
   > Docker daemon'i root olarak calisir. Docker grubuna ekleyerek sudo olmadan erisim sagliyoruz.

---

# MODUL 2: Temel Docker Komutlari

## Ne Ogreneceksiniz
- Container yasam dongusu (run, stop, start, rm)
- Image yonetimi (pull, push, rmi)
- Container inceleme ve debug (logs, exec, inspect)
- Port mapping ve detached mode
- Container isimlendirme ve tag'leme

## Teori (Hizli Gecis)

### Container Lifecycle:
```
docker run    -> Create + Start
docker create -> Sadece olustur
docker start  -> Durdurulmus container'i baslat
docker stop   -> Graceful shutdown (SIGTERM)
docker kill   -> Zorla durdur (SIGKILL)
docker restart-> Stop + Start
docker rm     -> Container'i sil
```

### Image Lifecycle:
```
docker pull   -> Registry'den indir
docker build  -> Dockerfile'dan olustur
docker push   -> Registry'e yukle
docker rmi    -> Image'i sil
docker tag    -> Image'a tag ekle
```

### Container States:
```
Created -> Running -> Paused -> Stopped -> Removed
              |
           Exited
```

## Uygulama (Adim Adim)

### 2.1 Container Calistirma (docker run)

**Basit Calistirma:**
```bash
# Nginx web sunucusu calistir
docker run nginx

# Ne oldu?
# - nginx image pull edildi
# - Container olusturuldu ve baslatildi
# - On planda calisiyor (terminal kilitli)
# - Ctrl+C ile durdur
```
> **Sorun:** Terminal kilitli, baska komut calistiramiyoruz!

**Detached Mode (Arka Plan):**
```bash
# -d flag: detached (arka planda)
docker run -d nginx

# Cikti: Container ID (12 karakter)
# Ornek: a1b2c3d4e5f6

# Container calisiyor mu?
docker ps

# Cikti:
# CONTAINER ID   IMAGE    COMMAND                  STATUS        PORTS
# a1b2c3d4e5f6   nginx    "/docker-entrypoint..."   Up 10 sec     80/tcp
```

**Port Mapping:**
```bash
# Problem: Nginx 80 portunda ama host'tan erisemiyoruz

# -p flag: port mapping (host:container)
docker run -d -p 8080:80 nginx

# Test et
curl http://localhost:8080

# Cikti: Nginx welcome page HTML!
```

> **Port Mapping Mantigi:**
> ```
> localhost:8080  ->  Docker Engine  ->  Container:80
>    (Host)              (Bridge)         (Nginx)
> ```

**Isimlendirme:**
```bash
# --name flag: container'a isim ver
docker run -d -p 8081:80 --name my-nginx nginx

# Artik ID yerine isim kullanabilirsin
docker stop my-nginx
docker start my-nginx
docker rm my-nginx
```

### 2.2 Container Yonetimi

**Container Listeleme:**
```bash
# Calisan container'lar
docker ps

# Tum container'lar (durmus olanlar dahil)
docker ps -a

# Sadece container ID'leri
docker ps -q

# Son olusturulan container
docker ps -l
```

**Container Durdurma:**
```bash
# Graceful stop (10 saniye timeout)
docker stop my-nginx

# Zorla durdur
docker kill my-nginx

# Birden fazla container
docker stop container1 container2 container3

# Tum calisan container'lari durdur
docker stop $(docker ps -q)
```

**Container Silme:**
```bash
# Durmus container sil
docker rm my-nginx

# Calisan container'i zorla sil
docker rm -f my-nginx

# Tum durmus container'lari sil
docker container prune

# Dikkat: Bu islem geri alinamaz!
```

### 2.3 Container Inceleme ve Debug

**Log Goruntuleme:**
```bash
# Container loglarini goster
docker logs my-nginx

# Canli log izleme (-f: follow)
docker logs -f my-nginx

# Son 10 satir
docker logs --tail 10 my-nginx

# Timestamp ekle
docker logs -t my-nginx
```

**Container Icine Giris:**
```bash
# Exec: Calisan container'da komut calistir
docker exec -it my-nginx bash

# Container icindesiniz!
# nginx konfigurasyonunu gorun:
cat /etc/nginx/nginx.conf

# Process listesi
ps aux

# Cikis
exit
```

> **-it Flags:**
> - `-i`: Interactive (stdin acik)
> - `-t`: TTY (terminal emulation)

**Container Detaylari:**
```bash
# Tum metadata JSON formatinda
docker inspect my-nginx

# Spesifik bilgi cek (IP adresi)
docker inspect -f '{{.NetworkSettings.IPAddress}}' my-nginx

# Port mapping
docker port my-nginx

# Resource kullanimi (real-time)
docker stats my-nginx
# Cikti: CPU %, Memory, Network I/O
```

### 2.4 Image Yonetimi

**Image Indirme:**
```bash
# Docker Hub'dan indir
docker pull ubuntu

# Spesifik versiyon (tag)
docker pull ubuntu:20.04
```

**Image Listeleme:**
```bash
# Local image'lar
docker images

# Cikti:
# REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
# nginx        latest    a1b2c3d4e5f6   2 weeks ago    187MB
# ubuntu       20.04     b2c3d4e5f6a1   1 month ago    72.8MB

# Sadece ID'ler
docker images -q

# Dangling images (tag yok)
docker images -f "dangling=true"
```

**Image Silme:**
```bash
# Image sil
docker rmi nginx

# Zorla sil (container varsa)
docker rmi -f nginx

# Birden fazla
docker rmi nginx ubuntu alpine

# Kullanilmayan tum image'lari sil
docker image prune -a
```

## Kontrol Noktasi 2

```bash
# Pratik senaryo: 3 Nginx instance calistir
mkdir -p ~/TechFlow_Docker_Project/02-Commands
cd ~/TechFlow_Docker_Project/02-Commands

# 1. Ilk Nginx (port 8081)
docker run -d -p 8081:80 --name web1 nginx

# 2. Ikinci Nginx (port 8082)
docker run -d -p 8082:80 --name web2 nginx

# 3. Ucuncu Nginx (port 8083)
docker run -d -p 8083:80 --name web3 nginx

# Test et
curl -s http://localhost:8081 | head -5
curl -s http://localhost:8082 | head -5
curl -s http://localhost:8083 | head -5

# Container'lari listele
docker ps

# Log'lari kontrol et
docker logs web1

# Birini durdur
docker stop web2

# Tekrar baslat
docker start web2

# Temizlik
docker stop web1 web2 web3
docker rm web1 web2 web3

# Kanit dosyasi
{
  echo "=== Basic Commands Practice ==="
  docker ps -a
  docker images
} > commands_proof.txt
```

## Sik Yapilan Hatalar

| Hata | Sebep | Cozum |
|------|-------|-------|
| port is already allocated | Port zaten kullanimda | Farkli port kullan veya cakisan container'i bul |
| No such container | Container ID/isim yanlis | `docker ps -a` ile kontrol et |
| cannot remove running container | Container calisiyor | Once `docker stop` sonra `docker rm` |
| exec failed: container not running | Container durmus | `docker start` ile baslat |
| Image silinmiyor | Container kullaniyor | `docker ps -a` kontrol et, container'i sil |

---

# MODUL 3: Docker Image Olusturma ve Dockerfile

## Ne Ogreneceksiniz
- Dockerfile syntax ve best practices
- Multi-stage builds
- Layer caching mekanizmasi
- Custom image olusturma
- Image optimize etme teknikleri
- .dockerignore kullanimi

## Teori (Hizli Gecis)

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

### 3.1 Ilk Dockerfile: Basit Web Uygulamasi

**Senaryo:** Python Flask web uygulamasi container'ina alacagiz.

**ADIM 1: Proje Dizini Olustur**
```bash
mkdir -p ~/TechFlow_Docker_Project/03-Images/flask-app
cd ~/TechFlow_Docker_Project/03-Images/flask-app
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
    <h1>TechFlow Flask App</h1>
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
LABEL maintainer="techflow@example.com"
LABEL version="1.0"
LABEL description="TechFlow Flask Web Application"

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
docker build -t techflow-flask:v1 .

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
docker images | grep techflow

# Cikti:
# techflow-flask   v1    abc123def456   1 minute ago   150MB

# Image detaylari
docker inspect techflow-flask:v1

# Image history (layer'lar)
docker history techflow-flask:v1
```

**ADIM 8: Container Calistir ve Test Et**
```bash
# Container baslat
docker run -d -p 5000:5000 --name flask-app techflow-flask:v1

# Calisiyor mu?
docker ps

# Log kontrol
docker logs flask-app

# Beklenen cikti:
#  * Running on all addresses (0.0.0.0)
#  * Running on http://127.0.0.1:5000

# Test et
curl http://localhost:5000

# Tarayicida: http://localhost:5000
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
mkdir -p ~/TechFlow_Docker_Project/03-Images/node-app
cd ~/TechFlow_Docker_Project/03-Images/node-app

# package.json
cat > package.json << 'EOF'
{
  "name": "techflow-node",
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
    message: 'TechFlow Node.js API',
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
docker build -t techflow-node:v1 .

# Run
docker run -d -p 3000:3000 --name node-api techflow-node:v1

# Test
curl http://localhost:3000
```

## Kontrol Noktasi 3

```bash
# Her iki uygulamayi calistir
docker ps

# Cikti:
# flask-app (port 5000)
# node-api (port 3000)

# Image boyutlarini karsilastir
docker images | grep techflow

# Layer history
docker history techflow-flask:v1
docker history techflow-node:v1

# Teslimat dosyasi
mkdir -p ~/TechFlow_Docker_Project/03-Images
cd ~/TechFlow_Docker_Project/03-Images

{
  echo "=== Custom Images ==="
  docker images | grep techflow
  echo ""
  echo "=== Running Containers ==="
  docker ps --filter "name=flask-app"
  docker ps --filter "name=node-api"
  echo ""
  echo "=== Flask Test ==="
  curl -s http://localhost:5000 | head -5
  echo ""
  echo "=== Node Test ==="
  curl -s http://localhost:3000
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

---

# MODUL 4: Docker Compose - Multi-Container Uygulamalar

## Ne Ogreneceksiniz
- Docker Compose nedir ve neden kullanilir?
- docker-compose.yml syntax
- Multi-container uygulamalari yonetme
- Service'ler arasi network ve bagimliliklar
- Volume yonetimi Compose ile
- Environment variables ve secrets

## Teori (Hizli Gecis)

### Docker Compose Nedir?
Birden fazla container'i tek bir YAML dosyasi ile tanimlama ve yonetme araci.

### Neden Gerekli?
```bash
# Docker CLI ile (zahmetli):
docker network create app-network
docker volume create db-data
docker run -d --name db --network app-network -v db-data:/var/lib/mysql mysql
docker run -d --name backend --network app-network -p 5000:5000 api-image
docker run -d --name frontend --network app-network -p 80:80 web-image

# Docker Compose ile (kolay):
docker compose up -d
```

### Compose Yapisi:
```yaml
services:        # Container'lar
  web:
    image: nginx
    ports:
      - "80:80"

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
mkdir -p ~/TechFlow_Docker_Project/04-Compose/wordpress
cd ~/TechFlow_Docker_Project/04-Compose/wordpress
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

  # WordPress Application
  wordpress:
    image: wordpress:latest
    container_name: wordpress-app
    restart: always
    ports:
      - "8080:80"
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
      - db

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
>     - `ports`: Host 8080 -> Container 80
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
# wordpress-app     wordpress:latest   Up 2 minutes   0.0.0.0:8080->80/tcp
# wordpress-db      mysql:8.0          Up 2 minutes   3306/tcp

# Log'lari izle
docker compose logs -f

# Sadece WordPress loglari
docker compose logs wordpress

# Resource kullanimi
docker compose top
```

**ADIM 5: Test Et**
```bash
# Tarayicida: http://localhost:8080
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
mkdir -p ~/TechFlow_Docker_Project/04-Compose/fullstack/{frontend,backend}
cd ~/TechFlow_Docker_Project/04-Compose/fullstack
```

**ADIM 2: Backend API (Node.js)**
```bash
cd backend

# package.json
cat > package.json << 'EOF'
{
  "name": "techflow-api",
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
  user: process.env.DB_USER || 'techflow',
  password: process.env.DB_PASS || 'techflow123',
  database: process.env.DB_NAME || 'techflowdb'
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
    <title>TechFlow App</title>
    <style>
        body { font-family: Arial; max-width: 800px; margin: 50px auto; }
        button { padding: 10px 20px; font-size: 16px; cursor: pointer; }
        #result { margin-top: 20px; padding: 20px; background: #f0f0f0; }
    </style>
</head>
<body>
    <h1>TechFlow Full Stack Application</h1>
    <button onclick="checkHealth()">Check API Health</button>
    <button onclick="getUsers()">Get Users</button>
    <div id="result"></div>

    <script>
        const API_URL = 'http://localhost:5001';

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
    ('Alice Johnson', 'alice@techflow.com'),
    ('Bob Smith', 'bob@techflow.com'),
    ('Carol White', 'carol@techflow.com'),
    ('David Brown', 'david@techflow.com'),
    ('Eve Davis', 'eve@techflow.com');
EOF
```

**ADIM 5: Docker Compose (Ana Orkestrasyon)**
```bash
cat > docker-compose.yml << 'EOF'
services:
  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: techflow-db
    restart: always
    environment:
      POSTGRES_USER: techflow
      POSTGRES_PASSWORD: techflow123
      POSTGRES_DB: techflowdb
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - backend-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U techflow"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Node.js API
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: techflow-api
    restart: always
    ports:
      - "5001:5000"
    environment:
      DB_HOST: db
      DB_USER: techflow
      DB_PASS: techflow123
      DB_NAME: techflowdb
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
    container_name: techflow-web
    restart: always
    ports:
      - "8081:80"
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
curl http://localhost:5001/api/health

# Frontend
# Tarayici: http://localhost:8081
```

> **NOT:** Eger init.sql otomatik calismazsa (volume onceden varsa):
> ```bash
> docker compose exec db psql -U techflow -d techflowdb -f /docker-entrypoint-initdb.d/init.sql
> ```

## Kontrol Noktasi 4

```bash
cd ~/TechFlow_Docker_Project/04-Compose

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
  curl -s http://localhost:5001/api/health
  echo ""
  echo "=== Database Test ==="
  docker compose exec db psql -U techflow -d techflowdb -c "SELECT COUNT(*) FROM users;"
} > compose_proof.txt

cat compose_proof.txt
```

## Sik Yapilan Hatalar

| Hata | Sebep | Cozum |
|------|-------|-------|
| service "db" didn't complete successfully | DB baslamadi | `docker compose logs db` kontrol et |
| Port cakismasi | Port kullanimda | Farkli port: `"8082:80"` |
| API DB'ye baglanmiyor | Service ismi yanlis | `DB_HOST: db` (service name) |
| depends_on calismiyor | Healthcheck yok | `condition: service_healthy` ekle |
| Volume izni sorunu | Permission denied | chmod veya Dockerfile'da USER |
| init.sql calismadi | Volume onceden vardi | Volume'u sil: `docker compose down -v` |

---

# MODUL 5: Docker Storage - Volume ve Bind Mounts

## Ne Ogreneceksiniz
- Container filesystem yapisi
- Volume turleri (named, anonymous, bind mount)
- Data persistence stratejileri
- Volume backup ve restore
- Storage driver'lar

## Teori (Hizli Gecis)

### Container Storage Katmanlari:
```
+-------------------------+
| Container Layer (R/W)   | <- Gecici, silinebilir
+-------------------------+
| Image Layers (R/O)      | <- Kalici, paylasimli
+-------------------------+
```
**Sorun:** Container silindiginde veriler kaybolur!

**Cozum:** Volumes

### Volume Turleri:

**1. Named Volume (Docker yonetir)**
```bash
docker volume create my-vol
docker run -v my-vol:/data nginx
```

**2. Anonymous Volume (Otomatik olusur)**
```bash
docker run -v /data nginx
```

**3. Bind Mount (Host path)**
```bash
docker run -v /host/path:/container/path nginx
```

### Karsilastirma:

| Ozellik | Named Volume | Anonymous | Bind Mount |
|---------|--------------|-----------|------------|
| Yonetim | Docker | Docker | Manuel |
| Backup | Kolay | Zor | Kolay |
| Performans | Yuksek | Yuksek | Orta |
| Path | Docker secer | Docker secer | Sen belirlersin |
| Production | Onerilir | Onerilmez | Dikkatli |

## Uygulama (Adim Adim)

### 5.1 Named Volume Kullanimi

**Senaryo:** PostgreSQL database'i kalici hale getir

**ADIM 1: Volume Olustur**
```bash
mkdir -p ~/TechFlow_Docker_Project/05-Storage
cd ~/TechFlow_Docker_Project/05-Storage

# Volume olustur
docker volume create postgres-data

# Volume'lari listele
docker volume ls

# Cikti:
# DRIVER    VOLUME NAME
# local     postgres-data

# Volume detaylari
docker volume inspect postgres-data
# Cikti:
# "Mountpoint": "/var/lib/docker/volumes/postgres-data/_data"
```

**ADIM 2: PostgreSQL Container ile Volume Kullan**
```bash
# PostgreSQL calistir (volume ile)
docker run -d \
  --name postgres-persistent \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=testdb \
  -v postgres-data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:15-alpine

# Birkac saniye bekle
sleep 5

# Test: Database olustur
docker exec postgres-persistent psql -U postgres -d testdb -c "
CREATE TABLE users (id SERIAL, name VARCHAR(50));
INSERT INTO users (name) VALUES ('Alice'), ('Bob');
SELECT * FROM users;
"
```

**ADIM 3: Data Persistence Testi**
```bash
# Container'i SIL
docker rm -f postgres-persistent

# Volume hala var mi?
docker volume ls | grep postgres-data
# Cikti: Evet, volume silinmedi!

# Ayni volume ile yeni container baslat
docker run -d \
  --name postgres-new \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=testdb \
  -v postgres-data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:15-alpine

sleep 3

# Veri hala var mi?
docker exec postgres-new psql -U postgres -d testdb -c "SELECT * FROM users;"

# Cikti:
# id | name
# ----+-------
#  1 | Alice
#  2 | Bob
# BASARILI: Veri kaybolmadi!
```

### 5.2 Bind Mount Kullanimi

**Senaryo:** Web projesi gelistirirken live reload

**ADIM 1: Proje Dizini**
```bash
mkdir -p ~/TechFlow_Docker_Project/05-Storage/webapp
cd ~/TechFlow_Docker_Project/05-Storage/webapp

# HTML dosyasi
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>TechFlow Web</title></head>
<body>
    <h1>TechFlow Live Development</h1>
    <p>Version: 1.0</p>
</body>
</html>
EOF

# Dosya izinlerini ayarla (onemli!)
chmod 644 index.html
```

**ADIM 2: Bind Mount ile Nginx**
```bash
# Nginx calistir (bind mount)
docker run -d \
  --name dev-web \
  -p 8082:80 \
  -v $(pwd):/usr/share/nginx/html:ro \
  nginx:alpine

# :ro = read-only (guvenlik icin)

# Test
curl http://localhost:8082
```

**ADIM 3: Live Reload Testi**
```bash
# Dosyayi duzenle (HOST'ta)
echo "<p>Updated at $(date)</p>" >> index.html

# Tekrar test (hemen yansir!)
curl http://localhost:8082
```

> **Ne Oldu?** Host'taki dosya degisikligi container icinde aninda goruldu! Development'ta cok kullanisli.

### 5.3 Volume Backup ve Restore

**Backup:**
```bash
cd ~/TechFlow_Docker_Project/05-Storage

# Calisan container'dan volume backup
docker run --rm \
  -v postgres-data:/data \
  -v $(pwd):/backup \
  alpine \
  tar czf /backup/postgres-backup-$(date +%Y%m%d).tar.gz -C /data .

# Backup dosyasi olusturuldu
ls -lh postgres-backup-*.tar.gz
```

**Restore:**
```bash
# Yeni volume olustur
docker volume create postgres-data-restored

# Backup'tan restore et
docker run --rm \
  -v postgres-data-restored:/data \
  -v $(pwd):/backup \
  alpine \
  sh -c "tar xzf /backup/postgres-backup-*.tar.gz -C /data"

# Test et
docker run -d \
  --name postgres-restored \
  -v postgres-data-restored:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=mypassword \
  postgres:15-alpine

# Veri geldi mi?
docker exec postgres-restored psql -U postgres -c "\l"
```

## Kontrol Noktasi 5

```bash
cd ~/TechFlow_Docker_Project/05-Storage

{
  echo "=== Volumes ==="
  docker volume ls
  echo ""
  echo "=== Volume Details ==="
  docker volume inspect postgres-data 2>/dev/null || echo "Volume not found"
  echo ""
  echo "=== Backup Files ==="
  ls -lh postgres-backup-*.tar.gz 2>/dev/null || echo "No backups"
} > storage_proof.txt

cat storage_proof.txt
```

## Sik Yapilan Hatalar

| Hata | Sebep | Cozum |
|------|-------|-------|
| Volume bos | Yanlis path | Container ici path kontrol et |
| Permission denied | User/group uyusmuyor | chmod veya Dockerfile'da USER |
| Bind mount Windows'ta yavas | WSL2 disk | Volume kullan veya WSL2 icinde calis |
| Volume silinemiyor | Container kullaniyor | `docker rm -f` -> `docker volume rm` |

---

# MODUL 6: Docker Networking

## Ne Ogreneceksiniz
- Docker network turleri (bridge, host, overlay)
- Container'lar arasi iletisim
- DNS resolution
- Port publishing
- Network izolasyonu

## Teori (Hizli Gecis)

### Network Turleri:

| Tur | Aciklama | Kullanim |
|-----|----------|----------|
| bridge | Default, izole network | Single host |
| host | Host network'u kullan | Performance kritik |
| overlay | Multi-host network | Swarm/Kubernetes |
| none | Network yok | Maksimum izolasyon |

### Bridge Network Yapisi:
```
+-------------------------------------+
|           Host Machine              |
|  +------------------------------+   |
|  |   docker0 (bridge)           |   |
|  |   172.17.0.1                 |   |
|  |  +--------+     +---------+  |   |
|  |  |Container|     |Container|  |   |
|  |  |172.17.0.2|---|172.17.0.3|  |   |
|  |  +--------+     +---------+  |   |
|  +------------------------------+   |
|           |                         |
|      eth0 (Public IP)               |
+-------------------------------------+
```

## Uygulama (Adim Adim)

### 6.1 Custom Bridge Network

```bash
mkdir -p ~/TechFlow_Docker_Project/06-Networking
cd ~/TechFlow_Docker_Project/06-Networking

# Custom network olustur
docker network create techflow-net

# Network listesi
docker network ls

# Network detaylari
docker network inspect techflow-net

# Iki container ayni network'te
docker run -d --name web1 --network techflow-net nginx:alpine
docker run -d --name web2 --network techflow-net nginx:alpine

# web1'den web2'ye ping
docker exec web1 ping -c 3 web2
# BASARILI! DNS ile cozumlendi
```

### 6.2 Multi-Network Container

```bash
# Iki network
docker network create frontend-net
docker network create backend-net

# API container her iki network'te
docker run -d --name api \
  --network frontend-net \
  nginx:alpine

docker network connect backend-net api

# Container kac network'te?
docker inspect api --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}'
# Cikti: backend-net frontend-net
```

### 6.3 Network Izolasyonu Testi

```bash
# Farkli network'teki container'lar birbirini goremez
docker run -d --name isolated --network backend-net alpine sleep 1000

# web1 (techflow-net) -> isolated (backend-net) ping BASARISIZ olacak
docker exec web1 ping -c 1 isolated 2>&1 || echo "Ping failed - Network isolated!"
```

## Kontrol Noktasi 6

```bash
cd ~/TechFlow_Docker_Project/06-Networking

{
  echo "=== Networks ==="
  docker network ls
  echo ""
  echo "=== Network Inspect ==="
  docker network inspect techflow-net 2>/dev/null | head -30
  echo ""
  echo "=== Container Networks ==="
  docker inspect api --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}' 2>/dev/null
} > network_proof.txt

cat network_proof.txt
```

---

# MODUL 7: Final Projesi - TechFlow E-Commerce Platform

## Proje Hedefi

Gercek dunya senaryosu: Mikroservis mimarisinde e-ticaret platformu deploy edin.

### Mimari:
```
                    +------------------+
                    |    Frontend      |
                    |   (Nginx:8090)   |
                    +--------+---------+
                             |
                    +--------v---------+
                    |   API Gateway    |
                    |  (Node.js:3001)  |
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
| Frontend | Nginx | 8090 | Web arayuzu |
| API Gateway | Node.js | 3001 | Tum API isteklerini yonlendirir |
| Product Service | Python Flask | 5000 (internal) | Urun yonetimi |
| Order Service | Node.js | 5001 (internal) | Siparis yonetimi |
| PostgreSQL | PostgreSQL 15 | 5432 (internal) | Veritabani |
| Redis | Redis 7 | 6379 (internal) | Cache |

## Uygulama

### Proje Yapisi Olustur

```bash
mkdir -p ~/TechFlow_Docker_Project/07-Final-Project/Dockerfiles/{product-service,order-service,api-gateway,frontend}
cd ~/TechFlow_Docker_Project/07-Final-Project
```

### Product Service (Python Flask)

```bash
cd Dockerfiles/product-service

cat > app.py << 'EOF'
from flask import Flask, jsonify
import os
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
        return jsonify({"source": "cache", "products": eval(cached)})

    # Cache miss - store in Redis
    redis_client.setex('products', 60, str(PRODUCTS))
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
LABEL maintainer="techflow@example.com"
LABEL service="product-service"

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .

EXPOSE 5000

CMD ["python", "app.py"]
EOF

cd ../..
```

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
LABEL maintainer="techflow@example.com"
LABEL service="order-service"

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY server.js .

EXPOSE 5001

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
LABEL maintainer="techflow@example.com"
LABEL service="api-gateway"

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY server.js .

EXPOSE 3000

CMD ["node", "server.js"]
EOF

cd ../..
```

### Frontend (Nginx)

```bash
cd Dockerfiles/frontend

cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechFlow E-Commerce</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', sans-serif; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        header { background: #2c3e50; color: white; padding: 20px; margin-bottom: 20px; }
        header h1 { font-size: 24px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .card h3 { color: #2c3e50; margin-bottom: 10px; }
        .price { color: #27ae60; font-size: 24px; font-weight: bold; }
        .stock { color: #7f8c8d; font-size: 14px; margin-top: 5px; }
        button { background: #3498db; color: white; border: none; padding: 10px 20px;
                 border-radius: 4px; cursor: pointer; margin-top: 10px; }
        button:hover { background: #2980b9; }
        .orders { margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ecf0f1; }
        th { background: #34495e; color: white; }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>TechFlow E-Commerce Platform</h1>
        </div>
    </header>

    <div class="container">
        <h2>Products</h2>
        <div id="products" class="grid"></div>

        <div class="orders">
            <h2>Recent Orders</h2>
            <table>
                <thead>
                    <tr><th>ID</th><th>Customer</th><th>Product</th><th>Qty</th><th>Date</th></tr>
                </thead>
                <tbody id="orders"></tbody>
            </table>
        </div>
    </div>

    <script>
        const API_URL = 'http://localhost:3001';

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
                        <button onclick="orderProduct(${p.id}, '${p.name}')">Order</button>
                    </div>
                `).join('');
            } catch (err) {
                document.getElementById('products').innerHTML = '<p>Failed to load</p>';
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
                `).join('') || '<tr><td colspan="5">No orders</td></tr>';
            } catch {
                document.getElementById('orders').innerHTML = '<tr><td colspan="5">Failed</td></tr>';
            }
        }

        async function orderProduct(productId, productName) {
            const customer = prompt('Your name:');
            if (!customer) return;
            const quantity = parseInt(prompt('Quantity:', '1'));
            if (!quantity) return;

            try {
                await fetch(`${API_URL}/api/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ customer_name: customer, product_id: productId, quantity })
                });
                alert('Order placed!');
                loadOrders();
            } catch {
                alert('Order failed');
            }
        }

        loadProducts();
        loadOrders();
    </script>
</body>
</html>
EOF

cat > Dockerfile << 'EOF'
FROM nginx:alpine
LABEL maintainer="techflow@example.com"
LABEL service="frontend"

COPY index.html /usr/share/nginx/html/
EXPOSE 80
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
      POSTGRES_USER: techflow
      POSTGRES_PASSWORD: techflow123
      POSTGRES_DB: orders
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - backend-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U techflow -d orders"]
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
      DB_USER: techflow
      DB_PASS: techflow123
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
      - "3001:3000"
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
      - "8090:80"
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
docker compose exec db psql -U techflow -d orders -f /docker-entrypoint-initdb.d/init.sql
```

### Test

```bash
# API Gateway
curl http://localhost:3001/health

# Products
curl http://localhost:3001/api/products

# Orders
curl http://localhost:3001/api/orders

# Yeni siparis
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Test User","product_id":1,"quantity":2}'

# Frontend: http://localhost:8090
```

## Kontrol Noktasi 7 (Final)

```bash
cd ~/TechFlow_Docker_Project/07-Final-Project

{
  echo "=== TechFlow E-Commerce Platform ==="
  echo "Date: $(date)"
  echo ""
  echo "=== Services ==="
  docker compose ps
  echo ""
  echo "=== API Health ==="
  curl -s http://localhost:3001/health
  echo ""
  echo "=== Products ==="
  curl -s http://localhost:3001/api/products | head -100
  echo ""
  echo "=== Orders ==="
  curl -s http://localhost:3001/api/orders
} > deployment_proof.txt

cat deployment_proof.txt
```

---

# Temizlik

```bash
# Tum projeleri durdur
cd ~/TechFlow_Docker_Project/07-Final-Project && docker compose down -v
cd ~/TechFlow_Docker_Project/04-Compose/fullstack && docker compose down -v
cd ~/TechFlow_Docker_Project/04-Compose/wordpress && docker compose down -v

# Tek tek container'lari durdur
docker stop flask-app node-api dev-web postgres-new 2>/dev/null
docker rm flask-app node-api dev-web postgres-new 2>/dev/null

# Network temizligi
docker network prune -f

# Volume temizligi (DIKKAT: Veri kaybi!)
docker volume prune -f

# Image temizligi
docker image prune -a -f
```

---

# Basari Kriterleri

- [x] Tum moduller tamamlandi
- [x] Container'lar calisiyor
- [x] Volume'larla veri kalici
- [x] Network izolasyonu dogru
- [x] Dokumantasyon eksiksiz
- [x] Troubleshooting yapabilme

---

**Tebrikler! Docker Bootcamp'i tamamladiniz!**
