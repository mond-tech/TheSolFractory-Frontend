import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { PAPER_TYPES, type CustomizationState } from "./types";
import Header from "./Header";

interface Step1Props {
  step: number;
  state: CustomizationState;
  updateState: (updates: Partial<CustomizationState>) => void;
  nextStep: () => void;
}

const Step1: React.FC<Step1Props> = ({
  step,
  state,
  updateState,
  nextStep,
}) => {
  return (
    <div className="space-y-8">
      {/* Hero heading */}
      <div className="text-center mt-14 mb-12">
        <h1
          className="text-3xl md:text-4xl font-semibold text-white mb-3 md:mb-4"
          style={{ textShadow: "0 0 1px rgba(255,255,255,0.6)" }}
        >
          Create your cone exactly the way you{" "}
          <span className="text-blue-400">want it.</span>
        </h1>
        <p className="text-gray-300 text-center mb-6 md:mb-8 max-w-[620px] mx-auto md:text-base leading-relaxed">
          Dive into a world of endless possibilities. Select the perfect paper
          for your custom cones and begin crafting your unique smoking
          experience.
        </p>
      </div>

      {/* Step indicator directly under heading */}
      <Header step={step} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel: Visual Preview Grid */}
        <div className="rounded-xl border-2 border-blue-500/50 bg-black/40 backdrop-blur-xl p-6 min-h-[500px]">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Unbleached (Brown) */}
            <div className="flex flex-col items-center justify-center bg-white/90 rounded-lg p-4 border border-gray-200">
              <div
                className="w-20 h-24 mb-2 rounded-t-full"
                style={{ backgroundColor: "#8B6F47" }}
              ></div>
              <p className="text-gray-900 text-xs font-medium text-center">
                Unbleached (Brown)
              </p>
            </div>

            {/* Bleached (White) */}
            <div className="flex flex-col items-center justify-center bg-white/90 rounded-lg p-4 border border-gray-200">
              <div className="w-20 h-24 mb-2 rounded-t-full bg-white border border-gray-300"></div>
              <p className="text-gray-900 text-xs font-medium text-center">
                Bleached (White)
              </p>
            </div>

            {/* Hemp Paper */}
            <div className="flex flex-col items-center justify-center bg-white/90 rounded-lg p-4 border border-gray-200">
              <div
                className="w-20 h-24 mb-2 rounded-t-full"
                style={{ backgroundColor: "#A8E6CF" }}
              ></div>
              <p className="text-gray-900 text-xs font-medium text-center">
                Hemp Paper
              </p>
            </div>

            {/* Colored Paper */}
            <div className="flex flex-col items-center justify-center bg-white/90 rounded-lg p-4 border border-gray-200">
              <div className="flex gap-1 mb-2">
                <div
                  className="w-6 h-24 rounded-t-full"
                  style={{ backgroundColor: "#FBCFE8" }}
                ></div>
                <div
                  className="w-6 h-24 rounded-t-full"
                  style={{ backgroundColor: "#BFDBFE" }}
                ></div>
                <div
                  className="w-6 h-24 rounded-t-full"
                  style={{ backgroundColor: "#BBF7D0" }}
                ></div>
              </div>
              <p className="text-gray-900 text-xs font-medium text-center">
                Colored Paper (Pink, Blue,
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Selection Buttons */}
        <div className="grid h-100 grid-cols-2 mt-1 gap-4">
          {PAPER_TYPES.map((paper) => {
            const Icon = paper.icon;
            const isSelected = state.paperType === paper.id;
            return (
              <button
                key={paper.id}
                onClick={() => updateState({ paperType: paper.id })}
                className={`relative rounded-lg p-6 border transition-all text-left bg-black/40 backdrop-blur-xl glass-panel ${
                  isSelected
                    ? "active border-blue-400 shadow-[0_0_18px_rgba(59,130,246,0.45)]"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Check
                      className="h-5 w-5 text-white font-bold"
                      strokeWidth={3}
                    />
                  </div>
                )}
                <div className="flex flex-col items-center space-y-4">
                  <Icon
                    className={`h-12 w-12 ${
                      isSelected ? "text-blue-400" : "text-white"
                    }`}
                    strokeWidth={1.5}
                  />
                  <div className="text-center">
                    <h3
                      className={`font-semibold text-base mb-2 ${
                        isSelected ? "text-white" : "text-gray-300"
                      }`}
                    >
                      {paper.name}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {paper.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="btn-liquid px-6 ml-2 py-5 text-sm font-bold uppercase tracking-widest text-gray-300 hover:text-white border-gray-700"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              BACK
            </Button>
            <Button
              onClick={nextStep}
              disabled={!state.paperType}
              className="btn-liquid active ml-85 px-6 py-5 text-sm font-bold uppercase tracking-widest text-white border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              NEXT
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;
