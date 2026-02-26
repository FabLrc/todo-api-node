FROM node:20-alpine

WORKDIR /app

# Copie package*.json séparément pour bénéficier du cache Docker
COPY package*.json ./
# Réutilise node_modules déjà installé par le runner CI (pas de réseau requis)
# puis élague les dépendances de développement
COPY node_modules ./node_modules
RUN npm prune --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
