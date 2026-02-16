"use client";
 
import { useEffect, useRef, useState } from "react";
import { AnimatedPinCard } from "@/src/sharedcomponents/PinCard3D";
import MobileTrustCones from "../mobile/MobileTrustCones";
import { useIsMobile } from "@/hooks/use-mobile";
import FullPageLoader from "@/src/components/global/FullPageLoader";
import { motion } from "framer-motion";
 
const features = [
  {
    title: "Food-grade glue & materials",
    description: "Safe, clean, and tested for consistent performance.",
    image: "/homepage/conestack.png",
  },
  {
    title: "Cleanroom manufacturing",
    description:
      "Debris-free cones with consistent, uniform structure.",
    image: "/homepage/conestack.png",
  },
  {
    title: "Strict quality control",
    description:
      "Batch testing and precision checks ensure reliability at scale.",
    image: "/homepage/conestack.png",
  },
  {
    title: "Even, reliable burn",
    description:
      "Engineered for smooth airflow and predictable burn performance.",
    image: "/homepage/conestack.png",
  },
];
 
export default function TrustConesSection() {
  const isMobile = useIsMobile();
 
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
 
  const [activeRow, setActiveRow] = useState<"top" | "bottom" | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
 
  useEffect(() => {
    if (isMobile) return;
 
    const createObserver = (
      ref: React.RefObject<HTMLDivElement | null>,
      row: "top" | "bottom"
    ) =>
      new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
 
          if (debounceRef.current) clearTimeout(debounceRef.current);
 
          if (entry.intersectionRatio > 0.65) {
            debounceRef.current = setTimeout(() => {
              setActiveRow(row);
            }, 120);
          }
 
          if (entry.intersectionRatio < 0.35) {
            debounceRef.current = setTimeout(() => {
              setActiveRow((prev) => (prev === row ? null : prev));
            }, 120);
          }
        },
        { threshold: [0.35, 0.65] }
      );
 
    const topObserver = createObserver(topRowRef, "top");
    const bottomObserver = createObserver(bottomRowRef, "bottom");
 
    if (topRowRef.current) topObserver.observe(topRowRef.current);
    if (bottomRowRef.current) bottomObserver.observe(bottomRowRef.current);
 
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      topObserver.disconnect();
      bottomObserver.disconnect();
    };
  }, [isMobile]);
 
  if (isMobile === null) return <FullPageLoader />;
  if (isMobile) return <MobileTrustCones />;
 
  const topRowVisible = activeRow === "top";
  const bottomRowVisible = activeRow === "bottom";
 
  return (
    <section className="w-full py-10 flex justify-center px-6">
      <div className="max-w-6xl w-full flex flex-col items-center">
 
        {/* Animated Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="backdrop-blur-lg px-10 py-8 text-center mb-15"
        >
          <h2
            className="text-3xl md:text-4xl font-w-[400px] text-white mb-3"
            style={{ textShadow: "0 0 2px rgba(255,255,255,0.6)" }}
          >
            Why Brands Trust Our Cones
            <span className="block mx-auto mt-3 w-17 h-0.5 bg-white"></span>
          </h2>
 
          <p className="text-white/70 leading-relaxed">
            At SOL Factory, every cone is engineered with precision, safety,
            and brand integrity in mind. We use food-grade materials, compliant
            adhesives, and tightly controlled production methods to ensure your
            products meet the highest industry standards—every single time.
          </p>
        </motion.div>
 
        {/* Top Row */}
        <div
          ref={topRowRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-90 gap-y-20 mb-30"
        >
          <AnimatedPinCard {...features[0]} forceHover={topRowVisible} />
          <AnimatedPinCard {...features[1]} forceHover={topRowVisible} />
        </div>
 
        {/* Bottom Row */}
        <div
          ref={bottomRowRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16 mb-10"
        >
          <AnimatedPinCard {...features[2]} forceHover={bottomRowVisible} />
          <AnimatedPinCard {...features[3]} forceHover={bottomRowVisible} />
        </div>
 
      </div>
    </section>
  );
}