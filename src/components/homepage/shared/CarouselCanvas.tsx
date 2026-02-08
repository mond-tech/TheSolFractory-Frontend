"use client";
import * as THREE from "three";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { MotionValue } from "framer-motion";
import { CarouselScene } from "./CarouselScene";
import { PostFX } from "./Atmosphere";

export default function CarouselCanvas({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 2, 18], fov: 35 }}
      gl={{
        physicallyCorrectLights: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      shadows
    >
      <Suspense fallback={null}>
        <CarouselScene scrollProgress={scrollProgress} />
        <PostFX />
      </Suspense>
    </Canvas>
  );
}
