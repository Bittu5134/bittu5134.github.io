import "react";
import SideBar from "../components/SideBar";
import PhysicsTechField from "../components/PhysicsTechField";
import ProjectsSection from "../components/ProjectSection";
import AudioPlayer from "../components/AudioPlayer";

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
    <div className="flex bg-black text-white_smoke overflow-x-hidden relative">
      <SideBar />
      <div className="flex md:ml-72 ml-0 flex-col w-full mb-4 h-fit relative">
        {/* Interactive physics-driven floating background tech cards */}
        <PhysicsTechField technologies={technologies} />

        {/* Home / Hero Section */}
        <section id="home" className="h-screen flex p-4 relative z-10 pointer-events-none">
          <div className="m-auto flex flex-col md:flex-row justify-center items-center text-center md:text-left gap-8 md:gap-12 max-w-4xl p-6 md:p-10 rounded-2xl bg-black/50 backdrop-blur-sm pointer-events-auto">
            <img
              src="/images/avatar.png"
              alt="avatar"
              className="w-40 sm:w-48 md:w-56 lg:w-60 aspect-square object-cover rounded-2xl shadow-2xl shrink-0 my-4 md:my-auto"
            />
            <div className="flex flex-col my-auto px-2">
              <p className="text-2xl md:text-3xl font-normal">hey there, im</p>
              <p className="text-5xl md:text-8xl font-extrabold">Bittu</p>
              <p className="text-xl md:text-xl font-normal relative mt-1">
                a full-stack developer/hardware magician who does a bit of
              </p>
              <div className="w-full flex justify-center md:justify-start h-fit mt-1">
                <div className="relative text-xl md:text-xl font-normal">
                  <span className="absolute -left-[2px] top-0 text-[#01204E]">
                    everything
                  </span>
                  <span className="absolute -left-[1px] top-0 text-[#028393]">
                    everything
                  </span>
                  <span className="absolute left-0 top-0 text-[#F6DCAC]">
                    everything
                  </span>
                  <span className="absolute left-[1px] top-0 text-[#FAAA68]">
                    everything
                  </span>
                  <span className="absolute left-[2px] top-0 text-[#F65625]">
                    everything
                  </span>
                  <span className="invisible">everything</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="min-h-screen relative px-4 md:px-8 py-8 md:py-16 z-10 pointer-events-none"
        >
          <div className="sticky top-0 z-10 bg-black/50 backdrop-blur-sm p-4 md:p-6 rounded-xl max-w-2xl pointer-events-auto">
            <h2 className="font-extrabold text-5xl lg:text-8xl mb-4">
              about me
            </h2>
            <p className="font-medium text-base md:text-lg lg:text-xl">
              student @{" "}
              <a
                href="https://iitk.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-argentinian_blue underline"
              >
                iit kanpur '30
              </a>
              , pursuing a Bachelors in Cybersecurity. i love building low-level systems, high-scale web platforms, and participating in hackathons. outside of coding, i like playing{" "}
              <span className="font-bold text-[#2ecc71]">minecraft</span> (and even got featured on{" "}
              <a
                href="https://www.planetminecraft.com/member/bittu5134/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#f1c40f] underline"
              >
                minecraft live
              </a>
              !). in my free time i usually listen to music, reverse-engineer random protocols, or tinker with open-source tools.
            </p>
          </div>

          <div className="h-[75vh] relative pointer-events-none" />
        </section>

        {/* Projects Section */}
        <section id="projects" className="min-h-screen relative z-10 pointer-events-none">
          <div className="sticky top-0 pt-8 px-4 md:px-8 z-10 bg-black/30 backdrop-blur-sm mb-10 pointer-events-auto">
            <h2 className="text-5xl lg:text-8xl font-extrabold mb-4">
              projects
            </h2>
          </div>
          <div className="flex flex-col h-full flex-wrap w-full gap-4 md:gap-8 px-4 md:px-8 pointer-events-none">
            <ProjectsSection />
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="flex min-h-screen relative px-4 md:px-8 pt-8 md:pt-14 w-full z-10 pointer-events-none"
        >
          <p className="absolute text-6xl lg:text-8xl font-extrabold pointer-events-auto">
            contact
          </p>
          <div className="flex flex-col gap-12 m-auto md:mx-0 md:my-auto pt-20 md:pt-0 pointer-events-auto">
            {/* 1. GitHub */}
            <a
              href="https://github.com/Bittu5134"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 md:gap-6 text-5xl hover:text-argentinian_blue transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              <p className="my-auto">github</p>
            </a>

            {/* Temporarily removed LinkedIn */}
            {/*
            <a
              href="https://linkedin.com/in/bittu5134"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 md:gap-6 text-5xl hover:text-argentinian_blue transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              <p className="my-auto">linkedin</p>
            </a>
            */}

            {/* 3. Email */}
            <a
              href="mailto:hello@bittu.dev"
              className="flex items-center gap-4 md:gap-6 text-5xl hover:text-argentinian_blue transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <p className="my-auto">email</p>
            </a>

            {/* 4. Discord */}
            <a
              href="/discord"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 md:gap-6 text-5xl hover:text-[#5865F2] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <p className="my-auto">discord</p>
            </a>

            {/* 5. pmc */}
            <a
              href="https://www.planetminecraft.com/member/bittu5134/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 md:gap-6 text-5xl hover:text-[#2ecc71] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              <p className="my-auto">pmc</p>
            </a>
          </div>
        </section>
      </div>
      <AudioPlayer />
      <footer className="text-center w-full text-neutral-500 text-sm p-4 absolute bottom-0 left-1/2 -translate-x-1/2">
        &copy; 2026 Divyanshu Anand (Bittu5134)
      </footer>
    </div>
  );
}
