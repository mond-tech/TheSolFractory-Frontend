"use client";

import React, { useRef, useEffect } from 'react';

const ScrollVideo = ({ videoSrc }: { videoSrc: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Ensure video metadata is loaded so we have a duration
    video.load();

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how much of the component has been scrolled through
      // 0 = top of component at bottom of screen
      // 1 = bottom of component at top of screen
      const totalHeight = rect.height + windowHeight;
      const progress = 1 - (rect.bottom / totalHeight);
      
      // Clamp progress between 0 and 1
      const clampedProgress = Math.min(Math.max(progress, 0), 1);

      if (video.duration) {
        // Use requestAnimationFrame for smooth playback rendering
        requestAnimationFrame(() => {
          video.currentTime = video.duration * clampedProgress;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[300vh] bg-black" // 300vh gives us room to scroll
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
        />
        {/* <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-white text-4xl font-bold bg-black/30 p-4 rounded">
            Scroll to Scrub
          </h2>
        </div> */}
      </div>
    </div>
  );
};

export default ScrollVideo;