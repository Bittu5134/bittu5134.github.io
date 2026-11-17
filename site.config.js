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
  // One entity with several aliases. `alternateName` tells search engines
  // these strings all refer to the same person; `sameAs` pins the entity to
  // external profiles that are verifiably ours.
  author: {
    name: "Bittu",
    alternateName: ["Bittu5134", "Divyanshu", "Divyanshu A.", "Divyanshu Anand"],
    // Separates this entity from same-named people.
    disambiguatingDescription:
      "Software engineer and cybersecurity student building open-source systems tools, Minecraft technical content, and webnovel reader platforms.",
    // Topical authority: helps disambiguate WHICH Divyanshu Anand this is.
    knowsAbout: [
      "Go (programming language)",
      "Cybersecurity",
      "WebRTC",
      "Linux",
      "Minecraft modding",
      "Python (programming language)",
      "C (programming language)",
      "TypeScript",
      "Discord bots",
      "Cloudflare Workers",
    ],
    email: "hello@bittu.dev",
    url: "https://bittu.dev",
    image: "https://bittu.dev/assets/images/avatar.webp",
    jobTitle: "Software Engineer",
    twitter: "@LostSquidXD",
    alumniOf: {
      name: "IIT Kanpur",
    },
    sameAs: [
      "https://github.com/Bittu5134",
      "https://x.com/LostSquidXD",
      "https://www.linkedin.com/in/bittu5134",
      "https://www.planetminecraft.com/member/bittu5134/",
      "https://www.patreon.com/lazybittu",
      "https://www.reddit.com/user/RealNPC_/",
    ],
  },

  // ── Project Metadata & Editorial Cues ───────────────────────────────
  // Stars, descriptions, languages, topics AND the pinned set come from the
  // GitHub at build time (cached for an hour): pinned repos are read from the
  // profile's own pinned list, so the homepage PINNED pill always mirrors
  // github.com/Bittu5134. Everything editorial lives here: the curated order,
  // the card's category line, the filter bucket, and any live URL that is not
  // the repo's homepage.
  projects: {
    "Rock-Paper-SSH": {
      order: 7,
      category: "SYSTEMS / SSH TUI",
      filterCategory: "SYSTEMS",
      statsText: "Wish + Bubble Tea TUI",
    },
    "PeerBasket": {
      order: 3,
      category: "SYSTEMS / P2P",
      filterCategory: "SYSTEMS",
      statsText: "WebRTC Signaling Server",
      language: "Go",
    },
    "DumbCord": {
      order: 11,
      category: "DISCORD / MARKOV CHAINS",
      filterCategory: "BOTS",
      statsText: "Markov Chain Discord Bot",
      tags: ["chatbot", "discord", "dumb", "markov-chain"],
    },
    "NetShip": {
      order: 5,
      category: "SYSTEMS / EDR",
      filterCategory: "SYSTEMS",
      statsText: "Host Telemetry Agent",
    },
    "InfraPulse": {
      order: 8,
      category: "AI / MACHINE VISION",
      filterCategory: "AI",
      statsText: "Defect Detection Ensemble",
    },
    "Sharelock": {
      order: 6,
      category: "AI / RAG",
      filterCategory: "AI",
      statsText: "Policy Manual MCP Agent",
    },
    "Lore": {
      order: 9,
      category: "AI / DEVTOOLS",
      filterCategory: "AI",
      statsText: "Cline Plugin + MCP Wiki Engine",
      language: "TypeScript",
      tags: ["cline", "mcp", "typescript", "sqlite", "devtools"],
    },
    "GeoShuffle": {
      order: 1,
      category: "WEB / WEBRTC GAME",
      filterCategory: "WEB",
      statsText: "WebRTC DataChannel Puzzle",
      language: "JavaScript",
      liveUrl: "https://geoshuffle.bittu.dev",
      tags: ["game", "multiplayer", "p2p", "webrtc"],
    },
    "ORV-Reader": {
      order: 1,
      category: "WEB / PUBLISHING",
      filterCategory: "WEB",
      statsText: "Markdown → Web + EPUB",
    },
    "LOTM-Reader": {
      order: 2,
      category: "WEB / OPTIMIZATION",
      filterCategory: "WEB",
      statsText: "High-Performance Reader",
    },
    "IITK-Resume-Model": {
      order: 4,
      title: "Resume-Model",
      category: "TOOLS / PARSER",
      filterCategory: "MISC",
      statsText: "2D Coordinate PDF Extractor",
      liveUrl: "https://iitk-resume.bittu.dev",
    },
    "GH-Follow-Tracker": {
      order: 16,
      category: "TOOLS / SERVERLESS",
      filterCategory: "BOTS",
      statsText: "SVG Badges + Alerts",
    },

    "RatioYT": {
      order: 2,
      category: "TOOLS / YT EXTENSION",
      filterCategory: "MISC",
      statsText: "Userscript + Extension",
      liveUrl: "http://ratioyt.bittu.dev/",
    },
    "Awakener": {
      order: 3,
      category: "DISCORD / BOT",
      filterCategory: "BOTS",
      statsText: "Crown-the-Lurkers Bot",
      liveUrl: "https://awakener.bittu.dev/",
    },
    "SkyBlock-Sniper": {
      order: 10,
      category: "MINECRAFT / AUTOMATION",
      filterCategory: "BOTS",
      statsText: "Latency-Optimised Sniping",
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
};
