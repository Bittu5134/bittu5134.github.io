/**
 * site.config.js - Centralized Site Configuration & Editorial Settings
 *
 * All editable personal info, social links, author profile,
 * project metadata, and theme settings in one clean place.
 */

export default {
  // ── Global Site Details ─────────────────────────────────────────────
  name: "bittu.dev",
  title: "Bittu | Software & CyberSec",
  description: "Your friendly, neighborhood Technomancer. Cybersecurity @ IIT Kanpur '30",
  url: "https://bittu.dev",
  feedUrl: "https://bittu.dev/rss.xml",

  // ── Universal SEO & Blog Defaults ──────────────────────────────────
  // These tags are automatically injected into EVERY blog post's metadata
  // (meta keywords, article:tag, llms feeds, and JSON-LD structured data)
  // alongside the post's own `tags` and post-specific `hiddenTags`.
  seo: {
    defaultTags: [
      "IIT Kanpur",
      "IIT Kanpur '30",
      "CyberSec",
      "Software Engineering",
      "Student Blog",
      "Personal Blog",
      "Tech Blog",
      "Portfolio",
      "Build In Public",
      "Write In Public",
      "Developer Journal",
      "Web Development",
      "Neo-Brutalism",
      "Eleventy",
    ],
  },

  // ── Author Profile & JSON-LD Schema ─────────────────────────────────
  author: {
    name: "Bittu",
    alternateName: "Bittu5134",
    email: "hello@bittu.dev",
    url: "https://bittu.dev",
    image: "https://bittu.dev/images/avatar.webp",
    jobTitle: "Software Engineer",
    twitter: "@404lostsquid",
    alumniOf: {
      name: "IIT Kanpur",
    },
    sameAs: [
      "https://github.com/Bittu5134",
      "https://x.com/404lostsquid",
      "https://www.linkedin.com/in/bittu5134",
    ],
  },

  // ── Project Metadata & Editorial Cues ───────────────────────────────
  // GitHub REST API provides stars, repo descriptions, and topics dynamically.
  // Curated ordering ranks projects by technical impressiveness and fun factor.
  projects: {
    "Rock-Paper-SSH": {
      order: 1,
      category: "SYSTEMS / SSH TUI",
      filterCategory: "SYSTEMS",
      badge: "SSH MULTIPLAYER",
      statsText: "Wish + Bubble Tea TUI",
      language: "Go",
      githubUrl: "https://github.com/Bittu5134/Rock-Paper-SSH",
    },
    "PeerBasket": {
      order: 2,
      category: "SYSTEMS / P2P",
      filterCategory: "SYSTEMS",
      badge: "PUBLIC API",
      statsText: "WebRTC Signaling Server",
      language: "Go",
    },
    "DumbCord": {
      order: 3,
      category: "AI / MARKOV",
      filterCategory: "AI",
      badge: "MARKOV CHATBOT",
      statsText: "Markov Chain Discord Bot",
      language: "Python",
      githubUrl: "https://github.com/Bittu5134/DumbCord",
      tags: ["chatbot", "discord", "dumb", "markov-chain"],
    },
    "NetShip": {
      order: 4,
      category: "SYSTEMS / EDR",
      filterCategory: "SYSTEMS",
      badge: "KERNEL TELEMETRY",
      statsText: "Host Telemetry Agent",
      language: "Go",
    },
    "InfraPulse": {
      order: 5,
      category: "AI / COMPUTER VISION",
      filterCategory: "AI",
      badge: "HACKATHON WINNER",
      statsText: "Defect Detection Ensemble",
      language: "Python",
    },
    "Sharelock": {
      order: 6,
      category: "AI / RAG",
      filterCategory: "AI",
      badge: "CAMPUS MCP AGENT",
      statsText: "Policy Manual MCP Agent",
      language: "Python",
    },
    "Lore": {
      order: 7,
      category: "AI / DEVTOOLS",
      filterCategory: "AI",
      badge: "LOCAL ADR ENGINE",
      statsText: "Cline Plugin + MCP Wiki Engine",
      language: "TypeScript",
      githubUrl: "https://github.com/Bittu5134/Lore",
      tags: ["cline", "mcp", "typescript", "sqlite", "devtools"],
    },
    "GeoShuffle": {
      order: 8,
      category: "WEB / WEBRTC GAME",
      filterCategory: "WEB",
      badge: "P2P GAME",
      statsText: "WebRTC DataChannel Puzzle",
      language: "JavaScript",
      githubUrl: "https://github.com/Bittu5134/GeoShuffle",
      liveUrl: "https://geoshuffle.bittu.dev",
      tags: ["game", "multiplayer", "p2p", "webrtc"],
    },
    "ORV-Reader": {
      order: 9,
      category: "WEB / CLOUD",
      filterCategory: "WEB",
      badge: "PUBLISHING",
      statsText: "Markdown → Web + EPUB",
    },
    "LOTM-Reader": {
      order: 10,
      category: "WEB / OPTIMIZATION",
      filterCategory: "WEB",
      badge: "OFFLINE PWA",
      statsText: "High-Performance Reader",
    },
    "ThumbScore": {
      order: 11,
      category: "TOOLS / EXTENSION",
      filterCategory: "TOOLS",
      badge: "CHROME EXTENSION",
      statsText: "DOM Mutation Metrics",
      language: "JavaScript",
      githubUrl: "https://github.com/Bittu5134/ThumbScore",
      tags: ["browser-extension", "chrome-extension", "dom", "youtube"],
    },
    "IITK-Resume-Model": {
      order: 12,
      title: "Resume-Model",
      category: "TOOLS / PARSER",
      filterCategory: "TOOLS",
      badge: "CAMPUS TOOL",
      statsText: "2D Coordinate PDF Extractor",
      language: "Python",
      githubUrl: "https://github.com/Bittu5134/IITK-Resume-Model",
      liveUrl: "https://iitk-resume.bittu.dev",
    },
    "GH-Follow-Tracker": {
      order: 13,
      category: "TOOLS / SERVERLESS",
      filterCategory: "TOOLS",
      badge: "CRON WORKER",
      statsText: "SVG Badges + Alerts",
      language: "TypeScript",
    },
  },

  // ── Marquee Skills Ticker ───────────────────────────────────────────
  // Displayed in the infinite scrolling marquee strip below the hero.
  // Add, remove, or reorder skills easily here.
  ticker: [
    "GO / GOLANG",
    "C / C++",
    "PYTHON",
    "PYTORCH",
    "WEBRTC P2P",
    "LINUX DAEMONS & SOCKETS",
    "DOCKER",
    "REDIS",
    "TYPESCRIPT",
    "REACT",
    "FASTAPI",
    "CLOUDFLARE WORKERS",
  ],

  // ── Core Skills & Tech Stack Badges ─────────────────────────────────
  // Displayed in the ~/about section.
  // Each badge has a display name, brutalist background color class,
  // and SVG sprite icon identifier (#icon-tech-*).
  skills: [
    { name: "Go", bgClass: "bg-[#38bdf8]", iconId: "icon-tech-go" },
    { name: "Python", bgClass: "bg-[#fde047]", iconId: "icon-tech-python" },
    { name: "C / C++", bgClass: "bg-[#fb923c]", iconId: "icon-tech-cplusplus" },
    { name: "TypeScript", bgClass: "bg-[#86efac]", iconId: "icon-tech-typescript" },
    { name: "Linux & Sockets", bgClass: "bg-[#c4b5fd]", iconId: "icon-tech-linux" },
    { name: "WebRTC", bgClass: "bg-[#f472b6]", iconId: "icon-tech-webrtc" },
    { name: "Docker", bgClass: "bg-[#38bdf8]", iconId: "icon-tech-docker" },
    { name: "Redis", bgClass: "bg-[#fde047]", iconId: "icon-tech-redis" },
    { name: "FastAPI / Gin", bgClass: "bg-[#a7f3d0]", iconId: "icon-tech-fastapi" },
    { name: "Cloudflare Workers", bgClass: "bg-[#fb923c]", iconId: "icon-tech-cloudflare" },
  ],
};
