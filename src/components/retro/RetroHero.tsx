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
    <section id="hero" className="pt-4 sm:pt-8 pb-4 px-3 sm:px-6">
      {/* Retro Window Container */}
      <div className="max-w-5xl mx-auto bg-[#fffdf9] border-[3px] border-black shadow-brutal sm:shadow-brutal-lg rounded-none overflow-hidden relative">
        {/* Retro Window Titlebar */}
        <div className="bg-[#fb923c] px-3 sm:px-4 py-2 border-b-[3px] border-black flex items-center justify-between gap-2 select-none">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#f87171] border-2 border-black shrink-0"></span>
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#fde047] border-2 border-black shrink-0"></span>
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#86efac] border-2 border-black shrink-0"></span>
            <span className="font-mono text-xs sm:text-sm font-bold text-black ml-1 sm:ml-2 tracking-wide truncate">
              💾 bittu@iitk: ~
            </span>
          </div>
          <span className="font-mono text-xs font-bold text-black tracking-wider shrink-0">
            KANPUR, INDIA
          </span>
        </div>

        {/* Hero Content Body */}
        <div className="p-4 sm:p-10 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Column: Avatar Polaroid & Badges (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            {/* Polaroid Container */}
            <div className="relative bg-[#fffdf9] p-3 sm:p-4 pb-6 sm:pb-8 border-[3px] border-black shadow-brutal rotate-[-1deg] sm:rotate-[-2deg] hover:rotate-0 transition-transform duration-300 w-full max-w-[240px] sm:max-w-[280px]">
              {/* Washi Tape Effect at top */}
              <div className="absolute -top-3 sm:-top-3.5 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-5 sm:h-6 bg-[#fde047]/90 border border-black shadow-sm rotate-[2deg] sm:rotate-[3deg] z-10 flex items-center justify-center">
                <span className="font-pixel text-xs text-black uppercase font-bold tracking-widest">
                  ★ IT'S ME ★
                </span>
              </div>

              {/* Avatar Image */}
              <div className="border-2 border-black overflow-hidden bg-[#12151e]">
                <img
                  src="/images/avatar.png"
                  alt="Bittu, pixel art Minecraft-style avatar"
                  className="w-full h-48 sm:h-56 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="mt-2.5 sm:mt-3 text-center">
                <p className="font-pixel text-xl sm:text-2xl text-black font-bold">BITTU (HE/HIM)</p>
                <p className="font-mono text-xs text-gray-700 uppercase font-bold mt-0.5">
                  Systems Hacker &amp; Modder
                </p>
              </div>
            </div>

            {/* Sticker Badges beneath Polaroid */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4 sm:mt-6 justify-center max-w-xs">
              <span className="px-2.5 py-1 bg-[#86efac] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs rotate-[1deg]">
                ⛏️ MINECRAFT LIVE
              </span>
              <span className="px-2.5 py-1 bg-[#c4b5fd] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs rotate-[-1deg]">
                🛡️ IIT KANPUR '30
              </span>
              <span className="px-2.5 py-1 bg-[#38bdf8] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs rotate-[2deg]">
                ⚙️ GO &amp; RUST
              </span>
            </div>
          </div>

          {/* Right Column: Bio & CTA (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-black mb-3 sm:mb-4">
              HEY, I'M{" "}
              <span className="bg-[#fde047] px-2 py-0.5 border-2 border-black shadow-brutal-xs inline-block">
                BITTU.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="font-mono text-sm sm:text-base md:text-lg text-black font-semibold leading-relaxed mb-4 sm:mb-6">
              Low-level systems builder, WebRTC tinkerer, and Minecraft protocol reverse engineer.
              I write fast daemons in <span className="bg-[#38bdf8]/30 px-1 border-b-2 border-black font-bold">Go</span>,
              dissect network packets, and build high-throughput tools for the web.
            </p>

            {/* Sticky Note */}
            <div className="p-3.5 sm:p-4 bg-[#fef08a] border-2 border-black shadow-brutal-xs mb-6 sm:mb-8 rotate-0 sm:rotate-[-0.5deg]">
              <p className="font-mono text-xs sm:text-sm text-black leading-relaxed">
                Currently studying Cybersecurity at <strong>IIT Kanpur</strong>, serving 10.5M+ requests on <strong>ORV-Reader</strong>, and maintaining WebRTC peer-to-peer mesh tools.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
              <ScrollLink
                to="projects"
                href="#projects"
                smooth={true}
                offset={-30}
                duration={400}
                className="cursor-pointer px-4 sm:px-5 py-2.5 sm:py-3 bg-[#f59e0b] text-black font-mono font-bold text-xs sm:text-sm border-[3px] border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 sm:gap-2"
              >
                <span>PROJECTS</span>
                <span>↓</span>
              </ScrollLink>

              <ScrollLink
                to="blog"
                href="#blog"
                smooth={true}
                offset={-30}
                duration={400}
                className="cursor-pointer px-4 sm:px-5 py-2.5 sm:py-3 bg-[#86efac] text-black font-mono font-bold text-xs sm:text-sm border-[3px] border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 sm:gap-2"
              >
                <span>BLOG</span>
                <span>→</span>
              </ScrollLink>

              <button
                onClick={copyDiscord}
                aria-label="Copy Discord handle bittu5134"
                className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#fffdf9] text-black font-mono font-bold text-xs sm:text-sm border-[3px] border-black shadow-brutal hover:bg-[#c4b5fd] hover:shadow-brutal-lg hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer"
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
