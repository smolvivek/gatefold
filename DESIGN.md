# DESIGN.md — Design System & Aesthetic Direction

**For brand personality, voice, and motion philosophy, see [BRAND.md](./BRAND.md)**

---

## Design Philosophy

The product is a creator's instrument. It should feel like one.

**Two influences, weighted equally:**

### 1. F91W — "Functional Precision"
- Near-black canvas, one yellow signal, one structural blue. Three values, no more.
- Restraint with vivid moments — colour earns its place by marking the live element or the structural field it sits on.
- Photography (or in our case, product screenshots) is the hero. Copy supports.

### 2. Linear — "Motion as Craft"
- Quiet ambient motion that makes the product feel alive, not loud.
- Subtle glow on the active element.
- The product itself is the hero of every page above the fold.

**Result:** A creator's tool that feels like an F91W on a director's desk — black resin, Royal Blue face, one yellow indicator blinking. Confident. Alive. Used by professionals.

---

## Core Design Principles

### 1. Near-Black Canvas, Near-White Type
- `#0A0A0A` (neutral near-black) page backgrounds
- `#F0EDE8` (near-white, very slight warmth) for primary text
- Creator content commands attention; UI chrome recedes
- Hairline borders at `rgba(255,255,255,0.05)` — barely visible section dividers

### 2. The Product Is the Hero
- Every page leads with the product — a screenshot, a mockup, a UI figure
- Headlines support the product, not the other way around
- No abstract decorative motion behind hero text. The motion lives inside the product itself.

### 3. Yellow as the Signal
- `#F5C830` (Kodachrome yellow) marks what is active, important, or alive
- One yellow CTA per page maximum
- A live element pulses subtly (LED breathing)
- If you remove all yellow from a page, the structure must still read. Yellow is the signal, not the structure.

### 4. Blue as the Structure
- `#2755A1` (F91W Royal Blue) marks what is structural, informational, or navigational
- Used for secondary CTAs (when a yellow primary is already present), informational badges, and tier differentiation
- Yellow and blue never share a component — each element gets one or the other, never both
- If you remove all blue from a page, the page must still read as alive (that's yellow's job)

### 5. Motion Is Craft
- Motion clarifies what is alive and what is at rest
- The LED pulse signals "this is on"
- A simple staggered fade-in on mount gives content entrance without spectacle
- No ambient floating shapes, no decorative ribbons, no spring overshoots, no motion for motion's sake

### 6. Respect Reduced Motion
- `prefers-reduced-motion: reduce` is honoured everywhere
- LED pulse becomes static. Fade-ins collapse to instant opacity.
- Reduced-motion users get a fully static but still beautiful experience

---

## Visual System

### Colour Palette

| Token | Value | Usage |
|-------|-------|-------|
| **Canvas** | `#0A0A0A` | Page backgrounds — neutral near-black |
| **Surface** | `#131313` | Cards, elevated panels |
| **Surface hover** | `#1A1A1A` | Hover state on cards and tappable surfaces |
| **Border** | `#262626` | Defined edges (input borders, card edges) |
| **Border hover** | `#333333` | Hover/active border lift |
| **Hairline** | `rgba(255,255,255,0.05)` | Section dividers, nav bottom border |
| **Text primary** | `#F0EDE8` | Body text and headings — near-white, very slight warmth |
| **Text secondary** | `#8A8880` | Captions, metadata, help text |
| **Text disabled** | `#545250` | Non-interactive, corner annotations |
| **Pop (yellow)** | `#F5C830` | Kodachrome yellow — active states, CTAs, focus, "looking" status |
| **Pop hover** | `#F7D24A` | Lighter yellow on hover |
| **Pop dim** | `#7A6418` | LED off-state — pulse low point |
| **Pop light** | `#FBE880` | Tinted backgrounds, subtle accents |
| **Accent (blue)** | `#2755A1` | F91W Royal Blue — secondary CTAs, informational badges, structural UI |
| **Accent hover** | `#3163B5` | Lighter blue on hover |
| **Accent dim** | `#1A3872` | Low-emphasis structural fills |
| **Status: in progress** | `#D4A843` | Amber — darker golden |
| **Status: looking** | `#F5C830` | Same as pop — actively raising / seeking |
| **Status: complete** | `#7CB342` | Warm green |
| **Error** | `#E5494D` | Form validation, destructive confirmations |
| **Success** | `#7CB342` | Confirmations (reuse complete) |
| **Link** | `#F5C830` | Inline text links |
| **Text on pop** | `#0A0A0A` | Dark text on yellow CTA button |
| **Text on accent** | `#F0EDE8` | Cream text on blue structural elements |

