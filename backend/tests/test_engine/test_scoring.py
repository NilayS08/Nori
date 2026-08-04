from app.engine.schemas import EmergencyFundResult, FinancialInput, GoalProjectionResult
from app.engine.scoring import calculate_budget_health, calculate_confidence_score


class TestConfidenceScore:
    def _make_emergency(self, progress: float) -> EmergencyFundResult:
        return EmergencyFundResult(
            target_amount=12000,
            current_amount=12000 * progress / 100,
            progress_pct=progress,
            is_funded=progress >= 100,
            monthly_contribution_needed=0 if progress >= 100 else 200,
            months_to_fund=0 if progress >= 100 else 10,
        )

    def test_high_score(self):
        fin = FinancialInput(monthly_income=5000, monthly_expenses=1500, current_savings=15000)
        ef = self._make_emergency(100)
        goals = [GoalProjectionResult("A", 3000, 3000, 250, 0, True)]
        result = calculate_confidence_score(fin, ef, goals)
        assert result.overall >= 80

    def test_low_score(self):
        fin = FinancialInput(monthly_income=3000, monthly_expenses=2900, current_savings=0)
        ef = self._make_emergency(0)
        goals = [GoalProjectionResult("A", 10000, 0, 100, 100, False)]
        result = calculate_confidence_score(fin, ef, goals)
        assert result.overall < 30

    def test_no_goals(self):
        fin = FinancialInput(monthly_income=5000, monthly_expenses=2000, current_savings=10000)
        ef = self._make_emergency(80)
        result = calculate_confidence_score(fin, ef, [])
        assert result.goal_progress_score == 0.0

    def test_goal_progress_is_savings_not_on_track(self):
        fin = FinancialInput(monthly_income=5000, monthly_expenses=2000, current_savings=10000)
        ef = self._make_emergency(80)
        goals = [GoalProjectionResult("Trip", 12000, 0, 500, 12, True)]
        result = calculate_confidence_score(fin, ef, goals)
        assert result.goal_progress_score == 0.0

    def test_goal_progress_partial_savings(self):
        fin = FinancialInput(monthly_income=5000, monthly_expenses=2000, current_savings=10000)
        ef = self._make_emergency(80)
        goals = [GoalProjectionResult("Trip", 10000, 5000, 500, 12, True)]
        result = calculate_confidence_score(fin, ef, goals)
        assert result.goal_progress_score == 50.0

    def test_savings_rate_zero(self):
        fin = FinancialInput(monthly_income=0, monthly_expenses=0, current_savings=0)
        ef = self._make_emergency(0)
        result = calculate_confidence_score(fin, ef, [])
        assert result.savings_rate == 0


class TestBudgetHealth:
    def test_excellent(self):
        fin = FinancialInput(monthly_income=5000, monthly_expenses=2000, current_savings=10000)
        result = calculate_budget_health(fin)
        assert result.label == "Excellent"
        assert result.expense_ratio == 0.4

    def test_good(self):
        fin = FinancialInput(monthly_income=5000, monthly_expenses=3500, current_savings=5000)
        result = calculate_budget_health(fin)
        assert result.label == "Good"

    def test_fair(self):
        fin = FinancialInput(monthly_income=5000, monthly_expenses=4200, current_savings=2000)
        result = calculate_budget_health(fin)
        assert result.label == "Fair"

    def test_tight(self):
        fin = FinancialInput(monthly_income=5000, monthly_expenses=4800, current_savings=500)
        result = calculate_budget_health(fin)
        assert result.label == "Tight"

    def test_zero_income(self):
        fin = FinancialInput(monthly_income=0, monthly_expenses=0, current_savings=0)
        result = calculate_budget_health(fin)
        assert result.score == 0
        assert result.label == "No income"
