import time
from datetime import UTC, datetime, timedelta

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.ai.prompts import (
    SYSTEM_INSTRUCTION,
    goal_explanation_prompt,
    purchase_advice_prompt,
    weekly_summary_prompt,
    what_if_prompt,
)
from app.ai.rate_limiter import SlidingWindowRateLimiter
from app.core.database import Base
from app.models.checkin import CheckIn
from app.models.user import User
from app.schemas.ai import PurchaseAdviceRequest, WhatIfRequest
from app.services.ai import (
    compute_weekly_stats,
    compute_what_if_diff,
    purchase_advice,
    run_what_if,
    start_of_week_utc,
    weekly_summary,
)


class FakeProvider:
    def __init__(self, text: str = "Here is some friendly advice.") -> None:
        self.text = text
        self.calls: list[tuple[str, str | None]] = []

    def generate(self, prompt: str, system_instruction: str | None = None) -> str:
        self.calls.append((prompt, system_instruction))
        return self.text


class RaisingProvider:
    def generate(self, prompt: str, system_instruction: str | None = None) -> str:
        raise RuntimeError("provider down")


@pytest.fixture
def db_session():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    TestingSession = sessionmaker(bind=engine)
    session = TestingSession()
    yield session
    session.close()


def _user() -> User:
    return User(
        id=1,
        email="ai@example.com",
        name="AI User",
        hashed_password="hash",
        monthly_income=100_000,
        monthly_expenses=40_000,
        current_savings=60_000,
        is_onboarded=True,
    )


class TestPrompts:
    def test_system_instruction_forbids_calculations(self):
        assert "never perform calculations" in SYSTEM_INSTRUCTION
        assert "never invent numbers" in SYSTEM_INSTRUCTION

    def test_purchase_prompt_embeds_numbers(self):
        prompt = purchase_advice_prompt(
            {"safe_to_spend": {"weekly": 7500.0}, "emergency_fund": {"funded": False}},
            5000.0,
            "phone",
        )
        assert "7500.0" in prompt
        assert "5,000.00" in prompt
        assert "phone" in prompt

    def test_weekly_prompt_embeds_stats(self):
        prompt = weekly_summary_prompt(
            {"total_spent": 2000.0, "weekly_budget": 5000.0, "over_budget": False}
        )
        assert "2000.0" in prompt
        assert "5000.0" in prompt

    def test_what_if_prompt_embeds_diff(self):
        prompt = what_if_prompt(
            {"safe_to_spend": {"weekly": 7500.0}},
            {"safe_to_spend": {"weekly": 8000.0}},
            {"confidence_score": {"change": 3.0}},
            "a monthly income increase of 10,000.00",
        )
        assert "3.0" in prompt
        assert "monthly income increase" in prompt

    def test_goal_prompt_embeds_goal(self):
        prompt = goal_explanation_prompt(
            {"title": "Trip", "progress_pct": 40.0, "on_track": True},
            {"confidence_score": 70.0},
        )
        assert "Trip" in prompt
        assert "40.0" in prompt


class TestRateLimiter:
    def test_allows_up_to_limit_then_blocks(self):
        limiter = SlidingWindowRateLimiter(max_requests=2, window_seconds=60)
        assert limiter.allow("u1") is True
        assert limiter.allow("u1") is True
        assert limiter.allow("u1") is False

    def test_keys_are_independent(self):
        limiter = SlidingWindowRateLimiter(max_requests=1, window_seconds=60)
        assert limiter.allow("u1") is True
        assert limiter.allow("u1") is False
        assert limiter.allow("u2") is True

    def test_window_expires(self):
        limiter = SlidingWindowRateLimiter(max_requests=1, window_seconds=0.05)
        assert limiter.allow("u1") is True
        assert limiter.allow("u1") is False
        time.sleep(0.06)
        assert limiter.allow("u1") is True

    def test_reset(self):
        limiter = SlidingWindowRateLimiter(max_requests=1, window_seconds=60)
        assert limiter.allow("u1") is True
        assert limiter.allow("u1") is False
        limiter.reset("u1")
        assert limiter.allow("u1") is True


