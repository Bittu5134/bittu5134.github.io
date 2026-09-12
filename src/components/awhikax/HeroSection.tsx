import { Link as ScrollLink } from 'react-scroll'

const TECH_BADGES = [
  { label: 'Go',         dot: '#00ADD8' },
  { label: 'Rust',       dot: '#CE442A' },
  { label: 'TypeScript', dot: '#3178C6' },
  { label: 'C++',        dot: '#00599C' },
]

const TICKER_ITEMS = [
  'ORV-Reader',
  'PeerBasket',
  'NetShip',
  'IITK Resume Engine',
  'InfraPulse',
  'Sharelock',
  'Go',
  'WebRTC',
  'PyTorch',
  'Minecraft Protocol',
  'React',
  'Linux Kernel',
]

// Duplicated for seamless marquee loop
const TICKER_DOUBLED = [...TICKER_ITEMS, ...TICKER_ITEMS]

const MARQUEE_KEYFRAMES = `
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes blink-caret {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
`

export default function HeroSection() {
  return (
    <>
      <style>{MARQUEE_KEYFRAMES}</style>

      <section
        id="overview"
        className="min-h-screen flex items-center justify-center px-4 py-24"
      >
        {/* Glowing outer card */}
        <div
          className="w-full max-w-6xl border border-amber_glow/15 rounded-3xl p-8 md:p-14 shadow-[0_0_80px_-30px_rgba(244,154,96,0.18)] bg-[#0b0e17]/60 backdrop-blur-sm relative overflow-hidden"
          style={{
            backgroundImage: [
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            ].join(', '),
            backgroundSize: '40px 40px',
          }}
        >
          {/* Ambient background blob */}
          <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber_glow/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-argentinian_blue/5 blur-3xl" />

          {/* Main layout: left 40% / right 60% */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-center md:items-start">

            {/* ── Left column: avatar + badges ── */}
            <div className="flex flex-col items-center gap-6 md:w-[38%] shrink-0">
              {/* Avatar with ambient glow */}
              <div className="relative">
                <div className="absolute inset-0 bg-amber_glow/10 blur-3xl rounded-full scale-75 pointer-events-none" />
                <img
                  src="/images/avatar.png"
                  alt="Bittu (Divyanshu Anand)"
                  className="relative w-64 h-64 rounded-2xl object-cover shadow-2xl ring-1 ring-white/10"
                />
              </div>

              {/* Tech pill badges */}
              <div className="flex flex-wrap justify-center gap-2">
                {TECH_BADGES.map(({ label, dot }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 bg-[#080b12] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-cream/60 hover:text-cream/90 hover:border-white/20 transition-colors duration-200"
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: dot }}
                    />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Right column: copy ── */}
            <div className="flex flex-col gap-5 md:w-[62%]">

              {/* Terminal badge */}
              <div className="inline-flex items-center self-start bg-[#080b12] border border-white/10 rounded-lg px-4 py-2 font-mono text-sm text-cream/60">
                <span className="text-amber_glow/70 mr-2 select-none">$</span>
                <span>/say Hey, I&apos;m Bittu</span>
                <span
                  className="ml-1 inline-block w-[2px] h-[1em] bg-cream/60 align-middle"
                  style={{ animation: 'blink-caret 1s step-end infinite' }}
                />
              </div>

              {/* Main heading */}
              <h1 className="text-4xl md:text-6xl font-black text-cream leading-tight tracking-tight">
                Systems &amp;{' '}
                <span className="relative inline-block">
                  Distributed
                  <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-amber_glow/70" />
                </span>{' '}
                Engineer
                <br />
                <span className="text-3xl md:text-5xl text-cream/80">
                  Minecraft Protocol Developer
                </span>
              </h1>

              {/* Description */}
              <p className="text-cream/70 text-base md:text-lg leading-relaxed max-w-lg">
                Building resilient networking daemons, spatial AI pipelines, and
                high-performance Minecraft tools. IIT Kanpur&nbsp;'30, Cybersecurity.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3 mt-1">
                <ScrollLink
                  to="projects"
                  smooth
                  duration={600}
                  offset={-96}
                  className="bg-amber_glow text-[#080b12] font-bold px-6 py-3 rounded-xl hover:bg-amber_glow/90 transition-all cursor-pointer select-none text-sm"
                >
                  Explore Projects ↓
                </ScrollLink>
                <ScrollLink
                  to="contact"
                  smooth
                  duration={600}
                  offset={-96}
                  className="border border-white/20 text-cream px-6 py-3 rounded-xl hover:border-amber_glow/50 hover:text-amber_glow transition-all cursor-pointer select-none text-sm"
                >
                  Contact Me ↗
                </ScrollLink>
              </div>
            </div>
          </div>

          {/* ── Ticker / marquee ── */}
          <div className="mt-10 md:mt-14 -mx-8 md:-mx-14 overflow-hidden border-t border-white/8 pt-4">
            <div
              className="flex whitespace-nowrap"
              style={{ animation: 'marquee 28s linear infinite' }}
            >
              {TICKER_DOUBLED.map((item, i) => (
                <span
                  key={i}
                  className="text-xs font-mono text-cream/40 px-4 border-r border-white/10 shrink-0"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
