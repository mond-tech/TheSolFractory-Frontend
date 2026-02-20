"use client"
import { lazy } from 'react';
import ImageSequenceScroll from "../components/homepage/desktop/ScrollVideo";
import VideoHero from "../components/homepage/desktop/VideoHero";
import MachinerySection from "../components/homepage/desktop/MachinerySection";
import { useIsMobile } from "@/hooks/use-mobile";
const ConeCarousel = lazy(() => import('../components/homepage/desktop/ConeCarousel'));
// import ConeCarousel1 from "../components/homepage/desktop/ConeCarousel2";
// import ConeCarousel from "@/test-components/homepage/ConeCarousel";

export default function HomePage() {

  const isMobile = useIsMobile();

  return (
    <div className="relative ">
      <VideoHero />
      <main className="relative z-10 bg-[#001534]">
         {/* <ConeCarousel1 /> */}
         <ImageSequenceScroll />
         <MachinerySection />
         {/* {!isMobile ? null : <MachinerySection />} */}
        {isMobile ? null : <ConeCarousel />}
         {/* <div className="w-full h-screen bg-white"></div> */}
      </main>
    </div>
  );
}
