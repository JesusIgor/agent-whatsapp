FROM node:20-slim

WORKDIR /app

# Instala dependências primeiro (layer cacheada)
COPY package*.json ./
RUN npm install

# Expõe a porta do Vite dev server
EXPOSE 5173

# Os arquivos fonte chegam via volume no docker-compose (hot reload)
CMD ["npm", "run", "dev"]
