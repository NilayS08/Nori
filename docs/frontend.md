# Nori Frontend Specification

> This document defines the frontend architecture, design philosophy, coding standards, and development guidelines for Nori.
>
> The goal is to ensure that every feature added to the frontend remains consistent in design, architecture, and user experience.

---

# Project Overview

Nori is an AI-powered financial operating system.

The frontend should feel modern, premium, and calm.

Think:

- Apple
- Arc Browser
- Linear
- Notion

NOT

- Busy dashboards
- Banking websites
- Enterprise software

The experience should make users feel financially confident rather than overwhelmed.

---

# Current Backend Status

Completed:

- JWT Authentication
- Register API
- Login API
- Protected routes
- Password hashing
- PostgreSQL
- FastAPI
- SQLAlchemy

Current frontend objective:

Implement authentication and verify communication with the backend before beginning onboarding.

---

# Tech Stack

Framework

- Next.js (App Router)
- TypeScript

Styling

- TailwindCSS
- shadcn/ui

Animation

- Framer Motion

Forms

- React Hook Form
- Zod

Networking

- Axios

State

- React Query

Icons

- Lucide React

Theme

- next-themes

---

# Design Philosophy

Every screen should feel:

- clean
- spacious
- premium
- minimal

Avoid clutter.

Whitespace is a feature.

The dashboard should never feel stressful.

---

# UI Principles

Use:

- rounded corners
- subtle shadows
- generous spacing
- soft borders
- smooth transitions

Avoid:

- bright colors
- unnecessary gradients
- heavy borders
- excessive animations

Animations should be subtle.

---

# Color Philosophy

Primary accent:

Blue

Success:

Green

Warning:

Amber

Error:

Red

Backgrounds should remain mostly neutral.

Dark mode support should be included from the beginning.

---

# Folder Structure

```
app/

components/
    ui/
    auth/
    dashboard/
    onboarding/
    goals/
    ai/
    layout/

hooks/

lib/

services/

types/

styles/
```

Do not place business logic inside components.

---

# API Layer

All backend communication should happen through:

```
lib/api.ts
```

Never call axios directly inside components.

Create service modules.

Example:

```
services/auth.ts
services/user.ts
services/goals.ts
```

---

# Authentication Flow

Landing Page

↓

Register

↓

Login

↓

Receive JWT

↓

Store Token

↓

Redirect

↓

Protected Dashboard

If a JWT expires:

Redirect to Login.

---

# Token Storage

Store JWT using:

HTTP-only cookies (preferred)

If backend currently returns bearer tokens only, temporarily store in localStorage until refresh token support is implemented.

Keep token management isolated.

Never scatter token logic across components.

---

# Routing

Public

/

/login

/register

Protected

/dashboard

/settings

/goals

/ai

Future onboarding should be protected.

---

# Authentication Pages

Register page

Fields:

- Name
- Email
- Password
- Confirm Password

Validation:

React Hook Form

+

Zod

---

Login page

Fields:

- Email
- Password

Validation

Loading state

Error state

Success redirect

---

# Error Handling

Every API request should handle:

Loading

Success

Failure

Display friendly messages.

Never expose raw backend errors.

---

# Loading States

Every page should include:

Skeletons

or

Loading indicators

No blank pages.

---

# Component Rules

Prefer small components.

Avoid components over ~200 lines.

Extract reusable UI.

---

# Accessibility

Buttons

Labels

Keyboard navigation

Focus states

ARIA where appropriate

---

# Code Standards

Use TypeScript strictly.

Avoid "any".

Prefer interfaces for API responses.

Prefer composition over deeply nested components.

---

# File Naming

Components

PascalCase

```
LoginForm.tsx
```

Hooks

camelCase

```
useAuth.ts
```

Services

camelCase

```
auth.ts
```

Types

```
auth.ts
user.ts
```

---

# Current Milestone

Goal:

Verify JWT authentication works from the frontend.

Required pages:

- Login
- Register

Required functionality:

- Call backend
- Validate forms
- Display errors
- Store JWT
- Redirect after login

Dashboard can remain a placeholder.

---

# Future Milestones

Phase 3

Onboarding

↓

Phase 4

Financial Engine

↓

Phase 5

Dashboard

↓

Phase 6

Goals

↓

Phase 7

AI

Do not implement future phases unless requested.

---

# AI Agent Instructions

When implementing frontend features:

1. Reuse existing components whenever possible.
2. Follow shadcn/ui patterns.
3. Keep components small.
4. Use service modules for API calls.
5. Keep business logic outside UI components.
6. Never hardcode API URLs.
7. Read URLs from configuration.
8. Prefer readability over clever code.
9. Follow the existing project structure.
10. Ask before introducing new libraries.

Maintain a production-quality codebase at all times.
