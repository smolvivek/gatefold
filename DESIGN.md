# DESIGN.md — Design System & Aesthetic Direction

**For brand personality, voice, and motion philosophy, see [BRAND.md](./BRAND.md)**

---

## Design Philosophy

The product is a creator's instrument. It should feel like one.

**Three influences, weighted equally:**

### 1. Moog — "Analog Instrument Warmth"
- Walnut surfaces, cream type, one signature orange.
- Restraint with vivid moments — colour earns its place by marking the live element.
- Photography (or in our case, product screenshots) is the hero. Copy supports.

### 2. Linear — "Motion as Craft"
- Quiet ambient motion that makes the product feel alive, not loud.
- Subtle glow on the active element. Sections that breathe in as you scroll.
- The product itself is the hero of every page above the fold.

### 3. Stranger Things — "Cinematic Flavour"
- Used as a flavour, not a theme. A subtle red-orange LED that pulses. The warmth of CRT light. Grain.
- We do not lean theatrical — no chunky chrome lettering, no scanline overlays, no horror tropes. Just the warmth.

**Result:** A creator's tool that feels like a Moog 909 sitting on a producer's desk — warm wood, cream lettering, one orange knob glowing softly. Confident. Alive. Used by professionals.

---

## Core Design Principles

### 1. Warm Dark, Cream Type
- `#1A130E` (deep walnut) page backgrounds
- `#F4EBDC` (cream, not white) for primary text
- Creator content commands attention; UI chrome recedes
- Hairline borders at `rgba(255, 180, 120, 0.06)` — warm-tinted, barely visible

### 2. The Product Is the Hero
- Every page leads with the product — a screenshot, a mockup, a UI figure
- Headlines support the product, not the other way around
- No abstract decorative motion behind hero text. The motion lives inside the product itself.

### 3. Orange as the Signal
- `#FF6B1A` (Moog orange) marks what is active, important, or alive
- One orange CTA per page maximum
- A live element pulses subtly (LED breathing)
- If you remove all orange from a page, the structure must still read. Orange is the signal, not the structure.

### 4. Motion Is Craft
- Motion clarifies what is alive and what is at rest
- The LED pulse signals "this is on"
- Scroll reveals build anticipation
- Magnetic hover gives the cursor weight
- No ambient floating shapes, no decorative ribbons, no spring overshoots, no motion for motion's sake

### 5. Respect Reduced Motion
- `prefers-reduced-motion: reduce` is honoured everywhere
- LED pulse becomes static. Scroll reveals collapse to instant opacity. Magnetic hover disables.
- Reduced-motion users get a fully static but still beautiful experience

---

## Visual System

### Colour Palette

| Token | Value | Usage |
|-------|-------|-------|
| **Canvas** | `#1A130E` | Page backgrounds — deep walnut |
| **Surface** | `#231A12` | Cards, elevated panels |
| **Surface hover** | `#2D2218` | Hover state on cards and tappable surfaces |
| **Border** | `#3A2B1E` | Defined edges (input borders, card edges) |
| **Hairline** | `rgba(255, 180, 120, 0.06)` | Section dividers, nav bottom border |
| **Text primary** | `#F4EBDC` | Body text and headings — warm cream |
| **Text secondary** | `#A69682` | Captions, metadata, help text |
| **Text disabled** | `#6B5D4F` | Non-interactive, corner annotations |
| **Pop signature** | `#FF6B1A` | Moog orange — active states, CTAs, focus, "looking" status |
| **Pop hover** | `#FF8038` | Lighter orange on hover |
| **Pop dim** | `#A0431B` | LED off-state (40% of full) — pulse low point |
| **Status: in progress** | `#FFB627` | Amber — VU meter glow |
| **Status: looking** | `#FF6B1A` | Same as pop — actively raising / seeking |
| **Status: complete** | `#7CB342` | Warm green |
| **Error** | `#E5494D` | Form validation, destructive confirmations |
| **Success** | `#7CB342` | Confirmations (reuse complete) |
| **Link** | `#FF6B1A` | Inline text links |

**Dark canvas only.** No light-mode variants. The palette is calibrated for warm-dark.

---

### Pop Colour Usage Rules

