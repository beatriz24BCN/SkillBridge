import os
from app import create_app


def main():
    # Allow overriding host/port via env for testing
    host = os.getenv("FLASK_RUN_HOST", "127.0.0.1")
    port = int(os.getenv("FLASK_RUN_PORT", "5000"))

    app = create_app()
    app.run(host=host, port=port)


if __name__ == "__main__":
    main()