class TestWeeklyStats:
    def test_empty_week(self):
        stats = compute_weekly_stats([], 5000.0)
        assert stats["checkins"] == 0
        assert stats["total_spent"] == 0
        assert stats["over_budget"] is False
        assert stats["average_per_day"] == 0

    def test_within_budget(self):
        checkins = [
            CheckIn(amount_spent=1000, notes="groceries", created_at=datetime.now(UTC)),
            CheckIn(amount_spent=2000, notes=None, created_at=datetime.now(UTC)),
        ]
        stats = compute_weekly_stats(checkins, 5000.0)
        assert stats["total_spent"] == 3000
        assert stats["checkins"] == 2
        assert stats["over_budget"] is False
        assert stats["notes_count"] == 1
        assert stats["vs_budget_pct"] == 60.0

    def test_over_budget(self):
        checkins = [CheckIn(amount_spent=6000, notes=None, created_at=datetime.now(UTC))]
        stats = compute_weekly_stats(checkins, 5000.0)
        assert stats["over_budget"] is True
        assert stats["vs_budget_pct"] == 120.0

    def test_start_of_week_is_monday(self):
        wednesday = datetime(2026, 8, 5, 14, 30, tzinfo=UTC)  # a Wednesday
        assert start_of_week_utc(wednesday) == datetime(2026, 8, 3, 0, 0, tzinfo=UTC)


class TestWhatIf:
    def test_income_increase_raises_safe_to_spend(self, db_session):
        user = _user()
        baseline, simulation = run_what_if(
            user,
            [],
            WhatIfRequest(scenario_type="increase_income", amount=20_000),
        )
        assert simulation.safe_to_spend.weekly > baseline.safe_to_spend.weekly

    def test_expense_increase_lowers_safe_to_spend(self, db_session):
        user = _user()
        baseline, simulation = run_what_if(
            user,
            [],
            WhatIfRequest(scenario_type="increase_expenses", amount=20_000),
        )
        assert simulation.safe_to_spend.weekly < baseline.safe_to_spend.weekly

    def test_diff_reports_changes(self, db_session):
        user = _user()
        baseline, simulation = run_what_if(
            user,
            [],
            WhatIfRequest(scenario_type="increase_income", amount=20_000),
        )
        diff = compute_what_if_diff(baseline, simulation)
        assert diff["safe_to_spend_weekly"]["change"] > 0
        assert diff["safe_to_spend_weekly"]["baseline"] == round(baseline.safe_to_spend.weekly, 2)


class TestPurchaseAdvice:
    def test_success_with_provider(self, db_session):
        user = _user()
        db_session.add(user)
        db_session.commit()
        provider = FakeProvider()
        result = purchase_advice(
            user,
            db_session,
            PurchaseAdviceRequest(amount=1000, description="shoes"),
            provider=provider,
        )
        assert result.advice == provider.text
        assert result.context["purchase"]["within_weekly_budget"] is True
        assert provider.calls and provider.calls[0][1] == SYSTEM_INSTRUCTION

    def test_graceful_failure(self, db_session):
        user = _user()
        db_session.add(user)
        db_session.commit()
        result = purchase_advice(
            user,
            db_session,
            PurchaseAdviceRequest(amount=1000, description="shoes"),
            provider=RaisingProvider(),
        )
        assert result.advice is None
        assert result.context["purchase"]["amount"] == 1000


class TestWeeklySummary:
    def test_only_current_week_checkins_counted(self, db_session):
        user = _user()
        db_session.add(user)
        db_session.flush()

        now = datetime.now(UTC)
        week_start = start_of_week_utc(now)
        db_session.add_all(
            [
                CheckIn(
                    user_id=user.id,
                    amount_spent=1500,
                    notes="week note",
                    created_at=week_start + timedelta(days=1),
                ),
                CheckIn(
                    user_id=user.id,
                    amount_spent=500,
                    notes=None,
                    created_at=week_start + timedelta(days=2),
                ),
                CheckIn(
                    user_id=user.id,
                    amount_spent=9999,
                    notes="old",
                    created_at=week_start - timedelta(days=1),
                ),
            ]
        )
        db_session.commit()

        provider = FakeProvider()
        result = weekly_summary(user, db_session, provider=provider)
        assert result.stats["checkins"] == 2
        assert result.stats["total_spent"] == 2000
        assert result.stats["notes_count"] == 1
        assert result.summary == provider.text
