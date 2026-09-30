# Combined Performance, Accessibility, SEO & Network Analysis: bittu.dev

- **Target URL:** `https://bittu.dev/`
- **Data Sources:**
  1. Google PageSpeed Insights / Lighthouse 13.5.0 (Report ID: `br8o90eq91`, Desktop)
  2. Cloudflare Radar Browser Web Bot Session (`cloudflare-report.json`)
- **Generated on:** September 30, 2026
- **Hosting / CDN:** GitHub Pages (Fastly CDN, TLS 1.3, HTTP/1.1)

---

## Executive Summary

| Category | Score / Status | Key Highlight |
| :--- | :---: | :--- |
| **Performance** | **100 / 100** | FCP: 0.3s–0.5s, LCP: 0.5s, TBT: 0ms, CLS: 0.005 |
| **Agentic Browsing** | **100 / 100** | Full compliance with agentic discovery standards |
| **Best Practices** | **100 / 100** | Modern TLS 1.3, HTTPS, valid structure |
| **Accessibility** | **96 / 100** | Contrast failures on 4 badges + label/name mismatches |
| **SEO** | **92 / 100** | Invalid custom directives in `robots.txt` |

---

## 1. Core Web Vitals & Real-Time Performance

### Lighthouse Simulated Benchmarks vs. Cloudflare Live Browser Timings

| Metric / Milestone | Lighthouse (Simulated) | Cloudflare Browser (Live Trace) | Rating |
| :--- | :---: | :---: | :---: |
| **Time to First Byte (TTFB)** | ~3 ms (root) | 154 ms (request: 67ms → response: 221ms) | 🟢 Fast |
| **DOM Interactive** | — | 258.2 ms | 🟢 Fast |
| **First Contentful Paint (FCP)** | 338 ms (0.3 s) | 549.1 ms | 🟢 Good |
| **Largest Contentful Paint (LCP)** | 471 ms (0.5 s) | ~550 ms | 🟢 Good |
| **DOMContentLoaded Event** | — | 483.1 ms – 557.4 ms (74.3 ms run) | 🟢 Good |
| **Speed Index** | 539 ms (0.5 s) | — | 🟢 Good |
| **Total Blocking Time (TBT)** | 0 ms | 95 ms total blocking across 2 early frames | 🟢 Good |
| **Cumulative Layout Shift (CLS)** | 0.005 | 0.000 | 🟢 Perfect |
| **Full Page Load Event** | 471 ms (TTI) | 1,042.0 ms | 🟢 Fast |

---

## 2. Complete Network Request Waterfall (11 Requests)

| # | Resource URL | Type | Status | Transfer Size | Uncompressed | Cache-Control | Render Blocking |
| :-: | :--- | :---: | :-: | :-: | :-: | :---: | :---: |
| 1 | `https://bittu.dev/` | Document | 200 | 21.9 KiB | 89.9 KiB | `max-age=600` | Non-blocking |
| 2 | `/fonts/SpaceGrotesk-Variable.woff2` | Font | 200 | 13.0 KiB | 13.0 KiB | `max-age=600` | Non-blocking (Preloaded) |
| 3 | `/fonts/SpaceMono-Regular.woff2` | Font | 200 | 5.1 KiB | 5.1 KiB | `max-age=600` | Non-blocking (Preloaded) |
| 4 | `/assets/css/index.css` | Stylesheet | 200 | 6.7 KiB | 39.1 KiB | `max-age=600` | ⚠️ **Blocking** (92ms) |
| 5 | `/assets/css/littlefoot.css` | Stylesheet | 200 | 1.3 KiB | 4.9 KiB | `max-age=600` | ⚠️ **Blocking** (143ms) |
| 6 | `/images/avatar.avif` | Image | 200 | 15.0 KiB | 15.0 KiB | `max-age=600` | Non-blocking |
| 7 | `/assets/js/main.js` | Script | 200 | 5.9 KiB | 18.0 KiB | `max-age=600` | Non-blocking (Deferred) |
| 8 | `/fonts/SpaceMono-Bold.woff2` | Font | 200 | 5.0 KiB | 5.0 KiB | `max-age=600` | Non-blocking (CSS-discovered) |
| 9 | `https://files.catbox.moe/4fmz63.webm` | Audio/Media | 206 | ~0 B (Stream) | 114.1 KiB | `None` (3rd-party) | Non-blocking |
| 10 | `/favicon.ico` | Icon | 200 | 0.4 KiB | 4.3 KiB | `max-age=600` | Non-blocking |
| 11 | `/favicon.svg` | Icon | 200 | 0.3 KiB | 0.5 KiB | `max-age=600` | Non-blocking |

**Total Network Transfer:** ~70 KiB (~79 KiB with headers)  
**Total DOM Nodes / Script Bootup:** 0.0 s overhead, lightweight DOM.

