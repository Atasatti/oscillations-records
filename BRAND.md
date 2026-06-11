# Oscillation Records — Brand Design Sheet

> **A Record Label That Puts Artists First**

The single source of truth for the Oscillation Records visual identity. The factual tokens
(color, type, radius) are taken from the live design system ([app/globals.css](app/globals.css),
[app/layout.tsx](app/layout.tsx), and the logo assets). The newer art-direction sections define
the *target* experience and current best practice.

**Status legend** — `(now)` is in code today; `(next)` is brand direction to build toward.

---

## 1. Name & tagline

| Field | Value |
| --- | --- |
| **Name** | Oscillation Records *(singular "Oscillation")* |
| **Tagline** | A Record Label That Puts Artists First |
| **Short descriptor** | Independent, artist-first record label |

**Writing the name**

- Always **Oscillation Records** — never "Oscillations" (plural), "Oscillation Recordz", or "OR" in body copy.
- The casual handle `oscillationrecordz` exists only as the admin account login and is **not** public-facing brand copy.
- The web/domain form is `oscillationrecords.com`.

---

## 2. Logo

| Asset | File | Use |
| --- | --- | --- |
| Icon mark | [public/logo-icon.svg](public/logo-icon.svg) | Favicons, avatars, tight spaces, app/nav corner |
| Wordmark | [public/logo-name.svg](public/logo-name.svg) | Headers, footers, anywhere with horizontal room |
| Tab / source image | [public/logo-tab.jpeg](public/logo-tab.jpeg) | Raster source for the browser-tab icon |

**Wordmark construction** — the wordmark is two-tone: the primary word renders in
**white (`#FFFFFF`)** and the secondary word in **graphite (`#454545`)**. Preserve this
two-tone relationship; do not recolor one word without the other.

**Clear space** — keep padding around the logo equal to the height of the icon mark on all sides.

**Don'ts**

- Don't stretch, skew, or rotate.
- Don't add drop shadows, gradients, or outlines.
- Don't place the white wordmark on a light background — use the dark surface (see §4) or an inverted treatment.
- Don't recreate the wordmark in a different typeface.

---

## 3. Art direction — how Oscillation stands out

The brand is **monochrome, dark-first, and cinematic**. We don't compete on color or decoration —
we compete on **type, motion, space, and texture**. The current award-gallery tier (Awwwards-style)
is defined less by ornament and more by *emotive, cinematic, human* experiences where motion carries
meaning and minimalism is purposeful. Our signature moves:

1. **Type as the hero `(next)`** — headlines are the artwork, sized like movie titles, not tucked
   above the fold. Pair with restraint everywhere else. (See §5.)
2. **Cinematic scroll `(now/next)`** — scrolling reveals scenes progressively (pinned sections,
   stacked imagery, staged reveals). `ScrollReveal3D` is the seed of this; extend it into deliberate
   scene choreography rather than uniform fade-ins.
3. **Motion as communication `(now/next)`** — every transition means something. Slow, eased motion =
   craft and confidence; nothing bounces or flashes for its own sake. (See §7.)
4. **Monochrome with luminous contrast `(now)`** — on ink, white *is* the accent. Emphasis comes from
   contrast, scale, and space — not a second color. (See §4.)
5. **Refined glassmorphism `(now)`** — frosted, architectural surfaces used selectively for hierarchy
   (the navbar already does this), never as decoration everywhere.
6. **Intentional imperfection `(now/next)`** — a faint film grain (now live, see §6) and occasional
   editorial asymmetry (next) add warmth and a tactile, analog-record feel against the digital flatness.
7. **Audio-visual unity `(next)`** — it's a music site: let sound and motion connect (waveform motifs,
   subtle audio-reactive accents on the player, artwork-led pages). Multimedia integration is the
   single biggest differentiator for music sites.
8. **Performance is part of the aesthetic `(now)`** — a "luxury" feel collapses if it's slow. Animation
   weight, image optimization, and smooth interaction are design requirements, not afterthoughts
   (see [PERFORMANCE.md](PERFORMANCE.md)).

---

## 4. Color

Dark-first (the root `<html>` ships with the `dark` class). The palette is intentionally
monochrome — ink, white, and a graphite/grey ramp — with red reserved exclusively for
destructive/error states.

