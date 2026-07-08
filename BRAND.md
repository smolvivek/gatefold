# BRAND.md — Brand Personality & Voice

## Who We Are

**"The instrument on the producer's desk."**

This product is the tool that gets creators ready for the table. Not a presentation app, not a deck builder, not a writing tool — a finished, considered instrument that turns creative work into something a funder, collaborator, or studio can sit with for ten minutes and understand.

- **In service of the creator** — Amplifies their vision, never imposes our own
- **Gives capabilities they didn't have** — AI tools for images and text, integrated funding, version history
- **Makes sharing effortless** — One link, shareable everywhere
- **Enables professional fundraising** — Easy to use, never amateur-looking
- **Trusted collaborator** — Knows what you need, doesn't second-guess your work

---

## Voice & Tone

**Foundation: David Ogilvy + dry British humour, slightly warmed for the new visual energy.**

### Core Principles

1. **Sharp and economical** — No wasted words. Every sentence earns its place.
2. **Specific and concrete** — "Eight fields" not "a few fields." "15 minutes" not "quickly."
3. **Confident, not clipped** — The old voice was sometimes too curt for the warmer visual direction. Aim for *spare and self-assured*, not *terse*.
4. **Benefits-focused** — What the creator gets, not what the feature does.
5. **Self-aware observational wit** — Warm, relatable, understated. Never snarky or condescending.
6. **Friendly without trying** — Like a senior editor reading your draft over coffee — direct, kind, never lecturing.

### Examples (Approved — slightly warmed register)

**Project published:**
```
Your work is ready. Now the harder part — sharing it.
```

**Empty state:**
```
Nothing yet. Start when you're ready.
```

**After save:**
```
Saved — looks good.
```

**Character limit exceeded:**
```
A touch long. Trim it.
```

**Dashboard after deleting last project:**
```
Back to a blank page. The good kind.
```

**Sign-up complete:**
```
You're in. Open your first project.
```

### What NOT to Say

❌ "Share wisely" (condescending)
❌ "Send it to someone who matters" (judgmental)
❌ "Eight required fields" (highlighting friction, not value)
❌ "Your first project starts here" (cliché)
❌ Exclamation marks (except critical errors)
❌ Marketing speak ("game-changer," "seamless," "revolutionary," "powerful")
❌ "AI-powered," "smart," "intelligent" — show the capability, don't label it
❌ Emoji in UI copy (except a single ✓ on confirmations)

---

## Terminology

**Use "project" throughout the UI** (not "pitch")

- "Create project" (not "Create pitch")
- "Your projects" (not "Your pitches")
- "Share your work" (not "Share your pitch")

**Why:** The product name is a working title and will change. Using "project" keeps UI copy neutral and adaptable. The word also fits across creative disciplines — a film is a project, so is a game, an ad, a photo series.

Database and code can use `pitches` table internally. User-facing language = "project."

---

## Visual Personality

**Near-black canvas. Kodachrome yellow. F91W Royal Blue. Three values. No more.**

Inspired by, in order of weight: **Casio F91W (the face — black body, Royal Blue module, yellow LCD indicator), A24 press materials, Kodachrome, Dieter Rams / Braun (restraint and function).**

Teenage Engineering and warm-brown walnut palettes are explicitly NOT the reference. The canvas is neutral black. Two functional colours sit on it: yellow signals "live / active / on." Blue signals "structural / informational / navigational." Neither is decorative.

The product should feel like an F91W on a director's desk — black resin, Royal Blue face, one yellow indicator blinking. Functional. Precise. Alive but not decorative.

### Core Traits

1. **Negative space as instrument panel** — Not minimalism, considered placement. Like a 909 with knobs spaced so your hand falls into the right place.
2. **Typography as hierarchy** — Scale and weight do the work, not decoration
3. **Three-value palette** — `#0A0A0A` black + `#F5C830` Kodachrome yellow + `#2755A1` F91W Royal Blue. Used with precision, never as flourish.
4. **Every element has purpose** — If you can't explain why it's there, remove it
5. **Personality emerges from craft** — Not from cleverness or decoration. From getting the LED pulse rate exactly right, the kerning on the wordmark exactly right.

---

## Colour Strategy

Two functional colours on a near-black canvas. Each has a job. Neither decorates.

### Pop Yellow (`#F5C830`) — "This is on"

Use like the yellow LCD indicator on an F91W: only when something is live, active, or selected.

1. **Active states** — Current section in sidebar, selected item, focused input
2. **Primary CTA** — One per page (the main action button)
3. **Focus rings** — Keyboard navigation outline
4. **Status indicators** — "Looking" / actively raising
5. **LED breathing pulse** — Subtle 4-second breath on live elements
6. **Inline text links** — Within body copy
7. **Completion marks** — ✓ on pricing tier features

### Accent Blue (`#2755A1`) — "This is structural"

Use like the Royal Blue face of an F91W: the stable, functional field everything else sits on.

1. **Secondary CTAs** — When a primary yellow CTA is already present on the page
2. **Informational badges** — Version numbers, plan indicators, non-active status
3. **Selected states in multi-step flows** — Where yellow would read as "live" incorrectly
4. **Pro/Studio tier highlights** — Tier-specific UI differentiation

### Never Use Either For:

1. **Hover states alone** — Use brightening of existing colour
2. **Decorative accents** — No coloured borders for decoration
3. **Non-interactive body copy**
4. **Background gradients or fills** (other than CTA buttons)
5. **Both on the same element** — Yellow and blue never share a component

---

## Motion Design Philosophy

**Quality bar: Stripe.com, Linear.app, A24's site.** Functional micro-motion, not spectacle — motion that clarifies, never motion for its own sake.

