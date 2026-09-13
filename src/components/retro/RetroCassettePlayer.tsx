import { useState, useRef, useEffect, useCallback } from "react";
import { Disc3, Play, Pause, SkipBack, SkipForward, Volume2, Minus, ExternalLink } from "../icons";

const PLAYLIST_URL = "https://soundcloud.com/bittu-162282868/sets/portifolio";

interface Track {
  title: string;
  artist: string;
  url: string;
}

const TRACKS: Track[] = [
  {
    title: "Pigstep",
    artist: "Lena Raine",
    url: "/audio/pigstep.mp3",
  },
  {
    title: "MEGALOVANIA",
    artist: "Toby Fox",
    url: "/audio/megalovania.mp3",
  },
  {
    title: "Bad Apple!!",
    artist: "Masayoshi Minoshima ft. Nomico",
    url: "/audio/bad_apple.mp3",
  },
  {
    title: "Running in the 90's",
    artist: "Maurizio De Jorio",
    url: "/audio/running_in_the_90s.mp3",
  },
  {
    title: "Caramelldansen",
    artist: "Caramell",
    url: "/audio/caramelldansen.mp3",
  },
  {
    title: "Miku",
    artist: "Anamanaguchi",
    url: "/audio/miku.mp3",
  },
];

export default function RetroCassettePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.15);
  const [minimized, setMinimized] = useState(() => {
    return typeof window !== "undefined" && window.innerWidth < 640;
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex] || TRACKS[0];

  // Sync volume on change using acoustic/logarithmic curve (volume^2)
  useEffect(() => {
    if (audioRef.current) {
      // Human ear perceives loudness logarithmically; squaring the 0-1 input
      // ensures smooth, gentle low-volume background playback
      audioRef.current.volume = Math.min(1, Math.max(0, volume * volume));
    }
  }, [volume]);

  // Handle play/pause toggle
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Audio play prevented:", err);
        setIsPlaying(false);
      });
    }
  }, [isPlaying]);

  // Handle next track
  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => {
      const nextIndex = (prev + 1) % TRACKS.length;
      return nextIndex;
    });
  }, []);

  // Handle previous track
  const prevTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => {
      const nextIndex = (prev - 1 + TRACKS.length) % TRACKS.length;
      return nextIndex;
    });
  }, []);

  // Auto-play when track index changes if already playing
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn("Audio switch error:", err);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex, isPlaying]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 select-none max-w-[calc(100vw-24px)]">
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={nextTrack}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      />

      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          aria-label="Open cassette player"
          className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#fde047] text-black font-mono text-[11px] sm:text-xs font-bold border-2 border-black shadow-brutal flex items-center gap-1.5 sm:gap-2 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
        >
          <Disc3 className={`w-4 h-4 text-black ${isPlaying ? "animate-spin" : ""}`} />
          <span>{isPlaying ? "PLAYING..." : "TAPE DECK"}</span>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        </button>
      ) : (
        <div className="w-[calc(100vw-24px)] sm:w-[280px] max-w-[280px] bg-[#fffdf9] border-[3px] border-black shadow-brutal-lg overflow-hidden">
          {/* Title Bar */}
          <div className="bg-[#fb923c] px-3 py-1.5 border-b-[2px] border-black flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-black flex items-center gap-1.5">
              <Disc3 className={`w-3.5 h-3.5 text-black ${isPlaying ? "animate-spin" : ""}`} />
              <span>LO-FI CASSETTE DECK</span>
            </span>
            <div className="flex items-center gap-1.5">
              <a
                href={PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="View SoundCloud Playlist"
                aria-label="SoundCloud Playlist"
                className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-black text-white hover:bg-[#fde047] hover:text-black flex items-center gap-1 transition-colors"
              >
                <span>SC</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <button
                onClick={() => setMinimized(true)}
                aria-label="Minimize cassette player"
                className="font-mono text-xs font-bold px-1.5 py-0.5 bg-black text-white hover:bg-red-500 flex items-center justify-center cursor-pointer"
              >
                <Minus className="w-3 h-3 stroke-[3]" />
              </button>
            </div>
          </div>

          <div className="p-3 bg-[#f6eedb]">
            {/* Cassette Graphic with Spinning Wheels */}
            <div className="bg-[#12151e] p-2.5 border-2 border-black mb-2.5 rounded-sm relative overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-[#2a2f42] border border-[#475569] mb-1.5">
                {/* Left Spool */}
                <div
                  className={`w-6 h-6 rounded-full border-2 border-dashed border-[#fde047] flex items-center justify-center ${
                    isPlaying ? "animate-spinSlow" : ""
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-[#fde047]"></div>
                </div>

                {/* Tape Window */}
                <div className="flex-1 mx-3 h-3 bg-[#0f121d] border border-[#334155] relative flex items-center justify-center">
                  <div className="w-3/4 h-1 bg-[#d97706]/70"></div>
                </div>

                {/* Right Spool */}
                <div
                  className={`w-6 h-6 rounded-full border-2 border-dashed border-[#fde047] flex items-center justify-center ${
                    isPlaying ? "animate-spinSlow" : ""
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-[#fde047]"></div>
                </div>
              </div>

              {/* LCD Track Display */}
              <div className="bg-[#000000] px-2 py-1 border border-[#334155] flex items-center justify-between">
                <span className="font-pixel text-sm text-[#86efac] truncate tracking-wider">
                  {isPlaying ? "▶ " : "■ "}
                  {currentTrack.title} - {currentTrack.artist}
                </span>
                <span className="font-pixel text-xs text-[#fde047] shrink-0 ml-1">
                  {pad(currentTrackIndex + 1)}/{pad(TRACKS.length)}
                </span>
              </div>
            </div>

            {/* Physical Push Buttons */}
            <div className="grid grid-cols-4 gap-1.5 mb-2.5">
              <button
                onClick={prevTrack}
                aria-label="Previous track"
                className="py-1.5 bg-[#fffdf9] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs hover:bg-[#c4b5fd] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center cursor-pointer"
                title="Previous Track"
              >
                <SkipBack className="w-3.5 h-3.5 fill-current" />
              </button>

              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause tape" : "Play tape"}
                className={`py-1.5 col-span-2 border-2 border-black font-mono text-xs font-bold shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5 cursor-pointer ${
                  isPlaying
                    ? "bg-[#86efac] hover:bg-[#6ee7b7]"
                    : "bg-[#fde047] hover:bg-[#fb923c]"
                }`}
                title={isPlaying ? "Pause Tape" : "Play Tape"}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>PLAY</span>
                  </>
                )}
              </button>

              <button
                onClick={nextTrack}
                aria-label="Next track"
                className="py-1.5 bg-[#fffdf9] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs hover:bg-[#c4b5fd] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center cursor-pointer"
                title="Next Track"
              >
                <SkipForward className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>

            {/* Volume Slider Bar */}
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-black">
              <Volume2 className="w-3.5 h-3.5 shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                aria-label="Volume slider"
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-[#fb923c] h-2 bg-[#fffdf9] border border-black cursor-pointer"
              />
              <span className="shrink-0">{Math.round(volume * 100)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
