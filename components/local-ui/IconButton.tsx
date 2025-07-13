"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React from "react";
import classNames from "classnames";

interface IconButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  text,
  onClick,
  className,
}) => {
  return (
    <div
      className={classNames(
        "flex items-center bg-white rounded-full overflow-hidden shadow-md p-1.5 cursor-pointer",
        className
      )}
    >
      <span className="px-3 font-semibold text-black !text-sm md:text-base uppercase">
        {text}
      </span>

      <Button
        onClick={onClick}
        size="icon"
        className="bg-black text-white rounded-2xl h-8 w-10 hover:bg-neutral-800 transition-colors cursor-pointer"
      >
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default IconButton;
