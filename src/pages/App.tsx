import SideBar from "../components/SideBar";
import PhysicsTechField from "../components/PhysicsTechField";
import ProjectsSection from "../components/ProjectSection";
import AudioPlayer from "../components/AudioPlayer";
import { blogPosts } from "../data/blogs";

export default function App() {
  const technologies = [
    {
      name: "go",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
    },
    {
      name: "python",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    },
    {
      name: "typescript",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    },
    {
      name: "javascript",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    },
    {
      name: "c",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
    },
    {
      name: "c++",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    },
    {
      name: "rust",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg",
    },
    {
      name: "java",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    },
    {
      name: "react",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    },
    {
      name: "svelte",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg",
    },
    {
      name: "nextjs",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    },
    {
      name: "tailwindcss",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    },
    {
      name: "nodejs",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    },
    {
      name: "express",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    },
    {
      name: "fastapi",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
    },
    {
      name: "pytorch",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
    },
    {
      name: "redis",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
    },
    {
      name: "postgresql",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    },
    {
      name: "mongodb",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    },
    {
      name: "sqlite",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
    },
    {
      name: "supabase",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
    },
    {
      name: "linux",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
    },
    {
      name: "docker",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    },
    {
      name: "cloudflare",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudflare/cloudflare-original.svg",
    },
    {
      name: "git",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    },
    {
      name: "github",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    },
    {
      name: "blender",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg",
    },
    {
      name: "bash",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
    },
    {
      name: "opengl",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opengl/opengl-original.svg",
    },
    {
      name: "webrtc",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webrtc/webrtc-original.svg",
    },
  ];

  return (
    <div className="flex bg-[#080b12] text-cream overflow-x-hidden relative min-h-screen">
      <SideBar />
      <div className="flex md:ml-[260px] ml-0 flex-col w-full min-h-screen relative">
        {/* Interactive physics-driven floating background tech tags */}
        <PhysicsTechField technologies={technologies} />

        {/* Home / Hero Section */}
        <section
          id="home"
          className="min-h-screen flex items-center px-6 md:px-14 lg:px-20 py-20 relative z-10 pointer-events-none"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8 md:gap-12 max-w-3xl pointer-events-auto">
            <img
              src="/images/avatar.png"
              alt="Bittu avatar"
              className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 object-cover rounded-full shadow-2xl shrink-0 ring-2 ring-cyan-500/20 shadow-cyan-500/10"
            />
            <div className="flex flex-col justify-center">
              <p className="text-xl sm:text-2xl font-light text-cream/70 mb-1">
                hey there, im
              </p>
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-cream mb-4">
                Bittu
              </h1>
              <p className="text-lg sm:text-xl font-normal text-cream/80 leading-relaxed max-w-xl">
                a full-stack developer / systems hacker who does a bit of{" "}
                <span className="glitch-text text-amber_glow font-semibold whitespace-nowrap">
                  everything
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="min-h-screen flex flex-col justify-center px-6 md:px-14 lg:px-20 py-24 relative z-10 pointer-events-none"
        >
          <div className="max-w-2xl pointer-events-auto">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-cream mb-8">
              about me
            </h2>
            <div className="space-y-4 text-base sm:text-lg text-cream/80 font-normal leading-relaxed">
              <p>
                student @{" "}
                <a
                  href="https://iitk.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-argentinian_blue hover:underline underline-offset-4"
                >
                  iit kanpur '30
                </a>
                , pursuing a bachelors in cybersecurity. i love building low-level systems, high-scale web platforms, and participating in hackathons.
              </p>
              <p>
                outside of coding, i like playing{" "}
                <span className="text-[#2ecc71] font-medium">minecraft</span> (and even got featured on{" "}
                <a
                  href="https://www.planetminecraft.com/member/bittu5134/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f1c40f] hover:underline underline-offset-4 font-medium"
                >
                  minecraft live
                </a>
                !). in my free time i usually listen to music, reverse-engineer random protocols, or tinker with open-source tools.
              </p>
            </div>
          </div>
        </section>

        {/* Inline Blog Section */}
        <section
          id="blog"
          className="min-h-screen flex flex-col justify-center px-6 md:px-14 lg:px-20 py-24 relative z-10 pointer-events-none"
        >
          <div className="w-full max-w-4xl pointer-events-auto">
            <div className="flex items-baseline justify-between flex-wrap gap-4 mb-10">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-cream">
                blog
              </h2>
              <a
                href="/blog"
                className="text-sm font-mono text-amber_glow hover:underline underline-offset-4 flex items-center gap-1"
              >
                <span>(more blogs ↗)</span>
              </a>
            </div>

            <div className="flex flex-col divide-y divide-cream/[0.08]">
              {blogPosts.slice(0, 2).map((post) => (
                <article key={post.slug} className="py-8 first:pt-0 last:pb-0 group">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-xs font-mono text-cream/50">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-cream group-hover:text-amber_glow transition-colors duration-200">
                      <a href={`/blog/${post.slug}`} className="hover:underline underline-offset-4 decoration-amber_glow/40">
                        {post.title}{" "}
                        <span className="text-base text-cream/40 group-hover:text-amber_glow font-normal">
                          ↗
                        </span>
                      </a>
                    </h3>

                    <p className="text-cream/70 text-base md:text-lg leading-relaxed font-normal">
                      {post.summary}
                    </p>

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

                      <a
                        href={`/blog/${post.slug}`}
                        className="text-sm font-mono text-amber_glow hover:underline underline-offset-4"
                      >
                        read post ↗
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="pt-8 flex items-center justify-between flex-wrap gap-4 text-sm font-mono border-t border-cream/[0.08] mt-8">
              <a
                href="/blog"
                className="text-amber_glow hover:underline underline-offset-4 flex items-center gap-1"
              >
                <span>view all articles & deep dives ↗</span>
              </a>

              <a
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/40 hover:text-amber_glow transition-colors flex items-center gap-1 text-xs"
              >
                <span>rss feed ↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section
          id="projects"
          className="min-h-screen flex flex-col justify-center px-6 md:px-14 lg:px-20 py-24 relative z-10 pointer-events-none"
        >
          <div className="w-full max-w-4xl pointer-events-auto">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-cream mb-10">
              projects
            </h2>
            <ProjectsSection />
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="min-h-screen flex flex-col justify-center px-6 md:px-14 lg:px-20 py-24 relative z-10 pointer-events-none"
        >
          <div className="max-w-xl pointer-events-auto">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-cream mb-3">
              contact
            </h2>
            <p className="text-cream/50 text-base sm:text-lg mb-10 font-normal">
              say hi. i'm always happy to chat about systems, projects, or ideas.
            </p>

            <div className="flex flex-col gap-6">
              <a
                href="https://github.com/Bittu5134"
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl sm:text-4xl font-bold text-cream/75 hover:text-argentinian_blue transition-colors duration-200 w-fit flex items-baseline gap-2"
              >
                <span>github</span>
                <span className="text-xl text-cream/35">↗</span>
              </a>

              <a
                href="mailto:hello@bittu.dev"
                className="text-3xl sm:text-4xl font-bold text-cream/75 hover:text-argentinian_blue transition-colors duration-200 w-fit flex items-baseline gap-2"
              >
                <span>email</span>
                <span className="text-xl text-cream/35">↗</span>
              </a>

              <a
                href="/discord"
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl sm:text-4xl font-bold text-cream/75 hover:text-[#5865F2] transition-colors duration-200 w-fit flex items-baseline gap-2"
              >
                <span>discord</span>
                <span className="text-xl text-cream/35">↗</span>
              </a>

              <a
                href="https://www.planetminecraft.com/member/bittu5134/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl sm:text-4xl font-bold text-cream/75 hover:text-[#2ecc71] transition-colors duration-200 w-fit flex items-baseline gap-2"
              >
                <span>planet minecraft</span>
                <span className="text-xl text-cream/35">↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* Clean, warm, single footer */}
        <footer className="text-center w-full text-cream/30 text-xs font-mono py-12">
          &copy; 2026 Divyanshu Anand (Bittu5134)
        </footer>
      </div>

      <AudioPlayer />
    </div>
  );
}
