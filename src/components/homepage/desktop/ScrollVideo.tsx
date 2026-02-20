"use client";
import { useRef, useEffect, useState } from "react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const ImageSequenceScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayLockedRef = useRef(false); // Prevents re-rendering loop

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [showOverlay, setShowOverlay] = useState(false); // Controls text visibility
  
  // CONFIGURATION
  const frameCount = 191; 
  const imagesFolder = "videos/frames-q2"; 

  // 1. Preload Images
  useEffect(() => {
    let loadedCount = 0;
    const imgArray: HTMLImageElement[] = [];

    const loadImages = async () => {
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        const fileName = `frame_${i.toString().padStart(4, "0")}.jpg`;
        img.src = `${imagesFolder}/${fileName}`;
        
        img.onload = () => {
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / frameCount) * 100));
        };
        imgArray.push(img);
      }
      setImages(imgArray);
    };

    loadImages();
  }, []);

  // 2. Canvas Animation Loop
  useEffect(() => {
    if (loadingProgress < 100) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container || images.length === 0) return;

    // Optimization: alpha: false speeds up drawing
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Set High Quality Scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "medium";

    if (images[0]) {
      canvas.width = images[0].naturalWidth || window.innerWidth;
      canvas.height = images[0].naturalHeight || window.innerHeight;
    }

    const render = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const scrollY = -rect.top;
      const totalDist = rect.height - windowHeight;
      const rawProgress = scrollY / totalDist;
      const progress = Math.min(Math.max(rawProgress, 0), 1);

      // 🎯 OVERLAY TRIGGER LOGIC
      // Trigger when scrolled 40% (0.4). Adjust this number to change timing.
      if (!overlayLockedRef.current && progress > 0.4) {
        overlayLockedRef.current = true;
        setShowOverlay(true);
      }

      // Hide overlay if we scroll back up (Optional)
      if (overlayLockedRef.current && progress < 0.3) {
         overlayLockedRef.current = false;
         setShowOverlay(false);
      }

      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(progress * (frameCount - 1))
      );
      
      const img = images[frameIndex];
      
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      requestAnimationFrame(render);
    };

    const animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);

  }, [loadingProgress, images]);

  return (
    <>
    <div ref={containerRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Loading Screen */}
        {loadingProgress < 100 && (
           <div className="absolute inset-0 z-50 flex items-center justify-center bg-black text-white">
             Loading {loadingProgress}%
           </div>
        )}

        <canvas ref={canvasRef} className="w-full h-full object-cover" />
        
        {/* ✨ OVERLAY SECTION ✨ */}
        {showOverlay && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className="">
                  <TextGenerateEffect
                  words="Exceptional Quality. Endless Customization. True Scalability."
                  className="text-center text-4xl md:text-6xl text-white drop-shadow-md"
                  />
              </div>
            </div>
        )}
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
    </>
  );
};

export default ImageSequenceScroll;

// "use client";

    //     <div
    // style={{
    //     height: "80px",
    //     background: "white",
    //     maskImage: 'url("/torn-edge.png")',
    //     WebkitMaskImage: 'url("/torn-edge.png")',
    //     maskSize: "100% 100%",
    //     WebkitMaskSize: "100% 100%",
    //     maskRepeat: "no-repeat",
    //     WebkitMaskRepeat: "no-repeat",
    //     marginBottom: "-1px",
    //     zIndex: 90,

    //     /* 👇 realism magic */
    //     boxShadow: `
    //     0 2px 2px rgba(0,0,0,0.04),
    //     0 6px 12px rgba(0,0,0,0.08)
    //     `,
    // }}
    // >

    // </div>
// import React, { useRef, useEffect, useState, useMemo } from "react";
// import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

// const ImageSequenceScroll = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const overlayLockedRef = useRef(false); // Prevents re-rendering loop

//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const [images, setImages] = useState<HTMLImageElement[]>([]);
//   const [showOverlay, setShowOverlay] = useState(false); // Controls text visibility
  
//   // CONFIGURATION
//   const frameCount = 191; // Update this to your total number of frames
//   const imagesFolder = "videos/frames-q1"; // Place your images in public/frames/

//   // 1. Preload Images
//   useEffect(() => {
//     let loadedCount = 0;
//     const imgArray: HTMLImageElement[] = [];

//     const loadImages = async () => {
//       for (let i = 0; i < frameCount; i++) {
//         const img = new Image();
//         // Pad number with zeros (e.g., 0001, 0010)
//         const fileName = `frame_${i.toString().padStart(4, "0")}.jpg`;
//         img.src = `${imagesFolder}/${fileName}`;
        
//         img.onload = () => {
//           loadedCount++;
//           setLoadingProgress(Math.round((loadedCount / frameCount) * 100));
//         };
//         imgArray.push(img);
//       }
//       setImages(imgArray);
//     };

//     loadImages();
//   }, []);

//   // 2. Canvas Animation Loop
//   useEffect(() => {
//     // BLOCKER: Don't start rendering or sizing until fully loaded
//     if (loadingProgress < 100) return;

//     const canvas = canvasRef.current;
//     const container = containerRef.current;
    
//     // Ensure we have images and refs
//     if (!canvas || !container || images.length === 0) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     // NOW it is safe to check dimensions because we know loading is 100%
//     if (images[0]) {
//       // Fallbacks in case naturalWidth is still weird (rare if loaded)
//       canvas.width = images[0].naturalWidth || window.innerWidth;
//       canvas.height = images[0].naturalHeight || window.innerHeight;
//     }

//     const render = () => {
//       const rect = container.getBoundingClientRect();
//       const windowHeight = window.innerHeight;
      
//       // Calculate how much we have scrolled past the container top
//       // We want the animation to start when the container hits the top of viewport
//       const scrollY = -rect.top;
      
//       // Calculate total scrollable distance (height of container - height of viewport)
//       const totalDist = rect.height - windowHeight;
      
//       // Normalize to 0 -> 1
//       const rawProgress = scrollY / totalDist;
//       const progress = Math.min(Math.max(rawProgress, 0), 1);

//       const frameIndex = Math.min(
//         frameCount - 1,
//         Math.floor(progress * (frameCount - 1))
//       );
      
//       const img = images[frameIndex];
      
//       // Performance optimization: verify dimensions match before clearing
//       if (img && img.complete && img.naturalWidth > 0) {
//         // Optional: Only clear if you have transparency. 
//         // For video frames (opaque), you can skip clearRect for performance.
//         ctx.clearRect(0, 0, canvas.width, canvas.height); 
        
//         // Use standard drawImage
//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//       }

//       requestAnimationFrame(render);
//     };

//     const animId = requestAnimationFrame(render);
//     return () => cancelAnimationFrame(animId);

//   // CRITICAL CHANGE: Add loadingProgress to dependencies
//   }, [loadingProgress, images]);

//   return (
//     <div ref={containerRef} className="relative h-[300vh] bg-black">
//       <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
//         {/* Loading Screen */}
//         {loadingProgress < 100 && (
//            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black text-white">
//              Loading {loadingProgress}%
//            </div>
//         )}

//         <canvas ref={canvasRef} className="w-full h-full object-cover" />
        
//         {/* overlay */}
//         {showOverlay && (
//             <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
//               <div className="">
//                   <TextGenerateEffect
//                   words="Exceptional Quality. Endless Customization. True Scalability."
//                   className="text-center text-4xl md:text-6xl text-white drop-shadow-md"
//                   />
//               </div>
//             </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ImageSequenceScroll;

