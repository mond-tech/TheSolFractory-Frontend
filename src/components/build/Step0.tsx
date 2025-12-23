import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Header from "./Header";

interface Step0Props {
  step: number;
  nextStep: () => void;
}

const Step0: React.FC<Step0Props> = ({ step, nextStep }) => {
  return (
    <div className="space-y-10">
      {/* Hero heading */}
      <div className="text-center mt-14 mb-8">
        <h1
          className="text-3xl md:text-4xl font-semibold text-white mb-3 md:mb-4"
          style={{ textShadow: "0 0 1px rgba(255,255,255,0.6)" }}
        >
          Create your cone exactly the way you{" "}
          <span className="text-blue-400">want it.</span>
        </h1>
        <p className="text-gray-300 text-center mb-4 md:mb-6 max-w-[620px] mx-auto md:text-base leading-relaxed">
          Dive into a world of endless possibilities. Select the perfect paper
          for your custom cones and begin crafting your unique smoking
          experience.
        </p>
      </div>

      {/* Step indicator row */}
      <Header step={step} />

      {/* Four step preview cards to match the design */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-4">
        <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl min-h-[140px] flex items-center justify-center">
          <p className="text-xs md:text-sm font-medium text-gray-200 text-center px-4">
            Select your cone paper
          </p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl min-h-[140px] flex items-center justify-center">
          <p className="text-xs md:text-sm font-medium text-gray-200 text-center px-4">
            Select your filter / tip
          </p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl min-h-[140px] flex items-center justify-center">
          <p className="text-xs md:text-sm font-medium text-gray-200 text-center px-4">
            Select your cone size
          </p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl min-h-[140px] flex items-center justify-center">
          <p className="text-xs md:text-sm font-medium text-gray-200 text-center px-4">
            Select your cone paper quantity
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center mt-10 mb-4">
        <Button
          onClick={nextStep}
          className="btn-liquid active px-10 py-6 text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-white rounded-full border border-blue-500 bg-blue-600/80 hover:bg-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.7)]"
        >
          START TO BUILD YOUR CONE
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step0;


