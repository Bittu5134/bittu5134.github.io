export default function RetroTicker() {
  const items = [
    "⚡ WELCOME TO BITTU'S CYBER-SHACK",
    "★ IIT KANPUR '30 (CYBERSECURITY)",
    "⛏️ FEATURED ON MINECRAFT LIVE",
    "🛡️ 0% AI SLOP GUARANTEED",
    "☕ BUILT ON RAW BRAIN POWER & CHAI",
    "📡 WEBRTC SIGNALING @ 41ms",
    "👾 VINTAGE WEB ENTHUSIAST",
    "📜 CHECK OUT THE TECH ZINE",
    "⚙️ GO DAEMONS & WIRE PROTOCOLS",
    "🎛️ HIT PLAY ON THE CASSETTE DECK",
  ];

  const doubledItems = [...items, ...items, ...items];

  return (
    <div className="w-full bg-[#fde047] border-y-2 border-black py-2 overflow-hidden select-none font-mono text-xs sm:text-sm font-bold shadow-brutal-sm relative z-20">
      <div className="flex w-max animate-ticker whitespace-nowrap">
        {doubledItems.map((item, index) => (
          <div key={index} className="flex items-center mx-3 sm:mx-6 text-black tracking-wider">
            <span>{item}</span>
            <span className="ml-3 sm:ml-6 text-black/40">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
