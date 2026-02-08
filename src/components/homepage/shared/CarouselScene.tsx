"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTransform, MotionValue } from "framer-motion";
import { Environment, ContactShadows, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { Cone } from "./Cone"; 
import type { Group } from "three";

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
  // Base button styles with improved design
  const btnClass = "pointer-events-auto cursor-pointer w-13 h-13 rounded-full bg-gradient-to-br from-white/15 to-white/5 hover:from-white/25 hover:to-white/10 backdrop-blur-lg border border-white/30 hover:border-white/50 text-white transition-all duration-300 active:scale-90 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] group disabled:opacity-0 disabled:pointer-events-none";
  
  // Logic: Hide Prev if first, Hide Next if last
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
  
  // Create geometry and material once
  const lineGeometry = React.useMemo(() => new THREE.BufferGeometry(), []);
  const lineMaterial = React.useMemo(() => new THREE.LineBasicMaterial({ 
    color: 0xffffff, 
    linewidth: 2,
    transparent: true,
    opacity: 0.8
  }), []);
  
  // Circle geometry and material for indicators
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
    
    // Card center position
    const cardCenter = new THREE.Vector3(-4, -2.6, RADIUS);
    
    // Calculate card right border position (card is w-64 = 256px, with distanceFactor=10, so ~1.3 units half-width)
    const cardEdgeOffset = 1.3; // Half width of card in 3D space
    const cardBorderPos = new THREE.Vector3(
      cardCenter.x + cardEdgeOffset,
      cardCenter.y,
      cardCenter.z
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
    const midPoint = new THREE.Vector3(
      coneX - zOffset,
      conePos.y,
      conePos.z
    );
    
    // Update line geometry with Z-shaped path (3 points - skipping the first horizontal segment)
    // Start from card border, go diagonal, then horizontal to cone
    const positions = new Float32Array([
      cardBorderPos.x, cardBorderPos.y, cardBorderPos.z,  // Start at card border
      midPoint.x, midPoint.y, midPoint.z,                  // Diagonal segment
      conePos.x, conePos.y, conePos.z                     // End at cone
    ]);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
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

function InfoCard({ activeIndex, visible }: { activeIndex: number; visible: boolean }) {
  const data = CONE_DATA[activeIndex];

  return (
    <group>
      <Html position={[-4, -2.6, RADIUS]} center transform={false} distanceFactor={10} className={`${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity duration-500 ease-in-out`}>
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

function CarouselScene({ scrollProgress, onItemClick } : CarouselSceneProps) {
  const groupRef = useRef<Group>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showUI, setShowUI] = useState(false);
  const [isConeCentered, setIsConeCentered] = useState(false);
  const [showCardWithDelay, setShowCardWithDelay] = useState(false);
  const [groupRotation, setGroupRotation] = useState(0);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const anglePerCone = (Math.PI * 2) / CONE_DATA.length;

  // Handle delay when cone becomes centered
  useEffect(() => {
    // Clear any existing timeout
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
      delayTimeoutRef.current = null;
    }

    // Immediately hide when activeIndex changes or not centered
    if (!isConeCentered || !showUI) {
      setShowCardWithDelay(false);
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
        
        // Check if the active cone is centered (angle close to 0)
        const activeAngle = (activeIndex / CONE_DATA.length) * Math.PI * 2;
        const currentRotation = groupRef.current.rotation.y;
        const relativeAngle = activeAngle + currentRotation;
        // Normalize angle to [-PI, PI] range
        const normalizedAngle = ((relativeAngle % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        const angleFromCenter = normalizedAngle > Math.PI ? (Math.PI * 2) - normalizedAngle : normalizedAngle;
        // Consider centered if within ~0.15 radians (about 8.6 degrees)
        const centered = angleFromCenter < 0.15;
        
        if (centered !== isConeCentered) {
            setIsConeCentered(centered);
        }
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <Environment preset="city" />

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

// Updated Canvas Export
export default function CarouselCanvas({ scrollProgress, onItemClick }: { scrollProgress: MotionValue<number>, onItemClick: (index: number) => void }) {
  return (
    <Canvas camera={{ position: [0, 2, 18], fov: 35 }}>
      <React.Suspense fallback={<Loader />}>
         <CarouselScene scrollProgress={scrollProgress} onItemClick={onItemClick} />
      </React.Suspense>
    </Canvas>
  );
}