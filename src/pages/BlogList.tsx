import { Link } from "react-router";
import { blogPosts } from "../data/blogs";
import RetroHeader from "../components/retro/RetroHeader";
import RetroFooter from "../components/retro/RetroFooter";
import RetroCassettePlayer from "../components/retro/RetroCassettePlayer";

export default function BlogList() {
  return (
    <div className="min-h-screen bg-[#f6eedb] retro-dots-bg text-[#14161f] font-sans selection:bg-[#fde047] selection:text-black">
      <RetroHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Navigation & Feed header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            to="/"
            className="px-3.5 py-1.5 bg-[#fffdf9] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs hover:bg-[#fde047] hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
          >
            <span>← RETURN HOME</span>
          </Link>

          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-[#fb923c] text-black border-2 border-black font-mono text-xs font-bold shadow-brutal-xs hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
          >
            <span>📡 RSS 2.0 FEED</span>
          </a>
        </div>

        {/* Page Title Box */}
        <div className="p-6 sm:p-8 bg-[#fffdf9] border-[3px] border-black shadow-brutal-lg mb-10">
          <div className="inline-block px-3 py-1 bg-[#fde047] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs mb-3">
            TECHNICAL ZINE ARCHIVE
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-black mb-3">
            DEEP DIVES & NOTES.
          </h1>
          <p className="font-mono text-xs sm:text-sm text-black/80 max-w-2xl leading-relaxed">
            Essays on low-level networking in Go, reverse-engineering the Minecraft Java wire format, 2D Cartesian spatial parsing in Python, and architecture blueprints.
          </p>
        </div>

        {/* Post List */}
        <div className="space-y-6">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="p-6 sm:p-8 bg-[#fffdf9] border-[3px] border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3 pb-3 border-b-2 border-black/10">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#86efac] border border-black font-mono text-[11px] font-bold text-black">
                    STAMP: {post.date.toUpperCase()}
                  </span>
                  <span className="font-mono text-xs text-black/60 font-bold">
                    // {post.readTime.toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-[#f6eedb] border border-black font-mono text-[11px] font-bold text-black"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-black mb-3 group-hover:text-[#d97706] transition-colors">
                <Link to={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>

              <p className="font-mono text-xs sm:text-sm text-black/80 leading-relaxed mb-5">
                {post.summary}
              </p>

              <div className="flex items-center justify-between pt-2">
                <Link
                  to={`/blog/${post.slug}`}
                  className="px-4 py-2 bg-[#fde047] text-black font-mono text-xs font-bold border-2 border-black shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5"
                >
                  <span>READ DISPATCH</span>
                  <span>↗</span>
                </Link>

                <span className="font-mono text-[11px] text-black/40 font-bold">
                  /blog/{post.slug}
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>

      <RetroFooter />
      <RetroCassettePlayer />
    </div>
  );
}
