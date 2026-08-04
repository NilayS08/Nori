# API Documentation

> **Note:** All endpoints use dependency injection with `get_db()` to receive a SQLAlchemy session.

## Base URL

/api/v1

---

## Authentication

POST /auth/register

POST /auth/login

POST /auth/logout

POST /auth/refresh

GET /auth/me

---

## Onboarding

POST /onboarding

GET /onboarding

PUT /onboarding

---

## Dashboard

GET /dashboard

Returns:

- Safe To Spend
- Confidence Score
- Goal Progress
- Budget Health

GET /dashboard/summary

Returns the key numbers only.

---

## Goals

GET /goals

Lists the authenticated user's goals, each with progress calculation.

POST /goals

Creates a goal.

Body:

- title (string)
- target_amount (float, > 0)
- current_amount (float, ≥ 0, default 0)
- deadline (date, future)

GET /goals/{id}

Returns a single goal with progress calculation.

PUT /goals/{id}

Updates a goal. All fields optional.

DELETE /goals/{id}

Deletes a goal. Returns 204.

---

## Weekly Check-ins

POST /checkins

Creates a check-in.

Body:

- amount_spent (float, ≥ 0)
- notes (string, optional)

GET /checkins

Lists recent check-ins (newest first, max 20).

GET /checkins/latest

Returns the most recent check-in, or null if none exist.

---

## AI

POST /ai/purchase-advice

POST /ai/what-if

POST /ai/chat

---

## Settings

GET /settings

PUT /settings
