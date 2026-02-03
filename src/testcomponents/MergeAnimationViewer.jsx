// components/MergeAnimationViewer.jsx
"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ---------- small utils ---------- */
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

/* ---------- simple wood texture (cached) ---------- */
function generateWoodTexture() {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const idx = (i * size + j) * 4;
      const x = (i / size) * 8;
      const y = (j / size) * 8;
      const grain = Math.sin(y * 0.5) * 0.3 + Math.sin(y * 2) * 0.08;
      const rings = Math.sin(x * 0.2) * 0.12;
      let r = 200 + grain * 20 + rings * 18;
      let g = 160 + grain * 18 + rings * 12;
      let b = 110 + grain * 14 + rings * 8;
      data[idx] = Math.max(0, Math.min(255, r));
      data[idx + 1] = Math.max(0, Math.min(255, g));
      data[idx + 2] = Math.max(0, Math.min(255, b));
      data[idx + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 2);
  tex.needsUpdate = true;
  return tex;
}
let woodTexCache = null;
function getWoodTexture() {
  if (!woodTexCache) woodTexCache = generateWoodTexture();
  return woodTexCache;
}

/* ---------- Scene content ---------- */
function MergingScene({ state = {}, isAnimating = false, onAnimationComplete = () => {} }) {
  const groupRef = useRef();
  const paperRef = useRef();
  const filterRef = useRef();
  const ballRef = useRef();

  // animation progress (0..1)
  const progressRef = useRef(0);
  const doneRef = useRef(false);

  // Bigger by default — tune this if you want more/less scale
  const SCALE_MULTIPLIER = 1.6;  // # 1 spacing
  const SIZE_SCALE = 0.85;   // controls actual size (smaller cone/filter)

  const paperColor = useMemo(() => {
    const base = state.paperColorHex || "#A8E6CF";
    const c = new THREE.Color(base);
    c.multiplyScalar(0.92);
    return c.getStyle();
  }, [state.paperColorHex, state.paperType]);

  const filterColor = useMemo(() => {
    const base = state.filterColorHex || "#CBD5F5";
    const c = new THREE.Color(base);
    c.multiplyScalar(0.92);
    return c.getStyle();
  }, [state.filterColorHex, state.filterType]);

  // set initial geometries once
  useEffect(() => {
    if (paperRef.current) {
      paperRef.current.geometry = new THREE.CylinderGeometry(0.28 * SIZE_SCALE, 0.45 * SIZE_SCALE, 5 * SIZE_SCALE, 48);
    }
    if (filterRef.current) {
      filterRef.current.geometry = new THREE.CylinderGeometry(0.28 * SIZE_SCALE, 0.28 * SIZE_SCALE, 1.6 * SIZE_SCALE, 48);
    }
    if (ballRef.current) {
      ballRef.current.geometry = new THREE.SphereGeometry(0.12 * SCALE_MULTIPLIER, 32, 32);
    }
  }, []); // run once

  useFrame((_, delta) => {
    // idle behavior when not animating
    if (!isAnimating) {
      const t = Date.now() * 0.001;
      const floatY = Math.sin(t * 0.9) * 0.04 * SCALE_MULTIPLIER;
      if (paperRef.current) {
        paperRef.current.position.set(2.6 * SCALE_MULTIPLIER, floatY, 0);
        paperRef.current.rotation.set(-Math.PI / 2, 0, 0);
      }
      if (filterRef.current) {
        filterRef.current.position.set(-2.6 * SCALE_MULTIPLIER, floatY, 0);
        filterRef.current.rotation.set(-Math.PI / 2, 0, 0);
      }
      if (ballRef.current) {
        ballRef.current.position.set(-2.6 * SCALE_MULTIPLIER + 0.3 * SCALE_MULTIPLIER, floatY + 0.28 * SCALE_MULTIPLIER, 0.18 * SCALE_MULTIPLIER);
      }
      if (groupRef.current) groupRef.current.rotation.y = 0;
      return;
    }

    // animate: progress ramps up to 1
    if (!doneRef.current) {
      progressRef.current = Math.min(1, progressRef.current + delta * 0.4); // tune speed here
      if (progressRef.current >= 1) {
        doneRef.current = true;
        setTimeout(() => onAnimationComplete(), 260);
      }
    }
    const p = progressRef.current;

    // phases (similar breakup but scaled/adjusted)
    const phase1 = Math.min(1, p * 2.2);                  // move together (0 -> ~0.45)
    const phase2 = Math.max(0, Math.min(1, (p - 0.42) * 1.9)); // rotate upright (0.42 -> ~0.95)
    const phase3 = Math.max(0, Math.min(1, (p - 0.75) * 4.0)); // form cone (0.75 -> 1.0)

    const moveEase = easeInOutCubic(phase1);
    const paperX = 2.6 * SCALE_MULTIPLIER - moveEase * (2.6 * SCALE_MULTIPLIER);
    const filterX = -2.6 * SCALE_MULTIPLIER + moveEase * (2.6 * SCALE_MULTIPLIER);

    const rotateEase = easeOutQuart(phase2);
    const rotationAngle = -Math.PI / 2 + rotateEase * (Math.PI / 2);

    const coneEase = easeInOutCubic(phase3);

    // paper -> cone body (larger final radii)
    const paperTopRadius = 0.28 * SCALE_MULTIPLIER + coneEase * (0.16 * SCALE_MULTIPLIER - 0.28 * SCALE_MULTIPLIER);
    const paperBottomRadius = 0.45 * SCALE_MULTIPLIER - coneEase * (0.45 * SCALE_MULTIPLIER - 0.16 * SCALE_MULTIPLIER);
    const paperHeight = 5 * SCALE_MULTIPLIER - coneEase * (5 * SCALE_MULTIPLIER - 3.2 * SCALE_MULTIPLIER);
    const paperY = coneEase * 1.9 * SCALE_MULTIPLIER;

    // filter -> cone tip
    const filterTopRadius = 0.28 * SCALE_MULTIPLIER - coneEase * (0.28 * SCALE_MULTIPLIER - 0.14 * SCALE_MULTIPLIER);
    const filterBottomRadius = (state.filterType === "wooden" ? 0.36 : 0.28) * SCALE_MULTIPLIER - coneEase * (((state.filterType === "wooden" ? 0.36 : 0.28) * SCALE_MULTIPLIER) - 0.16 * SCALE_MULTIPLIER);
    const filterHeight = 1.6 * SCALE_MULTIPLIER - coneEase * (1.6 * SCALE_MULTIPLIER - 0.9 * SCALE_MULTIPLIER);
    const filterY = paperY - (paperHeight / 2) - (filterHeight / 2) * coneEase;

    // apply transforms
    if (paperRef.current) {
      paperRef.current.position.set(paperX * (1 - phase2), paperY, 0);
      paperRef.current.rotation.set(rotationAngle, 0, 0);
    }
    if (filterRef.current) {
      filterRef.current.position.set(filterX * (1 - phase2), filterY, 0);
      filterRef.current.rotation.set(rotationAngle, 0, 0);
    }

    if (ballRef.current && state.filterType === "ball") {
      const angle = Math.PI / 4;
      const ballRadius = 0.18 * SCALE_MULTIPLIER - coneEase * (0.18 * SCALE_MULTIPLIER - 0.10 * SCALE_MULTIPLIER);
      const bx = filterX * (1 - phase2) + Math.cos(angle) * filterTopRadius;
      const by = filterY + filterHeight * 0.28 + ballRadius * 0.7;
      const bz = Math.sin(angle) * filterTopRadius;
      ballRef.current.position.set(bx, by, bz);
      const bs = 1 - coneEase * 0.36;
      ballRef.current.scale.set(bs, bs, bs);
    }

    // update geometry only during phase3 (so we don't re-create every frame)
    if (phase3 > 0) {
      if (paperRef.current?.geometry) paperRef.current.geometry.dispose();
      paperRef.current.geometry = new THREE.CylinderGeometry(
        Math.max(0.001, paperTopRadius),
        Math.max(0.001, paperBottomRadius),
        Math.max(0.001, paperHeight),
        96,
        1,
        true
      );

      if (filterRef.current?.geometry) filterRef.current.geometry.dispose();
      if (state.filterType === "wooden") {
        filterRef.current.geometry = new THREE.CylinderGeometry(
          Math.max(0.001, filterTopRadius * 0.7),
          Math.max(0.001, filterBottomRadius),
          Math.max(0.001, filterHeight),
          48
        );
      } else {
        filterRef.current.geometry = new THREE.CylinderGeometry(
          Math.max(0.001, filterTopRadius),
          Math.max(0.001, filterBottomRadius),
          Math.max(0.001, filterHeight),
          48
        );
      }
    }

    if (groupRef.current) groupRef.current.rotation.y = phase2 * Math.PI * 0.35;
  });

  return (
    <group ref={groupRef}>
      {/* Paper roll */}
      <mesh ref={paperRef} castShadow receiveShadow>
        {/* geometry is set in useEffect and replaced during animation */}
        <meshStandardMaterial color={paperColor} roughness={0.86} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Filter roll */}
      <mesh ref={filterRef} castShadow receiveShadow>
        <meshStandardMaterial
          color={state.filterType === "wooden" ? "#C9A876" : filterColor}
          roughness={state.filterType === "glass" ? 0.25 : 0.60}
          metalness={state.filterType === "glass" ? 0.6 : 0.1}
          transparent={state.filterType === "glass"}
          opacity={state.filterType === "glass" ? 0.7 : 1}
          side={THREE.DoubleSide}
          map={state.filterType === "wooden" ? getWoodTexture() : null}
        />
      </mesh>

      {/* Ball for ball filter */}
      {state.filterType === "ball" && (
        <mesh ref={ballRef} castShadow receiveShadow>
          <meshStandardMaterial color={state.filterColorHex || "#FF6B6B"} roughness={0.28} metalness={0.35} />
        </mesh>
      )}
    </group>
  );
}

