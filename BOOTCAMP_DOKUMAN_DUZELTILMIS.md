# Docker Bootcamp Bitirme Projesi
## Kampus Digitals Mikroservis Platformu (Hands-On Learning Edition)
### Duzeltilmis ve Guncel Versiyon

**Felsefe:** Bu proje bir sinav degildir. Her modul, bir onceki modulun uzerine insa edilir ve ogrenci yaparak ogrenir. Hata yapmak ogrenme surecinin parcasidir.

---

## Projenin Hikayesi

Kampus Digitals sirketi monolitik uygulamasini mikroservislere geciriyor. Siz bu projenin DevOps muhendisi olarak gorevlendirildiniz. Sirket hedefleri net: containerization, hizli deployment, izole calisma ortamlari ve production-ready altyapi.

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
- **OS:** Windows 10/11 (Build 19041+), Ubuntu 22.04/24.04, veya macOS
- **CPU:** 2 core (onerilen 4 core)
- **RAM:** Minimum 8 GB (WSL2 + Docker Desktop icin onemli)
- **Disk:** 20 GB bos alan
- **Network:** Internet erisimi
- **BIOS:** Virtualization (VT-x / AMD-V) aktif olmali

### Calisma Ortami:
Bu bootcamp'te birincil ortam: **Windows + WSL2 + Docker Desktop**

> **Not:** Docker container'lari her zaman Linux uzerinde calisir. WSL2, Windows icinde gercek bir Linux kernel'i calistirdigi icin container'lar native Linux performansinda calisir. Siz WSL2 terminali icinde sanki bir Linux makinesindeymisiniz gibi calisacaksiniz.

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

### 1.1 WSL2 Kurulumu (Windows)

> **Bu bootcamp'te tum komutlar WSL2 terminal'inde calistirilacaktir.**

**ADIM 1: WSL2'yi Kur**

Windows PowerShell'i **Yonetici olarak** acin (sag tik -> "Yonetici olarak calistir"):
```powershell
# WSL2 ve Ubuntu'yu kur (tek komut)
wsl --install

# Bilgisayari yeniden baslatin
```

> **Not:** Yeniden baslatma sonrasi Ubuntu terminal penceresi otomatik acilir. Bir kullanici adi ve sifre belirlemeniz istenecek. Bu sifre `sudo` komutlari icin kullanilacak.

**ADIM 2: WSL2 Versiyonunu Dogrula**

PowerShell'de:
```powershell
# WSL versiyonunu kontrol et
wsl --list --verbose

# Beklenen cikti:
#   NAME      STATE           VERSION
# * Ubuntu    Running         2
#
# VERSION sutununda "2" yazmali!
```

Eger VERSION "1" gosteriyorsa:
```powershell
wsl --set-version Ubuntu 2
```

**ADIM 3: WSL2 Terminal'ine Giris**

Bundan sonra tum islemler WSL2 icinde yapilacak:
```powershell
# PowerShell'den WSL2'ye gec
wsl
```

Veya:
- Baslat menusunden "Ubuntu" uygulamasini acin
- Windows Terminal kullaniyorsaniz, yeni sekme acip "Ubuntu" secin

> **Artik bir Linux terminalisindesiniz.** Bundan sonraki tum komutlar bu terminalde calistirilacaktir.

### 1.2 Docker Desktop Kurulumu (Windows + WSL2)

**ADIM 1: Docker Desktop Indir ve Kur**
1. https://www.docker.com/products/docker-desktop/ adresinden Docker Desktop'i indirin
2. `Docker Desktop Installer.exe` dosyasini calistirin
3. Kurulum sihirbazinda **"Use WSL 2 instead of Hyper-V"** seceneginin isaretli oldugundan emin olun
4. Kurulumu tamamlayin ve bilgisayari yeniden baslatin

