export interface ProjectConfig {
  id: string;
  repo?: string; // e.g., 'Bittu5134/ORV-Reader'
  title: string;
  category: "SYSTEMS" | "AI & ML" | "WEB & CLOUD" | "GAMES & TOOLS";
  badge: string;
  description: string;
  statsText: string;
  tags: string[];
  liveUrl?: string;
  githubUrl: string;
  headerColor: string;
  priority: number; // lower number = higher priority
}

export const PINNED_CATEGORIES = [
  "ALL",
  "SYSTEMS",
  "AI & ML",
  "WEB & CLOUD",
  "GAMES & TOOLS",
] as const;

export type PinnedCategory = typeof PINNED_CATEGORIES[number];

export const MASTER_PROJECTS_CONFIG: ProjectConfig[] = [
  {
    id: "orv-reader",
    repo: "Bittu5134/ORV-Reader",
    title: "ORV-Reader",
    category: "WEB & CLOUD",
    badge: "10.5M+ REQ / MO",
    description:
      "High-scale web publishing platform serving 10.5M+ monthly requests (398+ GB bandwidth, 764k+ unique visits). Automated Python Markdown SSG dual-compilation into static web and compressed EPUBs with Cloudflare WAF bot defenses.",
    statsText: "398GB Bandwidth · 764K Visits · 250+ ★",
    tags: ["Python", "SSG", "Cloudflare WAF", "EPUB", "CI/CD"],
    liveUrl: "https://orv.pages.dev",
    githubUrl: "https://github.com/Bittu5134/ORV-Reader",
    headerColor: "#fde047",
    priority: 1,
  },
  {
    id: "peerbasket",
    repo: "Bittu5134/PeerBasket",
    title: "PeerBasket",
    category: "SYSTEMS",
    badge: "41ms LATENCY · 0% LOSS",
    description:
      "High-throughput, lobby-based WebRTC signaling server in Go with Gin and Redis. Achieves 41 ms average latency and 0.0% packet loss across 500 concurrent peers with Redis TTL heartbeat pruning on bare-metal Proxmox infrastructure.",
    statsText: "500 Concurrent Peers · Bare-metal · Go",
    tags: ["Go", "WebRTC", "Redis", "Proxmox", "Gin"],
    liveUrl: "https://peerbasket.bittu.dev",
    githubUrl: "https://github.com/Bittu5134/PeerBasket",
    headerColor: "#86efac",
    priority: 2,
  },
  {
    id: "netship",
    repo: "Bittu5134/NetShip",
    title: "NetShip",
    category: "SYSTEMS",
    badge: "KERNEL TELEMETRY",
    description:
      "Cross-platform Host Telemetry and Endpoint Detection & Response (EDR) daemon in Go. Captures active TCP/UDP socket activity, maps process lineages via deterministic 24-char SHA-256 GUIDs, and runs local cryptographic binary auditing.",
    statsText: "SHA-256 GUIDs · Socket Tracing · 32MB RAM",
    tags: ["Go", "Networking", "Telemetry", "EDR", "Linux"],
    githubUrl: "https://github.com/Bittu5134/NetShip",
    headerColor: "#38bdf8",
    priority: 3,
  },
  {
    id: "iitk-resume-model",
    repo: "Bittu5134/IITK-Resume-Model",
    title: "IITK-Resume-Engine",
    category: "AI & ML",
    badge: "4,400+ COURSES INDEXED",
    description:
      "Spatial LaTeX-PDF diagnostic engine for IIT Kanpur Academics & Career Council (CDW). Features a 2D coordinate geometry table parser in PyMuPDF recognizing 4,400+ IITK courses, 6-track step-gradient scoring, and counterfactual advice.",
    statsText: "99.4% Parsing Precision · CDW IITK",
    tags: ["Python", "PyMuPDF", "FastAPI", "LaTeX", "Geometry"],
    liveUrl: "https://iitk-resume.bittu.dev",
    githubUrl: "https://github.com/Bittu5134/IITK-Resume-Model",
    headerColor: "#c4b5fd",
    priority: 4,
  },
  {
    id: "infrapulse",
    repo: "Bittu5134/InfraPulse",
    title: "InfraPulse",
    category: "AI & ML",
    badge: "TAKNEEK '26",
    description:
      "Civic defect detection and priority dispatch platform developed for IIT Kanpur Takneek '26. Combines a 5-model PyTorch vision ensemble with Sobel spatial edge severity math, async FastAPI routing, and Server-Sent Events (SSE) staff queues.",
    statsText: "5-Model Vision Ensemble · Real-time SSE",
    tags: ["PyTorch", "OpenCV", "Sobel Math", "FastAPI", "SSE"],
    liveUrl: "https://infrapulse.bittu.dev",
    githubUrl: "https://github.com/Bittu5134/InfraPulse",
    headerColor: "#fb923c",
    priority: 5,
  },
  {
    id: "sharelock",
    repo: "Bittu5134/Sharelock",
    title: "Sharelock",
    category: "AI & ML",
    badge: "RAG & MCP PROTOCOL",
    description:
      "End-to-end RAG retrieval pipeline and Model Context Protocol (MCP) server indexing 100+ pages of dense IIT Kanpur Undergraduate Manual ordinances for instant, citation-backed academic query resolution.",
    statsText: "Vector Search · MCP Server · FAISS",
    tags: ["RAG", "MCP Server", "FastAPI", "FAISS", "Python"],
    githubUrl: "https://github.com/Bittu5134/Sharelock",
    headerColor: "#f472b6",
    priority: 6,
  },
  {
    id: "geoshuffle",
    repo: "Bittu5134/GeoShuffle",
    title: "GeoShuffle",
    category: "GAMES & TOOLS",
    badge: "P2P MULTIPLAYER",
    description:
      "Serverless multiplayer puzzle game utilizing direct WebRTC DataChannels with PeerBasket matchmaking, deterministic handshake state machines, Supabase global leaderboards, and Canvas victory scorecards.",
    statsText: "WebRTC DataChannels · Zero Server Lag",
    tags: ["JavaScript", "WebRTC", "PeerJS", "Supabase", "GSAP"],
    githubUrl: "https://github.com/Bittu5134/GeoShuffle",
    headerColor: "#86efac",
    priority: 7,
  },
  {
    id: "lotm-reader",
    repo: "Bittu5134/LOTM-Reader",
    title: "LOTM-Reader",
    category: "WEB & CLOUD",
    badge: "113+ STARS",
    description:
      "Modern reader platform built with Svelte & SvelteKit. Features client-side typography customization, offline reading cache, dynamic chapter navigation, and integrated community discussion feeds.",
    statsText: "113+ ★ · 31 Forks · SvelteKit",
    tags: ["Svelte", "SvelteKit", "TypeScript", "Vite"],
    githubUrl: "https://github.com/Bittu5134/LOTM-Reader",
    headerColor: "#fde047",
    priority: 8,
  },
];
