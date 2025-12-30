"use client"

import { Canvas } from "@react-three/fiber"

export default function TestCanvas() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <ambientLight />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
      </Canvas>
    </div>
  )
}