**Dark canvas only.** No light-mode variants. The palette is calibrated for near-black + Kodachrome yellow + F91W Royal Blue. The canvas is neutral — no warm brown tones. Two functional colours sit on it; neither decorates.

---

### Pop Colour Usage Rules

Pop (`#F5C830`) is the editorial signal against near-black. It marks what is active, important, or alive — like the yellow LCD indicator on an F91W.

**Use pop colour for:**
1. Section label numbers (`01 / SYNOPSIS`)
2. Active sidebar item (left border + text + LED pulse)
3. Active sidebar focus
4. Primary call-to-action button (one per page)
5. Focus rings on form inputs (yellow ring at 4px offset)
6. Status badges where status === "looking"
7. The `:focus-visible` outline globally
8. Inline text links
9. Completion indicators (yellow ✓ on pricing tiers)

**Use text primary `#F0EDE8` for:**
1. Body text
2. Primary headings
3. Button text on dark backgrounds (`text-text-primary`)

**Never use pop colour for:**
1. Decorative backgrounds, gradients, or accents that aren't marking something live
2. Body copy
3. Non-interactive decorative elements

**The test:** Strip every pop-coloured element from a page. The page must still read as a structured composition. Pop is the signal, not the scaffold.

---

### Accent Colour Usage Rules

Accent (`#2755A1`) is the structural field — like the Royal Blue face of an F91W. It marks what's stable and functional, never what's live.

**Use accent colour for:**
1. Secondary CTAs, when a primary yellow CTA is already present on the page
2. Informational badges — version numbers, plan indicators, non-active status
3. Selected states in multi-step flows where yellow would incorrectly read as "live"
4. Pro/Studio tier highlights — tier-specific UI differentiation

**Never use accent colour for:**
1. The same element as pop — yellow and blue never share a component
2. Anything meant to signal "active" or "live" (that's yellow's job)
3. Decorative accents or gradients

**The test:** Strip every accent-coloured element from a page. The page must still read as alive (yellow does that job) — accent is structure, not signal.

---

### Typography

| Use | Font | Style | Weight | Size |
|-----|------|-------|--------|------|
| **Hero display** | Newsreader | Upright. No single-word italic or colour accents | 400-500 | `clamp(64px, 14vw, 200px)` |
| **Section heading** | Newsreader | Upright | 400-500 | `clamp(40px, 6vw, 80px)` |
| **Pitch view title** | Newsreader | Upright bold | 700 | `clamp(64px, 14vw, 200px)` uppercase |
| **Navbar wordmark** | Newsreader | Bold uppercase | 700 | `20px` tracking-tighter |
| **Auth heading** | Newsreader | Italic | 400 | `48px-56px` |
| **Body** | Inter | Regular | 400 | `16-17px` / `26-28px` line-height |
| **Small / caption** | Inter | Regular | 400 | `13-14px` / `20-22px` line-height |
| **Section labels** | JetBrains Mono | — | 700 | `10-11px` uppercase tracking-[0.20-0.25em]; only where the label carries information (metadata, status), never as an eyebrow above a heading |
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
- Background: `bg-pop` (`#F5C830`)
- Text: `text-background` (`#0A0A0A`) — near-black on yellow for high contrast
- Padding: `px-[32px] py-[16px]`
- Font: Newsreader bold uppercase tracking-tighter, `text-[14-15px]`
- Border radius: 0
- Hover: `bg-pop-hover` (`#F7D24A`) + scale (0.98 on press)
- Disabled: `opacity-50 cursor-not-allowed`
- Idle: subtle LED breathing pulse (opacity 0.85 → 1.0 over 4s, reduced-motion-safe)

