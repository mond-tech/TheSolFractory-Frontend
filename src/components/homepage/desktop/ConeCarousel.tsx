"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionValue, type MotionValue } from "framer-motion";
import Image from "next/image";

// ------------------------------------------------------------------
// CONFIG
// ------------------------------------------------------------------
const PLACEHOLDER_IMG = "/homepage/hero-image.png";

// ------------------------------------------------------------------
// DYNAMIC IMPORTS
// ------------------------------------------------------------------
type LazyCarouselCanvasProps = {
  scrollProgress: MotionValue<number>;
  onItemClick: (index: number) => void;
  onLoadingChange?: (loading: boolean, progress: number) => void;
  showSmoke?: boolean;
};

// const LazyCarouselCanvas = dynamic<LazyCarouselCanvasProps>(
//   () => import("../shared/CarouselScene").then((m) => m.default),
//   { ssr: false, loading: () => null }
// );

const LazyCarouselCanvas = dynamic<LazyCarouselCanvasProps>(
  () => import("../desktop/ConeCarousel2").then((m) => m.default),
  { ssr: false, loading: () => null }
);

export default function LusionReplica() {
  const containerRef = useRef<HTMLDivElement>(null); 
  const stickyRef = useRef<HTMLDivElement>(null);    
  const cardRef = useRef<HTMLDivElement>(null);      
  const contentRef = useRef<HTMLDivElement>(null);   
  const accentRef = useRef<HTMLDivElement>(null);    

  // STATE
  const [mount3D, setMount3D] = useState(false);
  const [is3DReady, setIs3DReady] = useState(true);
  const [progress, setProgress] = useState(0); 
  
  // Use a ref to track mount state inside GSAP without stale closures
  const mountTrackRef = useRef(false);

  // FRAMER MOTION VALUE
  const sceneProgress = useMotionValue(0);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const card = cardRef.current;
      const content = contentRef.current;
      const container = containerRef.current;
      const sticky = stickyRef.current;
      const accent = accentRef.current;

      if (!card || !content || !container || !sticky) return;

      // --------------------------------------------------------
      // TIMELINE WITH FUNCTIONAL MATH (IMMUNE TO SCROLL BUGS)
      // --------------------------------------------------------
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          pin: sticky,
          invalidateOnRefresh: true, // Forces recalculation on resize/load
          onUpdate: (self) => {
            sceneProgress.set(self.progress);
            setProgress(self.progress);

            // Mount logic using ref to prevent React dependency loops
            if (self.progress > 0.2 && !mountTrackRef.current) {
              mountTrackRef.current = true;
              setMount3D(true);
            } else if (self.progress < 0.15 && mountTrackRef.current) {
              mountTrackRef.current = false;
              setMount3D(false);
              setIs3DReady(false);
            }
          }
        }
      });

      // 1. Accent Parallax
      if (accent) {
        tl.to(accent, { y: -100, ease: "none" }, 0);
      }

      // 2. Fade Out Text
      tl.to(content, {
        opacity: 0,
        x: 50,
        duration: 0.2,
        ease: "power1.out"
      }, 0);

      // 3. Fluid "Lusion" Expansion (Using Relative Math)
      tl.to(card, {
        // Calculate X and Y distance relative to the sticky viewport
        x: () => {
          const sRect = sticky.getBoundingClientRect();
          const cRect = card.getBoundingClientRect();
          const cardCenterX = (cRect.left - sRect.left) + (cRect.width / 2);
          return (sRect.width / 2) - cardCenterX;
        },
        y: () => {
          const sRect = sticky.getBoundingClientRect();
          const cRect = card.getBoundingClientRect();
          const cardCenterY = (cRect.top - sRect.top) + (cRect.height / 2);
          return (sRect.height / 2) - cardCenterY;
        },
        scale: () => {
          const sRect = sticky.getBoundingClientRect();
          const cRect = card.getBoundingClientRect();
          return Math.max(sRect.width / cRect.width, sRect.height / cRect.height) * 1.05;
        },
        rotation: 0,
        zIndex: 9999,
        borderRadius: "0px",
        duration: 1, // One smooth continuous motion
        ease: "power3.inOut" // The cinematic Lusion feel
      }, 0);

      // 4. Spacer to hold screen while 3D spins
      tl.to({}, { duration: 4 }); 

    }, containerRef);

    return () => ctx.revert();
  }, []); // <-- Empty array is crucial. We do NOT want to rebuild on state change.

  return (
    <div className="pt-20">
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
        transform: "rotate(180deg)",
        /* 👇 realism magic */
        boxShadow: `
        0 2px 2px rgba(0,0,0,0.04),
        0 6px 12px rgba(0,0,0,0.08)
        `,
    }}
    ></div>
    {/* bg-[#f7f8fb] */}
    <div className="relative bg-white">
      
      {/* SCROLL TRACK (400vh) */}
      <div ref={containerRef} className="h-[400vh] relative">
        
        {/* STICKY VIEWPORT */}
        <div 
          ref={stickyRef} 
          // sticky top-0 left-0
          className="relative w-[99.98684%] h-screen overflow-hidden flex items-center z-10"
        >
          {/* Global Background */}
          {/* from-gray-50 to-gray-200 */}
          <div className="absolute inset-0 bg-gradient-to-br bg-white-z-10" />

          {mount3D && (
            <div className={`absolute inset-0 z-40 w-full h-full transition-opacity duration-500 
            ${is3DReady ? 'opacity-100' : 'opacity-0'}`}
            style={{ zIndex: 10000 }}
            >
              <LazyCarouselCanvas
                scrollProgress={sceneProgress}
                onItemClick={() => {}}
                showSmoke={true}
                onLoadingChange={(loading, prog) => {
                  if (!loading && prog >= 100) {
                    setTimeout(() => setIs3DReady(true), 100);
                  }
                }}
              />
            </div>
          )}

          {/* Loader */}
          {mount3D && !is3DReady && (
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm"
            style={{ zIndex: 10001 }}>
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {/* Main Grid */}
          <div className="w-full max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-x-0 gap-y-0 items-center h-full">
            
            {/* LEFT: Expanding Card */}
            <div className="flex justify-center lg:justify-start relative">
              <div 
                ref={cardRef}
                className="relative w-[340px] h-[230px] md:w-[440px] md:h-[300px] bg-black rounded-3xl overflow-hidden shadow-[0_20px_80px_rgba(10,12,20,0.10)] origin-center will-change-transform"
                style={{ zIndex: 50 }}
              >
                {/* Static Image */}
                <div className={`absolute inset-0 transition-opacity duration-700 ${is3DReady ? 'opacity-0' : 'opacity-100'}`}>
                  <Image 
                    src={PLACEHOLDER_IMG}
                    alt="Cover"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-[#00f0ff]/10" />
                </div>
                
              </div>
            </div>

            {/* RIGHT: Content (Updated Design) */}
            <div ref={contentRef} className="lg:col-span-1 max-w-xl pl-0">
              <div className="relative">
                
                {/* Accent Stroke (Parallax) */}
                <div
                  ref={accentRef}
                  className="absolute -right-10 -top-10 w-[520px] h-[240px] opacity-80 pointer-events-none"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 rounded-[999px] border border-transparent [mask:linear-gradient(#000,transparent)]" />
                  <div className="absolute inset-0 rounded-[999px] border border-transparent bg-[conic-gradient(from_180deg_at_50%_50%,#3feeea,rgba(63,238,234,0),#00f0ff)] opacity-60 blur-[0.5px]" />
                  <div className="absolute inset-0 rounded-[999px] border border-transparent ring-1 ring-[#00f0ff]/15" />
                </div>

                <p className="text-xs tracking-[0.28em] uppercase text-black/45">
                  Experiences
                </p>
                
                <h2 className="mt-3 text-[clamp(42px,6vw,76px)] leading-[0.95] font-light tracking-tight text-[#0b0d12]">
                  Cone-style
                  <br />
                  <span className="font-medium">scroll reveal</span>
                </h2>

                <div className="mt-6 space-y-4 text-[15px] leading-6 text-black/70">
                  <p>
                    A minimal, white UI with spacious typography and a neon
                    accent stroke — the left card expands smoothly with
                    scroll-scrubbed transforms (no layout thrash).
                  </p>
                  <p>
                    The heavy Three/GLTF viewer mounts only when the card is
                    effectively full-screen. While assets load, you get a
                    centered overlay loader and a cursor &quot;loading&quot; state.
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center rounded-full bg-[#0b0d12] text-white px-6 py-3 text-sm font-medium transition-transform will-change-transform hover:scale-[1.02] active:scale-[0.99]"
                  >
                    Let&apos;s talk
                  </a>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-medium text-black/70 hover:bg-white/70 transition-colors"
                  >
                    Menu
                  </button>
                </div>

                <div className="mt-8 text-xs text-black/40 font-mono">
                  Scroll progress: {(progress * 100).toFixed(0)}%
                </div>
                
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* PROOF OF LAYOUT (Next Section) */}
      {/* <div className="h-screen bg-[#0b0d12] text-white flex items-center justify-center relative z-20">
        <h2 className="text-4xl font-light tracking-tight">Next Section</h2>
      </div> */}

    </div>
    </div>
  );
}


// "use client";

// import { useLayoutEffect, useRef, useState } from "react";
// import dynamic from "next/dynamic";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useMotionValue, type MotionValue } from "framer-motion";
// import Image from "next/image";

// // ------------------------------------------------------------------
// // CONFIG
// // ------------------------------------------------------------------
// const PLACEHOLDER_IMG = "/homepage/hero-image.png"; // Replace with your image

// // ------------------------------------------------------------------
// // DYNAMIC IMPORTS
// // ------------------------------------------------------------------
// type LazyCarouselCanvasProps = {
//   scrollProgress: MotionValue<number>;
//   onItemClick: (index: number) => void;
//   onLoadingChange?: (loading: boolean, progress: number) => void;
//   showSmoke?: boolean;
// };

// const LazyCarouselCanvas = dynamic<LazyCarouselCanvasProps>(
//   () => import("../shared/CarouselScene").then((m) => m.default),
//   { ssr: false, loading: () => null }
// );

// export default function LusionReplica() {
//   const containerRef = useRef<HTMLDivElement>(null); // The tall scroll track
//   const stickyRef = useRef<HTMLDivElement>(null);    // The sticky viewport
//   const cardRef = useRef<HTMLDivElement>(null);      // The expanding card
//   const contentRef = useRef<HTMLDivElement>(null);   // The text on the right

//   // STATE
//   const [mount3D, setMount3D] = useState(false);
//   const [is3DReady, setIs3DReady] = useState(false);
  
//   // FRAMER MOTION VALUE (for the 3D scene internal rotation)
//   const sceneProgress = useMotionValue(0);

//   useLayoutEffect(() => {
//     gsap.registerPlugin(ScrollTrigger);
    
//     const ctx = gsap.context(() => {
//       const card = cardRef.current;
//       const content = contentRef.current;
//       const container = containerRef.current;

//       if (!card || !content || !container) return;

//       // --------------------------------------------------------
//       // 1. CALCULATE GEOMETRY
//       // --------------------------------------------------------
//       // We need to know EXACTLY where the card is starting vs. the window
//       const startRect = card.getBoundingClientRect();
//       const windowW = window.innerWidth;
//       const windowH = window.innerHeight;

//       // How much to scale to fill the width?
//       // (Added 5% extra to ensure no white pixel edges)
//       const scaleRatio = (windowW / startRect.width) * 1.05;
//       const scaleHeightRatio = (windowH / startRect.height) * 1.05;
      
//       // Use the larger scale to ensure "cover" fit
//       const finalScale = Math.max(scaleRatio, scaleHeightRatio);

//       // Center alignment math
//       const cardCenterX = startRect.left + startRect.width / 2;
//       const cardCenterY = startRect.top + startRect.height / 2;
//       const screenCenterX = windowW / 2;
//       const screenCenterY = windowH / 2;

//       const moveX = screenCenterX - cardCenterX;
//       const moveY = screenCenterY - cardCenterY;

//       // --------------------------------------------------------
//       // 2. TIMELINE
//       // --------------------------------------------------------
//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: "top top",
//           end: "bottom bottom",
//           scrub: 0.5, // Smooth scrubbing
//           onUpdate: (self) => {
//             // Pass scroll progress to 3D scene
//             sceneProgress.set(self.progress);

//             // Logic to mount/unmount 3D scene
//             // We only mount when the card is effectively covering the screen (> 90%)
//             if (self.progress > 0.8 && !mount3D) {
//               setMount3D(true);
//             }
//             if (self.progress < 0.7 && mount3D) {
//               setMount3D(false);
//               setIs3DReady(false);
//             }
//           }
//         }
//       });

//       // STEP 1: Fade out text & Move Card to Center (Dialog feel)
//       tl.to(content, {
//         opacity: 0,
//         x: 50,
//         duration: 0.15,
//         ease: "power1.out"
//       }, 0)
      
//       .to(card, {
//         x: moveX,
//         y: moveY,
//         scale: 1.1, // Slight pop before big expansion
//         rotation: 0,
//         zIndex: 9999, // Ensure it sits on top of everything
//         borderRadius: "20px",
//         duration: 0.2, // 20% of scroll distance
//         ease: "power2.inOut"
//       }, 0);

//       // STEP 2: Expand to Fill Screen
//       tl.to(card, {
//         scale: finalScale,
//         borderRadius: 0,
//         duration: 0.4, // 40% of scroll distance
//         ease: "power4.inOut" // The "Lusion" dramatic ease
//       }, 0.2);

//       // STEP 3: Hold state (Rest of the scroll is just for the 3D scene interaction)
//       tl.to({}, { duration: 0.4 }); 

//     }, containerRef);

//     return () => ctx.revert();
//   }, [mount3D]);

//   return (
//     <div className="relative bg-[#f7f8fb]">
      
//       {/* THE SCROLL TRACK 
//         Height = 400vh. This determines how "long" the scroll is.
//         Increasing this makes the animation slower/smoother.
//       */}
//       <div ref={containerRef} className="h-[400vh] relative">
        
//         {/* THE STICKY VIEWPORT 
//           Instead of GSAP Pinning, we use CSS Sticky. 
//           It's rock solid and won't jitter.
//         */}
//         <div 
//           ref={stickyRef} 
//           className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center z-10"
//         >
          
//           {/* Background */}
//           <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200 -z-10" />

//           {/* Grid Layout (Initial State) */}
//           <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
            
//             {/* LEFT: The Hero Card */}
//             <div className="flex justify-center lg:justify-start relative">
              
//               <div 
//                 ref={cardRef}
//                 className="relative w-[350px] h-[250px] md:w-[500px] md:h-[350px] bg-black rounded-3xl overflow-hidden shadow-2xl origin-center will-change-transform"
//                 style={{ zIndex: 50 }} // Base z-index
//               >
//                 {/* 1. STATIC IMAGE 
//                   Visible initially, hidden when 3D is ready.
//                 */}
//                 <div 
//                   className={`absolute inset-0 transition-opacity duration-700 ${is3DReady ? 'opacity-0' : 'opacity-100'}`}
//                 >
//                   <Image 
//                     src={PLACEHOLDER_IMG}
//                     alt="Cover"
//                     fill
//                     className="object-cover"
//                     priority
//                   />
//                   {/* Dark overlay for drama */}
//                   <div className="absolute inset-0 bg-black/10" />
//                 </div>

//                 {/* 2. 3D SCENE
//                   Only renders when mount3D is true.
//                 */}
//                 {mount3D && (
//                   <div className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${is3DReady ? 'opacity-100' : 'opacity-0'}`}>
//                     <LazyCarouselCanvas
//                       scrollProgress={sceneProgress}
//                       onItemClick={() => {}}
//                       showSmoke={true}
//                       onLoadingChange={(loading, progress) => {
//                         // When loading finishes, reveal the scene
//                         if (!loading && progress >= 100) {
//                           setTimeout(() => setIs3DReady(true), 100);
//                         }
//                       }}
//                     />
//                   </div>
//                 )}
                
//                 {/* Loader Spinner (Optional) */}
//                 {mount3D && !is3DReady && (
//                   <div className="absolute inset-0 flex items-center justify-center z-50">
//                     <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
//                   </div>
//                 )}

//               </div>
//             </div>

//             {/* RIGHT: Content */}
//             <div ref={contentRef} className="flex flex-col justify-center text-left">
//               <span className="text-sm font-bold tracking-widest text-blue-600 mb-4 uppercase">
//                 Interactive Showcase
//               </span>
//               <h2 className="text-5xl md:text-7xl font-light text-gray-900 leading-tight mb-8">
//                 Autonomous <br />
//                 <span className="font-semibold italic">Robotics</span>
//               </h2>
//               <p className="text-lg text-gray-600 max-w-md leading-relaxed">
//                 Scroll down to enter the simulation. Experience our new render engine that transitions seamlessly from UI to immersive 3D.
//               </p>
//             </div>

//           </div>
//         </div>

//       </div>

//       {/* NEXT SECTION 
//         This proves the layout works. 
//       */}
//       <div className="h-screen bg-black text-white flex items-center justify-center relative z-20">
//         <h2 className="text-4xl font-bold">Next Section</h2>
//       </div>

//     </div>
//   );
// }

// "use client";

// import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
// import dynamic from "next/dynamic";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useMotionValue, type MotionValue } from "framer-motion";
// import Image from "next/image";

// type LazyCarouselCanvasProps = {
//   scrollProgress: MotionValue<number>;
//   onItemClick: (index: number) => void;
//   onLoadingChange?: (loading: boolean, progress: number) => void;
//   showSmoke?: boolean;
// };

// const LazyCarouselCanvas = dynamic<LazyCarouselCanvasProps>(
//   () => import("../shared/CarouselScene").then((m) => m.default),
//   { ssr: false, loading: () => null },
// );

// const CARD_PLACEHOLDER_SRC = "/homepage/hero-image.png"; // TODO: swap to your attached robo PNG in /public, e.g. "/homepage/robo.png"

// function isTouchLike() {
//   if (typeof window === "undefined") return true;
//   return (
//     "ontouchstart" in window ||
//     navigator.maxTouchPoints > 0 ||
//     window.matchMedia?.("(pointer: coarse)")?.matches
//   );
// }

// function prefersReducedMotion() {
//   if (typeof window === "undefined") return false;
//   return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
// }

// function CustomCursor({
//   enabled,
//   loading,
// }: {
//   enabled: boolean;
//   loading: boolean;
// }) {
//   const outerRef = useRef<HTMLDivElement>(null);
//   const innerRef = useRef<HTMLDivElement>(null);
//   const labelRef = useRef<HTMLDivElement>(null);

//   const stateRef = useRef({
//     tx: 0,
//     ty: 0,
//     x: 0,
//     y: 0,
//     mode: "idle" as "idle" | "hover" | "loading",
//     magnetEl: null as HTMLElement | null,
//     label: "",
//   });

//   useEffect(() => {
//     if (!enabled) return;

//     gsap.registerPlugin(ScrollTrigger);

//     const outer = outerRef.current;
//     const inner = innerRef.current;
//     const label = labelRef.current;
//     if (!outer || !inner || !label) return;

//     // Hide native cursor (desktop only)
//     const prevCursor = document.documentElement.style.cursor;
//     document.documentElement.style.cursor = "none";

//     const setOuterX = gsap.quickSetter(outer, "x", "px");
//     const setOuterY = gsap.quickSetter(outer, "y", "px");
//     const setInnerX = gsap.quickSetter(inner, "x", "px");
//     const setInnerY = gsap.quickSetter(inner, "y", "px");

//     const onMove = (e: PointerEvent) => {
//       stateRef.current.tx = e.clientX;
//       stateRef.current.ty = e.clientY;
//     };

//     const interactiveSelector =
//       "a,button,[role='button'],[data-cursor='hover'],summary";

//     const onPointerOver = (e: PointerEvent) => {
//       const target = (e.target as HTMLElement | null)?.closest?.(
//         interactiveSelector,
//       ) as HTMLElement | null;
//       if (!target) return;
//       if (target.closest("[data-cursor='none']")) return;

//       stateRef.current.magnetEl = target;
//       stateRef.current.mode = "hover";
//       stateRef.current.label = target.getAttribute("data-cursor-label") ?? "";

//       gsap.to(outer, { scale: 44 / 28, duration: 0.22, ease: "power2.out" });
//       gsap.to(inner, { scale: 1.15, duration: 0.22, ease: "power2.out" });

//       if (stateRef.current.label) {
//         label.textContent = stateRef.current.label;
//         gsap.to(label, { autoAlpha: 1, duration: 0.18, ease: "power2.out" });
//       }
//     };

//     const onPointerOut = (e: PointerEvent) => {
//       const leaving = e.target as HTMLElement | null;
//       if (!leaving) return;
//       if (!leaving.closest?.(interactiveSelector)) return;

//       stateRef.current.magnetEl = null;
//       stateRef.current.mode = "idle";
//       stateRef.current.label = "";

//       gsap.to(outer, { scale: 1, duration: 0.22, ease: "power2.out" });
//       gsap.to(inner, { scale: 1, duration: 0.22, ease: "power2.out" });
//       gsap.to(label, { autoAlpha: 0, duration: 0.18, ease: "power2.out" });
//     };

//     window.addEventListener("pointermove", onMove, { passive: true });
//     window.addEventListener("pointerover", onPointerOver, { passive: true });
//     window.addEventListener("pointerout", onPointerOut, { passive: true });

//     let raf = 0;
//     const tick = () => {
//       const s = stateRef.current;

//       // Loading state overrides hover/idle visuals (but keeps magnet behavior).
//       if (loading) {
//         s.mode = "loading";
//       } else if (s.mode === "loading") {
//         s.mode = s.magnetEl ? "hover" : "idle";
//       }

//       // Smooth follow
//       const follow = s.mode === "hover" ? 0.22 : 0.18;
//       s.x += (s.tx - s.x) * follow;
//       s.y += (s.ty - s.y) * follow;

//       let ox = s.x;
//       let oy = s.y;

//       // Magnetic attraction
//       if (s.magnetEl) {
//         const r = s.magnetEl.getBoundingClientRect();
//         const cx = r.left + r.width / 2;
//         const cy = r.top + r.height / 2;
//         ox += (cx - ox) * 0.35;
//         oy += (cy - oy) * 0.35;
//       }

//       setOuterX(ox);
//       setOuterY(oy);
//       setInnerX(s.x);
//       setInnerY(s.y);

//       raf = requestAnimationFrame(tick);
//     };
//     raf = requestAnimationFrame(tick);

//     return () => {
//       window.removeEventListener("pointermove", onMove);
//       window.removeEventListener("pointerover", onPointerOver);
//       window.removeEventListener("pointerout", onPointerOut);
//       cancelAnimationFrame(raf);
//       document.documentElement.style.cursor = prevCursor;
//     };
//   }, [enabled, loading]);

//   if (!enabled) return null;

//   return (
//     <div
//       className="fixed inset-0 pointer-events-none z-[9999] hidden md:block"
//       aria-hidden="true"
//     >
//       <div
//         ref={outerRef}
//         className="absolute left-0 top-0 w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35 bg-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-[2px] will-change-transform"
//       >
//         {/* loader ring (shows only during loading) */}
//         <svg
//           className={`absolute inset-0 w-full h-full ${
//             loading ? "opacity-100 animate-spin" : "opacity-0"
//           } transition-opacity duration-200`}
//           viewBox="0 0 28 28"
//         >
//           <circle
//             cx="14"
//             cy="14"
//             r="12"
//             fill="none"
//             stroke="rgba(255,255,255,0.9)"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeDasharray="22 10"
//           />
//         </svg>
//       </div>

//       <div
//         ref={innerRef}
//         className={`absolute left-0 top-0 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.25)] will-change-transform ${
//           loading ? "animate-pulse" : ""
//         }`}
//       />

//       <div
//         ref={labelRef}
//         className="absolute left-0 top-0 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-full bg-black/70 text-white text-[11px] px-3 py-1 opacity-0 will-change-transform"
//       />
//     </div>
//   );
// }

// export default function ConeCarousel() {
//   // Refs for the new architecture
//   const containerRef = useRef<HTMLDivElement>(null); // The tall scroll track (400vh)
//   const stickyRef = useRef<HTMLDivElement>(null);   // The sticky viewport
//   const cardRef = useRef<HTMLDivElement>(null);      // The expanding card
//   const copyRef = useRef<HTMLDivElement>(null);      // The text on the right
//   const accentRef = useRef<HTMLDivElement>(null);    // The accent stroke

//   // State
//   const [progress, setProgress] = useState(0);
//   const [shouldMount3D, setShouldMount3D] = useState(false);
//   const [is3DLoading, setIs3DLoading] = useState(false);
//   const [is3DReady, setIs3DReady] = useState(false);

//   const touch = useMemo(() => isTouchLike(), []);
//   const reduce = useMemo(() => prefersReducedMotion(), []);
//   const sceneProgress = useMotionValue(0);

//   // Ref to track mount state without causing effect re-runs
//   const mount3DRef = useRef(false);

//   // Main animation setup using useLayoutEffect for proper timing
//   useLayoutEffect(() => {
//     gsap.registerPlugin(ScrollTrigger);

//     const ctx = gsap.context(() => {
//       const card = cardRef.current;
//       const copy = copyRef.current;
//       const accent = accentRef.current;
//       const container = containerRef.current;

//       if (!card || !copy || !accent || !container) return;

//       // Wait for layout to settle before calculating
//       const initAnimation = () => {
//         // Reset to baseline
//         gsap.set(card, {
//           x: 0,
//           y: 0,
//           scale: 1,
//           borderRadius: 24,
//           force3D: true,
//           transformOrigin: "center center",
//           zIndex: 50, // Base z-index
//         });
//         gsap.set(copy, { opacity: 1, y: 0 });
//         gsap.set(accent, { yPercent: 0 });

//         // Use requestAnimationFrame to ensure layout is ready
//         requestAnimationFrame(() => {
//           const startRect = card.getBoundingClientRect();
          
//           // Safety check: ensure card is visible
//           if (startRect.width === 0 || startRect.height === 0) {
//             setTimeout(initAnimation, 100);
//             return;
//           }

//           const windowW = window.innerWidth;
//           const windowH = window.innerHeight;

//           // Calculate scale to fill screen (cover fit with 5% extra to avoid edges)
//           const scaleRatio = (windowW / startRect.width) * 1.05;
//           const scaleHeightRatio = (windowH / startRect.height) * 1.05;
//           const finalScale = Math.max(scaleRatio, scaleHeightRatio);

//           // Calculate center alignment using FLIP math
//           const cardCenterX = startRect.left + startRect.width / 2;
//           const cardCenterY = startRect.top + startRect.height / 2;
//           const screenCenterX = windowW / 2;
//           const screenCenterY = windowH / 2;

//           const moveX = screenCenterX - cardCenterX;
//           const moveY = screenCenterY - cardCenterY;

//           // Create timeline
//           const tl = gsap.timeline({
//             scrollTrigger: {
//               trigger: container,
//               start: "top top",
//               end: "bottom bottom",
//               scrub: reduce ? false : 0.5,
//               onUpdate: (self) => {
//                 const p = self.progress;
//                 setProgress(p);
//                 sceneProgress.set(p);

//                 // Mount/unmount 3D scene logic using ref to avoid stale closures
//                 if (p > 0.8 && !mount3DRef.current) {
//                   mount3DRef.current = true;
//                   setShouldMount3D(true);
//                   setIs3DLoading(true);
//                 }
//                 if (p < 0.7 && mount3DRef.current) {
//                   mount3DRef.current = false;
//                   setShouldMount3D(false);
//                   setIs3DLoading(false);
//                   setIs3DReady(false);
//                 }
//               },
//             },
//           });

//           // Step 1: Fade out text and move accent (early in scroll)
//           tl.to(accent, {
//             yPercent: -28,
//             duration: 0.15,
//             ease: "power1.out",
//           }, 0);

//           tl.to(copy, {
//             opacity: 0,
//             y: -12,
//             duration: 0.2,
//             ease: "power2.out",
//           }, 0.1);

//           // Step 2: Move card to center and expand
//           tl.to(card, {
//             x: moveX,
//             y: moveY,
//             scale: finalScale,
//             borderRadius: 0,
//             zIndex: 9999, // Ensure it covers navbar
//             duration: 0.65,
//             ease: "power4.inOut",
//           }, 0.1);

//           // Step 3: Hold state for remaining scroll (for 3D interaction)
//           tl.to({}, { duration: 0.2 });
//         });
//       };

//       // Wait for images to load before initializing
//       const images = container.querySelectorAll("img");
//       let imagesLoaded = 0;
//       const totalImages = images.length;

//       const tryInit = () => {
//         if (imagesLoaded >= totalImages || totalImages === 0) {
//           setTimeout(() => {
//             initAnimation();
//             ScrollTrigger.refresh();
//           }, 100);
//         }
//       };

//       let initTimeout: ReturnType<typeof setTimeout> | null = null;
//       let fallbackTimeout: ReturnType<typeof setTimeout> | null = null;

//       if (totalImages === 0) {
//         tryInit();
//       } else {
//         images.forEach((img) => {
//           if ((img as HTMLImageElement).complete) {
//             imagesLoaded++;
//           } else {
//             img.addEventListener("load", () => {
//               imagesLoaded++;
//               if (imagesLoaded >= totalImages && !initTimeout) {
//                 tryInit();
//                 if (fallbackTimeout) {
//                   clearTimeout(fallbackTimeout);
//                   fallbackTimeout = null;
//                 }
//               }
//             });
//             img.addEventListener("error", () => {
//               imagesLoaded++;
//               if (imagesLoaded >= totalImages && !initTimeout) {
//                 tryInit();
//                 if (fallbackTimeout) {
//                   clearTimeout(fallbackTimeout);
//                   fallbackTimeout = null;
//                 }
//               }
//             });
//           }
//         });
//         // Fallback: initialize even if images don't load within 1 second
//         fallbackTimeout = setTimeout(() => {
//           if (!initTimeout) {
//             tryInit();
//           }
//         }, 1000);
//       }

//       // Handle resize
//       let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
//       const handleResize = () => {
//         if (resizeTimeout) clearTimeout(resizeTimeout);
//         resizeTimeout = setTimeout(() => {
//           ScrollTrigger.refresh();
//         }, 150);
//       };

//       window.addEventListener("resize", handleResize, { passive: true });
//       window.addEventListener("orientationchange", handleResize, { passive: true });

//       return () => {
//         if (initTimeout) clearTimeout(initTimeout);
//         if (fallbackTimeout) clearTimeout(fallbackTimeout);
//         if (resizeTimeout) clearTimeout(resizeTimeout);
//         window.removeEventListener("resize", handleResize);
//         window.removeEventListener("orientationchange", handleResize);
//       };
//     }, containerRef);

//     return () => ctx.revert();
//   }, [reduce, shouldMount3D, sceneProgress]);

//   return (
//     <section
//       className="relative w-full bg-[#f7f8fb] text-[#0b0d12] overflow-hidden"
//       aria-label="Experiences"
//     >
//       <CustomCursor enabled={!touch} loading={is3DLoading && !is3DReady} />

//       {/* THE SCROLL TRACK - Tall container (400vh) determines scroll length */}
//       <div ref={containerRef} className="h-[400vh] relative">
        
//         {/* THE STICKY VIEWPORT - CSS Sticky instead of GSAP pinning */}
//         <div
//           ref={stickyRef}
//           className="sticky top-0 left-0 w-full h-screen overflow-hidden z-10"
//         >
//           {/* Background gradient */}
//           <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f7f8fb] to-[#f2f3f7]" />

//           {/* Content container */}
//           <div className="relative z-10 h-full px-6 md:px-10 lg:px-16 py-16">
//             <div className="grid h-full grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
//               {/* LEFT: framed card */}
//               <div className="lg:col-span-5 flex justify-center lg:justify-start">
//                 <div
//                   ref={cardRef}
//                   className="relative w-[340px] h-[230px] md:w-[440px] md:h-[300px] rounded-3xl border border-black/10 bg-white shadow-[0_20px_80px_rgba(10,12,20,0.10)] overflow-hidden will-change-transform"
//                   style={{ zIndex: 50 }}
//                 >
//                   {/* placeholder image (stays until 3D is ready) */}
//                   <div
//                     className={`absolute inset-0 transition-opacity duration-500 ${
//                       is3DReady ? "opacity-0" : "opacity-100"
//                     }`}
//                   >
//                     <Image
//                       src={CARD_PLACEHOLDER_SRC}
//                       alt="Product preview"
//                       width={440}
//                       height={300}
//                       className="h-full w-full object-cover"
//                       draggable={false}
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-[#00f0ff]/10" />
//                   </div>

//                   {/* 3D stage (lazy mounted) */}
//                   {shouldMount3D && (
//                     <div
//                       className={`absolute inset-0 transition-opacity duration-500 ${
//                         is3DReady ? "opacity-100" : "opacity-0"
//                       }`}
//                     >
//                       <LazyCarouselCanvas
//                         scrollProgress={sceneProgress}
//                         onItemClick={() => {}}
//                         showSmoke={false}
//                         onLoadingChange={(loading: boolean, prog: number) => {
//                           setIs3DLoading(loading);
//                           if (!loading && prog >= 100) setIs3DReady(true);
//                         }}
//                       />
//                     </div>
//                   )}

//                   {/* overlay loader */}
//                   {(is3DLoading || (shouldMount3D && !is3DReady)) && (
//                     <div className="absolute inset-0 grid place-items-center bg-white/65 backdrop-blur-sm">
//                       <div className="flex items-center gap-3 text-sm text-black/70">
//                         <div className="w-6 h-6 rounded-full border-2 border-black/15 border-t-black/70 animate-spin" />
//                         <span className="font-medium">Loading 3D…</span>
//                       </div>
//                     </div>
//                   )}

//                   {/* touch fallback: manual load */}
//                   {touch && !shouldMount3D && (
//                     <div className="absolute inset-0 grid place-items-center bg-white/0">
//                       <button
//                         type="button"
//                         data-cursor="hover"
//                         data-cursor-label="Load 3D"
//                         onClick={() => {
//                           setShouldMount3D(true);
//                           setIs3DLoading(true);
//                         }}
//                         className="pointer-events-auto rounded-full border border-black/15 bg-white/80 px-4 py-2 text-sm font-medium text-black/80 shadow-sm backdrop-blur hover:bg-white transition-colors"
//                       >
//                         Tap to load 3D
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* RIGHT: copy */}
//               <div ref={copyRef} className="lg:col-span-7 max-w-xl">
//                 <div className="relative">
//                   {/* accent stroke (parallax) */}
//                   <div
//                     ref={accentRef}
//                     className="absolute -right-10 -top-10 w-[520px] h-[240px] opacity-80 pointer-events-none"
//                     aria-hidden="true"
//                   >
//                     <div className="absolute inset-0 rounded-[999px] border border-transparent [mask:linear-gradient(#000,transparent)]" />
//                     <div className="absolute inset-0 rounded-[999px] border border-transparent bg-[conic-gradient(from_180deg_at_50%_50%,#3feeea,rgba(63,238,234,0),#00f0ff)] opacity-60 blur-[0.5px]" />
//                     <div className="absolute inset-0 rounded-[999px] border border-transparent ring-1 ring-[#00f0ff]/15" />
//                   </div>

//                   <p className="text-xs tracking-[0.28em] uppercase text-black/45">
//                     Experiences
//                   </p>
//                   <h2 className="mt-4 text-[clamp(42px,6vw,76px)] leading-[0.95] font-light tracking-tight">
//                     Cone-style
//                     <br />
//                     <span className="font-medium">scroll reveal</span>
//                   </h2>

//                   <div className="mt-8 space-y-6 text-[15px] leading-7 text-black/70">
//                     <p>
//                       A minimal, white UI with spacious typography and a neon
//                       accent stroke — the left card expands smoothly with
//                       scroll-scrubbed transforms (no layout thrash).
//                     </p>
//                     <p>
//                       The heavy Three/GLTF viewer mounts only when the card is
//                       effectively full-screen. While assets load, you get a
//                       centered overlay loader and a cursor "loading" state.
//                     </p>
//                   </div>

//                   <div className="mt-10 flex items-center gap-4">
//                     <a
//                       href="#"
//                       data-cursor="hover"
//                       data-cursor-label="Let's talk"
//                       className="inline-flex items-center justify-center rounded-full bg-[#0b0d12] text-white px-6 py-3 text-sm font-medium transition-transform will-change-transform hover:scale-[1.02] active:scale-[0.99]"
//                     >
//                       Let's talk
//                     </a>
//                     <button
//                       type="button"
//                       data-cursor="hover"
//                       className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-medium text-black/70 hover:bg-white/70 transition-colors"
//                     >
//                       Menu
//                     </button>
//                   </div>

//                   <div className="mt-10 text-xs text-black/40">
//                     Scroll progress: {(progress * 100).toFixed(0)}%
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tail space after scroll track */}
//       <div className="h-[30vh]" />
//     </section>
//   );
// }
