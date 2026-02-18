"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useTransform, MotionValue } from "framer-motion";
import { useHelper } from "@react-three/drei";
import useSound from 'use-sound';
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { DirectionalLightHelper, SpotLightHelper } from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ContactShadows, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { Cone } from "./Cone";
import { OrbitControls } from "@react-three/drei";
import type { Group } from "three";
import CinematicSmoke from "./CinemeticSmoke";
// import { Stars } from "@/src/sharedcomponents/build/stars";

// --- EXPORT CONFIGURATION for Page.tsx to use ---
export const RADIUS = 6.5;
export const ENTRANCE_OFFSET = 12;
export const ANIMATION_END = 0.35;

export const CONE_DATA = [
  {
    id: 1,
    title: "Beige Cone",
    description: "Smooth matte finish",
    url: "/3d-cones/straight/beige_cone.glb",
    scale: 46,
    rotationOffset: 2,
  },
  {
    id: 2,
    title: "Black Obsidian",
    description: "Dark reflective surface",
    url: "/3d-cones/straight/black_cone_v01.glb",
    scale: 47,
    rotationOffset: 1.4,
  },
  {
    id: 3,
    title: "White Roll",
    description: "Clean minimal design",
    url: "/3d-cones/straight/white roll.glb",
    scale: 1,
    rotationOffset: 1.4,
  },
  {
    id: 4,
    title: "Brown Texture",
    description: "Organic material feel",
    url: "/3d-cones/brown roll.glb",
    scale: 1.5,
    rotationOffset: 3.9,
  },
  {
    id: 5,
    title: "Glass Filter",
    description: "Transparent optics",
    url: "/3d-cones/straight/Cone Glass Filter.glb",
    scale: 0.5,
    rotationOffset: 0.6,
  },
  {
    id: 6,
    title: "Industrial Roll",
    description: "Heavy duty manufacturing",
    url: "/3d-cones/straight/Roll 1.glb",
    scale: 40,
    rotationOffset: 2.3,
  },
  {
    id: 7,
    title: "Blue Steel",
    description: "Cold rolled steel",
    url: "/3d-cones/straight/Roll 2glb.glb",
    scale: 40,
    rotationOffset: 2.1,
  },
  {
    id: 8,
    title: "Clear Plastic",
    description: "High durability polymer",
    url: "/3d-cones/straight/Transparent Cone.glb",
    scale: 3.2,
    rotationOffset: -0.5,
  },
];

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center className="text-white font-mono">
      {progress.toFixed(0)}%
    </Html>
  );
}

function LoadingBridge({
  onLoadingChange,
  onReady,
}: {
  onLoadingChange?: (loading: boolean, progress: number) => void;
  onReady?: () => void;
}) {
  const { active, progress } = useProgress();

  useEffect(() => {
    const isLoading = active || progress < 100;
    onLoadingChange?.(isLoading, progress);
    if (!isLoading && progress >= 100) onReady?.();
  }, [active, onLoadingChange, onReady, progress]);

  return null;
}

// --- NAV ARROWS ---
function NavArrows({
  visible,
  activeIndex,
  onNext,
  onPrev,
}: {
  visible: boolean;
  activeIndex: number;
  onNext: () => void;
  onPrev: () => void;
}) {
  // Base button styles with improved design
  const btnClass =
    "pointer-events-auto cursor-pointer w-13 h-13 rounded-full bg-gradient-to-br from-white/15 to-white/5 hover:from-white/25 hover:to-white/10 backdrop-blur-lg border border-white/30 hover:border-white/50 text-white transition-all duration-300 active:scale-90 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] group disabled:opacity-0 disabled:pointer-events-none";

  // Logic: Hide Prev if first, Hide Next if last
  const showPrev = visible && activeIndex > 0;
  const showNext = visible && activeIndex < CONE_DATA.length - 1;

  // Sound file path - public folder files are served from root
  // Wrap in try-catch to handle cases where sound might not load
  const [playClickSound] = useSound('/sounds/click.ogg', {
    volume: 0.5,
    interrupt: true,
  });

  // Safe sound play function that handles errors
  const handlePlaySound = () => {
    try {
      playClickSound();
    } catch (error) {
      // Silently fail if sound can't play (e.g., autoplay restrictions)
      console.debug('Sound playback failed:', error);
    }
  };

  return (
    <Html fullscreen style={{ pointerEvents: "none" }} zIndexRange={[100, 0]}>
      <div
        className={`absolute inset-0 flex items-center justify-between px-6 md:px-10 lg:px-16 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        {/* LEFT ARROW */}
        <div className="pointer-events-auto flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
              handlePlaySound();
            }}
            disabled={!showPrev}
            className={`${btnClass} ${showPrev ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none"}`}
            aria-label="Previous cone"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-[-2px] transition-transform duration-300"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        {/* RIGHT ARROW */}
        <div className="pointer-events-auto flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
              handlePlaySound();
            }}
            disabled={!showNext}
            className={`${btnClass} ${showNext ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"}`}
            aria-label="Next cone"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-[2px] transition-transform duration-300"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </Html>
  );
}

