import { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import {
  Terminal,
  Pickaxe,
  Shield,
  Cpu,
  ArrowDown,
  ArrowRight,
  Check,
  DiscordIcon,
} from "../icons";

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
            <Terminal className="w-3.5 h-3.5 text-black shrink-0 ml-1" />
            <span className="font-mono text-xs sm:text-sm font-bold text-black tracking-wide truncate">
              bittu@iitk: ~
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
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-5 sm:h-6 bg-[#fde047]/90 border border-black/40 rotate-1 shadow-xs z-10 select-none"></div>

              {/* Avatar Photo Frame */}
              <div className="relative aspect-square border-2 border-black overflow-hidden bg-[#e2e8f0] mb-3 sm:mb-4">
                <img
                  src="https://github.com/Bittu5134.png"
                  alt="Bittu Avatar"
                  className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black text-[#86efac] font-mono text-xs font-bold border border-black shadow-brutal-xs">
                  ★ IT'S ME ★
                </div>
              </div>

              {/* Polaroid Caption */}
              <div className="text-center font-mono font-bold text-xs sm:text-sm text-black">
                Bittu // @Bittu5134
              </div>
            </div>

            {/* Interest Badges under photo */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-4 max-w-[300px]">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#86efac] border-2 border-black font-mono text-xs font-bold text-black shadow-brutal-xs">
                <Terminal className="w-3.5 h-3.5 text-black" />
                <span>SYSTEMS</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fde047] border-2 border-black font-mono text-xs font-bold text-black shadow-brutal-xs">
                <Pickaxe className="w-3.5 h-3.5 text-black" />
                <span>MINECRAFT</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#c4b5fd] border-2 border-black font-mono text-xs font-bold text-black shadow-brutal-xs">
                <Cpu className="w-3.5 h-3.5 text-black" />
                <span>AI & LLMS</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fca5a5] border-2 border-black font-mono text-xs font-bold text-black shadow-brutal-xs">
                <Shield className="w-3.5 h-3.5 text-black" />
                <span>SECURITY</span>
              </span>
            </div>
          </div>

          {/* Right Column: Bio & Core Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-6 text-left">
            {/* Status Line */}
            <div className="inline-flex items-center gap-2 self-start px-2.5 sm:px-3 py-1 bg-[#fffdf9] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-black"></span>
              <span className="text-black">STUDENT @ IIT KANPUR // B.TECH '27</span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tight leading-[1.08] mb-3">
                Building distributed systems & reverse-engineering wire protocols.
              </h1>
              <p className="font-mono text-xs sm:text-base text-black/85 leading-relaxed">
                Undergraduate at <span className="font-bold underline decoration-2 decoration-[#fb923c]">IIT Kanpur</span>.
                Obsessed with low-level networking, high-throughput Go daemons, spatial data geometry, and packet protocol engineering.
              </p>
            </div>

            {/* Highlighted Project Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
              <div className="p-2.5 sm:p-3 bg-[#f6eedb] border-2 border-black shadow-brutal-xs">
                <div className="font-pixel text-xl sm:text-2xl font-bold text-black">100K+</div>
                <div className="font-mono text-xs font-bold text-black/70 uppercase">COMMUNITY REACH</div>
              </div>
              <div className="p-2.5 sm:p-3 bg-[#f6eedb] border-2 border-black shadow-brutal-xs">
                <div className="font-pixel text-xl sm:text-2xl font-bold text-black">TOP 0.1%</div>
                <div className="font-mono text-xs font-bold text-black/70 uppercase">JEE ADVANCED</div>
              </div>
              <div className="p-2.5 sm:p-3 bg-[#f6eedb] border-2 border-black shadow-brutal-xs col-span-2 sm:col-span-1">
                <div className="font-pixel text-xl sm:text-2xl font-bold text-black">IITK '27</div>
                <div className="font-mono text-xs font-bold text-black/70 uppercase">KANPUR CAMPUS</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
              <ScrollLink
                to="projects"
                href="#projects"
                smooth={true}
                offset={-70}
                duration={500}
                className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#fde047] text-black font-mono font-bold text-xs sm:text-sm border-[3px] border-black shadow-brutal hover:bg-[#fb923c] hover:shadow-brutal-lg hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>EXPLORE WORK</span>
                <ArrowDown className="w-4 h-4" />
              </ScrollLink>

              <ScrollLink
                to="about"
                href="#about"
                smooth={true}
                offset={-70}
                duration={500}
                className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#fffdf9] text-black font-mono font-bold text-xs sm:text-sm border-[3px] border-black shadow-brutal hover:bg-[#86efac] hover:shadow-brutal-lg hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>READ ABOUT ME</span>
                <ArrowRight className="w-4 h-4" />
              </ScrollLink>

              <button
                onClick={copyDiscord}
                aria-label="Copy Discord handle bittu5134"
                className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#fffdf9] text-black font-mono font-bold text-xs sm:text-sm border-[3px] border-black shadow-brutal hover:bg-[#c4b5fd] hover:shadow-brutal-lg hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-700 shrink-0" />
                    <span>TAG COPIED!</span>
                  </>
                ) : (
                  <>
                    <DiscordIcon className="w-4 h-4 text-black shrink-0" />
                    <span>DISCORD: bittu5134</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
