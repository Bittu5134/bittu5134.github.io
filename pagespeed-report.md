# PageSpeed Insights Analysis: bittu.dev (Desktop)

- **URL Analyzed:** `https://bittu.dev/`
- **Report ID:** `br8o90eq91`
- **Form Factor:** Desktop
- **Lighthouse Version:** `13.5.0`
- **Fetch Time:** `2026-09-30T05:21:10.675Z`
- **Source Link:** [PageSpeed Insights Report](https://pagespeed.web.dev/analysis/https-bittu-dev/br8o90eq91?form_factor=desktop)

---

## 1. Category Scores

| Category | Score | Status |
| :--- | :---: | :---: |
| **Performance** | **100** | 🟢 Perfect |
| **Agentic Browsing** | **100** | 🟢 Perfect |
| **Best Practices** | **100** | 🟢 Perfect |
| **Accessibility** | **96** | 🟡 Needs Attention |
| **SEO** | **92** | 🟡 Needs Attention |

---

## 2. Core Web Vitals & Performance Metrics

| Metric | Measured Value | Score | Threshold / Status |
| :--- | :--- | :---: | :---: |
| **First Contentful Paint (FCP)** | `0.3 s` (338 ms) | 100 | Good (≤ 0.9 s) |
| **Largest Contentful Paint (LCP)** | `0.5 s` (471 ms) | 100 | Good (≤ 1.2 s) |
| **Speed Index** | `0.5 s` (539 ms) | 100 | Good (≤ 1.3 s) |
| **Total Blocking Time (TBT)** | `0 ms` | 100 | Good (≤ 150 ms) |
| **Cumulative Layout Shift (CLS)** | `0.005` | 100 | Good (≤ 0.1) |
| **Time to Interactive (TTI)** | `0.5 s` (471 ms) | 100 | Good (≤ 2.5 s) |
| **Max Potential FID** | `50 ms` (45 ms) | 100 | Good (≤ 130 ms) |
| **Server Response Time (TTFB)** | `0 ms` (3 ms root doc) | 100 | Fast |

---

## 3. Network & Resource Summary

- **Total Requests:** 9 requests
- **Total Transfer Size:** 79,193 bytes (~77.3 KiB)
- **Main Thread Work Breakdown:** 0.2 s
- **Script Bootup Time:** 0.0 s

### Resource Breakdown:
| Resource Type | Request Count | Transfer Size |
| :--- | :---: | :---: |
| **Fonts** (`woff2`) | 3 | 25,053 B (~24.5 KiB) |
| **Document** (HTML) | 1 | 22,580 B (~22.1 KiB) |
| **Images** (`avatar.avif`) | 1 | 15,628 B (~15.3 KiB) |
| **Stylesheets** (CSS) | 2 | 9,356 B (~9.1 KiB) |
| **Scripts** (JS) | 1 | 6,576 B (~6.4 KiB) |
| **Media / Other** | 1 | < 1 KiB |

---

## 4. Issues & Actionable Improvements

### A. SEO Issues (Score: 92/100)
- **`robots.txt` is not valid** (2 unrecognized directives):
  - Line 5: `LLMs: https://bittu.dev/llms.txt` — *Unknown directive*
  - Line 6: `LLMs-full: https://bittu.dev/llms-full.txt` — *Unknown directive*
  - *Recommendation:* Move unofficial directives into comments (e.g. `# LLMs: ...`) or serve them via HTTP headers.

---

### B. Accessibility Issues (Score: 96/100)

#### 1. Insufficient Color Contrast (3.13:1 vs 4.5:1 required)
Foreground color `#d97706` (amber) on background `#fffdf9` failed WCAG AA ratio on 4 badges:
- `<span>Markdown → Web + EPUB</span>`
- `<span>WebRTC Signaling Server</span>`
- `<span>SVG Badges + Alerts</span>`
- `<span>High-Performance Reader</span>`
- *Recommendation:* Darken the text color (e.g., `#b45309` or darker) to achieve at least 4.5:1 contrast.

#### 2. Accessible Name vs. Visible Label Mismatches
Elements with visible labels whose accessible names (`aria-label`) do not include the visible text:
- Header brand link: `<a href="/" aria-label="Bittu Home">BITTU.DEV</a>`
- Stat card link 1: `aria-label="Community Projects and Tools - 2.3M+ Views and Downloads"` vs visible text `PROJECTS 2.3M+ Views & Downloads`
- Stat card link 2: `aria-label="GitHub Profile - 400+ Stars across Open Source Repositories"` vs visible text `OPEN SOURCE 400+ GitHub Stars`
- Stat card link 3: `aria-label="GitHub Profile - 4.8K+ Total Contributions"` vs visible text `ACTIVITY 4.8K+ Github Contributions`
- Audio cassette link: `<a aria-label="SoundCloud Playlist">SC</a>`
- *Recommendation:* Ensure `aria-label` starts with or includes the visible text verbatim to satisfy WCAG 2.5.3 (Label in Name).

---

### C. Opportunities & Diagnostics (Performance)

1. **Efficient Cache Lifetimes:**
   - Static assets (`avatar.avif`, `SpaceGrotesk-Variable.woff2`, `SpaceMono-*.woff2`, `index.css`, `main.js`) currently have a cache lifetime of 10 minutes (`max-age=600`).
   - *Recommendation:* Set longer `Cache-Control` max-age (e.g. 1 year / `max-age=31536000, immutable`) for hashed/static assets.
2. **Render-Blocking Requests:**
   - `littlefoot.css` (1.9 KiB) & `index.css` (7.4 KiB) are render-blocking.
   - Potential savings: ~80–120 ms.
3. **LCP Discovery Hint:**
   - Add `fetchpriority="high"` to the hero image preload tag.
4. **Forced Reflow in JS:**
   - ~50 ms forced layout reflow detected in `assets/js/main.js` during page load.
