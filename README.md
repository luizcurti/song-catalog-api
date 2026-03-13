# 🎵 Music Artist API

A REST API for managing a song catalog, built with Node.js, TypeScript, Express, TypeORM, and Redis.

## 📋 Table of Contents

- [About](#about)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Tests](#tests)
- [Docker](#docker)
- [License](#license)

## 🎯 About

Music Artist API is a backend service for managing a catalog of songs and artists. It provides full CRUD operations with Redis caching, MySQL persistence, and input validation.

### ✨ Features

- ✅ Full song management (CRUD)
- ✅ Redis caching with 1-hour TTL
- ✅ Input validation with Yup
- ✅ API key authentication middleware
- ✅ Docker containerization
- ✅ Database migrations with TypeORM
- ✅ Unit testing with Jest (99%+ coverage)
- ✅ Code linting with ESLint
- ✅ Clean modular architecture (Use Cases / Repositories / Controllers)

## 🚀 Technologies

### Backend
- **Node.js 18+** — Runtime
- **TypeScript** — Static typing
- **Express** — HTTP framework
- **TypeORM 0.2** — ORM for MySQL

### Database & Cache
- **MySQL 8.0** — Primary data store
- **Redis** — In-memory cache (TTL: 1h)

### DevOps & Tooling
- **Docker / Docker Compose** — Containerization
- **Jest + ts-jest** — Unit testing
- **ESLint** — Linting
- **tsyringe** — Dependency injection
- **Yup** — Schema validation
- **helmet / cors** — Security middlewares

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

## 🔧 Installation

```bash
git clone https://github.com/luizcurti/music-artist.git
cd music-artist
npm install
```

## ⚙️ Configuration

Create a `.env` file in the project root:

```env
# Environment
ENV=LOCAL
NODE_ENV=development

# Server
PORT=3005

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_DATABASE=music

# Redis
REDIS_HOST=localhost

# Auth
x_api_key=your-secret-api-key
```

## 🚀 Running the Application

### 1. Start infrastructure services
```bash
docker compose up -d mysql_database redis_server
```

### 2. Run database migrations
```bash
npm run typeorm
```

### 3. Start the application

```bash
# Development (with hot reload)
npm run dev

# Development (kills port 3005 first)
npm run dev:clean
```

The API will be available at `http://localhost:3005`

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start in development mode with hot reload |
| `npm run dev:clean` | Kill port 3005 then start in development mode |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start` | Start compiled app in production mode |
| `npm run start:clean` | Kill port 3005 then start in production mode |
| `npm test` | Run all unit tests with coverage |
| `npm run eslint` | Run ESLint |
| `npm run typeorm` | Run pending database migrations |
| `npm run typeorm:show` | Show migration status |
| `npm run typeorm:revert` | Revert the last migration |
| `npm run typeorm:sync` | Sync database schema |
| `npm run kill:3005` | Kill any process running on port 3005 |

## 📁 Project Structure

```
music-artist/
├── src/
│   ├── config/                   # App config (env, database)
│   ├── errors/                   # AppError class
│   ├── modules/
│   │   └── song/
│   │       ├── infra/typeorm/    # Entity + TypeORM repository
│   │       ├── repositories/     # Repository interface
│   │       └── useCases/         # createSong | editSong | deleteSong | listAllSong | listSongById
│   ├── shared/
│   │   ├── containers/           # tsyringe DI bindings
│   │   ├── generic/              # GenericRepository base class
│   │   └── infra/
│   │       ├── app.ts            # Express app bootstrap
│   │       ├── server.ts         # HTTP server entry point
│   │       ├── database/         # TypeORM connection + migrations
│   │       ├── http/             # Routes + middlewares
│   │       └── redis/            # Redis cache client
│   └── tests/                    # Unit tests (controller + use case)
├── music.collection.json         # Postman collection
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── jest.config.cjs
└── eslint.config.mjs
```

## 🌐 API Endpoints

Base URL: `http://localhost:3005/api/music`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/music/` | List all songs |
| `GET` | `/api/music/:id` | Get a song by ID |
| `POST` | `/api/music/` | Create a new song |
| `PUT` | `/api/music/:id` | Update a song |
| `DELETE` | `/api/music/:id` | Delete a song |

### Request / Response

#### POST `/api/music/` — Create a song

**Request body:**
```json
{
  "name": "Bohemian Rhapsody",
  "artist": "Queen",
  "imageurl": "https://example.com/image.jpg",
  "notes": "A classic rock opera ballad.",
  "popularity": 10
}
```

**Response `201 Created`:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Bohemian Rhapsody",
  "artist": "Queen",
  "imageurl": "https://example.com/image.jpg",
  "notes": "A classic rock opera ballad.",
  "popularity": 10,
  "created_at": "2026-01-01T00:00:00.000Z",
  "updated_at": "2026-01-01T00:00:00.000Z"
}
```

#### PUT `/api/music/:id` — Update a song

**Request body** (all fields required):
```json
{
  "name": "Bohemian Rhapsody",
  "artist": "Queen",
  "imageurl": "https://example.com/image.jpg",
  "notes": "Updated notes.",
  "popularity": 9
}
```

**Response `200 OK`:** returns the updated song object.

#### DELETE `/api/music/:id`

**Response `204 No Content`**

### Field Reference

| Field | Type | Rules |
|-------|------|-------|
| `name` | `string` | Required |
| `artist` | `string` | Required |
| `imageurl` | `string` | Required |
| `notes` | `string` | Required |
| `popularity` | `number` | Required, 0–10 |

### Error format
```json
{
  "message": "Human-readable error description",
  "type": "ERROR_CODE"
}
```

## 🔑 Authentication

The `ensureAuthenticated` middleware is available and validates the `x-api-key` header against the `x_api_key` environment variable.

To protect a route:
```ts
songsRoutes.post('/', ensureAuthenticated, createSongController.handle);
```

Requests without a valid key receive `401 Unauthorized`.

## 🧪 Tests

```bash
# Run all tests with coverage report
npm test
```

Test suites: **10 passed** | Tests: **15 passed** | Coverage: **99%+**

Covered modules:
- `createSong` — controller + use case
- `editSong` — controller + use case
- `deleteSong` — controller + use case
- `listAllSong` — controller + use case
- `listSongById` — controller + use case

## 🐳 Docker

```bash
# Start all services (MySQL + Redis + app)
docker compose up -d

# Start only infrastructure
docker compose up -d mysql_database redis_server

# Stop all services
docker compose down

# View logs
docker compose logs -f
```

### Services

| Service | Image | Port |
|---------|-------|------|
| `mysql_database` | mysql:8.0 | 3306 |
| `redis_server` | redis:alpine | 6379 |
| `app` | node:22-alpine | 3005 |

## 📝 License

ISC — see [LICENSE](LICENSE) for details.

## 👨‍💻 Author

**Luiz Curti** — [@luizcurti](https://github.com/luizcurti)

