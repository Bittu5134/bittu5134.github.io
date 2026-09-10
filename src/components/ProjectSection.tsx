import { motion } from "motion/react";
import ProjectCard from "./ProjectCard";

interface Project {
  name: string;
  url: string;
  description: string;
  githubUrl?: string;
  imageSrc?: string;
}

export default function ProjectsSection() {
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

  return (
    <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pointer-events-none">
      {projects.map((project, index) => (
        <div key={index} className="pointer-events-auto w-full">
          <ProjectCard
            name={project.name}
            url={project.url}
            description={project.description}
            githubUrl={project.githubUrl}
            imageSrc={project.imageSrc}
          />
        </div>
      ))}
    </motion.div>
  );
}
