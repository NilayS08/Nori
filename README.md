# Nori (Working Name)

> **Spend with confidence, not guilt.**

Nori is an AI-powered financial confidence platform that helps students and young professionals make smarter spending decisions without compromising their future goals.

Unlike traditional budgeting apps that focus on tracking past expenses, Nori focuses on helping users answer one simple question:

> **"Can I afford this?"**

---

## ✨ Features (MVP)

- 🔐 Secure Authentication
- 👤 Two-minute onboarding
- 💰 Safe to Spend dashboard
- 🎯 Financial goal tracking
- 📈 Financial Confidence Score
- 🤖 AI-powered purchase advice
- 📅 Weekly financial check-ins
- 📊 Personalized AI insights

---

## 🖥️ Tech Stack

### Frontend

- Next.js 16
- TypeScript
- TailwindCSS
- shadcn/ui
- React Hook Form
- TanStack Query
- Axios
- Framer Motion
- Lucide Icons

### Backend

- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- Docker
- Pydantic Settings
- JWT Authentication
- APScheduler

### AI

- Gemini API
- Provider Abstraction (planned)

### Infrastructure

- Docker Compose
- PostgreSQL 17

---

## 🏗️ Architecture

The project follows **Clean Architecture**.

```
Client
    │
    ▼
Next.js Frontend
    │
    ▼
FastAPI Backend
    │
    ├──────────────┐
    ▼              ▼
Financial Engine  AI Service
    │              │
    ▼              ▼
PostgreSQL      Gemini
```

The **Financial Engine** performs all deterministic calculations.

The AI layer only explains results in natural language.

---

## 📂 Project Structure

```
nori/

├── frontend/
├── backend/
├── docs/
└── README.md
```

---

## 🚀 Current Development Phase

Phase 1 (Project Foundation) is nearly complete.

Completed:

- Backend initialization (uv, FastAPI, dependencies)
- Frontend initialization (Next.js, TypeScript, TailwindCSS, shadcn/ui)
- Docker configuration (PostgreSQL 17)
- Environment variables (pydantic-settings)
- SQLAlchemy (Base, Engine, SessionLocal, get_db())
- Pre-commit hooks (Ruff)
- Documentation

Remaining:

- Alembic initialization
- Health endpoint
- Backend ↔ Frontend communication
- Initial Git commit

### Upcoming Phases

- Authentication
- Onboarding
- Financial Engine
- Dashboard
- Goals
- AI Assistant

---

## 🎯 Product Philosophy

Traditional finance apps ask:

> "Where did your money go?"

Nori asks:

> **"What should you do next?"**

The goal is to reduce financial anxiety by helping users make confident financial decisions rather than simply tracking expenses.

---

## 📌 Long-Term Vision

Nori aims to become an intelligent financial companion that helps users:

- Spend confidently
- Reach financial goals faster
- Understand financial trade-offs
- Build healthy financial habits
- Plan for the future with confidence

---

## 📚 Documentation

Additional documentation can be found in the `docs/` directory.

- Architecture
- Roadmap
- API Design
- Database Design
- Prompt Strategy
- Development Decisions

---

## ⚠️ Project Status

This project is currently under active development.

The MVP is being built incrementally using a 10-phase roadmap.

---

## 👨‍💻 Author

**Nilay Srivastava**

Computer Science Student | AI Engineering Enthusiast
