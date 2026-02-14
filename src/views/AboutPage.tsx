import SolFactoryAdvantage from "@/src/components/homepage/desktop/SolFactoryAdvantage";
import MergedCards from "@/src/components/homepage/desktop/ConeShowCase";
import TrustConesSection from "@/src/components/homepage/desktop/TrustConesSection";

export default function AboutPage() {
  return (
    <div className="relative">
      <SolFactoryAdvantage />
      <MergedCards />
      <TrustConesSection />
    </div>
  )
}
