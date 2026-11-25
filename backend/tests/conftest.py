import os
from urllib.parse import urlparse

import pytest


TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL")
if not TEST_DATABASE_URL:
    pytest.skip("TEST_DATABASE_URL is required for backend tests", allow_module_level=True)

database_name = urlparse(TEST_DATABASE_URL.replace("+psycopg", "")).path.lstrip("/")
if database_name == "skillbridge_dev" or "test" not in database_name.lower():
    raise RuntimeError("TEST_DATABASE_URL must point to a separate database whose name contains 'test'")

os.environ["DATABASE_URL"] = TEST_DATABASE_URL
os.environ["JWT_SECRET_KEY"] = "skillbridge-tests-only-secret-at-least-32-bytes"
os.environ.setdefault("RATELIMIT_STORAGE_URI", "memory://")

from app import create_app
from app.extensions import db, limiter


@pytest.fixture(scope="session")
def app():
    application = create_app()
    application.config.update(TESTING=True)
    return application


@pytest.fixture(autouse=True)
def database(app):
    with app.app_context():
        limiter.reset()
        db.drop_all()
        db.create_all()
        yield
        db.session.remove()
        db.drop_all()
        limiter.reset()


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def register_user(client):
    counter = 0

    def register(name="User"):
        nonlocal counter
        counter += 1
        email = f"{name.lower()}-{counter}@example.test"
        response = client.post("/api/auth/register", json={
            "email": email,
            "password": "Password123",
            "first_name": name,
            "last_name": "Tester",
        })
        assert response.status_code == 201
        data = response.get_json()
        return data["user"], data["access_token"], email

    return register


def auth(token):
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def create_company_and_job(client, register_user):
    def create():
        employer, token, _ = register_user("Employer")
        company = client.post(
            "/api/companies/",
            headers=auth(token),
            json={"name": "Test Company", "location": "Barcelona"},
        )
        assert company.status_code == 201
        company_data = company.get_json()
        job = client.post(
            "/api/jobs/",
            headers=auth(token),
            json={
                "title": "Backend Engineer",
                "description": "Build reliable APIs",
                "requirements": "Python, Flask, PostgreSQL",
                "company_id": company_data["id"],
            },
        )
        assert job.status_code == 201
        return employer, token, company_data, job.get_json()

    return create
