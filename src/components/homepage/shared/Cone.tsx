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
import { Group } from "three";

interface ConeProps {
  url: string;
  scale?: number;
  rotation?: [number, number, number];
  [key: string]: any;
}

export function Cone({ url, scale = 1, rotation = [0, 0, 0], ...props }: ConeProps) {
  const { scene } = useGLTF(url);
  // Clone scene so we can reuse the same model multiple times
  const sceneClone = React.useMemo(() => scene.clone(), [scene]);

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



// "use client";

// import React, { useLayoutEffect, useMemo } from "react";
// import { useGLTF, Center } from "@react-three/drei";
// import { Mesh, MeshPhysicalMaterial, MeshStandardMaterial } from "three";

// interface ConeProps {
//   url: string;
//   scale?: number; // Add optional scale prop
//   rotation?: [number, number, number]; // Add optional rotation prop
// }

// export function Cone({ url, scale = 1, rotation = [0, 0.5, 0] }: ConeProps) {
//   const { scene } = useGLTF(url);
//   const sceneClone = useMemo(() => scene.clone(), [scene]);

//   useLayoutEffect(() => {
//     // 1. Identify if this is the Glass Cone file
//     const isGlassFile = url.toLowerCase().includes("Cone Glass Filter.glb");

//     sceneClone.traverse((node) => {
//       if ((node as Mesh).isMesh) {
//         const mesh = node as Mesh;

//         // 2. FIX: Boost shine on EVERYTHING (solves the "lost shine" issue)
//         if (mesh.material) {
//            // @ts-ignore
//            mesh.material.envMapIntensity = 3; 
//            // @ts-ignore
//            mesh.material.needsUpdate = true;
//         }

//         // 3. FIX: If this is the Glass File, find the filter part
//         if (isGlassFile) {
//           // Check if this part is the filter (by name)
//           // If this doesn't work, check your console logs for the exact mesh name
//           const isFilterPart = 
//             mesh.name.toLowerCase().includes("filter") || 
//             mesh.name.toLowerCase().includes("tip") || 
//             mesh.name.toLowerCase().includes("glass");

//           if (isFilterPart) {
//              const oldMat = mesh.material as any;
             
//              // Create Realistic Glass Material
//              mesh.material = new MeshPhysicalMaterial({
//                map: oldMat.map,          // Keep texture
//                color: oldMat.color,      // Keep tint
//                roughness: 0,             // Perfectly smooth
//                metalness: 0.1,           // Slight reflection
//                transmission: 1,          // 100% Light passes through
//                thickness: 0.5,           // Glass volume
//                ior: 1.5,                 // Refraction index (Glass)
//                envMapIntensity: 4,       // High reflections
//                transparent: true,
//                opacity: 1
//              });
//           }
//         }
//       }
//     });
//   }, [sceneClone, url]);

//   return (
//     <Center>
//       {/* Adjust this scale manually if they look too big/small in the scene */}
//       <primitive object={sceneClone} scale={scale} rotation={rotation}/>
//     </Center>
//   );
// }
