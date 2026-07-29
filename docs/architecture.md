# Architecture

## Overview

The application follows a Clean Architecture approach.

The backend is intentionally designed so that:

- Business logic is separated from API routes.
- AI is separated from financial calculations.
- Database access is isolated.
- AI providers can be swapped without changing business logic.

---

## High-Level Architecture

Next.js

↓

REST API

↓

FastAPI

↓

Service Layer

↓

Financial Engine

↓

Repositories

↓

PostgreSQL

↓

Gemini (Optional)

---

## Folder Responsibilities

### api/

Contains REST endpoints.

Responsibilities:

- Input validation
- Dependency Injection
- Calling Services

Should NEVER contain business logic.

---

### services/

Application logic.

Responsible for:

- Dashboard
- Goals
- Authentication
- Weekly Check-ins

Services orchestrate the application.

---

### repositories/

Responsible only for database access.

Should not contain business rules.

---

### Financial Engine

The core of the application.

Responsible for:

- Safe To Spend
- Disposable Income
- Goal Projection
- Purchase Simulation
- Salary Simulation
- Confidence Score

No AI.

Pure deterministic calculations.

---

### AI Layer

Responsible only for:

- Explaining calculations
- Purchase advice
- Weekly summaries
- What-if conversations

Never responsible for financial calculations.

---

## Request Lifecycle

Client

↓

API Route

↓

Service

↓

Financial Engine

↓

Repository

↓

Database

↓

AI (Optional)

↓

Response

---

## Principles

- Thin routes
- Fat services
- Deterministic calculations
- AI explains
- Clean Architecture
- SOLID

---

## Local Development Stack

### Infrastructure

All services run locally during development:

| Component     | Technology             |
|---------------|------------------------|
| API Server    | FastAPI (uvicorn)      |
| Database      | PostgreSQL 17 (Docker) |
| ORM           | SQLAlchemy 2.0         |
| Migrations    | Alembic                |
| Configuration | Pydantic Settings      |

### Docker Compose

PostgreSQL runs inside a Docker container defined in `docker-compose.yml`:

```
services:
  postgres:
    image: postgres:17
    container_name: nori_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: nori_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

The database container is started separately from the application server during development.

### Configuration System

Environment variables are loaded from `.env` and validated through a single `Settings` class using Pydantic Settings:

```python
class Settings(BaseSettings):
    app_name: str = "Nori"
    app_env: str = "development"
    database_url: str
    secret_key: str
    gemini_api_key: str
    # ...

    model_config = SettingsConfigDict(env_file=".env")

settings = get_settings()
```

All configuration is accessed through `from app.core.config import settings`.

### Database Layer

SQLAlchemy is configured in `app/core/database.py`:

- **Base** — Declarative base for all ORM models.
- **Engine** — Created from `settings.database_url`. SQL logging enabled in debug mode.
- **SessionLocal** — Session factory with `autoflush=False` and `expire_on_commit=False`.
- **get_db()** — FastAPI dependency that yields a session and closes it after the request.

```python
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Environment Variables

All environment variables are documented in `backend/.env.example`:

```
APP_NAME=
APP_ENV=
APP_HOST=
APP_PORT=
DATABASE_URL=
SECRET_KEY=
ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
GEMINI_API_KEY=
FRONTEND_URL=
LOG_LEVEL=
```

---

## Planned Production Stack

| Component     | Target                    |
|---------------|---------------------------|
| Frontend      | Vercel                    |
| Backend       | Railway / Fly.io          |
| Database      | Neon / Supabase PostgreSQL |

The application architecture remains identical between development and production. Only the `DATABASE_URL` changes.

---

## Updated Request Lifecycle

```
Client
    │
    ▼
API Route (dependency injection via get_db())
    │
    ▼
Service
    │
    ▼
Financial Engine
    │
    ▼
Repository (receives SQLAlchemy Session)
    │
    ▼
PostgreSQL
    │
    ▼
AI (Optional — via AIProvider abstraction)
    │
    ▼
Response
```
