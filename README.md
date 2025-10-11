# 🎵 Music Artist API

A robust REST API for managing songs and artists, developed with Node.js, TypeScript, Express, and TypeORM.

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Tests](#tests)
- [Docker](#docker)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About the Project

The Music Artist API is a backend application developed to manage a catalog of songs and artists. The API offers complete CRUD (Create, Read, Update, Delete) functionalities for songs, with Redis cache support and MySQL data persistence.

### ✨ Features

- ✅ Complete song management (CRUD)
- ✅ Redis caching system
- ✅ Data validation with Yup
- ✅ Docker containerization
- ✅ Database migrations with TypeORM
- ✅ Unit testing with Jest
- ✅ Code linting with ESLint
- ✅ Clean and modular architecture

## 🚀 Technologies

This project was developed with the following technologies:

### Backend
- **Node.js** - JavaScript runtime environment
- **TypeScript** - JavaScript superset with static typing
- **Express** - Minimalist web framework
- **TypeORM** - ORM for TypeScript and JavaScript

### Database
- **MySQL 8.0** - Database management system
- **Redis** - In-memory cache

### DevOps & Tools
- **Docker** - Containerization
- **Docker Compose** - Container orchestration
- **Jest** - Testing framework
- **ESLint** - JavaScript/TypeScript linter
- **Yarn** - Package manager

### Main Libraries
- **express-async-errors** - Asynchronous error handling
- **tsyringe** - Dependency injection container
- **yup** - Schema validation
- **cors** - CORS middleware
- **helmet** - Security middleware

## 📋 Prerequisites

Before starting, you need to have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

## 🔧 Installation

1. Clone this repository:
```bash
git clone https://github.com/luizcurti/music-artist.git
cd music-artist
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

## ⚙️ Configuration

1. Configure environment variables by creating a `.env` file:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_DATABASE=music

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Server
PORT=3005
NODE_ENV=development
```

2. Start database services with Docker:
```bash
docker compose up -d mysql_database redis_server
```

3. Run database migrations:
```bash
yarn typeorm
```

## 🚀 Running the Application

### Development
```bash
# Start in development mode
yarn dev

# Start in development mode (with port process kill)
yarn dev:clean
```

### Production
```bash
# Build the application
yarn build

# Start in production mode
yarn start

# Start in production mode (with port process kill)
yarn start:clean
```

The API will be available at `http://localhost:3005`

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Runs the application in development mode |
| `yarn dev:clean` | Kills processes on port 3005 and runs in development mode |
| `yarn start` | Runs the application in production mode |
| `yarn start:clean` | Kills processes on port 3005 and runs in production mode |
| `yarn build` | Compiles TypeScript to JavaScript |
| `yarn test` | Runs tests with coverage |
| `yarn eslint` | Runs ESLint linter |
| `yarn typeorm` | Runs database migrations |
| `yarn typeorm:show` | Shows migrations |
| `yarn typeorm:revert` | Reverts the last migration |
| `yarn typeorm:sync` | Synchronizes database schema |
| `yarn kill:3005` | Kills processes running on port 3005 |

## 📁 Project Structure

```
music-artist/
├── src/
│   ├── config/           # Application configurations
│   ├── errors/          # Custom error classes
│   ├── modules/         # Application modules
│   │   └── song/        # Song module
│   ├── shared/          # Shared code
│   │   ├── containers/  # Dependency injection container
│   │   ├── generic/     # Generic interfaces and types
│   │   └── infra/       # Infrastructure (database, server, etc.)
│   └── tests/           # Unit tests
├── db/                  # MySQL data (Docker volume)
├── docker-compose.yml   # Docker Compose configuration
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── jest.config.cjs      # Jest configuration
└── eslint.config.mjs    # ESLint configuration
```

## 🌐 API Endpoints

### Songs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/songs` | List all songs |
| GET | `/songs/:id` | Get a song by ID |
| POST | `/songs` | Create a new song |
| PUT | `/songs/:id` | Update a song |
| DELETE | `/songs/:id` | Delete a song |

### Example Payload for Song Creation

```json
{
  "title": "Song Name",
  "artist": "Artist Name",
  "album": "Album Name",
  "genre": "Musical Genre",
  "duration": 240,
  "release_year": 2023
}
```

## 🧪 Tests

Run unit tests:

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with coverage
yarn test --coverage
```

Tests cover:
- Controllers (createSong, deleteSong, editSong, listAllSong, listSongById)
- Use Cases (createSong, deleteSong, editSong, listAllSong, listSongById)

## 🐳 Docker

### Available Services

The project uses Docker Compose with the following services:

- **mysql_database**: MySQL 8.0 on port 3306
- **redis_server**: Redis Alpine on port 6379
- **app**: Node.js application on port 3005 (optional)

### Docker Commands

```bash
# Start all services
docker compose up -d

# Start only database services
docker compose up -d mysql_database redis_server

# Stop all services
docker compose down

# View service logs
docker compose logs -f

# Rebuild containers
docker compose up --build
```

## 🤝 Contributing

Contributions are always welcome! To contribute:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards

- Use ESLint to maintain code standards
- Write tests for new features
- Follow SOLID principles and Clean Architecture
- Use TypeScript strictly

## 📝 License

This project is under the ISC license. See the [LICENSE](LICENSE) file for more details.

## 👨‍💻 Author

**Luiz Curti**

- GitHub: [@luizcurti](https://github.com/luizcurti)

---

⭐️ If this project helped you, consider giving it a star!

## 🚀 Quick Start

1. **Before booting the system**, run:
```bash
yarn install
```

2. **Start Docker services**:
```bash
docker compose up -d mysql_database redis_server
```

3. **Run database migrations**:
```bash
yarn typeorm
```

4. **Start the application**:
```bash
yarn dev:clean
```

## 🧪 Testing

To run the unit tests:
```bash
yarn test
```

## 📡 API Testing

- **Base URL**: `http://localhost:3005/api/music/`
- **Postman Collection**: The file `music.postman_collection.json` contains all routes for testing in Postman

## 📝 Additional Notes

- Docker is required to run the application
- Make sure to run migrations before starting the application
- The API will be available at port 3005 after successful startup