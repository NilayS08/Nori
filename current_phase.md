# Current Phase: Phase 6 — Goals

> Completed

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

## Verification

- [x] Goals persist — create/update/delete verified end-to-end against PostgreSQL
- [x] Progress updates correctly — `current_amount` changes reflected in progress %
- [x] Backend tests passing (40)
- [x] Ruff passes
- [x] Frontend lint + build pass

## Files to Create/Modify

| File                                            | Action                                   |
| ----------------------------------------------- | ---------------------------------------- |
| `backend/app/models/checkin.py`                 | Created — `CheckIn` ORM model            |
| `backend/app/models/goal.py`                    | Modified — added `updated_at`            |
| `backend/app/models/user.py`                    | Modified — `checkins` relationship       |
| `backend/app/engine/calculations.py`            | Modified — `months_until` helper         |
| `backend/app/schemas/goals.py`                  | Created — goal request/response schemas  |
| `backend/app/schemas/checkins.py`               | Created — check-in schemas               |
| `backend/app/services/goals.py`                 | Created — CRUD + progress calculation    |
| `backend/app/services/checkins.py`              | Created — check-in logic                 |
| `backend/app/api/v1/goals.py`                   | Created — `/goals` routes                |
| `backend/app/api/v1/checkins.py`                | Created — `/checkins` routes             |
| `backend/app/api/v1/router.py`                  | Modified — registered new routers        |
| `backend/alembic/versions/922e2a904748_*.py`    | Created — migration                      |
| `backend/tests/test_services/test_goals.py`     | Created — progress unit tests            |
| `frontend/types/goals.ts`                       | Created — goal types                     |
| `frontend/types/checkins.ts`                    | Created — check-in types                 |
| `frontend/services/goals.ts`                    | Created — goal API calls                 |
| `frontend/services/checkins.ts`                 | Created — check-in API calls             |
| `frontend/components/dashboard/Navbar.tsx`      | Modified — Dashboard/Goals nav links     |
| `frontend/components/goals/GoalFormDialog.tsx`  | Created — create/edit dialog             |
| `frontend/components/goals/DeleteGoalDialog.tsx`| Created — delete confirmation dialog     |
| `frontend/components/goals/GoalCard.tsx`        | Created — goal card                      |
| `frontend/app/goals/page.tsx`                   | Created — goals list page                |
| `frontend/app/goals/[id]/page.tsx`              | Created — goal detail page               |
| `frontend/components/checkins/CheckInDialog.tsx`| Created — weekly check-in dialog         |
| `frontend/components/checkins/CheckInReminder.tsx`| Created — dashboard reminder card      |
| `frontend/app/dashboard/page.tsx`               | Modified — added check-in reminder       |

## Next Session — Phase 7: AI

1. Gemini provider behind an `AIProvider` abstraction
2. Purchase advice, weekly summary, what-if simulator, goal explanations
3. Error handling, rate limiting, prompt validation
4. AI only explains — never calculates
