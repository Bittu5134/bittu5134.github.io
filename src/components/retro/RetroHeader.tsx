import { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation } from "react-router";
import {
  Rss,
  Folder,
  FileText,
  User,
  Mail,
  Menu,
  X,
  HardDrive,
  GithubIcon,
  DiscordIcon,
} from "../icons";

export default function RetroHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const navItems = [
    { label: "~/projects", icon: Folder, to: "projects" },
    { label: "~/blog", icon: FileText, to: "blog" },
    { label: "~/about", icon: User, to: "about" },
    { label: "~/contact", icon: Mail, to: "contact" },
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
                <HardDrive className="w-5 h-5 text-black shrink-0" />
                <span className="font-pixel text-lg sm:text-2xl font-bold tracking-wider">BITTU.DEV</span>
              </ScrollLink>
            ) : (
              <RouterLink
                to="/"
                className="group flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-[#fde047] border-2 border-black shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                <HardDrive className="w-5 h-5 text-black shrink-0" />
                <span className="font-pixel text-lg sm:text-2xl font-bold tracking-wider">BITTU.DEV</span>
                <span className="hidden sm:inline-block text-xs font-mono bg-black text-white px-2 py-0.5 rounded-sm font-bold">
                  ← HOME
                </span>
              </RouterLink>
            )}
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return isHomePage ? (
                <ScrollLink
                  key={item.to}
                  to={item.to}
                  href={`#${item.to}`}
                  smooth={true}
                  offset={-70}
                  duration={400}
                  className="px-3 py-1.5 font-mono text-sm font-bold text-black border-2 border-transparent hover:border-black hover:bg-[#fffdf9] hover:shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Icon className="w-4 h-4 text-black shrink-0" />
                  <span>{item.label}</span>
                </ScrollLink>
              ) : (
                <RouterLink
                  key={item.to}
                  to={`/#${item.to}`}
                  className="px-3 py-1.5 font-mono text-sm font-bold text-black border-2 border-transparent hover:border-black hover:bg-[#fffdf9] hover:shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Icon className="w-4 h-4 text-black shrink-0" />
                  <span>{item.label}</span>
                </RouterLink>
              );
            })}

            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="RSS Feed"
              className="px-2.5 py-1.5 font-mono text-sm font-bold text-black border-2 border-transparent hover:border-black hover:bg-[#fb923c] hover:shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
            >
              <Rss className="w-4 h-4 text-black shrink-0" />
              <span>RSS</span>
            </a>
          </nav>

          {/* Right Action Icons & Mobile Drawer Toggle */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/Bittu5134"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile (@Bittu5134)"
              className="px-2.5 py-1 sm:py-1.5 bg-[#fffdf9] border-2 border-black font-mono text-xs sm:text-sm font-bold shadow-brutal-xs hover:bg-[#c4b5fd] hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5"
            >
              <GithubIcon className="w-4 h-4 sm:w-5 sm:h-5 text-black shrink-0" />
              <span className="hidden sm:inline-block font-mono text-xs sm:text-sm font-bold">GITHUB</span>
            </a>

            {/* Android / Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden px-3 py-1 sm:py-1.5 bg-[#fde047] border-2 border-black font-mono text-xs sm:text-sm font-black shadow-brutal-xs hover:bg-[#fb923c] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 select-none cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-4 h-4 text-black shrink-0" /> : <Menu className="w-4 h-4 text-black shrink-0" />}
              <span className="text-xs">{isOpen ? "CLOSE" : "MENU"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-xs flex flex-col justify-start pt-16 px-4 pb-6 overflow-y-auto animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="bg-[#fffdf9] border-[3px] border-black shadow-brutal-lg p-5 space-y-4 max-w-sm w-full mx-auto mt-2">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <span className="font-mono text-xs font-black tracking-wider text-black/60">
                SYSTEM MENU
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="font-mono text-xs font-bold px-2 py-0.5 bg-[#fde047] border border-black shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5"
                aria-label="Close menu"
              >
                ESC [X]
              </button>
            </div>

            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return isHomePage ? (
                  <ScrollLink
                    key={item.to}
                    to={item.to}
                    href={`#${item.to}`}
                    smooth={true}
                    offset={-70}
                    duration={400}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 font-mono text-sm font-bold text-black bg-[#f6eedb] border-2 border-black shadow-brutal-xs hover:bg-[#fde047] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    <Icon className="w-4 h-4 text-black shrink-0" />
                    <span>{item.label}</span>
                  </ScrollLink>
                ) : (
                  <RouterLink
                    key={item.to}
                    to={`/#${item.to}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 font-mono text-sm font-bold text-black bg-[#f6eedb] border-2 border-black shadow-brutal-xs hover:bg-[#fde047] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    <Icon className="w-4 h-4 text-black shrink-0" />
                    <span>{item.label}</span>
                  </RouterLink>
                );
              })}

              <a
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 font-mono text-sm font-bold text-black bg-[#fb923c] border-2 border-black shadow-brutal-xs hover:bg-[#f97316] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <Rss className="w-4 h-4 text-black shrink-0" />
                <span>~/rss.xml</span>
              </a>
            </nav>

            <div className="pt-2 border-t-2 border-black flex gap-2">
              <a
                href="https://github.com/Bittu5134"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                aria-label="GitHub Profile (@Bittu5134)"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#fffdf9] text-black border-2 border-black font-mono text-xs font-bold shadow-brutal-xs hover:bg-[#c4b5fd] active:translate-x-0.5 active:translate-y-0.5"
              >
                <GithubIcon className="w-4 h-4 text-black shrink-0" />
                <span>GITHUB</span>
              </a>
            </div>

            <div className="pt-1">
              <a
                href="/discord"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#c4b5fd] text-black border-2 border-black font-mono text-xs font-bold shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5"
              >
                <DiscordIcon className="w-4 h-4 text-black shrink-0" />
                <span>JOIN DISCORD COMMUNITY</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
