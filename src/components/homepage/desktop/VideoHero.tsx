"use client";

import { useState, useRef, useEffect } from "react";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { motion } from "motion/react";
import Image from "next/image";

export default function VideoHero() {
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    // Try forcing play (for some mobile browsers)
    video
      .play()
      .then(() => {
        setVideoReady(true);
      })
      .catch(() => {
        // Autoplay blocked
        setVideoReady(false);
      });
  }, []);

  return (
    <div className="relative w-full h-screen z-0 overflow-hidden">
      {/* Fallback Image */}
      {!videoReady && (
        <Image
          width={1920}
          height={1080}
          src="/homepage/hero-image.png" // <-- your image
          alt="Hero Background"
          className="fixed inset-0 h-full w-full object-cover"
        />
      )}

      {/* Video */}
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          videoReady ? "opacity-100" : "opacity-0"
        }`}
        src={
          process.env.HERO_VIDEO_URL || "/videos/solvideo-vmake_compressed.mp4"
        }
        // src={"https://ja3zeotcy2kd52jg.public.blob.vercel-storage.com/solvideo-vmake_compressed.mp4"}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlayThrough={() => setVideoReady(true)}
        onError={() => setVideoReady(false)}
        aria-hidden="true"
      />

      {/* Overlay */}
      {/* <div className="fixed inset-0 bg-gray-900/50 backdrop-grayscale-50 pointer-events-none" />*/}

      {/* Dark base overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 bg-black/80" />

      {/* Green top glow */}
      <div className="pointer-events-none fixed inset-0 z-20">
        <div
          className="
      absolute
      top-[-45%]
      left-1/2
      h-[120vh]
      w-[120vw]
      -translate-x-1/2
      rounded-full
      opacity-60
    "
          style={{
            background: `
        radial-gradient(
          ellipse at top,
          rgba(120, 160, 210, 0.45) 0%,
          rgba(120, 160, 210, 0.28) 30%,
          rgba(120, 160, 210, 0.14) 56%,
          rgba(0, 0, 0, 0) 65%
        )
      `,
          }}
        />
      </div>

      {/* Edge vignette */}
      <div className="pointer-events-none fixed inset-0 z-30 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_30%,rgba(0,0,0,0.65)_100%)]" />

      {/* Content */}
      <div className="relative z-40 flex h-full items-center justify-center px-6">
        <div className="max-w-5xl text-center flex items-center justify-center">
          <motion.div
            className="
        flex flex-col items-center justify-center text-center
        md:flex-col md:items-center
      "
          >
            {/* FIRST LINE (Desktop) */}
            <div className="flex flex-col items-center md:flex-row md:gap-2">
              <span
                className="
  whitespace-nowrap 
  text-5xl md:text-8xl 
  font-josefin tracking-tight
  bg-gradient-to-b 
  from-[#9cc4ff] 
  via-[#4f86e8] 
  to-[#002765]
  bg-clip-text 
  text-transparent
  drop-shadow-[0.1px_0.8px_5px_#111111]
"
              >
                Machine Made
              </span>

              <LayoutTextFlip
                text=""
                words={["Cones", "Blunts", "Tubes"]}
                secondtext=""
                className="w-auto md:w-[300px] drop-shadow-2xl drop-shadow-black"
              />
            </div>

            {/* SECOND LINE (Desktop) */}
            <div className="flex flex-col items-center md:flex-row md:gap-3 mt-2">
              <span
                className="
  whitespace-nowrap 
  text-5xl md:text-8xl 
  font-josefin tracking-tight
  bg-gradient-to-b 
  from-[#9cc4ff] 
  via-[#4f86e8] 
  to-[#002765]
  bg-clip-text 
  text-transparent
  
  drop-shadow-[0.2px_0.8px_5px_#000000]
"
              >
                for
              </span>

              <LayoutTextFlip
                text=""
                words={["Even Quality", "Stable Shape", "Reliable Filling"]}
                secondtext=""
                className="w-auto md:w-[630px] drop-shadow-2xl drop-shadow-black text-left"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
