import ArtistsSection from "@/components/sections/ArtistsSection";
import MeetArtistSection from "@/components/sections/MeetArtistSection";
import MusicHeardSection from "@/components/sections/MusicHeardSection";
import ScrollReveal3D from "@/components/local-ui/ScrollReveal3D";
import React from "react";

const Artists = () => {
  return (
    <div>
      <ScrollReveal3D>
        <MeetArtistSection variant="artists" />
      </ScrollReveal3D>
      <ScrollReveal3D>
        <ArtistsSection />
      </ScrollReveal3D>
      <ScrollReveal3D>
        <MusicHeardSection
          heading="Let’s get your music heard."
          subtext="Artist, visionary, or just someone with big ideas? We’re here to listen. Let’s talk."
        />
      </ScrollReveal3D>
    </div>
  );
};

export default Artists;
