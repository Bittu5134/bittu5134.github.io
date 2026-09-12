import { useState } from "react";

interface Project {
  name: string;
  url: string;
  description: string;
  githubUrl?: string;
  imageSrc?: string;
}

export default function ProjectsSection() {
  const [showAll, setShowAll] = useState(false);

  const projects: Project[] = [
    {
      name: "ORV-Reader",
      url: "https://orv.pages.dev",
      description:
        "High-scale distributed web publishing platform serving 10.5M+ monthly HTTP requests (398+ GB bandwidth, 764k+ unique visits). Automated Python Markdown SSG dual-compilation into static web and compressed EPUBs (<80 MB) with Cloudflare WAF bot defenses.",
      githubUrl: "https://github.com/Bittu5134/ORV-Reader",
      imageSrc: "/images/projects/orv-reader.png",
    },
    {
      name: "PeerBasket",
      url: "https://peerbasket.bittu.dev",
      description:
        "High-throughput, lobby-based WebRTC signaling server written in Go with Gin and Redis. Achieves 41 ms average latency and 0.0% packet loss across 500 concurrent peers with Redis TTL heartbeat pruning and IP token-bucket rate limiting on bare-metal Proxmox infrastructure.",
      githubUrl: "https://github.com/Bittu5134/PeerBasket",
      imageSrc: "/images/projects/peerbasket.png",
    },
    {
      name: "NetShip",
      url: "",
      description:
        "Cross-platform Host Telemetry and Endpoint Detection & Response (EDR) daemon in Go. Captures active TCP/UDP socket activity, maps process lineages via deterministic 24-char SHA-256 GUIDs, performs local cryptographic binary auditing, and runs an embedded live geolocation dashboard.",
      githubUrl: "https://github.com/Bittu5134/NetShip",
      imageSrc: "/images/projects/netship.png",
    },
    {
      name: "IITK-Resume-Engine",
      url: "https://iitk-resume.bittu.dev",
      description:
        "Spatial LaTeX-PDF diagnostic engine built for IIT Kanpur Academics & Career Council (CDW). Features a 2D coordinate geometry table parser in PyMuPDF recognizing 4,400+ IITK courses and CPI metrics, paired with a 6-track step-gradient scoring model and counterfactual gap advice.",
      githubUrl: "https://github.com/Bittu5134/IITK-Resume-Model",
      imageSrc: "/images/projects/iitk-resume.png",
    },
    {
      name: "InfraPulse",
      url: "https://infrapulse.bittu.dev",
      description:
        "Civic defect detection and priority dispatch platform developed for IIT Kanpur Takneek '26. Combines a 5-model PyTorch vision ensemble with Sobel spatial edge severity math, async FastAPI ticket routing, and live Server-Sent Events (SSE) staff dispatch queues.",
      githubUrl: "https://github.com/Bittu5134/InfraPulse",
      imageSrc: "/images/projects/infrapulse.png",
    },
    {
      name: "Sharelock",
      url: "",
      description:
        "1st Place Winner at ShareIITK Ideathon. An end-to-end RAG retrieval pipeline and Model Context Protocol (MCP) server indexing 100+ pages of dense IIT Kanpur Undergraduate Manual academic policies for citation-backed query resolution.",
      githubUrl: "https://github.com/Bittu5134/Sharelock",
      imageSrc: "/images/projects/sharelock.png",
    },
  ];

  const visibleProjects = showAll ? projects : projects.slice(0, 3);

  return (
    <div className="flex flex-col divide-y divide-cream/[0.08] pointer-events-auto w-full max-w-4xl">
      {visibleProjects.map((project, index) => (
        <article key={index} className="py-8 first:pt-0 last:pb-0 group">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-cream group-hover:text-amber_glow transition-colors duration-200">
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline underline-offset-4 decoration-amber_glow/40"
                  >
                    {project.name}{" "}
                    <span className="text-base text-cream/40 group-hover:text-amber_glow font-normal">
                      ↗
                    </span>
                  </a>
                ) : (
                  <span>{project.name}</span>
                )}
              </h3>

              <div className="flex items-center gap-4 text-sm font-mono">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/50 hover:text-amber_glow transition-colors"
                  >
                    live site ↗
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/50 hover:text-amber_glow transition-colors"
                  >
                    github ↗
                  </a>
                )}
              </div>
            </div>

            <p className="text-cream/70 text-base md:text-lg leading-relaxed mt-1 font-normal">
              {project.description}
            </p>
          </div>
        </article>
      ))}

      {/* More projects controls */}
      <div className="pt-8 flex items-center justify-between flex-wrap gap-4 text-sm font-mono">
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-amber_glow hover:underline underline-offset-4 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span>{showAll ? "(- show fewer projects)" : "(+ more projects)"}</span>
        </button>

        <a
          href="https://github.com/Bittu5134?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cream/40 hover:text-cream transition-colors flex items-center gap-1 text-xs"
        >
          <span>all repos on github</span>
          <span>↗</span>
        </a>
      </div>
    </div>
  );
}
