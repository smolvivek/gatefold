# PIXEL.md — Design Critic

## Purpose

This file has three jobs:

1. **Enforce the system** — catch places where implementation deviates from DESIGN.md / BRAND.md (wrong tokens, wrong patterns, broken rules).
2. **Critique the design** — flag bad design decisions regardless of whether they violate the spec. Wasted space, empty placeholders, broken hierarchy, layout that doesn't earn its real estate.
3. **Raise the ceiling** — identify where good design could become genuinely distinctive within the new analog-warmth direction.

PIXEL.md thinks like a design director who has seen the rendered page. Token compliance is the floor, not the goal.

## Rules

1. **Reference exact files and line numbers.** Vague notes are useless.
2. **Every violation gets a fix.** Don't flag without prescribing.
3. **Three types of entry:** Violation (must fix before launch), Critique (judgment call, fix when possible), Aspiration (investment decision for post-launch).
4. **Revisit after every new page or component.** Design debt compounds faster than technical debt.
5. **The test:** Would a design director wince at this on a real screen? If yes, it goes in.

---

## Historical context (archived)

Earlier PIXEL.md content (PX-01 through PX-27, Stitch-redesign audit, E-series aspirations) is preserved in git history at commits prior to 2026-05-23. Those entries were written against the prior monochrome / restrained direction. The product has pivoted to the warm-dark + Moog orange + motion-as-craft direction defined in DESIGN.md and BRAND.md. The backlog below is reset accordingly.

---

# Part 1 — Open Violations (Pre-Launch Fix Required)

---

## PX-100. Skip-to-Content Link Has Invisible Focus State

**Severity:** High (accessibility)
**File:** `app/layout.tsx:73`
**What:** The skip link uses `focus:bg-pop focus:text-text-primary`. Pop is `#FF6B1A` orange; text-primary is `#F4EBDC` cream. When focused, the link renders cream text on orange — passes AA contrast but the link is visually weak against the focus ring at the same colour family.
**Fix:** Use `focus:text-background` (deep walnut on orange) for maximum contrast and to match the Primary CTA button pattern (dark text on orange fill).
**Status:** Open

---

## PX-101. Pop Colour Used Decoratively, Not As Signal

**Severity:** TBD (audit pending)
**Files:** TBD (after Phase 2-7 redesign passes)
**What:** Any place where the orange pop colour is used for decoration rather than marking what's alive or active. The pop test in BRAND.md: strip every orange element from a page; the page must still read as a structured composition.
**Fix:** Move pop to active/live elements only. Replace decorative uses with `text-text-secondary` or border-border.
**Status:** Re-audit after Phase 7 ships.

---

## PX-102. LED Pulse Missing `prefers-reduced-motion` Override

**Severity:** Critical (accessibility) — gating condition
**Files:** All components using the `.led-pulse` class once implemented
**What:** The LED breathing pulse is the signature motion of the new system. It must NEVER run for users with `prefers-reduced-motion: reduce`. Failure here is a hard accessibility regression.
**Fix:** Every implementation of LED pulse must include:
```css
@media (prefers-reduced-motion: reduce) {
  .led-pulse { animation: none; opacity: 1; }
}
```
Verify with browser dev tools: Toggle reduced motion → confirm all pulses stop.
**Status:** To be verified during Phase 1 build.

---

## PX-103. Magnetic Button on Touch Devices

**Severity:** High (usability)
**Files:** `components/ui/MagneticButton.tsx` (when implemented)
**What:** Magnetic hover physics on a touch device is broken — there's no cursor to follow. If enabled, taps cause an awkward "jump" as the button tries to magnetize toward the touch point.
**Fix:** Detect `(pointer: coarse)` media query or `'ontouchstart' in window` and disable magnetic behaviour entirely on touch. Use standard `:active` state on touch.
**Status:** To be verified during Phase 1 build.

---

# Part 2 — Likely Issues (Audit Targets per Phase)

These are not yet violations — they are spots most likely to need attention as each phase ships. Each becomes a violation if the audit reveals failure.

---

## PX-200. Landing Hero Demo Pitch Must Be Worthy of the Pedestal

**Severity:** Critical for brand impression
**File:** Demo project in DB + assets in `public/demo/`
**What:** The landing hero shows a screenshot of a finished pitch view. If the demo project's title, logline, poster, and synopsis aren't *genuinely beautiful*, the entire landing falls flat. This is the single most important visual asset in the product.
**Fix:** Commission or curate a demo pitch with:
- A poster image that could plausibly hang in an A24 cinema lobby
- A logline a working filmmaker would respect
- A synopsis written by someone who can write
- Cast names that don't read as placeholder
**Status:** Phase 2.5 — explicit milestone.

---

## PX-201. Pitch Card Cover Image Fallback

**Severity:** Medium
**File:** `components/ui/Card.tsx` (after dashboard redesign)
**What:** Dashboard cards depend on poster art. When a creator hasn't uploaded a poster yet, the card falls back to ??? — needs to be defined. Options: a typographic treatment (project name in big Newsreader on warm dark), a procedural gradient based on the project's title hash, or a soft generic placeholder.
**Fix (proposal):** Typographic fallback. Big project initial(s) in Newsreader bold on a `surface` background, with the LED pulse if status === "looking." Strong identity even without art.
**Status:** Decide during Phase 4.

