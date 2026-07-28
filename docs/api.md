# API Documentation

## Base URL

/api/v1

---

## Authentication

POST /auth/register

POST /auth/login

POST /auth/logout

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
- Upcoming Salary
- Weekly Summary

---

## Goals

GET /goals

POST /goals

PUT /goals/{id}

DELETE /goals/{id}

---

## Weekly Check-ins

POST /checkins

GET /checkins

---

## AI

POST /ai/purchase-advice

POST /ai/what-if

POST /ai/chat

---

## Settings

GET /settings

PUT /settings