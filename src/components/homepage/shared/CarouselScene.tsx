"use client";
 
import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTransform, MotionValue } from "framer-motion";
import { Environment, ContactShadows, Html, useProgress, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Cone } from "./Cone";
import type { Group } from "three";
import { GodRays } from "./GodRays";
 
// --- EXPORT CONFIGURATION for Page.tsx to use ---
export const RADIUS = 6.5;
export const ENTRANCE_OFFSET = 12;
export const ANIMATION_END = 0.35;
 
export const CONE_DATA = [
  { id: 1, title: "Beige Cone", description: "Smooth matte finish", url: "/3d-cones/straight/beige_cone.glb", scale: 46, rotationOffset: 2.7 },
  { id: 2, title: "Black Obsidian", description: "Dark reflective surface", url: "/3d-cones/straight/black_cone_v01.glb", scale: 47, rotationOffset: 2.7 },
  { id: 3, title: "White Roll", description: "Clean minimal design", url: "/3d-cones/straight/white roll.glb", scale: 1, rotationOffset: 4.5 },
  { id: 4, title: "Brown Texture", description: "Organic material feel", url: "/3d-cones/brown roll.glb", scale: 1.5, rotationOffset: 1.7 },
  { id: 5, title: "Glass Filter", description: "Transparent optics", url: "/3d-cones/straight/Cone Glass Filter.glb", scale: 0.5, rotationOffset: 4.12 },
  { id: 6, title: "Industrial Roll", description: "Heavy duty manufacturing", url: "/3d-cones/straight/Roll 1.glb", scale: 40, rotationOffset: 0.7 },
  { id: 7, title: "Blue Steel", description: "Cold rolled steel", url: "/3d-cones/straight/Roll 2glb.glb", scale: 40, rotationOffset: 0.7 },
  { id: 8, title: "Clear Plastic", description: "High durability polymer", url: "/3d-cones/straight/Transparent Cone.glb", scale: 3.2, rotationOffset: 0 },
];
 
function Loader() {
  const { progress } = useProgress();
  return <Html center className="text-white font-mono">{progress.toFixed(0)}%</Html>;
}
 
