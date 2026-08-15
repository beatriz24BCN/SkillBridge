# SkillBridge — Backend

Este directorio contiene la API backend minimal preparada para producción usando Flask.

Requisitos
- Python 3.10+
- PostgreSQL (para producción)

Instalación rápida (desarrollo)

1. Crear y activar un entorno virtual:

```bash
python -m venv .venv
source .venv/bin/activate
```

2. Instalar dependencias:

```bash
pip install -r requirements.txt
```

3. Copiar el archivo de ejemplo y configurar variables de entorno:

```bash
cp .env.example .env
# editar .env y establecer DATABASE_URL y JWT_SECRET_KEY
```

4. Iniciar la aplicación (desarrollo):

```bash
python run.py
```

Variables de entorno necesarias
- `DATABASE_URL` — URL de la base de datos (Postgres). Obligatoria.
- `JWT_SECRET_KEY` — secreto para JWT.
- `CORS_ORIGINS` — orígenes permitidos, separados por comas (por defecto `http://localhost:5173`).

Endpoints
- `GET /api/health` — health check
- `POST /api/auth/register` — (pendiente)
- `POST /api/auth/login` — (pendiente)
- `GET /api/auth/me` — (pendiente)

Notas
- No se incluyen credenciales ni secretos reales.