Pop (`#FF6B1A`) is the editorial signal against deep walnut. It marks what is active, important, or alive.

**Use pop colour for:**
1. Section label numbers (`01 / SYNOPSIS`)
2. Active sidebar item (left border + text + LED pulse)
3. Active sidebar focus
4. Primary call-to-action button (one per page)
5. Focus rings on form inputs (orange ring at 4px offset)
6. Status badges where status === "looking"
7. The `:focus-visible` outline globally
8. Inline text links
9. Completion indicators (orange ✓ on pricing tiers)

**Use cream `#F4EBDC` for:**
1. Body text
2. Primary headings
3. Button text on dark backgrounds (`text-text-primary`)

**Never use pop colour for:**
1. Decorative backgrounds, gradients, or accents that aren't marking something live
2. Body copy
3. Non-interactive decorative elements

**The test:** Strip every pop-coloured element from a page. The page must still read as a structured composition. Pop is the signal, not the scaffold.

---

### Typography

| Use | Font | Style | Weight | Size |
|-----|------|-------|--------|------|
| **Hero display** | Newsreader | Italic for emphasis word, upright otherwise | 400-500 | `clamp(64px, 14vw, 200px)` |
| **Section heading** | Newsreader | Upright | 400-500 | `clamp(40px, 6vw, 80px)` |
| **Pitch view title** | Newsreader | Upright bold | 700 | `clamp(64px, 14vw, 200px)` uppercase |
| **Navbar wordmark** | Newsreader | Bold uppercase | 700 | `20px` tracking-tighter |
| **Auth heading** | Newsreader | Italic | 400 | `48px-56px` |
| **Body** | Inter | Regular | 400 | `16-17px` / `26-28px` line-height |
| **Small / caption** | Inter | Regular | 400 | `13-14px` / `20-22px` line-height |
| **Section labels** | JetBrains Mono | — | 700 | `10-11px` uppercase tracking-[0.20-0.25em] |
| **Corner annotations** | JetBrains Mono | — | 400 | `9-10px` uppercase tracking-[0.15-0.20em] |
| **Metadata strip** | JetBrains Mono | — | 400 | `10-12px` uppercase |

**Heading tracking:** `-0.02em` to `-0.03em` on large display type.
**Uppercase:** Headings in nav, mono section labels, and button copy.
**Class usage:** Always use `.font-heading` / `.font-mono` classes — never `font-[var(--font-…)]` arbitrary values (the class applies the standard letter-spacing correction).

---

### Border Radius

**Zero everywhere.** `border-radius: 0px` on buttons, inputs, cards, modals, badges, focus rings, dropdowns. No exceptions.

Rounding softens. This system does not soften — it stays analog-precise.

---

### Spacing & Grid

**8px base unit.** Multiples: 8, 16, 24, 32, 40, 48, 56, 64, 80, 96.

**Editorial grid (pitch view, landing sections):**
- `grid-cols-12`, `gap-[48px]`
- 2-col sticky pop mono label / 10-col content

**Horizontal padding:**
- Standard: `px-[48px]` desktop, `px-[24px]` mobile
- Wide sections: `px-[96px]` desktop, `px-[48px]` tablet

**Content max-width:** `max-w-[1200px]` editorial, `max-w-[960px]` dashboard, `max-w-[400px]` auth forms.

---

### Buttons

**Primary** (one per page — main action)
- Background: `bg-pop` (`#FF6B1A`)
- Text: `text-background` (`#1A130E`) — near-walnut on orange for high contrast
- Padding: `px-[32px] py-[16px]`
- Font: Newsreader bold uppercase tracking-tighter, `text-[14-15px]`
- Border radius: 0
- Hover: `bg-pop-hover` (`#FF8038`) + magnetic pull (8-12px toward cursor) + scale (0.98 on press)
- Disabled: `opacity-50 cursor-not-allowed`
- Idle: subtle LED breathing pulse (opacity 0.85 → 1.0 over 4s, reduced-motion-safe)

**Secondary** (alternative actions: "Cancel", "Preview", "Learn more")
- Background: transparent
- Border: `1px solid #3A2B1E`
- Text: `text-text-primary` (cream)
- Hover: `border-pop` border colour shift, no magnetic pull
- Same paddings/typography as Primary

