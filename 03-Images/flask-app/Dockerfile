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

# Python bagimliliklerini kur
RUN pip install --no-cache-dir -r requirements.txt

# Uygulama dosyalarini kopyala
COPY app.py .

# Port bilgisi (dokumantasyon)
EXPOSE 5000

# Environment variable
ENV ENV=production

# Container baslatma komutu
CMD ["python", "app.py"]
