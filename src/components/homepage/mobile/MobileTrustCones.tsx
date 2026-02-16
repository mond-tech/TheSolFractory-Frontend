"use client";
 
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AnimatedPinCard } from "@/src/sharedcomponents/PinCard3D";
import { motion } from "framer-motion";
 
const features = [
  {
    title: "Food-grade glue & materials",
    description: "Safe, clean, and tested for consistent performance.",
    image: "/homepage/conestack.png",
  },
  {
    title: "Cleanroom manufacturing",
    description: "Debris-free cones with consistent, uniform structure.",
    image: "/homepage/conestack.png",
  },
  {
    title: "Strict quality control",
    description: "Batch testing and precision checks ensure reliability at scale.",
    image: "/homepage/conestack.png",
  },
  {
    title: "Even, reliable burn",
    description: "Engineered for smooth airflow and predictable burn performance.",
    image: "/homepage/conestack.png",
  },
];
 
export default function TrustConesMobileCarousel() {
  return (
    <section className="w-full px-4 py-8 md:hidden">
      {/* Heading */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-semibold text-white mb-2">
          Why Brands Trust Our Cones
        </h2>
        <p className="text-white/70 text-sm">
          Precision-built cones using food-grade materials and controlled manufacturing.
        </p>
      </motion.div>
 
      {/* Carousel */}
      <Carousel
        opts={{ align: "center", loop: true }}
        className="relative w-full max-w-sm mx-auto px-10 overflow-visible"
      >
        <CarouselContent className="overflow-visible">
          {features.map((feature, index) => (
            <CarouselItem
              key={index}
              className="min-h-105 px-2 overflow-visible"
            >
              <div className="py-6 overflow-visible">
                <AnimatedPinCard {...feature} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
 
        {/* Buttons */}
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 bg-blue-600 border-2 border-[#0D1624]/60 btn-glass-panel" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600 border-2 border-[#0D1624]/60  btn-glass-panel" />
      </Carousel>
    </section>
  );
}