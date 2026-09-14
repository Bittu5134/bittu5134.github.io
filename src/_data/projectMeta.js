/**
 * projectMeta.js - Handcrafted editorial metadata keyed by GitHub repo name.
 * GitHub provides stars, topics, pushed_at, language, and homepage.
 *
 * Card Header Colors:
 * - By default, colors are deterministically assigned from the neo-brutalist palette using
 *   the repo name as a seed, guaranteeing that all cards WITHIN a category have unique colors.
 * - To override the seeded color for any project, add `color: "bg-[#...]"` (e.g. `color: "bg-[#fde047]"`).
 */
export default {
  "ORV-Reader": {
    order: 1,
    category: "WEB / CLOUD",
    filterCategory: "WEB",
    badge: "OPEN SOURCE",
    statsText: "Markdown → Web + EPUB",
    blurb: "A web-publishing platform that compiles Markdown into fast static pages and EPUBs. Built it to be clean and lightweight way to read stuff on slow connections.",
    tags: ["Python", "Custom SSG", "Pandoc", "Cloudflare WAF", "FastAPI"],
  },
  "PeerBasket": {
    order: 2,
    category: "SYSTEMS / P2P",
    filterCategory: "SYSTEMS",
    badge: "PUBLIC API",
    statsText: "WebRTC Signaling Server",
    blurb: "A WebRTC signaling server in Go that handles peer discovery for real-time multiplayer sessions. Mostly an excuse to see how low-latency and stable I could make P2P connections.",
    tags: ["Go", "Gin", "WebRTC", "Redis", "Proxmox VE"],
  },
  "NetShip": {
    order: 3,
    category: "SYSTEMS / EDR",
    filterCategory: "SYSTEMS",
    badge: "KERNEL TELEMETRY",
    statsText: "Host Telemetry Agent",
    blurb: "A host telemetry agent in Go that watches socket activity and maps out process trees. Built it to understand how endpoint detection tools actually work under the hood.",
    tags: ["Go", "gopsutil", "SHA-256", "Process Lineage", "Linux/Windows"],
  },
  "InfraPulse": {
    order: 4,
    category: "AI / COMPUTER VISION",
    filterCategory: "AI",
    badge: "HACKATHON BUILD",
    statsText: "Vision-Based Defect Triage",
    blurb: "A defect-detection tool that flags and prioritizes infrastructure issues from photos using a small vision-model ensemble. Built for a campus hackathon.",
    tags: ["PyTorch", "FastAPI", "Sobel Edge Detection", "Docker", "SSE"],
  },
  "LOTM-Reader": {
    order: 5,
    category: "WEB / READING",
    filterCategory: "WEB",
    badge: "OPEN SOURCE",
    statsText: "Reader App",
    blurb: "A webnovel reader built with Svelte, with offline caching and a per-chapter comment section. Made it because I wanted something faster and cleaner than what was out there.",
    tags: ["Svelte", "SvelteKit", "Pandoc", "Giscus", "EPUB"],
  },
  "IITK-Resume-Model": {
    title: "IITK-Resume-Engine",
    order: 6,
    category: "AI / DOCUMENT PARSING",
    filterCategory: "AI",
    badge: "CAMPUS PROJECT",
    statsText: "PDF Layout Parsing",
    blurb: "A tool that parses academic PDFs by their layout geometry (since normal parsers choke on tables) and scores them. Built for IIT Kanpur's career office.",
    tags: ["Python", "PyMuPDF", "Scikit-learn", "FastAPI"],
  },
  "Sharelock": {
    order: 7,
    category: "AI / RETRIEVAL",
    filterCategory: "AI",
    badge: "IDEATHON BUILD",
    statsText: "RAG + MCP Server",
    blurb: "A retrieval system that lets you just ask questions about IIT Kanpur's academic policy manual instead of reading the whole thing. Built as a RAG pipeline with an MCP server.",
    tags: ["RAG", "MCP Server", "TypeScript", "Vector Retrieval"],
  },
  "GH-Follow-Tracker": {
    order: 8,
    category: "TOOLS / EDGE",
    filterCategory: "TOOLS",
    badge: "SIDE PROJECT",
    statsText: "GitHub Follower Badges",
    blurb: "A little service on Cloudflare Workers that tracks GitHub followers and generates live SVG badges, with Discord/Slack alerts when things change.",
    tags: ["JavaScript", "Cloudflare Workers", "GitHub Actions", "SVG"],
  },
};
