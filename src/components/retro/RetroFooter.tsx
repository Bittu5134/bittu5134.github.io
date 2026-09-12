import { Link as ScrollLink } from "react-scroll";

export default function RetroFooter() {
  return (
    <footer className="mt-10 sm:mt-16 border-t-[3px] border-black bg-[#f6eedb] py-8 sm:py-12 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-5 sm:gap-6">
        {/* Back to top button */}
        <ScrollLink
          to="hero"
          href="#hero"
          smooth={true}
          duration={500}
          className="cursor-pointer px-4 py-2 bg-[#86efac] text-black font-mono text-xs sm:text-sm font-bold border-2 border-black shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5"
        >
          <span>▲ RETURN TO TOP</span>
        </ScrollLink>

        {/* Copyright */}
        <div className="space-y-1 font-mono text-xs sm:text-sm text-black/70">
          <p className="font-bold">
            &copy; 2026 Bittu (Bittu5134) &middot; IIT Kanpur
          </p>
        </div>
      </div>
    </footer>
  );
}
