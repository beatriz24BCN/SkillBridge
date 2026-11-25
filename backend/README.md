# SkillBridge backend

Flask API for SkillBridge. It uses PostgreSQL for persistence, JWT access tokens for authenticated operations, and Alembic for schema migrations.

## Requirements

- Python 3.10+
- PostgreSQL
- Dependencies from [requirements.txt](./requirements.txt)

## Configuration

Create an untracked local environment file:

```bash
cp .env.example .env
```

Required variables:

```dotenv
DATABASE_URL=postgresql+psycopg://skillbridge_user:YOUR_PASSWORD@localhost:5432/skillbridge
JWT_SECRET_KEY=replace-with-a-long-random-value
JWT_ACCESS_TOKEN_EXPIRES=900
```

Optional variables:

```dotenv
CORS_ORIGINS=http://localhost:5173
APP_ENV=development
FLASK_RUN_HOST=127.0.0.1
FLASK_RUN_PORT=5000
RATELIMIT_STORAGE_URI=memory://
RATELIMIT_CONNECT_TIMEOUT=2
RATELIMIT_SOCKET_TIMEOUT=2
BREVO_EMAIL_ENABLED=false
BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=SkillBridge
BREVO_API_URL=https://api.brevo.com/v3/smtp/email
BREVO_TIMEOUT=10
FRONTEND_URL=http://localhost:5173
```

`validate_config()` rejects application startup when `DATABASE_URL` or `JWT_SECRET_KEY` is missing. No SQLite fallback is configured. When Brevo is enabled, it also requires `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, and an absolute `FRONTEND_URL`; production requires the frontend URL to use HTTPS.

Install and start:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export FLASK_APP=run.py
flask db upgrade
python run.py
```

For the Dev Container, use the PostgreSQL service hostname `postgres`, Redis hostname `redis`, and development credentials configured locally rather than `localhost`. The Compose environment already sets `RATELIMIT_STORAGE_URI=redis://redis:6379/0`.

## JWT authentication and permissions

Send authenticated requests with:

```http
Authorization: Bearer <access-token>
```

The server:

- Returns an access token from registration and login with a configurable lifetime.
- Stores the JWT identity as the string form of `users.id`.
- Adds a `token_version` claim and rejects older tokens after a password change/reset.
- Limits login attempts per remote address.
- Returns JSON `401` errors for missing, invalid, expired, or revoked tokens.
- Limits profile changes, company mutations, job mutations, applications, saved jobs, and settings to the relevant user or company owner.
- Allows anonymous reads of jobs and companies.
- Does not implement administrator or role-based access yet.

Logout is client-side: the frontend removes its stored token. Password changes and password resets invalidate previously issued tokens through `token_version`; there is still no refresh-token store or explicit per-session logout endpoint.

## Models and relationships

| Model | Relationship |
| --- | --- |
| `User` | Owns many `Company`, has many `Application`, many `SavedJob`, and many `PasswordResetToken` records. |
| `Company` | Belongs to one owner `User`; has many `Job` records. |
| `Job` | Belongs to one `Company`; has many `Application` and `SavedJob` records. |
| `Application` | Belongs to one `User` and one `Job`; status is `pending`, `accepted`, or `rejected`. |
| `SavedJob` | Join entity between `User` and `Job`; database uniqueness prevents duplicate `(user_id, job_id)` pairs. |
| `PasswordResetToken` | Belongs to one `User`; stores only the SHA-256 token hash, expiration, and use timestamp. |

Professional profile fields (`phone`, `location`, `skills`, `experience`) and `preferences` are stored on `users`. Skills, experience entries, and preferences use PostgreSQL JSONB.

## Endpoint reference

All paths are relative to the API origin. Paths shown with `/` should retain that trailing slash when calling the service.

### System

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Service health response. |
| GET | `/api/readiness` | No | Redis-backed rate-limit storage readiness. Returns JSON `503` when unhealthy. |

### Authentication and current user

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Register and return a JWT plus user. |
| POST | `/api/auth/login` | No | Authenticate and return a JWT plus user. |
| GET | `/api/auth/me` | Yes | Return the current user. |
| PATCH | `/api/auth/me` | Yes | Update identity, professional profile, or preferences. |
| PATCH | `/api/auth/me/password` | Yes | Change password after checking the current password. |
| DELETE | `/api/auth/me` | Yes | Delete the authenticated user. |
| POST | `/api/auth/password/forgot` | No | Request password recovery. |
| POST | `/api/auth/password/reset` | No | Consume a recovery token and set a password. |