/* ---------- Main exported viewer ---------- */
export default function MergeAnimationViewer({ state = {}, isAnimating = false, onAnimationComplete = () => {} }) {
  // wrapper is full-screen fixed transparent so smoke remains fully visible behind
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999, // ensure above smoke canvas
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Canvas
        style={{ width: "100vw", height: "100vh", background: "transparent", pointerEvents: "none" }}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 2.8, 7.8], fov: 38 }}
      >
        {/* No <color ... /> so canvas remains transparent */}
        <ambientLight intensity={0.65} />
        <directionalLight intensity={0.9} position={[5, 8, 6]} />
        <pointLight position={[-6, 2, -6]} intensity={0.25} />
        <SuspenseFallback />
        <MergingScene state={state} isAnimating={isAnimating} onAnimationComplete={onAnimationComplete} />
      </Canvas>
    </div>
  );
}

/* tiny suspense fallback to avoid remembering drei */
function SuspenseFallback() {
  return null;
}
// components/MergeAnimationViewer.jsx
// "use client";

// import React, { useRef, useMemo, useEffect } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import * as THREE from "three";

// /* ---------- easing utils ---------- */
// const easeInOutCubic = (t) =>
//   t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
// const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

// /* ---------- Smoky background shader ---------- */
// const SmokeBGMaterial = {
//   uniforms: {
//     time: { value: 0 },
//     color: { value: new THREE.Color("#0b1020") }, // deep smoky blue
//   },
//   vertexShader: `
//     varying vec2 vUv;
//     void main() {
//       vUv = uv;
//       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
//   `,
//   fragmentShader: `
//     varying vec2 vUv;
//     uniform float time;
//     uniform vec3 color;

