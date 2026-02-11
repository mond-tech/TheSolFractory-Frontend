"use client";

import React from "react";
import { useGLTF, Center } from "@react-three/drei";

interface ConeProps {
  url: string;
}

export function Cone({ url }: ConeProps) {
  const { scene } = useGLTF(url);
  const sceneClone = React.useMemo(() => scene.clone(), [scene]);

  return (
    <Center>
      {/* Adjust this scale manually if they look too big/small in the scene */}
      <primitive object={sceneClone} scale={45} />
    </Center>
  );
}