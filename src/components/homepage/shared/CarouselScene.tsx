"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTransform, MotionValue } from "framer-motion";
import { Environment, ContactShadows, Html, Line, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { Cone } from "./Cone"; 
import type { Group } from "three";

// --- EXPORT CONFIGURATION for Page.tsx to use ---
export const RADIUS = 6.5; 
export const ENTRANCE_OFFSET = 12; 
export const ANIMATION_END = 0.35; 

export const CONE_DATA = [
  { id: 1, title: "Beige Cone", description: "Smooth matte finish", url: "/3d-cones/straight/beige_cone.glb", scale: 50, rotationOffset: 2.7 },
  { id: 2, title: "Black Obsidian", description: "Dark reflective surface", url: "/3d-cones/straight/black_cone_v01.glb", scale: 50, rotationOffset: 2.7 },
  { id: 3, title: "White Roll", description: "Clean minimal design", url: "/3d-cones/straight/white roll.glb", scale: 1, rotationOffset: 4.5 },
  { id: 4, title: "Brown Texture", description: "Organic material feel", url: "/3d-cones/brown roll.glb", scale: 1.5, rotationOffset: 1.7 },
  { id: 5, title: "Glass Filter", description: "Transparent optics", url: "/3d-cones/straight/Cone Glass Filter.glb", scale: 0.5, rotationOffset: 4.12 },
  { id: 6, title: "Industrial Roll", description: "Heavy duty manufacturing", url: "/3d-cones/straight/Roll 1.glb", scale: 50, rotationOffset: 0.7 },
  { id: 7, title: "Blue Steel", description: "Cold rolled steel", url: "/3d-cones/straight/Roll 2glb.glb", scale: 50, rotationOffset: 1.9 },
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

function InfoCard({ activeIndex, visible }: { activeIndex: number; visible: boolean }) {
  const data = CONE_DATA[activeIndex];
  const points = useMemo(() => [
    new THREE.Vector3(0, 0, RADIUS), new THREE.Vector3(2.5, 1, RADIUS), new THREE.Vector3(5, 1, RADIUS)
  ], []);

  return (
    <group>
      <Line visible={visible} points={points} color="white" lineWidth={2} transparent opacity={0.6} />
      <Html position={[5.2, 1, RADIUS]} center transform={false} distanceFactor={10} className={`${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity duration-500 ease-in-out`}>
        <div className="w-64 bg-black/60 backdrop-blur-md border border-white/20 p-4 rounded-lg text-white shadow-xl">
          <h2 className="text-xl font-bold mb-1 text-cyan-300">{data.title}</h2>
          <p className="text-sm text-gray-300">{data.description}</p>
          <div className="mt-2 text-xs text-gray-500 font-mono">Index: {activeIndex + 1} / {CONE_DATA.length}</div>
        </div>
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
  const anglePerCone = (Math.PI * 2) / CONE_DATA.length;

  useFrame(() => {
    if (!groupRef.current) return;
    const currentScroll = scrollProgress.get();

    if (currentScroll < ANIMATION_END) {
        if (showUI) setShowUI(false);
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
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, 0.1);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <Environment preset="city" />

      <InfoCard activeIndex={activeIndex} visible={showUI} />

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
// "use client";

// import React, { useRef, useState, useMemo } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { useTransform, MotionValue } from "framer-motion";
// import { Environment, ContactShadows, Html, Line, useProgress } from "@react-three/drei";
// import * as THREE from "three";
// import { Cone } from "./Cone"; 
// import type { Group } from "three";

// // --- CONFIGURATION ---
// const RADIUS = 6.5; 
// const ENTRANCE_OFFSET = 12; 
// const ANIMATION_END = 0.35; 

// const CONE_DATA = [
//   { id: 1, title: "Beige Cone", description: "Smooth matte finish", url: "/3d-cones/straight/beige_cone.glb", scale: 50, rotationOffset: 2.7 },
//   { id: 2, title: "Black Obsidian", description: "Dark reflective surface", url: "/3d-cones/straight/black_cone_v01.glb", scale: 50, rotationOffset: 2.7 },
//   { id: 3, title: "White Roll", description: "Clean minimal design", url: "/3d-cones/straight/white roll.glb", scale: 1, rotationOffset: 4.5 },
//   { id: 4, title: "Brown Texture", description: "Organic material feel", url: "/3d-cones/brown roll.glb", scale: 1.5, rotationOffset: 1.7 },
//   { id: 5, title: "Glass Filter", description: "Transparent optics", url: "/3d-cones/straight/Cone Glass Filter.glb", scale: 0.5, rotationOffset: 4.12 },
//   { id: 6, title: "Industrial Roll", description: "Heavy duty manufacturing", url: "/3d-cones/straight/Roll 1.glb", scale: 50, rotationOffset: 0.7 },
//   { id: 7, title: "Blue Steel", description: "Cold rolled steel", url: "/3d-cones/straight/Roll 2glb.glb", scale: 50, rotationOffset: 1.9 },
//   { id: 8, title: "Clear Plastic", description: "High durability polymer", url: "/3d-cones/straight/Transparent Cone.glb", scale: 3.2, rotationOffset: 0 },
// ];

// function Loader() {
//   const { progress } = useProgress();
//   return <Html center className="text-white font-mono">{progress.toFixed(0)}%</Html>;
// }

// // --- UPDATED INFO CARD COMPONENT ---
// function InfoCard({ activeIndex, visible }: { activeIndex: number; visible: boolean }) {
//   const data = CONE_DATA[activeIndex];
  
//   const points = useMemo(() => [
//     new THREE.Vector3(0, 0, RADIUS),       
//     new THREE.Vector3(2.5, 1, RADIUS),     
//     new THREE.Vector3(5, 1, RADIUS)        
//   ], []);

//   return (
//     <group>
//       {/* 1. Explicitly control visibility of the 3D Line */}
//       <Line 
//         visible={visible} 
//         points={points} 
//         color="white" 
//         lineWidth={2} 
//         transparent 
//         opacity={0.6} 
//       />

//       {/* 2. Use CSS Opacity to hide the HTML content. 
//           The <Html> component doesn't hide automatically with group visibility 
//           when transform={false} is used. 
//       */}
//       <Html 
//         position={[5.2, 1, RADIUS]} 
//         center 
//         transform={false} 
//         distanceFactor={10}
//         // Add pointer-events-none when hidden so user can't click invisible card
//         className={`${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity duration-500 ease-in-out`}
//       >
//         <div className="w-64 bg-black/60 backdrop-blur-md border border-white/20 p-4 rounded-lg text-white shadow-xl">
//           <h2 className="text-xl font-bold mb-1 text-cyan-300">{data.title}</h2>
//           <p className="text-sm text-gray-300">{data.description}</p>
//           <div className="mt-2 text-xs text-gray-500 font-mono">Index: {activeIndex + 1} / {CONE_DATA.length}</div>
//         </div>
//       </Html>
//     </group>
//   );
// }

// function CarouselScene({ scrollProgress } : { scrollProgress: MotionValue<number> }) {
//   const groupRef = useRef<Group>(null);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [showUI, setShowUI] = useState(false);
//   const anglePerCone = (Math.PI * 2) / CONE_DATA.length;

//   useFrame(() => {
//     if (!groupRef.current) return;
//     const currentScroll = scrollProgress.get();

//     // LOGIC: Only show UI if we have passed the entrance animation
//     if (currentScroll < ANIMATION_END) {
//         // Prevent unnecessary state updates if it's already false
//         if (showUI) setShowUI(false);
        
//         groupRef.current.rotation.y = 0; 
//     } else {
//         if (!showUI) setShowUI(true);

//         const carouselProgress = (currentScroll - ANIMATION_END) / (1 - ANIMATION_END);
//         const rawStep = carouselProgress * (CONE_DATA.length);
//         const currentStep = Math.min(Math.floor(rawStep), CONE_DATA.length - 1);

//         if (currentStep !== activeIndex) {
//             setActiveIndex(currentStep);
//         }

//         const targetRotation = -currentStep * anglePerCone;
//         groupRef.current.rotation.y = THREE.MathUtils.lerp(
//             groupRef.current.rotation.y, 
//             targetRotation, 
//             0.1
//         );
//     }
//   });

//   return (
//     <>
//       <ambientLight intensity={0.5} />
//       <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
//       <Environment preset="city" />

//       {/* Pass the visibility state to the component */}
//       <InfoCard activeIndex={activeIndex} visible={showUI} />

//       <group ref={groupRef}>
//         {CONE_DATA.map((data, i) => {
//           const angle = (i / CONE_DATA.length) * Math.PI * 2;
//           const isLeft = i % 2 === 0;

//           return (
//             <CarouselItem 
//               key={i}
//               index={i}
//               isLeft={isLeft}
//               angle={angle}
//               scrollProgress={scrollProgress}
//               url={data.url}
//               modelScale={data.scale}
//               rotationOffset={data.rotationOffset}
//             />
//           );
//         })}
//       </group>
//       <ContactShadows opacity={0.4} scale={15} blur={2.4} far={4.5} />
//     </>
//   );
// }

// interface CarouselItemProps {
//   index: number;
//   isLeft: boolean;
//   angle: number;
//   scrollProgress: MotionValue<number>;
//   url: string;
//   modelScale: number;
//   rotationOffset: number;
// }

// function CarouselItem({ 
//   index, 
//   isLeft, 
//   angle, 
//   scrollProgress, 
//   url, 
//   modelScale,
//   rotationOffset 
// }: CarouselItemProps) {
//   const itemRef = useRef<Group>(null);
//   const targetX = Math.sin(angle) * RADIUS;
//   const targetZ = Math.cos(angle) * RADIUS;
//   const startX = isLeft ? -ENTRANCE_OFFSET : ENTRANCE_OFFSET;

//   const x = useTransform(scrollProgress, [0, ANIMATION_END], [startX, targetX]);
//   const tumbleX = useTransform(scrollProgress, [0, ANIMATION_END], [Math.PI * (index + 2), 0]);
//   const tumbleY = useTransform(scrollProgress, [0, ANIMATION_END], [Math.PI * (index * -1), 0]);
//   const tumbleZ = useTransform(scrollProgress, [0, ANIMATION_END], [Math.PI * 5, 0]);
//   const animationScale = useTransform(scrollProgress, [0, ANIMATION_END - 0.1], [0, 1]);

//   useFrame(() => {
//     if (itemRef.current) {
//       if (scrollProgress.get() > ANIMATION_END) {
//         itemRef.current.position.set(targetX, 0, targetZ);
//         itemRef.current.scale.setScalar(1);
//         itemRef.current.rotation.x = 0;
//         itemRef.current.rotation.y = angle + Math.PI + rotationOffset; 
//         itemRef.current.rotation.z = 0;
//       } else {
//         itemRef.current.position.set(x.get(), 0, targetZ);
//         itemRef.current.scale.setScalar(animationScale.get());
//         itemRef.current.rotation.x = tumbleX.get();
//         itemRef.current.rotation.y = tumbleY.get() + angle + Math.PI + rotationOffset; 
//         itemRef.current.rotation.z = tumbleZ.get();
//       }
//     }
//   });

//   return (
//     <group ref={itemRef}>
//       <Cone url={url} scale={modelScale} /> 
//     </group>
//   );
// }

// export default function CarouselCanvas({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
//   return (
//     <Canvas camera={{ position: [0, 2, 18], fov: 35 }}>
//       <React.Suspense fallback={<Loader />}>
//          <CarouselScene scrollProgress={scrollProgress} />
//       </React.Suspense>
//     </Canvas>
//   );
// }

// "use client";

// import React, { useRef } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { useTransform, MotionValue } from "framer-motion";
// import { Environment, ContactShadows, Html, useProgress } from "@react-three/drei";
// import { Cone } from "./Cone"; 
// import type { Group } from "three";

// const RADIUS = 6.5; 
// const ENTRANCE_OFFSET = 20;

// // --- CONFIG FOR ANIMATION SPEED ---
// // 0.6 means the entrance animation takes 60% of the total scroll distance.
// // (Previously it was 0.25, which was very fast)
// const ANIMATION_END = 0.3; 

// const CONE_DATA = [
//   { url: "/3d-cones/straight/beige_cone.glb", scale: 50, rotationOffset: 2.7 },
//   { url: "/3d-cones/straight/black_cone_v01.glb", scale: 50, rotationOffset: 2.7 },
//   { url: "/3d-cones/straight/white roll.glb", scale: 1, rotationOffset: 4.5 },
//   { url: "/3d-cones/brown roll.glb", scale: 1.5, rotationOffset: 1.7 },
//   { url: "/3d-cones/straight/Cone Glass Filter.glb", scale: 0.5, rotationOffset: 4.12 },
//   { url: "/3d-cones/straight/Roll 1.glb", scale: 50, rotationOffset: 0.7 },
//   { url: "/3d-cones/straight/Roll 2glb.glb", scale: 50, rotationOffset: 1.9 },
//   { url: "/3d-cones/straight/Transparent Cone.glb", scale: 3.2, rotationOffset: 0 },
// ];

// function Loader() {
//   const { progress } = useProgress();
//   return <Html center className="text-white font-mono">{progress.toFixed(0)}%</Html>;
// }

// function CarouselScene({ scrollProgress } : { scrollProgress: MotionValue<number> }) {
//   const groupRef = useRef<Group>(null);

//   // 1. UPDATE: Start rotating only AFTER the entrance animation is done (at ANIMATION_END)
//   const groupRotation = useTransform(
//     scrollProgress, 
//     [ANIMATION_END, 1], 
//     [0, -Math.PI * 2]
//   );

//   useFrame(() => {
//     if (groupRef.current) {
//       groupRef.current.rotation.y = groupRotation.get();
//     }
//   });

//   return (
//     <>
//       <ambientLight intensity={0.5} />
//       <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
//       <Environment preset="city" />

//       <group ref={groupRef}>
//         {CONE_DATA.map((data, i) => {
//           const angle = (i / CONE_DATA.length) * Math.PI * 2;
//           const isLeft = i % 2 === 0;

//           return (
//             <CarouselItem 
//               key={i}
//               index={i}
//               isLeft={isLeft}
//               angle={angle}
//               scrollProgress={scrollProgress}
//               url={data.url}
//               modelScale={data.scale}
//               rotationOffset={data.rotationOffset}
//             />
//           );
//         })}
//       </group>
//       <ContactShadows opacity={0.4} scale={15} blur={2.4} far={4.5} />
//     </>
//   );
// }

// interface CarouselItemProps {
//   index: number;
//   isLeft: boolean;
//   angle: number;
//   scrollProgress: MotionValue<number>;
//   url: string;
//   modelScale: number;
//   rotationOffset: number;
// }

// function CarouselItem({ 
//   index, 
//   isLeft, 
//   angle, 
//   scrollProgress, 
//   url, 
//   modelScale,
//   rotationOffset 
// }: CarouselItemProps) {
//   const itemRef = useRef<Group>(null);
  
//   const targetX = Math.sin(angle) * RADIUS;
//   const targetZ = Math.cos(angle) * RADIUS;

//   const startX = isLeft ? -ENTRANCE_OFFSET : ENTRANCE_OFFSET;

//   // 2. UPDATE: All animations now use ANIMATION_END (0.6) instead of 0.25
//   const x = useTransform(scrollProgress, [0, ANIMATION_END], [startX, targetX]);
  
//   const tumbleX = useTransform(scrollProgress, [0, ANIMATION_END], [Math.PI * (index + 2), 0]);
//   const tumbleY = useTransform(scrollProgress, [0, ANIMATION_END], [Math.PI * (index * -1), 0]);
//   const tumbleZ = useTransform(scrollProgress, [0, ANIMATION_END], [Math.PI * 5, 0]);
  
//   // Scale finishes slightly before movement finishes to look cleaner
//   const animationScale = useTransform(scrollProgress, [0, ANIMATION_END - 0.1], [0, 1]);

//   useFrame(() => {
//     if (itemRef.current) {
//       itemRef.current.position.set(x.get(), 0, targetZ);
      
//       itemRef.current.rotation.x = tumbleX.get();
//       // Apply offset + flip + angle
//       itemRef.current.rotation.y = tumbleY.get() + angle + Math.PI + rotationOffset; 
//       itemRef.current.rotation.z = tumbleZ.get();
      
//       itemRef.current.scale.setScalar(animationScale.get());
//     }
//   });

//   return (
//     <group ref={itemRef}>
//       <Cone url={url} scale={modelScale} /> 
//     </group>
//   );
// }

// export default function CarouselCanvas({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
//   return (
//     <Canvas camera={{ position: [0, 0, 18], fov: 35 }}>
//       <React.Suspense fallback={<Loader />}>
//          <CarouselScene scrollProgress={scrollProgress} />
//       </React.Suspense>
//     </Canvas>
//   );
// }


// "use client";

// import React, { useRef } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { useTransform, MotionValue } from "framer-motion";
// import { Environment, ContactShadows, Html, useProgress } from "@react-three/drei";
// import { Cone } from "./Cone"; 
// import type { Group } from "three";

// const RADIUS = 6.5; 
// const ENTRANCE_OFFSET = 20;

// // 1. ADD rotationOffset TO YOUR DATA
// const CONE_DATA = [
//   { url: "/3d-cones/straight/beige_cone.glb", scale: 50, rotationOffset: 2.7 },
//   { url: "/3d-cones/straight/black_cone_v01.glb", scale: 50, rotationOffset: 2.7 },
//   { url: "/3d-cones/straight/white roll.glb", scale: 1, rotationOffset: 4.5 },
//   { url: "/3d-cones/brown roll.glb", scale: 1.5, rotationOffset: 1.7 },
//   { url: "/3d-cones/straight/Cone Glass Filter.glb", scale: 0.5, rotationOffset: 4.12 },
//   { url: "/3d-cones/straight/Roll 1.glb", scale: 50, rotationOffset: 0.7 },
//   { url: "/3d-cones/straight/Roll 2glb.glb", scale: 50, rotationOffset: 1.9 },
//   { url: "/3d-cones/straight/Transparent Cone.glb", scale: 3.2, rotationOffset: 0 },
// ];

// function Loader() {
//   const { progress } = useProgress();
//   return <Html center className="text-white font-mono">{progress.toFixed(0)}%</Html>;
// }

// function CarouselScene({ scrollProgress } : { scrollProgress: MotionValue<number> }) {
//   const groupRef = useRef<Group>(null);
//   // anti-clockwise
//   // const groupRotation = useTransform(scrollProgress, [0.25, 1], [0, Math.PI * 2]);
//   // clockwise
//   const groupRotation = useTransform(scrollProgress, [0.25, 1], [0, -Math.PI * 2]);

//   useFrame(() => {
//     if (groupRef.current) {
//       groupRef.current.rotation.y = groupRotation.get();
//     }
//   });

//   return (
//     <>
//       <ambientLight intensity={0.5} />
//       <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
//       <Environment preset="city" />

//       <group ref={groupRef}>
//         {CONE_DATA.map((data, i) => {
//           const angle = (i / CONE_DATA.length) * Math.PI * 2;
//           const isLeft = i % 2 === 0;

//           return (
//             <CarouselItem 
//               key={i}
//               index={i}
//               isLeft={isLeft}
//               angle={angle}
//               scrollProgress={scrollProgress}
//               url={data.url}
//               modelScale={data.scale}
//               // 2. PASS THE OFFSET PROP
//               rotationOffset={data.rotationOffset}
//             />
//           );
//         })}
//       </group>
//       <ContactShadows opacity={0.4} scale={15} blur={2.4} far={4.5} />
//     </>
//   );
// }

// interface CarouselItemProps {
//   index: number;
//   isLeft: boolean;
//   angle: number;
//   scrollProgress: MotionValue<number>;
//   url: string;
//   modelScale: number;
//   rotationOffset: number; // 3. ADD TYPE DEFINITION
// }

// function CarouselItem({ 
//   index, 
//   isLeft, 
//   angle, 
//   scrollProgress, 
//   url, 
//   modelScale,
//   rotationOffset // 4. DESTRUCTURE PROP
// }: CarouselItemProps) {
//   const itemRef = useRef<Group>(null);
  
//   const targetX = Math.sin(angle) * RADIUS;
//   const targetZ = Math.cos(angle) * RADIUS;

//   const startX = isLeft ? -ENTRANCE_OFFSET : ENTRANCE_OFFSET;
//   const x = useTransform(scrollProgress, [0, 0.25], [startX, targetX]);
  
//   const tumbleX = useTransform(scrollProgress, [0, 0.25], [Math.PI * (index + 2), 0]);
//   const tumbleY = useTransform(scrollProgress, [0, 0.25], [Math.PI * (index * -1), 0]);
//   const tumbleZ = useTransform(scrollProgress, [0, 0.25], [Math.PI * 5, 0]);
//   const animationScale = useTransform(scrollProgress, [0, 0.2], [0, 1]);

//   useFrame(() => {
//     if (itemRef.current) {
//       itemRef.current.position.set(x.get(), 0, targetZ);
//       itemRef.current.rotation.x = tumbleX.get();
      
//       // 5. APPLY THE OFFSET HERE
//       // We add rotationOffset to the existing calculation
//       itemRef.current.rotation.y = tumbleY.get() + angle + Math.PI + rotationOffset; 
      
//       itemRef.current.rotation.z = tumbleZ.get();
//       itemRef.current.scale.setScalar(animationScale.get());
//     }
//   });

//   return (
//     <group ref={itemRef}>
//       <Cone url={url} scale={modelScale} /> 
//     </group>
//   );
// }

// // ... Rest of your file (CarouselCanvas, Cone component) remains exactly the same ...
// // Don't forget to export CarouselCanvas
// export default function CarouselCanvas({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
//   return (
//     <Canvas camera={{ position: [0, 0, 18], fov: 35 }}>
//       <React.Suspense fallback={<Loader />}>
//          <CarouselScene scrollProgress={scrollProgress} />
//       </React.Suspense>
//     </Canvas>
//   );
// }


// "use client";

// import React, { useRef } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { useTransform, MotionValue } from "framer-motion";
// import { Environment, ContactShadows, Html, useProgress } from "@react-three/drei";
// import { Cone } from "./Cone"; 
// import type { Group } from "three";

// // Increased Radius to fit 8 cones comfortably
// const RADIUS = 5.5; 
// const ENTRANCE_OFFSET = 20;

// // --- CONFIGURATION FOR 8 CONES ---
// const CONE_DATA = [
//   { url: "/3d-cones/straight/beige_cone.glb", scale: 50 },
//   { url: "/3d-cones/straight/black_cone_v01.glb", scale: 50 },
//   { url: "/3d-cones/brown roll.glb", scale: 1.5 },
//   { url: "/3d-cones/straight/Cone Glass Filter.glb", scale: 0.5 },
//   { url: "/3d-cones/straight/Roll 1.glb", scale: 50 },
//   { url: "/3d-cones/straight/Roll 2glb.glb", scale: 50 },
//   { url: "/3d-cones/straight/Transparent Cone.glb", scale: 3 },
//   { url: "/3d-cones/straight/white roll.glb", scale: 1 },
// ];

// function Loader() {
//   const { progress } = useProgress();
//   return <Html center className="text-white font-mono">{progress.toFixed(0)}%</Html>;
// }

// function CarouselScene({ scrollProgress } : { scrollProgress: MotionValue<number> }) {
//   const groupRef = useRef<Group>(null);

//   // Global rotation logic
//   const groupRotation = useTransform(scrollProgress, [0.25, 1], [0, Math.PI * 2]);

//   useFrame(() => {
//     if (groupRef.current) {
//       groupRef.current.rotation.y = groupRotation.get();
//     }
//   });

//   return (
//     <>
//       <ambientLight intensity={0.5} />
//       <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
//       <Environment preset="city" />

//       <group ref={groupRef}>
//         {CONE_DATA.map((data, i) => {
//           // Calculate angle for 8 items evenly spaced
//           const angle = (i / CONE_DATA.length) * Math.PI * 2;
          
//           // Alternate Left/Right entrance
//           // Evens come from Left, Odds come from Right
//           const isLeft = i % 2 === 0;

//           return (
//             <CarouselItem 
//               key={i}
//               index={i}
//               isLeft={isLeft}
//               angle={angle}
//               scrollProgress={scrollProgress}
//               url={data.url}
//               modelScale={data.scale}
//             />
//           );
//         })}
//       </group>

//       <ContactShadows opacity={0.4} scale={15} blur={2.4} far={4.5} />
//     </>
//   );
// }

// // --- INDIVIDUAL CONE LOGIC ---
// interface CarouselItemProps {
//   index: number;
//   isLeft: boolean;
//   angle: number;
//   scrollProgress: MotionValue<number>;
//   url: string;
//   modelScale: number;
// }

// function CarouselItem({ 
//   index, 
//   isLeft, 
//   angle, 
//   scrollProgress, 
//   url, 
//   modelScale
// }: CarouselItemProps) {
//   const itemRef = useRef<Group>(null);
  
//   const targetX = Math.sin(angle) * RADIUS;
//   const targetZ = Math.cos(angle) * RADIUS;

//   // Animation values
//   const startX = isLeft ? -ENTRANCE_OFFSET : ENTRANCE_OFFSET;
//   const x = useTransform(scrollProgress, [0, 0.25], [startX, targetX]);
  
//   // Chaos Rotation
//   const tumbleX = useTransform(scrollProgress, [0, 0.25], [Math.PI * (index + 2), 0]);
//   const tumbleY = useTransform(scrollProgress, [0, 0.25], [Math.PI * (index * -1), 0]);
  
//   // --- HORIZONTAL FIX ---
//   // End value is Math.PI / 2 (90 degrees) to make them lie flat horizontally
//   const tumbleZ = useTransform(scrollProgress, [0, 0.25], [Math.PI * 5, 0]);

//   // Entrance Growth Scale (0 -> 1)
//   const animationScale = useTransform(scrollProgress, [0, 0.2], [0, 1]);

// useFrame(() => {
//   if (itemRef.current) {
//     itemRef.current.position.set(x.get(), 0, targetZ);
    
//     itemRef.current.rotation.x = tumbleX.get();
    
//     // 2. Add Math.PI to Y to flip them Outward (Back-to-Center)
//     // The 'angle' faces the center, adding PI turns them around.
//     itemRef.current.rotation.y = tumbleY.get() + angle + Math.PI; 
    
//     itemRef.current.rotation.z = tumbleZ.get();
    
//     itemRef.current.scale.setScalar(animationScale.get());
//   }
// });

//   return (
//     <group ref={itemRef}>
//       <Cone url={url} scale={modelScale} /> 
//     </group>
//   );
// }

// interface CarouselCanvasProps {
//   scrollProgress: MotionValue<number>;
// }

// export default function CarouselCanvas({ scrollProgress }: CarouselCanvasProps) {
//   return (
//     // Increased Z position (18) to fit the larger radius
//     <Canvas camera={{ position: [0, 0, 18], fov: 35 }}>
//       <React.Suspense fallback={<Loader />}>
//          <CarouselScene scrollProgress={scrollProgress} />
//       </React.Suspense>
//     </Canvas>
//   );
// }