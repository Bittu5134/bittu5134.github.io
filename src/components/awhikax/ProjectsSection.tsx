"use client";

import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterCategory = "All" | "Systems & P2P" | "AI & Vision" | "Web & Tools";

interface Project {
  name: string;
  /** Short badge shown on the card */
  categoryBadge: string;
  description: string;
  /** Live URL — null if not deployed */
  url: string | null;
  github: string;
  tags: string[];
  /** Filter category this project belongs to */
  filter: FilterCategory;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FILTER_CATEGORIES: FilterCategory[] = [
  "All",
  "Systems & P2P",
  "AI & Vision",
  "Web & Tools",
];

const PROJECTS: Project[] = [
  {
    name: "ORV-Reader",
    categoryBadge: "Web",
    description:
      "High-scale static publishing platform serving 10.5M+ monthly HTTP requests and 398+ GB bandwidth. Automated Python SSG dual-compilation into static web and EPUBs with Cloudflare WAF bot defenses.",
    url: "https://orv.pages.dev",
    github: "https://github.com/Bittu5134/ORV-Reader",
    tags: ["Python", "Cloudflare", "CDN"],
    filter: "Web & Tools",
  },
  {
    name: "PeerBasket",
    categoryBadge: "Systems & P2P",
    description:
      "Lobby-based WebRTC signaling server in Go + Redis. 41ms median latency, 0.0% packet loss across 500 concurrent peers with IP token-bucket rate limiting on bare-metal Proxmox.",
    url: "https://peerbasket.bittu.dev",
    github: "https://github.com/Bittu5134/PeerBasket",
    tags: ["Go", "WebRTC", "Redis"],
    filter: "Systems & P2P",
  },
  {
    name: "NetShip",
    categoryBadge: "Systems & P2P",
    description:
      "Cross-platform EDR daemon in Go. Captures TCP/UDP socket activity, process lineages via SHA-256 GUIDs, binary auditing, and live geolocation dashboard.",
    url: null,
    github: "https://github.com/Bittu5134/NetShip",
    tags: ["Go", "eBPF", "Linux"],
    filter: "Systems & P2P",
  },
  {
    name: "IITK Resume Engine",
    categoryBadge: "AI & Vision",
    description:
      "Spatial LaTeX-PDF diagnostic engine for IIT Kanpur CDW. 2D coordinate geometry parser recognizing 4,400+ courses with 6-track scoring model and counterfactual gap advice.",
    url: "https://iitk-resume.bittu.dev",
    github: "https://github.com/Bittu5134/IITK-Resume-Model",
    tags: ["Python", "PyMuPDF", "FastAPI"],
    filter: "AI & Vision",
  },
  {
    name: "InfraPulse",
    categoryBadge: "AI & Vision",
    description:
      "Civic defect detection platform (Takneek '26 1st runner up). 5-model PyTorch vision ensemble with Sobel edge severity math, async FastAPI routing, live SSE dispatch queues.",
    url: "https://infrapulse.bittu.dev",
    github: "https://github.com/Bittu5134/InfraPulse",
    tags: ["PyTorch", "YOLO", "FastAPI"],
    filter: "AI & Vision",
  },
  {
    name: "Sharelock",
    categoryBadge: "Web & Tools",
    description:
      "1st Place, ShareIITK Ideathon. End-to-end RAG pipeline and MCP server indexing 100+ pages of dense IIT Kanpur Undergraduate Manual policies for citation-backed query resolution.",
    url: null,
    github: "https://github.com/Bittu5134/Sharelock",
    tags: ["RAG", "MCP", "TypeScript"],
    filter: "Web & Tools",
  },
];

// ─── Project Card ─────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="bg-[#0b0e17] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-amber_glow/30 hover:-translate-y-1 transition-all duration-300 group">
      {/* Top row: name + badge */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-bold text-cream group-hover:text-amber_glow transition-colors leading-tight">
          {project.name}
        </h3>
        <span className="flex-shrink-0 text-xs font-mono bg-[#080b12] border border-white/10 text-cream/40 px-2 py-0.5 rounded-full whitespace-nowrap">
          {project.categoryBadge}
        </span>
      </div>

      {/* Description */}
      <p className="text-cream/60 text-sm leading-relaxed flex-1">
        {project.description}
      </p>

      {/* Bottom row: links + tags */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5">
        {/* Links */}
        <div className="flex items-center gap-4">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-amber_glow hover:underline transition-colors"
              aria-label={`Visit ${project.name} live site`}
            >
              Live Site ↗
            </a>
          )}
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-amber_glow hover:underline transition-colors"
            aria-label={`View ${project.name} on GitHub`}
          >
            GitHub ↗
          </a>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-xs bg-[#080b12] border border-white/10 text-lavender-light px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All");

  const visibleProjects = useMemo(
    () =>
      activeFilter === "All"
        ? PROJECTS
        : PROJECTS.filter((p) => p.filter === activeFilter),
    [activeFilter]
  );

  return (
    <section
      id="projects"
      className="py-24 px-6 md:px-10"
      aria-label="Projects"
    >
      <div className="max-w-5xl mx-auto">
        {/* ── Section Header ──────────────────────────────────────────────── */}
        <div className="mb-10">
          <p className="font-mono text-amber_glow text-sm mb-3 tracking-widest">
            — projects
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-cream leading-tight">
            Things I&apos;ve Built
          </h2>
        </div>

        {/* ── Filter Pills ─────────────────────────────────────────────────── */}
        <div
          className="flex flex-wrap gap-2 mb-10"
          role="group"
          aria-label="Filter projects by category"
        >
          {FILTER_CATEGORIES.map((category) => {
            const isActive = category === activeFilter;
            return (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                aria-pressed={isActive}
                className={[
                  "px-4 py-2 rounded-full text-sm font-mono transition-all duration-200",
                  isActive
                    ? "bg-amber_glow text-[#080b12] font-bold"
                    : "bg-transparent border border-white/10 text-cream/60 hover:border-white/30 hover:text-cream",
                ].join(" ")}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* ── Project Grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 transition-opacity duration-300">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>

        {/* ── GitHub CTA ───────────────────────────────────────────────────── */}
        <div className="mt-12 text-center">
          <a
            href="https://github.com/Bittu5134?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-amber_glow hover:underline transition-colors"
          >
            View all repositories on GitHub ↗
          </a>
        </div>
      </div>
    </section>
  );
}