**ADIM 2: Docker Desktop Ayarlari**
1. Docker Desktop'i acin (sistem tepsisindeki balina ikonu)
2. **Settings (Ayarlar)** > **General**: "Use the WSL 2 based engine" isaretli olmali
3. **Settings** > **Resources** > **WSL Integration**: "Ubuntu" dagitiminin aktif oldugunu dogrulayin
4. **Apply & Restart** tiklayin

**ADIM 3: WSL2 Terminal'inden Docker'i Test Et**

WSL2 terminal'ini acin ve test edin:
```bash
# Docker versiyonunu kontrol et
docker --version
# Beklenen: Docker version 27.x veya ustu

# Docker Compose versiyonu
docker compose version
# Beklenen: Docker Compose version v2.x

# Docker calisma durumu
docker info | head -5
```

> **ONEMLI:** Docker Desktop acik olmadan docker komutlari calismaz! Docker Desktop'in sistem tepsisinde (sag alt) calistigindan emin olun. Balina ikonu yesil ise hazir demektir.

> **Not:** Docker Desktop WSL2 entegrasyonu sayesinde `sudo` gerekmez, `docker` grubu otomasyonu Docker Desktop tarafindan yonetilir. `systemctl` komutlari da gerekmez — Docker Desktop servisi otomatik baslatir.

### 1.3 Docker Kurulumu (Native Ubuntu - Alternatif)

> Bu bolum sadece WSL2 yerine native Ubuntu kullananlar icindir. Docker Desktop + WSL2 kurduysaniz bu bolumu atlayabilirsiniz.

<details>
<summary>Native Ubuntu kurulumu icin tiklayin</summary>

**ADIM 1: Eski Versiyonlari Temizle**
```bash
sudo apt remove docker docker-engine docker.io containerd runc 2>/dev/null
sudo apt update && sudo apt upgrade -y
```

**ADIM 2: Gerekli Paketleri Kur**
```bash
sudo apt install -y ca-certificates curl gnupg lsb-release
```

**ADIM 3: Docker GPG Key ve Repository Ekle**
```bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

**ADIM 4: Docker Engine Kur**
```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io \
    docker-buildx-plugin docker-compose-plugin
```

**ADIM 5: Servisi Baslat ve Kullaniciyi Docker Grubuna Ekle**
```bash
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
newgrp docker
```

</details>

### 1.4 Docker Kurulum Testi

> **Hatirlatma:** Asagidaki tum komutlari WSL2 terminali icinde calistirin.

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
mkdir -p ~/Kampus_Docker_Project/01-Installation
cd ~/Kampus_Docker_Project/01-Installation

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
- Docker version 27.x+ gorunuyor
- Docker info calisiyor
- hello-world ve ubuntu image'lari var
- Durmus container'lar listede

## Sik Yapilan Hatalar

| Hata | Sebep | Cozum |
|------|-------|-------|
| Cannot connect to Docker daemon | Docker Desktop calismiyor | Docker Desktop'i acin, balina ikonunun yesil olmasini bekleyin |
| docker: command not found | WSL2 entegrasyonu kapali | Docker Desktop > Settings > Resources > WSL Integration > Ubuntu aktif et |
| permission denied (WSL2) | Docker Desktop yeni kuruldu | WSL2 terminalini kapatip tekrar acin |
| Image pull hatasi | Network/proxy sorunu | `docker pull` manuel dene, kurumsal proxy varsa Docker Desktop > Settings > Resources > Proxies |
| WSL2 cok yavas | Yeterli RAM yok | `.wslconfig` dosyasinda memory limiti artirin (asagiya bakin) |
| "Virt. technology disabled" | BIOS ayari | BIOS'ta Intel VT-x veya AMD-V'yi aktif edin |

> **WSL2 Performans Ayari:** Eger WSL2 yavas calisiyorsa, Windows kullanici dizininizde (`C:\Users\KULLANICI_ADI`) `.wslconfig` dosyasi olusturun:
> ```
> [wsl2]
> memory=4GB
> processors=2
> ```
> Sonra PowerShell'de `wsl --shutdown` calistirip WSL2'yi yeniden baslatin.

## Anlama Testi

1. **Docker daemon ve Docker CLI arasindaki fark nedir?**
   > CLI kullanici komutlarini alir, daemon arka planda calisir ve container'lari yonetir. API ile haberlesirler. Docker Desktop bu daemon'i WSL2 icinde otomatik baslatir.

2. **`docker run hello-world` komutunu tekrar calistirirsaniz ne olur?**
   > Image zaten local'de oldugu icin pull yapmaz, direkt calistirir. Cok daha hizlidir.

3. **Container durdugunda ne olur? Veri kaybolur mu?**
   > Container durdurulur ama silinmez. `docker ps -a` ile gorulur. Veri container icinde kalir ama volume kullanmazsan container silindiginde kaybolur.

4. **WSL2 terminalinde calistirdigimiz container'lar nerede calisiyor?**
   > Container'lar WSL2 icindeki Linux kernel'inde calisir. Docker Desktop bunu otomatik yonetir. `localhost` ile hem WSL2 icinden hem Windows tarayicinizdan erisilebilir.

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
docker run -d -p 40080:80 nginx

# Test et
curl http://localhost:40080

# Cikti: Nginx welcome page HTML!
```