Colors are authored in **OKLCH** (the canonical values in `globals.css`); hex equivalents are
**approximate**, for design tools only. OKLCH keeps perceived lightness consistent across the ramp,
which is what stops a monochrome UI from "vibrating" or looking lopsided.

### Core

| Token | OKLCH (canonical) | Hex (approx) | Role |
| --- | --- | --- | --- |
| Ink / Surface | `oklch(0.1684 0 0)` | `#0F0F0F` | Primary dark background |
| White | `oklch(1 0 0)` | `#FFFFFF` | Primary text on dark, primary wordmark |
| Graphite | — | `#454545` | Secondary wordmark, low-emphasis marks |

### Dark theme ramp (default)

| Token | OKLCH | Hex (approx) | Role |
| --- | --- | --- | --- |
| `--background` | `oklch(0.1684 0 0)` | `#0F0F0F` | Page background |
| `--foreground` | `oklch(1 0 0)` | `#FFFFFF` | Body text |
| `--primary` | `oklch(0.922 0 0)` | `#E5E5E5` | Primary buttons / emphasis |
| `--muted-foreground` | `oklch(0.708 0 0)` | `#A1A1A1` | Secondary text, captions |
| `--secondary` / `--muted` / `--accent` | `oklch(0.269 0 0)` | `#262626` | Cards, hovers, fills |
| `--border` | `oklch(0.2221 0 0)` | `#1B1B1B` | Hairlines, dividers |
| `--input` | `oklch(0.1913 0 0)` | `#141414` | Field backgrounds |
| `--destructive` | `oklch(0.704 0.191 22.216)` | `#F1554F` | Errors, delete actions only |

### Light theme ramp

| Token | OKLCH | Hex (approx) | Role |
| --- | --- | --- | --- |
| `--background` | `oklch(1 0 0)` | `#FFFFFF` | Page background |
| `--foreground` | `oklch(0.1684 0 0)` | `#0F0F0F` | Body text |
| `--muted` / `--secondary` / `--accent` | `oklch(0.97 0 0)` | `#F5F5F5` | Cards, fills |
| `--muted-foreground` | `oklch(0.556 0 0)` | `#737373` | Secondary text |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `#E5484D` | Errors, delete actions only |

### Accent strategy (monochrome discipline)

We are deliberately **single-hue (achromatic)**. Rather than adding a brand color, create emphasis with:

- **Lightness contrast** — pull a CTA or headline to white/`--primary` against ink; push supporting
  text to `--muted-foreground`. The jump in L *is* the accent.
- **Scale & weight** — a huge light headline outranks any colored button.
- **Space** — isolation (see §6) makes an element loud without decoration.
- **Motion** — a single eased reveal draws the eye where color would in other brands.

Red (`--destructive`) is the **only** chromatic color and is reserved for destructive/error intent —
never decorative. If a future campaign needs a temporary accent, introduce **one** hue, give it the
same perceived L as its surroundings, and scope it to that campaign — don't add it to the core system.

### Surfaces, gradients & depth `(next)`

- Build elevation from the ramp: `background` → `input`/`#141414` → `secondary`/`#262626`, with
  `border` hairlines, instead of shadows.
- Gradients should be **near-monochrome and subtle** — e.g. a faint ink-to-`#141414` vertical wash, or
  a soft radial glow behind hero artwork. Avoid rainbow/duotone gradients; they fight the identity.

### Contrast & accessibility

- Target **WCAG 2.2**: body text ≥ 4.5:1, large text/UI ≥ 3:1.
- Technique: lock **L** for a text role and adjust only C/h to hit contrast — keeps the palette coherent.
- White on ink and ink on white both pass comfortably; the risk zone is mid-grey text
  (`--muted-foreground`) on mid-grey fills (`--secondary`) — avoid that pairing for anything readable.

---

## 5. Typography

Two Google fonts, loaded via `next/font` in [app/layout.tsx](app/layout.tsx).

| Family | CSS variable | Role | Weights |
| --- | --- | --- | --- |
| **Lato** | `--font-lato` | Primary — body & UI (the `<body>` default) | 100, 300, 400, 700, 900 |
| **Inter** | `--font-inter` | Secondary sans — supporting/system contexts | Variable (all weights) |

