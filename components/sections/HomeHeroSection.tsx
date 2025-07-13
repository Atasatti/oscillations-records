import React from "react";
import IconButton from "../local-ui/IconButton";
import Image from "next/image";
import StackedImagesSection from "./StackedImagesSection";

const HomeHeroSection = () => {
  return (
    <div
      className="bg-center bg-no-repeat px-[10%] w-full mx-auto py-14"
      style={{ backgroundImage: `url('/hero-bg.svg')` }}
    >
        <p className="text-muted-foreground uppercase text-sm text-center font-[font-family:var(--font-inter)] tracking-wider">
          Real support for up-and-coming talent
        </p>
        <p className="text-[40px] md:text-[64px] text-center leading-none font-light opacity-90 tracking-tighter mt-5">
          A Record Label That
        </p>
        <p className="text-[40px] md:text-[64px] text-center leading-none font-extrabold mt-2">
          Puts Artists First
        </p>
        <div className="flex justify-center items-center mt-16">
          <IconButton text="Let’s Work Together" />
        </div>
        <div className="my-28">
            <StackedImagesSection/>
        </div>
    </div>
  );
};

export default HomeHeroSection;
