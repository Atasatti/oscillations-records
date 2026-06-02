import React from "react";
import { getStackedHeroImages } from "@/lib/site-settings";
import Hero3DScene from "./Hero3DScene";

export default async function HomeHeroSection() {
  const stacked = await getStackedHeroImages();

  return (
    <Hero3DScene
      image1={stacked.image1}
      image2={stacked.image2}
      image3={stacked.image3}
    />
  );
}
