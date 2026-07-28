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