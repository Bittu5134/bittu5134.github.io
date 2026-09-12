export default function RetroAbout() {
  return (
    <section id="about" className="py-6 sm:py-8 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-black tracking-tight">
            ~/about
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
          {/* Main Story Box (7 cols) */}
          <div className="lg:col-span-7 p-4 sm:p-8 bg-[#fffdf9] border-[3px] border-black shadow-brutal flex flex-col justify-between">
            <div className="space-y-4 font-mono text-xs sm:text-sm text-black/85 leading-relaxed">
              <p>
                I'm <strong>Divyanshu Anand (Bittu)</strong>. Currently an undergraduate studying <strong>Cybersecurity & Computing</strong> at{" "}
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
                  Minecraft Technical & Modding
                </a>{" "}
                community. One of my datapack creations was spotlighted on <strong>Minecraft Live</strong>, which cemented my love for game loops and network protocols.
              </p>

              <p>
                When I'm not writing code, I'm usually exploring ambient music, playing sandbox games, or tinkering with open-source tools.
              </p>
            </div>

            {/* Signature Strip */}
            <div className="mt-5 sm:mt-6 pt-4 border-t-2 border-black/10 flex items-center justify-between flex-wrap gap-2">
              <span className="font-pixel text-lg sm:text-xl font-bold text-black">
                — DIVYANSHU (BITTU5134)
              </span>
              <span className="font-mono text-[11px] sm:text-xs font-bold text-black/50">
                IIT KANPUR
              </span>
            </div>
          </div>

          {/* Side Summary Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Quick Summary Card */}
            <div className="p-4 sm:p-6 bg-[#fde047] border-[3px] border-black shadow-brutal">
              <h3 className="font-mono text-xs font-bold text-black uppercase tracking-wider mb-3 pb-1 border-b-2 border-black">
                AT A GLANCE:
              </h3>
              <ul className="space-y-2.5 font-mono text-xs font-bold text-black">
                <li className="flex items-start gap-2">
                  <span>🎓</span>
                  <span>B.Tech Cybersecurity @ IIT Kanpur '30</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>⛏️</span>
                  <span>Featured on official Minecraft Live broadcast</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🏆</span>
                  <span>1st Place at ShareIITK Hackathon (Sharelock)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🥈</span>
                  <span>Takneek '26 1st Runner-Up (InfraPulse)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>⚡</span>
                  <span>10.5M+ requests served on ORV-Reader</span>
                </li>
              </ul>
            </div>

            {/* Links Box */}
            <div className="p-5 bg-[#fffdf9] border-[3px] border-black shadow-brutal flex flex-col justify-between">
              <span className="font-mono text-xs font-bold text-black uppercase mb-3 pb-1 border-b border-black">
                PROFILES & LINKS:
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs font-bold">
                <a
                  href="https://github.com/Bittu5134"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#f6eedb] border border-black hover:bg-[#c4b5fd] text-center transition-colors"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://www.planetminecraft.com/member/bittu5134/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#f6eedb] border border-black hover:bg-[#86efac] text-center transition-colors"
                >
                  PMC ↗
                </a>
                <a
                  href="/discord"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#f6eedb] border border-black hover:bg-[#38bdf8] text-center transition-colors"
                >
                  Discord ↗
                </a>
                <a
                  href="/rss.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#f6eedb] border border-black hover:bg-[#fb923c] text-center transition-colors"
                >
                  RSS Feed ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
