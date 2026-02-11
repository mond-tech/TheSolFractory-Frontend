"use client";

import React, { useRef } from "react";
import { useScroll } from "framer-motion";
import CarouselCanvas from "./CarouselScene";

export default function ConeCarousel() {
  const containerRef = useRef(null);
  
  // Track scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <main className="w-full min-h-screen">
      
      {/* 1. SCROLL CONTAINER 
        height: 500vh ensures a long scroll so the animation plays smoothly.
      */}
      <div ref={containerRef} className="bg-white relative h-[500vh]">
        
        {/* 2. STICKY VIEWPORT
          This stays fixed on screen while we scroll through the 500vh container.
        */}
        <div className="sticky top-0 h-[100vh] w-full overflow-hidden flex flex-col items-center justify-center">

          {/* The 3D Scene */}
          <div className="w-full h-full">
            <CarouselCanvas scrollProgress={scrollYProgress} />
          </div>
          
        </div>
      </div>
    <div
    style={{
        height: "80px",
        background: "white",
        maskImage: 'url("/torn-edge.png")',
        WebkitMaskImage: 'url("/torn-edge.png")',
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        marginBottom: "-1px",
        zIndex: 90,

        /* 👇 realism magic */
        boxShadow: `
        0 2px 2px rgba(0,0,0,0.04),
        0 6px 12px rgba(0,0,0,0.08)
        `,
    }}
    ></div>

    </main>
  );
}