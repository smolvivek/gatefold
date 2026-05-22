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

**Warm dark, analog precision, one signature orange.**

Inspired by, in order of weight: **Moog, Teenage Engineering, Linear, A24, Stranger Things (as flavour only).**

The product should feel like an analog synthesiser sitting next to a director's laptop — warm wood casing, cream lettering, one orange knob glowing softly. Used by professionals. Confident. Alive but not loud.

### Core Traits

1. **Negative space as instrument panel** — Not minimalism, considered placement. Like a 909 with knobs spaced so your hand falls into the right place.
2. **Typography as hierarchy** — Scale and weight do the work, not decoration
3. **Warm dark + one signature pop** — `#1A130E` walnut + `#FF6B1A` Moog orange. Used with precision, never as flourish.
4. **Every element has purpose** — If you can't explain why it's there, remove it
5. **Personality emerges from craft** — Not from cleverness or decoration. From getting the LED pulse rate exactly right, the kerning on the wordmark exactly right, the curve of the magnetic hover exactly right.

---

## Pop Colour Strategy

**Use orange like Moog uses orange on a synthesiser: sparingly, structurally, purposefully — only on the live element.**

The colour says "this is on." Strip every orange element from a screen and the structure must still read. Pop is the signal, not the scaffold.

### Use Pop Orange (`#FF6B1A`) For:

1. **Active states** — Current section in sidebar, selected item, focused input
2. **Primary CTA** — One per page (the main action button)
3. **Focus rings** — Keyboard navigation outline
4. **Status indicators** — Specifically "looking" / actively raising
5. **LED breathing pulse** — Subtle 4-second breath on live elements
6. **Inline text links** — Within body copy
7. **Completion marks** — ✓ on pricing tier features

### Use Cream (`#F4EBDC`) For:

1. **All body text and headings**
2. **Button text on dark backgrounds**

### Never Use Pop For:

1. **Hover states alone** — Use brightening of existing colour
2. **Decorative accents** — No orange borders for the sake of decoration
3. **Non-interactive body copy**
4. **Background gradients or fills** (other than the CTA button)

---

## Motion Design Philosophy

**Quality bar: Moog product videos, Linear app motion, Lando Norris site, Apple Vision Pro feature pages.**

### Principles

1. **Motion reveals what's alive** — The LED pulse signals "this is on." Without it, nothing in the UI says it's animate.
2. **Motion has cinematic patience** — Moves slowly, deliberately. The 600ms cinematic ease is the spine of the motion system.
3. **Earns its place** — If a motion doesn't clarify, delight, or signal life, cut it.
4. **Respects reduced motion** — Every animation has a `prefers-reduced-motion` fallback. Reduced-motion users get a static but still beautiful product.

### Allowed Patterns

- **LED breathing pulse** (4s opacity cycle) on active/live elements
- **Scroll-triggered fade-up reveals** with cinematic 600ms ease
- **Magnetic button hover** — subtle cursor pull (≤12px) on primary CTAs
- **Active "light up"** — 200ms ramp when something becomes active, settles to static or pulsing
- **Subtle hover state transitions** — opacity, colour, transform within 200ms

### Reference Points

- **Moog** — product photography and video. The warmth of the wood, the glow of the orange power LED.
- **Linear** — the way the active section in their sidebar breathes. The cinematic cadence of their landing page scroll.
- **Apple Vision Pro feature pages** — the hover-to-expand callout pattern we're stealing for the landing hero.
- **Lando Norris site** — large-scale typography in motion, smooth easing on hero text.
- **Stranger Things** — only as flavour. The warmth of CRT light. The grain.

### Never

- Generic fade-ins or slide-ups for the sake of it
- Spring overshoot or bouncy effects (kills the analog-precision feel)
- Page transitions between routes (kills perceived speed)
- Loading spinners — use skeleton screens with subtle opacity pulse
- Ambient floating decorative shapes
- SVG stroke-draw "logo reveal" animations
- Motion for motion's sake

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
- All new UI must pass the **"pop test"** — the signature orange used only where something is live
- All new animations must pass the **"craft test"** — Moog/Linear/Apple-quality, not gimmicky
- All new patterns must respect `prefers-reduced-motion`
- When in doubt, subtract decoration. Restraint is still the brand. Just warmer.

---

**This document is authoritative for all brand decisions. Update it when brand evolves, but changes require deliberate approval.**
