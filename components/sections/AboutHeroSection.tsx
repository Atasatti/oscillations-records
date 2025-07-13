import Image from "next/image";
import React from "react";

const AboutHeroSection = () => {
  return (
    <div
      className="bg-center bg-no-repeat px-[10%] w-full mx-auto py-14"
      style={{ backgroundImage: `url('/hero-bg.svg')` }}
    >
      <p className="text-center uppercase text-muted-foreground text-xl tracking-widest font-light">
        About Us
      </p>
      <div className="text-center mt-4">
        {/* First line */}
        <h1 className="text-5xl font-bold leading-tight">
          Oscillation Records: Built for
        </h1>

        {/* Second line with embedded vinyl record */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-gray-500 text-5xl font-bold">Artists,</span>

          <div className="relative w-15 h-15 md:w-20 md:h-20 lg:w-24 lg:h-24">
            <Image
              src="/record-disk.svg"
              alt="Vinyl Record"
              fill
              className="object-contain mt-2"
            />
          </div>

          <span className="text-5xl font-bold">Not Profit.</span>
        </div>
      </div>

      <Image
        src={"about-hero-img.svg"}
        alt="hero"
        width={300}
        height={200}
        className="mx-auto mt-14"
      />
    </div>
  );
};

export default AboutHeroSection;
