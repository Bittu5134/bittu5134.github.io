import { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation } from "react-router";

export default function RetroMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const navItems = [
    { label: "~/projects", desc: "FEATURED PROJECTS", to: "projects", icon: "📂" },
    { label: "~/lab", desc: "SYSTEMS & CAPABILITIES", to: "lab", icon: "🧪" },
    { label: "~/zine", desc: "ARTICLES & DISPATCHES", to: "zine", icon: "📰" },
    { label: "~/about", desc: "BIO & MILESTONES", to: "about", icon: "👤" },
    { label: "~/contact", desc: "GET IN TOUCH", to: "contact", icon: "✉️" },
  ];

  // Close menu on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when mobile menu is open
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

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      {/* Floating Retro Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className={`fixed top-3 right-3 z-50 px-3 py-1.5 font-mono text-xs font-black border-2 border-black shadow-brutal flex items-center gap-1.5 transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none select-none ${
          isOpen
            ? "bg-[#f87171] text-black"
            : "bg-[#fde047] text-black hover:-translate-y-0.5"
        }`}
      >
        <span className="text-sm font-bold leading-none">{isOpen ? "✕" : "☰"}</span>
        <span>{isOpen ? "CLOSE" : "MENU"}</span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Retro Window Menu Drawer */}
      {isOpen && (
        <div
          className="fixed top-12 right-3 left-3 sm:left-auto sm:w-[320px] max-w-[360px] ml-auto z-50 bg-[#fffdf9] border-[3px] border-black shadow-brutal-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          {/* Window Titlebar */}
          <div className="bg-[#fb923c] px-3 py-1.5 border-b-[2px] border-black flex items-center justify-between select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#f87171] border border-black"></span>
              <span className="w-2.5 h-2.5 bg-[#fde047] border border-black"></span>
              <span className="w-2.5 h-2.5 bg-[#86efac] border border-black"></span>
              <span className="font-mono text-[11px] font-bold text-black ml-1">
                💾 bittu@nav: ~
              </span>
            </div>
            <button
              onClick={closeMenu}
              className="font-mono text-[11px] font-bold px-1.5 bg-black text-white hover:bg-[#f87171] hover:text-black transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Navigation Items List */}
          <div className="p-3 bg-[#f6eedb] space-y-1.5 max-h-[calc(80vh-80px)] overflow-y-auto">
            <div className="font-mono text-[10px] font-bold text-black/60 uppercase tracking-wider px-1 pb-1">
              NAVIGATION DIRECTORY:
            </div>

            {navItems.map((item) =>
              isHomePage ? (
                <ScrollLink
                  key={item.to}
                  to={item.to}
                  smooth={true}
                  offset={-20}
                  duration={400}
                  onClick={closeMenu}
                  className="cursor-pointer flex items-center justify-between p-2.5 bg-[#fffdf9] border-2 border-black font-mono text-xs font-bold text-black shadow-brutal-xs hover:bg-[#fde047] active:translate-x-0.5 active:translate-y-0.5 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="font-black text-sm">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-black/50 group-hover:text-black font-semibold">
                    {item.desc}
                  </span>
                </ScrollLink>
              ) : (
                <RouterLink
                  key={item.to}
                  to={`/#${item.to}`}
                  onClick={closeMenu}
                  className="flex items-center justify-between p-2.5 bg-[#fffdf9] border-2 border-black font-mono text-xs font-bold text-black shadow-brutal-xs hover:bg-[#fde047] active:translate-x-0.5 active:translate-y-0.5 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="font-black text-sm">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-black/50 group-hover:text-black font-semibold">
                    {item.desc}
                  </span>
                </RouterLink>
              )
            )}

            {/* Quick Actions Strip */}
            <div className="pt-2 border-t-2 border-black/15 grid grid-cols-2 gap-1.5 font-mono text-xs font-bold">
              <a
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="flex items-center justify-center gap-1 p-2 bg-[#fb923c] text-black border-2 border-black shadow-brutal-xs hover:shadow-none transition-all text-center"
              >
                <span>📡</span>
                <span>RSS FEED</span>
              </a>

              <a
                href="https://github.com/Bittu5134"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="flex items-center justify-center gap-1 p-2 bg-[#fffdf9] text-black border-2 border-black shadow-brutal-xs hover:bg-[#c4b5fd] transition-all text-center"
              >
                <span>🐙</span>
                <span>GITHUB ↗</span>
              </a>
            </div>

            {/* Home / Return to Top */}
            {isHomePage ? (
              <ScrollLink
                to="hero"
                smooth={true}
                duration={400}
                onClick={closeMenu}
                className="cursor-pointer flex items-center justify-center gap-1.5 p-2 bg-[#86efac] text-black border-2 border-black font-mono text-xs font-bold shadow-brutal-xs hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all text-center"
              >
                <span>▲ TOP OF PAGE</span>
              </ScrollLink>
            ) : (
              <RouterLink
                to="/"
                onClick={closeMenu}
                className="flex items-center justify-center gap-1.5 p-2 bg-[#86efac] text-black border-2 border-black font-mono text-xs font-bold shadow-brutal-xs hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all text-center"
              >
                <span>← RETURN HOME</span>
              </RouterLink>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
