# Current Phase: Phase 8 — UI Polish

> In Progress — dashboard redesign landed

## Objective

Transform MVP into a polished product, starting with a full dashboard redesign to the Figma spec.

## Tasks

### Dashboard Redesign

- [x] Design system — `#060608` palette, Inter/DM Sans/JetBrains Mono (self-hosted via `next/font`), glass utilities (`.glass`, `.glass-sm`, `.glass-nav`), gradient text, pulse dots, animated orbs
- [x] Floating glass pill navbar — shared across dashboard + goals pages (avatar initials, search/notifications, sign out)
- [x] Safe-to-spend hero — live balance badge, gradient INR amount, resets-in countdown, weekly figure
- [x] Quick stats — avg daily spend vs budget, savings rate, days to nearest goal (all real data)
- [x] Weekly spending chart — last 7 check-in weeks, current-week highlight, budget insight strip
- [x] Savings goals card — progress rings + bars from real `goal_projections`, "View all" → /goals
- [x] Budget health card — real score, expense/savings ratios, month label
- [x] Financial confidence card — gradient ring + sub-score tags from real data
- [x] Weekly check-in card — real check-in status, amount + notes, check-in dialog
- [x] "Ask Nori" assistant panel — wired to existing AI features (purchase advice, what-if, weekly summary, goal review); suggestion chips + quick actions open the real dialogs; free-text matches intent
- [x] Removed old dashboard cards (HeroCard, SafeToSpendCard, EmergencyFundCard, GoalCard, ConfidenceScoreCard) and old AI summary cards
- [x] `redesign/` mockup excluded from lint + type-check (it's a standalone Vite reference)

## Verification

- [x] Frontend lint passes
- [x] Frontend build + type-check pass
- [x] All routes return 200 in dev
- [x] Served CSS contains new fonts, glass utilities, keyframes, and `#060608` background

## Next Steps

1. Responsive layouts + mobile pass
2. Loading/empty/error state polish
3. Accessibility and keyboard navigation
