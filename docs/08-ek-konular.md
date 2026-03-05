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

[Onceki: Modul 7 - Final Projesi](07-final-proje.md) | [Sonraki: Temizlik](09-temizlik.md)
