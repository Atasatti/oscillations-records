import Image from "next/image";
import React from "react";

const StackedImagesSection = () => {
  return (
    <div className="flex justify-between mx-auto">
        <p className="w-1/5 text-muted-foreground text-sm">Pain has been top charted, listen to the new single by <span className="font-black text-white opacity-90">Ryan Jones.</span></p>
      <div className="relative h-[580px] w-[580px]">
        <Image
        src="/hero-img3.svg"
        width={580}
        height={580}
        alt="Hero image 3"
        className="absolute top-0 left-0 rotate-[9.26deg] z-10 rounded-[19px]"
      />
      <Image
        src="/hero-img2.svg"
        width={580}
        height={580}
        alt="Hero image 2"
        className="absolute top-0 left-0 rotate-[-6.65deg] z-20 rounded-[19px]"
      />
      <Image
        src="/hero-img1.svg"
        width={580}
        height={580}
        alt="Hero image 1"
        className="absolute top-0 left-0 z-30 rounded-[19px]"
      />
      </div>
      <div className="w-1/5"></div>
    </div>
  );
};

export default StackedImagesSection;
