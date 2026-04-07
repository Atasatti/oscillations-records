"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import classNames from "classnames";

interface IconButtonProps {
  text: string;
  onClick?: () => void;
  /** When set, the whole control is a Next.js link (preferred over wrapping in `<Link>`). */
  href?: string;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  text,
  onClick,
  href,
  className,
}) => {
  const shellClass = classNames(
    "inline-flex items-center bg-white rounded-full overflow-hidden shadow-md p-1.5 cursor-pointer transition-opacity hover:opacity-95",
    className
  );

  const label = (
    <span className="px-3 font-semibold text-black !text-sm md:text-base uppercase">
      {text}
    </span>
  );

  const arrow = href ? (
    <span className="flex h-8 w-10 shrink-0 items-center justify-center rounded-2xl bg-black text-white">
      <ArrowRight className="h-5 w-5" aria-hidden />
    </span>
  ) : (
    <Button
      onClick={onClick}
      size="icon"
      className="bg-black text-white rounded-2xl h-8 w-10 hover:bg-neutral-800 transition-colors cursor-pointer"
    >
      <ArrowRight className="h-5 w-5" />
    </Button>
  );

  if (href) {
    return (
      <Link href={href} className={shellClass}>
        {label}
        {arrow}
      </Link>
    );
  }

  return (
    <div className={shellClass}>
      {label}
      {arrow}
    </div>
  );
};

export default IconButton;
