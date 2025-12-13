import ContactPageSkeleton from "@/src/components/skeletons/ContactPageSkeleton";
import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";

export default function Loading() {
  return (
    <div>
      <Navbar />
      <main>
        <ContactPageSkeleton />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

