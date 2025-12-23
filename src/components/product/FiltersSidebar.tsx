"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FiltersSidebarProps {
  paperTypes: string[];
  packagingOptions: string[];
  selectedPaperTypes: string[];
  selectedPackaging: string[];
  sizeRange: [number, number];
  lotSize: [number, number];
  paperTypeOpen: boolean;
  sizeRangeOpen: boolean;
  lotSizeOpen: boolean;
  packagingOpen: boolean;
  onPaperTypeToggle: (type: string) => void;
  onPackagingToggle: (option: string) => void;
  onSizeRangeChange: (value: [number, number]) => void;
  onLotSizeChange: (value: [number, number]) => void;
  setPaperTypeOpen: (open: boolean) => void;
  setSizeRangeOpen: (open: boolean) => void;
  setLotSizeOpen: (open: boolean) => void;
  setPackagingOpen: (open: boolean) => void;
  onClearFilters: () => void;
}

export default function FiltersSidebar({
  paperTypes,
  packagingOptions,
  selectedPaperTypes,
  selectedPackaging,
  sizeRange,
  lotSize,
  paperTypeOpen,
  sizeRangeOpen,
  lotSizeOpen,
  packagingOpen,
  onPaperTypeToggle,
  onPackagingToggle,
  onSizeRangeChange,
  onLotSizeChange,
  setPaperTypeOpen,
  setSizeRangeOpen,
  setLotSizeOpen,
  setPackagingOpen,
  onClearFilters,
}: FiltersSidebarProps) {
  return (
    <aside className="w-full lg:w-1/5">
      <div className="glass-panel p-6 rounded-xl lg:sticky lg:top-24 mb-26 mt-22 max-h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
          <h2 className="font-serif text-lg" style={{ textShadow: "0 0 1px rgba(255,255,255,0.6)" }}>Filters</h2>
          {/* <button
            onClick={onClearFilters}
            className="text-xs text-blue-400 hover:text-white transition-colors"
          >
            Reset All
          </button> */}
        </div>

        {/* Material (Paper Type) */}
        <div className="mb-6">
          <button
            onClick={() => setPaperTypeOpen(!paperTypeOpen)}
            className="flex items-center justify-between w-full mb-3 text-white"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-300">
              Material
            </span>
            {paperTypeOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-400 cursor-pointer" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400 cursor-pointer" />
            )}
          </button>
          {paperTypeOpen && (
            <div className="space-y-2">
              {paperTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onPaperTypeToggle(type)}
                  className={`w-full flex items-center justify-between text-sm px-3 py-2 rounded-lg transition-all ${
                    selectedPaperTypes.includes(type)
                      ? "bg-white/10 text-white"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <span>{type}</span>
                  <span
                    className={`w-3 h-3 rounded-full border border-white/30 ${
                      selectedPaperTypes.includes(type)
                        ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                        : "bg-transparent"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Size Range */}
        <div className="mb-6">
          <button
            onClick={() => setSizeRangeOpen(!sizeRangeOpen)}
            className="flex items-center justify-between w-full mb-3 text-white"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-300">
              Size Range [mm]
            </span>
            {sizeRangeOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-400 cursor-pointer" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400 cursor-pointer" />
            )}
          </button>
          {sizeRangeOpen && (
            <div className="space-y-3">
              <Slider
                value={sizeRange}
                onValueChange={(value) =>
                  onSizeRangeChange(value as [number, number])
                }
                min={0}
                max={500}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Min: {sizeRange[0]}mm</span>
                <span>Max: {sizeRange[1]}mm</span>
              </div>
            </div>
          )}
        </div>

        {/* Lot Size */}
        <div className="mb-6">
          <button
            onClick={() => setLotSizeOpen(!lotSizeOpen)}
            className="flex items-center justify-between w-full mb-3 text-white"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-300">
              Lot Size (Units)
            </span>
            {lotSizeOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-400 cursor-pointer" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400 cursor-pointer" />
            )}
          </button>
          {lotSizeOpen && (
            <div className="space-y-3">
              <Slider
                value={lotSize}
                onValueChange={(value) =>
                  onLotSizeChange(value as [number, number])
                }
                min={1000}
                max={10000}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Min: {lotSize[0].toLocaleString()}</span>
                <span>Max: {lotSize[1].toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Packaging */}
        <div className="mb-6">
          <button
            onClick={() => setPackagingOpen(!packagingOpen)}
            className="flex items-center justify-between w-full mb-3 text-white"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-300">
              Packaging
            </span>
            {packagingOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-400 cursor-pointer" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400 cursor-pointer" />
            )}
          </button>
          {packagingOpen && (
            <div className="space-y-2">
              {packagingOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onPackagingToggle(option)}
                  className={`w-full flex items-center justify-between text-sm px-3 py-2 rounded-lg transition-all ${
                    selectedPackaging.includes(option)
                      ? "bg-white/10 text-white"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <span>{option}</span>
                  <span
                    className={`w-3 h-3 rounded-full border border-white/30 ${
                      selectedPackaging.includes(option)
                        ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                        : "bg-transparent"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter Actions */}
        <div className="w-full pt-2 mt-4 border-t border-white/10 flex flex-row items-center justify-center space-x-3">
          <Button
            className="w-[100px] btn-liquid btn-primary p-3 text-[10px] font-bold uppercase tracking-widest"
            onClick={() => {
              // Apply filters logic
            }}
          >
            Apply
          </Button>
          <Button
            variant="outline"
            className="w-[100px] btn-liquid py-3 text-[10px] font-bold uppercase tracking-widest bg-transparent border-white/20 text-gray-200 hover:text-white"
            onClick={onClearFilters}
          >
            Clear
          </Button>
        </div>

      </div>
    </aside>
  );
}

