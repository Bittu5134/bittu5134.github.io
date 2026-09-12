import { useEffect, useRef, useState } from "react";

/* ─────────────────────────── types ─────────────────────────── */
interface Stat {
  /** Numeric target (null for non-numeric display values) */
  target: number | null;
  /** Text rendered when non-numeric */
  display?: string;
  /** Suffix appended after the number (e.g. "+" or "M+") */
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  { target: 4,    suffix: "+",   label: "of Engineering & Systems Craft" },
  { target: 25,   suffix: "+",   label: "Shipped & Open Sourced" },
  { target: 10,   suffix: "M+",  label: "Served (ORV-Reader monthly)" },
  { target: null, display: "IITK '30", suffix: "", label: "Cybersecurity & Computing" },
];

/* ─────────────────────── easing utility ─────────────────────── */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/* ─────────────────────── count-up hook ─────────────────────── */
function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (target === 0) { setValue(0); return; }

    let startTime: number | null = null;
    let raf: number;

    const tick = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.round(easeOut(progress) * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

/* ─────────────────────── stat cell ─────────────────────────── */
interface StatCellProps {
  stat: Stat;
  active: boolean;
  col: number;
  row: number;
}

function StatCell({ stat, active, col, row }: StatCellProps) {
  const counted = useCountUp(stat.target ?? 0, 1500, active && stat.target !== null);

  // Right divider: left-column in mobile 2-col grid, and first 3 in desktop 4-col
  const mobileRightDivider = col % 2 === 0;
  // Bottom divider: first row in mobile
  const mobileBottomDivider = row === 0;
  // Desktop right divider: first 3 cells
  const desktopRightDivider = col < 3;

  return (
    <div
      className={[
        "relative p-6 md:p-8 flex flex-col justify-center group",
        "transition-colors duration-300",
        // Amber top-line accent on hover
        "before:absolute before:inset-x-6 before:top-0 before:h-px",
        "before:bg-amber_glow/0 before:transition-all before:duration-300",
        "hover:before:bg-amber_glow/50",
        // Mobile dividers
        mobileRightDivider ? "border-r border-white/10" : "",
        mobileBottomDivider ? "border-b border-white/10" : "",
        // Desktop overrides: remove mobile right border, add desktop right border on first 3
        desktopRightDivider
          ? "md:border-r md:border-white/10"
          : "md:border-r-0",
        // Remove bottom border on desktop
        "md:border-b-0",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Number row */}
      <div className="flex items-baseline gap-0.5 mb-2">
        {stat.target !== null ? (
          <>
            <span className="font-black text-5xl md:text-6xl text-cream font-mono leading-none tabular-nums">
              {counted}
            </span>
            <span className="font-black text-3xl md:text-4xl text-amber_glow font-mono leading-none">
              {stat.suffix}
            </span>
          </>
        ) : (
          <span
            className={[
              "font-black text-4xl md:text-5xl text-cream font-mono leading-none",
              "transition-opacity duration-700",
              active ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            {stat.display}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="text-sm text-cream/50 font-normal leading-relaxed">
        {stat.label}
      </p>
    </div>
  );
}

/* ─────────────────────── main section ──────────────────────── */
export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats" className="py-16 px-6 md:px-10">
      {/* Section label */}
      <p className="text-xs font-mono text-amber_glow tracking-widest uppercase mb-6">
        — stats &amp; milestones
      </p>

      {/* Outer card */}
      <div
        ref={sectionRef}
        className="bg-[#0b0e17]/80 border border-white/10 rounded-3xl relative overflow-hidden"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse at 20% 50%, rgba(244,154,96,0.05) 0%, transparent 60%)",
            "radial-gradient(ellipse at 80% 20%, rgba(53,167,255,0.04) 0%, transparent 50%)",
          ].join(", "),
        }}
      >
        {/* 2×2 on mobile, 4-col on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <StatCell
              key={i}
              stat={stat}
              active={active}
              col={i}
              row={Math.floor(i / 2)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
