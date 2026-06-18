# BobbieBarker.github.io

Static engineering writing on Astro and GitHub Pages.

## Requirements

- asdf
- Node.js from `.tool-versions`
- npm

## Local Development

```sh
asdf install
npm install
make dev
```

The dev server runs at `http://localhost:4321`.

## Writing Articles

Create Markdown or MDX files in `src/content/writing/`.

```md
---
title: 'Article title'
date: '2026-06-17'
excerpt: 'A short summary for feeds, SEO, and link previews.'
tags: ['elixir']
draft: true
---

Article body goes here.
```

The file name becomes the canonical URL:

```text
src/content/writing/my-article.md -> /writing/my-article/
```

Generate a draft:

```sh
make new TITLE="How I debugged the thing"
```

Preview the generated file without writing:

```sh
make new TITLE="How I debugged the thing" DRY_RUN=1
```

Set `draft: false` when the article is ready for public indexes, RSS, sitemap, and navigation.

## Publishing

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages whenever `main` changes.

Before pushing the repository for the first time, configure GitHub Pages to use **GitHub Actions** as the Pages source.

## Useful Commands

| Command | Action |
| --- | --- |
| `make dev` | Start the local dev server |
| `make build` | Build the static site into `dist/` |
| `make check` | Alias for `make build` |
| `make preview` | Preview the production build locally |
| `make new TITLE="Title"` | Create a draft article |
| `make new TITLE="Title" DRY_RUN=1` | Preview the generated article file |
| `make status` | Show git status |

Use `bin/blog help` to see the direct command aliases.
