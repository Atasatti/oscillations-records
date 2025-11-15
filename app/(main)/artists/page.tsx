import ArtistsSection from "@/components/sections/ArtistsSection";
import MeetArtistSection from "@/components/sections/MeetArtistSection";
import MusicHeardSection from "@/components/sections/MusicHeardSection";
import React from "react";

const Artists = () => {
  return (
    <div>
      <MeetArtistSection />
      <ArtistsSection />
      <MusicHeardSection
        heading="Let’s get your music heard."
        subtext="Artist, visionary, or just someone with big ideas? We’re here to listen. Let’s talk."
      />
    </div>
  );
};

export default Artists;