// Arrow component that connects card to cone with Z-shaped path
function ConnectionArrow({
  activeIndex,
  visible,
  groupRotation,
}: {
  activeIndex: number;
  visible: boolean;
  groupRotation: number;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const cardCircleRef = useRef<THREE.Mesh>(null);
  const coneCircleRef = useRef<THREE.Mesh>(null);
  const [lineObject, setLineObject] = React.useState<THREE.Line | null>(null);

  // Create geometry and material once
  const lineGeometry = React.useMemo(() => new THREE.BufferGeometry(), []);
  const lineMaterial = React.useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 2,
        transparent: true,
        opacity: 0.8,
      }),
    [],
  );

  // Circle geometry and material for indicators
  const circleGeometry = React.useMemo(
    () => new THREE.RingGeometry(0.08, 0.12, 16),
    [],
  );
  const circleMaterial = React.useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useFrame(() => {
    if (!visible) {
      if (lineRef.current) lineRef.current.visible = false;
      if (cardCircleRef.current) cardCircleRef.current.visible = false;
      if (coneCircleRef.current) coneCircleRef.current.visible = false;
      return;
    }

    if (lineRef.current) lineRef.current.visible = true;
    if (cardCircleRef.current) cardCircleRef.current.visible = true;
    if (coneCircleRef.current) coneCircleRef.current.visible = true;

    // Card center position
    const cardCenter = new THREE.Vector3(-4, -2.6, RADIUS);

    // Calculate card right border position (card is w-64 = 256px, with distanceFactor=10, so ~1.3 units half-width)
    const cardEdgeOffset = 1.3; // Half width of card in 3D space
    const cardBorderPos = new THREE.Vector3(
      cardCenter.x + cardEdgeOffset,
      cardCenter.y,
      cardCenter.z,
    );

    // Calculate active cone's angle
    const activeAngle = (activeIndex / CONE_DATA.length) * Math.PI * 2;
    // Apply group rotation to get actual position
    const actualAngle = activeAngle + groupRotation;

    // Cone position on the circle
    const coneX = Math.sin(actualAngle) * RADIUS;
    const coneZ = Math.cos(actualAngle) * RADIUS;
    const conePos = new THREE.Vector3(coneX, 0, coneZ);

    // Create Z-shaped path: start from card border (hiding the lower horizontal line)
    // Horizontal segment after diagonal, then diagonal to cone
    const zOffset = 1.5; // Distance for the horizontal segment
    const midPoint = new THREE.Vector3(coneX - zOffset, conePos.y, conePos.z);

    // Update line geometry with Z-shaped path (3 points - skipping the first horizontal segment)
    // Start from card border, go diagonal, then horizontal to cone
    const positions = new Float32Array([
      cardBorderPos.x,
      cardBorderPos.y,
      cardBorderPos.z, // Start at card border
      midPoint.x,
      midPoint.y,
      midPoint.z, // Diagonal segment
      conePos.x,
      conePos.y,
      conePos.z, // End at cone
    ]);
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    lineGeometry.computeBoundingSphere();

    // Update circle positions
    if (cardCircleRef.current) {
      cardCircleRef.current.position.copy(cardBorderPos);
      // Orient circle to face camera (look at origin)
      cardCircleRef.current.lookAt(0, 0, 0);
    }

    if (coneCircleRef.current) {
      coneCircleRef.current.position.copy(conePos);
      // Orient circle to face camera
      coneCircleRef.current.lookAt(0, 0, 0);
    }
  });

  // Initialize line on mount
  React.useEffect(() => {
    if (!lineRef.current) {
      lineRef.current = new THREE.Line(lineGeometry, lineMaterial);
      setLineObject(lineRef.current);
    }
  }, [lineGeometry, lineMaterial]);

  return (
    <>
      {lineObject && <primitive object={lineObject} />}
      <mesh
        ref={cardCircleRef}
        geometry={circleGeometry}
        material={circleMaterial}
      />
      <mesh
        ref={coneCircleRef}
        geometry={circleGeometry}
        material={circleMaterial}
      />
    </>
  );
}

function CameraRig({ children }: { children: React.ReactNode }) {
  const rigRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!rigRef.current) return;

    const t = clock.elapsedTime;

    rigRef.current.position.x = Math.sin(t * 0.12) * 0.08;
    rigRef.current.position.y = Math.sin(t * 0.18) * 0.05;
    rigRef.current.rotation.y = Math.sin(t * 0.1) * 0.01;
  });

  return <group ref={rigRef}>{children}</group>;
}

