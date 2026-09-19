# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Software Engineers & Systems Practitioners:** Reading technical deep-dive dispatches on network protocols, WebRTC signaling, binary parsing, and game loops.
- **Technical Recruiters & Engineering Hiring Managers:** Evaluating engineering depth, project execution, and open-source contributions.
- **Technical Collaborators & Hackathon/CTF Peers:** Looking for project partnerships, CTF teammates, and open-source collaboration.
- **Minecraft Technical & Modding Community:** Users and developers engaging with datapacks, Minecraft Live spotlighted creations, and protocol tooling.
- **General Tech Readers & Learners:** Developers looking for practical guides, tutorials, and real-world architectures.

## Product Purpose

A personal portfolio, technical engineering blog, and project showcase that serves as the central digital home and proof-of-work hub for Bittu. It communicates engineering competence, shares deep technical knowledge through dispatches, showcases shipped open-source software, and provides low-friction avenues for networking, hiring, and collaboration.

## Positioning

Authentic builder proof: real open-source systems projects, verifiable Minecraft/modding contributions (including a Minecraft Live spotlight), translation tooling, and rigorous technical deep-dive dispatches across binary protocols, WebRTC signaling, and low-level engineering—paired with an unmistakable neo-brutalist / retro-terminal aesthetic.

## Operating Context

- Evaluated by engineers and recruiters on desktops, laptops, and mobile screens.
- Readers consume technical articles with code samples, KaTeX mathematical notation, and Mermaid diagrams.
- Visitors search and filter articles on-demand using an embedded client-side Pagefind Wasm index without server roundtrips.
- Plaintext AI agents and LLMs crawl structured feeds via `/llms.txt`, while RSS aggregators ingest `/rss.xml`.

## Capabilities and Constraints

- **Static-First Performance:** Built on Eleventy (11ty v3), Tailwind CSS, Python font subsetting, and client-side Pagefind Wasm search.
- **Zero Heavy Runtime Frameworks:** Vanilla JavaScript for client interactions (lo-fi cassette player, search controller, mobile navigation, dark mode for posts).
- **Pure Markdown Frontmatter Content:** Blog workflow driven purely by Markdown files in `src/content/blogs/` with gray-matter frontmatter; no manual JSON sync required.
- **Multi-Device Responsiveness:** Tight layout constraints on mobile and tablet without horizontal scrolling or squished metadata.

## Brand Commitments

- **Handle / Identity:** Bittu (`@Bittu5134` / `BITTU.DEV`), Software Engineer & Cybersecurity Student at IIT Kanpur.
- **Voice:** Direct, technical, inquisitive, builder-centric, unpretentious.
- **Aesthetic Direction:** Neo-brutalist / retro-terminal with high contrast, tactile buttons, signature yellow (`#fde047`), mint green (`#86efac`), orange (`#fb923c`), Space Grotesk & Space Mono typography.

## Evidence on Hand

- **Production Articles:** 4 in-depth technical blogs (`engineering-handbook-and-syntax-showcase`, `reverse-engineering-minecraft-protocol`, `scaling-webrtc-signaling-in-go`, `spatial-geometry-parsing-in-pymupdf`).
- **Verifiable Proof:** Minecraft Live datapack feature spotlight, active PlanetMinecraft presence, open-source repositories on GitHub (`Bittu5134`).
- **Assets:** Pixel-art avatar, self-hosted subsetted variable fonts, SVG icon sprite system.

## Product Principles

1. **Proof Over Claims:** Showcase real systems code, protocol specs, architecture diagrams, and working implementations rather than buzzwords.
2. **Speed and Zero Bloat:** Instant static navigation, aggressive font subsetting, client-side indexing, and minimal JavaScript overhead.
3. **High-Contrast Readability:** Uncompromising editorial hierarchy and typographic comfort, ensuring long-form dispatches remain enjoyable to read.
4. **Authentic Personality:** Embrace the retro-terminal, lo-fi aesthetic and gamer/systems roots without sacrificing clean UX or accessibility.
