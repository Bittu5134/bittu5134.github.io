import { ArrowLeft } from "../components/icons";

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-[#f6eedb] retro-dots-bg text-[#14161f] font-sans flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#fffdf9] border-[3px] border-black shadow-brutal p-6 sm:p-8 text-center relative grain">
        {/* Header Bar */}
        <div className="bg-[#fb7185] border-b-[3px] border-black -m-6 sm:-m-8 mb-6 p-2 flex items-center justify-between px-4">
          <span className="font-pixel text-lg text-black tracking-wider">ERROR 404</span>
          <span className="font-mono text-xs font-bold text-black uppercase">PAGE NOT FOUND</span>
        </div>

        <h1 className="text-7xl sm:text-8xl font-black font-mono tracking-tight text-black mb-2 select-none">
          404
        </h1>
        <div className="inline-block bg-[#fde047] border-2 border-black px-3 py-1 text-xs font-mono font-bold uppercase mb-4 shadow-brutal-sm">
          SIGNAL LOST IN THE MATRIX
        </div>
        <p className="font-mono text-sm text-[#4b5563] mb-6 leading-relaxed">
          Looks like you wandered off the map. This cassette tape is blank or was never recorded.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-[#4ade80] hover:bg-[#22c55e] text-black font-mono font-bold px-6 py-3 border-2 border-black shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-sm uppercase"
        >
          <ArrowLeft size={16} />
          Return to Deck
        </a>
      </div>
    </div>
  );
}
