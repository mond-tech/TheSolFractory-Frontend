'use client'
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { motion } from "motion/react";

export default function VideoHero() {

  return (
    <div className='relative w-full h-screen'>
        <video
        className="absolute inset-0 h-full w-full object-cover"
        // src="/videos/hero-machinery.mp4"
        src="https://cdn.prod.website-files.com/669a4a15cba8630cdb7be146%2F67501efec65b03f2a154ff47_altM%20Final-transcode.mp4"
        poster="https://cdn.prod.website-files.com/669a4a15cba8630cdb7be146%2F67501efec65b03f2a154ff47_altM%20Final-poster-00001.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
    <div className="relative z-20 flex h-full items-center justify-center px-6">
        <div className="max-w-5xl text-center">
          {/* Main headline with synced rotating words on both lines */}
          <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight">
            {/* Line 1 */}
            <span className="block">
              We Don’t Just{""}
            </span>
            <motion.span className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
                <LayoutTextFlip
                text="Welcome to "
                words={["Aceternity UI", "Fight Club", "The Matrix", "The Jungle"]}
                />
            </motion.span>
            {/* Line 2 */}
            <span className="mt-3 block">
              We Engineer{""}
            </span>
          </h1>
        </div>
      </div>
    </div>
  )
}
