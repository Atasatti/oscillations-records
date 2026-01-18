import Image from "next/image";
import React from "react";

const StackedImagesSection = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center md:items-start mx-auto gap-4 md:gap-0">
        <p className="w-full md:w-1/5 text-muted-foreground text-xs sm:text-sm text-center md:text-left">Pain has been top charted, listen to the new single by <span className="font-black text-white opacity-90">Ryan Jones.</span></p>
      <div className="relative mt-10 h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] md:mt-0 md:h-[500px] md:w-[500px] lg:h-[500px] lg:w-[500px] xl:h-[580px] xl:w-[580px]">
        <Image
        src="/hero-img3.svg"
        width={580}
        height={580}
        alt="Hero image 3"
        className="absolute top-0 left-0 rotate-[9.26deg] z-10 rounded-[19px] w-full h-full object-cover"
      />
      <Image
        src="/hero-img2.svg"
        width={580}
        height={580}
        alt="Hero image 2"
        className="absolute top-0 left-0 rotate-[-6.65deg] z-20 rounded-[19px] w-full h-full object-cover"
      />
      <Image
        src="/hero-img1.svg"
        width={580}
        height={580}
        alt="Hero image 1"
        className="absolute top-0 left-0 z-30 rounded-[19px] w-full h-full object-cover"
      />
      </div>
      <div className="w-full md:w-1/5 hidden md:block"></div>
    </div>
  );
};

export default StackedImagesSection;
