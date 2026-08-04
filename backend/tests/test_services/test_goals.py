from datetime import date, timedelta

from dateutil.relativedelta import relativedelta

from app.engine.calculations import months_until
from app.models.goal import Goal
from app.services.goals import calculate_goal_progress


def _future_date(months: int) -> date:
    return date.today() + relativedelta(months=months)


class TestMonthsUntil:
    def test_counts_full_months(self):
        assert months_until(date(2026, 12, 31), start=date(2026, 6, 15)) == 6

    def test_minimum_is_one(self):
        assert months_until(date(2026, 1, 5), start=date(2026, 6, 15)) == 1


class TestGoalProgress:
    def test_partial_progress(self):
        goal = Goal(
            id=1,
            user_id=1,
            title="Trip",
            target_amount=10000,
            current_amount=4000,
            deadline=_future_date(6),
        )
        progress = calculate_goal_progress(goal)
        assert progress["progress_pct"] == 40.0
        assert progress["remaining"] == 6000
        assert progress["months_until_deadline"] == 6
        assert progress["monthly_contribution"] == 1000
        assert progress["months_to_complete"] == 6
        assert progress["on_track"] is True

    def test_completed_goal(self):
        goal = Goal(
            id=2,
            user_id=1,
            title="Laptop",
            target_amount=5000,
            current_amount=5000,
            deadline=_future_date(3),
        )
        progress = calculate_goal_progress(goal)
        assert progress["progress_pct"] == 100.0
        assert progress["remaining"] == 0
        assert progress["monthly_contribution"] == 0
        assert progress["months_to_complete"] == 0
        assert progress["on_track"] is True

    def test_zero_progress(self):
        goal = Goal(
            id=3,
            user_id=1,
            title="New Goal",
            target_amount=12000,
            current_amount=0,
            deadline=_future_date(12),
        )
        progress = calculate_goal_progress(goal)
        assert progress["progress_pct"] == 0.0
        assert progress["remaining"] == 12000
        assert progress["monthly_contribution"] == 1000
        assert progress["months_to_complete"] == 12

    def test_deadline_within_current_month(self):
        goal = Goal(
            id=4,
            user_id=1,
            title="Soon",
            target_amount=1000,
            current_amount=250,
            deadline=date.today() + timedelta(days=20),
        )
        progress = calculate_goal_progress(goal)
        assert progress["months_until_deadline"] == 1
        assert progress["monthly_contribution"] == 750
