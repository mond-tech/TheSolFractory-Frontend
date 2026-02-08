"use client";

import React from "react";
import { useGLTF, Center } from "@react-three/drei";

interface ConeProps {
  url: string;
  scale?: number; // Add optional scale prop
  rotation?: [number, number, number]; // Add optional rotation prop
}

export function Cone({ url, scale = 1, rotation = [0, 0.5, 0] }: ConeProps) {
  const { scene } = useGLTF(url);
  const sceneClone = React.useMemo(() => scene.clone(), [scene]);

  return (
    <Center>
      {/* Adjust this scale manually if they look too big/small in the scene */}
      <primitive object={sceneClone} scale={scale} rotation={rotation}/>
    </Center>
  );
}


// "use client";

// import React, { useEffect } from "react";
// import { useGLTF, Center } from "@react-three/drei";
// import * as THREE from "three";

// interface ConeProps {
//   url: string;  
//   scale?: number;
//   rotation?: [number, number, number];
//   [key: string]: any;
// }

// export function Cone({ url, scale = 1, rotation = [0, -5, 0], ...props }: ConeProps) {
//   const { scene } = useGLTF(url);  
//   // Clone scene so we can reuse the same model multiple times
//   const sceneClone = React.useMemo(() => {
//     const cloned = scene.clone();  
    
//     // Traverse and fix transparent materials
//     cloned.traverse((child) => {
//       if (child instanceof THREE.Mesh && child.material) {
//         const material = child.material;  
        
//         // Handle both single materials and material arrays
//         const materials = Array.isArray(material) ? material : [material];
        
//         materials.forEach((mat) => {
//           if (mat instanceof THREE.MeshStandardMaterial ||   
//               mat instanceof THREE.MeshPhysicalMaterial ||
//               mat instanceof THREE.MeshBasicMaterial) {
              
//             // If material is transparent, ensure proper settings
//             if (mat.transparent) {
//               mat.depthWrite = false; // Important for proper transparency rendering  
//               mat.side = THREE.DoubleSide; // Ensure both sides are visible for glass
              
//               // Ensure opacity is set if it's transparent
//               if (mat.opacity === undefined || mat.opacity === 1) {
//                 mat.opacity = mat.opacity || 0.7;  
//               }
//             }
//           }
//         });
//       }
//     });
    
//     return cloned;
//   }, [scene]);

//   return (
//     <group {...props}>  
//       <Center>
//         <primitive 
//           object={sceneClone} 
//           scale={scale} 
//           rotation={rotation} 
//         />
//       </Center>
//     </group>
//   );
// }