//     float noise(vec2 p) {
//       return sin(p.x * 12.0 + time * 0.05) *
//              sin(p.y * 12.0 + time * 0.04);
//     }

//     void main() {
//       vec2 uv = vUv;

//       float n = noise(uv * 2.5);
//       float fade = smoothstep(0.0, 0.7, uv.y);
//       float alpha = 0.18 + n * 0.04;

//       gl_FragColor = vec4(color, alpha * fade);
//     }
//   `,
//   transparent: true,
//   depthWrite: false,
// };

// /* ---------- Full-screen smoky background ---------- */
// function SmokyBackground() {
//   const matRef = useRef();

//   useFrame((_, delta) => {
//     if (matRef.current) {
//       matRef.current.uniforms.time.value += delta;
//     }
//   });

//   return (
//     <mesh position={[0, 0, -10]} scale={[40, 25, 1]}>
//       <planeGeometry args={[1, 1]} />
//       <shaderMaterial ref={matRef} attach="material" {...SmokeBGMaterial} />
//     </mesh>
//   );
// }

// /* ---------- simple wood texture ---------- */
// function generateWoodTexture() {
//   const size = 256;
//   const data = new Uint8Array(size * size * 4);
//   for (let i = 0; i < size; i++) {
//     for (let j = 0; j < size; j++) {
//       const idx = (i * size + j) * 4;
//       const grain = Math.sin(j * 0.08) * 15;
//       data[idx] = 200 + grain;
//       data[idx + 1] = 160 + grain;
//       data[idx + 2] = 110 + grain;
//       data[idx + 3] = 255;
//     }
//   }
//   const tex = new THREE.DataTexture(data, size, size);
//   tex.needsUpdate = true;
//   return tex;
// }
// let woodTex;
// const getWoodTexture = () => (woodTex ||= generateWoodTexture());