// --- NAV ARROWS ---
function NavArrows({
  visible,
  activeIndex,
  onNext,
  onPrev
}: {
  visible: boolean;
  activeIndex: number;
  onNext: () => void;
  onPrev: () => void;
}) {
  const btnClass = "pointer-events-auto cursor-pointer w-13 h-13 rounded-full bg-gradient-to-br from-white/15 to-white/5 hover:from-white/25 hover:to-white/10 backdrop-blur-lg border border-white/30 hover:border-white/50 text-white transition-all duration-300 active:scale-90 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] group disabled:opacity-0 disabled:pointer-events-none";
 
  const showPrev = visible && activeIndex > 0;
  const showNext = visible && activeIndex < CONE_DATA.length - 1;
 
  return (
    <Html fullscreen style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
       <div className={`absolute inset-0 flex items-center justify-between transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
         
          {/* LEFT ARROW */}
          <div className="pointer-events-auto flex items-center ml-3 md:ml-6 lg:ml-4">
             <button
               onClick={(e) => { e.stopPropagation(); onPrev(); }}
               disabled={!showPrev}
               className={`${btnClass} ${showPrev ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 pointer-events-none'}`}
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
         <div className="pointer-events-auto flex items-center -ml-6 md:-ml-10 lg:-ml-15">
             <button
               onClick={(e) => { e.stopPropagation(); onNext(); }}
               disabled={!showNext}
               className={`${btnClass} ${showNext ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}
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
  groupRotation
}: {
  activeIndex: number;
  visible: boolean;
  groupRotation: number;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const cardCircleRef = useRef<THREE.Mesh>(null);
  const coneCircleRef = useRef<THREE.Mesh>(null);
 
  const lineGeometry = React.useMemo(() => new THREE.BufferGeometry(), []);
  const lineMaterial = React.useMemo(() => new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 2,
    transparent: true,
    opacity: 0.8
  }), []);
 
  const circleGeometry = React.useMemo(() => new THREE.RingGeometry(0.08, 0.12, 16), []);
  const circleMaterial = React.useMemo(() => new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide
  }), []);
 
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
   
    const cardCenter = new THREE.Vector3(-4, -2.6, RADIUS);
    const cardEdgeOffset = 1.3; 
    const cardBorderPos = new THREE.Vector3(
      cardCenter.x + cardEdgeOffset,
      cardCenter.y,
      cardCenter.z
    );
   
    const activeAngle = (activeIndex / CONE_DATA.length) * Math.PI * 2;
    const actualAngle = activeAngle + groupRotation;
   
    const coneX = Math.sin(actualAngle) * RADIUS;
    const coneZ = Math.cos(actualAngle) * RADIUS;
    const conePos = new THREE.Vector3(coneX, 0, coneZ);
   
    const zOffset = 1.5; 
    const midPoint = new THREE.Vector3(
      coneX - zOffset,
      conePos.y,
      conePos.z
    );
   
    const positions = new Float32Array([
      cardBorderPos.x, cardBorderPos.y, cardBorderPos.z,  
      midPoint.x, midPoint.y, midPoint.z,                  
      conePos.x, conePos.y, conePos.z                     
    ]);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    lineGeometry.computeBoundingSphere();
   
    if (cardCircleRef.current) {
      cardCircleRef.current.position.copy(cardBorderPos);
      cardCircleRef.current.lookAt(0, 0, 0);
    }
   
    if (coneCircleRef.current) {
      coneCircleRef.current.position.copy(conePos);
      coneCircleRef.current.lookAt(0, 0, 0);
    }
  });
 
  React.useEffect(() => {
    if (!lineRef.current) {
      lineRef.current = new THREE.Line(lineGeometry, lineMaterial);
    }
  }, [lineGeometry, lineMaterial]);
 
  if (!visible) return null;
 
  return (
    <>
      {lineRef.current && <primitive object={lineRef.current} />}
      <mesh ref={cardCircleRef} geometry={circleGeometry} material={circleMaterial} />
      <mesh ref={coneCircleRef} geometry={circleGeometry} material={circleMaterial} />
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
 
 
function InfoCard({ activeIndex, visible }: { activeIndex: number; visible: boolean }) {
  const data = CONE_DATA[activeIndex];
 
  return (
    <group>
      <Html position={[-4, -2.6, RADIUS]} center transform={false} distanceFactor={10} className={`${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity duration-500 ease-in-out`}>
        <div className="w-64 h-[40px] bg-black/60 flex justify-center items-center flex-col backdrop-blur-md border border-white/20 p-4 rounded-lg text-white shadow-xl">
          <h2 className="text-xl font-bold mb-1 text-cyan-300">{data.title}</h2>
        </div>
      </Html>
    </group>
  );
}
 
interface CarouselSceneProps {
    scrollProgress: MotionValue<number>;
    onItemClick: (index: number) => void;
}

function SmokePlane({
  position,
  scale,
  rotation = [0, 0, 0],
  opacity = 0.06,
}: {
  position: [number, number, number];
  scale: [number, number];
  rotation?: [number, number, number];
  opacity?: number;
}) {
  const texture = useTexture("/textures/smoke-soft.png");
  if (texture) {
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  }
 
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={scale} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        color="#fff1e6"
      />
    </mesh>
  );
}
function DustParticles({
  count = 120,
}: {
  count?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
 
  const { positions, velocities, colors, seeds, bounds } = React.useMemo(() => {
    const cnt = count;
    const pos = new Float32Array(cnt * 3);
    const vel = new Float32Array(cnt * 3);
    const col = new Float32Array(cnt * 3);
    const sd = new Float32Array(cnt);
    const b = { x: 18, yMin: 0.5, yMax: 9, z: 14 };
 
    for (let i = 0; i < cnt; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * b.x * 2;
      pos[i * 3 + 1] = Math.random() * (b.yMax - b.yMin) + b.yMin;
      pos[i * 3 + 2] = (Math.random() - 0.5) * b.z * 2;
 
      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.006;
      vel[i * 3 + 1] = (Math.random() - 0.2) * 0.006;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.006;
 
      const t = 0.85 + Math.random() * 0.25;
      col[i * 3 + 0] = 1.0 * t; 
      col[i * 3 + 1] = 0.85 * t; 
      col[i * 3 + 2] = 0.7 * t; 
 
      sd[i] = Math.random() * Math.PI * 2;
    }
 
    return { positions: pos, velocities: vel, colors: col, seeds: sd, bounds: b };
  }, [count]);
 
  React.useEffect(() => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry as THREE.BufferGeometry;
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  }, [positions, colors]);
 
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const posAttr = (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute);
    const pos = posAttr.array as Float32Array;
    const cnt = count;
 
    for (let i = 0; i < cnt; i++) {
      const idx = i * 3;
 
      const phase = seeds[i];
      const driftStrength = 0.004; 
      const nx = Math.sin(t * 0.06 + phase) * driftStrength;
      const ny = Math.cos(t * 0.04 + phase * 1.1) * driftStrength * 0.7;
      const nz = Math.sin(t * 0.05 - phase) * driftStrength * 0.8;
 
      velocities[idx + 0] += nx * delta * 0.4;
      velocities[idx + 1] += ny * delta * 0.4;
      velocities[idx + 2] += nz * delta * 0.4;
 
      const pull = 0.003;
      velocities[idx + 0] += -pos[idx + 0] * pull * delta;
      velocities[idx + 2] += -pos[idx + 2] * pull * delta;
 
      velocities[idx + 0] = THREE.MathUtils.clamp(velocities[idx + 0], -0.03, 0.03);
      velocities[idx + 1] = THREE.MathUtils.clamp(velocities[idx + 1], -0.03, 0.03);
      velocities[idx + 2] = THREE.MathUtils.clamp(velocities[idx + 2], -0.03, 0.03);
 
      pos[idx + 0] += velocities[idx + 0] * (1 + Math.abs(Math.sin(phase + t)) * 0.25);
      pos[idx + 1] += velocities[idx + 1] * (1 + Math.abs(Math.cos(phase + t)) * 0.18);
      pos[idx + 2] += velocities[idx + 2] * (1 + Math.abs(Math.sin(phase - t)) * 0.25);
 
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
        size={0.03}
        color={"#ffd9b3"}
        transparent
        opacity={0.28}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function DramaticSpotlights({ active, target }: { active: boolean; target: THREE.Object3D }) {
  // 1. Refs for the lights
  const lightKeyRef = useRef<THREE.SpotLight>(null);
  const lightRimRef = useRef<THREE.SpotLight>(null);
  const lightTopRef = useRef<THREE.SpotLight>(null);

  useFrame((state, delta) => {
    // 2. Smoothly fade lights in/out
    const lerpSpeed = 2.5 * delta; // Slightly slower for a "premium" feel

    if (lightKeyRef.current) {
      // Main studio light - bright
      const targetIntensity = active ? 280 : 0; 
      lightKeyRef.current.intensity = THREE.MathUtils.lerp(lightKeyRef.current.intensity, targetIntensity, lerpSpeed);
    }

    if (lightRimRef.current) {
      // Back light - subtly separates object from black background
      const targetIntensity = active ? 200 : 0; 
      lightRimRef.current.intensity = THREE.MathUtils.lerp(lightRimRef.current.intensity, targetIntensity, lerpSpeed);
    }

    if (lightTopRef.current) {
      // Top down beam - highlights texture
      const targetIntensity = active ? 150 : 0; 
      lightTopRef.current.intensity = THREE.MathUtils.lerp(lightTopRef.current.intensity, targetIntensity, lerpSpeed);
    }
  });

  return (
    <>
      {/* KEY LIGHT (Front Left) - Warm Studio White */}
      {/* Gives the product a natural, rich look */}
      <spotLight
        ref={lightKeyRef}
        position={[-4, 5, RADIUS + 4]} 
        target={target}
        angle={0.4}
        penumbra={0.5} // Soft edges
        color="#fff0dd" // Very subtle warm white
        distance={30}
        decay={0.5}
        castShadow
      />

      {/* RIM LIGHT (Back Right) - Crisp Cool White */}
      {/* Creates a sharp white edge outline on the cone */}
      <spotLight
        ref={lightRimRef}
        position={[4, 6, RADIUS - 3]} 
        target={target}
        angle={0.5}
        penumbra={0.4}
        color="#e6f0ff" // Very subtle cool white
        distance={30}
        decay={0.5}
      />

      {/* TOP BEAM - Pure White */}
      {/* A tight beam directly above to make the label pop */}
      <spotLight
        ref={lightTopRef}
        position={[0, 8, RADIUS]} 
        target={target}
        angle={0.25} // Tighter angle = more "spotlight" feel
        penumbra={0.2}
        color="#ffffff"
        distance={25}
        decay={0.5}
      />
    </>
  );
}
 
 
function CarouselScene({ scrollProgress, onItemClick } : CarouselSceneProps) {
  const groupRef = useRef<Group>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showUI, setShowUI] = useState(false);
  const [isConeCentered, setIsConeCentered] = useState(false);
  const [showCardWithDelay, setShowCardWithDelay] = useState(false);
  const [groupRotation, setGroupRotation] = useState(0);
  const delayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const anglePerCone = (Math.PI * 2) / CONE_DATA.length;
 
  // CREATE TARGET FOR HERO SPOTLIGHT
  // The active cone always rotates to be at (0, 0, RADIUS). 
  // We place a target object there so our spotlight points exactly at it.
  const lightTarget = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(0, 0, RADIUS);
    return o;
  }, []);

  // Handle delay when cone becomes centered
  useEffect(() => {
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
      delayTimeoutRef.current = null;
    }
 
    if (!isConeCentered || !showUI) {
      setShowCardWithDelay(false);
      return;
    }
 
    delayTimeoutRef.current = setTimeout(() => {
      setShowCardWithDelay(true);
    }, 300);
 
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
    } else {
        if (!showUI) setShowUI(true);
 
        const carouselProgress = (currentScroll - ANIMATION_END) / (1 - ANIMATION_END);
        const rawStep = carouselProgress * (CONE_DATA.length);
        const currentStep = Math.min(Math.floor(rawStep), CONE_DATA.length - 1);
 
        if (currentStep !== activeIndex) {
            setActiveIndex(currentStep);
        }
 
        const targetRotation = -currentStep * anglePerCone;
        const lerpedRotation = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, 0.1);
        groupRef.current.rotation.y = lerpedRotation;
        setGroupRotation(lerpedRotation);
       
        const activeAngle = (activeIndex / CONE_DATA.length) * Math.PI * 2;
        const currentRotation = groupRef.current.rotation.y;
        const relativeAngle = activeAngle + currentRotation;
        const normalizedAngle = ((relativeAngle % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        const angleFromCenter = normalizedAngle > Math.PI ? (Math.PI * 2) - normalizedAngle : normalizedAngle;
        const centered = angleFromCenter < 0.15;
       
        if (centered !== isConeCentered) {
            setIsConeCentered(centered);
        }
    }
  });

  return (
    <>
      {/* ADD TARGET TO SCENE GRAPH SO IT WORKS */}
      <primitive object={lightTarget} />

      {/* These will fade in ONLY when the cone is centered */}
      <DramaticSpotlights 
        active={isConeCentered} 
        target={lightTarget} 
      />

      {/* --- ADD GOD RAYS HERE --- */}
      {/* Placed at active cone position (RADIUS) but offset back by 3 units so it sits behind */}
      <GodRays 
        position={[0, -2, RADIUS - 3]} 
        radius={3} 
        height={12} 
        color="#ffaa00" // Orange color
      />

      {/* STEP 3 — DARK AIR CONTAINER (THE ROOM) */}
      <mesh scale={60}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          side={THREE.BackSide}
          color="#05070c"
          roughness={1}
        />
      </mesh>
 
      {/* BACKGROUND SHAPING LIGHTS */}
      <spotLight
        position={[6, 9, -6]}
        angle={0.3}
        penumbra={1}
        intensity={1.4}
        color="#ffb07a"
      />
      
      <spotLight
        position={[-7, 6, -5]}
        angle={0.38}
        penumbra={1}
        intensity={0.9}
        color="#6fa8ff"
      />
      
      <spotLight
        position={[4, 7, 9]}
        intensity={260}
        distance={40}
        decay={1}
        angle={0.4}
        penumbra={0.45}
        color="#ffb36b"
        castShadow
      />
 
      {/* --- HERO SPOTLIGHT FOR CENTER CONE --- */}
      {/* High intensity, targeted directly at the center cone (RADIUS) */}
      <spotLight
        position={[0, 4, 14]}
        target={lightTarget}
        intensity={150}
        distance={30}
        decay={1}
        angle={0.5}
        penumbra={1}
        color="#ffffff"
        castShadow
      />

      {/* SIDE LIGHT */}
      <directionalLight
        position={[8, 4, 4]}        
        intensity={1.2}
        color="#fff7ea"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* FILL LIGHT */}
      <directionalLight
        position={[-6, 3, -3]}
        intensity={0.35}
        color="#dfeeff"
      />
      
      {/* BOTTOM UP LIGHT */}
      <directionalLight
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
      />

      {/* STEP 7 — BACKGROUND SMOKE */}
      <SmokePlane
        position={[0, 5, -8]}
        scale={[36, 22]}
        opacity={0.045}
      />
      
      <SmokePlane
        position={[-6, 4, -6]}
        scale={[30, 20]}
        opacity={0.04}
      />
      
      <SmokePlane
        position={[6, 4, -6]}
        scale={[30, 20]}
        opacity={0.04}
      />
      
      {/* STEP 7 — FOREGROUND DEPTH */}
      <SmokePlane
        position={[0, 3, 2]}
        scale={[20, 14]}
        opacity={0.075}
      />

      {/* STEP 8 — DUST PARTICLES */}
      <DustParticles count={90} />
 
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
 
      <group ref={groupRef}>
        {CONE_DATA.map((data, i) => {
          const angle = (i / CONE_DATA.length) * Math.PI * 2;
          const isLeft = i % 2 === 0;
          return (
            <CarouselItem
              key={i} index={i} isLeft={isLeft} angle={angle}
              scrollProgress={scrollProgress} url={data.url} modelScale={data.scale} rotationOffset={data.rotationOffset}
            />
          );
        })}
      </group>
      <ContactShadows opacity={0.4} scale={15} blur={2.4} far={4.5} />
    </>
  );
}
 
interface CarouselItemProps {
  index: number;
  isLeft: boolean;
  angle: number;
  scrollProgress: MotionValue<number>;
  url: string;
  modelScale: number;
  rotationOffset: number;
}
 
function CarouselItem({ index, isLeft, angle, scrollProgress, url, modelScale, rotationOffset }: CarouselItemProps) {
  const itemRef = useRef<Group>(null);
  const targetX = Math.sin(angle) * RADIUS;
  const targetZ = Math.cos(angle) * RADIUS;
  const startX = isLeft ? -ENTRANCE_OFFSET : ENTRANCE_OFFSET;
 
  const x = useTransform(scrollProgress, [0, ANIMATION_END], [startX, targetX]);
  const tumbleX = useTransform(scrollProgress, [0, ANIMATION_END], [Math.PI * (index + 2), 0]);
  const tumbleY = useTransform(scrollProgress, [0, ANIMATION_END], [Math.PI * (index * -1), 0]);
  const tumbleZ = useTransform(scrollProgress, [0, ANIMATION_END], [Math.PI * 5, 0]);
  const animationScale = useTransform(scrollProgress, [0, ANIMATION_END - 0.1], [0, 1]);
 
  useFrame(() => {
    if (itemRef.current) {
      if (scrollProgress.get() > ANIMATION_END) {
        itemRef.current.position.set(targetX, 0, targetZ);
        itemRef.current.scale.setScalar(1);
        itemRef.current.rotation.x = 0;
        itemRef.current.rotation.y = angle + Math.PI + rotationOffset;
        itemRef.current.rotation.z = 0;
      } else {
        itemRef.current.position.set(x.get(), 0, targetZ);
        itemRef.current.scale.setScalar(animationScale.get());
        itemRef.current.rotation.x = tumbleX.get();
        itemRef.current.rotation.y = tumbleY.get() + angle + Math.PI + rotationOffset;
        itemRef.current.rotation.z = tumbleZ.get();
      }
    }
  });
 
  return (
    <group ref={itemRef}>
      <Cone url={url} scale={modelScale} />
    </group>
  );
}
 
export default function CarouselCanvas({
  scrollProgress,
  onItemClick,
}: {
  scrollProgress: MotionValue<number>;
  onItemClick: (index: number) => void;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      camera={{ position: [0, 2, 18], fov: 35 }}
    >
      <React.Suspense fallback={<Loader />}>
        <CameraRig>
          <CarouselScene
            scrollProgress={scrollProgress}
            onItemClick={onItemClick}
          />
        </CameraRig>
      </React.Suspense>
    </Canvas>
  );
}
 

// // "use client";
 
// // import React, { useMemo, useRef, useState, useEffect } from "react";
// // import { Canvas, useFrame } from "@react-three/fiber";
// // import { useTransform, MotionValue } from "framer-motion";
// // import { Environment, ContactShadows, Html, useProgress } from "@react-three/drei";
// // import * as THREE from "three";
// // import { Cone } from "./Cone";
// // import type { Group } from "three";
 
// // // --- EXPORT CONFIGURATION for Page.tsx to use ---
// // export const RADIUS = 6.5;
// // export const ENTRANCE_OFFSET = 12;
// // export const ANIMATION_END = 0.35;
 
// // export const CONE_DATA = [
// //   { id: 1, title: "Beige Cone", description: "Smooth matte finish", url: "/3d-cones/straight/beige_cone.glb", scale: 46, rotationOffset: 2.7 },
// //   { id: 2, title: "Black Obsidian", description: "Dark reflective surface", url: "/3d-cones/straight/black_cone_v01.glb", scale: 47, rotationOffset: 2.7 },
// //   { id: 3, title: "White Roll", description: "Clean minimal design", url: "/3d-cones/straight/white roll.glb", scale: 1, rotationOffset: 4.5 },
// //   { id: 4, title: "Brown Texture", description: "Organic material feel", url: "/3d-cones/brown roll.glb", scale: 1.5, rotationOffset: 1.7 },
// //   { id: 5, title: "Glass Filter", description: "Transparent optics", url: "/3d-cones/straight/Cone Glass Filter.glb", scale: 0.5, rotationOffset: 4.12 },
// //   { id: 6, title: "Industrial Roll", description: "Heavy duty manufacturing", url: "/3d-cones/straight/Roll 1.glb", scale: 40, rotationOffset: 0.7 },
// //   { id: 7, title: "Blue Steel", description: "Cold rolled steel", url: "/3d-cones/straight/Roll 2glb.glb", scale: 40, rotationOffset: 0.7 },
// //   { id: 8, title: "Clear Plastic", description: "High durability polymer", url: "/3d-cones/straight/Transparent Cone.glb", scale: 3.2, rotationOffset: 0 },
// // ];
 
// // function Loader() {
// //   const { progress } = useProgress();
// //   return <Html center className="text-white font-mono">{progress.toFixed(0)}%</Html>;
// // }
 
// // // --- NAV ARROWS ---
// // function NavArrows({
// //   visible,
// //   activeIndex,
// //   onNext,
// //   onPrev
// // }: {
// //   visible: boolean;
// //   activeIndex: number;
// //   onNext: () => void;
// //   onPrev: () => void;
// // }) {
// //   const btnClass = "pointer-events-auto cursor-pointer w-13 h-13 rounded-full bg-gradient-to-br from-white/15 to-white/5 hover:from-white/25 hover:to-white/10 backdrop-blur-lg border border-white/30 hover:border-white/50 text-white transition-all duration-300 active:scale-90 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] group disabled:opacity-0 disabled:pointer-events-none";
 
// //   const showPrev = visible && activeIndex > 0;
// //   const showNext = visible && activeIndex < CONE_DATA.length - 1;
 
// //   return (
// //     <Html fullscreen style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
// //        <div className={`absolute inset-0 flex items-center justify-between transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
         
// //           {/* LEFT ARROW */}
// //           <div className="pointer-events-auto flex items-center ml-3 md:ml-6 lg:ml-4">
// //              <button
// //                onClick={(e) => { e.stopPropagation(); onPrev(); }}
// //                disabled={!showPrev}
// //                className={`${btnClass} ${showPrev ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 pointer-events-none'}`}
// //                aria-label="Previous cone"
// //              >
// //                 <svg
// //                   width="28"
// //                   height="28"
// //                   viewBox="0 0 24 24"
// //                   fill="none"
// //                   stroke="currentColor"
// //                   strokeWidth="2.5"
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   className="group-hover:translate-x-[-2px] transition-transform duration-300"
// //                 >
// //                   <path d="M15 18l-6-6 6-6" />
// //                 </svg>
// //              </button>
// //           </div>
 
// //           {/* RIGHT ARROW */}
// //          <div className="pointer-events-auto flex items-center -ml-6 md:-ml-10 lg:-ml-15">
// //              <button
// //                onClick={(e) => { e.stopPropagation(); onNext(); }}
// //                disabled={!showNext}
// //                className={`${btnClass} ${showNext ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}
// //                aria-label="Next cone"
// //              >
// //                 <svg
// //                   width="28"
// //                   height="28"
// //                   viewBox="0 0 24 24"
// //                   fill="none"
// //                   stroke="currentColor"
// //                   strokeWidth="2.5"
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   className="group-hover:translate-x-[2px] transition-transform duration-300"
// //                 >
// //                   <path d="M9 18l6-6-6-6" />
// //                 </svg>
// //              </button>
// //           </div>
// //        </div>
// //     </Html>
// //   );
// // }
 
// // function ConnectionArrow({
// //   activeIndex,
// //   visible,
// //   groupRotation
// // }: {
// //   activeIndex: number;
// //   visible: boolean;
// //   groupRotation: number;
// // }) {
// //   const lineRef = useRef<THREE.Line>(null);
// //   const cardCircleRef = useRef<THREE.Mesh>(null);
// //   const coneCircleRef = useRef<THREE.Mesh>(null);
 
// //   const lineGeometry = React.useMemo(() => new THREE.BufferGeometry(), []);
// //   const lineMaterial = React.useMemo(() => new THREE.LineBasicMaterial({
// //     color: 0xffffff,
// //     linewidth: 2,
// //     transparent: true,
// //     opacity: 0.8
// //   }), []);
 
// //   const circleGeometry = React.useMemo(() => new THREE.RingGeometry(0.08, 0.12, 16), []);
// //   const circleMaterial = React.useMemo(() => new THREE.MeshBasicMaterial({
// //     color: 0xffffff,
// //     transparent: true,
// //     opacity: 0.9,
// //     side: THREE.DoubleSide
// //   }), []);
 
// //   useFrame(() => {
// //     if (!visible) {
// //       if (lineRef.current) lineRef.current.visible = false;
// //       if (cardCircleRef.current) cardCircleRef.current.visible = false;
// //       if (coneCircleRef.current) coneCircleRef.current.visible = false;
// //       return;
// //     }
   
// //     if (lineRef.current) lineRef.current.visible = true;
// //     if (cardCircleRef.current) cardCircleRef.current.visible = true;
// //     if (coneCircleRef.current) coneCircleRef.current.visible = true;
   
// //     const cardCenter = new THREE.Vector3(-4, -2.6, RADIUS);
// //     const cardEdgeOffset = 1.3;
// //     const cardBorderPos = new THREE.Vector3(
// //       cardCenter.x + cardEdgeOffset,
// //       cardCenter.y,
// //       cardCenter.z
// //     );
   
// //     const activeAngle = (activeIndex / CONE_DATA.length) * Math.PI * 2;
// //     const actualAngle = activeAngle + groupRotation;
   
// //     const coneX = Math.sin(actualAngle) * RADIUS;
// //     const coneZ = Math.cos(actualAngle) * RADIUS;
// //     const conePos = new THREE.Vector3(coneX, 0, coneZ);
   
// //     const zOffset = 1.5;
// //     const midPoint = new THREE.Vector3(
// //       coneX - zOffset,
// //       conePos.y,
// //       conePos.z
// //     );
   
// //     const positions = new Float32Array([
// //       cardBorderPos.x, cardBorderPos.y, cardBorderPos.z,
// //       midPoint.x, midPoint.y, midPoint.z,
// //       conePos.x, conePos.y, conePos.z
// //     ]);
// //     lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
// //     lineGeometry.computeBoundingSphere();
   
// //     if (cardCircleRef.current) {
// //       cardCircleRef.current.position.copy(cardBorderPos);
// //       cardCircleRef.current.lookAt(0, 0, 0);
// //     }
   
// //     if (coneCircleRef.current) {
// //       coneCircleRef.current.position.copy(conePos);
// //       coneCircleRef.current.lookAt(0, 0, 0);
// //     }
// //   });
 
// //   React.useEffect(() => {
// //     if (!lineRef.current) {
// //       lineRef.current = new THREE.Line(lineGeometry, lineMaterial);
// //     }
// //   }, [lineGeometry, lineMaterial]);
 
// //   if (!visible) return null;
 
// //   return (
// //     <>
// //       {lineRef.current && <primitive object={lineRef.current} />}
// //       <mesh ref={cardCircleRef} geometry={circleGeometry} material={circleMaterial} />
// //       <mesh ref={coneCircleRef} geometry={circleGeometry} material={circleMaterial} />
// //     </>
// //   );
// // }
 
// // function CameraRig({ children }: { children: React.ReactNode }) {
// //   const rigRef = useRef<THREE.Group>(null);
 
// //   useFrame(({ clock }) => {
// //     if (!rigRef.current) return;
// //     const t = clock.elapsedTime;
// //     rigRef.current.position.x = Math.sin(t * 0.12) * 0.08;
// //     rigRef.current.position.y = Math.sin(t * 0.18) * 0.05;
// //     rigRef.current.rotation.y = Math.sin(t * 0.1) * 0.01;
// //   });
 
// //   return <group ref={rigRef}>{children}</group>;
// // }
 
// // function InfoCard({ activeIndex, visible }: { activeIndex: number; visible: boolean }) {
// //   const data = CONE_DATA[activeIndex];
 
// //   return (
// //     <group>
// //       <Html position={[-4, -2.6, RADIUS]} center transform={false} distanceFactor={10} className={`${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity duration-500 ease-in-out`}>
// //         <div className="w-64 h-[40px] bg-black/60 flex justify-center items-center flex-col backdrop-blur-md border border-white/20 p-4 rounded-lg text-white shadow-xl">
// //           <h2 className="text-xl font-bold mb-1 text-cyan-300">{data.title}</h2>
// //         </div>
// //       </Html>
// //     </group>
// //   );
// // }
 
// // interface CarouselSceneProps {
// //     scrollProgress: MotionValue<number>;
// //     onItemClick: (index: number) => void;
// // }
// // import { useTexture } from "@react-three/drei";
 
// // function SmokePlane({
// //   position,
// //   scale,
// //   rotation = [0, 0, 0],
// //   opacity = 0.06,
// // }: {
// //   position: [number, number, number];
// //   scale: [number, number];
// //   rotation?: [number, number, number];
// //   opacity?: number;
// // }) {
// //   const texture = useTexture("/textures/smoke-soft.png");
// //   if (texture) {
// //     texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
// //   }
 
// //   return (
// //     <mesh position={position} rotation={rotation}>
// //       <planeGeometry args={scale} />
// //       <meshBasicMaterial
// //         map={texture}
// //         transparent
// //         opacity={opacity}
// //         depthWrite={false}
// //         color="#fff1e6"
// //       />
// //     </mesh>
// //   );
// // }
// // function DustParticles({
// //   count = 80,
// // }: {
// //   count?: number;
// // }) {
// //   const pointsRef = useRef<THREE.Points>(null);
 
// //   const positions = React.useMemo(() => {
// //     const arr = new Float32Array(count * 3);
// //     for (let i = 0; i < count; i++) {
// //       arr[i * 3 + 0] = (Math.random() - 0.5) * 14; 
// //       arr[i * 3 + 1] = Math.random() * 6 + 1;     
// //       arr[i * 3 + 2] = (Math.random() - 0.5) * 10; 
// //     }
// //     return arr;
// //   }, [count]);
 
// //   useFrame((_, delta) => {
// //     if (!pointsRef.current) return;
// //     const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
// //     for (let i = 0; i < count; i++) {
// //       pos[i * 3 + 1] += delta * 0.15; 
// //       if (pos[i * 3 + 1] > 7) pos[i * 3 + 1] = 1;
// //     }
// //     pointsRef.current.geometry.attributes.position.needsUpdate = true;
// //   });
 
// //   return (
// //     <points ref={pointsRef}>
// //       <bufferGeometry>
// //         <bufferAttribute
// //           attach="attributes-position"
// //           args={[positions, 3]}
// //           count={positions.length / 3}
// //           itemSize={3}
// //         />
// //       </bufferGeometry>
// //       <pointsMaterial
// //         size={0.03}
// //         color="#ffd9b3"
// //         transparent
// //         opacity={0.35}
// //         depthWrite={false}
// //         sizeAttenuation
// //       />
// //     </points>
// //   );
// // }
 
// // function CarouselScene({ scrollProgress, onItemClick } : CarouselSceneProps) {
// //   const groupRef = useRef<Group>(null);
// //   const [activeIndex, setActiveIndex] = useState(0);
// //   const [showUI, setShowUI] = useState(false);
// //   const [isConeCentered, setIsConeCentered] = useState(false);
// //   const [showCardWithDelay, setShowCardWithDelay] = useState(false);
// //   const [groupRotation, setGroupRotation] = useState(0);
// //   const delayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
// //   const anglePerCone = (Math.PI * 2) / CONE_DATA.length;
 
// //   useEffect(() => {
// //     if (delayTimeoutRef.current) {
// //       clearTimeout(delayTimeoutRef.current);
// //       delayTimeoutRef.current = null;
// //     }
// //     if (!isConeCentered || !showUI) {
// //       setShowCardWithDelay(false);
// //       return;
// //     }
// //     delayTimeoutRef.current = setTimeout(() => {
// //       setShowCardWithDelay(true);
// //     }, 300);
// //     return () => {
// //       if (delayTimeoutRef.current) {
// //         clearTimeout(delayTimeoutRef.current);
// //         delayTimeoutRef.current = null;
// //       }
// //     };
// //   }, [isConeCentered, showUI, activeIndex]);
 
// //   useFrame(() => {
// //     if (!groupRef.current) return;
// //     const currentScroll = scrollProgress.get();
 
// //     if (currentScroll < ANIMATION_END) {
// //         if (showUI) setShowUI(false);
// //         if (isConeCentered) setIsConeCentered(false);
// //         groupRef.current.rotation.y = 0;
// //     } else {
// //         if (!showUI) setShowUI(true);
 
// //         const carouselProgress = (currentScroll - ANIMATION_END) / (1 - ANIMATION_END);
// //         const rawStep = carouselProgress * (CONE_DATA.length);
// //         const currentStep = Math.min(Math.floor(rawStep), CONE_DATA.length - 1);
 
// //         if (currentStep !== activeIndex) {
// //             setActiveIndex(currentStep);
// //         }
 
// //         const targetRotation = -currentStep * anglePerCone;
// //         const lerpedRotation = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, 0.1);
// //         groupRef.current.rotation.y = lerpedRotation;
// //         setGroupRotation(lerpedRotation);
       
// //         const activeAngle = (activeIndex / CONE_DATA.length) * Math.PI * 2;
// //         const currentRotation = groupRef.current.rotation.y;
// //         const relativeAngle = activeAngle + currentRotation;
// //         const normalizedAngle = ((relativeAngle % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
// //         const angleFromCenter = normalizedAngle > Math.PI ? (Math.PI * 2) - normalizedAngle : normalizedAngle;
// //         const centered = angleFromCenter < 0.15;
       
// //         if (centered !== isConeCentered) {
// //             setIsConeCentered(centered);
// //         }
// //     }
// //   });

// // return (
// //   <>
// //     {/* STEP 3 — DARK AIR CONTAINER (THE ROOM) */}
// //     <mesh scale={60}>
// //       <sphereGeometry args={[1, 64, 64]} />
// //       <meshStandardMaterial
// //         side={THREE.BackSide}
// //         color="#05070c"
// //         roughness={1}
// //       />
// //     </mesh>
 
// //     {/* BACKGROUND SHAPING LIGHTS */}
// //     <spotLight
// //       position={[6, 9, -6]}
// //       angle={0.3}
// //       penumbra={1}
// //       intensity={1.4}
// //       color="#ffb07a"
// //     />
    
// //     <spotLight
// //       position={[-7, 6, -5]}
// //       angle={0.38}
// //       penumbra={1}
// //       intensity={0.9}
// //       color="#6fa8ff"
// //     />
 
// //     {/* STEP 5 — FLOOR */}
// //     {/* <mesh
// //       rotation={[-Math.PI / 2, 0, 0]}
// //       position={[0, -0.01, 0]}
// //       receiveShadow
// //     >
// //       <planeGeometry args={[80, 80]} />
// //       <meshStandardMaterial
// //         color="#06080d"
// //         roughness={0.35}
// //         metalness={0.15}
// //       />
// //     </mesh> */}

// //     {/* --- KEY LIGHT FIX --- */}
// //     {/* Widened angle (1.0) and moved back in Z (14) to better illuminate the entire cone length, including filter */}
// //     <spotLight
// //       position={[5, 6, 14]}
// //       intensity={220}
// //       distance={50}
// //       decay={1}
// //       angle={1.0}
// //       penumbra={1}
// //       color="#ffb36b"
// //       castShadow
// //     />
    
// //     {/* Side Light */}
// //     <directionalLight
// //       position={[8, 4, 4]}       
// //       intensity={1.2}
// //       color="#fff7ea"
// //       castShadow
// //       shadow-mapSize-width={1024}
// //       shadow-mapSize-height={1024}
// //       shadow-camera-near={0.5}
// //       shadow-camera-far={40}
// //       shadow-camera-left={-10}
// //       shadow-camera-right={10}
// //       shadow-camera-top={10}
// //       shadow-camera-bottom={-10}
// //     />
    
// //     {/* Fill Light */}
// //     <directionalLight
// //       position={[-6, 3, -3]}
// //       intensity={0.35}
// //       color="#dfeeff"
// //     />
    
// //     {/* --- BOTTOM FILTER LIGHT FIX --- */}
// //     {/* Moved from [0, -6, 0] to [0, -4, 12]. Now it shines from the FRONT-bottom, 
// //         directly illuminating the lower filter section which was previously in shadow. */}
// //     <directionalLight
// //       position={[0, -4, 12]}
// //       intensity={1.2}
// //       color="#fff9f0"
// //       castShadow
// //     />

// //     {/* STEP 7 — BACKGROUND SMOKE */}
// //     <SmokePlane position={[0, 5, -8]} scale={[36, 22]} opacity={0.045} />
// //     <SmokePlane position={[-6, 4, -6]} scale={[30, 20]} opacity={0.04} />
// //     <SmokePlane position={[6, 4, -6]} scale={[30, 20]} opacity={0.04} />
// //     <SmokePlane position={[0, 3, 2]} scale={[20, 14]} opacity={0.075} />
    
// //     {/* STEP 8 — DUST */}
// //     <DustParticles count={90} />
 
// //     <InfoCard activeIndex={activeIndex} visible={showCardWithDelay} />
    
// //     <ConnectionArrow
// //       activeIndex={activeIndex}
// //       visible={showCardWithDelay}
// //       groupRotation={groupRotation}
// //     />
 
// //     <NavArrows
// //       visible={showUI}
// //       activeIndex={activeIndex}
// //       onNext={() => onItemClick(activeIndex + 1)}
// //       onPrev={() => onItemClick(activeIndex - 1)}
// //     />
 
// //     <group ref={groupRef}>
// //       {CONE_DATA.map((data, i) => {
// //         const angle = (i / CONE_DATA.length) * Math.PI * 2;
// //         const isLeft = i % 2 === 0;
// //         return (
// //           <CarouselItem
// //             key={i} index={i} isLeft={isLeft} angle={angle}
// //             scrollProgress={scrollProgress} url={data.url} modelScale={data.scale} rotationOffset={data.rotationOffset}
// //           />
// //         );
// //       })}
// //     </group>
// //     <ContactShadows opacity={0.4} scale={15} blur={2.4} far={4.5} />
// //   </>
// // );
// // }
 
// // interface CarouselItemProps {
// //   index: number;
// //   isLeft: boolean;
// //   angle: number;
// //   scrollProgress: MotionValue<number>;
// //   url: string;
// //   modelScale: number;
// //   rotationOffset: number;
// // }
 
// // function CarouselItem({ index, isLeft, angle, scrollProgress, url, modelScale, rotationOffset }: CarouselItemProps) {
// //   const itemRef = useRef<Group>(null);
// //   const targetX = Math.sin(angle) * RADIUS;
// //   const targetZ = Math.cos(angle) * RADIUS;
// //   const startX = isLeft ? -ENTRANCE_OFFSET : ENTRANCE_OFFSET;
 
// //   const x = useTransform(scrollProgress, [0, ANIMATION_END], [startX, targetX]);
// //   const tumbleX = useTransform(scrollProgress, [0, ANIMATION_END], [Math.PI * (index + 2), 0]);
// //   const tumbleY = useTransform(scrollProgress, [0, ANIMATION_END], [Math.PI * (index * -1), 0]);
// //   const tumbleZ = useTransform(scrollProgress, [0, ANIMATION_END], [Math.PI * 5, 0]);
// //   const animationScale = useTransform(scrollProgress, [0, ANIMATION_END - 0.1], [0, 1]);
 
// //   useFrame(() => {
// //     if (itemRef.current) {
// //       if (scrollProgress.get() > ANIMATION_END) {
// //         itemRef.current.position.set(targetX, 0, targetZ);
// //         itemRef.current.scale.setScalar(1);
// //         itemRef.current.rotation.x = 0;
// //         itemRef.current.rotation.y = angle + Math.PI + rotationOffset;
// //         itemRef.current.rotation.z = 0;
// //       } else {
// //         itemRef.current.position.set(x.get(), 0, targetZ);
// //         itemRef.current.scale.setScalar(animationScale.get());
// //         itemRef.current.rotation.x = tumbleX.get();
// //         itemRef.current.rotation.y = tumbleY.get() + angle + Math.PI + rotationOffset;
// //         itemRef.current.rotation.z = tumbleZ.get();
// //       }
// //     }
// //   });
 
// //   return (
// //     <group ref={itemRef}>
// //       <Cone url={url} scale={modelScale} />
// //     </group>
// //   );
// // }
 
// // export default function CarouselCanvas({
// //   scrollProgress,
// //   onItemClick,
// // }: {
// //   scrollProgress: MotionValue<number>;
// //   onItemClick: (index: number) => void;
// // }) {
// //   return (
// //     <Canvas
// //       shadows
// //       dpr={[1, 1.5]}
// //       gl={{
// //         toneMapping: THREE.ACESFilmicToneMapping,
// //         outputColorSpace: THREE.SRGBColorSpace,
// //       }}
// //       camera={{ position: [0, 2, 18], fov: 35 }}
// //     >
// //       <React.Suspense fallback={<Loader />}>
// //         <CameraRig>
// //           <CarouselScene
// //             scrollProgress={scrollProgress}
// //             onItemClick={onItemClick}
// //           />
// //         </CameraRig>
// //       </React.Suspense>
// //     </Canvas>
// //   );
// // }
// // "use client";

// // import React, { useRef, useState, useEffect } from "react";
// // import { Canvas, useFrame } from "@react-three/fiber";
// // import { useTransform, MotionValue } from "framer-motion";
// // import { Environment, ContactShadows, Html, useProgress, useGLTF } from "@react-three/drei";
// // import * as THREE from "three";
// // import { Cone } from "./Cone"; 
// // import { BackgroundSphere, AtmosphericSmoke, CinematicLights } from "./Atmosphere";
// // import type { Group } from "three";

// // // --- EXPORT CONFIGURATION for Page.tsx to use ---
// // export const RADIUS = 6.5; 
// // export const ENTRANCE_OFFSET = 12; 
// // export const ANIMATION_END = 0.35; 

// // export const CONE_DATA = [
// //   { id: 1, title: "Beige Cone", description: "Smooth matte finish", url: "/3d-cones/straight/beige_cone.glb", scale: 46, rotationOffset: 1.9 },
// //   { id: 2, title: "Black Obsidian", description: "Dark reflective surface", url: "/3d-cones/straight/black_cone_v01.glb", scale: 47, rotationOffset: 1.8 },
// //   { id: 3, title: "White Roll", description: "Clean minimal design", url: "/3d-cones/straight/white roll.glb", scale: 1, rotationOffset: 3.5 },
// //   { id: 4, title: "Brown Texture", description: "Organic material feel", url: "/3d-cones/brown roll.glb", scale: 1.5, rotationOffset: 0.2 },
// //   { id: 5, title: "Glass Filter", description: "Transparent optics", url: "/3d-cones/straight/Cone Glass Filter.glb", scale: 0.5, rotationOffset: 3.62 },
// //   { id: 6, title: "Industrial Roll", description: "Heavy duty manufacturing", url: "/3d-cones/straight/Roll 1.glb", scale: 40, rotationOffset: 0.1 },
// //   { id: 7, title: "Blue Steel", description: "Cold rolled steel", url: "/3d-cones/straight/Roll 2glb.glb", scale: 40, rotationOffset: 0.7 },
// //   { id: 8, title: "Clear Plastic", description: "High durability polymer", url: "/3d-cones/straight/Transparent Cone.glb", scale: 3.2, rotationOffset: 5 },
// // ];

// // CONE_DATA.forEach((cone) => useGLTF.preload(cone.url));

// // function Loader() {
// //   const { progress } = useProgress();
// //   return <Html center className="text-white font-mono">{progress.toFixed(0)}%</Html>;
// // }

// // // --- NAV ARROWS ---
// // function NavArrows({ 
// //   visible, 
// //   activeIndex, 
// //   onNext, 
// //   onPrev 
// // }: { 
// //   visible: boolean; 
// //   activeIndex: number; 
// //   onNext: () => void; 
// //   onPrev: () => void; 
// // }) {
// //   // Base button styles with improved design
// //   const btnClass = "pointer-events-auto cursor-pointer w-13 h-13 rounded-full bg-gradient-to-br from-white/15 to-white/5 hover:from-white/25 hover:to-white/10 backdrop-blur-lg border border-white/30 hover:border-white/50 text-white transition-all duration-300 active:scale-90 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] group disabled:opacity-0 disabled:pointer-events-none";
  
// //   // Logic: Hide Prev if first, Hide Next if last
// //   const showPrev = visible && activeIndex > 0;
// //   const showNext = visible && activeIndex < CONE_DATA.length - 1;

// //   return (
// //     <Html fullscreen style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
// //        <div className={`absolute inset-0 flex items-center justify-between transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          
// //           {/* LEFT ARROW */}
// //           <div className="pointer-events-auto flex items-center ml-3 md:ml-6 lg:ml-4">

// //              <button 
// //                onClick={(e) => { e.stopPropagation(); onPrev(); }}
// //                disabled={!showPrev}
// //                className={`${btnClass} ${showPrev ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 pointer-events-none'}`}
// //                aria-label="Previous cone"
// //              >
// //                 <svg 
// //                   width="28" 
// //                   height="28" 
// //                   viewBox="0 0 24 24" 
// //                   fill="none" 
// //                   stroke="currentColor" 
// //                   strokeWidth="2.5" 
// //                   strokeLinecap="round" 
// //                   strokeLinejoin="round"
// //                   className="group-hover:translate-x-[-2px] transition-transform duration-300"
// //                 >
// //                   <path d="M15 18l-6-6 6-6" />
// //                 </svg>
// //              </button>
// //           </div>

// //           {/* RIGHT ARROW */}
// //          <div className="pointer-events-auto flex items-center -ml-6 md:-ml-10 lg:-ml-15">



// //              <button 
// //                onClick={(e) => { e.stopPropagation(); onNext(); }}
// //                disabled={!showNext}
// //                className={`${btnClass} ${showNext ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}
// //                aria-label="Next cone"
// //              >
// //                 <svg 
// //                   width="28" 
// //                   height="28" 
// //                   viewBox="0 0 24 24" 
// //                   fill="none" 
// //                   stroke="currentColor" 
// //                   strokeWidth="2.5" 
// //                   strokeLinecap="round" 
// //                   strokeLinejoin="round"
// //                   className="group-hover:translate-x-[2px] transition-transform duration-300"
// //                 >
// //                   <path d="M9 18l6-6-6-6" />
// //                 </svg>
// //              </button>
// //           </div>
// //        </div>
// //     </Html>
// //   );
// // }

// // // Arrow component that connects card to cone with Z-shaped path
// // function ConnectionArrow({ 
// //   activeIndex, 
// //   visible, 
// //   groupRotation 
// // }: { 
// //   activeIndex: number; 
// //   visible: boolean; 
// //   groupRotation: number;
// // }) {
// //   const lineRef = useRef<THREE.Line>(null);
// //   const cardCircleRef = useRef<THREE.Mesh>(null);
// //   const coneCircleRef = useRef<THREE.Mesh>(null);
  
// //   // Create geometry and material once
// //   const lineGeometry = React.useMemo(() => new THREE.BufferGeometry(), []);
// //   const lineMaterial = React.useMemo(() => new THREE.LineBasicMaterial({ 
// //     color: 0xffffff, 
// //     linewidth: 2,
// //     transparent: true,
// //     opacity: 0.8
// //   }), []);
  
// //   // Circle geometry and material for indicators
// //   const circleGeometry = React.useMemo(() => new THREE.RingGeometry(0.08, 0.12, 16), []);
// //   const circleMaterial = React.useMemo(() => new THREE.MeshBasicMaterial({ 
// //     color: 0xffffff, 
// //     transparent: true,
// //     opacity: 0.9,
// //     side: THREE.DoubleSide
// //   }), []);
  
// //   useFrame(() => {
// //     if (!visible) {
// //       if (lineRef.current) lineRef.current.visible = false;
// //       if (cardCircleRef.current) cardCircleRef.current.visible = false;
// //       if (coneCircleRef.current) coneCircleRef.current.visible = false;
// //       return;
// //     }
    
// //     if (lineRef.current) lineRef.current.visible = true;
// //     if (cardCircleRef.current) cardCircleRef.current.visible = true;
// //     if (coneCircleRef.current) coneCircleRef.current.visible = true;
    
// //     // Card center position
// //     const cardCenter = new THREE.Vector3(-4, -2.6, RADIUS);
    
// //     // Calculate card right border position (card is w-64 = 256px, with distanceFactor=10, so ~1.3 units half-width)
// //     const cardEdgeOffset = 1.3; // Half width of card in 3D space
// //     const cardBorderPos = new THREE.Vector3(
// //       cardCenter.x + cardEdgeOffset,
// //       cardCenter.y,
// //       cardCenter.z
// //     );
    
// //     // Calculate active cone's angle
// //     const activeAngle = (activeIndex / CONE_DATA.length) * Math.PI * 2;
// //     // Apply group rotation to get actual position
// //     const actualAngle = activeAngle + groupRotation;
    
// //     // Cone position on the circle
// //     const coneX = Math.sin(actualAngle) * RADIUS;
// //     const coneZ = Math.cos(actualAngle) * RADIUS;
// //     const conePos = new THREE.Vector3(coneX, 0, coneZ);
    
// //     // Create Z-shaped path: start from card border (hiding the lower horizontal line)
// //     // Horizontal segment after diagonal, then diagonal to cone
// //     const zOffset = 1.5; // Distance for the horizontal segment
// //     const midPoint = new THREE.Vector3(
// //       coneX - zOffset,
// //       conePos.y,
// //       conePos.z
// //     );
    
// //     // Update line geometry with Z-shaped path (3 points - skipping the first horizontal segment)
// //     // Start from card border, go diagonal, then horizontal to cone
// //     const positions = new Float32Array([
// //       cardBorderPos.x, cardBorderPos.y, cardBorderPos.z,  // Start at card border
// //       midPoint.x, midPoint.y, midPoint.z,                  // Diagonal segment
// //       conePos.x, conePos.y, conePos.z                     // End at cone
// //     ]);
// //     lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
// //     lineGeometry.computeBoundingSphere();
    
// //     // Update circle positions
// //     if (cardCircleRef.current) {
// //       cardCircleRef.current.position.copy(cardBorderPos);
// //       // Orient circle to face camera (look at origin)
// //       cardCircleRef.current.lookAt(0, 0, 0);
// //     }
    
// //     if (coneCircleRef.current) {
// //       coneCircleRef.current.position.copy(conePos);
// //       // Orient circle to face camera
// //       coneCircleRef.current.lookAt(0, 0, 0);
// //     }
// //   });

// //   // Initialize line on mount
// //   React.useEffect(() => {
// //     if (!lineRef.current) {
// //       lineRef.current = new THREE.Line(lineGeometry, lineMaterial);
// //     }
// //   }, [lineGeometry, lineMaterial]);

// //   if (!visible) return null;

// //   return (
// //     <>
// //       {lineRef.current && <primitive object={lineRef.current} />}
// //       <mesh ref={cardCircleRef} geometry={circleGeometry} material={circleMaterial} />
// //       <mesh ref={coneCircleRef} geometry={circleGeometry} material={circleMaterial} />
// //     </>
// //   );
// // }

// // function InfoCard({ activeIndex, visible }: { activeIndex: number; visible: boolean }) {
// //   const data = CONE_DATA[activeIndex];

// //   return (
// //     <group>
// //       <Html position={[-4, -2.6, RADIUS]} center transform={false} distanceFactor={10} className={`${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity duration-500 ease-in-out`}>
// //         <div className="w-64 h-[40px] bg-black/60 flex justify-center items-center flex-col backdrop-blur-md border border-white/20 p-4 rounded-lg text-white shadow-xl">
// //           <h2 className="text-xl font-bold mb-1 text-cyan-300">{data.title}</h2>
// //           {/* <p className="text-sm text-gray-300">{data.description}</p> */}
// //         </div>
// //         {/* <span className="mt-2 text-xs text-gray-500 font-mono">Index: {activeIndex + 1} / {CONE_DATA.length}</span> */}
// //       </Html>
// //     </group>
// //   );
// // }

// // // Updated Props Interface
// // interface CarouselSceneProps {
// //     scrollProgress: MotionValue<number>;
// //     onItemClick: (index: number) => void; // New callback
// // }

// // function CarouselScene({ scrollProgress, onItemClick } : CarouselSceneProps) {
// //   const groupRef = useRef<Group>(null);
// //   const [activeIndex, setActiveIndex] = useState(0);
// //   const [showUI, setShowUI] = useState(false);
// //   const [isConeCentered, setIsConeCentered] = useState(false);
// //   const [showCardWithDelay, setShowCardWithDelay] = useState(false);
// //   const [groupRotation, setGroupRotation] = useState(0);
// //   const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
// //   const anglePerCone = (Math.PI * 2) / CONE_DATA.length;

// //   // Handle delay when cone becomes centered
// //   useEffect(() => {
// //     // Clear any existing timeout
// //     if (delayTimeoutRef.current) {
// //       clearTimeout(delayTimeoutRef.current);
// //       delayTimeoutRef.current = null;
// //     }

// //     // Immediately hide when activeIndex changes or not centered
// //     if (!isConeCentered || !showUI) {
// //       setShowCardWithDelay(false);
// //       return;
// //     }

// //     // Set a delay of 300ms before showing the card when centered
// //     delayTimeoutRef.current = setTimeout(() => {
// //       setShowCardWithDelay(true);
// //     }, 300);

// //     // Cleanup on unmount or when dependencies change
// //     return () => {
// //       if (delayTimeoutRef.current) {
// //         clearTimeout(delayTimeoutRef.current);
// //         delayTimeoutRef.current = null;
// //       }
// //     };
// //   }, [isConeCentered, showUI, activeIndex]);

// //   useFrame(() => {
// //     if (!groupRef.current) return;
// //     const currentScroll = scrollProgress.get();

// //     if (currentScroll < ANIMATION_END) {
// //         if (showUI) setShowUI(false);
// //         if (isConeCentered) setIsConeCentered(false);
// //         groupRef.current.rotation.y = 0; 
// //     } else {
// //         if (!showUI) setShowUI(true);

// //         const carouselProgress = (currentScroll - ANIMATION_END) / (1 - ANIMATION_END);
// //         const rawStep = carouselProgress * (CONE_DATA.length);
// //         const currentStep = Math.min(Math.floor(rawStep), CONE_DATA.length - 1);

// //         if (currentStep !== activeIndex) {
// //             setActiveIndex(currentStep);
// //         }

// //         const targetRotation = -currentStep * anglePerCone;
// //         const lerpedRotation = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, 0.1);
// //         groupRef.current.rotation.y = lerpedRotation;
// //         setGroupRotation(lerpedRotation);
        
// //         // Check if the active cone is centered (angle close to 0)
// //         const activeAngle = (activeIndex / CONE_DATA.length) * Math.PI * 2;
// //         const currentRotation = groupRef.current.rotation.y;
// //         const relativeAngle = activeAngle + currentRotation;
// //         // Normalize angle to [-PI, PI] range
// //         const normalizedAngle = ((relativeAngle % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
// //         const angleFromCenter = normalizedAngle > Math.PI ? (Math.PI * 2) - normalizedAngle : normalizedAngle;
// //         // Consider centered if within ~0.15 radians (about 8.6 degrees)
// //         const centered = angleFromCenter < 0.15;
        
// //         if (centered !== isConeCentered) {
// //             setIsConeCentered(centered);
// //         }
// //     }
// //   });

// //   return (
// //     <>
// //       <BackgroundSphere />
// //       <ambientLight intensity={0.5} />
// //       <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
// //       {/* <AtmosphericSmoke /> */}
// //       {/* For Orangness on Cone */}
// //       {/* <CinematicLights />  */}
// //       <Environment preset="city" />

// //       <InfoCard activeIndex={activeIndex} visible={showCardWithDelay} />
      
// //       <ConnectionArrow 
// //         activeIndex={activeIndex} 
// //         visible={showCardWithDelay} 
// //         groupRotation={groupRotation}
// //       />

// //       {/* Pass the click handler up to the parent via onItemClick */}
// //       <NavArrows 
// //         visible={showUI} 
// //         activeIndex={activeIndex} 
// //         onNext={() => onItemClick(activeIndex + 1)}
// //         onPrev={() => onItemClick(activeIndex - 1)}
// //       />

// //       <group ref={groupRef}>
// //         {CONE_DATA.map((data, i) => {
// //           const angle = (i / CONE_DATA.length) * Math.PI * 2;
// //           const isLeft = i % 2 === 0;
// //           return (
// //             <CarouselItem 
// //               key={i} index={i} isLeft={isLeft} angle={angle}
// //               scrollProgress={scrollProgress} url={data.url} modelScale={data.scale} rotationOffset={data.rotationOffset}
// //             />
// //           );
// //         })}
// //       </group>
// //       <ContactShadows opacity={0.4} scale={15} blur={2.4} far={4.5} />
// //     </>
// //   );
// // }

// // interface CarouselItemProps {
// //   index: number;
// //   isLeft: boolean;
// //   angle: number;
// //   scrollProgress: MotionValue<number>;
// //   url: string;
// //   modelScale: number;
// //   rotationOffset: number;
// // }

// // function CarouselItem({ index, isLeft, angle, scrollProgress, url, modelScale, rotationOffset }: CarouselItemProps) {
// //   const itemRef = useRef<Group>(null);
// //   const targetX = Math.sin(angle) * RADIUS;
// //   const targetZ = Math.cos(angle) * RADIUS;
// //   const startX = isLeft ? -ENTRANCE_OFFSET : ENTRANCE_OFFSET;

// //   const x = useTransform(scrollProgress, [0, ANIMATION_END], [startX, targetX]);
// //   const tumbleX = useTransform(scrollProgress, [0, ANIMATION_END], [Math.PI * (index + 2), 0]);
// //   const tumbleY = useTransform(scrollProgress, [0, ANIMATION_END], [Math.PI * (index * -1), 0]);
// //   const tumbleZ = useTransform(scrollProgress, [0, ANIMATION_END], [Math.PI * 5, 0]);
// //   const animationScale = useTransform(scrollProgress, [0, ANIMATION_END - 0.1], [0, 1]);

// //   useFrame(() => {
// //     if (itemRef.current) {
// //       if (scrollProgress.get() > ANIMATION_END) {
// //         itemRef.current.position.set(targetX, 0, targetZ);
// //         itemRef.current.scale.setScalar(1);
// //         itemRef.current.rotation.x = 0;
// //         itemRef.current.rotation.y = angle + Math.PI + rotationOffset; 
// //         itemRef.current.rotation.z = 0;
// //       } else {
// //         itemRef.current.position.set(x.get(), 0, targetZ);
// //         itemRef.current.scale.setScalar(animationScale.get());
// //         itemRef.current.rotation.x = tumbleX.get();
// //         itemRef.current.rotation.y = tumbleY.get() + angle + Math.PI + rotationOffset; 
// //         itemRef.current.rotation.z = tumbleZ.get();
// //       }
// //     }
// //   });

// //   return (
// //     <group ref={itemRef}>
// //       <Cone url={url} scale={modelScale} /> 
// //     </group>
// //   );
// // }

// // // Updated Canvas Export
// // export default function CarouselCanvas({ scrollProgress, onItemClick }: { scrollProgress: MotionValue<number>, onItemClick: (index: number) => void }) {
// //   return (
// //     <Canvas camera={{ position: [0, 2, 18], fov: 35 }}>
// //       <React.Suspense fallback={<Loader />}>
// //          <CarouselScene scrollProgress={scrollProgress} onItemClick={onItemClick} />
// //       </React.Suspense>
// //     </Canvas>
// //   );
// // }