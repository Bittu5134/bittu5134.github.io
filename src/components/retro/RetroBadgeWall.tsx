export default function RetroBadgeWall() {
  const badges = [
    { text: "MADE WITH VIM", bg: "#86efac", icon: "⌨️" },
    { text: "100% NO COOKIES", bg: "#fde047", icon: "🍪" },
    { text: "MINECRAFT LIVE", bg: "#fb923c", icon: "⛏️" },
    { text: "RSS 2.0 VALID", bg: "#38bdf8", icon: "📡" },
    { text: "CYBERSEC @ IITK", bg: "#c4b5fd", icon: "🛡️" },
    { text: "LINUX POWERED", bg: "#f472b6", icon: "🐧" },
    { text: "ANY BROWSER OK", bg: "#fdba74", icon: "🌐" },
    { text: "WEBRTC READY", bg: "#a7f3d0", icon: "⚡" },
  ];

  const stats = [
    { number: "10.5M+", label: "MONTHLY REQUESTS SERVED", bg: "#fde047" },
    { number: "41ms", label: "WEBRTC SIGNALING LATENCY", bg: "#86efac" },
    { number: "0.0%", label: "PACKET LOSS @ 500 PEERS", bg: "#38bdf8" },
    { number: "IITK '30", label: "CYBERSECURITY & SYSTEMS", bg: "#c4b5fd" },
  ];

  return (
    <section className="py-6 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* 4 Stat Boxes in Neo-Brutalist Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-4 border-[3px] border-black shadow-brutal flex flex-col justify-between"
              style={{ backgroundColor: stat.bg }}
            >
              <span className="font-pixel text-4xl sm:text-5xl font-black text-black tracking-tight">
                {stat.number}
              </span>
              <span className="font-mono text-[11px] sm:text-xs font-bold text-black/80 mt-1 uppercase leading-tight">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* 88x31 Style Nostalgic Web Buttons Strip */}
        <div className="p-4 bg-[#fffdf9] border-2 border-black shadow-brutal-xs flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span className="font-mono text-xs font-bold text-black/60 mr-2 uppercase">
            [ WEB_BUTTONS.TXT ] →
          </span>
          {badges.map((b, i) => (
            <div
              key={i}
              className="px-2.5 py-1 border-2 border-black font-mono text-[11px] font-bold shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-default flex items-center gap-1 select-none"
              style={{ backgroundColor: b.bg }}
            >
              <span>{b.icon}</span>
              <span>{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
