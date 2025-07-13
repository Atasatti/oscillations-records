import Image from "next/image";
import React from "react";

const NoProfitSection = () => {
  return (
    <div
      className="bg-center bg-contain bg-no-repeat px-[10%] w-full mx-auto mt-20 pt-28 pb-40"
      style={{ backgroundImage: `url('/profit-bg.svg')` }}
    >
      <p className="font-light text-5xl opacity-90 text-center tracking-tighter">
        Oscillation Records: Built for
        <br /> <span className="font-normal opacity-35">Artists</span>, Not
        Profit.
      </p>
      <div className="flex justify-between mt-30">
        <div className="w-1/3">
          <p className="text-sm font-light text-muted-foreground mt-5">
            We’re not a major label. We’re a team of music lovers who believe in
            doing things differently. Based in Manchester but working globally,
            we focus on raw talent, smart marketing, and creating real
            opportunities for artists.
          </p>
        </div>
        <Image
          src="/profit-img.svg"
          alt="No Profit Image"
          width={230}
          height={230}
        />
        <div className="w-1/3 flex items-end justify-end">
        <p className="text-sm font-light text-muted-foreground mt-5">
           No endless meetings. No BS. Just results.
          </p></div>
      </div>
    </div>
  );
};

export default NoProfitSection;
