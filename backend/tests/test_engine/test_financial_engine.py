from app.engine.financial_engine import FinancialEngine


class TestFinancialEngine:
    def test_basic_run_no_goals(self):
        engine = FinancialEngine(
            monthly_income=5000,
            monthly_expenses=2000,
            current_savings=10000,
        )
        result = engine.run()
        assert result.disposable.monthly_disposable == 3000
        assert result.safe_to_spend.monthly > 0
        assert result.emergency_fund.target_amount == 12000
        assert result.goal_projections == []

    def test_with_goals(self):
        engine = FinancialEngine(
            monthly_income=5000,
            monthly_expenses=2000,
            current_savings=10000,
            goals=[
                {
                    "title": "Emergency Fund Top-up",
                    "target_amount": 12000,
                    "current_amount": 10000,
                    "months_until_deadline": 6,
                },
            ],
        )
        result = engine.run()
        assert len(result.goal_projections) == 1
        assert result.goal_projections[0].title == "Emergency Fund Top-up"

    def test_zero_income(self):
        engine = FinancialEngine(
            monthly_income=0,
            monthly_expenses=1000,
            current_savings=0,
        )
        result = engine.run()
        assert result.disposable.monthly_disposable == 0
        assert result.safe_to_spend.monthly == 0
        assert result.confidence.overall == 0.0

    def test_high_savings_rate(self):
        engine = FinancialEngine(
            monthly_income=10000,
            monthly_expenses=2000,
            current_savings=50000,
        )
        result = engine.run()
        assert result.confidence.savings_rate == 80.0
        assert result.budget_health.label == "Excellent"

    def test_multiple_goals(self):
        engine = FinancialEngine(
            monthly_income=6000,
            monthly_expenses=3000,
            current_savings=8000,
            goals=[
                {
                    "title": "Trip",
                    "target_amount": 3000,
                    "current_amount": 1000,
                    "months_until_deadline": 6,
                },
                {
                    "title": "Laptop",
                    "target_amount": 2000,
                    "current_amount": 500,
                    "months_until_deadline": 4,
                },
            ],
        )
        result = engine.run()
        assert len(result.goal_projections) == 2
        assert result.savings_allocation.total_savings > 0

    def test_engine_returns_all_fields(self):
        engine = FinancialEngine(monthly_income=4000, monthly_expenses=1500, current_savings=5000)
        result = engine.run()
        assert hasattr(result, "disposable")
        assert hasattr(result, "safe_to_spend")
        assert hasattr(result, "savings_allocation")
        assert hasattr(result, "emergency_fund")
        assert hasattr(result, "goal_projections")
        assert hasattr(result, "confidence")
        assert hasattr(result, "budget_health")
