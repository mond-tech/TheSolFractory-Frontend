"use client";
 
import React from "react";
import { motion } from "framer-motion";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import MobileSolFactoryAdvantage from "../mobile/MobileSolFactoryAdvantage";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  IconLeaf,
  IconBrain,
  IconBuilding,
  IconHeartHandshake,
} from "@tabler/icons-react";
import FullPageLoader from "@/src/components/global/FullPageLoader";
 
/* ================= ANIMATION VARIANTS ================= */
 
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.18 },
  },
};
 
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 18,
      mass: 0.6,
    },
  },
};
 
const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 110,
      damping: 20,
      mass: 0.7,
    },
  },
};
 
export default function SolFactoryAdvantage() {
  const isMobile = useIsMobile();
 
  if (isMobile === null) return <FullPageLoader />;
 
  if (isMobile) return <MobileSolFactoryAdvantage />;
 
  return (
    <section className="w-full py-14 px-6 mt-[5%] flex flex-col items-center">
      {/* TITLE */}
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-white text-3xl md:text-[33px] font-w-[400px] text-center mb-15"
        style={{ textShadow: "0 0 3px rgba(255,255,255,0.6)" }}
      >
        The SOL Factory Advantage
      </motion.h2>
 
      {/* 4 CARDS GRID */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="
        max-w-7xl
        w-full
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
        gap-8
      "
      >
        <CardGlowWrapper>
          <h3 className="font-semibold text-lg mb-2 text-white flex items-center gap-3">
            <IconLeaf />
            <span>Premium Quality</span>
          </h3>
          <p className="text-sm text-white/70 leading-relaxed">
            Machine-made cones crafted with food-grade materials and strict QC
            for smooth packing and even burns.
          </p>
        </CardGlowWrapper>
 
        <CardGlowWrapper>
          <h3 className="font-semibold text-lg mb-2 text-white flex items-center gap-3">
            <IconBrain />
            <span>White-Label Experts</span>
          </h3>
          <p className="text-sm text-white/70 leading-relaxed">
            Custom sizes, branded filters, and packaging tailored to your
            product line.
          </p>
        </CardGlowWrapper>
 
        <CardGlowWrapper>
          <h3 className="font-semibold text-lg mb-2 text-white flex items-center gap-3">
            <IconBuilding stroke={2} size={25} />
            <span>Built for Scale</span>
          </h3>
          <p className="text-sm text-white/70 leading-relaxed">
            Fully compatible with top filling machines—perfect for high-volume
            production.
          </p>
        </CardGlowWrapper>
 
        <CardGlowWrapper>
          <h3 className="font-semibold text-lg mb-2 text-white flex items-center gap-3">
            <IconHeartHandshake stroke={2} />
            <span>Full Support</span>
          </h3>
          <p className="text-sm text-white/70 leading-relaxed">
            From design to delivery, we handle every step for a seamless
            manufacturing experience.
          </p>
        </CardGlowWrapper>
      </motion.div>
    </section>
  );
}
 
/* ================= REUSABLE GLOW WRAPPER ================= */
 
const CardGlowWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      variants={cardVariants}
      style={{ willChange: "transform" }}
      className="
        relative rounded-xl p-6 bg-white/5 border border-white/10
        shadow-[0_0_20px_rgba(0,0,0,0.4)]
        transition-all duration-300
        hover:shadow-[0_0_40px_rgba(0,0,0,0.6)]
        hover:-translate-y-2
        hover:scale-[1.03]
        bor-shadow
      "
    >
      <GlowingEffect
        spread={60}
        glow={true}
        proximity={80}
        disabled={false}
        inactiveZone={0.01}
      />
 
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};