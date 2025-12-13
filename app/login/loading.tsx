import LoginPageSkeleton from "@/src/components/skeletons/LoginPageSkeleton";
import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";

export default function Loading() {
  return (
    <div className="">
      <Navbar />
      <main>
        <LoginPageSkeleton />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

