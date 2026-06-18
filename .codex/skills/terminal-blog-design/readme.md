# Terminal Engineering Blog — Design System

A design system for a **personal staff-engineering blog** covering distributed systems, Elixir/the BEAM, and LLM agent development. Aesthetic direction: **terminal / brutalist** — monospace-forward, stark, dark by default, with a single signature orange accent. Code is treated as a first-class visual element, not an afterthought.

> **Sources:** This system was designed from scratch — there is no pre-existing codebase, Figma, or brand to import. **The blog has no name** (it's destined for GitHub Pages) — so the identity is deliberately nameless: the orange `>_` terminal mark plus a live `~/path` prompt that doubles as a breadcrumb. Nothing needs to be "swapped in" later; if a name ever arrives, it slots beside the mark.

---

## How it's organized

| Path | What's there |
|------|--------------|
| `styles.css` | Root entry point — `@import` list only. Consumers link **this one file**. |
| `tokens/` | CSS custom properties: `colors`, `typography`, `spacing`, `radii`, `shadows`, `motion`, `fonts`, plus a light `base.css`. |
| `components/` | Reusable React primitives (`core/`, `content/`, `forms/`). Each has `.jsx` + `.d.ts` + `.prompt.md` + a `@dsCard` HTML. |
| `ui_kits/blog/` | Full interactive recreation of the blog (home / article / archive / about). |
| `guidelines/` | Foundation specimen cards (Type, Colors, Spacing, Brand) shown in the Design System tab. |
| `assets/` | `favicon.svg`, `wordmark.svg`. |
| `SKILL.md` | Agent-Skill manifest so this folder works as a downloadable Claude Skill. |

The compiler discovers everything from file content + sibling relationships; folder names are just for humans. The component namespace is **`window.DesignSystem_edb739`**.

---

## CONTENT FUNDAMENTALS

How copy is written across the brand.

- **Voice.** First person, direct, a little dry. Hard-won opinions stated plainly, then defended. Confident but self-aware — willing to say "I was wrong about this."
- **Person.** Mostly **I** (the author's experience) and **you** (the reader, conversationally). Never corporate "we."
- **Casing.** Headlines and prose are **sentence case**, never Title Case. UI labels, nav, tags, overlines and metadata are **lowercase or UPPERCASE mono** (e.g. `WRITING`, `2026 · 05 · 12 — 14 MIN`, `// now`, `$ ./blog --list`).
- **Tone.** Declarative and a touch contrarian. Titles make a claim: *"Supervision trees are a lie you tell yourself,"* *"The eval loop is the product."* Avoid clickbait; the claim must be real.
- **Technical specificity.** Real tools, real numbers (`40k processes`, `recon`, `:observer`, `OTP 27`). Specificity *is* the credibility.
- **Terminal idiom.** Shell/REPL phrasing as flavor: `$ grep -r --tag`, `← cd ~/writing`, `// note`, `>_`. Used sparingly as seasoning, not on every line.
- **Emoji.** **None.** The accent texture comes from monospace glyphs (`→ ↗ · // $ ~/`), never emoji.
- **Numbers & dates.** Dates render spaced and dotted: `2026 · 05 · 12`. Read time is `N min`. Post indices are zero-padded (`01`, `02`).
- **Examples.**
  - **Overline:** `$ ./blog --list --recent`
  - Hero: *"Staff engineer. Notes from the distributed trenches."*
  - Callout: *"A supervisor restarting 10k children is not a recovery strategy. It is a denial-of-service you scheduled against yourself."*

---

## VISUAL FOUNDATIONS

- **Palette.** Near-black canvas (`--bg #0f0f0f`), a carbon greyscale (`carbon → line → ash → smoke → fog → bone`), and **one** accent: orange `#ff5c35`. The accent is rationed — links, the primary button, the active tag, the `.` in the wordmark, the numeric post index. Status colors (green/amber/red/blue) appear only in badges and callouts.
- **Light theme.** Opt-in via `[data-theme="light"]` — warm **paper** (`#f5f3ec`) with near-black ink and black hairline rules (high-contrast, brutalist). Dark is the default identity. **Code blocks stay dark in both themes** — a deliberate rule that keeps the terminal feel.
- **Logo / identity.** Nameless. The logo is the orange `>_` square (a terminal prompt). The "wordmark" is a live `~/path` prompt with a blinking cursor — `~/` on home, `~/tags`, `~/about`, `~/writing` on a post — so the header brand doubles as a breadcrumb. The `~` and cursor are always the accent. Assets: `assets/favicon.svg`, `assets/wordmark.svg`.
- **Type.** Two monospace families. **Space Mono** (700/400) for display, wordmark, headlines and big numerics — characterful, slab-edged. **JetBrains Mono** (400/500/700) for body prose, code, UI and metadata. No sans, no serif. Tracking is tight on display (`-0.02em`), wide+uppercase on labels (`0.15em`).
- **Spacing.** Strict 4px grid (`--space-1..16`). Reading measure `720px`; index/wide views `1080px`.
- **Backgrounds.** Flat solid surfaces — **no gradients, no meshes, no imagery, no texture**. Atmosphere comes from hairline borders, the bright `--border-strong` rule, and ASCII dividers — not decoration. (The direction-study exploration used scanlines; the chosen *Manifest* direction does not.)
- **Corners.** Square is the default (`--radius-none`). `2px` (`--radius-sm`) for most controls, `3px` for code blocks and the logo mark. Only tags and status dots are pill/round.
- **Borders.** 1px hairline `--border` (`#2a2a2a`) everywhere; a 2px **bright** rule (`--border-strong`, bone in dark / black in light) for top bars and structural divisions.
- **Shadows.** Flat by default. The signature is a **hard offset shadow with no blur** (`--shadow-hard: 4px 4px 0`), like a printed drop. Interactive cards translate up-left toward an **orange** hard shadow on hover. Soft blurred shadows (`--shadow-pop`) are reserved for floating layers (menus, dialogs).
- **Cards.** Hairline-bordered square surfaces on `--surface` (`#151515`). `flat` (default), `raised` (hard shadow + bright border), `interactive` (lifts toward orange shadow). No rounded-corner + colored-left-border cliché — accents are bars on callouts only.
- **Hover.** Text → accent orange; bordered elements → border brightens to `--border-strong`; cards translate `-2px,-2px` and grow an orange hard shadow. Links underline.
- **Press.** Snap, don't bounce. The primary button **translates into its own shadow** (`translate(2px,2px)` + shadow collapses) — a physical "key press." Other controls nudge `1px`.
- **Motion.** Minimal and fast. Durations 60–240ms, default ease `--ease-snap` (`cubic-bezier(0.5,0,0,1)`) — quick out, hard stop, like a terminal repaint. No infinite/decorative loops. The only blink is an optional cursor.
- **Transparency / blur.** Used in exactly one place: the sticky header (`backdrop-filter: blur(10px)` over an 88%-opaque bg). Otherwise surfaces are opaque.
- **Layout rules.** Sticky header with the 2px bright bottom rule. Numeric `01/02` index column on post rows. Right rail (subscribe + topics) on the home index. Single-column reading measure on articles.

---

## ICONOGRAPHY

- **Primary set — monospace glyphs.** The native icon system is just characters rendered in the mono font: `>_` (prompt / logo mark), `→` next, `←` back, `↗` external link, `·` separator, `//` note marker, `!!` warning, `>>` tip, `$` shell, `~/` path. They cost nothing, scale with type, and are 100% on-brand. This is the **default** — reach for a glyph before an icon.
- **Rich UI — Lucide.** When a true icon is needed (rss, search, github, terminal, git-branch, clock, copy), use **[Lucide](https://lucide.dev)** at **1.5px stroke** — its thin, geometric, square-cap style matches the brutalist line work. Loaded from CDN: `<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>` then `lucide.createIcons()`. See `guidelines/brand-iconography.card.html`.
  - *Substitution flag:* Lucide is a **recommended substitute**, not an imported brand asset (there was no original icon set). Swap it if you adopt a different family.
- **No emoji.** Ever. **No PNG/sprite icon fonts.** The only bespoke SVGs are `assets/favicon.svg` and `assets/wordmark.svg` — both type/geometry, no illustration.

---

## Components (`window.DesignSystem_edb739`)

| Component | Group | Summary |
|-----------|-------|---------|
| `Button` | core | Primary (orange fill + hard shadow) / secondary / ghost / danger; sm·md·lg. |
| `Tag` | core | Bordered uppercase topic label; `active`, `count`, interactive. |
| `Badge` | core | Status pill with glowing dot; neutral/accent/success/warning/danger/info. |
| `Card` | core | Square bordered surface; flat / raised / interactive. |
| `Rule` | core | Divider — solid / dashed / ascii, optional label. |
| `ThemeToggle` | core | Segmented dark/light switch, sets `[data-theme]`. |
| `CodeBlock` | content | **Hero element.** Dark terminal surface, filename header, line numbers, copy, Elixir/JS/shell highlighting. |
| `Callout` | content | Prose aside — note / tip / warning / danger. |
| `Input` | forms | Square text field, uppercase label, prefix, error, orange focus ring. |

Read each component's `.prompt.md` for usage + variants.

## UI Kits

- **`ui_kits/blog/`** — the blog: interactive home → article → archive → about, dark/light. See its `README.md`.

## Starting Points

- `Button`, `CodeBlock` (component starting points, tagged in their `.d.ts`).
- `ui_kits/blog/index.html` — full blog screen.
