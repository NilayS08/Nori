# Current Phase: Phase 3 — User Onboarding ✅

> Started: 2026-07-30

## Objective

Collect the minimum information required to power the Financial Engine.

## Progress

### Database ✅ (Completed)

- [x] Extend User model — added `is_onboarded` field
- [x] Create Goal model — `backend/app/models/goal.py`
- [x] Generate migration — `c955163ed14a_add_is_onboarded_to_users_and_create_goals`
- [x] Apply migration (`goals` table created, `is_onboarded` column added)

### Backend ✅ (Completed)

- [x] Onboarding service — `backend/app/services/onboarding.py`
- [x] Validation — Pydantic schemas in `backend/app/schemas/onboarding.py`
- [x] CRUD endpoints — `POST /api/v1/onboarding`, `GET /api/v1/onboarding`, `PUT /api/v1/onboarding`

### Frontend ✅ (Completed)

- [x] Multi-step onboarding — 2 steps (personal finances + savings goal)
- [x] Form validation — React Hook Form + Zod
- [x] Progress indicator — `StepIndicator` component

### Data Collection ✅ (Completed)

- [x] User type (dropdown: personal, professional, freelancer, student)
- [x] Monthly income
- [x] Monthly expenses
- [x] Current savings
- [x] Savings goal (title, target amount, deadline)

## Verification Results

- [x] User completes onboarding — POST /onboarding returns 200 with data
- [x] Data stored correctly — user fields + goal saved to DB
- [x] User redirected to dashboard — after onboarding, redirect to /dashboard
- [x] Ruff passes
- [x] Frontend builds clean

## Files Created/Modified

| File | Action |
|---|---|
| `backend/app/models/goal.py` | Created |
| `backend/app/models/user.py` | Modified (is_onboarded + goals relationship) |
| `backend/app/models/__init__.py` | Modified (added Goal) |
| `backend/alembic/versions/c955163ed14a_*.py` | Created |
| `backend/app/schemas/onboarding.py` | Created |
| `backend/app/schemas/auth.py` | Modified (is_onboarded in UserResponse) |
| `backend/app/schemas/__init__.py` | Modified |
| `backend/app/services/__init__.py` | Created |
| `backend/app/services/onboarding.py` | Created |
| `backend/app/api/v1/onboarding.py` | Created |
| `backend/app/api/v1/router.py` | Modified (added onboarding router) |
| `frontend/types/onboarding.ts` | Created |
| `frontend/services/onboarding.ts` | Created |
| `frontend/components/onboarding/StepIndicator.tsx` | Created |
| `frontend/components/onboarding/StepPersonal.tsx` | Created |
| `frontend/components/onboarding/StepGoal.tsx` | Created |
| `frontend/app/onboarding/page.tsx` | Created |
| `frontend/app/dashboard/page.tsx` | Modified (onboarding check + redirect) |
| `frontend/types/auth.ts` | Modified (added is_onboarded) |

## Routes

### Backend

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/onboarding` | Complete onboarding (user data + goal) |
| GET | `/api/v1/onboarding` | Get onboarding data and status |
| PUT | `/api/v1/onboarding` | Update onboarding data |

### Frontend

| Route | Description |
|---|---|
| `/onboarding` | Multi-step onboarding flow |
| `/dashboard` | Placeholder dashboard (redirects to /onboarding if not onboarded) |

## Next Session — Phase 4: Financial Engine

1. Implement FinancialEngine class in `backend/app/engine/`
2. Calculate disposable income
3. Calculate Safe To Spend
4. Savings allocation
5. Emergency fund calculation
6. Goal projection
7. Financial Confidence Score
8. Unit tests
