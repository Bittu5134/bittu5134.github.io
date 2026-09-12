import React from "react";

const navLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Services", href: "#services" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Bittu5134" },
  { label: "Discord", href: "/discord" },
  { label: "X", href: "https://x.com/bittu5134" },
];

const Footer: React.FC = () => {
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="border-t border-white/10 py-12 px-6 md:px-10">
      {/* Smooth scroll nav links */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {navLinks.map(({ label, href }, idx) => (
          <React.Fragment key={label}>
            <a
              href={href}
              onClick={(e) => handleSmoothScroll(e, href)}
              className="text-xs font-mono text-cream/20 hover:text-cream/40 transition-colors"
            >
              {label}
            </a>
            {idx < navLinks.length - 1 && (
              <span className="text-cream/10 text-xs font-mono select-none">·</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Social links */}
      <div className="flex justify-center gap-6 mb-6">
        {socialLinks.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-xs font-mono text-cream/30 hover:text-cream/60 transition-colors"
          >
            {label}
          </a>
        ))}
      </div>

      {/* Copyright */}
      <p className="text-center text-xs font-mono text-cream/30">
        &copy; 2026 Divyanshu Anand (Bittu5134) &middot; Made with React + Tailwind &middot;{" "}
        <a
          href="/rss.xml"
          className="hover:text-cream/50 transition-colors underline underline-offset-2"
        >
          RSS ↗
        </a>
      </p>
    </footer>
  );
};

export default Footer;
