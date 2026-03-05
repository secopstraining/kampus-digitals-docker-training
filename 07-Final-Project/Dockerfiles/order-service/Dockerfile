FROM node:18-alpine
LABEL maintainer="techflow@example.com"
LABEL service="order-service"

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY server.js .

EXPOSE 5001
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5001/health || exit 1

CMD ["node", "server.js"]
