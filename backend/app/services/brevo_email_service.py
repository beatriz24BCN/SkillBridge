from html import escape
import json
import logging
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from urllib.request import Request, urlopen


logger = logging.getLogger(__name__)


class EmailDeliveryError(RuntimeError):
    pass


class BrevoPasswordResetMailer:
    def __init__(self, config):
        self.enabled = config["BREVO_EMAIL_ENABLED"]
        self.api_key = config.get("BREVO_API_KEY")
        self.api_url = config.get("BREVO_API_URL")
        self.sender_email = config.get("BREVO_SENDER_EMAIL")
        self.sender_name = config.get("BREVO_SENDER_NAME", "SkillBridge")
        self.frontend_url = config.get("FRONTEND_URL")
        self.timeout = config.get("BREVO_TIMEOUT", 10)

    def send_password_reset(self, recipient, raw_token):
        if not self.enabled:
            logger.warning("Password-reset email requested but Brevo delivery is disabled")
            return False

        reset_url = self._reset_url(raw_token)
        payload = self._payload(recipient, reset_url)
        request = Request(
            self.api_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Accept": "application/json",
                "Content-Type": "application/json",
                "api-key": self.api_key,
            },
            method="POST",
        )
        try:
            with urlopen(request, timeout=self.timeout) as response:
                if response.status not in {201, 202}:
                    raise EmailDeliveryError(
                        f"Brevo returned unexpected status {response.status}"
                    )
                response.read()
            return True
        except HTTPError as exc:
            logger.error("Brevo password-reset delivery rejected with status %s", exc.code)
            raise EmailDeliveryError("Brevo rejected the email request") from exc
        except (OSError, URLError) as exc:
            logger.exception("Brevo password-reset delivery failed")
            raise EmailDeliveryError("Unable to reach Brevo") from exc

    def _reset_url(self, token):
        parts = urlsplit(self.frontend_url)
        query = dict(parse_qsl(parts.query, keep_blank_values=True))
        query["token"] = token
        return urlunsplit((
            parts.scheme,
            parts.netloc,
            f"{parts.path.rstrip('/')}/reset-password",
            urlencode(query),
            parts.fragment,
        ))

    def _payload(self, recipient, reset_url):
        safe_url = escape(reset_url, quote=True)
        return {
            "sender": {"name": self.sender_name, "email": self.sender_email},
            "to": [{"email": recipient}],
            "subject": "Reset your SkillBridge password",
            "textContent": (
                "We received a request to reset your SkillBridge password.\n\n"
                f"Open this secure link within 30 minutes:\n{reset_url}\n\n"
                "If you did not request this change, ignore this email."
            ),
            "htmlContent": (
                "<p>We received a request to reset your SkillBridge password.</p>"
                f'<p><a href="{safe_url}">Reset password</a></p>'
                "<p>This link expires in 30 minutes. "
                "If you did not request this change, ignore this email.</p>"
            ),
            "tags": ["password-reset"],
        }


def password_reset_mailer(config):
    return BrevoPasswordResetMailer(config)
