from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

WhatIfScenarioType = Literal[
    "increase_income",
    "increase_expenses",
    "one_time_purchase",
    "one_time_gain",
]


class PurchaseAdviceRequest(BaseModel):
    amount: float = Field(gt=0, le=10_000_000)
    description: str | None = Field(default=None, max_length=500)


class PurchaseAdviceResponse(BaseModel):
    amount: float
    description: str | None
    context: dict
    advice: str | None


class WeeklySummaryResponse(BaseModel):
    period: str
    stats: dict
    summary: str | None


class WhatIfRequest(BaseModel):
    scenario_type: WhatIfScenarioType
    amount: float = Field(gt=0, le=100_000_000)
    description: str | None = Field(default=None, max_length=500)


class WhatIfResponse(BaseModel):
    scenario_type: str
    amount: float
    description: str | None
    baseline: dict
    simulation: dict
    diff: dict
    recommendation: str | None


class GoalExplanationResponse(BaseModel):
    goal: dict
    context: dict
    explanation: str | None
