# SkillBridge

<p align="center">
  <img src="./SkillBridge.png" alt="SkillBridge application" width="100%">
</p>

SkillBridge is a full-stack recruitment platform that connects candidates with companies. The repository currently includes a React frontend and a Flask/PostgreSQL API for authentication, profiles, companies, jobs, applications, saved jobs, preferences, and password recovery.

## Implemented functionality

- Registration, login, persistent JWT sessions, logout, and protected routes.
- Candidate profiles with phone, location, skills, technologies, and work experience.
- User preferences for notifications, profile visibility, remote work, and preferred location.
- Company profiles owned by authenticated users.
- Job creation, listing, editing, and deletion by company owners.
- Applications linked to both the candidate and job, with duplicate prevention.
- Application status management by the owner of the job's company.
- Saved jobs linked to the authenticated user, with save/remove operations and duplicate prevention.
- Password-reset requests with secure, expiring, single-use tokens.
- Configurable Brevo transactional email delivery for password recovery.
- Redis-backed login rate limiting for multi-process backend deployments.
- JWT-protected backend AI-assistant integration. The current assistant uses local pattern-matching responses and does not call an external AI provider.
- Responsive pages for jobs, companies, profiles, applications, saved jobs, dashboard, and settings.

Features such as messages, credentials, saved-job persistence notifications, and externally powered AI recommendations are not connected to complete services yet. Password-recovery delivery is implemented through Brevo but remains disabled until deployment credentials are configured.

## Technology

### Frontend

- React 18
- React Router 7
- Vite 8
- JavaScript and CSS
- Service modules under `src/services`
- Shared authentication state in `src/context/AuthContext.jsx`

### Backend

- Python 3.10+
- Flask
- Flask-SQLAlchemy
- Flask-Migrate / Alembic
- Flask-JWT-Extended
- Flask-Cors
- Flask-Limiter
- Redis 7 for shared rate-limit storage in the Dev Container and production examples
- Brevo transactional email API
- PostgreSQL 15+
- psycopg 3

## Architecture

```text
React pages and components
        |
        | HTTP /api requests; Bearer JWT for private routes
        v
Flask blueprints
        |
        v
SQLAlchemy models
        |
        v
PostgreSQL + Redis rate-limit storage

Password recovery -> Brevo transactional email API
```

- The frontend development server proxies `/api` to `http://127.0.0.1:5000`.
- Public reads expose jobs and companies.
- Authenticated writes are enforced in Flask using JWT identity and ownership checks.
- User, company, job, application, saved-job, and password-reset data is persisted in PostgreSQL.
- See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the project structure, data relationships, and main flows.
- See [backend/README.md](./backend/README.md) for the complete API reference and backend examples.

## Project structure

```text
.
├── .devcontainer/        # Dev Container, PostgreSQL, and Redis services
├── backend/
│   ├── app/
│   │   ├── models/       # SQLAlchemy models
│   │   ├── routes/       # Flask blueprints
│   │   └── services/     # Backend services
│   ├── migrations/       # Alembic migrations
│   ├── .env.example
│   └── run.py
├── docs/
│   └── ARCHITECTURE.md
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── services/
├── package.json
└── vite.config.js
```

## Prerequisites

- Node.js 20 or newer
- npm
- Python 3.10 or newer
- PostgreSQL 15 or compatible
- Redis 7 or compatible when using shared rate-limit storage outside the in-memory development default

## Local setup

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Configure and install the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env` locally. Never commit it.

```dotenv
DATABASE_URL=postgresql+psycopg://skillbridge_user:YOUR_PASSWORD@localhost:5432/skillbridge
JWT_SECRET_KEY=replace-with-a-long-random-value
CORS_ORIGINS=http://localhost:5173
APP_ENV=development
```

`JWT_SECRET_KEY` must be a private, sufficiently long random value. The values above are placeholders.

### 3. Prepare PostgreSQL

Create a PostgreSQL database and role with credentials matching `DATABASE_URL`. Then run the existing migration history:

```bash
cd backend
export FLASK_APP=run.py
flask db upgrade
```

Do not use `flask db downgrade` or `db.reset` against a database containing data unless the migration impact has been reviewed and backed up.

### 4. Start the backend

```bash
cd backend
python run.py
```

The default API address is `http://127.0.0.1:5000`. `FLASK_RUN_HOST` and `FLASK_RUN_PORT` can override the defaults.

### 5. Start the frontend

From the repository root:

```bash
npm run dev
```

Vite serves the application at `http://localhost:5173`. The development proxy sends `/api` requests to the Flask server.

To use a separate API origin instead of the Vite proxy, provide an optional frontend variable:

```dotenv
VITE_API_URL=http://localhost:5000
```

## Docker / Dev Container

The checked-in Compose file is a development-container setup:

```bash
docker compose -f .devcontainer/docker-compose.yml up -d
```

It creates:

