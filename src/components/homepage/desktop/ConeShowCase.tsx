'use client'
import { motion } from "framer-motion";
import InfoCard from "@/src/sharedcomponents/InfoCard";
import { useIsMobile } from "@/hooks/use-mobile";
import FullPageLoader from "@/src/components/global/FullPageLoader";
 
/* ================= ANIMATION ================= */
 
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 18,
      mass: 0.6,
    },
  },
};
 
export default function MergedCards() {
  const isMobile = useIsMobile();
 
  if (isMobile === null) return <FullPageLoader />;
 
  return (
    <div>
      <motion.h1
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="text-center text-white mt-8.5 mb-7 px-6"
        style={{ textShadow: "0 0 3px rgba(255,255,255,0.6)" }}
      >
        <span className="block text-3xl md:text-4xl font-serif">
          Create Your Perfect Cone:
        </span>
 
        <span className="block mt-3 text-2xl md:text-3xl font-serif uppercase tracking-wider">
          Only At SOL
        </span>
 
        <span className="block mx-auto mt-4 w-16 h-[2px] bg-white"></span>
      </motion.h1>
 
      {/* Paper Options */}
      {isMobile ? null : (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <InfoCard
            bgColor=""
            title="Paper Options That Match Your Brand Identity"
            subtitle="Choose the paper that aligns with your product vision and target market:"
            description=""
            bullets={[
              "White paper for a clean, premium aesthetic",
              "Brown (unbleached) for natural/organic branding",
              "Organic hemp for brands focused on purity and plant-based experience",
            ]}
            footer="All papers meet food-grade standards and are tested for burn consistency, airflow, and thickness."
            image="/bluetshirt.png"
            imageOnRight={true}
            imageEffect={{
              type: "compare",
              secondImage: "/whitetshirt.png",
            }}
          />
        </motion.div>
      )}
 
      {/* Custom Dimensions */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        <InfoCard
          bgColor=""
          title="Custom Cone Dimensions:"
          description="We help brands create signature sizes for special product lines, collaborations, or market trends."
          bullets={["Slim cones", "Extra-wide cones", "Limited-edition custom lengths"]}
          footer="Engineered with consistency and machine-fill compatibility in mind."
          image="/homepage/sizechart.png"
          imageOnRight={false}
          imageEffect={{
            type: "lens"
          }}
        />
      </motion.div>
 
      {/* Packaging */}
      {isMobile ? null : (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <InfoCard
            bgColor=""
            title="Packaging That Tells your Story"
            subtitle="Your product’s presentation matters. Choose from:"
            description=""
            bullets={[
              "Custom boxes (retail or wholesale)",
              "Branded tubes or doob tubes",
              "Custom printed cartons",
              "Eco-friendly packaging options",
            ]}
            footer="Designed to protect your cones during transit and elevate your brand at first glance"
            image="/homepage/packaging.png"
            imageOnRight={true}
          />
        </motion.div>
      )}
    </div>
  );
}