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
- `POST /api/auth/register` — registrar usuario y obtener JWT
- `POST /api/auth/login` — autenticar usuario
- `GET /api/auth/me` — obtener el usuario autenticado
- `PATCH /api/auth/me` — actualizar el perfil autenticado
- `GET /api/jobs` — listar ofertas con su empresa
- `POST /api/jobs` — publicar una oferta para una empresa propia
- `GET /api/companies` — listar empresas
- `POST /api/companies` — crear una empresa para el usuario autenticado
- `GET /api/applications` — listar las candidaturas del usuario autenticado
- `POST /api/applications` — solicitar una oferta
- `GET /api/applications/job/<job_id>` — listar candidaturas de una oferta propia

Notas
- No se incluyen credenciales ni secretos reales.