// Component to update left, right, bottom, and right back-bottom spotlight positions dynamically
function SideSpotlightsController({
  leftLightRef,
  rightLightRef,
  bottomLightRef,
  rightBackBottomLightRef,
  leftTargetRef,
  rightTargetRef,
  bottomTargetRef,
  rightBackBottomTargetRef,
  position,
}: {
  leftLightRef: React.RefObject<THREE.SpotLight | null>;
  rightLightRef: React.RefObject<THREE.SpotLight | null>;
  bottomLightRef: React.RefObject<THREE.SpotLight | null>;
  rightBackBottomLightRef: React.RefObject<THREE.SpotLight | null>;
  leftTargetRef: React.RefObject<THREE.Object3D | null>;
  rightTargetRef: React.RefObject<THREE.Object3D | null>;
  bottomTargetRef: React.RefObject<THREE.Object3D | null>;
  rightBackBottomTargetRef: React.RefObject<THREE.Object3D | null>;
  position: THREE.Vector3 | null;
}) {
  useFrame(() => {
    if (!position || !leftLightRef.current || !rightLightRef.current || 
        !leftTargetRef.current || !rightTargetRef.current) return;

    // Left spotlight - positioned to the left side
    const leftOffset = new THREE.Vector3(-4, 3, 2);
    leftLightRef.current.position.set(
      position.x + leftOffset.x,
      position.y + leftOffset.y,
      position.z + leftOffset.z
    );
    leftTargetRef.current.position.set(position.x, position.y, position.z);
    leftLightRef.current.target = leftTargetRef.current;
    leftLightRef.current.target.updateMatrixWorld();

    // Right spotlight - positioned to the right side
    const rightOffset = new THREE.Vector3(4, 3, 2);
    rightLightRef.current.position.set(
      position.x + rightOffset.x,
      position.y + rightOffset.y,
      position.z + rightOffset.z
    );
    rightTargetRef.current.position.set(position.x, position.y, position.z);
    rightLightRef.current.target = rightTargetRef.current;
    rightLightRef.current.target.updateMatrixWorld();

    // Bottom spotlight - positioned below, pointing toward bottom front of cone
    if (bottomLightRef.current && bottomTargetRef.current) {
      const bottomOffset = new THREE.Vector3(0, -4, 3); // Below and in front
      bottomLightRef.current.position.set(
        position.x + bottomOffset.x,
        position.y + bottomOffset.y,
        position.z + bottomOffset.z
      );
      // Target the bottom front of the cone (slightly below center and forward)
      const targetOffset = new THREE.Vector3(0, -1.5, 0.5);
      bottomTargetRef.current.position.set(
        position.x + targetOffset.x,
        position.y + targetOffset.y,
        position.z + targetOffset.z
      );
      bottomLightRef.current.target = bottomTargetRef.current;
      bottomLightRef.current.target.updateMatrixWorld();
    }

    // Right back-bottom spotlight - positioned at right back-bottom, pointing toward bottom of cone
    if (rightBackBottomLightRef.current && rightBackBottomTargetRef.current) {
      // Position: right side, back, and below the cone
      const rightBackBottomOffset = new THREE.Vector3(3, -2.5, -2); // Right, back, and below
      rightBackBottomLightRef.current.position.set(
        position.x + rightBackBottomOffset.x,
        position.y + rightBackBottomOffset.y,
        position.z + rightBackBottomOffset.z
      );
      // Target the bottom of the cone (below center, slightly forward)
      const targetOffset = new THREE.Vector3(0, -2, 0);
      rightBackBottomTargetRef.current.position.set(
        position.x + targetOffset.x,
        position.y + targetOffset.y,
        position.z + targetOffset.z
      );
      rightBackBottomLightRef.current.target = rightBackBottomTargetRef.current;
      rightBackBottomLightRef.current.target.updateMatrixWorld();
    }
  });

  return null;
}

// NEW COMPONENT: Orbit Controls for Centered Cone Only
function CenteredConeOrbitControls({
  isActive,
  conePosition,
  activeConeRef,
}: {
  isActive: boolean;
  conePosition: THREE.Vector3 | null;
  activeConeRef: React.RefObject<Group | null>;
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const lastSphericalRef = useRef<THREE.Spherical | null>(null);

  useFrame(() => {
    if (!isActive || !conePosition || !activeConeRef.current) {
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }
      return;
    }

    if (!controlsRef.current) return;

    // Enable controls only when cone is centered
    controlsRef.current.enabled = true;

    // Update controls target to the cone position
    controlsRef.current.target.set(conePosition.x, conePosition.y, conePosition.z);
    controlsRef.current.update();

    // Get current camera position relative to target
    const offset = new THREE.Vector3().subVectors(camera.position, controlsRef.current.target);
    const spherical = new THREE.Spherical();
    spherical.setFromVector3(offset);

    // Calculate rotation delta from last frame
    if (lastSphericalRef.current) {
      const deltaTheta = spherical.theta - lastSphericalRef.current.theta;
      const deltaPhi = spherical.phi - lastSphericalRef.current.phi;

      // Apply rotation to the cone based on controls movement
      if (activeConeRef.current) {
        activeConeRef.current.rotation.y += deltaTheta;
        activeConeRef.current.rotation.x += deltaPhi;
      }
    }

    lastSphericalRef.current = spherical.clone();
  });

  if (!isActive || !conePosition) {
    return null;
  }

  return (
    <OrbitControls
      ref={controlsRef}
      target={conePosition}
      enablePan={false}
      enableZoom={false}
      minDistance={8}
      maxDistance={12}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      autoRotate={false}
      enableRotate={true} 
    />
  );
}

function InfoCard({
  activeIndex,
  visible,
}: {
  activeIndex: number;
  visible: boolean;
}) {
  const data = CONE_DATA[activeIndex];

  return (
    <group>
      <Html
        position={[-4, -2.6, RADIUS]}
        center
        transform={false}
        distanceFactor={10}
        className={`${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity duration-500 ease-in-out`}
      >
        <div className="w-64 h-[40px] bg-black/60 flex justify-center items-center flex-col backdrop-blur-md border border-white/20 p-4 rounded-lg text-white shadow-xl">
          <h2 className="text-xl font-bold mb-1 text-cyan-300">{data.title}</h2>
          {/* <p className="text-sm text-gray-300">{data.description}</p> */}
        </div>
        {/* <span className="mt-2 text-xs text-gray-500 font-mono">Index: {activeIndex + 1} / {CONE_DATA.length}</span> */}
      </Html>
    </group>
  );
}

// Updated Props Interface
interface CarouselSceneProps {
  scrollProgress: MotionValue<number>;
  onItemClick: (index: number) => void; // New callback
}
import { useTexture } from "@react-three/drei";


