# TESTING.md — Testing & QA Policy

## Purpose

This file has two jobs:

1. **Track manual QA** — a living checklist of what the creator clicks through and verifies before signing off on each feature, matching the `Plan → Approve → Build → Internal Test → User Review → Approve → Next Feature` process in `CLAUDE.md` §10 and `BUILD_SEQUENCE.md`.
2. **Define the automated test strategy** — what should have coverage, what tooling to use, and where tests live. This section is a **target policy, not a status report**: the project has zero test tooling installed as of 2026-07-07 (`package.json` has only `next lint`, no Jest/Vitest/Playwright/Cypress).

Revisit this file after every feature ships, the same way `PIXEL.md` is revisited after every new page or component.

---

## Part 1 — Manual QA Checklist (per feature)

Each feature gets a checklist block once it's built, covering acceptance criteria and edge cases the creator should click through before saying "ship it." Don't write the checklist speculatively before a feature is planned — add it during that feature's Plan step (`CLAUDE.md` §5), then check it off during Internal Test / User Review.

### Feature 1 — Design system
**Status:** Done. Retroactive checklist (spot-check only, not a full re-verification):
- [ ] `app/design/page.tsx` renders all components against the current tokens (background/surface/border/text/pop/accent/status colours) with no stale labels
- [ ] `prefers-reduced-motion: reduce` stops the LED pulse on `PulseDot`/`Badge` (PIXEL.md PX-102)
- [ ] Skip-to-content link is focusable and has correct contrast (PIXEL.md PX-100)

### Feature 2 — Auth (Supabase)
**Status:** Done. Retroactive checklist:
- [ ] Sign up, log in, log out all work end-to-end
- [ ] Invalid credentials show a clear, non-technical error
- [ ] Session persists across page reload; expires correctly

### Feature 3 — Pitch creation (forms + API)
**Status:** Pending. Checklist to be filled in during that feature's Plan step — acceptance criteria and edge cases (empty fields, character limits, save/autosave behaviour, network failure) belong here once the feature is scoped, not before.

### Features 4-10 (Media upload, Pitch view, Version history, Flow section, Funding, Landing page, Polish)
**Status:** Pending. Same pattern — add a checklist block per feature at its Plan step, per `BUILD_SEQUENCE.md`'s build order. Do not pre-fill these; empty scaffolding for unbuilt features is the kind of speculative work `CLAUDE.md` §4 prohibits.

---

## Part 2 — Automated Test Strategy (target, not current state)

**Nothing below this line is installed today.** This section states what to adopt and when, not what exists.

### Recommended stack
- **Vitest** — unit tests for pure logic: API route handlers, Zod schema validation, any pricing/budget calculation logic. Fast, no browser needed.
- **Playwright** — end-to-end tests for flows that must not silently break: auth (sign up/log in/log out), the public pitch-view page (SSR rendering, since that's the showpiece output funders see), and the Stripe funding flow once built.

### What must have coverage (once the stack exists)
- Auth flows (session creation, expiry, protected route redirects)
- Stripe webhook handling (payment confirmation, funding total updates) — payment correctness bugs are expensive and easy to miss manually
- Pitch-view SSR rendering (the public link is the product's showpiece; a silent rendering regression here is a brand hit, not just a bug)

### What doesn't need automated coverage
- Static marketing copy and the landing page's visual polish (verify manually / visually, per Part 1)
- `app/design/page.tsx` (a style-guide page, not user-facing product surface)
- One-off admin/debug utilities

### File location convention (once adopted)
- Vitest unit tests: colocated as `*.test.ts` next to the file under test
- Playwright e2e tests: a top-level `e2e/` directory, one spec file per user-facing flow

### When to adopt
Introduce the stack when Feature 3 (pitch creation forms + API) or Feature 8 (Stripe funding) is built — both involve logic worth protecting with automated tests. Don't install test tooling speculatively ahead of a feature that needs it.
