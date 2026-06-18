---
name: terminal-blog-design
description: Use this skill to generate well-branded interfaces and assets for a terminal/brutalist personal engineering blog (covering distributed systems, Elixir, and LLM development), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
---

Read the `readme.md` file within this skill, and explore the other available files (`tokens/`, `components/`, `ui_kits/`, `guidelines/`, `assets/`).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. Link `styles.css` for tokens; for the React primitives, either copy the component `.jsx` files or reference the compiled `_ds_bundle.js` (namespace `window.DesignSystem_edb739`). If working on production code, copy assets and read the rules here to become an expert in designing with this brand.

Key facts to internalize before designing:
- **Aesthetic:** terminal / brutalist. Monospace-forward, stark, dark by default, square corners, one orange accent (`#ff5c35`). No gradients, no emoji, no imagery — atmosphere comes from hairline borders, a bright structural rule, hard offset shadows, and ASCII glyph iconography. The brand is **nameless**: the logo is the orange `>_` mark + a live `~/path` prompt.
- **Type:** Space Mono (display/headlines) + JetBrains Mono (body/code/UI). Both monospace.
- **Code blocks are the hero element** and stay dark in both light and dark themes.
- **Voice:** first person, dry, opinionated, technically specific; sentence-case prose, UPPERCASE/lowercase mono labels; terminal idiom (`$`, `~/`, `//`, `>_`) as seasoning.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
