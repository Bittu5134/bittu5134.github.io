import React from "react";

const hobbies = [
  "🟩 Minecraft Technical",
  "🎵 Ambient & Lo-Fi",
  "⚙️ Protocol Hacking",
  "🧠 Systems Engineering",
  "📡 WebRTC & Networking",
  "🔭 Open Source",
];

const links = [
  { label: "IIT Kanpur ↗", href: "https://iitk.ac.in" },
  { label: "Planet Minecraft ↗", href: "https://www.planetminecraft.com/member/bittu5134/" },
  { label: "GitHub ↗", href: "https://github.com/Bittu5134" },
];

const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="py-24 px-6 md:px-10"
    >
      {/* Section Header */}
      <div className="mb-14">
        <p className="text-sm font-mono text-cream/40 tracking-widest mb-3">— about me</p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-cream leading-tight">
          The Person Behind the Terminal
        </h2>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
        {/* Left column — 40% */}
        <div className="w-full md:w-[40%] flex flex-col items-start">
          {/* Avatar with ambient glow */}
          <div className="relative w-fit">
            <div className="absolute -inset-4 bg-[#f49a60]/10 blur-3xl rounded-full" />
            <img
              src="/images/avatar.png"
              alt="Bittu (Divyanshu Anand)"
              className="relative w-56 h-56 md:w-72 md:h-72 rounded-2xl object-cover shadow-2xl"
            />
          </div>

          {/* Status badge */}
          <div className="bg-[#0b0e17] border border-white/10 rounded-full px-3 py-1 text-xs font-mono text-cream/60 flex items-center gap-2 mt-4 w-fit">
            <span className="w-2 h-2 bg-[#A8FF53] rounded-full animate-pulse" />
            Available for collabs
          </div>
        </div>

        {/* Right column — 60% */}
        <div className="w-full md:w-[60%] flex flex-col gap-6">
          {/* Bio */}
          <div className="text-cream/75 text-base leading-relaxed space-y-4">
            <p>
              Student at IIT Kanpur &apos;30, pursuing Cybersecurity &amp; Computing. I spend most
              of my time building resilient systems — low-level Go daemons, distributed WebRTC
              infrastructure, and AI vision pipelines.
            </p>
            <p>
              Outside of engineering, I&apos;m deep in Minecraft technical mechanics — even got
              featured on Minecraft Live. I love reverse-engineering protocols, understanding how
              things work at the wire level, and building tools nobody else wants to build.
            </p>
            <p>
              I listen to a lot of ambient and lo-fi while working. Currently exploring: eBPF hooks,
              spatial AI parsing, and the Minecraft network protocol spec.
            </p>
          </div>

          {/* Hobbies / Interests */}
          <div>
            <h4 className="text-[#f49a60] text-sm font-mono tracking-wider mb-4">
              // interests &amp; hobbies
            </h4>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby) => (
                <span
                  key={hobby}
                  className="bg-[#080b12] border border-white/10 text-cream/60 text-xs font-mono px-3 py-1.5 rounded-full"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>

          {/* Link buttons */}
          <div className="flex flex-wrap gap-5">
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono text-cream/50 hover:text-[#f49a60] transition-colors underline underline-offset-4"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
