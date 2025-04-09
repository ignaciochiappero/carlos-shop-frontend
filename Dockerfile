# front-new\Dockerfile
# Etapa de construcción para el frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Agregar esta línea para recibir el argumento
ARG NEXT_PUBLIC_API_URL=http://100.26.212.136:3000

# Configurar variables de entorno para el build
ENV NEXT_PUBLIC_API_URL=http://100.26.212.136:3000
ENV NODE_ENV=production

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:20-alpine

WORKDIR /app

# Copiar archivos necesarios
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Configurar variables de entorno para producción
ENV NEXT_PUBLIC_API_URL=http://100.26.212.136:3000
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3000

CMD ["npm", "start"]