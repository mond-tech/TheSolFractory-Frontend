"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTransform } from "framer-motion";
import { Environment, ContactShadows, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { Cone } from "./Cone";
import InfoCard from "./shared/InfoCard";

const RADIUS = 3.5;
const ENTRANCE_OFFSET = 15;
const ANIMATION_END = 0.25;
const TOTAL_CONES = 4;

function Loader() {
  const { progress } = useProgress();
  return <Html center className="text-white font-mono">{progress.toFixed(0)}%</Html>;
}

/* ---------------- BLACK Z-LINE ---------------- */

function ZConnection({
  visible,
}: {
  visible: boolean;
  activeIndex?: number;
  rotation?: number;
}) {
  const geometry = React.useMemo(() => new THREE.BufferGeometry(), []);
  const material = React.useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#000000", // pure black
        linewidth: 2,
      }),
    []
  );

  useFrame(() => {
    if (!visible) return;

    // Fixed card position
    const cardPos = new THREE.Vector3(-4, -1.6, RADIUS);

    // ✅ FIXED middle cone position (carousel guarantees cone is here)
    const conePos = new THREE.Vector3(0, -0.4, RADIUS);

    const mid = new THREE.Vector3(conePos.x - 1.2, conePos.y, conePos.z);

    const positions = new Float32Array([
      cardPos.x, cardPos.y, cardPos.z,
      mid.x, mid.y, mid.z,
      conePos.x, conePos.y, conePos.z,
    ]);

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  });

  // Use primitive so TS/JSX don't confuse this with an SVG <line>
  const lineObject = React.useMemo(
    () => new THREE.Line(geometry, material),
    [geometry, material]
  );

  return visible ? <primitive object={lineObject} /> : null;
}


/* ---------------- SCENE ---------------- */

function CarouselScene({ scrollProgress }: { scrollProgress: any }) {
  const groupRef = useRef<THREE.Group>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showUI, setShowUI] = useState(false);

  useFrame(() => {
    const scroll = scrollProgress.get();

    if (scroll < ANIMATION_END) {
      setShowUI(false);
      if (groupRef.current) groupRef.current.rotation.y = 0;
      return;
    }

    const progress = (scroll - ANIMATION_END) / (1 - ANIMATION_END);
    const step = Math.min(
      TOTAL_CONES - 1,
      Math.max(0, Math.round(progress * TOTAL_CONES))
    );

    setActiveIndex(step);
    setShowUI(true);

    const targetRotation = -step * (Math.PI * 2) / TOTAL_CONES;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation,
        0.15
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <Environment preset="city" />

      <InfoCard visible={showUI} index={activeIndex} />
      <ZConnection
        visible={showUI}
        activeIndex={activeIndex}
        rotation={groupRef.current?.rotation.y || 0}
      />

      <group ref={groupRef}>
        <CarouselItem index={0} isLeft angle={0} scrollProgress={scrollProgress} />
        <CarouselItem index={1} isLeft angle={Math.PI} scrollProgress={scrollProgress} />
        <CarouselItem index={2} angle={Math.PI / 2} scrollProgress={scrollProgress} />
        <CarouselItem index={3} angle={-Math.PI / 2} scrollProgress={scrollProgress} />
      </group>

      <ContactShadows opacity={0.4} scale={20} blur={2.4} far={4.5} />
    </>
  );
}

/* ---------------- ITEM ---------------- */

function CarouselItem({
  index,
  isLeft = false,
  angle,
  scrollProgress,
}: {
  index: number;
  isLeft?: boolean;
  angle: number;
  scrollProgress: any;
}) {
  // If scrollProgress isn't ready yet, avoid calling hooks that depend on it
  if (!scrollProgress || typeof scrollProgress.get !== "function") {
    return null;
  }

  const ref = useRef<THREE.Group>(null);
  const targetX = Math.sin(angle) * RADIUS;
  const targetZ = Math.cos(angle) * RADIUS;

  const startX = isLeft ? -ENTRANCE_OFFSET : ENTRANCE_OFFSET;
  const x = useTransform(scrollProgress, [0, ANIMATION_END], [startX, targetX]);

  const tumbleX = useTransform(scrollProgress, [0, ANIMATION_END], [Math.PI * (index + 2), 0]);
  const tumbleY = useTransform(scrollProgress, [0, ANIMATION_END], [Math.PI * -index, 0]);
  const tumbleZ = useTransform(scrollProgress, [0, ANIMATION_END], [Math.PI * 5, Math.PI / 3]);

  const scale = useTransform(scrollProgress, [0, 0.2], [0, 1]);
  const settle = useTransform(scrollProgress, [ANIMATION_END, ANIMATION_END + 0.1], [0, 1]);

  useFrame(() => {
    if (!ref.current) return;
    const s = settle.get();

    ref.current.position.set(x.get(), -0.4, targetZ);
    ref.current.rotation.x = tumbleX.get() * (1 - s);
    ref.current.rotation.y = tumbleY.get() + angle;
    ref.current.rotation.z = tumbleZ.get() * (1 - s);
    ref.current.scale.setScalar(scale.get());
  });

  return (
    <group ref={ref}>
      <Cone url="/3d-cones/straight/black_cone_v01.glb" />
    </group>
  );
}

/* ---------------- CANVAS ---------------- */

export default function CarouselCanvas({ scrollProgress }: { scrollProgress: any }) {
  return (
    <Canvas camera={{ position: [0, 0, 14], fov: 37 }}>
      <React.Suspense fallback={<Loader />}>
        <CarouselScene scrollProgress={scrollProgress} />
      </React.Suspense>
    </Canvas>
  );
}
