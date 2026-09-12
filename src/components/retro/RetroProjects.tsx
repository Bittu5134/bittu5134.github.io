import { useState } from "react";

interface Project {
  title: string;
  category: string;
  badge: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  headerColor: string;
  statsText: string;
}

export default function RetroProjects() {
  const [filter, setFilter] = useState("ALL");

  const projects: Project[] = [
    {
      title: "ORV-Reader",
      category: "WEB / CLOUD",
      badge: "10.5M+ REQUESTS / MO",
      description:
        "High-scale distributed web publishing platform serving 10.5M+ monthly HTTP requests (398+ GB bandwidth, 764k+ unique visits). Automated Python Markdown SSG dual-compilation into static web and compressed EPUBs with Cloudflare WAF bot defenses.",
      tags: ["Python", "SSG", "Cloudflare WAF", "EPUB", "FastAPI"],
      liveUrl: "https://orv.pages.dev",
      githubUrl: "https://github.com/Bittu5134/ORV-Reader",
      headerColor: "#fde047",
      statsText: "398GB Bandwidth · 764K Visits",
    },
    {
      title: "PeerBasket",
      category: "SYSTEMS / P2P",
      badge: "41ms LATENCY · 0% LOSS",
      description:
        "High-throughput, lobby-based WebRTC signaling server written in Go with Gin and Redis. Achieves 41 ms average latency and 0.0% packet loss across 500 concurrent peers with Redis TTL heartbeat pruning and IP token-bucket rate limiting on bare-metal Proxmox infrastructure.",
      tags: ["Go", "WebRTC", "Redis", "Proxmox", "Gin"],
      liveUrl: "https://peerbasket.bittu.dev",
      githubUrl: "https://github.com/Bittu5134/PeerBasket",
      headerColor: "#86efac",
      statsText: "500 Concurrent Peers · Bare-metal",
    },
    {
      title: "NetShip",
      category: "SYSTEMS / EDR",
      badge: "KERNEL TELEMETRY",
      description:
        "Cross-platform Host Telemetry and Endpoint Detection & Response (EDR) daemon in Go. Captures active TCP/UDP socket activity, maps process lineages via deterministic 24-char SHA-256 GUIDs, performs local cryptographic binary auditing, and runs an embedded live geolocation dashboard.",
      tags: ["Go", "Networking", "Telemetry", "EDR", "Linux"],
      githubUrl: "https://github.com/Bittu5134/NetShip",
      headerColor: "#38bdf8",
      statsText: "SHA-256 GUIDs · Socket Tracing",
    },
    {
      title: "IITK-Resume-Engine",
      category: "AI / GEOMETRY",
      badge: "4,400+ COURSES INDEXED",
      description:
        "Spatial LaTeX-PDF diagnostic engine built for IIT Kanpur Academics & Career Council (CDW). Features a 2D coordinate geometry table parser in PyMuPDF recognizing 4,400+ IITK courses and CPI metrics, paired with a 6-track step-gradient scoring model and counterfactual gap advice.",
      tags: ["Python", "PyMuPDF", "FastAPI", "LaTeX", "Spatial Geometry"],
      liveUrl: "https://iitk-resume.bittu.dev",
      githubUrl: "https://github.com/Bittu5134/IITK-Resume-Model",
      headerColor: "#c4b5fd",
      statsText: "99.4% Parsing Precision · CDW IITK",
    },
    {
      title: "InfraPulse",
      category: "AI / VISION",
      badge: "TAKNEEK '26 RUNNER-UP",
      description:
        "Civic defect detection and priority dispatch platform developed for IIT Kanpur Takneek '26. Combines a 5-model PyTorch vision ensemble with Sobel spatial edge severity math, async FastAPI ticket routing, and live Server-Sent Events (SSE) staff dispatch queues.",
      tags: ["PyTorch", "YOLO", "Sobel Math", "FastAPI", "SSE"],
      liveUrl: "https://infrapulse.bittu.dev",
      githubUrl: "https://github.com/Bittu5134/InfraPulse",
      headerColor: "#fb923c",
      statsText: "5-Model Vision Ensemble · Real-time SSE",
    },
    {
      title: "Sharelock",
      category: "AI / RETRIEVAL",
      badge: "1st PLACE SHAREIITK",
      description:
        "1st Place Winner at ShareIITK Ideathon. An end-to-end RAG retrieval pipeline and Model Context Protocol (MCP) server indexing 100+ pages of dense IIT Kanpur Undergraduate Manual academic policies for citation-backed query resolution.",
      tags: ["RAG", "MCP Server", "TypeScript", "Policy Search"],
      githubUrl: "https://github.com/Bittu5134/Sharelock",
      headerColor: "#f472b6",
      statsText: "1st Place Winner · MCP Server",
    },
  ];

  const filteredProjects =
    filter === "ALL"
      ? projects
      : projects.filter((p) => p.category.includes(filter));

  return (
    <section id="projects" className="py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-block px-3 py-1 bg-[#fb923c] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs mb-2">
              SECTION_01 // INVENTIONS & BUILDS
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black">
              THINGS I'VE BUILT.
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 font-mono text-xs font-bold">
            {["ALL", "SYSTEMS", "AI", "WEB"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 border-2 border-black transition-all ${
                  filter === cat
                    ? "bg-[#fde047] shadow-brutal-xs font-black -translate-y-0.5"
                    : "bg-[#fffdf9] hover:bg-[#f6eedb]"
                }`}
              >
                [{cat}]
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredProjects.map((p, index) => (
            <div
              key={index}
              className="bg-[#fffdf9] border-[3px] border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              {/* Retro Window Header */}
              <div
                className="px-4 py-2 border-b-[3px] border-black flex items-center justify-between select-none"
                style={{ backgroundColor: p.headerColor }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-black rounded-none"></span>
                  <span className="font-mono text-xs font-bold text-black uppercase tracking-wider">
                    {p.category}
                  </span>
                </div>
                <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5 font-bold">
                  {p.badge}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-2xl font-black text-black mb-1">
                    {p.title}
                  </h3>
                  <div className="font-mono text-[11px] font-bold text-[#f59e0b] mb-3">
                    {p.statsText}
                  </div>
                  <p className="font-mono text-xs sm:text-sm text-black/80 leading-relaxed mb-4">
                    {p.description}
                  </p>
                </div>

                <div>
                  {/* Tag Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {p.tags.map((tag, tIndex) => (
                      <span
                        key={tIndex}
                        className="px-2 py-0.5 bg-[#f6eedb] border border-black font-mono text-[11px] font-bold text-black"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-3 border-t-2 border-black/10">
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 bg-[#fde047] text-black font-mono text-xs font-bold border-2 border-black shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1"
                      >
                        <span>LIVE DEMO</span>
                        <span>↗</span>
                      </a>
                    )}
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 bg-[#fffdf9] text-black font-mono text-xs font-bold border-2 border-black shadow-brutal-xs hover:bg-[#86efac] hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1"
                      >
                        <span>SOURCE CODE</span>
                        <span>↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* GitHub link footer note */}
        <div className="mt-8 p-4 bg-[#fffdf9] border-2 border-black shadow-brutal-xs flex items-center justify-between flex-wrap gap-4 font-mono text-xs font-bold">
          <span className="text-black/70">
            ★ Looking for older experimental repos, Minecraft tools & script dumps?
          </span>
          <a
            href="https://github.com/Bittu5134?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#c4b5fd] border-2 border-black shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 transition-all"
          >
            VIEW 25+ REPOSITORIES ON GITHUB ↗
          </a>
        </div>
      </div>
    </section>
  );
}
