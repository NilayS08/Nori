# Nori Roadmap

> This roadmap is the single source of truth for the project's development.
>
> Each phase should be fully completed, documented, and committed before moving to the next.
>
> Every phase should end with:
>
> - All verification steps passing
> - Documentation updated
> - Git commit created

---

# Phase 1 — Project Foundation ✅

Status: Completed

## Objective

Build the entire project foundation before implementing any business logic.

## Tasks

### Backend

- [x] Initialize FastAPI using uv
- [x] Install project dependencies
- [x] Configure environment variables
- [x] Configure SQLAlchemy
- [x] Configure Alembic
- [x] Configure Ruff
- [x] Configure pre-commit
- [x] Create project folder structure



### Frontend

- [x] Initialize Next.js
- [x] Configure TailwindCSS
- [x] Install shadcn/ui
- [x] Configure React Query
- [x] Configure Axios



### Infrastructure

- [x] Docker Compose
- [x] PostgreSQL container
- [x] Database connection



### API

- [x] Health endpoint
- [x] API routing
- [x] Frontend ↔ Backend communication



## Verification

- [x] Backend starts
- [x] Frontend starts
- [x] PostgreSQL running
- [x] Health endpoint returns success
- [x] Frontend can reach backend
- [x] Alembic configured
- [x] Ruff passes
- [x] Pre-commit passes

---



# Phase 2 — Authentication ✅

Status: Cpmpleted

## Objective

Build a complete JWT authentication system.

## Tasks



### Database

- [x] Create User model
- [x] Create RefreshToken model (optional)
- [x] Generate Alembic migration
- [x] Apply migration



### Models

- [x] User ORM model
- [x] Pydantic schemas
- [x] Validation



### Security

- [x] Password hashing
- [x] Password verification
- [x] JWT creation
- [x] JWT decoding
- [x] Token expiration



### API

- [x] Register endpoint
- [x] Login endpoint
- [x] Current user endpoint
- [x] Logout endpoint



### Dependencies

- [x] Current user dependency
- [x] Protected route dependency



## Verification

- [x] User can register
- [x] User can login
- [x] JWT generated
- [x] Invalid password rejected
- [x] Protected endpoint works
- [x] Swagger documentation updated



## Completion Criteria

Authentication is fully functional using JWT.

---



# Phase 3 — User Onboarding

Status: Completed

## Objective

Collect the minimum information required to power the Financial Engine.

## Tasks



### Database

- [x] Extend User model
- [x] Create Goal model
- [x] Generate migration



### Backend

- [x] Onboarding service
- [x] Validation
- [x] CRUD endpoints



### Frontend

- [x] Multi-step onboarding
- [x] Form validation
- [x] Progress indicator



### Data Collection

- [x] User type
- [x] Monthly income
- [x] Monthly expenses
- [x] Current savings
- [x] Savings goal



## Verification

- [x] User completes onboarding
- [x] Data stored correctly
- [x] User redirected to dashboard



## Completion Criteria

A new user can complete onboarding and reach the dashboard.

---



# Phase 4 — Financial Engine

Status: Completed

## Objective

Implement all deterministic financial calculations.

## Tasks



### Core Engine

- [x] Disposable income calculation
- [x] Safe To Spend calculation
- [x] Savings allocation
- [x] Emergency fund calculation
- [x] Goal projection



### Scoring

- [x] Financial Confidence Score
- [x] Budget health score



### Services

- [x] FinancialEngine class
- [x] Unit tests



## Verification

- [x] Calculations verified
- [x] Unit tests passing



## Completion Criteria

All financial calculations are deterministic and tested.

---



# Phase 5 — Dashboard

Status: Completed

## Objective

Display all financial information.

## Tasks



### Backend

- [x] Dashboard endpoint
- [x] Summary endpoint



### Frontend

- [x] Dashboard layout
- [x] Hero card
- [x] Safe To Spend card
- [x] Goal cards
- [x] Confidence Score
- [x] Timeline
- [x] Charts



