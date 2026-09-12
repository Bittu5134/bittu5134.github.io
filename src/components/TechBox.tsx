interface TechBoxProps {
  src: string;
  name: string;
  isDragging?: boolean;
}

export default function TechBox({ src, name, isDragging = false }: TechBoxProps) {
  return (
    <div
      className={`px-3.5 py-2 md:px-4 md:py-2.5 rounded-xl text-xs md:text-sm font-medium tracking-wide flex items-center gap-2.5 select-none transition-all duration-200 shadow-md backdrop-blur-md border ${
        isDragging
          ? "bg-[#151d36] text-amber_glow border-amber_glow shadow-xl shadow-amber_glow/30 scale-110 ring-2 ring-amber_glow/40"
          : "bg-[#0d1222]/85 text-cream hover:text-amber_glow border-white/10 hover:border-cyan-400/40 hover:bg-[#121a30] shadow-black/40 hover:shadow-cyan-500/20"
      }`}
    >
      <img
        src={src}
        alt={name}
        draggable={false}
        className="h-4 w-4 md:h-5 md:w-5 aspect-square select-none pointer-events-none drop-shadow-sm"
      />
      <span className="select-none pointer-events-none lowercase font-mono font-medium">
        {name}
      </span>
    </div>
  );
}