> **Port Mapping Mantigi:**
> ```
> localhost:40080  ->  Docker Engine  ->  Container:80
>    (Host)               (Bridge)         (Nginx)
> ```

**Isimlendirme:**
```bash
# --name flag: container'a isim ver
docker run -d -p 40081:80 --name my-nginx nginx

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
mkdir -p ~/Kampus_Docker_Project/02-Commands
cd ~/Kampus_Docker_Project/02-Commands

# 1. Ilk Nginx (port 40081)
docker run -d -p 40081:80 --name web1 nginx

# 2. Ikinci Nginx (port 40082)
docker run -d -p 40082:80 --name web2 nginx

# 3. Ucuncu Nginx (port 40083)
docker run -d -p 40083:80 --name web3 nginx

# Test et
curl -s http://localhost:40081 | head -5
curl -s http://localhost:40082 | head -5
curl -s http://localhost:40083 | head -5

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
| localhost'a erisilemiyor | Tarayici veya port sorunu | WSL2 terminalinde `curl` ile test edin; Docker Desktop calistigini kontrol edin |

## Anlama Testi

1. **`docker run -d` ile `docker run` arasindaki fark nedir?**
   > `-d` (detached) container'i arka planda calistirir, terminal serbest kalir. `-d` olmadan terminal kilitlenir ve container log'lari ekrana gelir.

2. **`docker stop` ile `docker kill` arasindaki fark nedir?**
   > `stop` once SIGTERM sinyali gonderir ve 10 saniye bekler (graceful shutdown). `kill` direkt SIGKILL gonderir (aninda durdurur). Tercih: `stop`.

3. **`docker rm` ile `docker rmi` ne farki var?**
   > `rm` container siler, `rmi` image siler. Calisan container'i silmek icin once `stop` etmeli veya `-f` kullanmali.

4. **Port mapping'de `-p 40080:80` ne anlama gelir?**
   > Host'un 40080 portuna gelen istekler container'in 80 portuna yonlendirilir. Format: `host_port:container_port`.

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

# MODUL 4: Docker Compose - Multi-Container Uygulamalar

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
mkdir -p ~/Kampus_Docker_Project/05-Storage
cd ~/Kampus_Docker_Project/05-Storage

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
  -p 40432:5432 \
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
  -p 40432:5432 \
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
mkdir -p ~/Kampus_Docker_Project/05-Storage/webapp
cd ~/Kampus_Docker_Project/05-Storage/webapp

# HTML dosyasi
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>Kampus Digitals Web</title></head>
<body>
    <h1>Kampus Digitals Live Development</h1>
    <p>Version: 1.0</p>
</body>
</html>
EOF

# Dosya izinlerini ayarla (onemli!)
chmod 644 index.html
```

