import React from "react";
import IconButton from "../local-ui/IconButton";
import StackedImagesSection from "./StackedImagesSection";

const HomeHeroSection = () => {
  return (
    <div
      className="bg-center bg-no-repeat px-4 sm:px-6 md:px-[10%] w-full mx-auto py-8 sm:py-12 md:py-14"
      style={{ backgroundImage: `url('/hero-bg.svg')` }}
    >
        <p className="text-muted-foreground uppercase text-xs sm:text-sm text-center font-[font-family:var(--font-inter)] tracking-wider">
          Real support for up-and-coming talent
        </p>
        <p className="text-3xl sm:text-[40px] md:text-[64px] text-center leading-none font-light opacity-90 tracking-tighter mt-4 sm:mt-5">
          A Record Label That
        </p>
        <p className="text-3xl sm:text-[40px] md:text-[64px] text-center leading-none font-extrabold mt-2">
          Puts Artists First
        </p>
        <div className="flex justify-center items-center mt-8 sm:mt-12 md:mt-16">
          <IconButton text="Let's Work Together" />
        </div>
        <div className="my-12 sm:my-20 md:my-28">
            <StackedImagesSection/>
        </div>
    </div>
  );
};

export default HomeHeroSection;