**Type voice** — the identity leans on **light weights** and **tight tracking**. Headings are
typically `font-light` with `tracking-tighter`; that restraint is core to the look.

### Fluid type scale `(now/next)`

Use `clamp()` so type scales smoothly between mobile and desktop instead of jumping at breakpoints
(fluid type + a clear scale is now baseline for premium sites). These tokens are **defined in
[app/globals.css](app/globals.css)** `(now)`; applying them across headings is the `(next)` step:

```css
--text-display: clamp(2.75rem, 7vw, 7rem);   /* hero / movie-title moments */
--text-h1:      clamp(2rem, 4.5vw, 4rem);
--text-h2:      clamp(1.5rem, 3vw, 2.5rem);
--text-h3:      clamp(1.25rem, 2vw, 1.75rem);
--text-body-lg: clamp(1.05rem, 1.2vw, 1.25rem);
--text-body:    1rem;                          /* never below 16px for body */
--text-caption: 0.8125rem;                     /* 13px, labels/meta */
```

### Rules

- **Display / H1–H2:** `font-light` (300) or `font-thin` (100) for the biggest moments, tracking
  `-0.02em` to `-0.04em`, line-height `0.95`–`1.05`. Tight, not airy.
- **Body:** weight 400, line-height `1.5`–`1.6`, measure ~60–75 characters.
- **Caption / meta:** 300–400, `--muted-foreground`, optional `+0.04em` tracking + uppercase for labels
  (already used as eyebrows, e.g. "ALL ARTISTS").
- **Emphasis:** 700/900 only for rare, strong callouts.

### Type as art direction `(next)`

- Treat hero headlines as the primary visual — oversized, near-full-bleed, the focal point of the page.
- **Variable fonts** (Inter is already variable) enable smooth weight/width animation and one
  lightweight file; prefer them for any animated text.
- **Kinetic type** in moderation — a headline that settles in weight on load, or tracks tighter on
  scroll — adds energy without color. Keep it tasteful and respect `prefers-reduced-motion` (§7).

### Don'ts

- Don't introduce additional typefaces.
- Don't set body copy in heavy weights — keep it 400.
- Don't widen letter-spacing on headings (the brand is *tight*, not airy).

---

## 6. Layout & composition (topology)

How elements are arranged in space — the structural "topology" of every page.

### Grid & measure

- **12-column** responsive grid (CSS Grid / Flexbox); content max-width ~`1280–1440px`, centered.
- Page gutter follows the current pattern: `px-4 → sm:px-6 → md:px-[10%]`. Keep the generous desktop inset.
- Use **modular/hierarchical grids** for catalog (cards) and **editorial asymmetry** for storytelling
  sections — break the grid intentionally for hero and feature moments `(next)`.

### Spacing scale (8-pt rhythm)

```text
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 (px)
```

Section vertical rhythm follows the live pattern (`py-14 → sm:py-20 → md:py-28`). Consistent spacing
tokens are what make a minimal layout read as *intentional* rather than empty.

### Whitespace & hierarchy

- Allocate **30–50% negative space**. In a monochrome system, space is the primary tool for emphasis —
  isolation makes an element prominent without color or borders.
- One clear focal point per viewport. Establish hierarchy with **size → weight → position → space**,
  in that order, before reaching for any other device.

### Depth without clutter

- Elevation comes from the surface ramp + hairline borders (§4), not heavy shadows.
- **Refined glassmorphism `(now)`** for floating chrome (navbar, the search panel, the player). Recipe:

```css
background: oklch(0.1684 0 0 / 0.7);
backdrop-filter: blur(20px) saturate(120%);
border: 1px solid oklch(1 0 0 / 0.10);
```

- **Film grain `(now)`** — a fixed, low-opacity noise overlay over dark surfaces adds a tactile,
  analog-record texture and stops large black areas from looking flat. Implemented as a `body::after`
  overlay in [app/globals.css](app/globals.css); tune strength with `--grain-opacity` (default `0.035`).

### Shape