> **WSL2 Notu:** `chmod` komutu WSL2 icindeki Linux dosya sisteminde (`/home/...`) sorunsuz calisir. Dosyalarinizi Windows tarafinda (`/mnt/c/...`) degil, WSL2 icinde olusturdugunuzdan emin olun.

**ADIM 2: Bind Mount ile Nginx**
```bash
# Nginx calistir (bind mount)
docker run -d \
  --name dev-web \
  -p 40082:80 \
  -v $(pwd):/usr/share/nginx/html:ro \
  nginx:alpine

# :ro = read-only (guvenlik icin)

# Test (WSL2 terminalinden)
curl http://localhost:40082

# Windows tarayicinizdan da erisebilirsiniz: http://localhost:40082
```

> **WSL2 Performans Notu:** `$(pwd)` komutu WSL2 bash'te calisir. Bind mount performansi icin dosyalarinizi mutlaka WSL2 dosya sisteminde (`/home/kullanici/...`) tutun. Windows dosya sistemi (`/mnt/c/...`) uzerinden bind mount yapmak belirgin sekilde yavas olacaktir.

**ADIM 3: Live Reload Testi**
```bash
# Dosyayi duzenle (HOST'ta, yani WSL2 terminalinizde)
echo "<p>Updated at $(date)</p>" >> index.html

# Tekrar test (hemen yansir!)
curl http://localhost:40082
```

> **Ne Oldu?** Host'taki (WSL2) dosya degisikligi container icinde aninda goruldu! Development'ta cok kullanisli.

### 5.3 Volume Backup ve Restore

> **Not:** Asagidaki komutlarda `$(pwd)` WSL2 bash'te sorunsuz calisir. Komutlari WSL2 terminalinde calistirdiginizdan emin olun.

**Backup:**
```bash
cd ~/Kampus_Docker_Project/05-Storage

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
cd ~/Kampus_Docker_Project/05-Storage

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
| Bind mount cok yavas | Dosyalar `/mnt/c/` altinda | Dosyalari WSL2 icine tasyin (`/home/...`). `/mnt/c/` uzerinden bind mount 5-10x yavas olur |
| `$(pwd)` calismadi | PowerShell kullaniliyor | WSL2 bash terminalini kullanin, PowerShell degil |
| Volume silinemiyor | Container kullaniyor | `docker rm -f` -> `docker volume rm` |

## Anlama Testi

1. **Named volume ile bind mount arasindaki temel fark nedir?**
   > Named volume'u Docker yonetir (yeri Docker secer). Bind mount'ta siz host'taki dizini belirtirsiniz. Named volume production icin onerilir, bind mount development icin idealdir.

2. **Container sildigimizde volume'daki veri ne olur?**
   > Named volume silinmez! Veri korunur. Volume'u silmek icin `docker volume rm` veya `docker compose down -v` kullanmaniz gerekir.

3. **Bind mount'ta `:ro` suffix ne anlama gelir?**
   > Read-only. Container dosyalari sadece okuyabilir, degistiremez. Guvenlik icin onerilir (ornegin nginx'e config vermek).

4. **Volume backup neden onemlidir?**
   > Docker volume'lar host dosya sisteminde saklanir ama dogrudan erisilemez. Backup ile verileri portatif hale getirirsiniz. Ozellikle database volume'lari icin kritiktir.

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
mkdir -p ~/Kampus_Docker_Project/06-Networking
cd ~/Kampus_Docker_Project/06-Networking

# Custom network olustur
docker network create kampus-net

# Network listesi
docker network ls

# Network detaylari
docker network inspect kampus-net

# Iki container ayni network'te
docker run -d --name web1 --network kampus-net nginx:alpine
docker run -d --name web2 --network kampus-net nginx:alpine

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

# web1 (kampus-net) -> isolated (backend-net) ping BASARISIZ olacak
docker exec web1 ping -c 1 isolated 2>&1 || echo "Ping failed - Network isolated!"
```

