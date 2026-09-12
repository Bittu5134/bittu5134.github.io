import { useState } from "react";

export default function RetroTechLab() {
  const [clickedTech, setClickedTech] = useState<string | null>(null);

  const techStack = [
    { name: "Go / Golang", color: "#38bdf8", cat: "Systems & Daemons" },
    { name: "Rust", color: "#fb923c", cat: "Memory Safety & Speed" },
    { name: "C / C++", color: "#60a5fa", cat: "Embedded & Protocols" },
    { name: "Python", color: "#fde047", cat: "PyTorch & AI Vision" },
    { name: "TypeScript", color: "#38bdf8", cat: "Frontend & Tooling" },
    { name: "Minecraft Java", color: "#86efac", cat: "Fabric & Network Wire" },
    { name: "WebRTC", color: "#f472b6", cat: "P2P DataChannels" },
    { name: "Redis", color: "#f87171", cat: "TTL Heartbeats & PubSub" },
    { name: "Linux / POSIX", color: "#fde047", cat: "Daemons & Sockets" },
    { name: "Docker", color: "#60a5fa", cat: "Containers" },
    { name: "FastAPI", color: "#a7f3d0", cat: "Async APIs" },
    { name: "Tailwind / React", color: "#38bdf8", cat: "Neo-Brutalist UI" },
    { name: "PyMuPDF", color: "#c4b5fd", cat: "Spatial PDF Geometry" },
    { name: "Cloudflare Workers", color: "#fb923c", cat: "Edge & WAF" },
  ];

  const handleTechClick = (name: string) => {
    setClickedTech(name);
    setTimeout(() => setClickedTech(null), 1500);
  };

  return (
    <section id="lab" className="py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <div className="inline-block px-3 py-1 bg-[#86efac] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs mb-2">
            SECTION_02 // THE WORKBENCH
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black">
            TECH STACK & CAPABILITIES.
          </h2>
        </div>

        {/* 4 Deep Domain Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Card 1: Low-Level Systems */}
          <div className="p-6 bg-[#fffdf9] border-[3px] border-black shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-pixel text-2xl font-bold bg-[#fde047] px-2 py-0.5 border border-black">
                  ⚙️ 01. LOW-LEVEL SYSTEMS
                </span>
                <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">
                  POSIX / GO
                </span>
              </div>
              <p className="font-mono text-xs sm:text-sm text-black/80 leading-relaxed mb-4">
                Building Linux background daemons, socket interceptors, memory-mapped I/O, process lineage tracking with SHA-256 GUIDs, and raw TCP/UDP networking utilities.
              </p>
            </div>
            <div className="flex flex-wrap gap-1 font-mono text-[11px] font-bold">
              <span className="bg-[#f6eedb] border border-black px-2 py-0.5">#Go</span>
              <span className="bg-[#f6eedb] border border-black px-2 py-0.5">#Sockets</span>
              <span className="bg-[#f6eedb] border border-black px-2 py-0.5">#Daemons</span>
            </div>
          </div>

          {/* Card 2: WebRTC & P2P */}
          <div className="p-6 bg-[#fffdf9] border-[3px] border-black shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-pixel text-2xl font-bold bg-[#86efac] px-2 py-0.5 border border-black">
                  📡 02. WEBRTC & P2P MESH
                </span>
                <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">
                  SIGNALING
                </span>
              </div>
              <p className="font-mono text-xs sm:text-sm text-black/80 leading-relaxed mb-4">
                Lobby-based signaling architecture, SDP/ICE candidate routing over Goroutine bounded queues, Redis TTL heartbeat pruning, and zero-drop peer-to-peer file streaming.
              </p>
            </div>
            <div className="flex flex-wrap gap-1 font-mono text-[11px] font-bold">
              <span className="bg-[#f6eedb] border border-black px-2 py-0.5">#WebRTC</span>
              <span className="bg-[#f6eedb] border border-black px-2 py-0.5">#Redis</span>
              <span className="bg-[#f6eedb] border border-black px-2 py-0.5">#ZeroLoss</span>
            </div>
          </div>

          {/* Card 3: Minecraft Protocol & Modding */}
          <div className="p-6 bg-[#fffdf9] border-[3px] border-black shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-pixel text-2xl font-bold bg-[#38bdf8] px-2 py-0.5 border border-black">
                  ⛏️ 03. MINECRAFT PROTOCOL
                </span>
                <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">
                  FABRIC / JAVA
                </span>
              </div>
              <p className="font-mono text-xs sm:text-sm text-black/80 leading-relaxed mb-4">
                Reverse-engineering the Minecraft Java binary wire protocol: VarInt framing, zlib packet compression, packet sniffers, and datapacks featured on Minecraft Live.
              </p>
            </div>
            <div className="flex flex-wrap gap-1 font-mono text-[11px] font-bold">
              <span className="bg-[#f6eedb] border border-black px-2 py-0.5">#VarInt</span>
              <span className="bg-[#f6eedb] border border-black px-2 py-0.5">#Fabric</span>
              <span className="bg-[#f6eedb] border border-black px-2 py-0.5">#MC Live</span>
            </div>
          </div>

          {/* Card 4: Spatial AI & PyTorch */}
          <div className="p-6 bg-[#fffdf9] border-[3px] border-black shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-pixel text-2xl font-bold bg-[#c4b5fd] px-2 py-0.5 border border-black">
                  🧠 04. SPATIAL AI & VISION
                </span>
                <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">
                  PYTORCH / PYMUPDF
                </span>
              </div>
              <p className="font-mono text-xs sm:text-sm text-black/80 leading-relaxed mb-4">
                2D Cartesian coordinate geometry clustering for unstructured LaTeX PDFs, 5-model PyTorch vision ensembles with Sobel edge severity analysis for civic defects.
              </p>
            </div>
            <div className="flex flex-wrap gap-1 font-mono text-[11px] font-bold">
              <span className="bg-[#f6eedb] border border-black px-2 py-0.5">#PyTorch</span>
              <span className="bg-[#f6eedb] border border-black px-2 py-0.5">#PyMuPDF</span>
              <span className="bg-[#f6eedb] border border-black px-2 py-0.5">#YOLO</span>
            </div>
          </div>
        </div>

        {/* Interactive Tactile Tech Stash Box */}
        <div className="p-6 sm:p-8 bg-[#fffdf9] border-[3px] border-black shadow-brutal">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="font-mono text-xs font-bold text-black uppercase">
              ⚡ CLICK ANY CHIP TO TEST PHYSICAL CLICK FEEL:
            </span>
            {clickedTech && (
              <span className="font-mono text-xs font-bold bg-[#fde047] text-black px-2 py-0.5 border border-black animate-bounceSubtle">
                ★ POKED {clickedTech.toUpperCase()}! ★
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {techStack.map((tech, i) => (
              <button
                key={i}
                onClick={() => handleTechClick(tech.name)}
                className="px-3.5 py-2 border-2 border-black font-mono text-xs sm:text-sm font-bold shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: tech.color }}
              >
                <span>{tech.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
