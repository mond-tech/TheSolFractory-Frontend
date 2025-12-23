import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { PAPER_TYPES, type CustomizationState } from "./types";
import Header from "./Header";
import ConeViewer from "./ConeViewer";

interface Step1Props {
  step: number;
  state: CustomizationState;
  updateState: (updates: Partial<CustomizationState>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const Step1: React.FC<Step1Props> = ({
  step,
  state,
  updateState,
  nextStep,
  prevStep,
}) => {
  return (
    <div className="space-y-8">

      {/* Step indicator directly under heading */}
      <Header step={step} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel: 3D Cone Viewer */}
        <div className="flex flex-col space-y-4">
          <ConeViewer state={state} focusStep="paper" />
          <p className="text-xs md:text-sm text-gray-400 text-center max-w-md mx-auto">
            Rotate and zoom the cone to preview how different paper types change its
            look in real time.
          </p>
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
              onClick={prevStep}
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