**Secondary** (alternative actions: "Cancel", "Preview", "Learn more")
- Background: transparent
- Border: `1px solid #262626`
- Text: `text-text-primary` (`#F0EDE8`)
- Hover: `border-pop` border colour shift
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

**Anti-template rules (frontend-design audit, 2026-11-13):** no eyebrow labels or `01 /` numbering unless the content is a real sequence; no single word italicised or coloured in a headline; no `→` on buttons or links; no spaced em dashes in UI copy (use a colon, comma or full stop); feature lists are sentence-case Inter, not mono caps.

**Button copy:** UPPERCASE. Action verb first. Six words max ("Create your first project", "Share this draft").

---

### Form Inputs

**Standard inputs** (editor, create/edit forms)
- Background: `bg-surface` (`#131313`)
- Border: `1px solid #262626`
- Border radius: 0
- Padding: `12px 16px`
- Font: 15px Inter, `text-text-primary`
- Focus: yellow ring at 4px offset (`outline: 2px solid #F5C830; outline-offset: 4px`)
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
- Status badge: yellow LED pulse if "looking"
- Card hover: subtle lift (`translate-y-[-2px]`)

**Section container (editor)**
- Background: `bg-surface`
- Border: `1px solid #262626`
- Border radius: 0
- Padding: `24px`

---

### Status Badges

- Background: transparent
- Border: `1px solid` of the status colour
- Text: status colour, mono 10px uppercase tracking-[0.2em]
- **Looking** badge: yellow LED pulse (4s breathing, reduced-motion-safe)
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
- Primary CTA: yellow Primary button (with LED pulse)
- Sound toggle: small icon button on the right (default OFF state shown)

**Pitch view top bar**
- Fixed, `backdrop-blur-sm bg-background/90`
- Project name: Newsreader italic `text-[18px]` bold tracking-tighter
- Version: mono `9px` uppercase tracking-[0.2em] `text-text-disabled`
- Border bottom: hairline

**Dashboard sidebar**
- Width: `w-64` (256px)
- Background: `bg-surface` darker variant (`#131313`)
- Border right: hairline
- Section rows: `01 / SECTION NAME` — mono bold uppercase tracking-[0.15em] `text-[10px]`
- Active row: `border-l-2 border-pop`, text in pop, LED breathing pulse on the section number
- Inactive row: `border-l-2 border-transparent text-text-disabled hover:text-text-primary`

---

### Section Labels

Section labels follow the `01 / SECTION NAME` format:

```
font-mono text-[10px] uppercase tracking-[0.25em] text-pop font-bold
```

**Exception — pitch view left column:** number only (`01`), sticky (`md:sticky md:top-[88px]`). The section heading beside it already carries the name; `01 / SYNOPSIS` next to a "Synopsis" heading reads twice. (Decided 2026-07-07.) The full `01 / SECTION NAME` format remains for contexts without an adjacent heading (editor sidebar, dashboard).

---

### Landing Page Pattern (the most important page)

**Core law: scroll is the narrative. Every section advances the argument with a new visual, not a new paragraph.**

The landing page is not a feature list. It is not a SaaS template. It is a one-page film about what this product does — where the scroll reveals the story frame by frame.

---

#### What is banned — explicitly, permanently:

