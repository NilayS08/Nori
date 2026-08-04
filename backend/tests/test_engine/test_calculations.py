from app.engine.calculations import (
    calculate_disposable_income,
    calculate_emergency_fund,
    calculate_goal_projection,
    calculate_safe_to_spend,
    calculate_savings_allocation,
)
from app.engine.schemas import FinancialInput, GoalInput


class TestDisposableIncome:
    def test_basic(self):
        fin = FinancialInput(monthly_income=5000, monthly_expenses=2000, current_savings=10000)
        result = calculate_disposable_income(fin)
        assert result.monthly_disposable == 3000
        assert result.weekly_disposable == 750

    def test_zero_income(self):
        fin = FinancialInput(monthly_income=0, monthly_expenses=2000, current_savings=10000)
        result = calculate_disposable_income(fin)
        assert result.monthly_disposable == 0
        assert result.weekly_disposable == 0

    def test_expenses_exceed_income(self):
        fin = FinancialInput(monthly_income=3000, monthly_expenses=4000, current_savings=5000)
        result = calculate_disposable_income(fin)
        assert result.monthly_disposable == 0

    def test_equal_income_expenses(self):
        fin = FinancialInput(monthly_income=4000, monthly_expenses=4000, current_savings=0)
        result = calculate_disposable_income(fin)
        assert result.monthly_disposable == 0


class TestEmergencyFund:
    def test_not_funded(self):
        fin = FinancialInput(monthly_income=5000, monthly_expenses=2000, current_savings=5000)
        result = calculate_emergency_fund(fin)
        assert result.target_amount == 12000
        assert result.is_funded is False
        assert result.progress_pct < 100

    def test_funded(self):
        fin = FinancialInput(monthly_income=5000, monthly_expenses=2000, current_savings=15000)
        result = calculate_emergency_fund(fin)
        assert result.is_funded is True
        assert result.progress_pct == 100
        assert result.monthly_contribution_needed == 0

    def test_zero_expenses(self):
        fin = FinancialInput(monthly_income=5000, monthly_expenses=0, current_savings=0)
        result = calculate_emergency_fund(fin)
        assert result.target_amount == 0
        assert result.is_funded is True

    def test_custom_months_target(self):
        fin = FinancialInput(monthly_income=5000, monthly_expenses=2000, current_savings=2000)
        result = calculate_emergency_fund(fin, months_target=3)
        assert result.target_amount == 6000


class TestGoalProjection:
    def test_on_track(self):
        goal = GoalInput(
            title="Trip", target_amount=3600, current_amount=0, months_until_deadline=12
        )
        result = calculate_goal_projection(goal, monthly_contribution=300)
        assert result.months_to_complete == 12
        assert result.on_track is True

    def test_behind(self):
        goal = GoalInput(
            title="Trip", target_amount=12000, current_amount=0, months_until_deadline=6
        )
        result = calculate_goal_projection(goal, monthly_contribution=500)
        assert result.months_to_complete == 24
        assert result.on_track is False

    def test_already_completed(self):
        goal = GoalInput(
            title="Trip", target_amount=1000, current_amount=1000, months_until_deadline=12
        )
        result = calculate_goal_projection(goal, monthly_contribution=100)
        assert result.months_to_complete == 0
        assert result.on_track is True

    def test_zero_contribution(self):
        goal = GoalInput(
            title="Trip", target_amount=5000, current_amount=0, months_until_deadline=12
        )
        result = calculate_goal_projection(goal, monthly_contribution=0)
        assert result.months_to_complete == 999
        assert result.on_track is False


class TestSavingsAllocation:
    def test_emergency_fund_priority(self):
        fin = FinancialInput(monthly_income=5000, monthly_expenses=2000, current_savings=0)
        result = calculate_savings_allocation(fin, goal_contributions_total=500)
        assert result.emergency_fund_contribution > 0
        assert result.total_savings > 0

    def test_no_emergency_needed(self):
        fin = FinancialInput(monthly_income=5000, monthly_expenses=2000, current_savings=15000)
        result = calculate_savings_allocation(fin, goal_contributions_total=500)
        assert result.emergency_fund_contribution == 0
        assert result.goal_contributions == 500

    def test_zero_disposable(self):
        fin = FinancialInput(monthly_income=2000, monthly_expenses=2000, current_savings=0)
        result = calculate_savings_allocation(fin, goal_contributions_total=500)
        assert result.total_savings == 0
        assert result.remaining_disposable == 0


class TestSafeToSpend:
    def test_basic(self):
        fin = FinancialInput(monthly_income=5000, monthly_expenses=2000, current_savings=10000)
        from app.engine.schemas import SavingsAllocationResult

        allocation = SavingsAllocationResult(
            emergency_fund_contribution=0,
            goal_contributions=500,
            total_savings=500,
            remaining_disposable=2500,
        )
        result = calculate_safe_to_spend(fin, allocation)
        assert result.monthly == 2500
        assert result.weekly == 625
        assert result.daily > 83

    def test_zero_remaining(self):
        from app.engine.schemas import SavingsAllocationResult

        allocation = SavingsAllocationResult(
            emergency_fund_contribution=1500,
            goal_contributions=1500,
            total_savings=3000,
            remaining_disposable=0,
        )
        result = calculate_safe_to_spend(
            FinancialInput(monthly_income=5000, monthly_expenses=2000, current_savings=0),
            allocation,
        )
        assert result.monthly == 0
        assert result.weekly == 0
