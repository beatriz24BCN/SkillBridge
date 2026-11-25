import json
from urllib.error import HTTPError, URLError

import pytest

from app.config import Config, validate_config
from app.services.brevo_email_service import BrevoPasswordResetMailer, EmailDeliveryError


class SuccessfulResponse:
    status = 201

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def read(self):
        return b'{"messageId":"test-message-id"}'


class UnexpectedResponse:
    status = 200

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def read(self):
        return b'{"sensitive":"provider-body"}'


def mailer_config():
    return {
        "BREVO_EMAIL_ENABLED": True,
        "BREVO_API_KEY": "test-api-key",
        "BREVO_API_URL": "https://api.brevo.com/v3/smtp/email",
        "BREVO_SENDER_EMAIL": "security@example.test",
        "BREVO_SENDER_NAME": "SkillBridge",
        "FRONTEND_URL": "https://app.example.test",
        "BREVO_TIMEOUT": 3,
    }


def test_brevo_payload_uses_documented_endpoint_headers_and_token(monkeypatch):
    captured = {}

    def fake_urlopen(request, timeout):
        captured["request"] = request
        captured["timeout"] = timeout
        return SuccessfulResponse()

    monkeypatch.setattr("app.services.brevo_email_service.urlopen", fake_urlopen)
    mailer = BrevoPasswordResetMailer(mailer_config())

    assert mailer.send_password_reset("candidate@example.test", "raw-test-token") is True
    request = captured["request"]
    payload = json.loads(request.data)
    assert request.full_url == mailer_config()["BREVO_API_URL"]
    assert request.get_header("Api-key") == "test-api-key"
    assert request.get_header("Content-type") == "application/json"
    assert payload["sender"] == {"name": "SkillBridge", "email": "security@example.test"}
    assert payload["to"] == [{"email": "candidate@example.test"}]
    assert "raw-test-token" in payload["textContent"]
    assert "raw-test-token" in payload["htmlContent"]
    assert "https://app.example.test/reset-password?token=raw-test-token" in payload["textContent"]
    assert captured["timeout"] == 3


@pytest.mark.parametrize("failure", [
    HTTPError("https://api.brevo.com", 401, "Unauthorized", {}, None),
    URLError("offline"),
])
def test_brevo_delivery_errors_are_safe(monkeypatch, failure):
    def fail(_request, timeout):
        raise failure

    monkeypatch.setattr("app.services.brevo_email_service.urlopen", fail)
    with pytest.raises(EmailDeliveryError):
        BrevoPasswordResetMailer(mailer_config()).send_password_reset(
            "candidate@example.test",
            "raw-test-token",
        )


def test_disabled_brevo_delivery_does_not_make_network_request(monkeypatch):
    def unexpected(_request, timeout):
        raise AssertionError("disabled delivery must not call Brevo")

    monkeypatch.setattr("app.services.brevo_email_service.urlopen", unexpected)
    config = mailer_config()
    config["BREVO_EMAIL_ENABLED"] = False
    assert BrevoPasswordResetMailer(config).send_password_reset(
        "candidate@example.test",
        "raw-test-token",
    ) is False


def test_brevo_unexpected_success_status_is_rejected(monkeypatch):
    monkeypatch.setattr(
        "app.services.brevo_email_service.urlopen",
        lambda _request, timeout: UnexpectedResponse(),
    )

    with pytest.raises(EmailDeliveryError, match="unexpected status 200"):
        BrevoPasswordResetMailer(mailer_config()).send_password_reset(
            "candidate@example.test",
            "raw-test-token",
        )


def test_brevo_requires_deployment_credentials_when_enabled(monkeypatch):
    monkeypatch.setattr(Config, "BREVO_EMAIL_ENABLED", True)
    monkeypatch.setattr(Config, "BREVO_API_KEY", None)
    monkeypatch.setattr(Config, "BREVO_SENDER_EMAIL", None)
    monkeypatch.setattr(Config, "FRONTEND_URL", None)

    with pytest.raises(
        RuntimeError,
        match="BREVO_API_KEY, BREVO_SENDER_EMAIL, FRONTEND_URL",
    ):
        validate_config()


def test_production_rejects_insecure_frontend_url(monkeypatch):
    monkeypatch.setattr(Config, "ENVIRONMENT", "production")
    monkeypatch.setattr(Config, "RATELIMIT_STORAGE_URI", "redis://localhost:6379/0")
    monkeypatch.setattr(Config, "BREVO_EMAIL_ENABLED", True)
    monkeypatch.setattr(Config, "BREVO_API_KEY", "test-api-key")
    monkeypatch.setattr(Config, "BREVO_SENDER_EMAIL", "security@example.test")
    monkeypatch.setattr(Config, "FRONTEND_URL", "http://app.example.test")

    with pytest.raises(RuntimeError, match="FRONTEND_URL to use HTTPS"):
        validate_config()


def test_production_rejects_process_local_rate_limit_storage(monkeypatch):
    monkeypatch.setattr(Config, "ENVIRONMENT", "production")
    monkeypatch.setattr(Config, "RATELIMIT_STORAGE_URI", "memory://")
    monkeypatch.setattr(Config, "BREVO_EMAIL_ENABLED", False)

    with pytest.raises(RuntimeError, match="requires RATELIMIT_STORAGE_URI"):
        validate_config()


@pytest.mark.parametrize("delivery_fails, token_should_be_used", [
    (False, False),
    (True, True),
])
def test_forgot_password_delivers_token_or_invalidates_it(
    client, app, register_user, monkeypatch, delivery_fails, token_should_be_used,
):
    from app.extensions import db
    from app.models import PasswordResetToken
    from app.routes import auth as auth_routes

    user, _, email = register_user("BrevoReset")
    captured = {}

    class Mailer:
        def send_password_reset(self, recipient, token):
            captured.update(recipient=recipient, token=token)
            if delivery_fails:
                raise EmailDeliveryError("delivery failed")
            return True

    monkeypatch.setattr(auth_routes, "password_reset_mailer", lambda _config: Mailer())

    response = client.post("/api/auth/password/forgot", json={"email": email})

    assert response.status_code == 202
    assert captured["recipient"] == email
    with app.app_context():
        reset = PasswordResetToken.query.filter_by(user_id=user["id"]).one()
        assert reset.token_hash == PasswordResetToken.hash_token(captured["token"])
        assert (reset.used_at is not None) is token_should_be_used
        db.session.remove()
