import { useState } from "react";
import {
  Mail,
  Check,
  Copy,
  ArrowUpRight,
  Rss,
  GithubIcon,
  PlanetMinecraftIcon,
  TwitterIcon,
  PatreonIcon,
  DiscordIcon,
} from "../icons";

export default function RetroContact() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("hello@bittu.dev");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const copyDiscord = () => {
    navigator.clipboard.writeText("bittu5134");
    setCopiedDiscord(true);
    setTimeout(() => setCopiedDiscord(false), 2000);
  };

  return (
    <section id="contact" className="py-6 sm:py-8 px-3 sm:px-6 scroll-mt-16 sm:scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-black tracking-tight">
            ~/contact
          </h2>
        </div>

        {/* Contact Window Container */}
        <div className="bg-[#fffdf9] border-[3px] border-black shadow-brutal sm:shadow-brutal-lg overflow-hidden grain">
          {/* Header Bar */}
          <div className="bg-[#fb923c] px-3 sm:px-4 py-2 border-b-[3px] border-black flex items-center justify-between select-none grain-warm">
            <span className="font-mono text-xs sm:text-sm font-bold text-black tracking-wide flex items-center gap-2">
              <Mail className="w-4 h-4 text-black stroke-[2.5]" />
              bittu@iitk: ~/contact
            </span>
          </div>

          <div className="p-4 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Left Column: Direct channels */}
            <div className="space-y-4">
              <p className="font-mono text-xs sm:text-sm text-black/85 leading-relaxed mb-4 sm:mb-6">
                Have a project, distributed systems problem, research idea, or just want to chat about low-level networking and Minecraft? Feel free to reach out.
              </p>

              {/* Email Button Box */}
              <div className="p-3 sm:p-4 bg-[#fef08a] border-2 border-black shadow-brutal-xs flex flex-wrap items-center justify-between gap-2.5 grain-warm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-none bg-black text-[#fef08a] flex items-center justify-center border border-black shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-mono text-xs uppercase font-bold text-black/60">
                      EMAIL:
                    </div>
                    <div className="font-mono text-sm sm:text-base font-bold text-black break-all">
                      hello@bittu.dev
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <a
                    href="mailto:hello@bittu.dev"
                    className="px-2.5 sm:px-3 py-1.5 bg-[#fffdf9] text-black font-mono text-xs sm:text-sm font-bold border-2 border-black hover:bg-[#86efac] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1"
                  >
                    <span>MAIL</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={copyEmail}
                    aria-label="Copy email address hello@bittu.dev"
                    className="px-2.5 sm:px-3 py-1.5 bg-[#fde047] text-black font-mono text-xs sm:text-sm font-bold border-2 border-black hover:bg-[#fb923c] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-800 stroke-[3]" />
                        <span>COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Discord Button Box */}
              <div className="p-3 sm:p-4 bg-[#c4b5fd] border-2 border-black shadow-brutal-xs flex flex-wrap items-center justify-between gap-2.5 grain-warm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-none bg-black text-[#c4b5fd] flex items-center justify-center border border-black shrink-0">
                    <DiscordIcon className="w-4 h-4 text-[#c4b5fd]" />
                  </div>
                  <div>
                    <div className="font-mono text-xs uppercase font-bold text-black/60">
                      DISCORD:
                    </div>
                    <div className="font-mono text-sm sm:text-base font-bold text-black">
                      bittu5134
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <a
                    href="/discord"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 sm:px-3 py-1.5 bg-[#fffdf9] text-black font-mono text-xs sm:text-sm font-bold border-2 border-black hover:bg-[#86efac] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1"
                  >
                    <span>JOIN</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={copyDiscord}
                    aria-label="Copy Discord handle bittu5134"
                    className="px-2.5 sm:px-3 py-1.5 bg-[#fde047] text-black font-mono text-xs sm:text-sm font-bold border-2 border-black hover:bg-[#fb923c] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1"
                  >
                    {copiedDiscord ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-800 stroke-[3]" />
                        <span>COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Other Platforms */}
            <div className="space-y-4">
              <div className="p-4 bg-[#fffdf9] border-2 border-black shadow-brutal-xs grain">
                <div className="font-mono text-xs sm:text-sm font-bold text-black uppercase mb-3 pb-1 border-b border-black">
                  PROFILES:
                </div>

                <div className="space-y-2">
                  <a
                    href="https://github.com/Bittu5134"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 bg-[#f6eedb] border border-black font-mono text-xs sm:text-sm font-bold text-black hover:bg-[#fde047] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <GithubIcon className="w-4 h-4 text-black" />
                      GITHUB: @Bittu5134
                    </span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>

                  <a
                    href="https://www.planetminecraft.com/member/bittu5134/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 bg-[#f6eedb] border border-black font-mono text-xs sm:text-sm font-bold text-black hover:bg-[#86efac] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <PlanetMinecraftIcon className="w-4 h-4 text-emerald-700" />
                      PLANET MINECRAFT: @bittu5134
                    </span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>

                  <a
                    href="https://x.com/bittu5134"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 bg-[#f6eedb] border border-black font-mono text-xs sm:text-sm font-bold text-black hover:bg-[#38bdf8] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <TwitterIcon className="w-4 h-4 text-sky-600" />
                      X / TWITTER: @bittu5134
                    </span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>

                  <a
                    href="https://www.patreon.com/lazybittu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 bg-[#f6eedb] border border-black font-mono text-xs sm:text-sm font-bold text-black hover:bg-[#f472b6] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <PatreonIcon className="w-4 h-4 text-[#f43f5e]" />
                      PATREON: @lazybittu
                    </span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>

                  <a
                    href="/rss.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 bg-[#f6eedb] border border-black font-mono text-xs sm:text-sm font-bold text-black hover:bg-[#fb923c] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Rss className="w-4 h-4 text-amber-700" />
                      RSS 2.0 FEED
                    </span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}