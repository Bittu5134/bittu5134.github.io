/* eslint-disable react-refresh/only-export-components */
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  /** Convenience shorthand — sets both width and height on the <svg> element. */
  size?: number | string;
}

// ---------------------------------------------------------
// Custom Vector & Brand SVG Components
// ---------------------------------------------------------

export function DiscordIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function GithubIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function TwitterIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* X (formerly Twitter) logo — official proportions */}
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function PatreonIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Patreon: circle + vertical bar — official mark */}
      <path d="M15.386.5C10.828.5 7.121 4.207 7.121 8.765c0 4.516 3.707 8.222 8.265 8.222 4.515 0 8.221-3.706 8.221-8.222C23.607 4.207 19.901.5 15.386.5zM0 23.5h4.869V.5H0v23z" />
    </svg>
  );
}

/**
 * Minecraft creeper face — a pixel-art 4×4 grid face on a block.
 * Much more recognizable than the previous generic gamepad shape.
 *
 *  ┌──────────────────┐
 *  │  ██        ██    │  ← eyes (two dark squares)
 *  │      ████        │  ← nose top
 *  │    ██    ██      │  ← nose bottom + mouth corners
 *  │      ████        │  ← mouth center
 *  └──────────────────┘
 */
export function PlanetMinecraftIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Outer block face */}
      <rect x="0" y="0" width="16" height="16" rx="1" fill="currentColor" opacity="0.12" />
      {/* Left eye */}
      <rect x="2" y="3" width="4" height="3" />
      {/* Right eye */}
      <rect x="10" y="3" width="4" height="3" />
      {/* Nose (center column, 2 rows) */}
      <rect x="6" y="6" width="4" height="2" />
      {/* Mouth — outer wings */}
      <rect x="4" y="8" width="2" height="2" />
      <rect x="10" y="8" width="2" height="2" />
      {/* Mouth — center indent (gap created by background showing through) */}
      <rect x="4" y="10" width="8" height="2" />
    </svg>
  );
}

export function FloppyDiskIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* 3.5″ floppy: outer shell, shutter slot, label area, write-protect notch */}
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      {/* Storage coil window (lower center) */}
      <polyline points="17 21 17 13 7 13 7 21" />
      {/* Label ridge lines */}
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

export function PixelMonsterIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <path d="M0 0h512v512H0z" fill="none" />
      <path
        fill="currentColor"
        d="M0 0h169.847v172.501H0zm340.775 0h170.094v172.501H340.775zm0 172.502H169.847v85.915H84.785V512h85.062v-86.668h170.928V512h85.866V258.417h-85.866z"
      />
    </svg>
  );
}

// ---------------------------------------------------------
// Centralized Re-exports of Lucide Icons
// ---------------------------------------------------------

export {
  // Navigation & UI
  Menu,
  X,
  Minus,
  Folder,
  FileText,
  User,
  Mail,
  HardDrive,
  ExternalLink,
  BookOpen,
  Filter,
  Sparkles,
  Layers,
  Code,

  // Actions & Feedback
  Check,
  Copy,
  Share2,
  Heart,
  Coffee,
  Rss,

  // Directions
  ArrowUpRight,
  ArrowLeft,
  ArrowDown,
  ArrowRight,

  // Tech & Skills
  Terminal,
  Pickaxe,
  Cpu,
  Shield,
  GraduationCap,
  Gamepad2,
  Trophy,
  Medal,
  Zap,

  // Media / Tape Deck
  Disc3,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