### Users

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| GET | `/api/users/` | Yes | Intentionally returns `403`; user listing is not implemented. |
| GET | `/api/users/<id>` | Yes | Read self, or another user whose profile is public. |
| PATCH | `/api/users/<id>` | Yes, self | Update basic user fields. |
| DELETE | `/api/users/<id>` | Yes, self | Delete the selected own account. |

The current frontend uses `/api/auth/me` for full profile updates and preferences.

### Companies

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| GET | `/api/companies/` | No | List companies. |
| GET | `/api/companies/<id>` | No | Get a company with minimal owner data. |
| POST | `/api/companies/` | Yes | Create a company owned by the current user. |
| PUT | `/api/companies/<id>` | Yes, owner | Update a company. |
| PATCH | `/api/companies/<id>` | Yes, owner | Partially update a company. |
| DELETE | `/api/companies/<id>` | Yes, owner | Delete a company. |

### Jobs

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| GET | `/api/jobs/` | No | List jobs with summarized company data. |
| GET | `/api/jobs/<id>` | No | Get a job with summarized company data. |
| POST | `/api/jobs/` | Yes, company owner | Create a job for an owned company. |
| PUT | `/api/jobs/<id>` | Yes, company owner | Replace the mutable job fields. |
| PATCH | `/api/jobs/<id>` | Yes, company owner | Partially update a job. |
| DELETE | `/api/jobs/<id>` | Yes, company owner | Delete a job. |

### Applications

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| GET | `/api/applications/` | Yes | List the current user's applications. |
| GET | `/api/applications/<id>` | Yes, applicant | Get one application. |
| POST | `/api/applications/` | Yes | Apply once to a job. |
| PUT | `/api/applications/<id>` | Yes | Update allowed fields according to ownership. |
| PATCH | `/api/applications/<id>` | Yes | Applicant may edit the cover letter; company owner may change status. |
| DELETE | `/api/applications/<id>` | Yes, applicant | Delete an application. |
| GET | `/api/applications/job/<job_id>` | Yes, company owner | List applicants for one owned job. |

New applications always begin with `pending`; clients cannot self-assign `accepted` or `rejected`.

### Saved jobs

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| GET | `/api/saved-jobs/` | Yes | List the current user's saved jobs. |
| POST | `/api/saved-jobs/<job_id>` | Yes | Save a job; an existing save is returned idempotently. |
| DELETE | `/api/saved-jobs/<job_id>` | Yes | Remove a saved job owned by the current user. |

### AI assistant

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| POST | `/api/ai/chat` | Yes | Return a locally generated assistant response. |

The current AI service is a development implementation using pattern matching. It does not call an external AI provider.

## Request examples

Examples use placeholder values only.

### Register

```bash
curl -X POST http://127.0.0.1:5000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "candidate@example.test",
    "password": "ExamplePassword123",
    "first_name": "Alex",
    "last_name": "Candidate"
  }'
```

Representative response (`201`; timestamps and the remaining profile fields are omitted here):

```json
{
  "access_token": "<access-token>",
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "candidate@example.test",
    "first_name": "Alex",
    "last_name": "Candidate",
    "preferences": {
      "job_alerts": true,
      "application_updates": true,
      "profile_public": false,
      "remote_only": false,
      "preferred_location": ""
    }
  }
}
```

The actual token is intentionally represented by a placeholder.

### Apply to a job

```bash
curl -X POST http://127.0.0.1:5000/api/applications/ \
  -H 'Authorization: Bearer <access-token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "job_id": 12,
    "cover_letter": "I am interested in this opportunity."
  }'
```

Response (`201`):

```json
{
  "id": 34,
  "user_id": 1,
  "job_id": 12,
  "status": "pending",
  "cover_letter": "I am interested in this opportunity."
}
```

The complete response also includes timestamps and summarized job/company data.

### Save a job

```bash
curl -X POST \
  -H 'Authorization: Bearer <access-token>' \
  http://127.0.0.1:5000/api/saved-jobs/12
```

The endpoint returns `201` for a new save and `200` when that user already saved the same job.

### Update profile and preferences

```bash
curl -X PATCH http://127.0.0.1:5000/api/auth/me \
  -H 'Authorization: Bearer <access-token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "phone": "+34 600 000 000",
    "location": "Barcelona",
    "skills": ["React", "Python", "PostgreSQL"],
    "experience": [
      {
        "company": "Example Company",
        "position": "Software Engineer",
        "start": "2024-01",
        "end": "",
        "description": "Built internal web applications."
      }
    ],
    "preferences": {
      "job_alerts": false,
      "remote_only": true,
      "preferred_location": "Barcelona"
    }
  }'
```