---

## PX-202. Festival Calendar Data Going Stale

**Severity:** High (brand damage if data wrong)
**File:** `lib/toolkit/festivals.json`
**What:** Festival submission deadlines change yearly. If we show wrong dates and a user misses Sundance because of us, that's a serious brand hit.
**Fix:**
- Every entry in `festivals.json` has a `verified: YYYY-MM-DD` field
- Display "Verified [date]" stamp under each festival card
- Add a "Report an error" link that opens a prefilled email
- Quarterly refresh cadence — calendar event for the team
- If `verified` date is older than 6 months, display a "Verify before submitting" warning
**Status:** Phase 8 build.

---

## PX-203. Mobile LED Pulse Frame-Drop Risk

**Severity:** Medium
**Files:** Components using `.led-pulse` on mobile
**What:** Continuous CSS animations on multiple elements simultaneously can drop frames on lower-end Android. The signature pulse must feel smooth or it becomes a downgrade signal.
**Fix:** On mobile breakpoints, limit LED pulses to at most 2 simultaneous elements per page. Use `will-change: opacity` strategically. Test on a real low-end Android device, not just Chrome DevTools throttling.
**Status:** Verify in Phase 9.

---

## PX-204. Sound Toggle Discoverability

**Severity:** Low-Medium
**File:** `components/ui/SoundToggle.tsx` + nav placement
**What:** Default-off sound effects are correct. But users who would *want* the sound will never know it exists unless the toggle is discoverable. A tiny sound icon in the nav corner can vanish on first visit.
**Fix:** First-visit nudge: 1 visit → show a soft "Sound: OFF" mono label next to the icon for 3 seconds, then collapse to just the icon. Localstorage flag so it only shows once. Subtle, not intrusive.
**Status:** Phase 1 — sound system implementation.

---

# Part 3 — Aspirations (Post-Launch Investment)

Not for week-1 ship. Documented so they don't get lost.

---

## PX-A01. Custom Wordmark Letterform

**Current:** Newsreader Bold uppercase as the wordmark placeholder.
**Opportunity:** A custom-drawn letterform that captures the analog-instrument warmth — chunky, slightly curved, possibly with a subtle gradient or chrome edge. Commissioned from a type designer.
**Why:** The wordmark appears on every page. A custom mark is the single highest-leverage piece of brand identity work post-MVP.
**Investment:** ~$3-8K commissioned, 2-3 weeks lead time.
**Status:** Post-launch, after name is locked (+ 2 days from now).

---

## PX-A02. Soundtrack Mode

**Current:** Subtle click on key actions, default off.
**Opportunity:** An optional "soundtrack mode" — when a creator is in the editor, a very quiet ambient synth pad plays in the background. Inspired by Moog's product videos and the synthwave taste underlying this redesign. Toggleable, off by default, never automatic.
**Why:** Deepens the analog-instrument identity. Could become a signature feature creators talk about.
**Risk:** Easy to do badly. Needs a great sound designer.
**Status:** Post-launch consideration.

---

## PX-A03. Cinematic Loading States

**Current:** Skeleton screens with subtle pulse (when shipped).
**Opportunity:** Loading states with character — a tiny oscilloscope wave, a VU meter ticking, a tape reel spinning. Brief, considered, on-brand. Replaces generic skeleton bars.
**Why:** Loading is a moment of opportunity, not just a stall. The analog-instrument vocabulary has built-in waiting visuals.
**Status:** Post-launch.

---

## PX-A04. Pitch View Print Stylesheet

**Current:** Pitch view doesn't print well — dark backgrounds eat ink, navigation chrome prints.
**Opportunity:** A `@media print` stylesheet that produces a beautiful printed pitch — cream background, dark warm type, hidden chrome, intelligent page breaks.
**Why:** Some funders / studios still print. A beautiful printed pitch is a legitimate brand moment.
**Status:** Post-launch.

---

# Audit Schedule

- **Before any public launch:** Clear all open Part 1 violations
- **After each phase ships:** Walk the rendered page, add new entries to Part 2 if found
- **Quarterly:** Re-read Part 3 aspirations, pick one to ship

---

# Design Health Summary

| Category | Count | Status |
|----------|-------|--------|
| Open violations (Part 1) | 4 (PX-100 to PX-103) | To clear during Phase 1-9 |
| Likely-issue audit targets (Part 2) | 5 (PX-200 to PX-204) | Verify per phase |
| Aspirations (Part 3) | 4 (PX-A01 to PX-A04) | Post-launch |

**Carry into Phase 1 build:**
- PX-100: Skip-link contrast fix (Phase 1 globals.css + layout.tsx pass)
- PX-102: Verify reduced-motion override on every pulse animation
- PX-103: Verify magnetic disabled on touch
- PX-204: First-visit sound-toggle nudge

**Brand-impression critical:**
- PX-200: Demo pitch quality (Phase 2.5)
- PX-202: Festival data freshness (Phase 8)
