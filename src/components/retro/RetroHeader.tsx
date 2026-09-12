import { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation } from "react-router";

export default function RetroHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const navItems = [
    { label: "01. PROJECTS", to: "projects" },
    { label: "02. LAB", to: "lab" },
    { label: "03. ZINE", to: "zine" },
    { label: "04. ABOUT", to: "about" },
    { label: "05. CONTACT", to: "contact" },
  ];

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-6 pt-3 pb-2 bg-[#f6eedb]/95 backdrop-blur-md border-b-2 border-black">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo sticker */}
        <div className="flex items-center gap-2">
          {isHomePage ? (
            <ScrollLink
              to="hero"
              smooth={true}
              duration={400}
              className="cursor-pointer group flex items-center gap-2 px-3 py-1.5 bg-[#fde047] border-2 border-black shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <span className="font-pixel text-xl sm:text-2xl font-bold tracking-wider">💾 BITTU.DEV</span>
              <span className="hidden sm:inline-block text-[10px] font-mono bg-black text-white px-1.5 py-0.5 rounded-sm font-bold">
                v3.0
              </span>
            </ScrollLink>
          ) : (
            <RouterLink
              to="/"
              className="group flex items-center gap-2 px-3 py-1.5 bg-[#fde047] border-2 border-black shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <span className="font-pixel text-xl sm:text-2xl font-bold tracking-wider">💾 BITTU.DEV</span>
              <span className="hidden sm:inline-block text-[10px] font-mono bg-black text-white px-1.5 py-0.5 rounded-sm font-bold">
                ← HOME
              </span>
            </RouterLink>
          )}

          {/* Status pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#86efac] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs">
            <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse"></span>
            <span>SYSTEMS ONLINE</span>
          </div>
        </div>

        {/* Desktop Nav links */}
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) =>
            isHomePage ? (
              <ScrollLink
                key={item.to}
                to={item.to}
                smooth={true}
                offset={-70}
                duration={400}
                className="cursor-pointer px-3 py-1 bg-[#fffdf9] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs hover:bg-[#fde047] hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                {item.label}
              </ScrollLink>
            ) : (
              <RouterLink
                key={item.to}
                to={`/#${item.to}`}
                className="px-3 py-1 bg-[#fffdf9] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs hover:bg-[#fde047] hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                {item.label}
              </RouterLink>
            )
          )}

          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 bg-[#fb923c] text-black border-2 border-black font-mono text-xs font-bold shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1"
          >
            <span>📡 RSS</span>
          </a>
        </nav>

        {/* Quick action buttons / mobile toggle */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/Bittu5134"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 bg-[#fffdf9] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs hover:bg-[#c4b5fd] hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1"
          >
            <span>GH ↗</span>
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden px-3 py-1.5 bg-[#fde047] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            aria-label="Toggle menu"
          >
            {isOpen ? "[ CLOSE ✕ ]" : "[ MENU ☰ ]"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="lg:hidden mt-3 p-4 bg-[#fffdf9] border-2 border-black shadow-brutal flex flex-col gap-2">
          <div className="font-mono text-xs font-bold text-gray-500 pb-1 border-b border-black">
            NAVIGATION INDEX:
          </div>
          {navItems.map((item) =>
            isHomePage ? (
              <ScrollLink
                key={item.to}
                to={item.to}
                smooth={true}
                offset={-70}
                duration={400}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 bg-[#f6eedb] border-2 border-black font-mono text-sm font-bold shadow-brutal-xs hover:bg-[#fde047] active:translate-x-0.5 active:translate-y-0.5"
              >
                {item.label}
              </ScrollLink>
            ) : (
              <RouterLink
                key={item.to}
                to={`/#${item.to}`}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 bg-[#f6eedb] border-2 border-black font-mono text-sm font-bold shadow-brutal-xs hover:bg-[#fde047] active:translate-x-0.5 active:translate-y-0.5"
              >
                {item.label}
              </RouterLink>
            )
          )}
          <a
            href="/rss.xml"
            className="px-3 py-2 bg-[#fb923c] text-black border-2 border-black font-mono text-sm font-bold shadow-brutal-xs"
          >
            📡 RSS 2.0 FEED
          </a>
        </div>
      )}
    </header>
  );
}
