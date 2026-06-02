import MusicHeardSection from "@/components/sections/MusicHeardSection";
import NewMusicSection from "@/components/sections/NewMusicSection";
import ReleasesSection from "@/components/sections/ReleasesSection";
import ScrollReveal3D from "@/components/local-ui/ScrollReveal3D";
import React from "react";

export default function Releases() {
  return (
    <div>
      <ScrollReveal3D>
        <NewMusicSection />
      </ScrollReveal3D>
      <ScrollReveal3D>
        <ReleasesSection />
      </ScrollReveal3D>
      <ScrollReveal3D>
        <MusicHeardSection
          heading="Let's get your music heard."
          subtext="Artist, visionary, or just someone with big ideas? We're here to listen. Let's talk."
        />
      </ScrollReveal3D>
    </div>
  );
}