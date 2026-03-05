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

## Video Egitimler

Tum modullerin uygulama videolarina YouTube playlist uzerinden ulasabilirsiniz:

[Kampus Digitals Docker Bootcamp - YouTube Playlist](https://www.youtube.com/watch?v=fV6UCxSjxUE&list=PL9VRN2-Oku1lvLCq3mzUzaj88-CcVTNlX)

---

## Moduller

| Modul | Konu | Dosya |
|-------|------|-------|
| Modul 1 | Docker Kurulumu ve Temel Yapi | [01-kurulum.md](01-kurulum.md) |
| Modul 2 | Temel Docker Komutlari | [02-temel-komutlar.md](02-temel-komutlar.md) |
| Modul 3 | Docker Image Olusturma ve Dockerfile | [03-dockerfile.md](03-dockerfile.md) |
| Modul 4 | Docker Compose - Multi-Container Uygulamalar | [04-compose.md](04-compose.md) |
| Modul 5 | Docker Storage - Volume ve Bind Mounts | [05-storage.md](05-storage.md) |
| Modul 6 | Docker Networking | [06-networking.md](06-networking.md) |
| Modul 7 | Final Projesi - Kampus Digitals E-Commerce Platform | [07-final-proje.md](07-final-proje.md) |
| Ek Konular | Environment Variables, Registry, WSL2 Rehberi | [08-ek-konular.md](08-ek-konular.md) |
| Temizlik | Temizlik ve Basari Kriterleri | [09-temizlik.md](09-temizlik.md) |
