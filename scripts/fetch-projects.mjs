import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import base project configuration by parsing or static fallback
const configPath = path.resolve(__dirname, "../src/config/projectsConfig.ts");
const outputPath = path.resolve(__dirname, "../src/data/generatedProjects.json");

// Direct project definitions
const baseProjects = [
  {
    id: "orv-reader",
    repo: "Bittu5134/ORV-Reader",
    title: "ORV-Reader",
    category: "WEB & CLOUD",
    badge: "10.5M+ REQ / MO",
    description:
      "High-scale web publishing platform serving 10.5M+ monthly requests (398+ GB bandwidth, 764k+ unique visits). Automated Python Markdown SSG dual-compilation into static web and compressed EPUBs with Cloudflare WAF bot defenses.",
    statsText: "398GB Bandwidth · 764K Visits",
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

async function fetchGithubRepoData(repo) {
  if (!repo) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const headers = {
      "User-Agent": "portfolio-build-script",
      Accept: "application/vnd.github.v3+json",
    };
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      return {
        stars: data.stargazers_count,
        forks: data.forks_count,
        openIssues: data.open_issues_count,
        description: data.description,
        language: data.language,
        updatedAt: data.pushed_at,
      };
    }
  } catch (err) {
    // Graceful fallback on network failure / offline mode
  }
  return null;
}

async function main() {
  console.log("⚡ [Build] Syncing projects data with GitHub API...");
  const enriched = await Promise.all(
    baseProjects.map(async (project) => {
      const ghData = await fetchGithubRepoData(project.repo);
      if (ghData) {
        // Dynamically enhance stats if stars exist
        let starsStr = ghData.stars ? `${ghData.stars} ★` : "";
        let forksStr = ghData.forks ? `${ghData.forks} forks` : "";
        let dynamicStats = [starsStr, forksStr].filter(Boolean).join(" · ");
        
        return {
          ...project,
          githubStats: ghData,
          statsText: project.statsText || dynamicStats,
        };
      }
      return project;
    })
  );

  // Strictly enforce max 8 projects
  const cappedProjects = enriched.sort((a, b) => a.priority - b.priority).slice(0, 8);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(cappedProjects, null, 2), "utf-8");
  console.log(`✓ [Build] Successfully generated ${cappedProjects.length} projects in ${outputPath}`);
}

main().catch((err) => {
  console.error("Error generating projects:", err);
  // Fallback write so build proceeds
  fs.writeFileSync(outputPath, JSON.stringify(baseProjects.slice(0, 8), null, 2), "utf-8");
});
