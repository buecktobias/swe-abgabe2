# Buch SWE Project

## Requirements

- Docker Desktop 4+
    - Docker Compose 2+
- WSL2 (Windows only)
- node v22+
- npm v10+
- Git 2.23+

## Docker Compose Setup

This project uses Docker Compose to manage services such as the NestJS application, Keycloak for user authentication and authorization, and
Postgres for database management.

## Development (`docker-compose.yml`)

In the development environment, the following services are set up:

- **NestJS**: The core backend application.
    - Runs on port `3000`.
- **Keycloak**: For user authentication and role-based authorization.
    - Admin console enabled.
    - Runs on port `8080`.
    - Automatically imports the realm configuration from `keycloak/nest-realm.json`.
- **PostgreSQL**: Database service.
    - Runs on port `5432`.
    - Data persists via volume `postgres_data`.
- **pgAdmin**: Database management tool.
    - Runs on port `8888` for web access.
    - Admin credentials are configured via environment variables.

To Start the Angular Frontend:

```bash
cd angular-buch-frontend
npm install
npm start
```

Visit at `http://localhost:4200` in your browser.

## Commands

To start the application in development:

```bash
cd backend
docker compose up -d
```

To start the application in production (currently the same):

```bash
cd backend
docker compose up -d
```

## Typescript Documentation

[TSDocs](docs/tsdoc/index.html)
