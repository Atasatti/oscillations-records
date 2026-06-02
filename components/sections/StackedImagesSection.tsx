"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";

interface StackedImagesSectionProps {
  image1: string;
  image2: string;
  image3: string;
}

const StackedImagesSection = ({ image1, image2, image3 }: StackedImagesSectionProps) => {
  const unoptimized = (src: string) => src.startsWith("/");
  const stackRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rawTiltX = useTransform(mouseY, [-1, 1], [4, -4]);
  const rawTiltY = useTransform(mouseX, [-1, 1], [-4, 4]);
  const tiltX = useSpring(rawTiltX, { stiffness: 200, damping: 28 });
  const tiltY = useSpring(rawTiltY, { stiffness: 200, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stackRef.current) return;
    const rect = stackRef.current.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const springConfig = { type: "spring" as const, stiffness: 220, damping: 26 };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center md:items-start mx-auto gap-4 md:gap-0">
      <p className="w-full md:w-1/5 text-muted-foreground text-xs sm:text-sm text-center md:text-left">
        Turn up the feeling, let the music speak.
      </p>

      {/* Perspective container — owns the 3D scene for this stack */}
      <div
        ref={stackRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: "1000px" }}
        className="relative mt-6 h-[200px] w-[200px] sm:mt-6 sm:h-[300px] sm:w-[300px] md:mt-0 md:h-[500px] md:w-[500px] lg:h-[500px] lg:w-[500px] xl:h-[580px] xl:w-[580px] cursor-pointer"
      >
        {/* Tilt scene — rotates as a unit based on mouse position */}
        <motion.div
          className="relative w-full h-full"
          style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
        >
          {/* Image 3 — back card, fans further out on hover */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            initial={{ rotateZ: 9.26, translateZ: -20, zIndex: 10 }}
            animate={{
              rotateZ: isHovered ? 15 : 9.26,
              translateZ: isHovered ? -45 : -20,
            }}
            transition={springConfig}
          >
            <Image
              src={image3}
              width={580}
              height={580}
              alt="Hero image 3"
              unoptimized={unoptimized(image3)}
              className="rounded-[19px] w-full h-full object-cover"
            />
          </motion.div>

          {/* Image 2 — middle card, fans the other direction on hover */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            initial={{ rotateZ: -6.65, translateZ: 0, zIndex: 20 }}
            animate={{
              rotateZ: isHovered ? -12 : -6.65,
              translateZ: isHovered ? -15 : 0,
            }}
            transition={springConfig}
          >
            <Image
              src={image2}
              width={580}
              height={580}
              alt="Hero image 2"
              unoptimized={unoptimized(image2)}
              className="rounded-[19px] w-full h-full object-cover"
            />
          </motion.div>

          {/* Image 1 — front card, lifts toward the viewer on hover */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            initial={{ rotateZ: 0, translateZ: 20, zIndex: 30 }}
            animate={{
              translateZ: isHovered ? 60 : 20,
              scale: isHovered ? 1.03 : 1,
            }}
            transition={springConfig}
            style={{
              filter: isHovered
                ? "drop-shadow(0 30px 40px rgba(0,0,0,0.7))"
                : "drop-shadow(0 10px 20px rgba(0,0,0,0.4))",
            }}
          >
            <Image
              src={image1}
              width={580}
              height={580}
              alt="Hero image 1"
              unoptimized={unoptimized(image1)}
              className="rounded-[19px] w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="w-full md:w-1/5 hidden md:block" />
    </div>
  );
};

export default StackedImagesSection;
