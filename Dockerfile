FROM node:20-alpine

WORKDIR /app

# Copie package*.json séparément pour bénéficier du cache Docker
COPY package*.json ./
# Installe uniquement les dépendances de production directement dans l'image
RUN npm ci --ignore-scripts --omit=dev

COPY . .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "app.js"]
