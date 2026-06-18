# UI Kit — Blog

Interactive, high-fidelity recreation of the **engineering blog**, built entirely from the design-system primitives in `components/`. This is a *recreation surface*, not a storybook — `index.html` boots an interactive click-through. The blog is **nameless** — its identity is the orange `>_` mark plus a live `~/path` prompt in the header.

## Run
Open `index.html`. It loads React + Babel + the compiled `_ds_bundle.js`, then mounts the screens. A tiny in-memory router (`App` in `index.html`) swaps screens — no real navigation.

## Flow
- **Home** → intro + featured post + numeric article index + subscribe / topics rail
- Click any post → **Article** (reading page; code blocks are the hero element)
- Click a tag anywhere → **Archive** (filter the index by topic)
- Header **about** → **About / now** page
- **ThemeToggle** in the header flips the whole system dark ⇄ light

## Files
| File | Role |
|------|------|
| `index.html` | Router + script loading + `@dsCard` / `@startingPoint` tags |
| `data.js` | Fake content (`window.BLOG_DATA`) — author, tags, posts (one with full body) |
| `chrome.jsx` | `Header`, `Footer`, `Wordmark`, `Mark`, `PostRow` |
| `Home.jsx` | `Home`, `FeaturedPost`, `SubscribeBlock` |
| `Article.jsx` | `Article`, `Block` (renders mixed prose/code/callout blocks) |
| `Archive.jsx` | `Archive` (tag filtering) |
| `About.jsx` | `About` (bio + now + stack table) |

## Notes
- Components are shared across Babel files via `Object.assign(window, {...})` — each `<script type="text/babel">` has its own scope.
- All visual primitives come from `window.DesignSystem_edb739` (Button, Tag, Badge, Card, Rule, CodeBlock, Callout, Input, ThemeToggle). The kit only adds layout + composition.
- The identity is nameless (the `>_` mark + `~/path` prompt in `chrome.jsx` `Prompt`). If a real name ever appears, add it beside the mark there.
