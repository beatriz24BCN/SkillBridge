from datetime import datetime, timedelta

from app.extensions import db
from app.models import PasswordResetToken, User
from conftest import auth
from flask_jwt_extended import create_access_token


def test_register_login_and_jwt_validation(client, register_user):
    user, token, email = register_user("Candidate")

    assert user["email"] == email
    assert "password_hash" not in user
    assert client.get("/api/auth/me").status_code == 401
    assert client.get("/api/auth/me", headers={"Authorization": "Bearer invalid"}).status_code == 401
    assert client.get("/api/auth/me", headers=auth(token)).get_json()["user"]["id"] == user["id"]

    login = client.post("/api/auth/login", json={"email": email, "password": "Password123"})
    assert login.status_code == 200
    assert "access_token" in login.get_json()
    assert client.post("/api/auth/login", json={"email": email, "password": "wrong"}).status_code == 401


def test_expired_jwt_is_rejected(client, app, register_user):
    user, _, _ = register_user("ExpiredJwt")
    with app.app_context():
        token = create_access_token(
            identity=str(user["id"]),
            additional_claims={"token_version": 0},
            expires_delta=timedelta(seconds=-1),
        )
    response = client.get("/api/auth/me", headers=auth(token))
    assert response.status_code == 401
    assert response.get_json()["error"] == "Token has expired"
    assert response.headers["Cache-Control"] == "no-store"
    assert response.headers["X-Content-Type-Options"] == "nosniff"


def test_registration_validation_and_duplicate_email(client, register_user):
    _, _, email = register_user("Duplicate")

    duplicate = client.post("/api/auth/register", json={
        "email": email,
        "password": "Password123",
        "first_name": "Another",
        "last_name": "User",
    })
    assert duplicate.status_code == 409

    invalid = client.post("/api/auth/register", json={
        "email": "invalid",
        "password": "short",
        "first_name": "A",
        "last_name": "B",
    })
    assert invalid.status_code == 400
    assert client.post("/api/auth/login", json=[]).status_code == 400
    assert client.post("/api/auth/password/forgot", json={"email": 42}).status_code == 202
    assert client.post("/api/auth/password/reset", json={
        "token": 42,
        "password": "Password123",
    }).status_code == 400


def test_profile_preferences_and_public_visibility(client, register_user):
    user, token, _ = register_user("Profile")
    _, other_token, _ = register_user("Observer")

    payload = {
        "phone": "+34 600 000 000",
        "location": "Barcelona",
        "skills": ["React", "Python", "React"],
        "experience": [{
            "company": "Example",
            "position": "Engineer",
            "start": "2024-01",
            "end": "",
            "description": "Built web applications",
        }],
        "preferences": {
            "job_alerts": False,
            "remote_only": True,
            "profile_public": False,
            "preferred_location": "Barcelona",
        },
    }
    updated = client.patch("/api/auth/me", headers=auth(token), json=payload)
    assert updated.status_code == 200
    data = updated.get_json()["user"]
    assert data["skills"] == ["React", "Python"]
    assert data["phone"] == payload["phone"]
    assert data["preferences"]["remote_only"] is True

    assert client.get(f"/api/users/{user['id']}", headers=auth(other_token)).status_code == 403
    assert client.patch("/api/auth/me", headers=auth(token), json={
        "preferences": {"profile_public": True},
    }).status_code == 200
    public = client.get(f"/api/users/{user['id']}", headers=auth(other_token))
    assert public.status_code == 200
    assert "preferences" not in public.get_json()["user"]
    assert "email" not in public.get_json()["user"]
    assert "phone" not in public.get_json()["user"]
    assert "location" not in public.get_json()["user"]

    assert client.patch("/api/auth/me", headers=auth(token), json={
        "preferences": {"remote_only": "yes"},
    }).status_code == 400


def test_password_reset_is_generic_single_use_and_persistent(client, app, register_user):
    user, old_token, email = register_user("Reset")
    unknown = "unknown@example.test"

    for address in (email, unknown):
        response = client.post("/api/auth/password/forgot", json={"email": address})
        assert response.status_code == 202
        assert response.get_json()["message"].startswith("If the email is registered")

    with app.app_context():
        PasswordResetToken.query.filter_by(user_id=user["id"]).delete()
        raw_token, reset = PasswordResetToken.create_for_user(
            user["id"], datetime.utcnow() + timedelta(minutes=5),
        )
        db.session.add(reset)
        db.session.commit()
        assert reset.token_hash != raw_token

    reset_response = client.post("/api/auth/password/reset", json={
        "token": raw_token,
        "password": "NewPassword456",
    })
    assert reset_response.status_code == 200
    assert client.post("/api/auth/password/reset", json={
        "token": raw_token,
        "password": "AnotherPassword789",
    }).status_code == 400
    assert client.post("/api/auth/login", json={
        "email": email,
        "password": "Password123",
    }).status_code == 401
    assert client.post("/api/auth/login", json={
        "email": email,
        "password": "NewPassword456",
    }).status_code == 200
    assert client.get("/api/auth/me", headers=auth(old_token)).status_code == 401

    with app.app_context():
        stored = db.session.get(User, user["id"])
        assert stored.password_hash != "NewPassword456"


def test_expired_password_reset_token_is_rejected(client, app, register_user):
    user, _, _ = register_user("Expired")
    with app.app_context():
        raw_token, reset = PasswordResetToken.create_for_user(
            user["id"], datetime.utcnow() - timedelta(seconds=1),
        )
        db.session.add(reset)
        db.session.commit()

    assert client.post("/api/auth/password/reset", json={
        "token": raw_token,
        "password": "NewPassword456",
    }).status_code == 400


def test_password_change_revokes_existing_jwt(client, register_user):
    _, token, email = register_user("ChangePassword")
    response = client.patch("/api/auth/me/password", headers=auth(token), json={
        "current_password": "Password123",
        "new_password": "NewPassword456",
    })
    assert response.status_code == 200
    assert client.get("/api/auth/me", headers=auth(token)).status_code == 401
    assert client.post("/api/auth/login", json={
        "email": email,
        "password": "NewPassword456",
    }).status_code == 200


def test_login_rate_limit_returns_429(client):
    for attempt in range(10):
        response = client.post("/api/auth/login", json={
            "email": f"missing-{attempt}@example.test",
            "password": "WrongPassword123",
        })
        assert response.status_code == 401
    assert client.post("/api/auth/login", json={
        "email": "limited@example.test",
        "password": "WrongPassword123",
    }).status_code == 429
