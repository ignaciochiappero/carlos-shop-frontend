# Etapa de construcción para el frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Recibir la variable como ARG
ARG NEXT_PUBLIC_API_URL=http://localhost:3000

# Configurar variables de entorno para el build
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Mostrar el valor para debug
RUN echo "Building with NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}"

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
ENV NODE_ENV=production
ENV PORT=3000

# Ya no definimos NEXT_PUBLIC_API_URL aquí, debe estar incrustado en el build

EXPOSE 3000

CMD ["npm", "start"]