"use client";

import React from "react";
import Image from "next/image";

interface HeroSlide {
  src: string;
  label: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  activeSlide: number;
  isTransitioning: boolean;
  isMobile: boolean;
}

export default function HeroSlider({
  slides,
  activeSlide,
  isTransitioning,
  isMobile,
}: HeroSliderProps) {
  // Create extended slides array with duplicate first slide at the end for seamless loop
  const extendedSlides = [...slides, slides[0]];

  if (isMobile) return null;

  return (
    <div className="w-full h-48 md:h-100 relative rounded-2xl overflow-hidden backdrop-blur-lg">
      {/* Slider Track */}
      <div
        className="flex h-full"
        style={{
          transform: `translateX(-${activeSlide * 92}%)`,
          transition: isTransitioning ? 'none' : 'transform 700ms ease-in-out',
        }}
      >
        {extendedSlides.map((slide, idx) => (
          <div
            key={idx}
            className="relative h-full flex-shrink-0"
            style={{
              width: "92%", // 👈 leaves space for next image peek
              marginRight: "2%",
            }}
          >
            <Image
              src={slide.src}
              alt={slide.label}
              fill
              className="object-cover rounded-2xl"
              priority={idx === activeSlide || (activeSlide === slides.length && idx === 0)}
            />

            {/* Label */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-3 flex items-end rounded-b-2xl">
              <p className="text-white text-sm md:text-base font-semibold">
                {slide.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

