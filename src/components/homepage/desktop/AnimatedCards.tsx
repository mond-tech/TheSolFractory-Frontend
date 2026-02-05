import SmokeCursor from "@/src/sharedcomponents/SmokeCursor";
import AnimatedCard from "../shared/AnimatedCard";

const AnimatedCards = () => {
  return (
    <section className="w-full bg-transparent flex items-center h-[calc(100vh-64px)]">

    {/* <SmokeCursor /> */}
      <div className="max-w-7xl mx-auto px-4 w-full h-full flex flex-col min-h-0">
        <div className="text-center mb-12 pt-10">
          <h2 className="text-3xl md:text-4xl text-white font-serif tracking-wider" style={{ textShadow: "0 0 3px rgba(255,255,255,0.6)" }}>
            Our Products
          </h2>

          {/* <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Smart automation solutions designed for speed, accuracy, and
            reliability across industries.
          </p> */}
        </div>

        <div className="flex-1 grid md:grid-cols-2 md:grid-rows-2 grid-rows-4 auto-rows-fr gap-8 pb-10 h-full">
          <AnimatedCard
            href="/"
            image="/machine-images/image1.jpg"
            logo="/logo.png"
            text="Pre-Rolls, Bags, Jars — Precision Automation That Delivers Results"
            direction="left"
            position="top-left"
          />

          <AnimatedCard
            href="/"
            image="/machine-images/image1.jpg"
            logo="/logo.png"
            text="Fill Pre-Made Containers with Speed, Accuracy, and Ease"
            direction="right"
            position="top-right"
          />

          <AnimatedCard
            href="/"
            image="/machine-images/image1.jpg"
            logo="/logo.png"
            text="Pre-Rolls, Bags, Jars — Precision Automation That Delivers Results"
            direction="left"
            position="bottom-left"
          />

          <AnimatedCard
            href="/"
            image="/machine-images/image1.jpg"
            logo="/logo.png"
            text="Fill Pre-Made Containers with Speed, Accuracy, and Ease"
            direction="right"
            position="bottom-right"
          />
        </div>
      </div>
    </section>
  );
};

export default AnimatedCards;