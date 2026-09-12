import { useParams, Link, Navigate } from "react-router";
import { blogPosts } from "../data/blogs";
import SideBar from "../components/SideBar";
import AudioPlayer from "../components/AudioPlayer";
import Markdown from "react-markdown";
import { ArrowLeft, Clock, Calendar, Share2, Check } from "lucide-react";
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
    <div className="flex bg-[#080b12] text-cream overflow-x-hidden relative min-h-screen">
      <SideBar />
      <div className="flex md:ml-[260px] ml-0 flex-col w-full min-h-screen relative px-6 md:px-14 lg:px-20 py-16">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between max-w-3xl mb-12">
          <Link
            to="/blog"
            className="flex items-center gap-2 text-cream/70 hover:text-amber_glow transition-colors text-sm font-mono group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>all articles</span>
          </Link>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1322] border border-white/10 hover:border-amber_glow/50 text-cream/70 hover:text-amber_glow transition-colors text-xs font-mono"
            aria-label="Copy article link"
          >
            {copied ? (
              <>
                <Check size={14} className="text-[#2ecc71]" />
                <span className="text-[#2ecc71]">copied link!</span>
              </>
            ) : (
              <>
                <Share2 size={14} />
                <span>share</span>
              </>
            )}
          </button>
        </div>

        {/* Article Container */}
        <article className="max-w-3xl w-full">
          {/* Header */}
          <header className="mb-12 pb-8 border-b border-cream/[0.08]">
            <div className="flex items-center gap-3 text-xs font-mono text-cream/50 mb-4">
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

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-cream mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#0e1322] border border-white/10 text-lavender-light"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* Markdown Body */}
          <div className="prose prose-invert max-w-none text-cream/85 font-normal leading-relaxed">
            <Markdown
              components={{
                h2: ({ children }) => (
                  <h2 className="text-2xl sm:text-3xl font-bold mt-12 mb-4 text-cream tracking-tight pb-2 border-b border-white/5">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl sm:text-2xl font-bold mt-8 mb-3 text-amber_glow tracking-tight">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-base sm:text-lg mb-6 leading-relaxed text-cream/85">
                    {children}
                  </p>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-argentinian_blue hover:underline underline-offset-4 font-medium"
                  >
                    {children}
                  </a>
                ),
                code: ({ className, children }) => {
                  const isInline = !className && typeof children === "string" && !children.includes("\n");
                  if (isInline) {
                    return (
                      <code className="bg-[#12182c] text-amber_glow-light px-1.5 py-0.5 rounded text-sm font-mono border border-white/5">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="block bg-[#080d1a] border border-white/10 text-cream p-4 rounded-xl text-xs sm:text-sm font-mono overflow-x-auto my-6 shadow-inner">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => <pre className="not-prose my-6">{children}</pre>,
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 mb-6 text-cream/80 text-base sm:text-lg">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-6 text-cream/80 text-base sm:text-lg">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-amber_glow pl-4 my-6 italic text-cream/70 bg-[#0e1322]/50 py-2 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-8 border border-white/10 rounded-xl bg-[#0a0f1e]">
                    <table className="w-full text-left text-sm font-mono">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-[#10172e] border-b border-white/10 text-cream font-bold">
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-y divide-white/5 text-cream/80">
                    {children}
                  </tbody>
                ),
                tr: ({ children }) => <tr className="hover:bg-white/[0.02]">{children}</tr>,
                th: ({ children }) => <th className="p-3 sm:p-4">{children}</th>,
                td: ({ children }) => <td className="p-3 sm:p-4">{children}</td>,
                hr: () => <hr className="my-12 border-0 h-px bg-white/10" />,
              }}
            >
              {post.content}
            </Markdown>
          </div>

          {/* Bottom Back Button */}
          <div className="mt-16 pt-8 border-t border-cream/[0.08] flex justify-between items-center">
            <Link
              to="/blog"
              className="flex items-center gap-2 text-amber_glow hover:underline underline-offset-4 text-sm font-mono"
            >
              <ArrowLeft size={16} />
              <span>back to all articles</span>
            </Link>
          </div>
        </article>

        {/* Footer */}
        <footer className="text-center w-full text-cream/30 text-xs font-mono py-16 mt-auto">
          &copy; 2026 Divyanshu Anand (Bittu5134)
        </footer>
      </div>

      <AudioPlayer />
    </div>
  );
}
