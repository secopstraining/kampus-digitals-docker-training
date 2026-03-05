# MODUL 6: Docker Networking

> Video: [YouTube Playlist](https://www.youtube.com/watch?v=fV6UCxSjxUE&list=PL9VRN2-Oku1lvLCq3mzUzaj88-CcVTNlX) uzerinden bu modulun uygulama videosunu izleyebilirsiniz.

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

[Onceki: Modul 5 - Docker Storage](05-storage.md) | [Sonraki: Modul 7 - Final Projesi](07-final-proje.md)
