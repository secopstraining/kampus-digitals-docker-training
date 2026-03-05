FROM nginx:alpine
LABEL maintainer="kampus@example.com"
LABEL service="frontend"

COPY index.html /usr/share/nginx/html/
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1