// /* ---------- Scene content ---------- */
// function MergingScene({ state, isAnimating, onAnimationComplete }) {
//   const groupRef = useRef();
//   const paperRef = useRef();
//   const filterRef = useRef();
//   const ballRef = useRef();
//   const progress = useRef(0);
//   const done = useRef(false);

//   const SCALE = 1.6;

//   useFrame((_, delta) => {
//     if (!isAnimating) return;

//     progress.current = Math.min(1, progress.current + delta * 0.4);
//     if (progress.current === 1 && !done.current) {
//       done.current = true;
//       setTimeout(onAnimationComplete, 250);
//     }

//     const p = progress.current;
//     const move = easeInOutCubic(Math.min(1, p * 2));
//     const rot = easeOutQuart(Math.max(0, (p - 0.4) * 2));

//     if (groupRef.current) {
//       groupRef.current.rotation.y = rot * Math.PI * 0.35;
//     }
//     if (paperRef.current) {
//       paperRef.current.position.x = (1 - move) * 2.6 * SCALE;
//       paperRef.current.rotation.x = -Math.PI / 2 + rot * Math.PI / 2;
//     }
//     if (filterRef.current) {
//       filterRef.current.position.x = -(1 - move) * 2.6 * SCALE;
//       filterRef.current.rotation.x = -Math.PI / 2 + rot * Math.PI / 2;
//     }
//   });

//   return (
//     <group ref={groupRef}>
//       <mesh ref={paperRef}>
//         <cylinderGeometry args={[0.45, 0.28, 5, 64]} />
//         <meshStandardMaterial color="#A8E6CF" roughness={0.85} />
//       </mesh>

//       <mesh ref={filterRef}>
//         <cylinderGeometry args={[0.28, 0.28, 1.6, 48]} />
//         <meshStandardMaterial
//           color="#CBD5F5"
//           roughness={0.55}
//           map={state.filterType === "wooden" ? getWoodTexture() : null}
//         />
//       </mesh>

//       {state.filterType === "ball" && (
//         <mesh ref={ballRef}>
//           <sphereGeometry args={[0.12 * SCALE, 32, 32]} />
//           <meshStandardMaterial color="#FF6B6B" roughness={0.3} />
//         </mesh>
//       )}
//     </group>
//   );
// }

// /* ---------- Main Viewer ---------- */
// export default function MergeAnimationViewer({
// //   state = {},
//   isAnimating = false,
// //   onAnimationComplete = () => {},
// }) {
//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         pointerEvents: "none",
//         zIndex: 9999,
//       }}
//     >
//       <Canvas
//         gl={{ alpha: true, antialias: true }}
//         camera={{ position: [0, 2.8, 7.8], fov: 38 }}
//       >
//         {/* Smoky background FIRST */}
//         <SmokyBackground />

//         {/* Lights */}
//         <ambientLight intensity={0.6} />
//         <directionalLight position={[6, 8, 6]} intensity={0.9} />
//         <pointLight position={[-6, 2, -6]} intensity={0.3} />

//         {/* Foreground animation */}
//         <MergingScene
//           state={state}
//           isAnimating={isAnimating}
//           onAnimationComplete={onAnimationComplete}
//         />
//       </Canvas>
//     </div>
//   );
// }
