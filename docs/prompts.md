# Prompt Design

## Philosophy

The LLM never performs calculations.

The Financial Engine calculates.

The LLM explains.

---

## Purchase Advice

Input

Financial Engine JSON

↓

Gemini

↓

Friendly explanation

---

## Weekly Summary

Input

Weekly statistics

↓

Gemini

↓

Natural language summary

---

## What-if

Input

Scenario

Financial projection

↓

Gemini

↓

Recommendation

---

## Goal Explanations

Input

Goal progress JSON

Overall financial context

↓

Gemini

↓

Plain-language explanation

---

## Rules

- Never invent numbers.
- Never calculate.
- Explain tradeoffs.
- Friendly tone.
- No financial jargon.
- No markdown or bullet symbols in answers.

---

## Implementation Notes

- AI prompts should access the provider through the AI Provider abstraction rather than directly instantiating Gemini clients.
- This keeps provider switching possible without prompt changes.
- Templates live in `backend/app/ai/prompts.py`; the shared system instruction enforces the rules above.
- The LLM only ever receives numbers already computed by the Financial Engine. If the provider fails, endpoints still return the deterministic numbers with a `null` AI field.
