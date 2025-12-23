"use client";

import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import type { CustomizationState, PaperType, ConeSize, FilterType } from "./types";

interface ConeViewerProps {
  state: CustomizationState;
  focusStep?: "paper" | "filter" | "size" | "lot";
}

const paperColorMap: Record<PaperType, string> = {
  unbleached: "#8B6F47",
  hemp: "#A8E6CF",
  bleached: "#F9FAFB",
  colored: "#F97316",
};

const filterColorMap: Record<FilterType, string> = {
  standard: "#E5E7EB",
  crutch: "#D1D5DB",
  "branded": "#4B5563",
  "printed-pattern": "#9CA3AF",
  natural: "#F5F5F4",
};

const sizeScaleMap: Record<ConeSize, number> = {
  "70mm": 0.8,
  "84mm": 0.95,
  "98mm": 1.1,
  "109mm": 1.25,
};

const ConeMesh: React.FC<ConeViewerProps> = ({ state, focusStep }) => {
  const paperColor = useMemo(
    () => paperColorMap[state.paperType ?? "hemp"],
    [state.paperType]
  );

  const filterColor = useMemo(
    () => (state.filterType ? filterColorMap[state.filterType] : "#E5E7EB"),
    [state.filterType]
  );

  const sizeScale = useMemo(
    () => (state.coneSize ? sizeScaleMap[state.coneSize] : 1),
    [state.coneSize]
  );

  const highlightEmissive = focusStep === "paper" ? 0.5 : 0.1;

  return (
    <group scale={1.2}>
      {/* Cone body */}
      <mesh position={[0, 0.4 * sizeScale, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[0.3 * sizeScale, 1.4 * sizeScale, 64]} />
        <meshStandardMaterial
          color={paperColor}
          roughness={0.6}
          metalness={0}
          emissive={paperColor}
          emissiveIntensity={highlightEmissive}
        />
      </mesh>

      {/* Filter / tip */}
      <mesh position={[0, -0.45 * sizeScale, 0]} castShadow>
        <cylinderGeometry args={[0.1 * sizeScale, 0.1 * sizeScale, 0.3 * sizeScale, 48]} />
        <meshStandardMaterial
          color={filterColor}
          roughness={0.4}
          metalness={0.1}
          emissive={focusStep === "filter" ? filterColor : "#000000"}
          emissiveIntensity={focusStep === "filter" ? 0.4 : 0.05}
        />
      </mesh>

      {/* Simple ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]} receiveShadow>
        <circleGeometry args={[1.2, 64]} />
        <meshStandardMaterial color="#020617" roughness={0.9} />
      </mesh>
    </group>
  );
};

const ConeViewer: React.FC<ConeViewerProps> = ({ state, focusStep }) => {
  return (
    <div className="w-full h-[320px] md:h-[420px] rounded-xl border border-blue-400/40 bg-gradient-to-b from-slate-900 via-slate-950 to-black shadow-[0_0_25px_rgba(15,23,42,0.9)] overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [2.2, 1.4, 2.2], fov: 40 }}
        className="w-full h-full"
      >
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[4, 6, 3]}
          intensity={1.1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-4, 3, -4]} intensity={0.4} />

        <Suspense fallback={null}>
          <Stage
            intensity={0.8}
            environment="studio"
            adjustCamera={false}
            shadows="contact"
          >
            <ConeMesh state={state} focusStep={focusStep} />
          </Stage>
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.12}
          minPolarAngle={0.4}
          maxPolarAngle={1.5}
        />
      </Canvas>
    </div>
  );
};

export default ConeViewer;


