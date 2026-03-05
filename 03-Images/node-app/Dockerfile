FROM node:18-alpine

WORKDIR /app

# Package files once (cache icin)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Application code
COPY server.js .

EXPOSE 3000

CMD ["node", "server.js"]
