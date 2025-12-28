"use client";
import HomeHeroSection from "@/components/sections/HomeHeroSection";
import MeetArtistSection from "@/components/sections/MeetArtistSection";
import MusicHeardSection from "@/components/sections/MusicHeardSection";
import NewMusicSection from "@/components/sections/NewMusicSection";
import NoProfitSection from "@/components/sections/NoProfitSection";

export default function Home() {
  return (
    <>
      <HomeHeroSection />
      <NoProfitSection />
      <NewMusicSection />
      <MeetArtistSection />
      <MusicHeardSection
        heading="Let’s get your music heard."
        subtext="Artist, visionary, or just someone with big ideas? We’re here to listen. Let’s talk."
      />
    </>
  );
}
