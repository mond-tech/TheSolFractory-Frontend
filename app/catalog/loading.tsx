import CatalogPageSkeleton from "@/src/components/skeletons/CatalogPageSkeleton";
import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#132135]">
      <Navbar />
      <main>
        <CatalogPageSkeleton />
      </main>
      <Footer />
    </div>
  );
}

