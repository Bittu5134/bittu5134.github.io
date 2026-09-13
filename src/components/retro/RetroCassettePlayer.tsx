import { useState, useRef, useEffect, useCallback } from "react";
import { Disc3, Play, Pause, SkipBack, SkipForward, Volume2, Minus } from "../icons";

const PLAYLIST_URL = "https://soundcloud.com/bittu-162282868/sets/portifolio";
const SC_WIDGET_API = "https://w.soundcloud.com/player/api.js";
const IFRAME_ID = "sc-cassette-player";

interface Track {
  title: string;
  artist: string;
}

const LOADING_TRACK: Track = { title: "LOADING...", artist: "SoundCloud" };

export default function RetroCassettePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [tracks, setTracks] = useState<Track[]>([LOADING_TRACK]);
  const [volume, setVolume] = useState(0.3);
  const [minimized, setMinimized] = useState(() => {
    return typeof window !== "undefined" && window.innerWidth < 640;
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<SCWidget | null>(null);

  // Inject the SoundCloud Widget API script once and initialise the widget
  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    const initWidget = () => {
      if (!iframeRef.current || !window.SC) return;

      const widget = window.SC.Widget(iframeRef.current);
      widgetRef.current = widget;

      widget.bind(window.SC.Widget.Events.READY, () => {
        setWidgetReady(true);
        widget.setVolume(volume * 100);

        widget.getSounds((sounds) => {
          if (sounds && sounds.length > 0) {
            setTracks(
              sounds.map((s) => ({
                title: s.title,
                artist: s.user?.username ?? "Unknown",
              }))
            );
          }
        });
      });

      widget.bind(window.SC.Widget.Events.PLAY, () => {
        setIsPlaying(true);
        widget.getCurrentSoundIndex((idx) => setCurrentTrackIndex(idx));
      });

      widget.bind(window.SC.Widget.Events.PAUSE, () => setIsPlaying(false));

      widget.bind(window.SC.Widget.Events.FINISH, () => {
        widget.getCurrentSoundIndex((idx) => {
          const next = (idx + 1) % tracks.length;
          setCurrentTrackIndex(next);
        });
      });
    };

    if (document.querySelector(`script[src="${SC_WIDGET_API}"]`)) {
      // Script already loaded (e.g. HMR)
      initWidget();
    } else {
      script = document.createElement("script");
      script.src = SC_WIDGET_API;
      script.async = true;
      script.onload = initWidget;
      document.body.appendChild(script);
    }

    return () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync volume changes to widget after it's ready
  useEffect(() => {
    if (widgetReady && widgetRef.current) {
      widgetRef.current.setVolume(volume * 100);
    }
  }, [volume, widgetReady]);

  const togglePlay = useCallback(() => {
    if (!widgetReady || !widgetRef.current) return;
    if (isPlaying) {
      widgetRef.current.pause();
    } else {
      widgetRef.current.play();
    }
  }, [isPlaying, widgetReady]);

  const nextTrack = useCallback(() => {
    if (!widgetReady || !widgetRef.current) return;
    widgetRef.current.next();
  }, [widgetReady]);

  const prevTrack = useCallback(() => {
    if (!widgetReady || !widgetRef.current) return;
    widgetRef.current.prev();
  }, [widgetReady]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const currentTrack = tracks[currentTrackIndex] ?? LOADING_TRACK;
  const trackTotal = tracks.length;
  // Pad single-digit numbers: 01, 02 … 09, 10, 11 …
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 select-none max-w-[calc(100vw-24px)]">
      {/* Hidden SoundCloud Widget iframe — audio engine */}
      <iframe
        id={IFRAME_ID}
        ref={iframeRef}
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(PLAYLIST_URL)}&auto_play=false&buying=false&sharing=false&download=false&show_artwork=false&show_playcount=false&show_user=false&single_active=true`}
        style={{ display: "none", width: 0, height: 0, border: 0 }}
        allow="autoplay"
        title="SoundCloud Player"
      />

      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          aria-label="Open cassette player"
          className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#fde047] text-black font-mono text-xs font-bold border-2 border-black shadow-brutal flex items-center gap-1.5 sm:gap-2 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
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
            <button
              onClick={() => setMinimized(true)}
              aria-label="Minimize cassette player"
              className="font-mono text-xs font-bold px-1.5 py-0.5 bg-black text-white hover:bg-red-500 flex items-center justify-center cursor-pointer"
            >
              <Minus className="w-3 h-3 stroke-[3]" />
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
                  {isPlaying ? "▶ " : "■ "}
                  {currentTrack.title} - {currentTrack.artist}
                </span>
                <span className="font-pixel text-xs text-[#fde047] shrink-0 ml-1">
                  {pad(currentTrackIndex + 1)}/{pad(trackTotal)}
                </span>
              </div>
            </div>

            {/* Physical Push Buttons */}
            <div className="grid grid-cols-4 gap-1.5 mb-2.5">
              <button
                onClick={prevTrack}
                disabled={!widgetReady}
                aria-label="Previous track"
                className="py-1.5 bg-[#fffdf9] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs hover:bg-[#c4b5fd] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Previous Track"
              >
                <SkipBack className="w-3.5 h-3.5 fill-current" />
              </button>

              <button
                onClick={togglePlay}
                disabled={!widgetReady}
                aria-label={isPlaying ? "Pause tape" : "Play tape"}
                className={`py-1.5 col-span-2 border-2 border-black font-mono text-xs font-bold shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
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
                    <span>{widgetReady ? "PLAY" : "..."}</span>
                  </>
                )}
              </button>

              <button
                onClick={nextTrack}
                disabled={!widgetReady}
                aria-label="Next track"
                className="py-1.5 bg-[#fffdf9] border-2 border-black font-mono text-xs font-bold shadow-brutal-xs hover:bg-[#c4b5fd] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
                step="0.05"
                value={volume}
                aria-label="Volume slider"
                onChange={handleVolumeChange}
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