**Tertiary / ghost** (nav links, sidebar items)
- Background: transparent
- Text: `text-text-secondary hover:text-text-primary`
- Transition 200ms

**Icon button** (close, copy, delete)
- 36×36px tap target
- Icon at 16-18px
- `aria-label` required (decorative SVG = `aria-hidden="true"`)
- Hover: background lightens to `surface-hover`

**Button copy:** UPPERCASE. Action verb first. Six words max ("Create your first project", "Share this draft").

---

### Form Inputs

**Standard inputs** (editor, create/edit forms)
- Background: `bg-surface` (`#231A12`)
- Border: `1px solid #3A2B1E`
- Border radius: 0
- Padding: `12px 16px`
- Font: 15px Inter, `text-text-primary`
- Focus: orange ring at 4px offset (`outline: 2px solid #FF6B1A; outline-offset: 4px`)
- Error: `border-l-2 border-error` with mono error text below

**Auth inputs (underline-only)**
- Background: transparent
- Border: bottom only, `border-b border-border` initially
- Focus: `border-pop` underline
- Padding: `py-[10px]`
- Font: 15px Inter
- Labels: JetBrains Mono 9px uppercase tracking-[0.2em] `text-text-disabled`

**Checkboxes**
- `accent-pop` for checked colour
- Label: 9-10px mono uppercase, inline

**Form layout:** Labels above inputs. Error text in mono colour-error below field.

---

### Cards & Containers

**Pitch card (dashboard listing — VISUAL CARDS, not text rows)**
- Poster image at top, full-bleed (`aspect-[3/4]` or `aspect-video`)
- Below: project name in Newsreader Bold `text-[22px]` (`hover:text-pop` transition)
- Logline in Inter `text-[14px] text-text-secondary` (line-clamp-2)
- Metadata in mono `10px` uppercase — version / date / budget / genre / status
- Status badge: orange LED pulse if "looking"
- Card hover: subtle lift (`translate-y-[-2px]`), magnetic cursor pull

**Section container (editor)**
- Background: `bg-surface`
- Border: `1px solid #3A2B1E`
- Border radius: 0
- Padding: `24px`

---

### Status Badges

- Background: transparent
- Border: `1px solid` of the status colour
- Text: status colour, mono 10px uppercase tracking-[0.2em]
- **Looking** badge: orange LED pulse (4s breathing, reduced-motion-safe)
- **In progress** badge: amber tint, no pulse
- **Complete** badge: warm green, no pulse

---

### Navigation

**Landing page nav**
- Height: `h-[72px]`, `px-[48px]`
- Background: `bg-background/90 backdrop-blur-sm`
- Border bottom: hairline
- Wordmark: Newsreader bold `text-[20px]` uppercase tracking-tighter
- Nav links: Newsreader `text-[15px]` uppercase tracking-tighter `text-text-secondary`
- Primary CTA: orange Primary button (with LED pulse)
- Sound toggle: small icon button on the right (default OFF state shown)

**Pitch view top bar**
- Fixed, `backdrop-blur-sm bg-background/90`
- Project name: Newsreader italic `text-[18px]` bold tracking-tighter
- Version: mono `9px` uppercase tracking-[0.2em] `text-text-disabled`
- Border bottom: hairline

**Dashboard sidebar**
- Width: `w-64` (256px)
- Background: `bg-surface` darker variant (`#1F160E`)
- Border right: hairline
- Section rows: `01 / SECTION NAME` — mono bold uppercase tracking-[0.15em] `text-[10px]`
- Active row: `border-l-2 border-pop`, text in pop, LED breathing pulse on the section number
- Inactive row: `border-l-2 border-transparent text-text-disabled hover:text-text-primary`

---

### Section Labels

All section labels follow the `01 / SECTION NAME` format:

```
font-mono text-[10px] uppercase tracking-[0.25em] text-pop font-bold
```

Sticky on the left column of the pitch view editorial grid (`md:sticky md:top-[88px]`).

---

### Landing Hero Pattern (the most important page)

The hero leads with the product, not abstract copy.

