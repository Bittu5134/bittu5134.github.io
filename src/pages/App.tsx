import Header from "../components/awhikax/Header";
import HeroSection from "../components/awhikax/HeroSection";
import StatsSection from "../components/awhikax/StatsSection";
import ServicesSection from "../components/awhikax/ServicesSection";
import ExperienceSection from "../components/awhikax/ExperienceSection";
import ProjectsSection from "../components/awhikax/ProjectsSection";
import AboutSection from "../components/awhikax/AboutSection";
import BlogSection from "../components/awhikax/BlogSection";
import ContactSection from "../components/awhikax/ContactSection";
import Footer from "../components/awhikax/Footer";
import AudioPlayer from "../components/AudioPlayer";

export default function App() {
  return (
    <div className="bg-[#080b12] text-[#f5ede3] overflow-x-hidden relative min-h-screen">
      {/* Floating navbar */}
      <Header />

      {/* Subtle radial ambient glows in the background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-[#f49a60]/[0.025] blur-[120px] rounded-full" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[400px] bg-[#35a7ff]/[0.02] blur-[100px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#9b9fed]/[0.015] blur-[140px] rounded-full" />
      </div>

      {/* Main content - all sections */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <ExperienceSection />
        <ProjectsSection />
        <AboutSection />
        <BlogSection />
        <ContactSection />
      </main>

      <Footer />

      {/* Ambient audio player widget */}
      <AudioPlayer />
    </div>
  );
}
