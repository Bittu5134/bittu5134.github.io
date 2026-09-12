import { useState } from "react";
import { Link as ScrollLink } from "react-scroll";

export default function RetroHero() {
  const [copied, setCopied] = useState(false);

  const copyDiscord = () => {
    navigator.clipboard.writeText("bittu5134");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="hero" className="pt-8 pb-12 px-4 sm:px-6">
      {/* Retro OS Window Container */}
      <div className="max-w-5xl mx-auto bg-[#fffdf9] border-[3px] border-black shadow-brutal-lg rounded-none overflow-hidden relative">
        {/* Retro Window Titlebar */}
        <div className="bg-[#fb923c] px-4 py-2.5 border-b-[3px] border-black flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-[#f87171] border-2 border-black rounded-none shadow-[1px_1px_0px_#000]"></span>
            <span className="w-3.5 h-3.5 bg-[#fde047] border-2 border-black rounded-none shadow-[1px_1px_0px_#000]"></span>
            <span className="w-3.5 h-3.5 bg-[#86efac] border-2 border-black rounded-none shadow-[1px_1px_0px_#000]"></span>
            <span className="font-mono text-xs sm:text-sm font-bold text-black ml-2 tracking-wide">
              ~/home/bittu/welcome.sh [ACTIVE_SESSION]
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs font-bold bg-black text-[#fde047] px-2 py-0.5">
            <span>BASED_AT: IIT_KANPUR</span>
          </div>
        </div>

        {/* Hero Content Body */}
        <div className="p-6 sm:p-10 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Avatar Polaroid & Silly Badges (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            {/* Polaroid Container */}
            <div className="relative bg-[#fffdf9] p-4 pb-8 border-[3px] border-black shadow-brutal rotate-[-2deg] hover:rotate-0 transition-transform duration-300 w-full max-w-[280px]">
              {/* Washi Tape Effect at top */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#fde047]/90 border border-black shadow-sm rotate-[3deg] z-10 flex items-center justify-center">
                <span className="font-pixel text-xs text-black uppercase font-bold tracking-widest">
                  ★ IT'S ME ★
                </span>
              </div>

              {/* Avatar Image */}
              <div className="border-2 border-black overflow-hidden bg-[#12151e]">
                <img
                  src="/images/avatar.png"
                  alt="Bittu avatar"
                  className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="mt-3 text-center">
                <p className="font-pixel text-2xl text-black font-bold">BITTU (HE/HIM)</p>
                <p className="font-mono text-[11px] text-gray-600 uppercase font-bold">
                  Systems Hacker & Modder
                </p>
              </div>
            </div>

            {/* Sticker Badges beneath Polaroid */}
            <div className="flex flex-wrap gap-2 mt-6 justify-center max-w-xs">
              <span className="px-2.5 py-1 bg-[#86efac] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs rotate-[1deg]">
                ⛏️ MINECRAFT LIVE
              </span>
              <span className="px-2.5 py-1 bg-[#c4b5fd] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs rotate-[-1deg]">
                🛡️ IITK CYBERSEC '30
              </span>
              <span className="px-2.5 py-1 bg-[#38bdf8] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs rotate-[2deg]">
                ⚙️ GO & RUST
              </span>
            </div>
          </div>

          {/* Right Column: Punchy Bio & CTA (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Terminal prefix badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f6eedb] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs w-fit mb-4">
              <span className="text-[#f59e0b]">$</span>
              <span>whoami --verbose</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] text-black mb-4">
              HEY, I'M{" "}
              <span className="bg-[#fde047] px-2 py-0.5 border-2 border-black shadow-brutal-xs inline-block">
                BITTU!
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="font-mono text-base sm:text-lg text-black font-semibold leading-relaxed mb-6">
              Low-level systems builder, WebRTC tinkerer, and Minecraft protocol reverse engineer.
              I write fast daemons in <span className="bg-[#38bdf8]/30 px-1 border-b-2 border-black font-bold">Go</span>,
              dissect network packets, and build high-throughput tools for the web.
            </p>

            {/* Tactile Sticky Note box */}
            <div className="p-4 bg-[#fef08a] border-2 border-black shadow-brutal-xs mb-8 rotate-[-0.5deg]">
              <div className="flex items-start gap-2 font-mono text-xs sm:text-sm text-black">
                <span className="text-lg">📌</span>
                <div>
                  <strong className="block font-bold">CURRENT RIG / ACTIVITY:</strong>
                  Pursuing Cybersecurity at IIT Kanpur, serving 10.5M+ requests on ORV-Reader, and maintaining P2P mesh tools.
                </div>
              </div>
            </div>

            {/* Chunky Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <ScrollLink
                to="projects"
                smooth={true}
                offset={-70}
                duration={400}
                className="cursor-pointer px-5 py-3 bg-[#f59e0b] text-black font-mono font-bold text-sm border-[3px] border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
              >
                <span>🚀 VIEW INVENTIONS</span>
                <span>↓</span>
              </ScrollLink>

              <ScrollLink
                to="zine"
                smooth={true}
                offset={-70}
                duration={400}
                className="cursor-pointer px-5 py-3 bg-[#86efac] text-black font-mono font-bold text-sm border-[3px] border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
              >
                <span>📖 READ TECH ZINE</span>
                <span>→</span>
              </ScrollLink>

              <button
                onClick={copyDiscord}
                className="px-4 py-3 bg-[#fffdf9] text-black font-mono font-bold text-sm border-[3px] border-black shadow-brutal hover:bg-[#c4b5fd] hover:shadow-brutal-lg hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
              >
                <span>👾 {copied ? "TAG COPIED! ✓" : "DISCORD: bittu5134"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
