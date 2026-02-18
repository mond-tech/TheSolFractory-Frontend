"use client"
import { lazy } from 'react';
import ImageSequenceScroll from "../components/homepage/desktop/ScrollVideo";
import VideoHero from "../components/homepage/desktop/VideoHero";
import MachinerySection from "../components/homepage/desktop/MachinerySection";
import { useIsMobile } from "@/hooks/use-mobile";
const ConeCarousel = lazy(() => import('../components/homepage/desktop/ConeCarousel'));
// import ConeCarousel from "../components/homepage/desktop/ConeCarousel";
// import ConeCarousel from "@/test-components/homepage/ConeCarousel";

export default function HomePage() {

  const isMobile = useIsMobile();

  return (
    <div className="relative ">
      <VideoHero />
      <main className="relative z-10 bg-[#001534]">
         <ImageSequenceScroll />
         {/* {!isMobile ? null : <MachinerySection />} */}
         <MachinerySection />
         {/* <div className="w-full h-screen bg-white"></div> */}
        {isMobile ? null : <ConeCarousel />}
      </main>
    </div>
  );
}
