## Buch SWE Projektt

Um das Projekt zu installieren:

docker-compose up --build

Dann keycloak admin aufrufen: http://localhost:8080

Dort:
Client-Secret für nest-client generieren, diese in DOcker-Compose environments eintragen.

Admin und User die Rollen Admin undUser zuweisen!

Here’s a summary of your `docker-compose.yml` and `docker-compose.prod.yml` in Markdown format for your `README.md`:

## Docker Compose Setup

This project uses Docker Compose to manage services such as the NestJS application, Keycloak for user authentication and authorization, and PostgreSQL for database management. There are two configurations available: one for development and one for production.

### Development (`docker-compose.yml`)

In the development environment, the following services are set up:

- **NestJS**: The core backend application.
  - Runs on port `3000`.
  - Hot-reload enabled via volume mounting.
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

### Production (`docker-compose.prod.yml`)

In the production environment, the setup is optimized and certain services are removed or disabled:

- **NestJS**: Runs in production mode.
  - Runs on port `3000`.
  - No volume mounting (no hot reload).
- **Keycloak**: 
  - Admin console is disabled.
  - Key features for client authorization with roles enabled:
    - Authorization
    - Login (for user authentication)
    - Client policies
    - Persistent user sessions
  - Runs on port `8080`.
  - Imports the realm configuration from `keycloak/nest-realm.json`.
- **PostgreSQL**: Same as in development, with persistent storage.

#### Removed Services:
- **pgAdmin**: Not included in the production setup.  
- **Keycloak Admin Console**: Disabled for security reasons.

### Commands

To start the application in development:

```bash
cd backend
docker-compose up -d
```

To start the application in production:

```bash
cd backend
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

This will run the production configuration, optimized for performance and security.


This Markdown summary provides a clear overview of both configurations for your `README.md`.