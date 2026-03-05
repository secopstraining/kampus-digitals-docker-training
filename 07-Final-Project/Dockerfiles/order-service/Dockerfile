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
