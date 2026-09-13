import blogPosts from "../../data/blogs-meta.json";
import { Rss, ArrowUpRight, BookOpen } from "../icons";

export default function RetroZine() {
  return (
    <section id="blog" className="py-6 sm:py-8 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-black tracking-tight">
              ~/blog
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <a
              href="/blog"
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#fde047] text-black font-mono text-xs sm:text-sm font-bold border-2 border-black shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>ALL ARTICLES (3)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 bg-[#fb923c] text-black font-mono text-xs sm:text-sm font-bold border-2 border-black shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5"
            >
              <Rss className="w-4 h-4" />
              <span>RSS 2.0</span>
            </a>
          </div>
        </div>

        {/* Zine Articles Stack */}
        <div className="space-y-4 sm:space-y-6">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="p-4 sm:p-8 bg-[#fffdf9] border-[3px] border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 transition-all group grain"
            >
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-3 pb-3 border-b-2 border-black/10">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#86efac] border border-black font-mono text-xs font-bold text-black">
                    {post.date.toUpperCase()}
                  </span>
                  <span className="font-mono text-xs sm:text-sm text-black/60 font-bold">
                    // {post.readTime.toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-[#f6eedb] border border-black font-mono text-xs font-bold text-black"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-black mb-3 group-hover:text-[#d97706] transition-colors">
                <a href={`/blog/${post.slug}`} className="hover:underline underline-offset-4">
                  {post.title}
                </a>
              </h3>

              <p className="font-mono text-xs sm:text-sm text-black/80 leading-relaxed mb-5">
                {post.summary}
              </p>

              <div className="flex items-center justify-between pt-2">
                <a
                  href={`/blog/${post.slug}`}
                  className="px-4 py-2 bg-[#fde047] text-black font-mono text-xs sm:text-sm font-bold border-2 border-black shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5"
                >
                  <span>READ DISPATCH</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