- **Bento grids** ("Editor / Dashboard / Distribution" tiles with a dot and a number)
- **"Every tool a filmmaker needs"** — or any variant of this headline pattern. Generic. Meaningless. Applies to Photoshop, Notion, and Google Docs equally.
- **Feature enumeration as headings** — "Build. Share. Version. Fund." as a 4-column grid with one-line descriptions is dead. If the copy could appear on any SaaS landing page, it doesn't belong here.
- **Abstract decorative motion** — floating shapes, gradient drift, ambient pulse behind text
- **Stat grids** that aren't earned ("3 min / 1 link / 0 decks") — if these stay, they need cinematic context, not a white card on a dark background
- **"How it works" as a section title** — this is the 2019 SaaS pattern. Show it working. Don't explain how it works.
- **Icon + headline + paragraph** three-column feature sections

---

#### The approved landing page structure:

**Section 0 — Hero (above the fold)**
- Left (5/12): Headline at display scale + one-line subtitle + primary CTA
- Right (7/12): Live rotating pitch demo — a real pitch page cycling through Fiction / Documentary / Ad Film. Browser chrome. Actual poster images. Auto-advances. Genre tabs to switch.
- Approved headline: "Present your work. / Fund your vision. / *Properly.*" — Newsreader, cream, last word italic in pop yellow.
- No callout dots. No explanatory overlays on the demo. The demo speaks for itself.

**Section 1 — Features**
- Three alternating rows: copy left/visual right, visual left/copy right
- Each row: a single feature (Build, Share, Fund) with a UI mock next to it
- The UI mocks are real product interface recreations — editor sidebar, share controls, funding widget. Not icons. Not illustrations. The actual product.
- Each row enters via a simple staggered fade-in on mount (see Motion section). Scroll-triggered reveal choreography is a future aspiration, not yet built — see "Scroll Reveals" below.

**Section 2 — Stats (if kept)**
- Earn the numbers with context or remove them
- Minimum: a visual anchor for each stat, not plain text on a grid

**Section 3 — Pricing**
- Three tier cards. Pro gets subtle yellow edge glow.
- Keep as-is structurally.

**Section 4 — Final CTA**
- Big editorial heading, italic serif. Not "Begin the cut." Something clean: "Your project. One page."
- Yellow primary CTA button.
- Two words max on the heading per line.

**Section 5 — Footer**
- Wordmark + links. Clean. No fluff.

---

#### Scroll-as-storytelling — future aspiration, not yet built

**Status: not implemented.** No scroll-linked reveal system exists in the codebase today (no IntersectionObserver, no scroll-triggered choreography). What's actually live is a simple staggered fade-in that triggers on mount (see "Scroll Reveals" under Motion & Interactions below). The following describes a target for a future page, evaluated when a page's content genuinely calls for it — not a current requirement:

1. **Content enters with intention** — not every paragraph fades up identically. A hero demo could enter from below; features could enter from the side or expand; stats could count up.
2. **Something visual anchors every scroll step** — no two consecutive text-only sections.
3. **The product is always visible** — within 400px of scroll, something from the actual UI is on screen.
4. **Pinned / sticky visuals** — consider a section where the left UI mock stays pinned while the right copy scrolls through multiple states. (Apple-style horizontal scroll or sticky image.)
5. **Reduced-motion fallback** — all reveals collapse to instant opacity. No layout dependency on the animation state.

Restraint still governs: model any future scroll system on Stripe, Linear, or A24's site — functional and controlled, not spectacle.

---

### Pitch View Page (the showpiece public output)

A24 press kit in a screening room.

**Hero (`PitchViewHero`)**
- Full `min-h-screen`
- Poster image: `opacity-60` warm-toned, absolute fill behind content
- Title: Newsreader bold `clamp(64px, 14vw, 200px)` uppercase `tracking-[-0.03em]`
- Logline: `border-l border-pop/30 pl-[24px]` italic `text-[22-28px]`
- Status badge (top right): LED pulse if "looking"

**Top bar (`PitchViewTopBar`)**
- Project name italic serif left; right side: `FUNDING` anchor (only when a public funding campaign exists) + version mono
- No per-section tabs — pitches carry a variable number of optional sections (moodboard, flow, script docs, …) and a tab row can't scale with them. The scroll is the navigation. (Decided 2026-07-07.)

