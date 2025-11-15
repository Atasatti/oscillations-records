import MusicHeardSection from "@/components/sections/MusicHeardSection";
import NewMusicSection from "@/components/sections/NewMusicSection";
import ReleasesSection from "@/components/sections/ReleasesSection";
import React from "react";

export default function Releases() {
  return (
    <div>
      <NewMusicSection />
      <ReleasesSection />
      <MusicHeardSection
        heading="Let's get your music heard."
        subtext="Artist, visionary, or just someone with big ideas? We're here to listen. Let's talk."
      />
    </div>
  );
}