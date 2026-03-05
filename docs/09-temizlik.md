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

---

[Onceki: Ek Konular](08-ek-konular.md) | [Giris Sayfasi](00-giris.md)
