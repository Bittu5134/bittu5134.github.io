import React, { useState } from "react";

const quickLinks = [
  { label: "Planet Minecraft", href: "https://www.planetminecraft.com/member/bittu5134/" },
  { label: "IIT Kanpur", href: "https://iitk.ac.in" },
  { label: "X / Twitter", href: "https://x.com/bittu5134" },
  { label: "RSS Feed", href: "/rss.xml" },
];

const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyDiscord = async () => {
    try {
      await navigator.clipboard.writeText("bittu5134");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for unsupported environments
    }
  };

  return (
    <section
      id="contact"
      className="py-24 px-6 md:px-10"
    >
      {/* Section Header */}
      <div className="mb-14">
        <p className="text-sm font-mono text-cream/40 tracking-widest mb-3">— reach out</p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-cream leading-tight">
          Let&apos;s Build Something
        </h2>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left column — main contact card */}
        <div className="w-full md:flex-1 bg-[#0b0e17] border border-white/10 rounded-3xl p-8 md:p-10">
          {/* Header row: avatar + status + text */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative shrink-0">
              <img
                src="/images/avatar.png"
                alt="Bittu"
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#A8FF53] rounded-full border-2 border-[#0b0e17] animate-pulse" />
            </div>
            <p className="text-cream/70 text-sm leading-snug">
              Available for freelance, research &amp; open-source collabs
            </p>
          </div>

          <div className="border-t border-white/10 my-6" />

          {/* Big action buttons */}
          <div className="flex flex-col gap-5">
            <a
              href="mailto:hello@bittu.dev"
              className="flex items-center gap-3 text-2xl font-bold text-cream hover:text-[#f49a60] transition-colors"
            >
              <span>✉</span>
              <span>Send an Email ↗</span>
            </a>
            <a
              href="https://github.com/Bittu5134"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-2xl font-bold text-cream hover:text-[#35a7ff] transition-colors"
            >
              <span>⌥</span>
              <span>GitHub Profile ↗</span>
            </a>
            <a
              href="/discord"
              className="flex items-center gap-3 text-2xl font-bold text-cream hover:text-[#5865F2] transition-colors"
            >
              <span>#</span>
              <span>Discord ↗</span>
            </a>
          </div>

          <div className="border-t border-white/10 my-6" />

          {/* Copy Discord username */}
          <div className="flex items-center gap-3 flex-wrap">
            <code className="font-mono text-sm bg-[#080b12] border border-white/10 rounded-lg px-4 py-2 text-cream/70">
              bittu5134
            </code>
            <button
              onClick={handleCopyDiscord}
              className="flex items-center gap-2 text-xs font-mono text-cream/50 hover:text-cream/80 bg-[#080b12] border border-white/10 rounded-lg px-3 py-2 transition-colors"
              aria-label="Copy Discord username"
            >
              {copied ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-[#A8FF53]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-[#A8FF53]">Copied!</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  <span>Copy Discord</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right column — quick links + status */}
        <div className="w-full md:w-72 bg-[#0b0e17] border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <h4 className="text-[#f49a60] text-sm font-mono tracking-wider mb-4">
              // quick links
            </h4>
            <ul className="divide-y divide-white/5">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center justify-between text-cream/60 text-sm hover:text-cream transition-colors py-2"
                  >
                    <span>{label}</span>
                    <span className="text-cream/30">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Closing note */}
          <p className="text-cream/30 text-xs italic mt-8">
            &ldquo;or send a carrier pigeon, idk&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
