import RetroHeader from "../components/retro/RetroHeader";
import RetroTicker from "../components/retro/RetroTicker";
import RetroHero from "../components/retro/RetroHero";
import RetroBadgeWall from "../components/retro/RetroBadgeWall";
import RetroProjects from "../components/retro/RetroProjects";
import RetroTechLab from "../components/retro/RetroTechLab";
import RetroZine from "../components/retro/RetroZine";
import RetroAbout from "../components/retro/RetroAbout";
import RetroContact from "../components/retro/RetroContact";
import RetroFooter from "../components/retro/RetroFooter";
import RetroCassettePlayer from "../components/retro/RetroCassettePlayer";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f6eedb] retro-dots-bg text-[#14161f] font-sans selection:bg-[#fde047] selection:text-black">
      {/* Top Retro Header */}
      <RetroHeader />

      {/* Retro Continuous Marquee Ticker */}
      <RetroTicker />

      {/* Main Content Area */}
      <main className="space-y-6 pt-4">
        <RetroHero />
        <RetroBadgeWall />
        <RetroProjects />
        <RetroTechLab />
        <RetroZine />
        <RetroAbout />
        <RetroContact />
      </main>

      {/* Footer */}
      <RetroFooter />

      {/* Interactive Cassette Lo-Fi Deck Widget */}
      <RetroCassettePlayer />
    </div>
  );
}
