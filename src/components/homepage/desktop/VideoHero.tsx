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
        {/* === MOBILE IMAGE (Visible up to 767px) === */}
        <Image
          src="/homepage/hero-mobile.jpg" // 9:16 aspect ratio image
          alt="Hero Background Mobile"
          fill
          priority
          className="object-cover opacity-80 md:hidden" 
        />

        {/* === DESKTOP IMAGE (Visible from 768px up) === */}
        <Image
          src="/homepage/hero-desktop.jpg" // 16:9 aspect ratio image
          alt="Hero Background Desktop"
          fill
          priority
          className="object-cover opacity-80 hidden md:block"
        />
      </div>

      {/* 2. VIDEO LAYER */}
      <div
        className={`absolute inset-0 z-0 h-full w-full transition-opacity duration-1000 ${
          isVideoLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <video
          muted
          autoPlay
          ref={videoRef}
          className="h-full w-full object-cover"
          loop
          playsInline
          preload="auto"
          onCanPlayThrough={() => setIsVideoLoaded(true)}
        >
          <source src={process.env.NEXT_PUBLIC_HERO_VIDEO_MOBILE_URL} type="video/mp4" media="(max-width: 767px)" />
          <source src={process.env.NEXT_PUBLIC_HERO_VIDEO_DESKTOP_URL} type="video/mp4" />
        </video>
      </div>

      {/* 3. OVERLAYS (For readability) */}
      <div className="absolute inset-0 z-10 bg-black/40 pointer-events-none" />
      
      {/* Subtle Blue Vignette */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,10,30,0.8)_100%)] pointer-events-none" />

      {/* 4. HERO CONTENT */}
      <div className="relative z-20 flex h-full items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* MAIN HEADING */}
            <h1 className="mb-2 text-5xl font-black tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl font-tasa">
              <span className="bg-gradient-to-b from-white via-blue-100 to-blue-700 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(37,99,235,0.6)]">
                Machine Made
              </span>
            </h1>

            {/* SUB HEADING ROW */}
            <div className="flex flex-col flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xl font-bold tracking-wide sm:flex-row sm:text-2xl md:text-3xl text-slate-300">
              
              {/* Product Type - Fixed width of 180px */}
              <div className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
                <LayoutTextFlip
                  width="190px"
                  words={["Cones", "Blunts", "Tubes"]}
                  className="text-cyan-400" 
                  text="" 
                  secondtext=""
                />
              </div>

              <span className="font-light italic text-white/60 mx-2">for</span>

              {/* Benefit - Fixed width of 400px (wide enough for 'Perfect Quality') */}
              <div className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
                <LayoutTextFlip
                  width="390px"
                  words={["Perfect Quality", "Stable Shape", "Reliable Filling"]}
                  className="text-cyan-400" 
                  text="" 
                  secondtext=""
                />
              </div>
              
            </div>
          </motion.div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      {/* <motion.button
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
      </motion.button> */}
    </section>
  );
}
