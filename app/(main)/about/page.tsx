import AboutHeroSection from "@/components/sections/AboutHeroSection";
import AboutSection2 from "@/components/sections/AboutSection2";
import MusicHeardSection from "@/components/sections/MusicHeardSection";
import React from "react";

const AboutUs = () => {
  return (
    <div>
      <AboutHeroSection/>
      <AboutSection2/>
      <MusicHeardSection
      className="mt-40"
        heading="Let’s get your music heard."
        subtext="Artist, visionary, or just someone with big ideas? We’re here to listen. Let’s talk."
      />
    </div>
  );
};

export default AboutUs;
