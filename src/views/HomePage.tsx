import SolFactoryAdvantage from "@/src/components/homepage/desktop/SolFactoryAdvantage";
import MergedCards from "@/src/components/homepage/desktop/ConeShowCase";
// import TrustConesSection from "@/src/components/homepage/desktop/TrustConesSection";
import VideoHero from "../components/homepage/desktop/VideoHero";
import ScrollVideo from "../components/homepage/desktop/ScrollVideo";
// import MachinerySection from "../components/homepage/desktop/MachinerySection";
// import ConeCarousel from "../components/homepage/desktop/ConeCarousel";
import ConeCarousel from "@/test-components/homepage/ConeCarousel";

export default function HomePage() {
  return (
    <div className="relative ">
      <VideoHero />
      <main className="relative z-10 bg-[#001534]">
        {/* <main className="relative z-10 bg-[#001534]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(15,23,42,0.9)]"> */}
        {/* <ScrollVideo videoSrc="https://ja3zeotcy2kd52jg.public.blob.vercel-storage.com/outrobin2.mp4" /> */}
        {/* <ConeCarousel /> */}
        {/* <MachinerySection /> */}
        {/* <div className="w-full h-screen bg-white"></div> */}
        <SolFactoryAdvantage />
        <MergedCards />
        <ScrollVideo videoSrc="/videos/outrobinpurewhite.mp4" />
        <ConeCarousel />
      </main>
    </div>
  );
}
