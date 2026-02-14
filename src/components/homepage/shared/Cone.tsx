// "use client";

// import React from "react";
// import { useGLTF, Center } from "@react-three/drei";

// interface ConeProps {
//   url: string;
//   scale?: number; // Add optional scale prop
//   rotation?: [number, number, number]; // Add optional rotation prop
// }

// export function Cone({ url, scale = 1, rotation = [0, 0.5, 0] }: ConeProps) {
//   const { scene } = useGLTF(url);
//   const sceneClone = React.useMemo(() => scene.clone(), [scene]);

//   return (
//     <Center>
//       {/* Adjust this scale manually if they look too big/small in the scene */}
//       <primitive object={sceneClone} scale={scale} rotation={rotation}/>
//     </Center>
//   );
// }

"use client";

import React from "react";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

interface ConeProps {
  url: string;
  scale?: number;
  rotation?: [number, number, number];
  [key: string]: any;
}

export function Cone({ url, scale = 1, rotation = [0, -5, 0], ...props }: ConeProps) {
  const gltf = useGLTF(url);
  // Clone scene so we can reuse the same model multiple times
  // Use the scene from gltf and clone it in useMemo to avoid re-cloning on every render
  const sceneClone = React.useMemo(() => {
    if (!gltf?.scene) return null;
    try {
      const cloned = gltf.scene.clone();
      // Traverse and ensure all materials have proper depth settings and glass material enhancement
      cloned.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material;
          // Handle both single materials and material arrays
          const materials = Array.isArray(material) ? material : [material];
          materials.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial || 
                mat instanceof THREE.MeshPhysicalMaterial ||
                mat instanceof THREE.MeshBasicMaterial) {
              // Ensure materials write to depth buffer and test depth properly
              mat.depthWrite = true;
              mat.depthTest = true;
              
              // Enhanced glass/transparent material handling
              // Check if material is transparent (glass-like)
              if (mat.transparent || mat.opacity < 1 || 
                  (mat instanceof THREE.MeshPhysicalMaterial && mat.transmission > 0)) {
                // For glass materials, ensure they receive light properly without whitish filter
                if (mat instanceof THREE.MeshPhysicalMaterial) {
                  // Glass/transparent materials need proper lighting
                  mat.roughness = Math.min(mat.roughness || 0.01, 0.01); // Very low roughness for shine
                  mat.metalness = Math.max(mat.metalness || 0.0, 0.0); // Low metalness for glass
                  mat.clearcoat = 0.8; // Reduced clearcoat to avoid whitish filter
                  mat.clearcoatRoughness = 0.05; // Very smooth clearcoat
                  // Ensure transmission is set if it's a glass material (reduced to avoid whiteness)
                  if (mat.transmission === undefined || mat.transmission === 0) {
                    mat.transmission = 0.7; // Moderate transmission for natural glass look
                  }
                  // Remove emissive to avoid whitish filter - rely on actual lighting instead
                  mat.emissive = new THREE.Color(0x000000);
                  mat.emissiveIntensity = 0;
                } else if (mat instanceof THREE.MeshStandardMaterial) {
                  // For standard materials that are transparent, enhance them
                  mat.roughness = Math.min(mat.roughness || 0.05, 0.05);
                  mat.metalness = Math.max(mat.metalness || 0.0, 0.0);
                  // Remove emissive to avoid whitish filter
                  mat.emissive = new THREE.Color(0x000000);
                  mat.emissiveIntensity = 0;
                }
                // Ensure opacity is properly set (slightly lower for more natural glass)
                if (mat.opacity === undefined || mat.opacity === 0) {
                  mat.opacity = 0.85; // Slightly lower opacity for natural glass
                }
              }
            }
          });
        }
      });
      return cloned;
    } catch (error) {
      console.error("Error cloning scene:", error);
      return null;
    }
  }, [gltf?.scene]);

  if (!sceneClone) return null;

  return (
    <group {...props}>
      <Center>
        <primitive 
          object={sceneClone} 
          scale={scale} 
          rotation={rotation} 
        />
      </Center>
    </group>
  );
}