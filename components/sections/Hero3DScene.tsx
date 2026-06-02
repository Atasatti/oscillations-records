"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionTemplate,
} from "motion/react";
import IconButton from "@/components/local-ui/IconButton";
import StackedImagesSection from "@/components/sections/StackedImagesSection";

interface Hero3DSceneProps {
  image1: string;
  image2: string;
  image3: string;
}

export default function Hero3DScene({ image1, image2, image3 }: Hero3DSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rawRotateX = useTransform(mouseY, [-1, 1], [5, -5]);
  const rawRotateY = useTransform(mouseX, [-1, 1], [-5, 5]);
  const rotateX = useSpring(rawRotateX, { stiffness: 120, damping: 22 });
  const rotateY = useSpring(rawRotateY, { stiffness: 120, damping: 22 });

  const shadowX = useTransform(mouseX, [-1, 1], [12, -12]);
  const shadowY = useTransform(mouseY, [-1, 1], [-12, 12]);
  const cardShadow = useMotionTemplate`${shadowX}px ${shadowY}px 40px rgba(255,255,255,0.04)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-center bg-no-repeat px-4 sm:px-6 md:px-[10%] w-full mx-auto py-8 sm:py-12 md:py-14"
      style={{ backgroundImage: `url('/hero-bg.svg')`, perspective: "1200px" }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ rotateX: 8, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Subtitle — base layer */}
        <motion.p
          className="text-muted-foreground uppercase text-xs sm:text-sm text-center font-[font-family:var(--font-inter)] tracking-wider"
          style={{ translateZ: "0px" }}
        >
          Real support for up-and-coming talent
        </motion.p>

        {/* Main headings — mid layer */}
        <motion.div style={{ translateZ: "25px" }}>
          <p className="text-3xl sm:text-[40px] md:text-[64px] text-center leading-none font-light opacity-90 tracking-tighter mt-4 sm:mt-5">
            A Record Label That
          </p>
          <p className="text-3xl sm:text-[40px] md:text-[64px] text-center leading-none font-extrabold mt-2">
            Puts Artists First
          </p>
        </motion.div>

        {/* CTA button — front layer */}
        <motion.div
          className="flex justify-center items-center mt-8 sm:mt-12 md:mt-16"
          style={{ translateZ: "50px" }}
        >
          <IconButton text="Let's Work Together" />
        </motion.div>

        {/* Mission block — slight elevation */}
        <motion.div
          className="mt-10 sm:mt-14 md:mt-16 px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10"
          style={{ translateZ: "10px" }}
        >
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.24em] text-white/60 text-center">
            Our Mission
          </p>
          <p className="mt-3 text-center text-2xl sm:text-3xl md:text-5xl leading-tight font-semibold tracking-tight">
            Real support for emerging artists
            <span className="block text-white/80 font-light mt-1 sm:mt-2">
              from first draft to release day.
            </span>
          </p>
          <p className="mt-4 text-center text-sm sm:text-base text-white/70 max-w-3xl mx-auto">
            We help artists shape the sound, story, and strategy behind each
            drop — so every release lands with impact, not just uploads.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/contact"
              className="rounded-full border border-white bg-white px-4 py-2 text-[11px] sm:px-5 sm:text-xs font-semibold uppercase tracking-wide text-black transition hover:bg-white/90"
            >
              Submit Demo
            </Link>
            <Link
              href="/artists"
              className="rounded-full border border-white/30 px-4 py-2 text-[11px] sm:px-5 sm:text-xs font-semibold uppercase tracking-wide text-white transition hover:border-white/55 hover:bg-white/[0.06]"
            >
              Meet Artists
            </Link>
          </div>
        </motion.div>

        {/* Feature cards — elevated layer with dynamic shadow */}
        <motion.div
          className="px-5 sm:px-8 md:px-10"
          style={{ translateZ: "35px" }}
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Release Strategy",
                body: "Timing, sequencing, and launch planning tailored to your sound.",
              },
              {
                title: "Creative Direction",
                body: "Artwork, campaign visuals, and identity that stays consistent.",
              },
              {
                title: "Audience Growth",
                body: "Platform-focused rollout support to build real listener momentum.",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 backdrop-blur-[1px]"
                style={{ boxShadow: cardShadow }}
              >
                <p className="text-sm sm:text-base font-semibold">{item.title}</p>
                <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stacked images — prominent 3D layer */}
        <motion.div
          className="mt-16 mb-16 sm:mt-20 sm:mb-20 md:mt-24 md:mb-24"
          style={{ translateZ: "20px" }}
        >
          <StackedImagesSection image1={image1} image2={image2} image3={image3} />
        </motion.div>
      </motion.div>
    </div>
  );
}
