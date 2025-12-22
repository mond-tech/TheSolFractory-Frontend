import React from "react";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import {
  FILTER_TYPES,
  type CustomizationState,
  getFilterTypeName,
} from "./types";
import Header from "./Header";

interface Step2Props {
  step: number;
  state: CustomizationState;
  selectAndNext: (updates: Partial<CustomizationState>) => void;
  prevStep: () => void;
  nextStep: () => void;
}

const Step2: React.FC<Step2Props> = ({
  step,
  state,
  selectAndNext,
  prevStep,
  nextStep,
}) => {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center mt-14 mb-12">
        <h1
          className="text-3xl md:text-4xl font-semibold text-white mb-3"
          style={{ textShadow: "0 0 1px rgba(255,255,255,0.6)" }}
        >
          Create your cone exactly the way you{" "}
          <span className="text-blue-400">want it.</span>
        </h1>
        <p className="text-gray-300 text-center mb-6 md:mb-8 max-w-[620px] mx-auto md:text-base leading-relaxed">
          Select the perfect paper for your custom cones and begin crafting your
          unique smoking experience.
        </p>
      </div>

      {/* Step indicator */}
      <Header step={step} />

      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-7 items-start">
        {/* Visual Preview */}
        <div className="bg-[#E8E8E8] rounded-xl border border-blue-400/40 shadow-[0_0_18px_rgba(59,130,246,0.25)] p-4 min-h-[360px]">
          <div className="bg-[#0A0F1A] text-white rounded-lg border border-blue-500/40 shadow-[0_0_18px_rgba(59,130,246,0.25)] p-3 h-full">
            <h2 className="text-lg font-semibold mb-3">Visual Preview</h2>
            <div className="bg-white rounded-lg p-4 flex flex-col items-center justify-center min-h-[250px]">
              {state.filterType ? (
                <>
                  <div className="w-28 h-28 rounded-full bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-200 mb-3"></div>
                  <p className="text-gray-900 font-medium text-center">
                    {getFilterTypeName(state.filterType)}
                  </p>
                </>
              ) : (
                <p className="text-gray-700 text-sm text-center">
                  Select a filter to preview it here.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Filter Options */}
        <div className="grid grid-cols-2 h-91 gap-5 w-xl lg:ml-auto">
          {FILTER_TYPES.map((filter) => {
            const Icon = filter.icon;
            const isSelected = state.filterType === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => selectAndNext({ filterType: filter.id })}
                className={`relative rounded-lg p-5 border transition-all text-left bg-black/40 backdrop-blur-xl glass-panel ${
                  isSelected
                    ? "active border-blue-400 shadow-[0_0_18px_rgba(59,130,246,0.45)]"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 tick-3d flex items-center justify-center">
                    <Check className="h-4 w-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
                  </div>
                )}
                <div className="flex items-start space-x-3">
                  <Icon className="h-7 w-7 text-white flex-shrink-0 mt-1" />
                  <div className="space-y-1">
                    <h3 className="text-white font-semibold text-sm md:text-base">
                      {filter.name}
                    </h3>
                    <p className="text-gray-400 text-xs leading-snug">
                      {filter.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="btn-liquid px-6 ml-3 py-5 text-sm font-bold uppercase tracking-widest text-gray-300 hover:text-white border-gray-700"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              BACK
            </Button>
            <Button
              onClick={nextStep}
              disabled={!state.paperType}
              className="btn-liquid active ml-87 px-6 py-5 text-sm font-bold uppercase tracking-widest text-white border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
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

export default Step2;


