from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings


# ---------------------------------------------------------------------
# SQLAlchemy Base
# ---------------------------------------------------------------------
class Base(DeclarativeBase):
    """Base class for all SQLAlchemy ORM models."""

    pass


# ---------------------------------------------------------------------
# Database Engine
# ---------------------------------------------------------------------
engine = create_engine(
    settings.database_url,
    echo=settings.debug,  # Logs SQL queries in development
    future=True,
)


# ---------------------------------------------------------------------
# Session Factory
# ---------------------------------------------------------------------
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)


# ---------------------------------------------------------------------
# Dependency
# ---------------------------------------------------------------------
def get_db() -> Generator[Session]:
    """
    FastAPI dependency that provides a database session
    and ensures it is closed after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
