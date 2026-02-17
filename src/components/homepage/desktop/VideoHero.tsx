"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";

export default function VideoHero() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => {
        console.log("Autoplay blocked or waiting for interaction:", error);
      });
    }
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* 1. FALLBACK IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/homepage/hero-image.png"
          alt="Hero Background"
          fill
          priority
          className="object-cover opacity-80"
        />
      </div>

      {/* 2. VIDEO LAYER */}
      <div
        className={`absolute inset-0 z-0 h-full w-full transition-opacity duration-1000 ${
          isVideoLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={
            process.env.NEXT_PUBLIC_HERO_VIDEO_URL ||
            "/videos/solvideo-vmake_compressed.mp4"
          }
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlayThrough={() => setIsVideoLoaded(true)}
        />
      </div>

      {/* 3. OVERLAYS (For readability) */}
      <div className="absolute inset-0 z-10 bg-black/70 pointer-events-none" />
      
      {/* Subtle Blue Vignette */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,10,30,0.8)_100%)] pointer-events-none" />

      {/* 4. HERO CONTENT */}
      <div className="relative z-20 flex h-full items-center justify-center px-4">
        <div className="flex max-w-7xl flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* MAIN HEADING: Metallic Gradient */}
            <h1 className="mb-2 text-5xl font-black tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl font-tasa">
              <span className="bg-gradient-to-b from-white via-blue-100 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(37,99,235,0.6)]">
                Machine Made
              </span>
            </h1>

            {/* SUB HEADING: Bright Cyan Highlights */}
            <div className="flex flex-col flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xl font-bold tracking-wide sm:flex-row sm:text-2xl md:text-3xl text-slate-300">
              
              {/* Product Type (Bright Blue) */}
              <div className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
                <LayoutTextFlip
                  words={["Cones", "Blunts", "Tubes"]}
                  className="w-[140px] text-center sm:w-[180px] sm:text-right" text={""} secondtext={""}                />
              </div>

              <span className="font-medium text-slate-500 italic">for</span>

              {/* Benefit (Bright Blue) */}
              <div className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
                <LayoutTextFlip
                  words={["Perfect Quality", "Stable Shape", "Reliable Filling"]}
                  className="w-[280px] text-center sm:w-[350px] sm:text-left" text={""} secondtext={""}                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        aria-label="Scroll to next section"
        className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 cursor-pointer"
        onClick={() => {
          document.getElementById("machinery-section")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
         <div className="h-10 w-6 rounded-full border-2 border-white/50 p-1">
           <div className="h-2 w-full animate-bounce rounded-full bg-white" />
         </div>
      </motion.button>
    </section>
  );
}

// "use client";

// import { useState, useRef, useEffect } from "react";
// import Image from "next/image";
// import { motion } from "motion/react"; // Ensure you have this installed
// import { LayoutTextFlip } from "@/components/ui/layout-text-flip"; // Ensure this path is correct

// export default function VideoHero() {
//   const [isVideoLoaded, setIsVideoLoaded] = useState(false);
//   const videoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     // Ensure video plays even if the browser blocked the initial autoplay attribute
//     const video = videoRef.current;
//     if (video) {
//       video.play().catch((error) => {
//         console.log("Autoplay blocked or waiting for interaction:", error);
//       });
//     }
//   }, []);

//   return (
//     <section className="relative h-screen w-full overflow-hidden bg-black">
//       {/* 1. FALLBACK IMAGE 
//           Using Next.js 'fill' for perfect coverage. 
//           'priority' is vital for LCP (Largest Contentful Paint) optimization.
//       */}
//       <div className="absolute inset-0 z-0">
//         <Image
//           src="/homepage/hero-image.png"
//           alt="Hero Background"
//           fill
//           priority
//           className="object-cover opacity-80" // Slight opacity to blend with black bg if needed
//         />
//       </div>

//       {/* 2. VIDEO 
//           Layered on top of the image. 
//           It starts transparent and fades in only when loaded data is ready.
//       */}
//       <div
//         className={`absolute inset-0 z-0 h-full w-full transition-opacity duration-1000 ${
//           isVideoLoaded ? "opacity-100" : "opacity-0"
//         }`}
//       >
//         <video
//           ref={videoRef}
//           className="h-full w-full object-cover"
//           // Note: Env vars on client side must start with NEXT_PUBLIC_
//           src={
//             process.env.NEXT_PUBLIC_HERO_VIDEO_URL ||
//             "/videos/solvideo-vmake_compressed.mp4"
//           }
//           autoPlay
//           muted
//           loop
//           playsInline
//           preload="auto"
//           onCanPlayThrough={() => setIsVideoLoaded(true)}
//         />
//       </div>

//       {/* 3. OVERLAYS 
//           Changed from 'fixed' to 'absolute' so they scroll with the hero section.
//       */}

//       {/* Base Darkening Layer */}
//       <div className="absolute inset-0 z-10 bg-black/50 pointer-events-none" />

//       {/* Top Glow Effect */}
//       <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
//         <div
//           className="absolute -top-[40%] left-1/2 h-[120vh] w-[120vw] -translate-x-1/2 rounded-full opacity-60"
//           style={{
//             background: `radial-gradient(ellipse at top, rgba(120, 160, 210, 0.45) 0%, rgba(120, 160, 210, 0.1) 50%, transparent 70%)`,
//           }}
//         />
//       </div>

//       {/* Vignette */}
//       <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

//       {/* 4. CONTENT */}
//       <div className="relative z-20 flex h-full items-center justify-center px-6">
//         <div className="flex max-w-5xl flex-col items-center justify-center text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:flex-wrap"
//           >
//             <span
//               className="text-5xl font-extrabold tracking-tight text-[#005da0] drop-shadow-lg md:text-6xl font-tasa"
//             >
//               Machine Made
//             </span>

//             <LayoutTextFlip
//               words={["Cones", "Blunts", "Tubes"]}
//               className="w-[200px] text-white drop-shadow-lg"
//             />

//             <span className="text-5xl font-extrabold tracking-tight text-white drop-shadow-lg md:text-6xl font-tasa">
//               for
//             </span>

//             <LayoutTextFlip
//               words={["Even Quality", "Stable Shape", "Reliable Filling"]}
//               className="w-[390px] text-center text-white drop-shadow-lg sm:text-left"
//             />
//           </motion.div>
//         </div>
//       </div>

//       {/* Scroll Indicator */}
//       <button
//         aria-label="Scroll to machinery section"
//         className="absolute bottom-10 left-1/2 z-30 -translate-x-1/2 cursor-pointer transition-transform hover:scale-110"
//         onClick={() => {
//           document
//             .getElementById("machinery-section")
//             ?.scrollIntoView({ behavior: "smooth" });
//         }}
//       >
//         <div className="h-10 w-6 rounded-full border-2 border-white/50 p-1">
//           <div className="h-2 w-full animate-bounce rounded-full bg-white" />
//         </div>
//       </button>
//     </section>
//   );
// }