### Principles

1. **Motion reveals what's alive** — The LED pulse signals "this is on." Without it, nothing in the UI says it's animate.
2. **Motion has cinematic patience** — Moves slowly, deliberately. The 600ms cinematic ease is the spine of the motion system.
3. **Earns its place** — If a motion doesn't clarify, delight, or signal life, cut it.
4. **Respects reduced motion** — Every animation has a `prefers-reduced-motion` fallback. Reduced-motion users get a static but still beautiful product.

### Allowed Patterns

- **LED breathing pulse** (4s opacity cycle) on active/live elements — live today, via `PulseDot`/`Badge`
- **Staggered fade-up on mount** (80ms increments) — live today on the pitch view page
- **Active "light up"** — 200ms ramp when something becomes active, settles to static or pulsing
- **Subtle hover state transitions** — opacity, colour, transform within 200ms
- **Scroll-triggered reveals** — future aspiration only; not yet built (see DESIGN.md's "Scroll-as-storytelling" section for the target spec if this is picked up later)

### Reference Points

- **Stripe** — restrained, functional micro-motion; nothing moves without a reason.
- **Linear** — the way the active section in their sidebar breathes. The cinematic cadence of their landing page scroll.
- **A24** — editorial restraint, the product/photography as hero, motion in service of the work rather than decoration.

### Scroll-as-Storytelling — future aspiration, not yet built

**Status: not implemented.** No scroll-linked reveal system exists in the codebase today; the live pattern is a simple staggered fade-up on mount (see Allowed Patterns above). The following describes a target for if/when a page's content calls for it — not current law:

- **Visual anchor per section** — within 400px of scroll, something from the real product UI is visible
- **Entry has character** — a hero demo could enter from below; a feature mock could expand as it enters; a stat could count up. Not every element fades up identically.
- **Pinned visuals where appropriate** — the left column UI stays fixed while the right copy explains it (Apple product page pattern).
- **The product is always present** — never two consecutive scroll-depth sections that are copy-only

**Reference:** Stripe, Linear, A24 — restraint first, spectacle never.

### Never

- Generic fade-ins or slide-ups for the sake of it
- Spring overshoot or bouncy effects (kills the functional-precision feel)
- Page transitions between routes (kills perceived speed)
- Loading spinners — use skeleton screens with subtle opacity pulse
- Ambient floating decorative shapes
- SVG stroke-draw "logo reveal" animations
- Motion for motion's sake
- Bento grid animations (the pattern itself is banned)
- Magnetic cursor-follow effects on buttons (not part of this system)

---

## Sound

**One click sample, used sparingly, off by default, toggleable.**

The sound is a soft click — like the click of a Moog button being pressed. It plays on:

- Primary CTA actions (Publish, Save, Create your first project)
- Modal opens (very soft)

It does NOT play on:
- Hover, focus, scroll
- Secondary buttons or tertiary links

**Default OFF.** Toggle reachable from main nav. Preference persisted.

Sound is part of the analog-instrument language — but quiet enough that users who don't want it never know it exists.

---

## What We Are NOT

Actively avoid these personalities:

- ❌ **Generic SaaS** — No "seamless workflows," "powerful dashboards," "AI-powered everything"
- ❌ **Tech startup** — No Silicon Valley energy, no growth-hacking language
- ❌ **Design tool** — Not a deck builder or canvas — we're for finished presentation
- ❌ **Hollywood studio** — Not corporate, not bureaucratic
- ❌ **Precious art gallery** — Not elitist or unapproachable
- ❌ **Cold engineering tool** — Precise but warm, never sterile
- ❌ **Synthwave kitsch** — We borrow analog warmth from synths; we don't dress up in chrome and neon. No Drive-style sunset gradients on every page. Restraint.

### Specifically Banned SaaS Landing Patterns

These patterns appear on ten thousand product sites. If you find yourself building one of them, stop.

- ❌ **Bento grids** — titled feature tiles arranged in a CSS grid with a number, an icon, and a one-line description. This is template design.
- ❌ **"Every tool a [user type] needs"** — or any variant. Applies to everything. Means nothing.
- ❌ **"How it works" section** — three steps with arrows and paragraph copy. Show it working. Don't explain how it works.
- ❌ **Icon + headline + paragraph feature columns** — if the layout is "three (or four) columns, each with an icon at the top and a paragraph below," burn it.
- ❌ **Stat grids** without visual context — "3 min / 1 link / 0 decks" as plain number tiles means nothing without visual anchoring.
- ❌ **Abstract hero illustrations** — no isometric UI floating in space, no gradient blobs behind the headline, no glowing orbs.
- ❌ **"Trusted by X teams"** logo rows with greyscale client logos — we don't have them yet and won't fake credibility.
- ❌ **The gradient CTA section** — a coloured background with a big headline and a white button at the bottom of every SaaS page. Use editorial typography instead.

---

## Brand Adjectives (Approved)

**Primary traits:**
- Confident
- Precise
- Warm
- Considered
- Intentional

**Secondary traits:**
- Direct
- Refined
- Grounded
- Assured
- Cinematic
- Alive

---

## Implementation Notes

- All new copy must pass the **"warmed Ogilvy test"** — sharp, specific, benefit-focused, kind without being soft
- All new UI must pass the **"pop test"** — the signature yellow used only where something is live
- All new animations must pass the **"craft test"** — Stripe/Linear/A24-quality, not gimmicky
- All new patterns must respect `prefers-reduced-motion`
- When in doubt, subtract decoration. Restraint is still the brand. Just warmer.

---

**This document is authoritative for all brand decisions. Update it when brand evolves, but changes require deliberate approval.**
