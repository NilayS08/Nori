# MoneyOS — Master Project Context

## Vision

MoneyOS is an AI-powered Financial Confidence Platform.

It is NOT an expense tracker.

It is NOT an accounting application.

It is NOT an investment app.

The mission is simple:

> Help users spend with confidence, not guilt.

The core promise of the product is:

> "Know exactly how much you can safely spend without hurting your future."

Every feature should reinforce this promise.

If a feature does not help answer this question, it should not be included in the MVP.

---

## Target Users

Primary Audience

• Final-year students
• Young professionals (22–30)

Secondary Audience

• Early-career freelancers

These users usually have:

- limited financial knowledge
- recurring financial decisions
- savings goals
- salary growth
- anxiety around spending

MoneyOS should reduce financial anxiety rather than create it.

---

## Product Philosophy

Traditional finance apps ask:

"Where did your money go?"

MoneyOS asks:

"What should you do next?"

The app is about guidance rather than bookkeeping.

Users should feel optimistic every time they open the app.

Never shame users.

Never overwhelm users.

Always explain tradeoffs.

---

## MVP Goal

A user should be able to onboard in under two minutes and immediately know:

• Safe to Spend This Week
• Financial Confidence Score
• Progress toward goals

Then they should be able to ask:

"Can I buy this?"

and receive a personalized answer.

---

## Core Product Pillars

1. Safe to Spend

The single most important metric.

Displayed prominently on the dashboard.

2. Financial Confidence

A score representing overall financial health.

3. Goals

Track meaningful goals rather than tiny expenses.

4. AI Advice

Explain financial decisions using natural language.

5. Weekly Check-ins

Lightweight updates instead of detailed expense tracking.

---

## Tech Stack

Frontend

- Next.js 16
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion
- TanStack Query
- Axios
- React Hook Form
- Lucide Icons

Backend

- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- Docker
- Pydantic Settings
- JWT
- APScheduler

AI

Gemini initially

Architecture should support:

Gemini

OpenAI

Claude

Local models

without changing business logic.

---

## Development Environment

- PostgreSQL runs locally inside Docker during development (postgres:17).
- SQLAlchemy 2.0 is the ORM (Base, Engine, SessionLocal, get_db()).
- Alembic will manage schema migrations.
- Configuration is centralized using Pydantic Settings (`app.core.config`).
- Business logic remains inside the Financial Engine.
- AI continues to be responsible only for reasoning and explanations.

## AI Philosophy

AI should only explain.

AI should never calculate.

Calculations belong inside the Financial Engine.

AI usage should stay under 10–15 calls per active user each month.

Keep operational costs extremely low.

---

## Financial Engine

The Financial Engine is the heart of MoneyOS.

Every financial calculation lives here.

Examples:

calculate_safe_to_spend()

calculate_disposable_income()

simulate_purchase()

simulate_salary_change()

project_goal_completion()

calculate_confidence_score()

This module must be deterministic.

Never use AI for calculations.

---

## Backend Architecture

Use Clean Architecture.

Routes

↓

Services

↓

Repositories

↓

Database

Business logic must never exist inside routes.

---

## AI Layer

AI should receive structured JSON.

Example

Financial Engine

↓

JSON

↓

Gemini

↓

Natural-language explanation

This keeps costs low and logic reliable.

---

## UI Philosophy

Premium.

Minimal.

Apple-inspired.

Liquid Glass.

Large spacing.

Soft animations.

No clutter.

The dashboard should never resemble Excel.

---

## Success Metric

A user should recommend MoneyOS by saying:

"It tells me exactly how much I can spend without feeling guilty."

or

"It tells me if I can actually afford things."

If users describe the app as

"an expense tracker"

then the product has failed.

---

## Development Philosophy

Never rush.

Every phase should end with a working application.

Keep commits clean.

Document architecture decisions.

Prefer simple solutions.

Only introduce complexity when necessary.

Code should be interview-quality.
