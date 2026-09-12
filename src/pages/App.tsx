import RetroHeader from "../components/retro/RetroHeader";
import RetroHero from "../components/retro/RetroHero";
import RetroTicker from "../components/retro/RetroTicker";
import RetroProjects from "../components/retro/RetroProjects";
import RetroZine from "../components/retro/RetroZine";
import RetroAbout from "../components/retro/RetroAbout";
import RetroContact from "../components/retro/RetroContact";
import RetroFooter from "../components/retro/RetroFooter";
import RetroCassettePlayer from "../components/retro/RetroCassettePlayer";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f6eedb] retro-dots-bg text-[#14161f] font-sans selection:bg-[#fde047] selection:text-black overflow-x-hidden">
      {/* Top Header with Hamburger Navigation for Mobile */}
      <RetroHeader />

      {/* Main Content Area */}
      <main className="space-y-4 pt-2">
        {/* Hero Section */}
        <RetroHero />

        {/* Tech Stack & Skills Marquee (moved right after Hero) */}
        <RetroTicker />

        {/* Featured Projects */}
        <RetroProjects />

        {/* Technical Zine / Blog */}
        <RetroZine />

        {/* About Me & Milestones */}
        <RetroAbout />

        {/* Contact */}
        <RetroContact />
      </main>

      {/* Footer */}
      <RetroFooter />

      {/* Lo-Fi Cassette Player */}
      <RetroCassettePlayer />
    </div>
  );
}
