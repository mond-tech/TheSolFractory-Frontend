"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
 
export const LayoutTextFlip = ({
  text = "",
  secondtext = "",
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 3000,
  className = "",
  width = "auto"
}: {
  text: string;
  secondtext: string;
  words: string[];
  duration?: number;
  className?: string;
  width? : string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);
 
    return () => clearInterval(interval);
  }, []);
 
  return (
    <>
      <motion.span
        layoutId="subtext"
        className="text-2xl font-bold tracking-tight drop-shadow-lg md:text-4xl"
      >
        {text}
      </motion.span>
 
      <motion.span
        layout
        style={{ width: width }}
        //rounded-md border border-transparent ring
        className={`relative inline-flex justify-center overflow-hidden px-4 py-2 font-tasa text-5xl font-bold tracking-tight text-white drop-shadow-lg md:text-6xl  ${className}`}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -40, filter: "blur(0px)" }}
            animate={{
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{ y: 50, filter: "blur(0px)", opacity: 0 }}
            transition={{
              duration: 0.5,
            }}
            className={cn("inline-block whitespace-nowrap")}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
 
      <motion.span
        className="text-2xl font-bold tracking-tight drop-shadow-lg md:text-4xl"
      >
        {secondtext}
      </motion.span>
    </>
  );
};