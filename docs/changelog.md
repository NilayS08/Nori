# Changelog

## v0.1.0

Project initialized

- Repository created
- Folder structure
- FastAPI
- Next.js

---

## v0.2.0

Authentication

- JWT
- Login
- Signup

---

## v0.3.0

Onboarding

- User profile
- Goals
- Expenses

---

## v0.4.0

Financial Engine

- Safe To Spend
- Goal Projection
- Confidence Score

---

## v0.5.0

Dashboard

- Hero card
- Timeline
- Charts

---

## v0.6.0

Goals & Weekly Check-ins

- Goal CRUD
- Goal progress calculation
- Goal detail page
- Weekly check-in model, API, and reminder UI

---

## v0.7.0

AI

- Gemini provider behind an `AIProvider` abstraction
- Purchase advice — amount checked against budget + goals, friendly explanation
- Weekly summary — current week stats + natural-language summary
- What-if simulator — deterministic scenario projections + recommendation
- Goal explanations — plain-language read on goal progress
- Safety — graceful provider failure, per-user rate limiting, prompt validation

## v0.8.0

Dashboard Redesign

- New design system — `#060608` palette, Inter/DM Sans/JetBrains Mono, glass utilities (`.glass`, `.glass-nav`), gradient text, animated orbs
- Floating glass pill navbar (shared across dashboard + goals pages)
- Safe-to-spend hero with live balance badge, gradient INR display, and reset countdown
- Quick stats, weekly spending chart (real check-in history), savings goals, budget health, financial confidence, and weekly check-in cards wired to real data
- "Ask Nori" assistant panel wired to the existing AI features (purchase advice, what-if, weekly summary, goal review) with real suggestion chips and quick actions

---

## v0.8.1

UX Follow-ups

- New Insights page (`/insights`) — full-page "Ask Nori" chat reusing the dashboard assistant, with weekly insight + quick actions sidebar
- Navbar rework — Insights tab (lightbulb), removed search icon, sign-out moved into avatar profile dropdown
- Pages now open scrolled to top (client `ScrollToTop` + manual scroll restoration)
- Shared chat logic extracted into a reusable `useNoriChat` hook with presentational chat components

---

Future releases should continue in semantic versioning (`MAJOR.MINOR.PATCH`).
