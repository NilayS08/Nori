# Current Phase: Phase 7 — AI

> Completed

## Objective

Integrate Gemini while keeping business logic deterministic.

## Tasks

### AI Provider

- [x] Gemini provider
- [x] Provider abstraction
- [x] Prompt templates

### Features

- [x] Purchase advice
- [x] Weekly summary
- [x] What-if simulator
- [x] Goal explanations

### Safety

- [x] Error handling
- [x] Rate limiting
- [x] Prompt validation

## Verification

- [x] AI responses generated — all four features verified end-to-end against Gemini
- [x] Costs monitored — per-user rate limit (10/min default), weekly summary cached on the client
- [x] Graceful failure — provider errors return 200 with deterministic numbers and `null` AI field
- [x] Backend tests passing (59)
- [x] Ruff passes
- [x] Frontend lint + build pass

## Files to Create/Modify

| File                                               | Action                                   |
| -------------------------------------------------- | ---------------------------------------- |
| `backend/app/ai/base.py`                           | Created — `AIProvider` protocol          |
| `backend/app/ai/gemini.py`                         | Created — Gemini provider                |
| `backend/app/ai/factory.py`                        | Created — provider selection             |
| `backend/app/ai/prompts.py`                        | Created — templates + system instruction |
| `backend/app/ai/rate_limiter.py`                   | Created — sliding-window limiter         |
| `backend/app/schemas/ai.py`                        | Created — AI request/response schemas    |
| `backend/app/services/ai.py`                       | Created — deterministic context + AI     |
| `backend/app/api/v1/ai.py`                         | Created — `/ai` routes                   |
| `backend/app/api/v1/router.py`                     | Modified — registered AI router          |
| `backend/app/core/config.py`                       | Modified — `gemini_model`, rate limit    |
| `backend/tests/test_services/test_ai.py`           | Created — AI unit tests (19)             |
| `frontend/types/ai.ts`                             | Created — AI types                       |
| `frontend/services/ai.ts`                          | Created — AI API calls                   |
| `frontend/components/ai/WeeklyInsightCard.tsx`     | Created — dashboard weekly summary       |
| `frontend/components/ai/PurchaseAdviceCard.tsx`    | Created — dashboard purchase advice      |
| `frontend/components/ai/PurchaseAdviceDialog.tsx`  | Created — purchase advice flow           |
| `frontend/components/ai/WhatIfCard.tsx`            | Created — dashboard what-if              |
| `frontend/components/ai/WhatIfDialog.tsx`          | Created — scenario simulation flow       |
| `frontend/components/ai/GoalInsightCard.tsx`       | Created — goal explanation card          |
| `frontend/app/dashboard/page.tsx`                  | Modified — Insights section              |
| `frontend/app/goals/[id]/page.tsx`                 | Modified — "Nori's take" card            |

## Next Session — Phase 8: UI Polish

1. Liquid Glass UI refinement
2. Animations and motion
3. Responsive layouts, loading/empty/error states
4. Accessibility and keyboard navigation
