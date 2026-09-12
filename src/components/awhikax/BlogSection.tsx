import React from "react";
import { blogPosts } from "../../data/blogs";

const BlogSection: React.FC = () => {
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <section
      id="blog"
      className="py-24 px-6 md:px-10"
    >
      {/* Section Header */}
      <div className="mb-14">
        <p className="text-sm font-mono text-cream/40 tracking-widest mb-3">— writing</p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-cream leading-tight">
          Recent Deep Dives
        </h2>
      </div>

      {/* Blog post cards — vertical list */}
      <div className="flex flex-col gap-6 mb-10">
        {recentPosts.map((post) => (
          <article
            key={post.slug}
            className="bg-[#0b0e17] border border-white/10 rounded-2xl p-6 hover:border-[#f49a60]/30 transition-all duration-300 group"
          >
            {/* Top row: date + read time */}
            <div className="flex items-center gap-3 text-xs font-mono text-cream/40 mb-3">
              <span>{post.date}</span>
              <span className="text-white/10">·</span>
              <span>{post.readTime}</span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-cream group-hover:text-[#f49a60] transition-colors mb-2">
              <a href={`/blog/${post.slug}`}>{post.title}</a>
            </h3>

            {/* Summary */}
            <p className="text-cream/60 text-sm leading-relaxed mt-2 mb-4">
              {post.summary}
            </p>

            {/* Bottom row: tags + read link */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#080b12] border border-white/10 text-cream/50 text-xs font-mono px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={`/blog/${post.slug}`}
                className="text-xs font-mono text-[#f49a60] hover:text-[#f49a60]/80 transition-colors underline underline-offset-4 shrink-0"
              >
                Read Post ↗
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Footer links */}
      <div className="flex flex-wrap items-center gap-6">
        <a
          href="/blog"
          className="text-sm font-mono text-[#f49a60] hover:text-[#f49a60]/80 transition-colors underline underline-offset-4"
        >
          View All Articles ↗
        </a>
        <a
          href="/rss.xml"
          className="text-sm font-mono text-cream/40 hover:text-cream/70 transition-colors underline underline-offset-4"
        >
          RSS Feed ↗
        </a>
      </div>
    </section>
  );
};

export default BlogSection;
