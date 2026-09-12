import { useState } from "react";

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
    <section id="contact" className="py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <div className="inline-block px-3 py-1 bg-[#86efac] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs mb-2">
            SECTION_05 // TRANSMIT PING
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black">
            LET'S TALK SYSTEMS & CODE.
          </h2>
        </div>

        {/* Contact Window Container */}
        <div className="bg-[#fffdf9] border-[3px] border-black shadow-brutal-lg overflow-hidden">
          {/* Header Bar */}
          <div className="bg-[#fb923c] px-4 py-2.5 border-b-[3px] border-black flex items-center justify-between select-none">
            <span className="font-mono text-xs sm:text-sm font-bold text-black tracking-wide">
              ~/home/bittu/contact_terminal.sh [OPEN_FOR_COLLABS]
            </span>
            <span className="hidden sm:inline-block font-mono text-xs font-bold bg-[#86efac] text-black px-2 py-0.5 border border-black">
              ● READY FOR PACKETS
            </span>
          </div>

          <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Direct channels */}
            <div className="space-y-4">
              <p className="font-mono text-xs sm:text-sm text-black/85 leading-relaxed mb-6">
                Have a project idea, high-throughput systems problem, research opportunity, or just want to chat about low-level networking and Minecraft? Ping me!
              </p>

              {/* Email Button Box */}
              <div className="p-4 bg-[#fef08a] border-2 border-black shadow-brutal-xs flex items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-[10px] uppercase font-bold text-black/60">
                    DIRECT ELECTRONIC MAIL:
                  </div>
                  <div className="font-mono text-sm sm:text-base font-bold text-black">
                    hello@bittu.dev
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="mailto:hello@bittu.dev"
                    className="px-3 py-1.5 bg-[#fffdf9] text-black font-mono text-xs font-bold border-2 border-black hover:bg-[#86efac] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    MAIL ↗
                  </a>
                  <button
                    onClick={copyEmail}
                    className="px-3 py-1.5 bg-[#fde047] text-black font-mono text-xs font-bold border-2 border-black hover:bg-[#fb923c] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    {copiedEmail ? "COPIED! ✓" : "COPY"}
                  </button>
                </div>
              </div>

              {/* Discord Button Box */}
              <div className="p-4 bg-[#c4b5fd] border-2 border-black shadow-brutal-xs flex items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-[10px] uppercase font-bold text-black/60">
                    DISCORD HANDLE:
                  </div>
                  <div className="font-mono text-sm sm:text-base font-bold text-black">
                    bittu5134
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="/discord"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#fffdf9] text-black font-mono text-xs font-bold border-2 border-black hover:bg-[#86efac] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    JOIN ↗
                  </a>
                  <button
                    onClick={copyDiscord}
                    className="px-3 py-1.5 bg-[#fde047] text-black font-mono text-xs font-bold border-2 border-black hover:bg-[#fb923c] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    {copiedDiscord ? "COPIED! ✓" : "COPY"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Other Transmitters */}
            <div className="space-y-4">
              <div className="p-4 bg-[#fffdf9] border-2 border-black shadow-brutal-xs">
                <div className="font-mono text-xs font-bold text-black uppercase mb-3 pb-1 border-b border-black">
                  ★ OTHER NETWORK NODES:
                </div>

                <div className="space-y-2">
                  <a
                    href="https://github.com/Bittu5134"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 bg-[#f6eedb] border border-black font-mono text-xs font-bold text-black hover:bg-[#fde047] transition-colors"
                  >
                    <span>GITHUB: @Bittu5134</span>
                    <span>↗</span>
                  </a>

                  <a
                    href="https://www.planetminecraft.com/member/bittu5134/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 bg-[#f6eedb] border border-black font-mono text-xs font-bold text-black hover:bg-[#86efac] transition-colors"
                  >
                    <span>PLANET MINECRAFT: @bittu5134</span>
                    <span>↗</span>
                  </a>

                  <a
                    href="https://x.com/bittu5134"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 bg-[#f6eedb] border border-black font-mono text-xs font-bold text-black hover:bg-[#38bdf8] transition-colors"
                  >
                    <span>X / TWITTER: @bittu5134</span>
                    <span>↗</span>
                  </a>

                  <a
                    href="/rss.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 bg-[#f6eedb] border border-black font-mono text-xs font-bold text-black hover:bg-[#fb923c] transition-colors"
                  >
                    <span>RSS 2.0 FEED DISPATCH</span>
                    <span>📡</span>
                  </a>
                </div>
              </div>

              {/* Silly Old Internet Disclaimer */}
              <div className="p-3 bg-[#f6eedb] border border-black font-mono text-[11px] text-black/70 italic text-center">
                "No tracking scripts, no spam telemetry, just direct human communication."
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
