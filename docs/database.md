# Database Design

## Current Database Technology

| Component      | Technology        |
|----------------|-------------------|
| Database       | PostgreSQL 17     |
| ORM            | SQLAlchemy 2.0    |
| Migrations     | Alembic           |
| Driver         | psycopg 3         |

Database migrations are version-controlled and handled exclusively through Alembic (to be initialized).

---

## SQLAlchemy Configuration

SQLAlchemy is configured in `app/core/database.py`.

### Base

```python
class Base(DeclarativeBase):
    """Base class for all SQLAlchemy ORM models."""
    pass
```

All ORM models inherit from `Base`.

### Engine

```python
engine = create_engine(
    settings.database_url,
    echo=settings.debug,
    future=True,
)
```

Created once at startup using the URL from `settings.database_url`. SQL query logging is enabled in debug mode.

### SessionLocal

```python
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)
```

Factory that creates new database sessions.

### get_db()

```python
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

FastAPI dependency that provides a database session per request and ensures it is properly closed.

---

## Users

Stores:

- Name
- Email
- Password
- Income
- User Type

---

## Goals

Stores:

- Title
- Target Amount
- Current Amount
- Deadline
- Created At
- Updated At

## Weekly Checkins

Stores:

- Amount Spent
- Notes
- Created At

Check-ins belong to a user (cascade delete).

---

## AI Conversations

Stores:

- User Prompt
- AI Response
- Created At

---

## Settings

Stores:

- Currency
- Theme
- Notifications

---

## Relationships

User

├── Goals

├── Weekly Checkins

├── AI Conversations

└── Settings
