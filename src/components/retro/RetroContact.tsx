import { useState } from "react";
import { Mail, Check, Copy, ArrowUpRight, Heart, Rss, Github, Gamepad2, Twitter } from "lucide-react";

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
    <section id="contact" className="py-6 sm:py-8 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-black tracking-tight">
            ~/contact
          </h2>
        </div>

        {/* Contact Window Container */}
        <div className="bg-[#fffdf9] border-[3px] border-black shadow-brutal sm:shadow-brutal-lg overflow-hidden">
          {/* Header Bar */}
          <div className="bg-[#fb923c] px-3 sm:px-4 py-2 border-b-[3px] border-black flex items-center justify-between select-none">
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
              <div className="p-3 sm:p-4 bg-[#fef08a] border-2 border-black shadow-brutal-xs flex flex-wrap items-center justify-between gap-2.5">
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
              <div className="p-3 sm:p-4 bg-[#c4b5fd] border-2 border-black shadow-brutal-xs flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-none bg-black text-[#c4b5fd] flex items-center justify-center border border-black shrink-0">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
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
              <div className="p-4 bg-[#fffdf9] border-2 border-black shadow-brutal-xs">
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
                      <Github className="w-4 h-4 text-black" />
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
                      <Gamepad2 className="w-4 h-4 text-emerald-700" />
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
                      <Twitter className="w-4 h-4 text-sky-600" />
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
                      <Heart className="w-4 h-4 fill-[#f43f5e] text-[#f43f5e]" />
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