**Above the fold:**
- Left half (or 60%): big screenshot of a finished pitch view (the "demo project" — a beautifully designed indie film example)
- Right half (or 40%): headline (Newsreader, hero scale) + logline + Primary CTA
- 3-4 callout dots overlaid on the screenshot — each one marks a feature (Versioning, Funding, Privacy, AI image gen). Hovering a dot expands a small detail card with explanation.
- Each dot pulses subtly (LED breathing)
- Below the fold: scroll into the rest of the page

**Below the fold sections (in order):**
1. **What it is** — three UI figures side-by-side: editor sidebar, share dialog, funding widget. Real screenshots.
2. **How it flows** — Build → Share → Fund as a horizontal sequence. Three steps, three UI snapshots.
3. **Why** — Principles in plain language (creator control, no surveillance, no templates).
4. **Pricing** — Three tier tiles. Pro tier gets subtle orange edge glow.
5. **Final CTA** — Big italic Newsreader heading + orange Primary button with pulse.
6. **Footer** — Wordmark, links, ©.

---

### Pitch View Page (the showpiece public output)

A24 press kit in a warm screening room.

**Hero (`PitchViewHero`)**
- Full `min-h-screen`
- Poster image: `opacity-60` warm-toned, absolute fill behind content
- Title: Newsreader bold `clamp(64px, 14vw, 200px)` uppercase `tracking-[-0.03em]`
- Logline: `border-l border-pop/30 pl-[24px]` italic `text-[22-28px]`
- Status badge (top right): LED pulse if "looking"

**Top bar (`PitchViewTopBar`)**
- Project name italic serif left, version mono right
- Section nav (synopsis / vision / cast / team / funding) — hover transitions, active state in pop

**Metadata strip (`PitchViewMetadata`)**
- `bg-surface`, mono labels, status in `text-pop`

**Content sections (`PitchViewSection`)**
- `px-[48px] md:px-[96px] py-[96px]`
- 12-col grid: 2-col sticky pop label / 10-col content
- Section heading: Newsreader `clamp(40px, 6vw, 80px)` tracking-[-0.02em]
- Body: Inter `text-[16-17px]` leading-[28-30px] `text-text-secondary`
- Images: warm-toned, hover slightly brightens
- Fade-up reveal on scroll, 80ms stagger

**Cast cards (`PitchViewCards`)**
- Variant `cast`: 3-col portrait grid, `aspect-[3/4]` placeholder, role in pop mono, name in Newsreader `text-[28px]`
- Variant `team`: horizontal list, square placeholder, role in pop mono, name in Newsreader `text-[32px]`

**Funding widget (`PitchViewFunding`)**
- Progress bar in pop orange — LED breathing on the bar when actively raising
- Amount raised in Newsreader bold display scale
- Stretch goals listed below

**Footer (`PitchViewFooter`)**
- `bg-surface`, project name italic serif left, "Made with [NAME]" mono right

---

### Animations & Interactions

**LED Breathing Pulse**

The signature motion. A 4-second opacity cycle on elements that are "alive."

```css
@keyframes led-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.led-pulse {
  animation: led-pulse 4s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .led-pulse { animation: none; opacity: 1; }
}
```

**Applied to:**
- Active sidebar item (the orange section number)
- Primary CTA at rest (the button background)
- "Looking" status badge
- Funding progress bar when actively raising

**Scroll Reveals**

IntersectionObserver-triggered fade-up. 600ms cinematic ease, 80ms stagger if multiple in viewport.

```ts
const ease = "cubic-bezier(0.16, 1, 0.3, 1)"  // cinematic
const duration = "600ms"
const stagger = "80ms"
// element: opacity-0 translate-y-8 → opacity-100 translate-y-0
```

Reduced-motion: instant opacity-only.

**Magnetic Buttons**

Primary CTAs follow the cursor on hover, with subtle pull (8-12px max).

```ts
// On hover: track cursor position relative to button center
// Apply transform: translate(x * 0.15, y * 0.15)
// Max offset clamped to 12px
// Settle on mouseleave with 200ms ease
```

Disabled on touch devices. Reduced-motion: disabled.

**Page Transitions**

None. Instant route change. Motion happens inside pages, not between them.

**Active "Light Up"**

When something becomes active (clicking a sidebar item, opening a modal, focusing an input), the orange briefly ramps up from dim to full over 200ms, then settles to the static or pulsing orange state. Reduced-motion: instant.

