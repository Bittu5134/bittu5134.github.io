export default function RetroTechLab() {
  const techStack = [
    { name: "Go / Golang", bgClass: "bg-[#38bdf8]" },
    { name: "Rust", bgClass: "bg-[#fb923c]" },
    { name: "C / C++", bgClass: "bg-[#60a5fa]" },
    { name: "Python", bgClass: "bg-[#fde047]" },
    { name: "TypeScript", bgClass: "bg-[#38bdf8]" },
    { name: "Minecraft Java", bgClass: "bg-[#86efac]" },
    { name: "WebRTC", bgClass: "bg-[#f472b6]" },
    { name: "Redis", bgClass: "bg-[#f87171]" },
    { name: "Linux / POSIX", bgClass: "bg-[#fde047]" },
    { name: "Docker", bgClass: "bg-[#60a5fa]" },
    { name: "FastAPI", bgClass: "bg-[#a7f3d0]" },
    { name: "Tailwind / React", bgClass: "bg-[#38bdf8]" },
    { name: "PyMuPDF", bgClass: "bg-[#c4b5fd]" },
    { name: "Cloudflare Workers", bgClass: "bg-[#fb923c]" },
  ];

  return (
    <section id="lab" className="py-6 sm:py-8 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-black tracking-tight">
            ~/lab
          </h2>
        </div>

        {/* 4 Deep Domain Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-6 sm:mb-8">
          {/* Card 1: Low-Level Systems */}
          <div className="p-4 sm:p-6 bg-[#fffdf9] border-[3px] border-black shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="font-pixel text-xl sm:text-2xl font-bold bg-[#fde047] px-2 py-0.5 border border-black">
                  ⚙️ LOW-LEVEL SYSTEMS
                </span>
                <span className="font-mono text-[10px] sm:text-xs font-bold bg-black text-white px-2 py-0.5 shrink-0">
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
          <div className="p-4 sm:p-6 bg-[#fffdf9] border-[3px] border-black shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="font-pixel text-xl sm:text-2xl font-bold bg-[#86efac] px-2 py-0.5 border border-black">
                  📡 WEBRTC & P2P MESH
                </span>
                <span className="font-mono text-[10px] sm:text-xs font-bold bg-black text-white px-2 py-0.5 shrink-0">
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
          <div className="p-4 sm:p-6 bg-[#fffdf9] border-[3px] border-black shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="font-pixel text-xl sm:text-2xl font-bold bg-[#38bdf8] px-2 py-0.5 border border-black">
                  ⛏️ MINECRAFT PROTOCOL
                </span>
                <span className="font-mono text-[10px] sm:text-xs font-bold bg-black text-white px-2 py-0.5 shrink-0">
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
          <div className="p-4 sm:p-6 bg-[#fffdf9] border-[3px] border-black shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="font-pixel text-xl sm:text-2xl font-bold bg-[#c4b5fd] px-2 py-0.5 border border-black">
                  🧠 SPATIAL AI & VISION
                </span>
                <span className="font-mono text-[10px] sm:text-xs font-bold bg-black text-white px-2 py-0.5 shrink-0">
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

        {/* Tech Stash Box */}
        <div className="p-4 sm:p-8 bg-[#fffdf9] border-[3px] border-black shadow-brutal">
          <div className="mb-3 sm:mb-4">
            <span className="font-mono text-xs font-bold text-black uppercase">
              CORE TECHNOLOGIES & TOOLING:
            </span>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {techStack.map((tech, i) => (
              <span
                key={i}
                className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 border-2 border-black font-mono text-[11px] sm:text-sm font-bold shadow-brutal-xs flex items-center gap-1.5 select-none ${tech.bgClass}`}
              >
                <span>{tech.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
