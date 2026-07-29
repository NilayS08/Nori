# Architecture Decisions

## ADR-001

Decision

Use Clean Architecture.

Reason

Keeps code maintainable.

---

## ADR-002

Decision

Financial calculations are deterministic.

Reason

AI calculations cannot be trusted.

---

## ADR-003

Decision

Gemini wrapped behind AIProvider.

Reason

Easy provider replacement.

---

## ADR-004

Decision

Weekly check-ins instead of expense tracking.

Reason

Lower user friction.

---

## ADR-005

Decision

Dashboard centers around Safe To Spend.

Reason

Supports the product vision.

---

## ADR-006

Decision

Use PostgreSQL.

Reason

Production-ready.

---

## ADR-007

Decision

Use FastAPI.

Reason

Excellent async support and typing.

---

## ADR-008

Decision

Use Next.js.

Reason

SEO + React ecosystem.

---

## ADR-009

Decision

Use Dockerized PostgreSQL During Development.

Reason

- Consistent environment
- Easy onboarding
- Avoid local PostgreSQL installation
- Matches production database engine

Consequences

Only the database host changes between development and production.

---

## ADR-010

Decision

Centralize Configuration Using Pydantic Settings.

Reason

Avoid scattered environment variable access.

All configuration should be accessed through a single typed Settings object.

Consequences

Application configuration becomes type-safe and easier to maintain.

---

## ADR-011

Decision

Use SQLAlchemy ORM.

Reason

- Strong FastAPI ecosystem
- Mature ORM
- Excellent Alembic integration
- Easier model management
