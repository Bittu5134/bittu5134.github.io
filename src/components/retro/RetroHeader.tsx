import { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation } from "react-router";
import { Rss } from "lucide-react";

export default function RetroHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const navItems = [
    { label: "~/projects", icon: "📂", to: "projects" },
    { label: "~/lab", icon: "🧪", to: "lab" },
    { label: "~/zine", icon: "📰", to: "zine" },
    { label: "~/about", icon: "👤", to: "about" },
    { label: "~/contact", icon: "✉️", to: "contact" },
  ];

  // Prevent background scroll when mobile drawer is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close mobile menu if resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 px-3 sm:px-6 pt-2.5 pb-2 bg-[#f6eedb]/95 backdrop-blur-md border-b-[3px] border-black">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            {isHomePage ? (
              <ScrollLink
                to="hero"
                href="#hero"
                smooth={true}
                offset={-70}
                duration={400}
                className="cursor-pointer group flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-[#fde047] border-2 border-black shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                <span className="font-pixel text-lg sm:text-2xl font-bold tracking-wider">💾 BITTU.DEV</span>
              </ScrollLink>
            ) : (
              <RouterLink
                to="/"
                className="group flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-[#fde047] border-2 border-black shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                <span className="font-pixel text-lg sm:text-2xl font-bold tracking-wider">💾 BITTU.DEV</span>
                <span className="hidden sm:inline-block text-[10px] font-mono bg-black text-white px-1.5 py-0.5 rounded-sm font-bold">
                  ← HOME
                </span>
              </RouterLink>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 font-mono">
            {navItems.map((item) =>
              isHomePage ? (
                <ScrollLink
                  key={item.to}
                  to={item.to}
                  href={`#${item.to}`}
                  smooth={true}
                  offset={-70}
                  duration={400}
                  className="cursor-pointer px-3 py-1 bg-[#fffdf9] border-2 border-black text-xs font-black shadow-brutal-xs hover:bg-[#fde047] hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all tracking-tight"
                >
                  {item.label}
                </ScrollLink>
              ) : (
                <RouterLink
                  key={item.to}
                  to={`/#${item.to}`}
                  className="px-3 py-1 bg-[#fffdf9] border-2 border-black text-xs font-black shadow-brutal-xs hover:bg-[#fde047] hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all tracking-tight"
                >
                  {item.label}
                </RouterLink>
              )
            )}

            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="RSS Feed"
              className="px-2.5 py-1 bg-[#fb923c] text-black border-2 border-black text-xs font-bold shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5"
            >
              <Rss className="w-3.5 h-3.5 text-black" />
              <span>RSS</span>
            </a>
          </nav>

          {/* Actions & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/Bittu5134"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile (@Bittu5134)"
              className="px-2.5 py-1 sm:py-1.5 bg-[#fffdf9] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs hover:bg-[#c4b5fd] hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5 text-black shrink-0"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span className="hidden sm:inline-block font-mono text-xs font-bold">GITHUB</span>
            </a>

            {/* Android / Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden px-3 py-1 sm:py-1.5 bg-[#fde047] border-2 border-black font-mono text-xs font-black shadow-brutal-xs hover:bg-[#fb923c] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 select-none cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              <span className="text-sm leading-none">{isOpen ? "✕" : "☰"}</span>
              <span>{isOpen ? "CLOSE" : "MENU"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Android & Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 top-[54px] sm:top-[58px] bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Android / Mobile Slide-down Neo-Brutalist Drawer */}
      {isOpen && (
        <div className="fixed top-[54px] sm:top-[58px] left-0 right-0 z-50 lg:hidden bg-[#fffdf9] border-b-[4px] border-black shadow-brutal-lg max-h-[calc(100vh-65px)] overflow-y-auto">
          {/* Drawer Window Titlebar */}
          <div className="bg-[#fb923c] px-4 py-2 border-b-2 border-black flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#f87171] border border-black"></span>
              <span className="w-2.5 h-2.5 bg-[#fde047] border border-black"></span>
              <span className="w-2.5 h-2.5 bg-[#86efac] border border-black"></span>
              <span className="font-mono text-xs font-bold text-black ml-1">
                SYSTEM MENU: bittu@android
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="font-mono text-xs font-bold px-1.5 py-0.5 bg-black text-white hover:bg-red-500 active:scale-95"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links list */}
          <div className="p-4 space-y-2.5">
            <div className="text-[10px] font-mono font-bold text-black/60 uppercase tracking-widest px-1">
              NAVIGATION DIRECTORY:
            </div>

            {navItems.map((item) =>
              isHomePage ? (
                <ScrollLink
                  key={item.to}
                  to={item.to}
                  href={`#${item.to}`}
                  smooth={true}
                  offset={-70}
                  duration={400}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#f6eedb] border-2 border-black font-mono text-sm font-bold shadow-brutal-xs hover:bg-[#fde047] active:translate-x-1 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="text-black font-black">{item.label}</span>
                  </span>
                  <span className="text-black/60 font-mono text-xs">→</span>
                </ScrollLink>
              ) : (
                <RouterLink
                  key={item.to}
                  to={`/#${item.to}`}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#f6eedb] border-2 border-black font-mono text-sm font-bold shadow-brutal-xs hover:bg-[#fde047] active:translate-x-1 active:translate-y-0.5 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="text-black font-black">{item.label}</span>
                  </span>
                  <span className="text-black/60 font-mono text-xs">→</span>
                </RouterLink>
              )
            )}

            {/* Quick External Actions */}
            <div className="pt-2 border-t-2 border-black/15 grid grid-cols-2 gap-2">
              <a
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                aria-label="RSS Feed"
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#fb923c] text-black border-2 border-black font-mono text-xs font-bold shadow-brutal-xs hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5"
              >
                <Rss className="w-3.5 h-3.5 text-black" />
                <span>RSS FEED</span>
              </a>

              <a
                href="https://github.com/Bittu5134"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                aria-label="GitHub Profile (@Bittu5134)"
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#fffdf9] text-black border-2 border-black font-mono text-xs font-bold shadow-brutal-xs hover:bg-[#c4b5fd] active:translate-x-0.5 active:translate-y-0.5"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-black shrink-0"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>GITHUB</span>
              </a>
            </div>

            <div className="pt-1">
              <a
                href="/discord"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-[#c4b5fd] text-black border-2 border-black font-mono text-xs font-bold shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5"
              >
                <span>👾 JOIN DISCORD COMMUNITY</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