**Metadata strip (`PitchViewMetadata`)**
- `bg-surface`, mono labels, status in `text-pop`
- Compact funding bar right-aligned (static pop fill + percent, links to `#funding`) when the pitch is publicly raising — the upfront funding signal without turning the hero into a campaign page. LED breathing stays exclusive to the funding widget's own bar.

**Content sections (`PitchViewSection`)**
- `px-[48px] md:px-[96px] py-[96px]`
- 12-col grid: 2-col sticky pop label / 10-col content
- Section heading: Newsreader `clamp(40px, 6vw, 80px)` tracking-[-0.02em]
- Body: Inter `text-[16-17px]` leading-[28-30px] `text-text-secondary`
- Images: hover slightly brightens
- Fade-up entrance stagger (80ms increments), triggers on mount — scroll-linked per-section reveal is a future aspiration, not yet built (see Motion & Interactions below)

**Cast cards (`PitchViewCards`)**
- Variant `cast`: 3-col portrait grid, `aspect-[3/4]` placeholder, role in pop mono, name in Newsreader `text-[28px]`
- Variant `team`: horizontal list, square placeholder, role in pop mono, name in Newsreader `text-[32px]`

**Funding widget (`PitchViewFunding`)**
- Progress bar in pop yellow — LED breathing on the bar when actively raising
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
- Active sidebar item (the yellow section number)
- Primary CTA at rest (the button background)
- "Looking" status badge
- Funding progress bar when actively raising

**Mount Fade-In** (live, actually implemented today)

A simple staggered fade-up that triggers when content mounts — no scroll linkage, no observer. This is the real motion pattern on the pitch view page today.

```css
/* animate-fade-up / animate-fade-up-subtle, staggered via inline animationDelay in 80ms increments */
```

Reduced-motion: instant opacity-only.

**Scroll Reveals — future aspiration, not yet built**

**Status: not implemented.** No IntersectionObserver or scroll-linked reveal system exists in the codebase. If built in the future, model it on Stripe/Linear/A24-style restraint:

```ts
const ease = "cubic-bezier(0.16, 1, 0.3, 1)"  // cinematic
const duration = "600ms"
const stagger = "80ms"
// element: opacity-0 translate-y-8 → opacity-100 translate-y-0
```

Reduced-motion: instant opacity-only.

**Page Transitions**

None. Instant route change. Motion happens inside pages, not between them.

**Active "Light Up"**

When something becomes active (clicking a sidebar item, opening a modal, focusing an input), the yellow briefly ramps up from dim to full over 200ms, then settles to the static or pulsing yellow state. Reduced-motion: instant.

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

The film grain overlay stays — it adds subtle texture.

- Fixed-position `body::before` overlay
- `~5%` opacity
- Slightly warm-tinted noise (a touch of yellow rather than pure white grain)
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
- LED pulse radius smaller (lower compute)
- Mount fade-in preserved (lightweight, no observer cost)

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
- LED pulse and fade-in reveals are visual-only — no semantic dependency

**Reduced motion:**
- All animations stop or collapse
- `prefers-reduced-motion: reduce` honoured in `globals.css` and component-level

**Sound:**
- Default off respects users who don't want audio
- Toggle reachable via keyboard

---

## Creation Experience

**Sidebar = editorial step sequencer. Main area = clean writing surface.**

- Left: 256px sidebar (`#131313` darker surface)
- Right: editor with `#131313` surface sections
- Active section: pop-coloured left border, LED-pulsing section number
- Optional sections added explicitly via `+ Add section` panel
- Save indicator: yellow flash when saving, settles to dim
- AI image gen button: yellow icon with LED pulse while generating

---

## Final Design Principle

**The product is the hero. The yellow is the signal. The blue is the structure.**

Near-black canvas. Cream-white type. One yellow indicator that breathes.

The screening room is quiet now. The product glows. The creator is at the desk.

Restrain. Show. Respect.
