import { Link } from "react-router";
import { blogPosts } from "../data/blogs";
import SideBar from "../components/SideBar";
import AudioPlayer from "../components/AudioPlayer";
import { Rss, ArrowLeft, Clock, Calendar } from "lucide-react";

export default function BlogList() {
  return (
    <div className="flex bg-[#080b12] text-cream overflow-x-hidden relative min-h-screen">
      <SideBar />
      <div className="flex md:ml-[260px] ml-0 flex-col w-full min-h-screen relative px-6 md:px-14 lg:px-20 py-16">
        
        {/* Navigation back to home on mobile / top bar */}
        <div className="flex items-center justify-between max-w-4xl mb-12">
          <Link
            to="/"
            className="flex items-center gap-2 text-cream/70 hover:text-amber_glow transition-colors text-sm font-mono group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>back to portfolio</span>
          </Link>

          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e1322] border border-white/10 hover:border-amber_glow/50 text-cream/80 hover:text-amber_glow transition-colors text-xs font-mono"
            title="Subscribe via RSS"
          >
            <Rss size={14} className="text-amber_glow" />
            <span>RSS Feed</span>
          </a>
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-cream mb-4">
            blog
          </h1>
          <p className="text-lg sm:text-xl text-cream/70 font-normal leading-relaxed">
            essays and deep dives into low-level systems, reverse engineering, distributed networking, and software craft.
          </p>
        </div>

        {/* Post List */}
        <div className="flex flex-col divide-y divide-cream/[0.08] max-w-4xl w-full">
          {blogPosts.map((post) => (
            <article key={post.slug} className="py-10 first:pt-0 group">
              <div className="flex flex-col gap-3">
                {/* Meta */}
                <div className="flex items-center gap-4 text-xs font-mono text-cream/50">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-cream group-hover:text-amber_glow transition-colors duration-200">
                  <Link to={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                {/* Summary */}
                <p className="text-cream/70 text-base leading-relaxed max-w-3xl font-normal">
                  {post.summary}
                </p>

                {/* Tags & Action */}
                <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#0e1322] border border-white/5 text-lavender-light"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-sm font-mono text-amber_glow hover:underline underline-offset-4 flex items-center gap-1"
                  >
                    <span>read article</span>
                    <span>↗</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Single Footer */}
        <footer className="text-center w-full text-cream/30 text-xs font-mono py-16 mt-auto">
          &copy; 2026 Divyanshu Anand (Bittu5134)
        </footer>
      </div>

      <AudioPlayer />
    </div>
  );
}