**Focus Rings**

```css
*:focus-visible {
  outline: 2px solid var(--color-pop);
  outline-offset: 4px;  /* breathing room, considered, not technical */
}
```

**Easing Vocabulary**

- **Cinematic** — `cubic-bezier(0.16, 1, 0.3, 1)` — for section reveals, hero entrance, modal opens
- **Standard** — `cubic-bezier(0.25, 0.1, 0.25, 1)` — for hover, focus, state changes
- **Linear** — only for indeterminate progress bars

**Duration Vocabulary**

- **150-200ms** — state changes (hover, focus, active)
- **250-300ms** — transitions (modal open, dropdown open)
- **600ms** — cinematic (section reveal, hero entrance)
- **4000ms** — LED breathing cycle

**Never:**
- Spring overshoots, bouncy effects
- Ambient floating decorative shapes
- Page transition animations between routes
- Loading spinners (use skeleton screens with subtle pulse)
- Generic fades or slide-ups without intent

---

### Sound

One subtle click sample, played on key actions.

**When it plays:**
- Primary CTA click ("Create your first project", "Publish", "Share")
- Save confirmed
- Modal opened (very soft)

**When it doesn't:**
- Hover, focus, scroll
- Secondary or tertiary buttons
- Any background or ambient state

**Default OFF.** Toggle in main nav. Preference persisted in `localStorage`.

**Implementation:** Web Audio API, one preloaded `<5KB` audio sample.

**Reduced-motion users:** unaffected. (Reduced-motion is about visual motion, not audio.) But: respect `prefers-reduced-data` if set — don't preload sound.

---

### Grain Texture

The film grain overlay stays — it adds analog warmth.

- Fixed-position `body::before` overlay
- `~5%` opacity
- Warm-tinted noise (slightly orange-yellow rather than pure white grain)
- 512×512 SVG noise tile (denser to avoid HiDPI tile-boundary artifacts)

Reduced-motion users: unchanged (grain is static, not motion).

---

### Responsive Design

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768-1024px
- Desktop: 1024px+

**Mobile behaviour:**
- Single-column layouts
- `px-[24px]` margins
- Sidebar collapses (overlay drawer)
- Pitch view 12-col grid collapses — label above content
- Touch targets ≥ 44×44px
- Magnetic buttons disabled (touch handles differently)
- LED pulse radius smaller (lower compute)
- Scroll reveals preserved (motion is the new direction)

---

### Accessibility

**Colour contrast:**
- Cream on canvas: 14.2:1 — exceeds AAA
- Text secondary on canvas: 6.1:1 — exceeds AA
- Pop on canvas: 5.4:1 — passes AA for normal text, AAA for large
- Status badges always paired with text label, not colour-only

**Keyboard navigation:**
- All interactive elements focusable via Tab
- Focus state: 2px solid pop outline, 4px offset
- Logical tab order
- Skip-to-content link with proper contrast (`focus:text-background` on `focus:bg-pop`)

**Screen readers:**
- All images have alt text
- All icon buttons have `aria-label`
- Decorative SVGs `aria-hidden="true"`
- Form labels associated with inputs
- Semantic HTML headings
- LED pulse and scroll reveals are visual-only — no semantic dependency

**Reduced motion:**
- All animations stop or collapse
- `prefers-reduced-motion: reduce` honoured in `globals.css` and component-level

**Sound:**
- Default off respects users who don't want audio
- Toggle reachable via keyboard

---

## Creation Experience

**Sidebar = editorial step sequencer. Main area = clean writing surface.**

- Left: 256px sidebar (`#1F160E` darker walnut)
- Right: editor with `#231A12` surface sections
- Active section: pop-coloured left border, LED-pulsing section number
- Optional sections added explicitly via `+ Add section` panel
- Save indicator: orange flash when saving, settles to dim
- AI image gen button: orange icon with LED pulse while generating

---

## Final Design Principle

**The product is the hero. The orange is the signal. The warmth is the trust.**

Deep walnut. Cream type. Moog orange that breathes.

The screening room is warm now. The product glows. The creator is at the desk.

Restrain. Show. Respect.
