import { useParams, Link, Navigate } from "react-router";
import { blogPosts } from "../data/blogs";
import RetroHeader from "../components/retro/RetroHeader";
import RetroFooter from "../components/retro/RetroFooter";
import RetroCassettePlayer from "../components/retro/RetroCassettePlayer";
import Markdown from "react-markdown";
import { useState } from "react";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);
  const [copied, setCopied] = useState(false);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6eedb] retro-dots-bg text-[#14161f] font-sans selection:bg-[#fde047] selection:text-black">
      <RetroHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Navigation & Share */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            to="/blog"
            className="px-3.5 py-1.5 bg-[#fffdf9] border-2 border-black font-mono text-xs sm:text-sm font-bold shadow-brutal-xs hover:bg-[#fde047] hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
          >
            <span>← ALL ARTICLES</span>
          </Link>

          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 bg-[#fffdf9] border-2 border-black font-mono text-xs sm:text-sm font-bold shadow-brutal-xs hover:bg-[#86efac] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{copied ? "LINK COPIED! ✓" : "SHARE ARTICLE ↗"}</span>
          </button>
        </div>

        {/* Article Box */}
        <article className="p-6 sm:p-10 md:p-12 bg-[#fffdf9] border-[3px] border-black shadow-brutal-lg">
          {/* Metadata Header */}
          <div className="mb-8 pb-6 border-b-[3px] border-black">
            <div className="flex flex-wrap items-center gap-2 mb-4 font-mono text-xs sm:text-sm font-bold">
              <span className="px-2.5 py-1 bg-[#86efac] border border-black">
                STAMP: {post.date.toUpperCase()}
              </span>
              <span className="px-2.5 py-1 bg-[#fde047] border border-black">
                {post.readTime.toUpperCase()}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black leading-tight mb-4">
              {post.title}
            </h1>

            <p className="font-mono text-sm sm:text-base text-black/80 font-bold leading-relaxed mb-4">
              {post.summary}
            </p>

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

          {/* Article Markdown Content with Retro Styling */}
          <div className="font-mono text-sm sm:text-base leading-relaxed text-black/90 space-y-6">
            <Markdown
              components={{
                h2: ({ ...props }) => (
                  <h2
                    className="text-xl sm:text-2xl font-black text-black mt-8 mb-4 pt-4 border-t-2 border-black/20 flex items-center gap-2"
                    {...props}
                  />
                ),
                h3: ({ ...props }) => (
                  <h3
                    className="text-lg sm:text-xl font-bold text-black mt-6 mb-2"
                    {...props}
                  />
                ),
                p: ({ ...props }) => (
                  <p className="leading-relaxed mb-4" {...props} />
                ),
                ul: ({ ...props }) => (
                  <ul className="list-disc list-inside space-y-2 mb-4 pl-2" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-4 pl-2" {...props} />
                ),
                li: ({ ...props }) => (
                  <li className="leading-relaxed" {...props} />
                ),
                blockquote: ({ ...props }) => (
                  <blockquote
                    className="border-l-4 border-[#f59e0b] bg-[#fef08a] p-4 my-4 font-mono text-xs sm:text-sm text-black border-2 border-black shadow-brutal-xs"
                    {...props}
                  />
                ),
                code: ({ className, children, ...props }) => {
                  const isBlock = className?.includes("language-");
                  if (isBlock) {
                    return (
                      <div className="my-5 border-2 border-black shadow-brutal bg-[#12151e] p-4 overflow-x-auto text-[#f5ede3] text-xs sm:text-sm font-mono">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </div>
                    );
                  }
                  return (
                    <code
                      className="px-1.5 py-0.5 bg-[#f6eedb] border border-black text-black font-mono text-xs sm:text-sm font-bold"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => <>{children}</>,
                table: ({ ...props }) => (
                  <div className="overflow-x-auto my-6 border-2 border-black shadow-brutal-xs">
                    <table className="w-full text-left font-mono text-xs sm:text-sm border-collapse" {...props} />
                  </div>
                ),
                th: ({ ...props }) => (
                  <th className="p-2.5 bg-[#fde047] border border-black font-bold text-black" {...props} />
                ),
                td: ({ ...props }) => (
                  <td className="p-2.5 border border-black/30 bg-[#fffdf9]" {...props} />
                ),
                a: ({ href, children, ...props }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline underline-offset-4 decoration-[#f59e0b] hover:bg-[#fde047] transition-colors"
                    {...props}
                  >
                    {children}
                  </a>
                ),
                hr: () => <hr className="my-8 border-t-2 border-black/20" />,
              }}
            >
              {post.content}
            </Markdown>
          </div>

          {/* Article Footer Note */}
          <div className="mt-12 pt-6 border-t-2 border-black flex items-center justify-between flex-wrap gap-4 font-mono text-xs sm:text-sm font-bold">
            <Link
              to="/blog"
              className="px-4 py-2 bg-[#fde047] border-2 border-black shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 transition-all"
            >
              ← BACK TO ALL DISPATCHES
            </Link>

            <a
              href="mailto:hello@bittu.dev"
              className="px-4 py-2 bg-[#86efac] border-2 border-black shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 transition-all"
            >
              SEND COMMENTS VIA EMAIL ✉️
            </a>
          </div>
        </article>
      </main>

      <RetroFooter />
      <RetroCassettePlayer />
    </div>
  );
}
