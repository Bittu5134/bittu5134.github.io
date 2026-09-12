import { useState, useRef, useEffect } from "react";
import { SkipBack, Play, Pause, SkipForward, Volume2 } from "lucide-react";

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

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.25);
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

  const previousTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play().catch(() => {});
      }, 50);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className="fixed bottom-8 right-8 bg-[#0e1322]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-cyan-500/30 z-50 shadow-xl w-[210px] animate-fadeIn transition-colors">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleTrackEnd}
        loop={false}
      />

      <div className="text-xs mb-2 overflow-hidden whitespace-nowrap relative group font-mono">
        <div className="relative inline-block group/text">
          <div
            className={`inline-block mb-0.5 text-cream font-medium ${
              currentTrack.title.length + currentTrack.artist.length > 14
                ? "animate-scrollText"
                : ""
            }`}
          >
            {currentTrack.title}{" "}
            <span className="text-cream/50 font-normal"> - {currentTrack.artist}</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-argentinian_blue origin-left transform scale-x-0 transition-transform duration-300 group-hover/text:scale-x-100" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-1">
        <button
          onClick={previousTrack}
          className="text-cream/70 hover:text-argentinian_blue transition-all duration-200 p-1.5 rounded-lg hover:bg-cream/5 active:bg-cream/10"
          aria-label="Previous track"
        >
          <SkipBack size={18} />
        </button>

        <button
          onClick={togglePlay}
          className="text-cream hover:text-argentinian_blue transition-all duration-200 p-1.5 rounded-lg hover:bg-cream/5 active:bg-cream/10"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <button
          onClick={nextTrack}
          className="text-cream/70 hover:text-argentinian_blue transition-all duration-200 p-1.5 rounded-lg hover:bg-cream/5 active:bg-cream/10"
          aria-label="Next track"
        >
          <SkipForward size={18} />
        </button>

        <div className="relative group">
          <button 
            className="text-cream/70 hover:text-argentinian_blue transition-all duration-200 p-1.5 rounded-lg hover:bg-cream/5 active:bg-cream/10"
            aria-label="Volume"
          >
            <Volume2 size={18} />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="absolute -top-16 left-1/2 -translate-x-1/2 w-24 -rotate-90 opacity-0 group-hover:opacity-100 transition-all duration-300
            appearance-none h-1 bg-cream/20 rounded-full cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cream [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:hover:bg-argentinian_blue [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200
            active:cursor-grabbing [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:active:scale-95 [&::-webkit-slider-thumb]:hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
}
