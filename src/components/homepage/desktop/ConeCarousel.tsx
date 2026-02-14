"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import CarouselCanvas, {
  ANIMATION_END,
  CONE_DATA,
} from "../shared/CarouselScene";

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
      const targetProgress = Math.max(
        0,
        Math.min(1, ANIMATION_END + index * stepSize + stepSize / 2),
      );

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
      const targetPixel = containerTop + targetProgress * scrollableDistance;

      window.scrollTo({
        top: Math.max(0, targetPixel),
        behavior: "smooth",
      });
    });
  };

  return (
    <main className="min-h-screen">
      <div ref={containerRef} className="relative h-[600vh]">
        {/* Sticky Viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
          <div
            className="relative w-[95vw] h-[90vh] rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]
             bg-gradient-to-b bg-slate-950 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute top-10 left-0 right-0 z-20 text-center pointer-events-none">
              <h2 className="text-3xl font-light text-white uppercase tracking-[0.2em]"></h2>
            </div>
            <div className="absolute inset-0 z-0 pr-0">
              {/* Pass the scroll handler down */}
              <CarouselCanvas
                scrollProgress={scrollYProgress}
                onItemClick={handleScrollToStep}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
