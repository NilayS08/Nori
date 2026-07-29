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

## Rules

- Never invent numbers.
- Never calculate.
- Explain tradeoffs.
- Friendly tone.
- No financial jargon.

---

## Implementation Notes

- AI prompts should access the provider through the AI Provider abstraction rather than directly instantiating Gemini clients.
- This keeps provider switching possible without prompt changes.
