"use client";
 
import React from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { motion } from "framer-motion";
 
export default function SolFactoryAdvantageMobile() {
  return (
    <section className="w-full bg-[#0e1a2b] py-10 px-4">
 
      {/* TITLE */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-white text-2xl font-bold text-center my-6"
      >
        The SOL Factory Advantage
      </motion.h2>
 
      {/* VIDEO */}
      {/* <div className="mb-8">
        <div className="aspect-video rounded-xl overflow-hidden bg-black">
          <video
            controls
            className="w-full h-full object-cover"
            src="https://ja3zeotcy2kd52jg.public.blob.vercel-storage.com/SOL%20Video%28Compressed%29.mp4"
          />
        </div>
      </div> */}
 
      {/* STAGGERED CARDS */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.12 },
          },
        }}
        className="grid grid-cols-2 gap-4"
      >
 
        {/* FULL WIDTH */}
        <div className="col-span-2">
          <MobileCard title="Premium Quality">
            Machine-made cones crafted with food-grade materials and strict QC
            for smooth packing and even burns.
          </MobileCard>
        </div>
 
        {/* HALF */}
        <MobileCard title="White-Label Experts">
          Custom sizes, branded filters, and packaging tailored to your product line.
        </MobileCard>
 
        <MobileCard title="Built for Scale">
          Fully compatible with top filling machines—perfect for high-volume production.
        </MobileCard>
 
        {/* FULL WIDTH */}
        {/* <div className="col-span-2">
          <MobileCard title="Full Support">
            From design to delivery, we handle every step for a seamless experience.
          </MobileCard>
        </div> */}
      </motion.div>
    </section>
  );
}
 
/* ⭐ Mobile Card */
const MobileCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 25 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: "easeOut" },
        },
      }}
      className="relative h-full rounded-xl p-5 bg-white/5 border border-white/10 bor-shadow"
    >
      <GlowingEffect
        spread={40}
        glow={true}
        proximity={60}
        inactiveZone={0.2}
      />
 
      <div className="relative z-10">
        <h3 className="text-white text-sm font-semibold mb-1">
          {title}
        </h3>
        <p className="text-white/70 text-sm leading-relaxed">
          {children}
        </p>
      </div>
    </motion.div>
  );
};