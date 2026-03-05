# MODUL 2: Temel Docker Komutlari

> Video: [YouTube Playlist](https://www.youtube.com/watch?v=fV6UCxSjxUE&list=PL9VRN2-Oku1lvLCq3mzUzaj88-CcVTNlX) uzerinden bu modulun uygulama videosunu izleyebilirsiniz.

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

[Onceki: Modul 1 - Docker Kurulumu](01-kurulum.md) | [Sonraki: Modul 3 - Dockerfile](03-dockerfile.md)
