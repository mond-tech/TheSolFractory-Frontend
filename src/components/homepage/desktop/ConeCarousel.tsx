"use client";

import React, { useRef } from "react";
import { useScroll } from "framer-motion";
import CarouselCanvas, { ANIMATION_END, CONE_DATA } from "../shared/CarouselScene"; 

export default function ConeCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // --- THE SCROLL FIX ---
  const handleScrollToStep = (index: number) => {
    if (!containerRef.current) return;
    if (index < 0 || index >= CONE_DATA.length) return;

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      if (!containerRef.current) return;

      // 1. Calculate the 'progress' (0.0 to 1.0) we want to achieve
      // Logic: The carousel exists in the space between ANIMATION_END (35%) and 100%.
      const carouselRange = 1 - ANIMATION_END;
      const stepSize = carouselRange / CONE_DATA.length;
      
      // Target is: End of Intro Animation + (Target Index * Size of one step) + (Half a step to center it)
      // Clamp to valid range [0, 1]
      const targetProgress = Math.max(0, Math.min(1, ANIMATION_END + (index * stepSize) + (stepSize / 2)));

      // 2. Convert that progress into absolute scroll position
      // With useScroll offset: ["start start", "end end"]:
      // - Progress 0 = when container top reaches viewport top
      // - Progress 1 = when container bottom reaches viewport bottom
      const element = containerRef.current;
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const containerHeight = rect.height;
      
      // Get container's absolute top position in document coordinates
      // This works regardless of current scroll position
      const containerTop = window.scrollY + rect.top;
      
      // Scrollable distance: how much we need to scroll to go from progress 0 to 1
      const scrollableDistance = Math.max(0, containerHeight - viewportHeight);
      
      // 3. Calculate target scroll position
      // At progress 0, scroll = containerTop (when rect.top = 0)
      // At progress 1, scroll = containerTop + scrollableDistance (when rect.top = -scrollableDistance)
      const targetPixel = containerTop + (targetProgress * scrollableDistance);

      window.scrollTo({
        top: Math.max(0, targetPixel),
        behavior: 'smooth'
      });
    });
  };

  return (
    <main className="min-h-screen">
      <div ref={containerRef} className="relative h-[600vh]">
        
        {/* Sticky Viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
            
            <div className="relative w-[95vw] h-[90vh] rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]
             bg-gradient-to-b bg-slate-950 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 z-0 pr-5">
                    {/* Pass the scroll handler down */}
                    <CarouselCanvas 
                        scrollProgress={scrollYProgress} 
                        onItemClick={handleScrollToStep}
                    />
                </div>
            </div>

        </div>
      </div>
      
      {/* <div className="h-screen bg-slate-900 flex items-center justify-center text-white">
        <h2 className="text-4xl font-bold">Next Section</h2>
      </div> */}
    </main>
  );
}
// "use client";

// import React, { useRef } from "react";
// import { useScroll } from "framer-motion";
// import CarouselCanvas from "../shared/CarouselScene"; // Adjust path as needed

// export default function ConeCarousel() {
//   const containerRef = useRef(null);
  
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end end"],
//   });

//   return (
//     <main className="bg-slate-950 min-h-screen">
//       {/* Container Height: 600vh 
//         This is the "physical" distance the user must scroll.
//         By increasing this from ~270vh to 600vh, the user has to scroll 
//         much more to complete the same animation sequence, making it feel slower.
//       */}
//       <div ref={containerRef} className="relative h-[1300vh]">
        
//         {/* Sticky Viewport */}
//         <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
            
//             {/* Visual Frame */}
//             <div className="relative w-[95vw] h-[90vh] rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-gradient-to-b from-slate-900/50 to-slate-950/50 backdrop-blur-sm overflow-hidden">
//                 <div className="absolute inset-0 z-0">
//                     <CarouselCanvas scrollProgress={scrollYProgress} />
//                 </div>
                
//                 {/* Optional: Scroll Hint */}
//                 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-pulse text-sm font-mono pointer-events-none z-10">
//                     SCROLL TO EXPLORE
//                 </div>
//             </div>

//         </div>
//       </div>
      
//       {/* Footer / Next Content Section */}
//       {/* <div className="h-screen bg-slate-900 flex items-center justify-center text-white">
//         <h2 className="text-4xl font-bold">Next Section</h2>
//       </div> */}
//     </main>
//   );
// }


// // app/page.js
// "use client";

// import React, { useRef } from "react";
// import { useScroll } from "framer-motion";
// import CarouselCanvas from "../shared/CarouselScene";

// export default function ConeCarousel() {
//   const containerRef = useRef(null);
  
//   // Track scroll progress of the container
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end end"],
//   });

//   return (
//     <main className=" min-h-screen">
//           <div ref={containerRef} className="relative h-[270vh] bg-[rgba(0,20,52,0)] pt-15">
//       <div className="sticky top-10 m-auto h-[90vh] w-[95vw] overflow-hidden rounded-2xl shadow-[0_5px_35px_rgba(255,255,255,0.25)] outline outline-offset-2 border-white/60">
      
//       {/* 1. SCROLL CONTAINER 
//         height: 500vh ensures a long scroll so the animation plays smoothly.
//       */}
//       <div ref={containerRef} className="relative h-1000vh]">
        
//         {/* 2. STICKY VIEWPORT
//           This stays fixed on screen while we scroll through the 500vh container.
//         */}
//         <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">

//           {/* The 3D Scene */}
//           <div className="w-full h-full">
//             <CarouselCanvas scrollProgress={scrollYProgress} />
//           </div> </div> </div>
          
//         </div>
//       </div>
//     </main>
//   );
// }