| Property | Value | Notes |
| --- | --- | --- |
| Corner radius | `--radius: 0.625rem` (10px) | Plus `sm/md/lg/xl` derived steps |
| Surfaces | Flat, dark, minimal | Glass on floating chrome only |
| Scrollbars | Hidden via `.no-scrollbar` | For carousels / horizontal rails |

---

## 7. Motion & interaction

Subtle and functional — motion is the brand's main expressive tool, so it must feel deliberate.

### Principles

- **Meaning over flash.** Slow, eased motion conveys craft; nothing bounces or strobes for decoration.
- **Choreographed, not uniform.** Stagger reveals so a section composes itself; avoid every element
  fading identically.
- **Earned, not constant.** Reserve the big moves for hero/scene transitions; keep micro-interactions quiet.

### Tokens

| Use | Duration | Easing |
| --- | --- | --- |
| Micro (hover, focus, toggles) | 150–200ms | `ease-out` |
| UI transitions (panels, player) | 250–350ms | `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) |
| Section / scene reveals | 400–700ms | expo-out, with stagger |

The music player's `player-slide-up` (`slideUp`, 0.3s ease-out) and `ScrollReveal3D` are the existing
foundations — extend these rather than introducing new motion languages. Use [motion](https://motion.dev)
for entrance/scroll work.

### Scroll & cursor `(next)`

- **Cinematic scroll:** pin a section and reveal its content in stages; stack/parallax artwork for depth.
- **Cursor:** at most a subtle custom cursor or magnetic hover on primary CTAs — optional, never gimmicky.

### Accessibility

Always honour `prefers-reduced-motion: reduce` — drop to instant or minimal fades. Motion is an
enhancement, never a barrier. A global `prefers-reduced-motion` guard is enforced in
[app/globals.css](app/globals.css) `(now)`.

---

## 8. Voice & tone

- **Artist-first.** The label exists to serve artists; copy centers them, not the company.
- **Confident & minimal.** Few words, high signal. Mirrors the visual restraint.
- **Modern & warm.** Contemporary and human, never corporate or jargon-heavy.
- **Honest.** No hype or false scarcity.

**On-brand:** "A record label that puts artists first." / "New music from our roster."

**Off-brand:** "🔥 The #1 BEST label EVER!!!" / dense legalese in marketing surfaces.

---

## 9. Quick reference (copy/paste tokens)

```text
Name        Oscillation Records
Tagline     A Record Label That Puts Artists First
Ink         oklch(0.1684 0 0)   ~#0F0F0F
White       oklch(1 0 0)        #FFFFFF
Graphite    #454545
Error red   oklch(0.704 0.191 22.216) ~#F1554F (dark) / oklch(0.577 0.245 27.325) ~#E5484D (light)
Radius      0.625rem (10px)
Spacing     4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128
Body font   Lato (100/300/400/700/900)
Sans font   Inter (variable)
Heading     font-light + tracking-tighter, line-height ~1.0
Theme       dark-first, monochrome (color only for errors)
Motion      150–350ms UI / 400–700ms reveals, expo-out, respect reduced-motion
Glass       blur(20px) saturate(120%), bg ink/0.7, border white/0.10
```

---

## 10. Further reading (research behind §3–§7)

- [Web design trends dominating award galleries (2026)](https://www.topcssgallery.com/blog/web-design-trends-dominating-award-galleries/)
- [Awwwards — Music & Sound sites](https://www.awwwards.com/websites/music-sound/)
- [OKLCH, explained for designers (UX Collective)](https://uxdesign.cc/oklch-explained-for-designers-dc6af4433611)
- [OKLCH in CSS: consistent, accessible palettes (LogRocket)](https://blog.logrocket.com/oklch-css-consistent-accessible-color-palettes)
- [Typography trends — variable fonts, kinetic text (The Inkorporated)](https://www.theinkorporated.com/insights/future-of-typography/)
- [Modern web typography techniques (FrontendTools)](https://www.frontendtools.tech/blog/modern-web-typography-techniques-2025-readability-guide)
- [Visual hierarchy in web design (Clay)](https://clay.global/blog/web-design-guide/visual-hierarchy-web-design)
- [Asymmetric layouts in web design (HypEdge)](https://thehypedge.com/the-rise-of-asymmetric-layouts-a-bold-move-in-2025-web-design/)
