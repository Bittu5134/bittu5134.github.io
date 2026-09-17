/**
 * projectMeta.js - Minimal editorial metadata keyed by GitHub repo name.
 *
 * GitHub provides dynamically at build time:
 * - description (blurb)
 * - topics (tags)
 * - stargazers_count (stars)
 * - language & pushed_at (signals)
 * - homepage (live demo link)
 * - html_url (source code link)
 *
 * This file only contains editorial UI metadata:
 * - order: Sort weight within categories
 * - category: Subtitle in retro window bar (e.g. "SYSTEMS / P2P")
 * - filterCategory: Pill category filter key ("PINNED" | "SYSTEMS" | "AI" | "WEB" | "TOOLS")
 * - badge: Window bar badge text (e.g. "PUBLIC API")
 * - statsText: Sub-headline signal text (e.g. "WebRTC Signaling Server")
 * - color / headerBgClass (optional): Override deterministic palette color
 */
export default {
  "ORV-Reader": {
    order: 1,
    category: "WEB / CLOUD",
    filterCategory: "WEB",
    badge: "PUBLISHING",
    statsText: "Markdown → Web + EPUB",
  },
  "PeerBasket": {
    order: 2,
    category: "SYSTEMS / P2P",
    filterCategory: "SYSTEMS",
    badge: "PUBLIC API",
    statsText: "WebRTC Signaling Server",
  },
  "NetShip": {
    order: 3,
    category: "SYSTEMS / EDR",
    filterCategory: "SYSTEMS",
    badge: "KERNEL TELEMETRY",
    statsText: "Host Telemetry Agent",
    language: "Go",
  },
  "InfraPulse": {
    order: 4,
    category: "AI / COMPUTER VISION",
    filterCategory: "AI",
    badge: "HACKATHON BUILD",
    statsText: "Vision-Based Defect Triage",
  },
  "LOTM-Reader": {
    order: 5,
    category: "WEB / READING",
    filterCategory: "WEB",
    badge: "OPEN SOURCE",
    statsText: "Reader App",
  },
  "IITK-Resume-Model": {
    title: "IITK-Resume-Engine",
    order: 6,
    category: "AI / DOCUMENT PARSING",
    filterCategory: "AI",
    badge: "CAMPUS PROJECT",
    statsText: "PDF Layout Parsing",
  },
  "Sharelock": {
    order: 7,
    category: "AI / RETRIEVAL",
    filterCategory: "AI",
    badge: "IDEATHON BUILD",
    statsText: "RAG + MCP Server",
  },
  "GH-Follow-Tracker": {
    order: 8,
    category: "TOOLS / EDGE",
    filterCategory: "TOOLS",
    badge: "STATS & WEBHOOK",
    statsText: "GitHub Follower Badges",
  },
};
