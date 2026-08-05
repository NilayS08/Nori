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

---

## ADR-012

Decision

AI endpoints always return deterministic numbers; the AI field is nullable.

Reason

AI failures should never break the feature. When the provider fails, the endpoint returns 200 with the computed numbers and a `null` AI field (graceful failure).

---

## ADR-013

Decision

Rate-limit AI endpoints per user with an in-memory sliding window.

Reason

Control API cost and prevent abuse. 10 requests per user per minute (configurable via `AI_RATE_LIMIT_PER_MINUTE`). Fine for a single-process dev deployment; a shared store (e.g. Redis) is the upgrade path for production.

---

## ADR-014

Decision

The LLM receives only numbers precomputed by the Financial Engine.

Reason

The LLM never calculates and never invents numbers. What-if scenarios are simulated deterministically by the engine before any prompt is built.

---

## ADR-015

Decision

Model referenced as `gemini-flash-latest`.

Reason

The stable alias points to the newest flash model automatically, avoiding breakage when a pinned model is retired. Overridable via `GEMINI_MODEL`.
