import AboutHeroSection from "@/components/sections/AboutHeroSection";
import AboutMoreSection from "@/components/sections/AboutMoreSection";
import AboutSection2 from "@/components/sections/AboutSection2";
import MusicHeardSection from "@/components/sections/MusicHeardSection";
import ScrollReveal3D from "@/components/local-ui/ScrollReveal3D";
import React from "react";

const AboutUs = () => {
  return (
    <div>
      <ScrollReveal3D>
        <AboutHeroSection />
      </ScrollReveal3D>
      <ScrollReveal3D>
        <AboutMoreSection />
      </ScrollReveal3D>
      <ScrollReveal3D>
        <AboutSection2 />
      </ScrollReveal3D>
      <ScrollReveal3D>
        <MusicHeardSection
          className="mt-24 sm:mt-32 md:mt-40"
          heading="Let’s get your music heard."
          subtext="Artist, visionary, or just someone with big ideas? We’re here to listen. Let’s talk."
        />
      </ScrollReveal3D>
    </div>
  );
};

export default AboutUs;
