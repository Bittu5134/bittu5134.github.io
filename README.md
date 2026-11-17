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

> Don't run `npm run dev` and `npm run build` at the same time: the dev
> server's watcher rebuilds `dist/` on every `public/` write and will clobber
> the production build's minified bundles mid-build.

## Project layout

```text
blogs/            Blog posts (Markdown) + their Eleventy data file
  assets/         Post media, co-located with the posts (covers/, shared/, <slug>/)
src/              Eleventy templates, layouts, macros, data and Tailwind entry CSS
public/           Eleventy's passthrough root, copied verbatim to dist/
  assets/         Static files served from /assets/
    css/          Hand-written CSS (giscus theme)
    icons/        Generated UI / brand / tech SVG icons
    images/       Site imagery (scenes/, entities/, mini_scene/)
    js/           Client-side JavaScript bundles
    fonts/        Subsetted fonts (generated)
  CNAME, favicons, plus generated robots/sitemap/llms feeds
fonts/masters/    Original font files fed to scripts/generate-fonts.py
scripts/          Build scripts and shared helpers
  markdown/       Remark/Rehype plugins
```
