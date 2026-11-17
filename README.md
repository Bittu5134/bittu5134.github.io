# bittu.dev

My personal website. I showcase my projects and experience, and write blog posts occasionally.

Live: https://bittu.dev

## Stack

```text
Eleventy · Tailwind CSS · Pagefind · Shiki · KaTeX · Mermaid
GitHub Pages
```

## Features

- Projects & experience
- Occasional blog (RSS, tags, reading time)
- Full-text search
- Syntax highlighting, math, Mermaid diagrams, footnotes

## Links

```text
RSS      https://bittu.dev/rss.xml
Email    hello@bittu.dev
GitHub   https://github.com/Bittu5134
X        https://x.com/LostSquidXD
LinkedIn https://www.linkedin.com/in/bittu5134
```

## Run

```bash
npm install
npm run dev     # local dev
npm run build   # production build -> dist/
```

## Project layout

```text
blogs/            Blog posts (Markdown) + their Eleventy data file
src/              Eleventy templates, layouts, macros, data and Tailwind entry CSS
assets/           Authored static files, copied verbatim to /assets/
  css/            Hand-written CSS (giscus theme)
  icons/          Generated UI / brand / tech SVG icons
  images/         All site imagery
    blog/         Post covers and inline post images
    blocks/       Minecraft block-art decorations
    decorations/  Sprite decorations used around the page
    minecraft-ui/ Minecraft UI empty-state sprites
  js/             Client-side JavaScript bundles
  fonts/          Subsetted fonts (generated)
fonts/masters/    Original font files fed to scripts/generate-fonts.py
public/           Files that must live at the site root (CNAME, favicons,
                  redirects) plus generated robots/sitemap/llms feeds
scripts/          Build scripts and shared helpers
  markdown/       Remark/Rehype plugins
```