---

## 3. Deep-Dive Diagnostics & Findings

### A. SEO Issues (Score: 92)
* **Invalid `robots.txt` Lines:**
  * `LLMs: https://bittu.dev/llms.txt`
  * `LLMs-full: https://bittu.dev/llms-full.txt`
  * *Reason:* Standard crawlers flag non-standard keys as parsing syntax errors.
  * *Fix:* Prefix with a comment symbol (`# LLMs: ...`) or declare them in HTML `<link rel="alternate">` / HTTP headers.

---

### B. Accessibility Deficiencies (Score: 96)

1. **Color Contrast Failure (3.13:1 vs 4.5:1 required):**
   * Amber `#d97706` text on `#fffdf9` background fails WCAG 2.1 AA on four project badge spans:
     * `<span>Markdown → Web + EPUB</span>`
     * `<span>WebRTC Signaling Server</span>`
     * `<span>SVG Badges + Alerts</span>`
     * `<span>High-Performance Reader</span>`
   * *Fix:* Use `#b45309` (contrast ~4.7:1) or `#92400e`.

2. **Accessible Name vs. Visible Text Mismatches (WCAG 2.5.3 - Label in Name):**
   * Header brand link: Visible `"BITTU.DEV"` vs `aria-label="Bittu Home"`.
   * Three hero stat cards where `aria-label` completely replaces the visible numbers & labels instead of containing them:
     * Card 1: `aria-label="Community Projects and Tools - 2.3M+ Views and Downloads"` vs visible `"PROJECTS 2.3M+ Views & Downloads"`
     * Card 2: `aria-label="GitHub Profile - 400+ Stars across Open Source Repositories"` vs visible `"OPEN SOURCE 400+ GitHub Stars"`
     * Card 3: `aria-label="GitHub Profile - 4.8K+ Total Contributions"` vs visible `"ACTIVITY 4.8K+ Github Contributions"`
   * Audio Cassette player: Visible `"SC"` vs `aria-label="SoundCloud Playlist"`.
   * *Fix:* Include the visible string verbatim inside the accessible name / label.

---

### C. Runtime, GPU & Performance Insights

1. **WebGL / Canvas GPU Stall (Console Warning):**
   * Warning: `[.WebGL] GL Driver Message: GPU stall due to ReadPixels`.
   * *Cause:* A synchronous `readPixels()` call in `assets/js/main.js` forces the GPU pipeline to stall and sync with the CPU during canvas/shader rendering.
   * *Fix:* Avoid synchronous CPU readbacks from WebGL/Canvas during render loops, or use Pixel Buffer Objects (PBO) / async readback.

2. **Long Animation Frames (LoAF) & Main Thread Work:**
   * **Initial Render:** 250 ms layout pass (52 ms blocking duration) before first paint.
   * **DOMContentLoaded JS:** 74 ms script execution block in `assets/js/main.js` on `DOMContentLoaded`.
   * **Animation Loop:** Background loop registers recurring ~50–60 ms tasks every ~300 ms.

3. **Font Preloading Gap:**
   * `SpaceGrotesk-Variable.woff2` & `SpaceMono-Regular.woff2` are preloaded in `<head>` and start downloading at `t=237ms`.
   * `SpaceMono-Bold.woff2` is not preloaded; it waits for `index.css` to parse and only starts requesting at `t=419.4ms` (finishing at `t=600.9ms`).
   * *Fix:* Add `<link rel="preload" href="/fonts/SpaceMono-Bold.woff2" as="font" type="font/woff2" crossorigin>` to `<head>`.

4. **Short Cache TTL on Static Assets:**
   * All static assets (fonts, CSS, JS, images) are served with `Cache-Control: max-age=600` (10 minutes).
   * *Fix:* For content-hashed or permanent static files, serve with `Cache-Control: public, max-age=31536000, immutable`.

5. **Render-Blocking CSS (80–120ms potential savings):**
   * `index.css` (6.7 KiB gzip) and `littlefoot.css` (1.3 KiB gzip) block the parser.
   * *Fix:* Inline critical CSS in `<style>` tags in the HTML `<head>`.

---

## 4. Prioritized Action Checklist

- [ ] **Accessibility:** Change `#d97706` to `#b45309` on project card badges.
- [ ] **Accessibility:** Align `aria-label`s on header link, stat cards, and cassette widget with their visible text.
- [ ] **SEO:** Replace custom directive lines in `robots.txt` with comments (`# LLMs: ...`).
- [ ] **Performance:** Add `<link rel="preload">` for `SpaceMono-Bold.woff2`.
- [ ] **Performance:** Eliminate `readPixels()` GPU stall in `assets/js/main.js`.
- [ ] **Caching:** Increase static asset `Cache-Control` header max-age if deploying behind a CDN/Worker.
