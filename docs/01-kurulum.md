# MODUL 1: Docker Kurulumu ve Temel Yapi

> Video: [YouTube Playlist](https://www.youtube.com/watch?v=fV6UCxSjxUE&list=PL9VRN2-Oku1lvLCq3mzUzaj88-CcVTNlX) uzerinden bu modulun uygulama videosunu izleyebilirsiniz.

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

[Sonraki: Modul 2 - Temel Docker Komutlari](02-temel-komutlar.md)
