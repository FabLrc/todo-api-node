FROM node:20-alpine

WORKDIR /app

# Copie package*.json séparément pour bénéficier du cache Docker
COPY package*.json ./
RUN npm ci --ignore-scripts --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
