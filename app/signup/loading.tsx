import SignupPageSkeleton from "@/src/components/skeletons/SignupPageSkeleton";
import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";

export default function Loading() {
  return (
    <div>
      <Navbar />
      <main>
        <SignupPageSkeleton />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

