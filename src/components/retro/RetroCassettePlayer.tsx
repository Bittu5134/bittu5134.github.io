import { useState, useRef, useEffect } from "react";

interface Track {
  title: string;
  artist: string;
  url: string;
}

const tracks: Track[] = [
  {
    title: "Rainfall",
    artist: "Cozy Nordic",
    url: "/audio/rainfall.mp3",
  },
  {
    title: "Coastal Road",
    artist: "Mellow Fox",
    url: "/audio/coastal_road.mp3",
  },
  {
    title: "Easy Days",
    artist: "Kainbeats",
    url: "/audio/easy_days.mp3",
  },
  {
    title: "Peaceful Retreat",
    artist: "Mellow Fox",
    url: "/audio/peaceful_retreat.mp3",
  },
];

export default function RetroCassettePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [minimized, setMinimized] = useState(() => {
    return typeof window !== "undefined" && window.innerWidth < 640;
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play().catch(() => {});
      }, 50);
    }
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play().catch(() => {});
      }, 50);
    }
  };

  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 select-none max-w-[calc(100vw-24px)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={nextTrack}
        loop={false}
      />

      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          aria-label="Open cassette player"
          className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#fde047] text-black font-mono text-xs font-bold border-2 border-black shadow-brutal flex items-center gap-1.5 sm:gap-2 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
        >
          <span>📼 {isPlaying ? "PLAYING..." : "TAPE DECK"}</span>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        </button>
      ) : (
        <div className="w-[calc(100vw-24px)] sm:w-[280px] max-w-[280px] bg-[#fffdf9] border-[3px] border-black shadow-brutal-lg overflow-hidden">
          {/* Title Bar */}
          <div className="bg-[#fb923c] px-3 py-1.5 border-b-[2px] border-black flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-black flex items-center gap-1.5">
              <span>📼</span>
              <span>LO-FI CASSETTE DECK</span>
            </span>
            <button
              onClick={() => setMinimized(true)}
              aria-label="Minimize cassette player"
              className="font-mono text-xs font-bold px-1.5 py-0.5 bg-black text-white hover:bg-red-500"
            >
              _
            </button>
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
                  {isPlaying ? "▶ " : "■ "} {currentTrack.title} - {currentTrack.artist}
                </span>
                <span className="font-pixel text-xs text-[#fde047] shrink-0 ml-1">
                  0{currentTrackIndex + 1}/04
                </span>
              </div>
            </div>

            {/* Physical Push Buttons */}
            <div className="grid grid-cols-4 gap-1.5 mb-2.5">
              <button
                onClick={prevTrack}
                aria-label="Previous track"
                className="py-1.5 bg-[#fffdf9] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs hover:bg-[#c4b5fd] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                title="Previous Track"
              >
                ◄◄
              </button>

              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause tape" : "Play tape"}
                className={`py-1.5 col-span-2 border-2 border-black font-mono text-xs font-bold shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                  isPlaying
                    ? "bg-[#86efac] hover:bg-[#6ee7b7]"
                    : "bg-[#fde047] hover:bg-[#fb923c]"
                }`}
                title={isPlaying ? "Pause Tape" : "Play Tape"}
              >
                {isPlaying ? "❚❚ PAUSE" : "▶ PLAY"}
              </button>

              <button
                onClick={nextTrack}
                aria-label="Next track"
                className="py-1.5 bg-[#fffdf9] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs hover:bg-[#c4b5fd] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                title="Next Track"
              >
                ►►
              </button>
            </div>

            {/* Volume Slider Bar */}
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-black">
              <span>VOL:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                aria-label="Volume slider"
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-[#fb923c] h-2 bg-[#fffdf9] border border-black cursor-pointer"
              />
              <span>{Math.round(volume * 100)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
