import Image from "next/image";
import React from "react";

const NoProfitSection = () => {
  return (
    <div
      className="bg-center bg-contain bg-no-repeat px-4 sm:px-6 md:px-[10%] w-full mx-auto mt-10 sm:mt-16 md:mt-20 pt-14 sm:pt-20 md:pt-28 pb-20 sm:pb-32 md:pb-40"
      style={{ backgroundImage: `url('/profit-bg.svg')` }}
    >
      <p className="font-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl opacity-90 text-center tracking-tighter">
        Oscillation Records: Built for
        <br /> <span className="font-normal opacity-35">Artists</span>, Not
        Profit.
      </p>
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-4 mt-12 sm:mt-16 md:mt-20 lg:mt-30">
        <div className="w-full md:w-1/3 order-2 md:order-1">
          <p className="text-xs sm:text-sm font-light text-muted-foreground mt-0 md:mt-5 text-center md:text-left">
            We&apos;re not a major label. We&apos;re a team of music lovers who believe in
            doing things differently. Based in Manchester but working globally,
            we focus on raw talent, smart marketing, and creating real
            opportunities for artists.
          </p>
        </div>
        <div className="order-1 md:order-2 flex-shrink-0">
          <Image
            src="/profit-img.svg"
            alt="No Profit Image"
            width={230}
            height={230}
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-[230px] lg:h-[230px]"
          />
        </div>
        <div className="w-full md:w-1/3 flex items-center md:items-end justify-center md:justify-end order-3">
          <p className="text-xs sm:text-sm font-light text-muted-foreground mt-0 md:mt-5 text-center md:text-right">
           No endless meetings. No BS. Just results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoProfitSection;
