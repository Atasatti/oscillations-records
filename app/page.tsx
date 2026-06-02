import Navbar from "@/components/local-ui/Navbar";
import HomeHeroSection from "@/components/sections/HomeHeroSection";
import MeetArtistSection from "@/components/sections/MeetArtistSection";
import MusicHeardSection from "@/components/sections/MusicHeardSection";
import NewMusicSection from "@/components/sections/NewMusicSection";
import NoProfitSection from "@/components/sections/NoProfitSection";
import UpcomingReleasesSection from "@/components/sections/UpcomingReleasesSection";
import Footer from "@/components/local-ui/Footer";
import ScrollReveal3D from "@/components/local-ui/ScrollReveal3D";

export default function Home() {
  return (
    <div>
      <Navbar />
      {/* HomeHeroSection has its own 3D entrance — no wrapper needed */}
      <HomeHeroSection />
      <ScrollReveal3D>
        <NoProfitSection />
      </ScrollReveal3D>
      <ScrollReveal3D>
        <UpcomingReleasesSection />
      </ScrollReveal3D>
      <ScrollReveal3D>
        <NewMusicSection />
      </ScrollReveal3D>
      <ScrollReveal3D>
        <MeetArtistSection />
      </ScrollReveal3D>
      <ScrollReveal3D>
        <MusicHeardSection
          heading="Let's get your music heard."
          subtext="Artist, visionary, or just someone with big ideas? We're here to listen. Let's talk. "
        />
      </ScrollReveal3D>
      <Footer />
    </div>
  );
} 