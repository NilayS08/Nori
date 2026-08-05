from __future__ import annotations

import json

SYSTEM_INSTRUCTION = (
    "You are Nori, a calm and friendly personal finance assistant.\n"
    "You never perform calculations and you never invent numbers.\n"
    "Every number in your answer must come from the data you are given.\n"
    "Explain tradeoffs in plain, jargon-free language.\n"
    "Keep answers short, warm, and actionable."
)

_TONE = (
    "Speak like a thoughtful friend who is good with money.\n"
    "Use plain language — no financial jargon.\n"
    "Do not use markdown, headings, or bullet symbols.\n"
    "Never tell the user to consult an advisor or cite external sources.\n"
)


def _format(data: dict) -> str:
    return json.dumps(data, indent=2, ensure_ascii=False)


def purchase_advice_prompt(context: dict, amount: float, description: str | None) -> str:
    return f"""The user wants to know if they can afford a purchase.
{_TONE}
Here are the numbers (already calculated — do not recompute them):
{_format(context)}

The user wants to spend {amount:,.2f} on "{description or "a purchase"}".

Explain:
- Whether this purchase is comfortable this week or would require dipping into savings.
- The tradeoff for their goals or emergency fund, based only on the numbers above.
- One practical suggestion.

Answer in 4-6 short sentences."""


def weekly_summary_prompt(stats: dict) -> str:
    return f"""Summarize the user's spending week.
{_TONE}
Here are the numbers (already calculated — do not recompute them):
{_format(stats)}

Explain how the week went compared to their safe-to-spend budget, and what
they can do next week. If they have not checked in yet, encourage them gently.

Answer in 3-5 short sentences."""


def what_if_prompt(baseline: dict, simulation: dict, diff: dict, description: str) -> str:
    return f"""The user wants to explore a what-if scenario.
{_TONE}
Baseline (current plan):
{_format(baseline)}

Simulated scenario ({description}):
{_format(simulation)}

What changed (already calculated):
{_format(diff)}

Explain:
- What the scenario means in plain terms.
- Whether it is affordable given their plan, based only on the numbers.
- The biggest tradeoff and a small next step.

Answer in 4-6 short sentences."""


def goal_explanation_prompt(goal: dict, context: dict) -> str:
    return f"""Explain a savings goal to the user.
{_TONE}
Goal numbers (already calculated):
{_format(goal)}

Their overall situation:
{_format(context)}

Explain:
- Whether they are on track and why.
- What the monthly contribution number means for their everyday budget.
- One encouraging next step.

Answer in 3-5 short sentences."""
