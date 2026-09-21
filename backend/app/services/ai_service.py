from uuid import uuid4


def generate_response(user, message: str, session_id: str | None = None) -> dict:
    """Generate a backend mock response for the AI Assistant.

    This function intentionally does not call any external API. It contains
    simple pattern-matching logic so the frontend/backend flow can be
    exercised end-to-end during early integration.
    """
    lc = (message or "").strip().lower()
    if not lc:
        text = "I didn't get a message. Please send some text."
    elif "jwt" in lc:
        text = (
            "JWT (JSON Web Token) is a compact, URL-safe means of representing "
            "claims between two parties. It has three parts: header, payload, "
            "and signature. In our API we use JWT for authentication."
        )
    elif "react" in lc and "interview" in lc:
        text = (
            "Practice describing hooks, lifecycle and controlled vs uncontrolled "
            "components. Focus on clear examples and trade-offs."
        )
    elif "cv" in lc or "resume" in lc:
        text = (
            "Focus on measurable outcomes: start bullets with action verbs and "
            "add metrics where possible. Keep the summary concise."
        )
    else:
        text = f"Backend mock reply: {message}"

    return {"id": str(uuid4()), "text": text, "meta": {"source": "backend"}}
