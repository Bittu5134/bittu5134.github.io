/**
 * site.config.js - Centralized Site Configuration & Editorial Settings
 *
 * All editable personal info, social links, author profile,
 * project metadata, and theme settings in one clean place.
 */

export default {
  // ── Global Site Details ─────────────────────────────────────────────
  title: "Bittu - Systems & Software Blog",
  description:
    "Essays and deep dives into low-level systems, reverse engineering, distributed networking, and software craft by Bittu (Bittu5134).",
  url: "https://bittu.dev",
  feedUrl: "https://bittu.dev/rss.xml",

  // ── Author Profile & JSON-LD Schema ─────────────────────────────────
  author: {
    name: "Bittu",
    alternateName: "Bittu5134",
    email: "hello@bittu.dev",
    url: "https://bittu.dev",
    image: "https://bittu.dev/images/avatar.webp",
    jobTitle: "Software Engineer",
    alumniOf: {
      name: "IIT Kanpur",
    },
    sameAs: [
      "https://github.com/Bittu5134",
      "https://x.com/Bittu5134",
      "https://www.linkedin.com/in/bittu5134",
    ],
  },

  // ── Project Metadata & Editorial Cues ───────────────────────────────
  // GitHub REST API provides stars, repo descriptions, and topics dynamically.
  // This section defines manual ordering, category groupings, and card badges.
  projects: {
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
      badge: "HACKATHON WINNER",
      statsText: "Defect Detection Ensemble",
    },
    "LOTM-Reader": {
      order: 5,
      category: "WEB / OPTIMIZATION",
      filterCategory: "WEB",
      badge: "PWAS",
      statsText: "High-Performance Reader",
    },
    "GH-Follow-Tracker": {
      order: 6,
      category: "SERVERLESS / MONITORING",
      filterCategory: "TOOLS",
      badge: "CRON WORKER",
      statsText: "SVG Badges + Alerts",
      language: "TypeScript",
    },
    "Sharelock": {
      order: 7,
      category: "AI / RAG",
      filterCategory: "AI",
      badge: "CAMPUS AI",
      statsText: "Policy Manual MCP Agent",
      language: "Python",
    },
    "IITK-Resume-Engine": {
      order: 8,
      category: "PARSER / GEOMETRY",
      filterCategory: "TOOLS",
      badge: "CAMPUS TOOL",
      statsText: "2D Coordinate PDF Extractor",
      language: "Python",
    },
  },
};
