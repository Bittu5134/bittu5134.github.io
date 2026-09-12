"use client";

import { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation } from "react-router";

export default function SideBar() {
  const [active, setActive] = useState("home");
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isBlogPage = location.pathname.startsWith("/blog");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-7 right-4 z-50 p-2.5 bg-[#0e1322]/90 border border-white/10 rounded-xl text-cream backdrop-blur-md shadow-lg"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed h-full bg-[#080b12]/95 backdrop-blur-xl z-40 transition-all duration-300 ${
          isMobile
            ? isOpen
              ? "w-full right-0"
              : "w-full -right-full"
            : "w-[260px] left-0"
        }`}
      >
        <div className="h-full flex flex-col justify-center">
          <div className="flex flex-col gap-y-10 text-center">
            {/* Home */}
            {isHomePage ? (
              <ScrollLink
                spy={true}
                smooth={true}
                duration={500}
                to="home"
                offset={-20}
                isDynamic={true}
                onSetActive={() => setActive("home")}
                onClick={() => isMobile && setIsOpen(false)}
                className={`text-3xl md:text-4xl lg:text-5xl font-semibold group cursor-pointer max-w-fit mx-auto duration-200 transition-all ${
                  active === "home" && !isBlogPage
                    ? "text-cream"
                    : "text-cream/40 hover:text-cream"
                }`}
              >
                home
                <span
                  className={`block transition-all duration-300 h-1 bg-amber_glow ${
                    active === "home" && !isBlogPage
                      ? "max-w-full"
                      : "max-w-0 group-hover:max-w-full"
                  }`}
                ></span>
              </ScrollLink>
            ) : (
              <RouterLink
                to="/#home"
                onClick={() => isMobile && setIsOpen(false)}
                className="text-3xl md:text-4xl lg:text-5xl font-semibold group cursor-pointer max-w-fit mx-auto duration-200 transition-all text-cream/40 hover:text-cream"
              >
                home
                <span className="block transition-all duration-300 h-1 bg-amber_glow max-w-0 group-hover:max-w-full"></span>
              </RouterLink>
            )}

            {/* About */}
            {isHomePage ? (
              <ScrollLink
                spy={true}
                smooth={true}
                duration={500}
                to="about"
                offset={-20}
                isDynamic={true}
                onSetActive={() => setActive("about")}
                onClick={() => isMobile && setIsOpen(false)}
                className={`text-3xl md:text-4xl lg:text-5xl font-semibold group cursor-pointer max-w-fit mx-auto duration-200 transition-all ${
                  active === "about" && !isBlogPage
                    ? "text-cream"
                    : "text-cream/40 hover:text-cream"
                }`}
              >
                about
                <span
                  className={`block transition-all duration-300 h-1 bg-amber_glow ${
                    active === "about" && !isBlogPage
                      ? "max-w-full"
                      : "max-w-0 group-hover:max-w-full"
                  }`}
                ></span>
              </ScrollLink>
            ) : (
              <RouterLink
                to="/#about"
                onClick={() => isMobile && setIsOpen(false)}
                className="text-3xl md:text-4xl lg:text-5xl font-semibold group cursor-pointer max-w-fit mx-auto duration-200 transition-all text-cream/40 hover:text-cream"
              >
                about
                <span className="block transition-all duration-300 h-1 bg-amber_glow max-w-0 group-hover:max-w-full"></span>
              </RouterLink>
            )}

            {/* Blog */}
            {isHomePage ? (
              <ScrollLink
                spy={true}
                smooth={true}
                duration={500}
                to="blog"
                offset={-20}
                isDynamic={true}
                onSetActive={() => setActive("blog")}
                onClick={() => isMobile && setIsOpen(false)}
                className={`text-3xl md:text-4xl lg:text-5xl font-semibold group cursor-pointer max-w-fit mx-auto duration-200 transition-all ${
                  active === "blog" && !isBlogPage
                    ? "text-cream"
                    : "text-cream/40 hover:text-cream"
                }`}
              >
                blog
                <span
                  className={`block transition-all duration-300 h-1 bg-amber_glow ${
                    active === "blog" && !isBlogPage
                      ? "max-w-full"
                      : "max-w-0 group-hover:max-w-full"
                  }`}
                ></span>
              </ScrollLink>
            ) : (
              <RouterLink
                to="/blog"
                onClick={() => isMobile && setIsOpen(false)}
                className={`text-3xl md:text-4xl lg:text-5xl font-semibold group cursor-pointer max-w-fit mx-auto duration-200 transition-all ${
                  isBlogPage
                    ? "text-cream"
                    : "text-cream/40 hover:text-cream"
                }`}
              >
                blog
                <span
                  className={`block transition-all duration-300 h-1 bg-amber_glow ${
                    isBlogPage
                      ? "max-w-full"
                      : "max-w-0 group-hover:max-w-full"
                  }`}
                ></span>
              </RouterLink>
            )}

            {/* Projects */}
            {isHomePage ? (
              <ScrollLink
                spy={true}
                smooth={true}
                duration={500}
                to="projects"
                offset={-20}
                isDynamic={true}
                onSetActive={() => setActive("projects")}
                onClick={() => isMobile && setIsOpen(false)}
                className={`text-3xl md:text-4xl lg:text-5xl font-semibold group cursor-pointer max-w-fit mx-auto duration-200 transition-all ${
                  active === "projects" && !isBlogPage
                    ? "text-cream"
                    : "text-cream/40 hover:text-cream"
                }`}
              >
                projects
                <span
                  className={`block transition-all duration-300 h-1 bg-amber_glow ${
                    active === "projects" && !isBlogPage
                      ? "max-w-full"
                      : "max-w-0 group-hover:max-w-full"
                  }`}
                ></span>
              </ScrollLink>
            ) : (
              <RouterLink
                to="/#projects"
                onClick={() => isMobile && setIsOpen(false)}
                className="text-3xl md:text-4xl lg:text-5xl font-semibold group cursor-pointer max-w-fit mx-auto duration-200 transition-all text-cream/40 hover:text-cream"
              >
                projects
                <span className="block transition-all duration-300 h-1 bg-amber_glow max-w-0 group-hover:max-w-full"></span>
              </RouterLink>
            )}

            {/* Contact */}
            {isHomePage ? (
              <ScrollLink
                spy={true}
                smooth={true}
                duration={500}
                to="contact"
                offset={-20}
                isDynamic={true}
                onSetActive={() => setActive("contact")}
                onClick={() => isMobile && setIsOpen(false)}
                className={`text-3xl md:text-4xl lg:text-5xl font-semibold group cursor-pointer max-w-fit mx-auto duration-200 transition-all ${
                  active === "contact" && !isBlogPage
                    ? "text-cream"
                    : "text-cream/40 hover:text-cream"
                }`}
              >
                contact
                <span
                  className={`block transition-all duration-300 h-1 bg-amber_glow ${
                    active === "contact" && !isBlogPage
                      ? "max-w-full"
                      : "max-w-0 group-hover:max-w-full"
                  }`}
                ></span>
              </ScrollLink>
            ) : (
              <RouterLink
                to="/#contact"
                onClick={() => isMobile && setIsOpen(false)}
                className="text-3xl md:text-4xl lg:text-5xl font-semibold group cursor-pointer max-w-fit mx-auto duration-200 transition-all text-cream/40 hover:text-cream"
              >
                contact
                <span className="block transition-all duration-300 h-1 bg-amber_glow max-w-0 group-hover:max-w-full"></span>
              </RouterLink>
            )}
          </div>
          <span className="absolute right-0 h-5/6 top-1/2 -translate-y-1/2 w-0.5 bg-cream/10" />
        </div>
      </div>
    </>
  );
}
