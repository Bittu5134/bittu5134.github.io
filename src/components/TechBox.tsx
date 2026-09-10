interface TechBoxProps {
  src: string;
  name: string;
  isDragging?: boolean;
}

export default function TechBox({ src, name, isDragging = false }: TechBoxProps) {
  return (
    <div
      className={`rounded-xl scale-75 sm:scale-80 md:scale-85 w-36 md:w-40 h-24 md:h-28 text-white_smoke justify-around py-2 flex flex-col select-none transition-[background-color,border-color,box-shadow] duration-150 backdrop-blur-xs border ${
        isDragging
          ? "bg-white_smoke/30 shadow-xl shadow-argentinian_blue-400/40 border-argentinian_blue-400/70 ring-2 ring-argentinian_blue-400/50"
          : "bg-white_smoke/10 hover:bg-white_smoke/20 border-white/5 hover:border-white/15 shadow-sm"
      }`}
    >
      <img
        src={src}
        alt={name}
        draggable={false}
        className="h-10 md:h-12 mx-auto aspect-square select-none pointer-events-none"
      />
      <p className="text-center text-sm md:text-base font-semibold select-none pointer-events-none tracking-wide text-neutral-300">
        {name}
      </p>
    </div>
  );
}

