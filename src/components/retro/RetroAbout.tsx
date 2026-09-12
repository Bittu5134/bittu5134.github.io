export default function RetroAbout() {
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
    <section id="about" className="py-6 sm:py-8 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-black tracking-tight">
            ~/about
          </h2>
        </div>

        {/* Row 1: Bio + Glance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
          {/* Main Story Box (7 cols) */}
          <div className="lg:col-span-7 p-5 sm:p-8 bg-[#fffdf9] border-[3px] border-black shadow-brutal flex flex-col justify-between">
            <div className="space-y-4 font-mono text-sm sm:text-base text-black/85 leading-relaxed">
              <p>
                I'm <strong>Bittu</strong>. Currently an undergraduate studying <strong>Cybersecurity &amp; Computing</strong> at{" "}
                <a
                  href="https://iitk.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#38bdf8]/30 px-1 border-b-2 border-black font-bold hover:bg-[#38bdf8]/60 transition-colors"
                >
                  IIT Kanpur '30
                </a>
                .
              </p>

              <p>
                I love building software from first principles: raw sockets, WebRTC mesh topologies, zero-allocation Go loops, and reverse-engineering binary network packets. If something feels like a black box, I usually open Wireshark or a decompiler until it makes sense.
              </p>

              <p>
                Outside of systems code, I've spent years deep in the{" "}
                <a
                  href="https://www.planetminecraft.com/member/bittu5134/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#86efac]/40 px-1 border-b-2 border-black font-bold hover:bg-[#86efac]/80 transition-colors"
                >
                  Minecraft Technical &amp; Modding
                </a>{" "}
                community. One of my datapack creations was spotlighted on <strong>Minecraft Live</strong>, which cemented my love for game loops and network protocols.
              </p>

              <p>
                When I'm not writing code, I'm usually exploring ambient music, playing sandbox games, or tinkering with open-source tools.
              </p>
            </div>

            {/* Signature Strip */}
            <div className="mt-6 pt-4 border-t-2 border-black/10 flex items-center justify-between flex-wrap gap-2">
              <span className="font-pixel text-xl sm:text-2xl font-bold text-black">
                — BITTU (@BITTU5134)
              </span>
              <span className="font-mono text-xs font-bold text-black/60">
                IIT KANPUR
              </span>
            </div>
          </div>

          {/* AT A GLANCE card (5 cols) */}
          <div className="lg:col-span-5 p-5 sm:p-6 bg-[#fde047] border-[3px] border-black shadow-brutal flex flex-col justify-between">
            <div>
              <h3 className="font-mono text-xs sm:text-sm font-bold text-black uppercase tracking-wider mb-4 pb-2 border-b-2 border-black">
                AT A GLANCE:
              </h3>
              <ul className="space-y-3 font-mono text-xs sm:text-sm font-bold text-black">
                <li className="flex items-start gap-2.5">
                  <span className="text-base">🎓</span>
                  <span>B.Tech Cybersecurity @ IIT Kanpur '30</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-base">⛏️</span>
                  <span>Featured on official Minecraft Live broadcast</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-base">🏆</span>
                  <span>1st Place at ShareIITK Hackathon (Sharelock)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-base">🥈</span>
                  <span>Takneek '26 1st Runner-Up (InfraPulse)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-base">⚡</span>
                  <span>10.5M+ requests served on ORV-Reader</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Row 2: Core Technologies & Tooling */}
        <div className="mt-8 p-5 sm:p-8 bg-[#fffdf9] border-[3px] border-black shadow-brutal">
          <div className="mb-4">
            <span className="font-mono text-xs sm:text-sm font-bold text-black uppercase tracking-wider">
              CORE TECHNOLOGIES &amp; TOOLING:
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {techStack.map((tech, i) => (
              <span
                key={i}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-black font-mono text-xs sm:text-sm font-bold shadow-brutal-xs flex items-center gap-1.5 select-none ${tech.bgClass}`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
