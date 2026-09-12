import { useState } from "react";
import { projects, categories, Project } from "../../data/projects";
import { Coffee, Heart, ArrowUpRight } from "../icons";

export default function RetroProjects() {
  const [filter, setFilter] = useState("ALL");

  const filteredProjects: Project[] =
    filter === "ALL"
      ? projects
      : projects.filter((p) => {
          if (p.filterCategory === filter) return true;
          return p.category.includes(filter);
        });

  // Show only 4 projects at once for the selected filter
  const displayedProjects = filteredProjects.slice(0, 4);

  return (
    <section id="projects" className="py-6 sm:py-8 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-black tracking-tight">
              ~/projects
            </h2>
          </div>

          {/* Data-Driven Filter Pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 font-mono text-xs font-bold">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 border-2 border-black transition-all cursor-pointer ${
                  filter === cat
                    ? "bg-[#fde047] shadow-brutal-xs font-black -translate-y-0.5"
                    : "bg-[#fffdf9] hover:bg-[#f6eedb]"
                }`}
              >
                [{cat}]
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid (4 at once) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
          {displayedProjects.map((p, index) => (
            <div
              key={index}
              className="bg-[#fffdf9] border-[3px] border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              {/* Window Header */}
              <div
                className={`px-3 sm:px-4 py-2 border-b-[3px] border-black flex items-center justify-between gap-2 select-none ${p.headerBgClass}`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 bg-black rounded-none shrink-0"></span>
                  <span className="font-mono text-xs font-bold text-black uppercase tracking-wider truncate">
                    {p.category}
                  </span>
                </div>
                <span className="font-mono text-xs bg-black text-white px-2 py-0.5 font-bold shrink-0">
                  {p.badge}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-black mb-1">
                    {p.title}
                  </h3>
                  <div className="font-mono text-xs font-bold text-[#d97706] mb-3">
                    {p.statsText}
                  </div>
                  <p className="font-mono text-xs sm:text-sm text-black/80 leading-relaxed mb-4">
                    {p.description}
                  </p>
                </div>

                <div>
                  {/* Tag Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-5">
                    {p.tags.map((tag, tIndex) => (
                      <span
                        key={tIndex}
                        className="px-2 py-0.5 bg-[#f6eedb] border border-black font-mono text-xs font-bold text-black"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-3 border-t-2 border-black/10">
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 sm:px-3.5 py-1.5 sm:py-2 bg-[#fde047] text-black font-mono text-xs font-bold border-2 border-black shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1"
                      >
                        <span>LIVE DEMO</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-black shrink-0" />
                      </a>
                    )}
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 sm:px-3.5 py-1.5 sm:py-2 bg-[#fffdf9] text-black font-mono text-xs font-bold border-2 border-black shadow-brutal-xs hover:bg-[#86efac] hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1"
                      >
                        <span>SOURCE CODE</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-black shrink-0" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* GitHub link note */}
        <div className="mt-6 sm:mt-8 p-3.5 sm:p-4 bg-[#fffdf9] border-2 border-black shadow-brutal-xs flex items-center justify-between flex-wrap gap-3 sm:gap-4 font-mono text-xs sm:text-sm font-bold">
          <span className="text-black/70">
            Looking for more tools, prototypes, and scripts?
          </span>
          <a
            href="https://github.com/Bittu5134?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#c4b5fd] border-2 border-black shadow-brutal-xs hover:shadow-brutal hover:-translate-y-0.5 transition-all flex items-center gap-1"
          >
            <span>VIEW 25+ REPOSITORIES ON GITHUB</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-black shrink-0" />
          </a>
        </div>

        {/* Patreon Support Banner */}
        <div className="mt-4 p-4 sm:p-6 bg-[#fef08a] border-[3px] border-black shadow-brutal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-black shrink-0" />
              <h3 className="font-pixel text-lg sm:text-xl font-bold text-black uppercase tracking-wide">
                SUPPORT ON PATREON: @lazybittu
              </h3>
            </div>
            <p className="font-mono text-xs sm:text-sm text-black/85 leading-relaxed">
              Enjoy my open-source tools, reverse-engineering work, and low-level systems tinkering? Consider becoming a patron to fuel future builds and infra costs.
            </p>
          </div>
          <a
            href="https://www.patreon.com/lazybittu"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-[#f472b6] text-black font-mono text-xs sm:text-sm font-black border-2 border-black shadow-brutal-xs hover:bg-[#fb7185] hover:shadow-brutal hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all shrink-0 flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-black fill-current shrink-0" />
            <span>BECOME A PATRON</span>
            <ArrowUpRight className="w-4 h-4 text-black shrink-0" />
          </a>
        </div>
      </div>
    </section>
  );
}
