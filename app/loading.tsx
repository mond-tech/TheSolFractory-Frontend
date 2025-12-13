import HomePageSkeleton from "@/src/components/skeletons/HomePageSkeleton";
import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";

export default function Loading() {
  return (
    <div className="">
      <Navbar />
      <main>
        <HomePageSkeleton />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

