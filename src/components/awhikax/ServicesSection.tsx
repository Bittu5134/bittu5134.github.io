/* ─────────────────────────────────────────────────────────────
   ServicesSection — "What I Build" capabilities grid
   ───────────────────────────────────────────────────────────── */

interface Service {
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

const SERVICES: Service[] = [
  {
    icon: "⚙️",
    title: "Low-Level Systems",
    description:
      "Go daemons, memory-mapped I/O, Linux kernel APIs, eBPF-adjacent network hooks, raw socket programming",
    tags: ["Go", "C", "Linux", "Sockets"],
  },
  {
    icon: "🔗",
    title: "WebRTC & Peer-to-Peer",
    description:
      "NAT traversal, SDP/ICE signaling servers, distributed mesh chunk-streaming, 0% packet loss at 500 concurrent peers",
    tags: ["WebRTC", "Go", "Redis", "UDP"],
  },
  {
    icon: "🟩",
    title: "Minecraft Protocol",
    description:
      "Custom Fabric mods, network packet reverse-engineering, VarInt wire-format parsing, high-performance datapack tooling",
    tags: ["Java", "C++", "Protocol", "Fabric"],
  },
  {
    icon: "🧠",
    title: "AI Vision & Spatial AI",
    description:
      "PyTorch ensemble models, YOLO object detection, manga speech bubble segmentation, coordinate geometry PDF parsing",
    tags: ["PyTorch", "Python", "YOLO", "PDF"],
  },
  {
    icon: "☁️",
    title: "Cloud & Backend APIs",
    description:
      "FastAPI, async task queues, Redis caching, Docker Compose, Cloudflare Workers, SSE real-time streams",
    tags: ["FastAPI", "Redis", "Docker", "CF"],
  },
  {
    icon: "✦",
    title: "Interactive Web & Canvas",
    description:
      "React with physics simulations, procedural Canvas/WebGL rendering, custom game loops, ambient audio experiences",
    tags: ["React", "Canvas", "Tailwind", "TypeScript"],
  },
];

/* ─────────────────────── service card ──────────────────────── */
function ServiceCard({ service }: { service: Service }) {
  return (
    <div
      className={[
        "bg-[#0b0e17] border border-white/10 rounded-2xl p-6",
        "hover:border-amber_glow/30 hover:-translate-y-1",
        "hover:shadow-[0_0_60px_-20px_rgba(244,154,96,0.15)]",
        "transition-all duration-300 group cursor-default",
        "flex flex-col",
      ].join(" ")}
    >
      {/* Icon box */}
      <div
        className={[
          "w-11 h-11 rounded-xl shrink-0",
          "bg-[#080b12] border border-white/10",
          "flex items-center justify-center mb-4",
        ].join(" ")}
        aria-hidden="true"
      >
        <span className="text-2xl leading-none select-none">{service.icon}</span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-cream group-hover:text-amber_glow transition-colors duration-300">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-cream/60 leading-relaxed mt-2 flex-1">
        {service.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-4">
        {service.tags.map((tag) => (
          <span
            key={tag}
            className={[
              "text-xs font-mono",
              "bg-[#080b12] border border-white/10",
              "text-cream/40 px-2 py-0.5 rounded-full",
            ].join(" ")}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── main section ──────────────────────── */
export default function ServicesSection() {
  return (
    <section id="services" className="py-24 px-6 md:px-10">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-mono text-amber_glow tracking-widest uppercase mb-3">
          — capabilities
        </p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-cream leading-tight">
          What I Build
        </h2>
      </div>

      {/* Responsive grid: 1 col → 2 col → 3 col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.map((service) => (
          <ServiceCard key={service.title} service={service} />
        ))}
      </div>
    </section>
  );
}
