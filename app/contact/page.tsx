import AlbumLayout from "@/components/local-ui/AlbumLayout";
import ContactFormSection from "@/components/sections/ContactFormSection";
import MusicHeardSection from "@/components/sections/MusicHeardSection";
import React from "react";

const ContactPage = () => {
  return (
    <div>
      <div
        className="bg-center bg-no-repeat bg-contain flex justify-between px-[10%] w-full mx-auto"
        style={{ backgroundImage: `url('/profit-bg.svg')` }}
      >
        <ContactFormSection />
        <AlbumLayout />
      </div>
      <MusicHeardSection
        heading="Send us your demo"
        subtext="Oscillation Records for the Artists."
      />
    </div>
  );
};

export default ContactPage;
