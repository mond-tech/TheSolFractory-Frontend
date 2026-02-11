import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

interface GodRaysProps {
  radius?: number;
  height?: number;
  color?: string;
  position?: [number, number, number];
}

export function GodRays({
  radius = 4,
  height = 10,
  color: rayColor = "#ff8800",
  position = [0, 0, 0],
}: GodRaysProps) {
  const noiseTex = useTexture("/textures/smoke-soft.png") as THREE.Texture;

  useEffect(() => {
    if (!noiseTex) return;
    noiseTex.wrapS = noiseTex.wrapT = THREE.RepeatWrapping;
    noiseTex.anisotropy = Math.min(16, (noiseTex as any).anisotropy || 1);
    noiseTex.needsUpdate = true;
  }, [noiseTex]);

  const material = useMemo(() => {
    // Tweak these knobs
    const baseAlpha = 1.0;     // increase >1 to boost overall alpha
    const colorBoost = 6.0;    // brightness multiplier for additive blending
    const streakStrength = 0.8;
    const noiseScale = 4.0;
    const scrollSpeed = 0.35;
    const contrastPow = 1.9;   // >1 increases contrast (bright peaks)

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,              // draw on top of scene (toggle if needed)
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        time: { value: 0 },
        noiseTex: { value: noiseTex || new THREE.Texture() },
        color: { value: new THREE.Color(rayColor) },
        baseAlpha: { value: baseAlpha },
        streakStrength: { value: streakStrength },
        noiseScale: { value: noiseScale },
        scrollSpeed: { value: scrollSpeed },
        colorBoost: { value: colorBoost },
        contrastPow: { value: contrastPow },
        cameraPosition: { value: new THREE.Vector3() },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform sampler2D noiseTex;
        uniform vec3 color;
        uniform float baseAlpha;
        uniform float streakStrength;
        uniform float noiseScale;
        uniform float scrollSpeed;
        uniform float colorBoost;
        uniform float contrastPow;
        uniform vec3 cameraPosition;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPos;

        void main() {
          // animated UV for noise (scroll upwards)
          vec2 nuv = vUv;
          nuv.y += time * scrollSpeed;
          nuv *= vec2(noiseScale, noiseScale);

          // sample noise (use red channel)
          float n = texture2D(noiseTex, nuv).r;

          // increase contrast on the noise so bright areas pop
          n = pow(n, contrastPow);

          // vertical fade (soft ends)
          float bottomFade = smoothstep(0.0, 0.18, vUv.y);
          float topFade    = 1.0 - smoothstep(0.78, 1.0, vUv.y);
          float verticalFade = bottomFade * topFade;

          // streaks across X (sine wave)
          float streak = sin((vUv.x * 20.0) + (time * 0.6));
          streak = (streak * 0.5) + 0.5; // 0..1
          streak = mix(1.0 - streakStrength, 1.0, streak);

          // fresnel/facing term
          vec3 viewDir = normalize(cameraPosition - vWorldPos);
          float facing = abs(dot(normalize(vNormal), viewDir));
          float fresnel = pow(facing, 2.0);

          // combine alpha
          float alpha = baseAlpha * n * verticalFade * fresnel * streak;

          // boost RGB output for additive blending
          vec3 outColor = color * (alpha * colorBoost);

          gl_FragColor = vec4(outColor, alpha);

          // small discard to reduce overdraw
          if (gl_FragColor.a < 0.0005) discard;
        }
      `,
    });

    // ensure this mesh renders on top (optional)
    (mat as any).renderOrder = 999;

    return mat;
  }, [noiseTex, rayColor]);

  const { camera } = useThree();
  
  useFrame((state, delta) => {
    if (!material) return;
    (material.uniforms.time.value as number) += delta;
    // Update camera position uniform
    material.uniforms.cameraPosition.value.copy(state.camera.position);
    // In case you update color dynamically, you can set:
    // material.uniforms.color.value.set(rayColor);
  });

  useEffect(() => {
    return () => {
      if (material) material.dispose();
    };
  }, [material]);

  return (
    <group position={position}>
      <mesh material={material} position={[0, height / 2 - 2, 0]}>
        <cylinderGeometry args={[radius * 0.8, radius, height, 32, 1, true]} />
      </mesh>
    </group>
  );
}
