"use client";
import React from "react";
import IconInput from "../local-ui/IconInput";
import { ArrowRight } from "lucide-react";
import clsx from "clsx"; // optional: use clsx for cleaner conditional classes

interface MusicHeardSectionProps {
  heading: string;
  subtext: string;
  className?: string; // optional className prop
}

const MusicHeardSection: React.FC<MusicHeardSectionProps> = ({
  heading,
  subtext,
  className,
}) => {
  return (
    <div
      className={clsx(
        "bg-center bg-no-repeat px-[10%] w-full mx-auto py-28",
        className
      )}
      style={{ backgroundImage: `url('/music-heard-bg.svg')` }}
    >
      <p className="font-light text-5xl opacity-90 text-center tracking-tighter">
        {heading}
      </p>
      <p className="text-muted-foreground text-lg text-center mt-3 opacity-50 font-light">
        {subtext}
      </p>
      <div className="flex justify-center mt-16">
        <IconInput
          placeholder="enter your email"
          icon={ArrowRight}
          className="max-w-80 w-full"
        />
      </div>
    </div>
  );
};

export default MusicHeardSection;
