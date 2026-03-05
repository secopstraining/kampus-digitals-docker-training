# MODUL 5: Docker Storage - Volume ve Bind Mounts

> Video: [YouTube Playlist](https://www.youtube.com/watch?v=fV6UCxSjxUE&list=PL9VRN2-Oku1lvLCq3mzUzaj88-CcVTNlX) uzerinden bu modulun uygulama videosunu izleyebilirsiniz.

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

[Onceki: Modul 4 - Docker Compose](04-compose.md) | [Sonraki: Modul 6 - Docker Networking](06-networking.md)
