---
name: publish-blog-article
description: Use when working in this Astro/GitHub Pages blog to create, edit, validate, preview, commit, push, or publish engineering articles from Markdown/MDX files. Trigger for requests like "write a new post", "publish this article", "prepare an article for GitHub Pages", "validate the blog before publishing", or "cross-post with canonical URLs".
---

# Publish Blog Article

## Ground Rules

Work from the repository root. Prefer the project aliases over raw npm commands:

```sh
make dev
make build
make check
make preview
make new TITLE="Article title"
make status
```

Use `bin/blog ...` directly when passing arguments is easier. The project uses `asdf`; if `node` is missing or version-blocked, run `asdf install` before continuing.

Keep the blog simple: public Astro static site, Markdown/MDX articles, GitHub Pages deploy. Do not add auth, CMS, comments, databases, or newsletter tooling unless explicitly requested.

## Article Workflow

1. Inspect existing articles in `src/content/writing/` before creating or editing content.
2. Create a draft with:

   ```sh
   bin/blog new "Article title"
   ```

3. Edit the generated file in `src/content/writing/<slug>.md`.
4. Fill frontmatter:

   ```yaml
   ---
   title: 'Article title'
   date: 'YYYY-MM-DD'
   excerpt: 'One short summary for feeds, SEO, and link previews.'
   tags: ['topic']
   draft: true
   ---
   ```

5. Write or adapt the body in Markdown. Use MDX only when the article truly needs embedded components.
6. Set `draft: false` only when the article is ready to be public.
7. Run `make build` before considering the article ready.

Do not publish placeholder content. If source material is incomplete, create a draft file and stop before commit/push with a clear note about what is missing.

## Validation Workflow

Run:

```sh
make build
```

Confirm the build emits the expected article route, RSS feed, and sitemap. For a local preview, run:

```sh
make dev
```

Then inspect `http://127.0.0.1:4321/`, `/writing/<slug>/`, `/tags/`, and `/rss.xml`. If a dev server is already running, reuse it instead of starting another one.

## Publishing Workflow

Only push when the user has explicitly asked to publish or approved the prepared article.

1. Run `make build`.
2. Review `git status --short`.
3. Review the article diff and any metadata/layout changes.
4. Commit with a concise message, usually:

   ```sh
   git add .
   git commit -m "Publish <article title>"
   ```

5. Push `main`:

   ```sh
   git push origin main
   ```

6. GitHub Actions deploys the site to GitHub Pages.

If GitHub CLI or git auth fails, stop and report the exact auth command/error. Do not work around auth by changing remotes or credentials.

## Canonical URLs And Cross-Posting

The canonical article URL is:

```text
https://bobbiebarker.github.io/writing/<slug>/
```

When preparing a DEV.to mirror, include `canonical_url` pointing to the GitHub Pages article. When preparing a Medium mirror, import from the canonical URL rather than making Medium the original source.

## Design Boundary

Do not redesign the site while publishing an article. Keep publishing changes scoped to article content, frontmatter, and small metadata fixes unless the user explicitly asks for visual work.