// Terrain Floor Component with Displacement Mapping
function TerrainFloor({
  position = [0, -4.25, 1],
  scale = [80, 30],
  rotation = [-Math.PI / 2.35, 0, 0],
  heightMapUrl = "/textures/height.png",
  textureUrl = "/textures/mountainTexture.jpg",
  alphaMapUrl = "/textures/alpha.png",
}: {
  position?: [number, number, number];
  scale?: [number, number];
  rotation?: [number, number, number];
  heightMapUrl?: string;
  textureUrl?: string;
  alphaMapUrl?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Load textures - useTexture returns textures directly (suspends if loading)
  // If textures don't exist, this will throw and be caught by Suspense boundary
  const textures = useTexture({
    height: heightMapUrl,
    map: textureUrl,
    alpha: alphaMapUrl,
  });

  useFrame((state) => {
    if (!materialRef.current) return;

    const mouseY = state.pointer.y; // normalized (-1 to 1)
    materialRef.current.displacementScale = 6 // + mouseY * 0.5;
  });

  const [heightMap, normalMap, matcap] = useLoader(THREE.TextureLoader, [
    "/textures/height.png",          // 👈 your mountain height map
    "/textures/mountainTexture.jpg",     // same normal map as wolf
    "/matcap/mat-2.png",    // same matcap as wolf
  ]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      renderOrder={-1}
    >
      <planeGeometry args={[scale[0], scale[1], 64, 64]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#000acf"
        map={textures.map}
        displacementMap={textures.height}
        displacementScale={0.9}
        alphaMap={textures.alpha}
        transparent={true}
        depthTest={true}
        depthWrite={true}
        roughness={0.8}
        metalness={0.1}
        emissive="#000acf"
        emissiveIntensity={0.05}
      />

      

      <pointLight color="#009fff" intensity={50} /> 
    </mesh>
  );
}

function SmokePlane({
  position,
  scale,
  rotation = [0, 0, 0],
  opacity = 0.06,
  drift = false,
  color = "#ffffff",
  textureUrl = "/textures/smoke-soft.png",
}: {
  position: [number, number, number];
  scale: [number, number];
  rotation?: [number, number, number];
  opacity?: number;
  drift?: boolean;
  color?: string;
  textureUrl?: string;
}) {
  const texture = useTexture(textureUrl);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!drift || !meshRef.current) return;

    const t = state.clock.elapsedTime;
    meshRef.current.position.x += Math.sin(t * 0.05) * 0.0008;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      renderOrder={-1}
    >
      <planeGeometry args={[scale[0], scale[1], 64, 64]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={true}
        depthTest={true}
        color={color}
      />
    </mesh>
  );
}

// Smoke emitter placed toward the back-top-right of the scene, built from layered SmokePlanes
function SmokeEmitter({
  position = [6, 4.5, -6],
  color = "#9fb4ff",
}: {
  position?: [number, number, number];
  color?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Gentle vertical breathing motion to keep the emitter feeling alive but not jittery
    groupRef.current.position.y = position[1] + Math.sin(t * 0.25) * 0.25;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Core plume */}
      <SmokePlane
        position={[0, 0, 0]}
        scale={[18, 12]}
        rotation={[0, 0, 0]}
        opacity={0.18}
        drift
        color={color}
      />
      {/* Mid layer, slightly offset */}
      <SmokePlane
        position={[-2, 1.5, 0.5]}
        scale={[14, 10]}
        rotation={[0.1, 0.15, 0]}
        opacity={0.14}
        drift
        color={color}
      />
      {/* Softer outer haze */}
      <SmokePlane
        position={[-4, 3, 1]}
        scale={[12, 8]}
        rotation={[0.15, 0.25, 0.1]}
        opacity={0.1}
        drift
        color={color}
      />
    </group>
  );
}

// Helper function to initialize particle data (moved outside to avoid impure function during render)
function initializeParticleData(count: number) {
  const pos = new Float32Array(count * 3);
  const vel = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const sd = new Float32Array(count);
  const b = { x: 18, yMin: 0.5, yMax: 9, z: 14 };

  for (let i = 0; i < count; i++) {
    // Start within a wide box
    pos[i * 3 + 0] = (Math.random() - 0.5) * b.x * 2;
    pos[i * 3 + 1] = Math.random() * (b.yMax - b.yMin) + b.yMin;
    pos[i * 3 + 2] = (Math.random() - 0.5) * b.z * 2;

    // Much smaller initial random velocity for slower motion
    vel[i * 3 + 0] = (Math.random() - 0.5) * 0.006;
    vel[i * 3 + 1] = (Math.random() - 0.2) * 0.006;
    vel[i * 3 + 2] = (Math.random() - 0.5) * 0.006;

    // Warm tinted colors with slight variation
    const t = 0.85 + Math.random() * 0.25;
    col[i * 3 + 0] = 1.0 * t; // r
    col[i * 3 + 1] = 0.85 * t; // g
    col[i * 3 + 2] = 0.7 * t; // b

    // Per-particle seed for smooth oscillation
    sd[i] = Math.random() * Math.PI * 2;
  }

  return {
    positions: pos,
    velocities: vel,
    colors: col,
    seeds: sd,
    bounds: b,
  };
}

