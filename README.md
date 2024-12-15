```markdown
# Buch SWE-Projekt

## Anforderungen

- Docker Desktop 4+
    - Docker Compose v2+
- WSL2 (Windows)
- Node.js v22+
- npm v10+
- Git 2.23+

## Docker Compose Setup

Dieses Projekt verwendet Docker Compose, um Dienste wie die NestJS-Anwendung, Keycloak für Benutzer-Authentifizierung und Autorisierung sowie PostgreSQL für das Datenbankmanagement zu verwalten.

## Docker Compose (`docker-compose.yml`)

- **NestJS**: Die zentrale Backend-Anwendung.
    - Läuft auf Port `3000`.
- **Keycloak**: Für Benutzer-Authentifizierung und rollenbasierte Autorisierung.
    - Admin-Konsole aktiviert.
    - Läuft auf Port `8080`.
    - Importiert automatisch die Realm-Konfiguration aus `keycloak/nest-realm.json`.
- **PostgreSQL**: Datenbankdienst.
    - Läuft auf Port `5432`.
    - Daten werden über das Volume `postgres_data` persistent gespeichert.

Mit Profil `debug`:
- **pgAdmin**: Werkzeug zur Verwaltung der Datenbank.
    - Läuft auf Port `8888` für den Webzugriff.
    - Admin-Zugangsdaten werden über Umgebungsvariablen konfiguriert.

Mit Profil `prod`:
- **Angular**: Die Frontend-Anwendung.
    - Läuft auf Port `80`.

## Befehle

Um die Anwendung mit dem Angular-Frontend zu starten:

```bash
docker compose --profile dev up --build
```

Rufe die Anwendung im Browser unter `http://localhost` auf.

### Entwicklung

Für die Entwicklung empfiehlt es sich, das Angular-Frontend mit npm zu starten, um Änderungen in Echtzeit zu sehen.

Verwende daher das Flag `--profile dev` nicht, damit Docker Compose das Angular-Frontend nicht startet:

```bash
docker compose up -d --build
```

Starte anschließend das Angular-Frontend:

```bash
cd angular-buch-frontend
npm install
npm start
```

Rufe die Anwendung im Browser unter `http://localhost:4200` auf.

## Typescript-Dokumentation

> docs/tsdoc/index.html

### UI Flow

![](docs/diagrams/uiFlowStateDiagram.png)

### Komponenten-Diagramm

![](docs/diagrams/compontsServicesModels.png)

### Auth-UML-Diagramm

![](docs/diagrams/authDiagram.png)
```