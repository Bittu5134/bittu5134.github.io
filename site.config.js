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
    "IITK-Resume-Model": {
      order: 8,
      title: "IITK-Resume-Model",
      category: "PARSER / GEOMETRY",
      filterCategory: "TOOLS",
      badge: "CAMPUS TOOL",
      statsText: "2D Coordinate PDF Extractor",
      language: "Python",
      githubUrl: "https://github.com/Bittu5134/IITK-Resume-Model",
      liveUrl: "https://iitk-resume.bittu.dev",
      blurb:
        "A tool that parses academic PDFs by their layout geometry (since normal parsers choke on tables) and scores them. Built for IIT Kanpur's career office.",
    },
  },

// ── Marquee Skills Ticker ───────────────────────────────────────────
  // Displayed in the infinite scrolling marquee strip below the hero.
  // Add, remove, or reorder skills easily here.
  ticker: [
    "GO",
    "PYTHON",
    "C++",
    "C",
    "TYPESCRIPT",
    "JAVASCRIPT",
    "SQL",
    "DOCKER",
    "REDIS",
    "LINUX",
    "WEBRTC",
    "PYTORCH",
    "FASTAPI",
    "GIN",
    "POSTGRESQL",
    "SQLITE",
    "PROXMOX",
    "CLOUDFLARE",
    "SVELTE",
    "GIT",
    "BASH",
    "OPENGL",
    "GLSL",
    "BLENDER",
    "OPENCV",
    "PANDOC",
    "YARA",
    "WIRESHARK",
    "NMAP",
  ],

// ── Core Skills & Tech Stack Badges ─────────────────────────────────
  // Displayed in the ~/about section.
  // Each badge has a display name, brutalist background color class,
  // and SVG sprite icon identifier (#icon-tech-*).
  skills: [
    { name: "Go", bgClass: "bg-[#38bdf8]", iconId: "icon-tech-go" },
    { name: "Python", bgClass: "bg-[#fde047]", iconId: "icon-tech-python" },
    { name: "C++", bgClass: "bg-[#fb923c]", iconId: "icon-tech-cplusplus" },
    { name: "C", bgClass: "bg-[#93c5fd]", iconId: "icon-tech-c" },
    { name: "TypeScript", bgClass: "bg-[#86efac]", iconId: "icon-tech-typescript" },
    { name: "Linux", bgClass: "bg-[#c4b5fd]", iconId: "icon-tech-linux" },
    { name: "Docker", bgClass: "bg-[#38bdf8]", iconId: "icon-tech-docker" },
    { name: "PostgreSQL", bgClass: "bg-[#60a5fa]", iconId: "icon-tech-postgresql" },
    { name: "Redis", bgClass: "bg-[#f87171]", iconId: "icon-tech-redis" },
    { name: "PyTorch", bgClass: "bg-[#fb923c]", iconId: "icon-tech-pytorch" },
    { name: "WebRTC", bgClass: "bg-[#f472b6]", iconId: "icon-tech-webrtc" },
    { name: "FastAPI", bgClass: "bg-[#a7f3d0]", iconId: "icon-tech-fastapi" },
    { name: "Cloudflare", bgClass: "bg-[#fdba74]", iconId: "icon-tech-cloudflare" },
    { name: "Git", bgClass: "bg-[#f87171]", iconId: "icon-tech-git" },
    { name: "Proxmox", bgClass: "bg-[#fca5a5]", iconId: "icon-tech-proxmox" },
    { name: "Svelte", bgClass: "bg-[#fb923c]", iconId: "icon-tech-svelte" },
  ],
};
