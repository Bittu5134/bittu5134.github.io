import { Link as ScrollLink } from "react-scroll";

export default function RetroFooter() {
  return (
    <footer className="mt-16 border-t-[3px] border-black bg-[#f6eedb] py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-6">
        {/* Navigation / Links Box */}
        <div className="p-4 bg-[#fffdf9] border-2 border-black shadow-brutal-xs flex flex-wrap items-center justify-center gap-3 font-mono text-xs font-bold text-black">
          <a
            href="https://github.com/Bittu5134"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-4"
          >
            GITHUB
          </a>
          <span>•</span>
          <a
            href="https://www.planetminecraft.com/member/bittu5134/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-4"
          >
            PLANET MINECRAFT
          </a>
          <span>•</span>
          <a
            href="/discord"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-4"
          >
            DISCORD
          </a>
          <span>•</span>
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-4"
          >
            RSS FEED
          </a>
        </div>

        {/* Back to top button */}
        <ScrollLink
          to="hero"
          smooth={true}
          duration={500}
          className="cursor-pointer px-4 py-2 bg-[#86efac] text-black font-mono text-xs font-bold border-2 border-black shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5"
        >
          <span>▲ RETURN TO TOP</span>
        </ScrollLink>

        {/* Copyright */}
        <div className="space-y-1 font-mono text-xs text-black/70">
          <p className="font-bold">
            &copy; 2026 Divyanshu Anand (Bittu5134) &middot; IIT Kanpur
          </p>
        </div>
      </div>
    </footer>
  );
}
