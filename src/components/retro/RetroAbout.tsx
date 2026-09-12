export default function RetroAbout() {
  return (
    <section id="about" className="py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <div className="inline-block px-3 py-1 bg-[#fde047] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs mb-2">
            SECTION_04 // THE MEATSPACE LORE
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black">
            WHO IS BEHIND THIS TERMINAL?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Main Story Box (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-[#fffdf9] border-[3px] border-black shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-black/10">
                <span className="font-mono text-xs font-bold bg-black text-[#fde047] px-2 py-0.5">
                  LORE_FILE: /var/log/bittu.md
                </span>
              </div>

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
                  Outside of pure systems code, I've spent years deep in the{" "}
                  <a
                    href="https://www.planetminecraft.com/member/bittu5134/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#86efac]/40 px-1 border-b-2 border-black font-bold hover:bg-[#86efac]/80 transition-colors"
                  >
                    Minecraft Technical & Modding
                  </a>{" "}
                  community. One of my datapack creations got spotlighted on <strong>Minecraft Live</strong>, which cemented my obsession with game loops and network synchronizations.
                </p>

                <p>
                  When I'm not writing code, I'm usually making electronic synth playlists, playing sandbox survival games, or tinkering with retro computing hardware.
                </p>
              </div>
            </div>

            {/* Retro Signature Strip */}
            <div className="mt-6 pt-4 border-t-2 border-black/10 flex items-center justify-between flex-wrap gap-2">
              <span className="font-pixel text-xl font-bold text-black">
                — DIVYANSHU (BITTU5134)
              </span>
              <span className="font-mono text-xs font-bold text-black/50">
                HOST: KANPUR, IN
              </span>
            </div>
          </div>

          {/* Side Quirks & Fun Fact Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Quick Facts Card */}
            <div className="p-6 bg-[#fde047] border-[3px] border-black shadow-brutal">
              <h3 className="font-mono text-xs font-bold text-black uppercase tracking-wider mb-3 pb-1 border-b-2 border-black">
                ★ QUICK RIG STATS & QUIRKS:
              </h3>
              <ul className="space-y-2 font-mono text-xs font-bold text-black">
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
                  <span>Wrote a WebRTC signaling server handling 500 peers @ 41ms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>☕</span>
                  <span>Fuel: Masala chai & Lo-Fi ambient synth</span>
                </li>
              </ul>
            </div>

            {/* Nostalgic Visitor Hit Counter */}
            <div className="p-5 bg-[#fffdf9] border-[3px] border-black shadow-brutal flex flex-col items-center justify-center text-center">
              <span className="font-mono text-[11px] font-bold text-black/60 uppercase mb-2">
                ★ OLD INTERNET HIT COUNTER ★
              </span>
              <div className="flex items-center gap-1 bg-black p-2 border-2 border-black shadow-inner">
                {["0", "0", "4", "8", "2", "9"].map((digit, idx) => (
                  <span
                    key={idx}
                    className="font-pixel text-3xl font-black bg-[#1e293b] text-[#86efac] px-2 py-0.5 border border-[#334155]"
                  >
                    {digit}
                  </span>
                ))}
              </div>
              <span className="font-mono text-[10px] text-black/50 mt-2">
                (Authentic digital odometer vibe, no analytics cookies)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
