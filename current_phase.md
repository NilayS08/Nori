# Current Phase: Phase 5 — Dashboard

> Not Started

## Objective

Display all financial information.

## Tasks

### Backend

- [x] Dashboard endpoint — runs `FinancialEngine` for the authenticated user, returns full `EngineResult`
- [x] Summary endpoint — lightweight response with key numbers only

### Frontend

- [x] Dashboard layout — primary landing page after onboarding
- [x] Hero card — headline Safe To Spend + Financial Confidence Score
- [x] Safe To Spend card — weekly and daily breakdown
- [x] Goal cards — each goal with progress bar and months-to-complete
- [x] Confidence Score — overall score + breakdown (savings rate, emergency fund, goal progress)
- [x] Timeline — goal deadlines and milestones
- [x] Charts — spending trends, savings growth (placeholder or real)



## Verification

- [ ] Dashboard loads after login
- [ ] Correct data displayed for the authenticated user
- [ ] Engine runs on every dashboard load (real-time, deterministic)



## Files to Create/Modify


| File                                  | Action                                  |
| ------------------------------------- | --------------------------------------- |
| `backend/app/api/v1/dashboard.py`     | Created — dashboard + summary endpoints |
| `backend/app/api/v1/router.py`        | Modified — register dashboard router    |
| `backend/app/schemas/dashboard.py`    | Created — response schemas              |
| `frontend/app/dashboard/page.tsx`     | Modified — real dashboard UI            |
| `frontend/components/dashboard/*.tsx` | Created — card components               |
| `frontend/services/dashboard.ts`      | Created — API calls                     |




## Next Session — Phase 6: Goals + Weekly Check-ins

1. Goal CRUD endpoints
2. Goal creation / editing / deletion UI
3. Weekly Check-in model, API, and reminder UI
