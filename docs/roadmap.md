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

Status: Not Started

## Objective

Collect the minimum information required to power the Financial Engine.

## Tasks



### Database

- [ ] Extend User model
- [ ] Create Goal model
- [ ] Generate migration



### Backend

- [ ] Onboarding service
- [ ] Validation
- [ ] CRUD endpoints



### Frontend

- [ ] Multi-step onboarding
- [ ] Form validation
- [ ] Progress indicator



### Data Collection

- [ ] User type
- [ ] Monthly income
- [ ] Monthly expenses
- [ ] Current savings
- [ ] Savings goal



## Verification

- [ ] User completes onboarding
- [ ] Data stored correctly
- [ ] User redirected to dashboard



## Completion Criteria

A new user can complete onboarding and reach the dashboard.

---



# Phase 4 — Financial Engine

Status: Not Started

## Objective

Implement all deterministic financial calculations.

## Tasks



### Core Engine

- [ ] Disposable income calculation
- [ ] Safe To Spend calculation
- [ ] Savings allocation
- [ ] Emergency fund calculation
- [ ] Goal projection



### Scoring

- [ ] Financial Confidence Score
- [ ] Budget health score



### Services

- [ ] FinancialEngine class
- [ ] Unit tests



## Verification

- [ ] Calculations verified
- [ ] Unit tests passing



## Completion Criteria

All financial calculations are deterministic and tested.

---



# Phase 5 — Dashboard

Status: Not Started

## Objective

Display all financial information.

## Tasks



### Backend

- [ ] Dashboard endpoint
- [ ] Summary endpoint



### Frontend

- [ ] Dashboard layout
- [ ] Hero card
- [ ] Safe To Spend card
- [ ] Goal cards
- [ ] Confidence Score
- [ ] Timeline
- [ ] Charts



## Verification

- [ ] Dashboard loads
- [ ] Correct data displayed



## Completion Criteria

Dashboard is the primary landing page.

---



# Phase 6 — Goals

Status: Not Started

## Objective

Allow users to manage financial goals.

## Tasks



### Backend

- [ ] Goal CRUD
- [ ] Goal progress calculation



### Frontend

- [ ] Goal creation
- [ ] Goal editing
- [ ] Goal deletion
- [ ] Goal detail page



### Weekly Check-ins

- [ ] Check-in model
- [ ] Check-in API
- [ ] Weekly reminder UI



## Verification

- [ ] Goals persist
- [ ] Progress updates correctly



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
