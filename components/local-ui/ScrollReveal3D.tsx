"use client";

import React from "react";
import { motion } from "motion/react";

interface ScrollReveal3DProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function ScrollReveal3D({
  children,
  delay = 0,
  className,
}: ScrollReveal3DProps) {
  return (
    <div style={{ perspective: "900px" }} className={className}>
      <motion.div
        initial={{ rotateX: 18, opacity: 0, y: 30 }}
        whileInView={{ rotateX: 0, opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{
          duration: 0.75,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
