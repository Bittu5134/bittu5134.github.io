"use client";

import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExperienceEntry {
  /** Short label shown in the left tab list */
  tabLabel: string;
  /** Period shown below the tab label */
  period: string;
  /** Role / position heading */
  role: string;
  /** Full organisation name */
  organisation: string;
  /** Bullet-point achievements / responsibilities */
  bullets: string[];
  /** Technology / skill tags */
  tags: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ENTRIES: ExperienceEntry[] = [
  {
    tabLabel: "IIT Kanpur",
    period: "2026 — 2030",
    role: "B.Tech Student — Cybersecurity",
    organisation: "Indian Institute of Technology Kanpur",
    bullets: [
      "Pursuing Bachelor of Technology in Cybersecurity & Computing Sciences",
      "Participating in hackathons — built InfraPulse (1st runner up, Takneek '26) and Sharelock (1st place, ShareIITK Ideathon)",
      "Contributing to CDW's IITK-Resume-Engine for academic policy parsing",
    ],
    tags: ["Cybersecurity", "Systems", "Hackathons", "IIT Kanpur"],
  },
  {
    tabLabel: "Open Source",
    period: "2024 — Present",
    role: "Systems & Distributed Systems Architect",
    organisation: "Independent / Open Source",
    bullets: [
      "Designed and shipped ORV-Reader: serving 10.5M+ monthly HTTP requests with Cloudflare WAF bot defenses",
      "Built PeerBasket: lobby-based WebRTC signaling with 41ms latency at 500 concurrent peers",
      "Created NetShip: zero-config EDR daemon with real-time geolocation dashboard",
    ],
    tags: ["Go", "WebRTC", "Python", "React", "Cloudflare"],
  },
  {
    tabLabel: "Minecraft Dev",
    period: "2022 — Present",
    role: "Protocol Reverse Engineer & Datapack Author",
    organisation: "Independent",
    bullets: [
      "Reverse engineered the Minecraft Java Edition binary wire protocol including VarInt framing and zlib compression",
      "Featured on Minecraft Live for technical datapack contributions",
      "Active member on Planet Minecraft with custom datapacks, mods, and protocol tooling",
    ],
    tags: ["Java", "C++", "Fabric", "Protocol", "Datapacks"],
  },
  {
    tabLabel: "Flight Sim",
    period: "2025",
    role: "Embedded & Simulation Engineer",
    organisation: "Research Project",
    bullets: [
      "Designed interactive SimpleFlightController: physics-based autopilot simulation with PID control loops",
      "Implemented in C++ with OpenGL rendering and simulated inertial measurement",
      "Exposed as an interactive web demo via React + Canvas",
    ],
    tags: ["C++", "Physics", "PID", "React", "Canvas"],
  },
];

// ─── Detail Panel ─────────────────────────────────────────────────────────────

interface DetailPanelProps {
  entry: ExperienceEntry;
}

function DetailPanel({ entry }: DetailPanelProps) {
  const [visible, setVisible] = useState(false);

  // Fade in on mount (key-based re-render handles the reset)
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className="transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* Role & Organisation */}
      <h3 className="text-2xl font-bold text-cream mb-1">{entry.role}</h3>
      <p className="text-amber_glow font-medium text-sm mb-6">
        {entry.organisation}
      </p>

      {/* Bullets */}
      <ul className="space-y-2 mb-6">
        {entry.bullets.map((bullet, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-cream/70 text-base leading-relaxed"
          >
            <span
              className="text-amber_glow mt-0.5 select-none flex-shrink-0"
              aria-hidden="true"
            >
              •
            </span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-xs bg-[#080b12] border border-white/10 text-lavender-light px-2.5 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ExperienceSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="experience"
      className="py-24 px-6 md:px-10"
      aria-label="Experience and Education"
    >
      <div className="max-w-5xl mx-auto">
        {/* ── Section Header ──────────────────────────────────────────────── */}
        <div className="mb-14">
          <p className="font-mono text-amber_glow text-sm mb-3 tracking-widest">
            — journey
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-cream leading-tight">
            Experience &amp; Education
          </h2>
        </div>

        {/* ── Two-column layout ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column — tab list */}
          <nav
            aria-label="Experience tabs"
            className="md:w-[280px] flex-shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0"
          >
            {ENTRIES.map((entry, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={entry.tabLabel}
                  onClick={() => setActiveIndex(index)}
                  aria-selected={isActive}
                  aria-controls="experience-detail"
                  role="tab"
                  className={[
                    "w-full text-left py-3 transition-all duration-200 rounded-r-lg",
                    isActive
                      ? "border-l-2 border-amber_glow pl-4 bg-amber_glow/5"
                      : "border-l-2 border-white/10 pl-4 hover:border-white/30",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "block text-base font-semibold leading-snug transition-colors duration-200",
                      isActive ? "text-cream" : "text-cream/50 hover:text-cream",
                    ].join(" ")}
                  >
                    {entry.tabLabel}
                  </span>
                  <span className="block text-xs text-cream/40 mt-0.5">
                    {entry.period}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right column — detail panel */}
          <div
            id="experience-detail"
            role="tabpanel"
            className="flex-1 bg-[#0b0e17] border border-white/10 rounded-2xl p-7 min-h-[280px]"
          >
            {/* key forces React to unmount/remount DetailPanel on tab change,
                which resets the fade-in animation */}
            <DetailPanel key={activeIndex} entry={ENTRIES[activeIndex]} />
          </div>
        </div>
      </div>
    </section>
  );
}