## Verification

- [x] Dashboard loads
- [x] Correct data displayed



## Completion Criteria

Dashboard is the primary landing page.

---

# Phase 6 — Goals

Status: Completed

## Objective

Allow users to manage financial goals.

## Tasks



### Backend

- [x] Goal CRUD — list, create, read, update, delete endpoints scoped to the authenticated user
- [x] Goal progress calculation — deterministic `calculate_goal_progress` (progress %, remaining, months left, monthly contribution, months to complete, on track) reusing the Financial Engine
- [x] Check-in model — `CheckIn` ORM model (amount spent, notes, created_at)
- [x] Check-in API — create, list, and latest check-in endpoints
- [x] Alembic migration — `goals.updated_at` + `checkins` table



### Frontend

- [x] Goal creation — dialog form with validation
- [x] Goal editing — same dialog pre-filled for an existing goal
- [x] Goal deletion — confirmation dialog
- [x] Goal detail page — `/goals/[id]` with progress, deadline, and goal-pace breakdown
- [x] Goals list page — `/goals` with cards, empty state, and new-goal action
- [x] Weekly reminder UI — dashboard check-in card + dialog, "checked in this week" state



### Weekly Check-ins

- [x] Check-in model
- [x] Check-in API
- [x] Weekly reminder UI



## Verification

- [x] Goals persist — create/update/delete verified end-to-end against PostgreSQL
- [x] Progress updates correctly — `current_amount` changes reflected in progress %
- [x] Backend tests passing (40)
- [x] Ruff passes
- [x] Frontend lint + build pass



## Completion Criteria

Goal management is complete.

---



# Phase 7 — AI

Status: Not Started

## Objective

Integrate Gemini while keeping business logic deterministic.

## Tasks



### AI Provider

- [ ] Gemini provider
- [ ] Provider abstraction
- [ ] Prompt templates



### Features

- [ ] Purchase advice
- [ ] Weekly summary
- [ ] What-if simulator
- [ ] Goal explanations



### Safety

- [ ] Error handling
- [ ] Rate limiting
- [ ] Prompt validation



## Verification

- [ ] AI responses generated
- [ ] Costs monitored
- [ ] Graceful failure



## Completion Criteria

AI explains financial decisions without replacing deterministic calculations.

---



# Phase 8 — UI Polish

Status: Not Started

## Objective

Transform MVP into a polished product.

## Tasks



### Design

- [ ] Liquid Glass UI
- [ ] Animations
- [ ] Motion
- [ ] Responsive layouts
- [ ] Loading states
- [ ] Empty states
- [ ] Error states



### UX

- [ ] Accessibility
- [ ] Keyboard navigation
- [ ] Mobile responsiveness



## Verification

- [ ] Lighthouse audit
- [ ] Responsive testing



## Completion Criteria

Application feels production quality.

---



# Phase 9 — Production

Status: Not Started

## Objective

Deploy Nori.

## Tasks



### Backend

- [ ] Dockerize FastAPI
- [ ] Production settings
- [ ] Logging
- [ ] Monitoring



### Frontend

- [ ] Deploy to Vercel



### Database

- [ ] Migrate to Neon/Supabase



### CI/CD

- [ ] GitHub Actions
- [ ] Automated linting
- [ ] Automated tests



## Verification

- [ ] Production deployment works
- [ ] HTTPS enabled
- [ ] Environment variables configured



## Completion Criteria

Nori is publicly accessible.

---



# Phase 10 — Version 2

Status: Not Started

## Objective

Expand beyond MVP.

## Features

- [ ] Mobile app
- [ ] Notifications
- [ ] Investment tracking
- [ ] Subscription detection
- [ ] Spending insights
- [ ] Multi-provider AI
- [ ] OpenAI support
- [ ] Claude support
- [ ] Financial reports
- [ ] CSV import
- [ ] Bank integrations
- [ ] Recurring transactions



## Completion Criteria

Nori evolves into a complete financial operating system.
