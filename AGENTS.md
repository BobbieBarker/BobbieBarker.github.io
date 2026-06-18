# Agent Notes

- Use the project skill at `.codex/skills/publish-blog-article/SKILL.md` for creating, validating, previewing, and publishing articles.
- Use the project skill at `.codex/skills/terminal-blog-design/SKILL.md` for design implementation, visual styling, tokens, assets, and prototype fidelity.
- Use `.codex/skills/astro-framework/SKILL.md` for non-trivial Astro implementation, content collections, routing, hydration decisions, and deployment configuration.
- Use `.codex/skills/astro/SKILL.md` as a lightweight Astro reference for simple `.astro` pages/components, static generation, and CLI reminders.
- Use `.codex/skills/web-quality-audit/SKILL.md` and its companion skills (`performance`, `core-web-vitals`, `accessibility`, `seo`, `best-practices`) for final launch QA and targeted web-quality reviews.
- Keep the site a simple public Astro/GitHub Pages blog. Do not add auth, CMS, databases, comments, or newsletter tooling unless explicitly requested.
- Canonical article content lives in `src/content/writing/` and publishes at `/writing/<slug>/`; `/blog` exists only as compatibility redirects.
- Prefer project aliases such as `make dev`, `make build`, `make new TITLE="..."`, and `bin/blog ...` over raw `npm run` commands.