## Kontrol Noktasi 6

```bash
cd ~/Kampus_Docker_Project/06-Networking

{
  echo "=== Networks ==="
  docker network ls
  echo ""
  echo "=== Network Inspect ==="
  docker network inspect kampus-net 2>/dev/null | head -30
  echo ""
  echo "=== Container Networks ==="
  docker inspect api --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}' 2>/dev/null
} > network_proof.txt

cat network_proof.txt
```

## Anlama Testi

1. **Default bridge network ile custom bridge network arasindaki fark nedir?**
   > Custom bridge network'te container'lar birbirini isimle (DNS) bulabilir. Default bridge'de sadece IP adresi ile iletisim kurulabilir.

2. **Farkli network'teki iki container birbirine erisebilir mi?**
   > Hayir. Farkli network'ler izole edilmistir. Bir container birden fazla network'e baglanabilir (ornegin API Gateway hem frontend hem backend network'e bagli).

3. **`docker network connect` ne ise yarar?**
   > Calisan bir container'i mevcut bir network'e baglar. Boylece container birden fazla network'te yer alabilir.

4. **Neden her uygulama icin custom network olusturuyoruz?**
   > Izolasyon ve guvenlik. Farkli uygulamalarin container'lari birbirini goremez. Ayrica DNS cozumlemesi sadece ayni network'teki container'lar icin calisir.

---

# MODUL 7: Final Projesi - Kampus Digitals E-Commerce Platform

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

# EK KONULAR

## Environment Variables ve .env Dosyasi

Production ortaminda sifreleri docker-compose.yml dosyasina yazmak guvenlik riski olusturur. Bunun yerine `.env` dosyasi kullanin:

**ADIM 1: .env dosyasi olustur**
```bash
cd ~/Kampus_Docker_Project/07-Final-Project

cat > .env << 'EOF'
# Database
POSTGRES_USER=kampus
POSTGRES_PASSWORD=kampus123
POSTGRES_DB=orders

# Order Service
DB_HOST=db
DB_USER=kampus
DB_PASS=kampus123
DB_NAME=orders
EOF
```

**ADIM 2: docker-compose.yml'de referans ver**
```yaml
services:
  db:
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
```

> **ONEMLI:** `.env` dosyasini `.gitignore`'a ekleyin! Sifreler repository'ye commit edilmemeli.
> ```bash
> echo ".env" >> .gitignore
> ```

## Docker Registry ve Image Paylasimi

Image'larinizi Docker Hub'a yukleyerek baskalarinin kullanmasini saglayabilirsiniz:

```bash
# 1. Docker Hub'a giris
docker login

# 2. Image'i tag'le (kullanici_adi/image_adi:versiyon)
docker tag kampus-flask:v1 kullanici_adi/kampus-flask:v1

# 3. Push et
docker push kullanici_adi/kampus-flask:v1

# 4. Baska bir makinede pull et
docker pull kullanici_adi/kampus-flask:v1
```

> **Not:** Docker Hub'da ucretsiz hesapla sinirsiz public repository, 1 private repository olusturabilirsiniz.

## WSL2 + Docker Desktop Rehberi

Bu bootcamp boyunca WSL2 (Windows Subsystem for Linux 2) + Docker Desktop ortamini kullandiniz. Bu bolumde onemli noktalari ozetliyoruz.

### Mimari: Container'lar Nerede Calisiyor?

```
Windows 10/11
├── Docker Desktop (GUI yonetim araci)
├── WSL2 (gercek Linux kernel'i)
│   ├── Ubuntu distro (sizin terminaliniz)
│   └── docker-desktop distro (Docker Engine burada calisir)
│       └── Container'lar (her zaman Linux uzerinde!)
└── Windows tarayicisi (localhost ile container'lara erisir)
```

> **Onemli:** Docker container'lari her zaman Linux uzerinde calisir. WSL2, Windows icinde gercek bir Linux kernel'i calistirdigi icin container'lar native Linux performansinda calisir. Docker Desktop bu altyapiyi otomatik yonetir.

### Dosya Sistemi Performansi

| Konum | Ornek Path | Performans | Kullanim |
|-------|-----------|------------|----------|
| WSL2 icinde | `/home/kullanici/proje/` | Hizli (native) | **Tum proje dosyalariniz burada olmali** |
| Windows'tan WSL2 | `\\wsl$\Ubuntu\home\...` | Hizli | VS Code ile WSL2 dosyalarini acmak |
| WSL2'den Windows | `/mnt/c/Users/...` | **Yavas** | Kacinilmali, bind mount icin kullanmayin |

```bash
# DOGRU: Projeyi WSL2 icinde olusturun
cd ~
mkdir -p Kampus_Docker_Project
cd Kampus_Docker_Project

# YANLIS: Windows klasorunde calismak
cd /mnt/c/Users/kullanici/Desktop/proje  # YAVAS!
```

### VS Code ile WSL2 Entegrasyonu

WSL2 icindeki dosyalari VS Code ile duzenlemek icin:
```bash
# WSL2 terminalinde proje dizininde:
code .
```
Bu komut VS Code'u WSL2 modunda acar (sol altta "WSL: Ubuntu" yazar). Dosyalar otomatik olarak LF satir sonu kullanir.

> **CRLF Uyarisi:** Windows Notepad veya bazi editorler CRLF satir sonu kullanir. Docker container'larinda bu sorun yaratir (ozellikle shell scriptlerde `\r: command not found` hatasi). VS Code'da sag alt kosedeki "CRLF" yazisina tiklayip "LF" secin, veya WSL2 terminalinde `dos2unix dosya_adi` kullanin.

### Port Yonlendirme

Docker Desktop, container portlarini otomatik olarak Windows'a yonlendirir:
```
Container (port 40080)  -->  WSL2 (localhost:40080)  -->  Windows (localhost:40080)
```
Bu sayede hem WSL2 terminalinde `curl http://localhost:40080` hem de Windows tarayicisinda `http://localhost:40080` calisir.

### WSL2 Kaynak Yonetimi (.wslconfig)

WSL2 varsayilan olarak cok fazla RAM kullanabilir. Bunu sinirlamak icin Windows'ta `C:\Users\KullaniciAdi\.wslconfig` dosyasi olusturun:

```ini
[wsl2]
memory=4GB
processors=2
swap=2GB
```

Degisiklikler icin: PowerShell'de `wsl --shutdown` calistirin, ardindan WSL2'yi tekrar acin.

### Sik Karsilasilan WSL2 Sorunlari

| Sorun | Cozum |
|-------|-------|
| `docker: command not found` | Docker Desktop > Settings > Resources > WSL Integration > Ubuntu aktif edin |
| Container'lar cok yavas | Dosyalari `/mnt/c/` yerine WSL2 icinde (`/home/...`) tutun |
| Disk alani doldu | WSL2 terminalinde: `docker system prune -a` |
| WSL2 cok fazla RAM kullaniyor | `.wslconfig` ile sinirlayin (yukariya bakin) |
| `\r: command not found` | Dosyada CRLF var. `dos2unix dosya_adi` veya VS Code'da LF secin |
| Docker Desktop baslamiyor | BIOS'ta Intel VT-x / AMD-V aktif olmali |

---

# Temizlik

```bash
# Tum projeleri durdur
cd ~/Kampus_Docker_Project/07-Final-Project && docker compose down -v
cd ~/Kampus_Docker_Project/04-Compose/fullstack && docker compose down -v
cd ~/Kampus_Docker_Project/04-Compose/wordpress && docker compose down -v

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
