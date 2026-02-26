[![CI/CD Pipeline](https://github.com/FabLrc/todo-api-node/actions/workflows/ci-cd.yml/badge.svg?branch=main)](https://github.com/FabLrc/todo-api-node/actions/workflows/ci-cd.yml)
[![SonarQube Cloud](https://sonarcloud.io/images/project_badges/sonarcloud-light.svg)](https://sonarcloud.io/summary/new_code?id=FabLrc_todo-api-node)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=FabLrc_todo-api-node&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=FabLrc_todo-api-node)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=FabLrc_todo-api-node&metric=coverage)](https://sonarcloud.io/summary/new_code?id=FabLrc_todo-api-node)
[![Docker Image](https://img.shields.io/badge/Docker-ghcr.io-blue?logo=docker)](https://github.com/FabLrc/todo-api-node/pkgs/container/todo-api-node)

# 📝 Todo API

API REST pour gérer des tâches (todos) construite avec **Express.js** et **SQLite**.

---

## 📑 Table des matières

- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Variables d'environnement](#-variables-denvironnement)
- [Lancer l'application](#-lancer-lapplication)
- [Scripts disponibles](#-scripts-disponibles)
- [Tests](#-tests)
- [API Reference](#-api-reference)
- [Documentation Swagger](#-documentation-swagger)
- [Structure du projet](#-structure-du-projet)
- [Docker](#-docker)
- [Sécurité](#-sécurité)
- [CI/CD — Secrets GitHub](#%EF%B8%8F-cicd--secrets-github)
- [Démo](#-démo)

## 🚀 Prérequis

- Node.js >= 18
- npm >= 8

## ⚙️ Installation

```bash
# Cloner le repo
git clone https://github.com/FabLrc/todo-api-node.git
cd todo-api-node

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
```

## 🔧 Variables d'environnement

Crée un fichier `.env` à la racine en te basant sur `.env.example` :

```env
PORT=3000
SECRET_KEY=your_secret_key
API_KEY=your_api_key
DB_PASSWORD=your_db_password
```

> ⚠️ Ne jamais commiter le fichier `.env` — il est dans le `.gitignore`.

## ▶️ Lancer l'application

```bash
# Démarrage
npm start

# L'API est accessible sur http://localhost:3000
```

## 📜 Scripts disponibles

| Script | Commande | Description |
|--------|----------|-------------|
| `start` | `npm start` | Démarre le serveur |
| `test` | `npm test` | Lance les tests unitaires/intégration avec couverture |
| `test:perf` | `npm run test:perf` | Lance les tests de performance (autocannon) |
| `release` | `npm run release` | Génère une release (standard-version) |
| `release:minor` | `npm run release:minor` | Génère une release mineure |
| `release:major` | `npm run release:major` | Génère une release majeure |

## 🧪 Tests

```bash
npm test
```

Les tests utilisent **Jest** et **Supertest**. La couverture est générée dans le dossier `coverage/`.

Les tests de performance utilisent **autocannon** pour valider les temps de réponse :

```bash
npm run test:perf
```

## 📡 API Reference

### `GET /`

Message de bienvenue.

**Réponse** `200`
```json
{ "message": "Welcome to the Enhanced Express Todo App!" }
```

### `GET /health`

Health check du service.

**Réponse** `200`
```json
{ "status": "ok", "uptime": 123.456 }
```

### `POST /todos`

Créer un nouveau todo.

**Corps de la requête**
```json
{
  "title": "Acheter du lait",
  "description": "2 litres, sans lactose",
  "status": "pending"
}
```

**Réponse** `201`
```json
{
  "id": 1,
  "title": "Acheter du lait",
  "description": "2 litres, sans lactose",
  "status": "pending"
}
```

**Réponse** `422` — si `title` est manquant
```json
{ "detail": "title is required" }
```

### `GET /todos`

Liste des todos avec pagination.

**Paramètres query** : `skip` (défaut 0), `limit` (défaut 10)

**Réponse** `200`
```json
[
  { "id": 1, "title": "Acheter du lait", "description": "...", "status": "pending" }
]
```

### `GET /todos/:id`

Récupérer un todo par son ID.

**Réponse** `200`
```json
{ "id": 1, "title": "Acheter du lait", "description": "...", "status": "pending" }
```

**Réponse** `404`
```json
{ "detail": "Todo not found" }
```

### `PUT /todos/:id`

Mettre à jour un todo existant.

**Corps de la requête** (tous les champs sont optionnels)
```json
{ "title": "Titre modifié", "status": "done" }
```

**Réponse** `200`
```json
{ "id": 1, "title": "Titre modifié", "description": "...", "status": "done" }
```

### `DELETE /todos/:id`

Supprimer un todo.

**Réponse** `200`
```json
{ "detail": "Todo deleted" }
```

### `GET /todos/search/all`

Rechercher des todos par titre.

**Paramètre query** : `q` (chaîne de recherche)

**Réponse** `200`
```json
[
  { "id": 1, "title": "Acheter du lait", "description": "...", "status": "pending" }
]
```

## 📁 Structure du projet

```
todo-api-node/
├── app.js              # Point d'entrée Express (helmet, morgan, error handler)
├── utils/
│   └── helpers.js      # Fonctions utilitaires (toObj, toArray)
├── routes/
│   └── todo.js         # Routes CRUD des todos
├── database/
│   └── database.js     # Connexion et initialisation SQLite
├── tests/
│   ├── todo.test.js    # Tests d'intégration
│   └── performance.test.js # Tests de performance
├── .env.example        # Exemple de configuration
├── .github/
│   ├── workflows/      # CI/CD GitHub Actions
│   └── dependabot.yml  # Mises à jour automatiques
├── Dockerfile          # Image Docker multi-stage
└── CHANGELOG.md        # Journal des changements (auto-généré)
```

## 📖 Documentation Swagger

Une fois l'application lancée, la documentation interactive est disponible sur :

```
http://localhost:3000/api-docs
```

## 🐳 Docker

```bash
# Build de l'image
docker build -t todo-api-node .

# Lancer le conteneur
docker run -p 3000:3000 --env-file .env todo-api-node
```

## 🔒 Sécurité

- **Helmet** : En-têtes HTTP de sécurité appliqués automatiquement
- **Morgan** : Logging des requêtes HTTP (désactivé en environnement de test)
- **Error handler** : Middleware global de gestion d'erreurs (aucune stack trace exposée en production)
- Les dépendances sont auditées automatiquement en CI via `npm audit`
- Les mises à jour de dépendances sont gérées automatiquement via Dependabot

## ⚙️ CI/CD — Secrets GitHub

Les secrets suivants doivent être configurés dans **Settings → Secrets and variables → Actions** du dépôt GitHub :

| Secret | Description | Obligatoire |
|--------|-------------|-------------|
| `SONAR_TOKEN` | Token d'authentification SonarCloud | Oui |
| `DISCORD_WEBHOOK_URL` | URL du webhook Discord pour les notifications CI | Oui (notifications) |

## 🌐 Démo

L'API est déployée sur : [https://todoapp.fabienlaurence.com](https://todoapp.fabienlaurence.com)