Unknown preference properties are ignored; supported boolean values are validated as JSON booleans.

### Request password recovery

```bash
curl -X POST http://127.0.0.1:5000/api/auth/password/forgot \
  -H 'Content-Type: application/json' \
  -d '{"email": "candidate@example.test"}'
```

Response (`202`), for both registered and unknown addresses:

```json
{
  "message": "If the email is registered, password reset instructions will be sent."
}
```

## Password recovery security

- Raw tokens are generated using `secrets.token_urlsafe`.
- PostgreSQL stores only a SHA-256 hash.
- Tokens expire after 30 minutes.
- A token's `used_at` value is set after a successful reset.
- A used or expired token is rejected.
- Passwords remain hashed by Werkzeug password hashing; no plaintext passwords are stored.
- The API does not reveal whether an email is registered.
- The API intentionally does not return reset tokens.

Email delivery uses Brevo's official transactional endpoint when `BREVO_EMAIL_ENABLED=true`. It sends `POST /v3/smtp/email` with the `api-key` header, an independently configured verified sender, and text/HTML content. `FRONTEND_URL` supplies the application base URL used to build `/reset-password?token=...`. Credentials remain environment-only.

If Brevo is disabled, no message is sent and the response remains generic. If Brevo rejects the request or the network call fails, the error is logged without the API key, recipient, raw token, or provider response body; the generated token is marked used and callers receive the same generic response.

To enable delivery, create an API key and register/verify `BREVO_SENDER_EMAIL` in Brevo, then set the credentials only in the deployment secret store or untracked `backend/.env`. Tests replace `urlopen` and never call the provider.

## Alembic migrations

Migration files are in [migrations/versions](./migrations/versions). The schema history includes users, companies, jobs, applications, saved jobs, professional profiles/preferences, reset tokens, user token-version revocation, and the database uniqueness constraint for applications.

Before applying the application uniqueness revision, verify that no existing rows share the same `user_id` and `job_id`. The migration intentionally does not delete or merge data when duplicates exist; it fails safely so an operator can review them.

Apply migrations to the configured database:

```bash
export FLASK_APP=run.py
flask db upgrade
```

Inspect:

```bash
flask db current
flask db check
flask db history
```

Never edit or rewrite an already published migration. Add a new revision for future schema changes. Review schema operations before running them against a database with data and keep backups according to your environment.

## Development checks

```bash
python -m compileall -q app migrations
```

Install the test-only dependencies and provide an isolated `TEST_DATABASE_URL`:

```bash
pip install -r requirements-dev.txt
TEST_DATABASE_URL=postgresql+psycopg://<test-user>:<test-password>@localhost:5432/skillbridge_test \
TEST_REDIS_URL=redis://localhost:6379/15 \
RATELIMIT_STORAGE_URI=redis://localhost:6379/14 \
python -m pytest -q
```

The test configuration refuses `skillbridge_dev` and any database name without `test`.

For a production process, use a WSGI server rather than Flask's development server:

```bash
gunicorn --bind 0.0.0.0:8000 "app:create_app()"
```

Use `RATELIMIT_STORAGE_URI=redis://...` or `rediss://...` when running multiple application instances. `APP_ENV=production` rejects process-local `memory://`. Redis keys are shared by workers and use the limit window's TTL. `RATELIMIT_CONNECT_TIMEOUT` and `RATELIMIT_SOCKET_TIMEOUT` default to two seconds, storage errors are not swallowed, and `GET /api/readiness` checks the configured storage. Unavailable Redis returns JSON `503` rather than silently falling back to per-process memory. `JWT_ACCESS_TOKEN_EXPIRES` defaults to 900 seconds.

The Dev Container supplies Redis 7 with a persistent `redis_data` volume and configures the workspace service to use `redis://redis:6379/0`. Production should use a managed or otherwise highly available Redis deployment with restricted network access and credentials.

With backend environment variables configured:

```bash
flask db check
python run.py
```

The committed tests cover authentication, JWT validation/revocation, ownership, applications, saved jobs, profiles, preferences, password recovery, Brevo payload/error handling, and Redis rate limiting. Integration checks must use a separate test database; CI also provides an isolated Redis 7 service.