function DustParticles({ count = 620 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleDataRef = useRef<ReturnType<typeof initializeParticleData> | null>(null);

  // Initialize positions, velocities and colors once
  React.useEffect(() => {
    if (particleDataRef.current == null) {
      particleDataRef.current = initializeParticleData(count);
    }
  }, [count]);

  const { positions, velocities, colors, seeds, bounds } = particleDataRef.current ?? initializeParticleData(count);

  // create geometry once
  React.useEffect(() => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry as THREE.BufferGeometry;
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    // no need to recreate attributes every frame
  }, [positions, colors]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const posAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;
    const cnt = count;

    for (let i = 0; i < cnt; i++) {
      const idx = i * 3;

      // Slower, smoother oscillatory drift using sine/cos driven by seed
      const phase = seeds[i];
      const driftStrength = 0.004; // reduced for slower motion
      const nx = Math.sin(t * 0.06 + phase) * driftStrength;
      const ny = Math.cos(t * 0.04 + phase * 1.1) * driftStrength * 0.7;
      const nz = Math.sin(t * 0.05 - phase) * driftStrength * 0.8;

      velocities[idx + 0] += nx * delta * 0.4;
      velocities[idx + 1] += ny * delta * 0.4;
      velocities[idx + 2] += nz * delta * 0.4;

      // gentle center pull to keep particles in scene (avoid runaway)
      const pull = 0.003;
      velocities[idx + 0] += -pos[idx + 0] * pull * delta;
      velocities[idx + 2] += -pos[idx + 2] * pull * delta;

      // limit velocity to small values for slow movement
      velocities[idx + 0] = THREE.MathUtils.clamp(
        velocities[idx + 0],
        -0.03,
        0.03,
      );
      velocities[idx + 1] = THREE.MathUtils.clamp(
        velocities[idx + 1],
        -0.03,
        0.03,
      );
      velocities[idx + 2] = THREE.MathUtils.clamp(
        velocities[idx + 2],
        -0.03,
        0.03,
      );

      // Integrate position with smaller multipliers
      pos[idx + 0] +=
        velocities[idx + 0] * (1 + Math.abs(Math.sin(phase + t)) * 0.25);
      pos[idx + 1] +=
        velocities[idx + 1] * (1 + Math.abs(Math.cos(phase + t)) * 0.18);
      pos[idx + 2] +=
        velocities[idx + 2] * (1 + Math.abs(Math.sin(phase - t)) * 0.25);

      // Wrap-around bounds so particles re-enter naturally
      const bx = bounds.x;
      const bz = bounds.z;
      const yMin = bounds.yMin;
      const yMax = bounds.yMax;

      if (pos[idx + 0] > bx) pos[idx + 0] = -bx;
      if (pos[idx + 0] < -bx) pos[idx + 0] = bx;
      if (pos[idx + 2] > bz) pos[idx + 2] = -bz;
      if (pos[idx + 2] < -bz) pos[idx + 2] = bz;
      if (pos[idx + 1] > yMax) pos[idx + 1] = yMin + Math.random() * 0.3;
      if (pos[idx + 1] < yMin) pos[idx + 1] = yMax - Math.random() * 0.3;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial
        vertexColors
        size={0.025} // slightly smaller
        color={"#ffd9b3"}
        transparent
        opacity={0.18} // subtle
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function CarouselScene({ scrollProgress, onItemClick }: CarouselSceneProps) {
  const groupRef = useRef<Group>(null);
  const heroLightRef = useRef<THREE.SpotLight>(null);
  const leftSpotLightRef = useRef<THREE.SpotLight>(null);
  const rightSpotLightRef = useRef<THREE.SpotLight>(null);
  const bottomSpotLightRef = useRef<THREE.SpotLight>(null);
  const rightBackBottomSpotLightRef = useRef<THREE.SpotLight>(null);
  const leftSpotLightTargetRef = useRef<THREE.Object3D>(null);
  const rightSpotLightTargetRef = useRef<THREE.Object3D>(null);
  const bottomSpotLightTargetRef = useRef<THREE.Object3D>(null);
  const rightBackBottomSpotLightTargetRef = useRef<THREE.Object3D>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showUI, setShowUI] = useState(false);
  const [isConeCentered, setIsConeCentered] = useState(false);
  const [centeredConePosition, setCenteredConePosition] = useState<THREE.Vector3 | null>(null);
  const [showCardWithDelay, setShowCardWithDelay] = useState(false);
  const [groupRotation, setGroupRotation] = useState(0); // logical carousel rotation, not actual group transform
  const delayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const anglePerCone = (Math.PI * 2) / CONE_DATA.length;
  const controlsRef = useRef<OrbitControlsImpl>(null);
  // NEW: Ref to store the active centered cone for orbit controls
  const activeConeRef = useRef<Group | null>(null);

  const lightRef = useRef<THREE.HemisphereLight>(null);
  const directionLightRef = useRef<THREE.DirectionalLight>(null);

  const spotRef = useRef<THREE.SpotLight>(null);
  // useHelper(spotRef, THREE.SpotLightHelper, "cyan");

  // Use Three.js built-in DirectionalLightHelper
  useHelper(
    directionLightRef as React.MutableRefObject<THREE.DirectionalLight>,
    DirectionalLightHelper,
    3,
  );

  // Helper for bottom spotlight - updates when light position changes
  useHelper(
    bottomSpotLightRef as React.MutableRefObject<THREE.SpotLight>,
    SpotLightHelper,
  );

  // Helper for right back-bottom spotlight - updates when light position changes
  useHelper(
    rightBackBottomSpotLightRef as React.MutableRefObject<THREE.SpotLight>,
    SpotLightHelper,
  );


  // Reset card visibility when conditions change
  useEffect(() => {
    if (!isConeCentered || !showUI) {
      setShowCardWithDelay(false);
    }
  }, [isConeCentered, showUI]);

  // Handle delay when cone becomes centered
  useEffect(() => {
    // Clear any existing timeout
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
      delayTimeoutRef.current = null;
    }

    // Only set delay if cone is centered and UI is visible
    if (!isConeCentered || !showUI) {
      return;
    }

    // Set a delay of 300ms before showing the card when centered
    delayTimeoutRef.current = setTimeout(() => {
      setShowCardWithDelay(true);
    }, 300);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
        delayTimeoutRef.current = null;
      }
    };
  }, [isConeCentered, showUI, activeIndex]);

  useFrame(() => {
    if (!groupRef.current) return;
    const currentScroll = scrollProgress.get();

    if (currentScroll < ANIMATION_END) {
      if (showUI) setShowUI(false);
      if (isConeCentered) setIsConeCentered(false);
      groupRef.current.rotation.y = 0;
      if (groupRotation !== 0) setGroupRotation(0);
    } else {
      if (!showUI) setShowUI(true);

      const carouselProgress =
        (currentScroll - ANIMATION_END) / (1 - ANIMATION_END);
      const rawStep = carouselProgress * CONE_DATA.length;

      // Base target index from scroll, then clamp so we never jump more than
      // one cone per frame (prevents "skipping" 2 cones on fast scroll/click).
      let desiredStep = Math.floor(rawStep + 0.0001);
      desiredStep = Math.min(CONE_DATA.length - 1, Math.max(0, desiredStep));

      let currentStep = desiredStep;
      if (desiredStep > activeIndex + 1) {
        currentStep = activeIndex + 1;
      } else if (desiredStep < activeIndex - 1) {
        currentStep = activeIndex - 1;
      }

      if (currentStep !== activeIndex) {
        setActiveIndex(currentStep);
      }

      // Compute logical carousel rotation from the discrete active step so
      // the active cone is always exactly at the front (no partial offsets).
      const logicalRotation = -currentStep * anglePerCone;
      if (groupRotation !== logicalRotation) {
        setGroupRotation(logicalRotation);
      }

      // We always keep the actual THREE group unrotated to avoid camera-relative drift;
      // all cone positions are derived from `groupRotation` instead.
      groupRef.current.rotation.y = 0;

      // Check if the active cone is centered (angle close to 0 in logical space)
      const activeAngle = (activeIndex / CONE_DATA.length) * Math.PI * 2;
      const relativeAngle = activeAngle + groupRotation;
      // Normalize angle to [-PI, PI] range
      const normalizedAngle =
        ((relativeAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const angleFromCenter =
        normalizedAngle > Math.PI
          ? Math.PI * 2 - normalizedAngle
          : normalizedAngle;
      // Consider centered if within ~0.15 radians (about 8.6 degrees)
      const centered = angleFromCenter < 0.15;

      if (centered !== isConeCentered) {
        setIsConeCentered(centered);
      }

      // Update centered cone position for spotlight based on actual logical angle
      if (centered) {
        const frontAngle = activeAngle + groupRotation;
        const x = Math.sin(frontAngle) * RADIUS;
        const z = Math.cos(frontAngle) * RADIUS;
        const conePosition = new THREE.Vector3(x, 0, z);
        setCenteredConePosition(conePosition);

        if (heroLightRef.current?.target) {
          heroLightRef.current.target.position.set(x, 0, z);
          heroLightRef.current.target.updateMatrixWorld();
        }
      } else {
        setCenteredConePosition(null);
      }
    }
  });
  return (
    <>
      {/* STEP 3 — DARK AIR CONTAINER (THE ROOM) */}
      <mesh scale={60}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          side={THREE.BackSide}
          color="#05070c"
          roughness={1}
        />
      </mesh>

      {/* Add a warm side directional light so cones get clear side illumination and cast readable shadows */}
      {/* <directionalLight
        position={[8, 4, 4]} // side-right, slightly above
        intensity={19.2}
        color="#fff7ea"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={10}
        shadow-camera-right={-10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      /> */}

      {/* Optional complementary soft fill from the opposite side (lower intensity) */}
      {/* <directionalLight
        position={[-6, 3, -3]}
        intensity={0.35}
        color="#dfeeff"
      /> */}

      {/* --- NEW: upward light from below to illuminate cones from the bottom --- */}
      {/* <directionalLight
        position={[0, -6, 0]}
        intensity={0.9}
        color="#fff9f0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      /> */}
      {/* FRONT KEY LIGHT */}
      <directionalLight
         position={[0, 5, 10]}   // front
        intensity={2.2}
        ref={lightRef}
        color="#fff4e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />

      {/* Left, Right, and Bottom Spotlights that follow the centered cone */}
      {isConeCentered && centeredConePosition && (
        <>
          <spotLight
            ref={leftSpotLightRef}
            position={[0, 3, 2]}
            intensity={330}
            angle={0.4}
            penumbra={0.3}
            decay={2}
            distance={15}
            color="#fff4e6"
            castShadow
          />
          <spotLight
            ref={rightSpotLightRef}
            position={[0, 3, 2]}
            intensity={330}
            angle={0.4}
            penumbra={0.3}
            decay={2}
            distance={15}
            color="#fff4e6"
            castShadow
          />
          <spotLight
            ref={bottomSpotLightRef}
            position={[0, -4, 3]}
            intensity={200}
            angle={0.5}
            penumbra={0.4}
            decay={2}
            distance={20}
            color="#fff4e6"
            castShadow
          />
          <spotLight
            ref={rightBackBottomSpotLightRef}
            position={[3, -2.5, -2]}
            intensity={250}
            angle={0.6}
            penumbra={0.5}
            decay={2}
            distance={15}
            color="#fff4e6"
            castShadow
          />
          <object3D ref={leftSpotLightTargetRef} position={[0, 0, 0]} />
          <object3D ref={rightSpotLightTargetRef} position={[0, 0, 0]} />
          <object3D ref={bottomSpotLightTargetRef} position={[0, -1.5, 0.5]} />
          <object3D ref={rightBackBottomSpotLightTargetRef} position={[0, -2, 0]} />
          <SideSpotlightsController
            leftLightRef={leftSpotLightRef as React.RefObject<THREE.SpotLight | null>}
            rightLightRef={rightSpotLightRef as React.RefObject<THREE.SpotLight | null>}
            bottomLightRef={bottomSpotLightRef as React.RefObject<THREE.SpotLight | null>}
            rightBackBottomLightRef={rightBackBottomSpotLightRef as React.RefObject<THREE.SpotLight | null>}
            leftTargetRef={leftSpotLightTargetRef as React.RefObject<THREE.Object3D | null>}
            rightTargetRef={rightSpotLightTargetRef as React.RefObject<THREE.Object3D | null>}
            bottomTargetRef={bottomSpotLightTargetRef as React.RefObject<THREE.Object3D | null>}
            rightBackBottomTargetRef={rightBackBottomSpotLightTargetRef as React.RefObject<THREE.Object3D | null>}
            position={centeredConePosition}
          />
        </>
      )}
      <hemisphereLight 
        args={["#ffffff", "#444444"]}
        ref={lightRef}
        intensity={0.3}
        position={[0, 10, 0]}
      />
      {/* Visual indicator for hemisphere light - shows light position and direction */}
      {/* <mesh position={[0, 10, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color="#ffff00" 
          transparent 
          opacity={0.9}
          emissive="#ffff00"
          emissiveIntensity={2}
        />
      </mesh> */}
      {/* Arrow pointing down to show light direction */}
      {/* <mesh position={[0, 9.5, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.15, 0.8, 8]} />
        <meshStandardMaterial 
          color="#ffff00" 
          transparent 
          opacity={0.7}
          emissive="#ffff00"
          emissiveIntensity={1.5}
        />
      </mesh> */}
      {/* Wireframe hemisphere to visualize light coverage */}
      {/* <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial 
          color="#ffff00" 
          wireframe 
          transparent 
          opacity={0.2}
        />
      </mesh> */}

      {/* <directionalLight
      ref={directionLightRef}
      position={[20, 20, 5]}   // top-right
      intensity={2}
      castShadow
    /> */}
  {/* <fog attach="fog" args={["#000000", 5, 25]} />

    <EffectComposer>
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
      />
    </EffectComposer> */}

      {/* <OrbitControls ref={controlsRef} /> */}

      {/* Make it point toward the center */}
      <object3D position={[0, 0, 0]} attach="target" />

      {/* BACKGROUND ELEMENTS - Render first with low renderOrder */}
      {/* STEP 7 — BACKGROUND SMOKE (TUNED) */}
      <SmokeEmitter position={[6, 4.5, -6]} />

      {/* STEP 7 — FOREGROUND DEPTH (PARALLAX) */}
      {/* <SmokePlane position={[0, -2, -3]} scale={[28, 18]} opacity={0.05} /> */}
      {/* STEP 8 — DUST PARTICLES */}
      <DustParticles count={150} />

      {/* STARS - Moonish feeling background */}
      {/* <Stars count={1200} /> */}

      {/* TERRAIN FLOOR WITH DISPLACEMENT MAPPING - Render before cones */}
      <TerrainFloor
        position={[0, -4.25, 1]}
        scale={[80, 30]}
        rotation={[-Math.PI / 2.35, 0, 0]}
      />

      {/* CONES - Render last with high renderOrder to ensure they're on top */}
      <group ref={groupRef} renderOrder={100}>
        {CONE_DATA.map((data, i) => {
          const angle = (i / CONE_DATA.length) * Math.PI * 2;
          const isLeft = i % 2 === 0;
          const isActive = i === activeIndex && isConeCentered;
          return (
            <CarouselItem
              key={i}
              index={i}
              isLeft={isLeft}
              angle={angle}
              carouselRotation={groupRotation}
              scrollProgress={scrollProgress}
              url={data.url}
              modelScale={data.scale}
              rotationOffset={data.rotationOffset}
              isActive={isActive}
              activeConeRef={isActive ? activeConeRef : null}
            />
          );
        })}
      </group>

      {/* everything else stays BELOW this */}

      <InfoCard activeIndex={activeIndex} visible={showCardWithDelay} />

      <ConnectionArrow
        activeIndex={activeIndex}
        visible={showCardWithDelay}
        groupRotation={groupRotation}
      />

      {/* Pass the click handler up to the parent via onItemClick */}
      <NavArrows
        visible={showUI}
        activeIndex={activeIndex}
        onNext={() => onItemClick(activeIndex + 1)}
        onPrev={() => onItemClick(activeIndex - 1)}
      />

      <ContactShadows opacity={0.4} scale={15} blur={2.4} far={4.5} />

      {/* NEW: Orbit Controls for Centered Cone Only */}
      {/* <CenteredConeOrbitControls
        isActive={isConeCentered}
        conePosition={centeredConePosition}
        activeConeRef={activeConeRef}
      /> */}
    </>
  );
}

interface CarouselItemProps {
  index: number;
  isLeft: boolean;
  angle: number;
  carouselRotation: number;
  scrollProgress: MotionValue<number>;
  url: string;
  modelScale: number;
  rotationOffset: number;
  isActive: boolean;
  activeConeRef: React.RefObject<Group | null> | null;
}

function CarouselItem({
  index,
  isLeft,
  angle,
  carouselRotation,
  scrollProgress,
  url,
  modelScale,
  rotationOffset,
  isActive,
  activeConeRef,
}: CarouselItemProps) {
  const itemRef = useRef<Group>(null);
  
  // NEW: Expose ref to parent when this is the active cone
  useEffect(() => {
    if (isActive && activeConeRef && itemRef.current) {
      activeConeRef.current = itemRef.current;
    } else if (activeConeRef && !isActive) {
      activeConeRef.current = null;
    }
  }, [isActive, activeConeRef]);
  const worldAngle = angle + carouselRotation;
  const targetX = Math.sin(worldAngle) * RADIUS;
  const targetZ = Math.cos(worldAngle) * RADIUS;
  const startX = isLeft ? -ENTRANCE_OFFSET : ENTRANCE_OFFSET;

  const x = useTransform(scrollProgress, [0, ANIMATION_END], [startX, targetX]);
  const tumbleX = useTransform(
    scrollProgress,
    [0, ANIMATION_END],
    [Math.PI * (index + 2), 0],
  );
  const tumbleY = useTransform(
    scrollProgress,
    [0, ANIMATION_END],
    [Math.PI * (index * -1), 0],
  );
  const tumbleZ = useTransform(
    scrollProgress,
    [0, ANIMATION_END],
    [Math.PI * 5, 0],
  );
  const animationScale = useTransform(
    scrollProgress,
    [0, ANIMATION_END - 0.1],
    [0, 1],
  );

  useFrame(() => {
    if (itemRef.current) {

      if (scrollProgress.get() > ANIMATION_END) {
        // All cones at same scale and aligned position
        // Inactive cones moved backward and upward to avoid light
        if (isActive) {
          itemRef.current.position.set(targetX, 0, targetZ);
          itemRef.current.scale.setScalar(1); // Keep same size
          // NEW: Don't reset rotation for active cone - allow orbit controls to control it
          // Only set initial rotation if it hasn't been modified by controls
          if (Math.abs(itemRef.current.rotation.y) < 0.01 && Math.abs(itemRef.current.rotation.x) < 0.01) {
            itemRef.current.rotation.y = angle + Math.PI + rotationOffset;
          }
        } else {
          // Move inactive cones backward and upward to avoid light
          const backOffset = -2; // Move backward
          const upOffset = -0.5; // Move upward
          itemRef.current.position.set(targetX, upOffset, targetZ + backOffset);
          itemRef.current.scale.setScalar(1);
          itemRef.current.rotation.x = 0;
          itemRef.current.rotation.y = angle + Math.PI + rotationOffset;
          itemRef.current.rotation.z = 0;
        }
      } else {
        itemRef.current.position.set(x.get(), 0, targetZ);
        itemRef.current.scale.setScalar(animationScale.get());
        itemRef.current.rotation.x = tumbleX.get();
        itemRef.current.rotation.y =
          tumbleY.get() + angle + Math.PI + rotationOffset;
        itemRef.current.rotation.z = tumbleZ.get();
      }
    }
  });

  return (
    <group ref={itemRef} renderOrder={100}>
      <Suspense fallback={null}>
        <Cone url={url} scale={modelScale} />
      </Suspense>
    </group>
  );
}

// Updated Canvas Export
// Updated Canvas Export
/**
 * Renders a Three.js canvas component that displays a carousel scene with interactive 3D elements.
 *
 * @component
 * @param {Object} props - The component props
 * @param {MotionValue<number>} props.scrollProgress - A Framer Motion value tracking scroll progress to control carousel animation
 * @param {(index: number) => void} props.onItemClick - Callback function invoked when a carousel item is clicked, receiving the item index
 * @returns {JSX.Element} A Canvas component configured with ACES Filmic tone mapping, SRGB color space, and a suspended CarouselScene
 *
 * @remarks
 * - Uses Three.js Canvas with shadows enabled and adaptive DPR (1-1.5x)
 * - Camera positioned at [0, 2, 18] with 35° FOV
 * - Wraps the scene in React.Suspense with a Loader fallback
 * - CameraRig component handles camera animations based on scroll progress
 *
 * @example
 * ```tsx
 * const scrollProgress = useScroll();
 * <CarouselCanvas
 *   scrollProgress={scrollProgress}
 *   onItemClick={(index) => console.log(`Item ${index} clicked`)}
 * />
 * ```
 */
export default function CarouselCanvas({
  scrollProgress,
  onItemClick,
  onLoadingChange,
  showSmoke = true,
}: {
  scrollProgress: MotionValue<number>;
  onItemClick: (index: number) => void;
  onLoadingChange?: (loading: boolean, progress: number) => void;
  showSmoke?: boolean;
}) {
  const [ready, setReady] = useState(false);
  const glRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    return () => {
      // Best-effort explicit disposal to free GPU memory when this viewer is unmounted.
      const scene = sceneRef.current;
      if (scene) {
        disposeObject3D(scene);
      }

      const gl = glRef.current;
      if (gl) {
        try {
          gl.renderLists?.dispose?.();
          gl.dispose?.();
          gl.forceContextLoss?.();
        } catch {
          // ignore
        }
      }
      sceneRef.current = null;
      glRef.current = null;
    };
  }, []);

  return (
    <div
      className={`relative w-full h-full overflow-hidden transition-opacity duration-500 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Smoke Behind Everything */}
      {showSmoke ? <CinematicSmoke /> : null}

      {/* 3D Canvas */}
      <Canvas
        className="relative z-10"
        shadows
        dpr={[1, 1.5]}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        camera={{ position: [0, 0, 18], fov: 40 }}
        onCreated={({ gl, scene }) => {
          glRef.current = gl;
          sceneRef.current = scene;
        }}
      >
        <LoadingBridge
          onLoadingChange={onLoadingChange}
          onReady={() => setReady(true)}
        />
        <React.Suspense fallback={<Loader />}>
          <CarouselScene scrollProgress={scrollProgress} onItemClick={onItemClick} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

function disposeMaterial(mat: THREE.Material) {
  // Dispose textures attached to material
  const anyMat = mat as unknown as Record<string, unknown>;
  for (const key of Object.keys(anyMat)) {
    const v = anyMat[key];
    if (v && typeof v === "object" && (v as THREE.Texture).isTexture) {
      try {
        (v as THREE.Texture).dispose();
      } catch {
        // ignore
      }
    }
  }
  try {
    mat.dispose();
  } catch {
    // ignore
  }
}

function disposeObject3D(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    const geom = (mesh as unknown as { geometry?: THREE.BufferGeometry }).geometry;
    if (geom) {
      try {
        geom.dispose();
      } catch {
        // ignore
      }
    }

    const material = (mesh as unknown as { material?: THREE.Material | THREE.Material[] })
      .material;
    if (Array.isArray(material)) {
      material.forEach(disposeMaterial);
    } else if (material) {
      disposeMaterial(material);
    }
  });
}
