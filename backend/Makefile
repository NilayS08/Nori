dev-backend:
	uv run uvicorn app.main:app --reload

dev-frontend:
	cd frontend && npm run dev

db-up:
	docker compose up -d

db-down:
	docker compose down

lint:
	uv run ruff check .

format:
	uv run ruff format .

test:
	uv run pytest
