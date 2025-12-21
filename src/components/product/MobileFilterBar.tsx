"use client";

import React from "react";
import { X } from "lucide-react";

interface MobileFilterBarProps {
  paperTypes: string[];
  packagingOptions: string[];
  selectedPaperTypes: string[];
  selectedPackaging: string[];
  sizeRange: [number, number];
  lotSize: [number, number];
  onPaperTypeToggle: (type: string) => void;
  onPackagingToggle: (option: string) => void;
  onClearFilters: () => void;
}

export default function MobileFilterBar({
  paperTypes,
  packagingOptions,
  selectedPaperTypes,
  selectedPackaging,
  sizeRange,
  lotSize,
  onPaperTypeToggle,
  onPackagingToggle,
  onClearFilters,
}: MobileFilterBarProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* Paper Type Filters */}
        {paperTypes.map((type) => {
          const isSelected = selectedPaperTypes.includes(type);
          return (
            <button
              key={type}
              onClick={() => onPaperTypeToggle(type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  : "bg-black/40 border-white/10 text-gray-300 hover:border-white/30"
              }`}
            >
              <span className="text-sm font-medium">{type}</span>
              {isSelected && <X className="h-3 w-3" />}
            </button>
          );
        })}

        {/* Packaging Filters */}
        {packagingOptions.map((option) => {
          const isSelected = selectedPackaging.includes(option);
          return (
            <button
              key={option}
              onClick={() => onPackagingToggle(option)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  : "bg-black/40 border-white/10 text-gray-300 hover:border-white/30"
              }`}
            >
              <span className="text-sm font-medium">{option}</span>
              {isSelected && <X className="h-3 w-3" />}
            </button>
          );
        })}

        {/* Clear All Button */}
        {(selectedPaperTypes.length > 0 ||
          selectedPackaging.length > 0) && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/10 whitespace-nowrap transition-all"
          >
            <X className="h-4 w-4" />
            <span className="text-sm font-medium">Clear All</span>
          </button>
        )}
      </div>

      {/* Size Range Display for Mobile */}
      <div className="mt-3 px-2">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            Size: {sizeRange[0]} - {sizeRange[1]} mm
          </span>
          <span>
            Lot: {lotSize[0].toLocaleString()} -{" "}
            {lotSize[1].toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

