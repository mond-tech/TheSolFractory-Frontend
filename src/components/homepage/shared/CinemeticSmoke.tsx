"use client"

export default function CinematicSmoke() {
  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">

      {/* Dark Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#050a1f] to-black" />

      {/* Smoke Layer 1 */}
      <div className="absolute top-1/3 left-1/4 w-[700px] h-[700px]
        bg-[radial-gradient(circle,rgba(255,255,255,0.07)_0%,transparent_70%)]
        blur-[120px] animate-smokeSlow" />

      {/* Smoke Layer 2 */}
      <div className="absolute bottom-1/4 right-1/3 w-[800px] h-[800px]
        bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)]
        blur-[150px] animate-smokeFloat" />

    </div>
  )
}
