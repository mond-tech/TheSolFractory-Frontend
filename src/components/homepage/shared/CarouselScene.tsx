"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTransform, MotionValue } from "framer-motion";
import { Environment, ContactShadows, Html, useProgress } from "@react-three/drei";
import { Cone } from "./Cone"; // Ensure this path is correct
import type { Group } from "three";

const RADIUS = 4.5;
const ENTRANCE_OFFSET = 15; // Start further out for dramatic entry

function Loader() {
  const { progress } = useProgress();
  return <Html center className="text-white font-mono">{progress.toFixed(0)}%</Html>;
}

function CarouselScene(
    { scrollProgress } : { scrollProgress: MotionValue<number> }
) {
  const groupRef = useRef<Group>(null);

  // --- GLOBAL CAROUSEL ANIMATION (Starts after entrance) ---
  // The entire group starts spinning only after cones have settled (0.25)
  const groupRotation = useTransform(scrollProgress, [0.25, 1], [0, Math.PI * 2]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = groupRotation.get();
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <Environment preset="city" />

      {/* Main Carousel Group */}
      <group ref={groupRef}>
        
        {/* CONE 1: Left Entrance */}
        <CarouselItem 
          index={0}
          isLeft={true}
          angle={0} 
          scrollProgress={scrollProgress}
          url="/3d-cones/browncone.glb"
        />

        {/* CONE 2: Left Entrance (Opposite side of circle) */}
        <CarouselItem 
          index={1}
          isLeft={true}
          angle={Math.PI} 
          scrollProgress={scrollProgress}
          url="/3d-cones/browncone.glb"
        />

        {/* CONE 3: Right Entrance */}
        <CarouselItem 
          index={2}
          isLeft={false}
          angle={Math.PI / 2} 
          scrollProgress={scrollProgress}
          url="/3d-cones/browncone.glb"
        />

        {/* CONE 4: Right Entrance */}
        <CarouselItem 
          index={3}
          isLeft={false}
          angle={-Math.PI / 2} 
          scrollProgress={scrollProgress}
          url="/3d-cones/browncone.glb"
        />

      </group>

      <ContactShadows opacity={0.4} scale={20} blur={2.4} far={4.5} />
    </>
  );
}

// --- INDIVIDUAL CONE LOGIC ---
interface CarouselItemProps {
  index: number;
  isLeft: boolean;
  angle: number;
  scrollProgress: MotionValue<number>;
  url: string;
}

function CarouselItem({ index, isLeft, angle, scrollProgress, url }: CarouselItemProps) {
  const itemRef = useRef<Group>(null);
  
  // 1. CALCULATE TARGET POSITIONS (Where it ends up)
  // We offset X/Z so they face outward/tangent depending on preference.
  // Here we place them purely on the circle edge.
  const targetX = Math.sin(angle) * RADIUS;
  const targetZ = Math.cos(angle) * RADIUS;

  // 2. ENTRANCE MATH (0 to 0.25 scroll)
  
  // A. Position Path: Slide from Left/Right (-15 to TargetX)
  const startX = isLeft ? -ENTRANCE_OFFSET : ENTRANCE_OFFSET;
  const x = useTransform(scrollProgress, [0, 0.25], [startX, targetX]);
  
  // B. Random Tumble: 
  // We use the 'index' to make each cone flip differently.
  // Start: Chaos (Random Multipliers) -> End: 0 (Stable)
  const tumbleX = useTransform(scrollProgress, [0, 0.25], [Math.PI * (index + 2), 0]);
  const tumbleY = useTransform(scrollProgress, [0, 0.25], [Math.PI * (index * -1), 0]);
  
  // C. Orientation:
  // Start: Vertical (0) -> End: Horizontal (Math.PI / 2)
  // We add 'tumbleZ' to give it a spin, but it MUST settle at Math.PI/2 (1.57)
  const tumbleZ = useTransform(scrollProgress, [0, 0.25], [Math.PI * 5, Math.PI / 3]);

  // 3. SCALE: Grow from 0 to 1
  const scale = useTransform(scrollProgress, [0, 0.2], [0, 1]);

  useFrame(() => {
    if (itemRef.current) {
      // Apply Position
      // We only move X during entrance. Z is fixed for now (or could slide too).
      // To make them come from pure left/right, we interpolate X, but keep Z at target.
      itemRef.current.position.set(x.get(), 0, targetZ);

      // Apply Rotation
      // Combine the Tumble (chaos) with the Target Orientation
      itemRef.current.rotation.x = tumbleX.get();
      // We add 'angle' to Y so they face the correct direction on the circle
      itemRef.current.rotation.y = tumbleY.get() + angle; 
      itemRef.current.rotation.z = tumbleZ.get();

      // Apply Scale
      itemRef.current.scale.setScalar(scale.get());
    }
  });

  return (
    <group ref={itemRef}>
      {/* We can still keep Float for a gentle hover effect after they settle */}
      <Cone url={url} /> 
    </group>
  );
}

interface CarouselCanvasProps {
  scrollProgress: MotionValue<number>;
}

export default function CarouselCanvas({ scrollProgress }: CarouselCanvasProps) {
  return (
    <Canvas camera={{ position: [0, 0, 14], fov: 35 }}>
      <React.Suspense fallback={<Loader />}>
         <CarouselScene scrollProgress={scrollProgress} />
      </React.Suspense>
    </Canvas>
  );
}
