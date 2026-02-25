[![CI/CD Pipeline](https://github.com/FabLrc/todo-api-node/actions/workflows/ci-cd.yml/badge.svg?branch=main)](https://github.com/FabLrc/todo-api-node/actions/workflows/ci-cd.yml)
[![SonarQube Cloud](https://sonarcloud.io/images/project_badges/sonarcloud-light.svg)](https://sonarcloud.io/summary/new_code?id=FabLrc_todo-api-node)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=FabLrc_todo-api-node&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=FabLrc_todo-api-node)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=FabLrc_todo-api-node&metric=coverage)](https://sonarcloud.io/summary/new_code?id=FabLrc_todo-api-node)
[![Docker Image](https://img.shields.io/badge/Docker-ghcr.io-blue?logo=docker)](https://github.com/FabLrc/todo-api-node/pkgs/container/todo-api-node)

# 📝 Todo API

API REST pour gérer des tâches (todos) construite avec **Express.js** et **SQLite**.

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

## 🧪 Tests

```bash
npm test
```

Les tests utilisent **Jest** et **Supertest**. La couverture est générée dans le dossier `coverage/`.

## 📡 Endpoints

| Méthode | Route | Description |
|--------|-------|-------------|
| `GET` | `/` | Message de bienvenue |
| `GET` | `/todos` | Lister tous les todos |
| `POST` | `/todos` | Créer un todo |
| `GET` | `/todos/:id` | Récupérer un todo par ID |
| `PUT` | `/todos/:id` | Mettre à jour un todo |
| `DELETE` | `/todos/:id` | Supprimer un todo |

## 📦 Structure d'un Todo

```json
{
  "id": 1,
  "title": "Acheter du lait",
  "description": "2 litres, sans lactose",
  "status": "pending"
}
```

Le champ `status` accepte les valeurs : `pending` ou `done`.

## 📁 Structure du projet

```
todo-api-node/
├── app.js              # Point d'entrée Express
├── routes/
│   └── todo.js         # Routes et logique des todos
├── database/
│   └── database.js     # Connexion et initialisation SQLite
├── tests/
│   └── todo.test.js    # Tests d'intégration
├── .env.example        # Exemple de configuration
└── .github/
    └── workflows/      # CI/CD GitHub Actions
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

- Les dépendances sont auditées automatiquement en CI via `npm audit`
- Les mises à jour de dépendances sont gérées automatiquement via Dependabot

## 🌐 Démo

L'API est déployée sur : [https://todoapp.fabienlaurence.com](https://todoapp.fabienlaurence.com)
