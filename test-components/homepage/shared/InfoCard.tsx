"use client";
import { Html } from "@react-three/drei";

const RADIUS = 3.5;

const Samplecone = ["Black Obsidian", "Blue Agate", "Green Aventurine", "Red Jasper"];

export default function InfoCard({ visible, index }: { visible: boolean; index: number }) {
  if (!visible) return null;

  return (
    <Html
      position={[-4, -1.6, RADIUS]}
      transform={false}
      center
      distanceFactor={10}
      className="pointer-events-none"
    >
      <div className="w-56 bg-black/70 border border-white/20 rounded-lg px-4 py-3 text-white shadow-xl">
        <h3 className="text-base font-semibold">{Samplecone[index]}</h3>
      </div>
    </Html>
  );
}