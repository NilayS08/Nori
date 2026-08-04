# Nori UI Vision

> Version 1.0
>
> This document defines the visual identity of Nori.
>
> Every screen should follow these principles.
>
> If a new feature doesn't match this document, redesign the feature—not the design language.

---

# Design Philosophy

Nori is **not** a budgeting app.

It is a **financial confidence platform**.

Users should feel:

- Calm
- In control
- Motivated
- Safe

Never anxious.

Avoid making the dashboard feel like a banking website.

Instead, it should feel closer to:

- Apple
- Linear
- Arc Browser
- Raycast
- Notion
- Stripe Dashboard

I think we should build the entire UI around one emotional principle:
- Every screen should answer a question instead of showing data.

For Example:
- Hero → "How much can I spend today?"
- Goals → "Am I on track?"
- Budget Health → "Am I doing okay?"
- AI Insight → "What's the one thing I should know this week?"

---

# Keywords

Minimal

Premium

Elegant

Confident

Spacious

Modern

Glass

Motion

---

# Design Language

Use:

✓ Rounded corners (16-24px)

✓ Large typography

✓ Soft shadows

✓ Plenty of whitespace

✓ Minimal borders

✓ Smooth animations

✓ Glassmorphism

Avoid:

✗ Bright colors everywhere

✗ Heavy gradients

✗ Sharp edges

✗ Dense dashboards

✗ Overloaded cards

---

# Color System

Background

Dark

```
#09090B
```

Surface

```
#141416
```

Glass Card

```
rgba(255,255,255,0.05)
```

Border

```
rgba(255,255,255,0.08)
```

Primary Accent

Indigo

```
#6366F1
```

Secondary Accent

Blue

```
#3B82F6
```

Success

Emerald

```
#10B981
```

Warning

Amber

```
#F59E0B
```

Danger

Rose

```
#EF4444
```

Text

Primary

```
#FAFAFA
```

Secondary

```
#A1A1AA
```

Muted

```
#71717A
```

---

# Financial Colors

Positive

Emerald

Savings

Indigo

Goals

Blue

Warnings

Amber

Errors

Rose

Never use red unless something is actually wrong.

---

# Glass Effect

Every important card should have

```
background:
rgba(255,255,255,0.04)

backdrop-blur:
20px

border:
1px solid rgba(255,255,255,0.08)
```

Cards should almost disappear into the background.

---

# Shadows

Never use heavy shadows.

Preferred

```
0 8px 30px rgba(0,0,0,.25)
```

---

# Border Radius

Cards

20px

Buttons

14px

Inputs

14px

Badges

999px

---

# Typography

Use large typography.

Hero number

64px

Card title

18px

Section heading

28px

Body

15px

Caption

13px

Important numbers should always be larger than labels.

---

# Icons

Use Lucide.

Every card should have an icon.

Examples

Wallet

Trending Up

Shield

Target

Sparkles

Piggy Bank

Calendar

Coins

---

# Animations

Everything should animate.

Cards

fade + slide

Duration

300ms

Hover

scale(1.02)

Buttons

200ms

Progress bars

Animate width

Numbers

Count up animation

Never animate excessively.

---

# Hero Section

Current

```
Safe To Spend

$0
```

Desired

```
──────────────────────────────

Good Evening, Nilay

You can safely spend

₹4,860

this week

≈ ₹695/day

without affecting your goals.

──────────────────────────────
```

This should be the most visually dominant element.

---

# Dashboard Layout

Navbar

↓

Hero Card

↓

Financial Summary (3 cards)

↓

Goals

↓

AI Insight

↓

History

Never put Goals above the Hero.

---

# Card Hierarchy

Largest

Safe To Spend

Medium

Emergency Fund

Goals

Confidence

Small

Budget Health

Insights

Recent Activity

---

# Empty States

Never display

```
$0
```

Instead show

```
Complete onboarding to calculate your Safe To Spend amount.
```

or

```
No goals yet.

Create your first goal.
```

Every empty state should guide the user.

---

# Progress Bars

Rounded

Animated

Gradient

```
Indigo → Blue
```

Progress bars should feel alive.

---

# Goal Cards

Instead of

```
Saved

Target

Progress
```

Display

```
Emergency Fund

72%

████████░░░░

₹72,000

of ₹100,000

4 months left
```

---

# AI Cards

AI should never feel like ChatGPT.

Instead

```
Weekly Insight

You spent 18% less than last week.

You're on track to hit your savings goal 2 weeks earlier.

View Details →
```

Small.

Actionable.

Friendly.

---

# Navbar

Current

Logo

Name

Logout

Future

Logo

Dashboard

Goals

Insights

Settings

Notifications

Avatar

No large navigation.

---

# Motion

Framer Motion everywhere.

Page transitions

Card fade

Hover

Loading skeletons

Count-up animations

Progress animation

---

# Mobile

Desktop first

Tablet second

Mobile third

Every component should collapse naturally.

---

# Accessibility

Visible focus states

Keyboard navigation

Proper labels

High contrast

Screen reader friendly

---

# Overall Goal

The first reaction from a user should be

"This doesn't feel like a finance app."

It should feel like a premium productivity tool that happens to manage money.
