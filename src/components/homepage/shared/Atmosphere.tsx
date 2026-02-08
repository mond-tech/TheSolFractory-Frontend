"use client";
import * as THREE from "three";
import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

export function BackgroundSphere() {
  return (
    <mesh scale={80}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial side={THREE.BackSide} color="#070b17" />
    </mesh>
  );
}

export function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial
        color="#0b0f1f"
        roughness={0.25}
        metalness={0.35}
      />
    </mesh>
  );
}

export function SmokeLayer({ position, scale, opacity, color }: any) {
  const ref = useRef<THREE.Mesh>(null);
  const texture = useMemo(
    () => new THREE.TextureLoader().load("/textures/smoke.png"),
    []
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.x =
      Math.sin(clock.elapsedTime * 0.1) * 0.6;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <planeGeometry args={[10, 6]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        color={color}
      />
    </mesh>
  );
}

export function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(300 * 3);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, []);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.0004;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ffcc88"
        transparent
        opacity={0.35}
      />
    </points>
  );
}

export function CinematicLights() {
  return (
    <>
      <ambientLight intensity={0.25} color="#1a2238" />

      <directionalLight
        position={[4, 6, 4]}
        intensity={4}
        color="#ffb066"
        castShadow
      />

      <directionalLight
        position={[-4, 2, 2]}
        intensity={1.4}
        color="#4b6cff"
      />

      <pointLight
        position={[0, 3, -6]}
        intensity={6}
        color="#ffcc88"
      />
    </>
  );
}

export function PostFX() {
  return (
    <EffectComposer>
      <Bloom intensity={0.45} luminanceThreshold={0.3} />
      <Vignette offset={0.25} darkness={0.6} />
    </EffectComposer>
  );
}
