import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Header from "./Header";
import {
  LOT_SIZES,
  type CustomizationState,
  getLotSizeName,
  getQuantity,
} from "./types";

interface Step4Props {
  step: number;
  state: CustomizationState;
  updateState: (updates: Partial<CustomizationState>) => void;
  selectAndNext: (updates: Partial<CustomizationState>) => void;
  prevStep: () => void;
  nextStep: () => void;
}

const Step4: React.FC<Step4Props> = ({
  step,
  state,
  updateState,
  selectAndNext,
  prevStep,
  nextStep,
}) => {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center mt-10">
        <h1
          className="text-3xl md:text-4xl font-semibold text-white mb-3"
          style={{ textShadow: "0 0 3px rgba(255,255,255,0.6)" }}
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

      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-7 items-start">
        {/* Visual Preview */}
        <div className="bg-[#E8E8E8] rounded-xl border border-blue-400/40 shadow-[0_0_18px_rgba(59,130,246,0.25)] p-4 min-h-[360px] flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Visual Preview
          </h2>
          <div className="text-red-600 font-medium text-sm mb-2">
            Current Lot:
          </div>
          <div className="text-gray-900 font-semibold text-base mb-4">
            {state.lotSize
              ? getLotSizeName(state.lotSize, state.customQuantity)
              : "Choose a lot size to preview"}
          </div>
          <div className="flex-1 flex items-center justify-center">
            {state.lotSize ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-24 h-16 bg-gray-200 border border-gray-300 rounded-lg"></div>
                <p className="text-gray-800 text-sm">
                  {getQuantity(state) > 0
                    ? `${getQuantity(state).toLocaleString()} cones estimated`
                    : "—"}
                </p>
              </div>
            ) : (
              <p className="text-gray-700 text-sm text-center">
                Select a lot to continue.
              </p>
            )}
          </div>
          <p className="text-gray-700 text-xs md:text-sm mt-3">
            Lead time estimates update after you choose a lot size.
          </p>
        </div>

        {/* Lot Size Options & Your Selection */}
        <div className="grid grid-cols-2 gap-3 mt-2 w-xl lg:ml-auto">
          {/* Lot Size Options */}
          {LOT_SIZES.map((lot) => {
            const isSelected = state.lotSize === lot.id;
            return (
              <button
                key={lot.id}
                onClick={() => selectAndNext({ lotSize: lot.id })}
                className={`relative rounded-lg p-5 pl-10 border transition-all text-left bg-black/40 backdrop-blur-xl glass-panel ${
                  isSelected
                    ? "active border-blue-400 shadow-[0_0_18px_rgba(59,130,246,0.45)]"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 tick-3d flex items-center justify-center">
                    <Check className="h-3 w-3 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="text-white font-semibold text-sm md:text-base">
                    {lot.name}
                  </h3>
                  <p className="text-gray-400 text-xs">{lot.quantity}</p>
                  <p className="text-gray-400 text-xs">{lot.leadTime}</p>
                  <p className="text-gray-300 text-xs font-medium">
                    {lot.price}
                  </p>
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

export default Step4;