- `workspace`: Python development container with `/workspace` mounted.
- `postgres`: PostgreSQL 15 with a persistent `postgres_data` volume.
- `redis`: Redis 7 with a persistent `redis_data` volume for shared rate-limit keys.

The service creates the development database named `skillbridge_dev`. Its internal hostname from the workspace container is `postgres`. The Compose credentials are development-only defaults and must not be reused in production.

When working inside the Dev Container, a matching backend database URL uses the Docker service hostname:

```dotenv
DATABASE_URL=postgresql+psycopg://<dev-user>:<dev-password>@postgres:5432/skillbridge_dev
```

The Compose file does not publish host ports for PostgreSQL/Redis or automatically migrate/start the Flask and Vite processes. The workspace service uses Redis for rate limiting. Run migrations and both application processes as described above. Do not remove the named volumes when preserving local development data.

## Environment variables

| Variable | Scope | Required | Purpose |
| --- | --- | --- | --- |
| `DATABASE_URL` | Backend | Yes | PostgreSQL SQLAlchemy URL. |
| `JWT_SECRET_KEY` | Backend | Yes | Secret used to sign and verify JWTs. |
| `JWT_ACCESS_TOKEN_EXPIRES` | Backend | No | Access-token lifetime in seconds; defaults to 900. |
| `CORS_ORIGINS` | Backend | No | Comma-separated allowed origins; defaults to `http://localhost:5173`. |
| `APP_ENV` | Backend | No | Runtime environment; `production` requires shared Redis and HTTPS reset links. |
| `RATELIMIT_STORAGE_URI` | Backend | No | Flask-Limiter storage; defaults to in-memory development storage. |
| `RATELIMIT_CONNECT_TIMEOUT` | Backend | No | Redis connection timeout in seconds; defaults to 2. |
| `RATELIMIT_SOCKET_TIMEOUT` | Backend | No | Redis operation timeout in seconds; defaults to 2. |
| `BREVO_EMAIL_ENABLED` | Backend | No | Enables Brevo password-reset delivery. |
| `BREVO_API_KEY` | Backend | When email is enabled | Brevo API key; never commit this value. |
| `BREVO_SENDER_EMAIL` | Backend | When email is enabled | Verified Brevo sender address. |
| `BREVO_SENDER_NAME` | Backend | No | Sender display name; defaults to `SkillBridge`. |
| `BREVO_API_URL` | Backend | No | Brevo transactional endpoint. |
| `BREVO_TIMEOUT` | Backend | No | Request timeout in seconds. |
| `FRONTEND_URL` | Backend | When email is enabled | Frontend base URL used to build the reset link. |
| `FLASK_RUN_HOST` | Backend | No | Flask bind host; defaults to `127.0.0.1`. |
| `FLASK_RUN_PORT` | Backend | No | Flask port; defaults to `5000`. |
| `VITE_API_URL` | Frontend | No | Absolute backend URL; omit when using the Vite proxy. |

## Development checks

```bash
# Frontend
npm test
npm run build

# Backend syntax and tests
cd backend
python -m compileall -q app migrations
python -m pytest -q

# Migration/schema alignment, with backend environment variables configured
flask db current
flask db check
```

Install backend test dependencies with `pip install -r requirements-dev.txt`. `pytest` requires `TEST_DATABASE_URL` and refuses to run if the configured database is named `skillbridge_dev` or does not contain `test` in its name. Database integration checks should always use an independent test database.

GitHub Actions runs backend migrations and tests against ephemeral PostgreSQL 15 and Redis 7 services, then runs frontend tests plus the production build. Brevo HTTP calls are mocked in tests, so CI never sends a real email.

## Production runtime notes

- Run Flask behind a production WSGI server such as Gunicorn, for example `gunicorn --bind 0.0.0.0:8000 "app:create_app()"`.
- Terminate HTTPS at the deployment platform or reverse proxy.
- Use a strong `JWT_SECRET_KEY`, explicit CORS origins, and a short `JWT_ACCESS_TOKEN_EXPIRES`.
- Configure `RATELIMIT_STORAGE_URI=redis://...` or `rediss://...` for multi-instance deployments. `APP_ENV=production` rejects process-local `memory://`.
- Use a managed or highly available Redis service in production. `GET /api/readiness` returns 503 when rate-limit storage is unavailable, and Redis errors are not silently replaced by in-memory limits.
- Brevo delivery is disabled until `BREVO_EMAIL_ENABLED=true`; configure its API key, verified sender, and an HTTPS `FRONTEND_URL` in production.
- Create the Brevo API key and verify the sender in Brevo outside the repository. Keep `BREVO_API_KEY` only in the deployment secret store or untracked environment file.
- Brevo failures are logged without the token or API key, and callers still receive the generic, non-enumerating reset response.
- Apply migrations as a controlled release step before serving a new application version.
- Without Brevo credentials, recovery is implemented but no real message is sent. Do not claim delivery is active until the provider settings have been supplied and verified.

## Authors

- Beatriz Campos
