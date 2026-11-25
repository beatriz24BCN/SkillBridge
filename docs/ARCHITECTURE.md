# SkillBridge technical architecture

## Current project structure

```text
backend/
  app/
    __init__.py          Flask application factory and blueprint registration
    config.py            Environment-based configuration
    extensions.py        SQLAlchemy, Migrate, JWT, and CORS objects
    models/              SQLAlchemy entities and serialization
    routes/              HTTP endpoints grouped by domain
    services/            Backend service helpers
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

An application links one candidate (`user_id`) with one job (`job_id`). The application service prevents a second application for the same candidate/job pair at API level. New applications start as `pending`.

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
4. On a browser reload, `AuthProvider` calls `GET /api/auth/me` to restore the session.
5. Missing, invalid, expired, or deleted-user sessions are cleared and private routes redirect to `/login`.

Logout removes the browser token and clears in-memory user state. The current system has no persisted server-side logout blacklist.

### Password recovery

1. `/forgot-password` calls `POST /api/auth/password/forgot`.
2. The API always returns the same `202` message.
3. For a registered email, an old unused reset record is removed and a 30-minute reset record is created.
4. Only the SHA-256 hash is stored.
5. `/reset-password?token=...` calls `POST /api/auth/password/reset`.
6. The API rejects invalid, expired, or used tokens; a valid reset updates the password hash and marks the token used.

Email delivery is intentionally absent. Production integration still needs to provide the raw token to a mail service and create the reset link without logging the token.

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
| Read another user's profile | That user's `profile_public` must be true |

## Schema evolution

Alembic tracks the schema in `backend/migrations`. The published migration sequence creates:

1. Users.
2. Companies and user ownership.
3. Jobs and company ownership.
4. Applications and candidate/job links.
5. Saved jobs, profile fields/preferences, and password-reset tokens.

Existing migrations must remain immutable. New schema changes require a new revision and should be tested first against an independent PostgreSQL database.

## Development limitations

- Password-reset email delivery is not configured.
- The AI endpoint uses local mock pattern matching rather than an external model.
- Messages, credential verification, saved-job notifications, and advanced search/recommendation systems are not backed by complete domain services.
- No committed automated test suite currently exists; frontend build and backend/migration checks are the available repeatable validations.
