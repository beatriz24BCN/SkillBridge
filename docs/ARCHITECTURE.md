# SkillBridge technical architecture

## Current project structure

```text
backend/
  app/
    __init__.py          Flask application factory and blueprint registration
    config.py            Environment-based configuration
    extensions.py        SQLAlchemy, Migrate, JWT, CORS, and rate limiter
    models/              SQLAlchemy entities and serialization
    routes/              HTTP endpoints grouped by domain
    services/            Brevo and other backend service helpers
  migrations/            Alembic environment and revisions
  run.py                 Local Flask entry point
src/
  components/            Reusable interface elements
  context/               Shared authentication state
  pages/                 Route-level React pages
  services/              HTTP client modules
  App.jsx                React route table
  main.jsx               React and AuthProvider bootstrap
```

The frontend uses the Vite development proxy for `/api` requests unless `VITE_API_URL` is configured. Service modules parse JSON responses and attach the access token to authenticated calls.

PostgreSQL is the durable application data store. Redis 7 provides shared rate-limit counters for the Dev Container and production-style multi-process deployments. Brevo is an optional outbound integration for password-reset email; disabled delivery never calls the provider.

## Data relationships

```text
User 1---n Company 1---n Job 1---n Application n---1 User
User 1---n SavedJob n---1 Job
User 1---n PasswordResetToken
```

### Users

Users own identity and profile data:

- Email and hashed password.
- First and last name.
- Phone and location.
- Skills as JSONB strings.
- Experience entries as JSONB objects.
- Preferences as a JSONB object.

`password_hash` and reset-token hashes are never serialized by the API. Private preferences are returned for the authenticated user but omitted when a user is serialized in an application/company context.

### Companies and jobs

Every company has one `owner_id`. Company owners may create, edit, and delete their companies and may create or mutate jobs assigned to those companies. Public job responses include a summarized company object; job ownership is checked again on the backend.

### Applications

An application links one candidate (`user_id`) with one job (`job_id`). The API prevents a second application and PostgreSQL enforces `uq_applications_user_job` for the same candidate/job pair. New applications start as `pending`.

- Applicants may view/delete their own applications and edit the cover letter.
- A job company's owner may list applicants for the job and update application status.
- Other users cannot read or mutate the application.

### Saved jobs

A `saved_jobs` record links a user and a job. The database unique constraint `uq_saved_jobs_user_job` prevents duplicate rows. Saving an existing job is treated idempotently by returning the existing record. Removing a saved job is scoped to the current JWT user.

The frontend loads saved jobs from `/api/saved-jobs/`; the shared `JobCard` save control is available wherever that card is rendered, including the jobs, dashboard, and saved-job views. The dedicated job-detail page currently provides the application action.

## Main flows

### Registration

1. The signup form validates a full name, email, password strength, and confirmation.
2. `POST /api/auth/register` normalizes the email, validates required fields, and checks for an existing user.
3. Werkzeug hashes the password.
4. PostgreSQL stores the user.
5. Flask returns a JWT and the safe user representation.
6. `AuthContext` stores the token in `localStorage` and holds the user in React state.

### Login and session restore

1. `POST /api/auth/login` validates the email/password pair.
2. The response contains a JWT and current user data, including preferences.
3. The frontend saves the token.
4. The JWT includes the user's `token_version`; changing or resetting the password increments this version and invalidates older tokens.
5. On a browser reload, `AuthProvider` calls `GET /api/auth/me` to restore the session.
6. Missing, invalid, expired, revoked-version, or deleted-user sessions are cleared and private routes redirect to `/login`.

Logout removes the browser token and clears in-memory user state. The current system has no persisted server-side logout blacklist.

### Password recovery

1. `/forgot-password` calls `POST /api/auth/password/forgot`.
2. The API always returns the same `202` message.
3. For a registered email, an old unused reset record is removed and a 30-minute reset record is created.
4. Only the SHA-256 hash is stored.
5. `/reset-password?token=...` calls `POST /api/auth/password/reset`.
6. The API rejects invalid, expired, or used tokens; a valid reset updates the password hash and marks the token used.

When Brevo is enabled, the raw token is placed in the reset link included in the transactional email payload sent to Brevo's official API. The API key, verified sender, and `FRONTEND_URL` are independently configured per environment. Provider failures are handled without exposing account existence or logging the key/token; the generated database token is marked used so a failed delivery cannot later produce a valid link.

### Profile and preferences

The profile editor and Settings page submit to `PATCH /api/auth/me`. The backend:

- Validates skills as non-empty strings and de-duplicates them.
- Validates each experience entry and normalizes known fields.
- Limits profile collections.
- Accepts only supported preference keys and validates booleans.
- Returns the updated safe user representation, which refreshes `AuthContext`.

Defaults include job alerts and application updates enabled, profile visibility and remote-only disabled, and an empty preferred location.

## Authorization boundaries

| Action | Required identity |
| --- | --- |
| Save/list/remove saved jobs | Current JWT user |
| Edit profile/preferences/password | Current JWT user |
| Create a job | Owner of the referenced company |
| Edit/delete a job | Owner of the job's company |
| Create/view/delete an application | Applicant; view/delete only their own |
| Change application status | Owner of the job's company |
| Edit/delete company | Company owner |
| Read another user's professional profile | That user's `profile_public` must be true; email, phone, location, and preferences remain private |

## Schema evolution

Alembic tracks the schema in `backend/migrations`. The published migration sequence creates:

1. Users.
2. Companies and user ownership.
3. Jobs and company ownership.
4. Applications and candidate/job links.
5. Saved jobs, profile fields/preferences, and password-reset tokens.
6. User token-version invalidation.
7. Database uniqueness for application user/job pairs.

## Rate-limit and email infrastructure

Flask-Limiter defaults to process-local memory for simple development. The Dev Container sets `RATELIMIT_STORAGE_URI=redis://redis:6379/0`, and `APP_ENV=production` rejects `memory://`. The configured Redis stores fixed-window login counters with expiration; all Gunicorn workers/instances observe the same counters. The login route permits 10 requests per minute per remote address and returns 429 after the limit. `/api/readiness` performs the storage health check; unhealthy storage and request-time storage failures return safe JSON 503 responses. Redis exceptions are wrapped, timeouts are configurable, and in-memory fallback is disabled.

The Brevo integration posts transactional email payloads to the official `POST /v3/smtp/email` endpoint using the `api-key` header. The sender must be verified in Brevo, and the API key must come from the deployment environment. `FRONTEND_URL` is used to build the frontend reset URL; production requires HTTPS. Disabled delivery does not call Brevo or expose a token. Automated tests replace the HTTP transport and do not send real messages.

Existing migrations must remain immutable. New schema changes require a new revision and should be tested first against an independent PostgreSQL database.

## Development limitations

- Brevo password-reset delivery is implemented but requires deployment-specific API key and verified sender settings.
- The AI endpoint uses local mock pattern matching rather than an external model.
- Messages, credential verification, saved-job notifications, and advanced search/recommendation systems are not backed by complete domain services.
- Backend pytest and frontend Vitest suites cover the primary flows. `.github/workflows/ci.yml` runs them with isolated PostgreSQL 15 and Redis 7 services and mocked Brevo transport.
