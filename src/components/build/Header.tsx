import React from "react";

interface HeaderProps {
  step: number;
}

const Header: React.FC<HeaderProps> = ({ step }) => {
  return (
    <div className="flex items-center justify-center mb-12 mt-12">
      <div className="flex items-center gap-6 max-w-5xl w-full px-4">
        {/* Step 1 */}
        <div className="flex flex-col items-center flex-1">
          <div
            className={`w-9 h-9 border-white/80 rounded-full flex items-center justify-center border-2 transition-all ${
              step >= 1
                ? "bg-blue-700 "
                : "bg-white/80"
            }`}
          >
            <span
              className={`text-sm font-bold ${
                step >= 1 ? "text-white" : "text-gray-500"
              }`}
            >
              1
            </span>
          </div>
          <span
            className={`text-xs mt-2 text-center font-medium ${
              step >= 1 ? "text-white" : "text-gray-500"
            }`}
          >
            Select Your Cone Paper
          </span>
        </div>

        {/* Connector Line */}
        <div
          className={`h-[2px] mb-10 flex-1 min-w-[160px] transition-all ${
            step >= 2 ? "bg-blue-700" : "bg-white/80"
          }`}
        ></div>

        {/* Step 2 */}
        <div className="flex flex-col items-center flex-1">
          <div
            className={`w-9 h-9 border-white/80 rounded-full flex items-center justify-center border-2 transition-all ${
              step >= 2
                ? "bg-blue-700"
                : "border-white/80 bg-white/95"
            }`}
          >
            <span
              className={`text-sm font-bold ${
                step >= 2 ? "text-white" : "text-black/80"
              }`}
            >
              2
            </span>
          </div>
          <span
            className={`text-xs mt-2 text-center font-medium ${
              step >= 2 ? "text-white" : "text-gray-500"
            }`}
          >
            Select Your Filter / Tip
          </span>
        </div>

        {/* Connector Line */}
        <div
          className={`h-[2px] mb-10 flex-1 min-w-[160px] transition-all ${
            step >= 3 ? "bg-blue-700" : "bg-white/80"
          }`}
        ></div>

        {/* Step 3 */}
        <div className="flex flex-col items-center flex-1">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
              step >= 3
                ? "bg-blue-700"
                : "border-white/80 bg-white/95"
            }`}
          >
            <span
              className={`text-sm font-bold ${
                step >= 3 ? "text-white" : "text-black/80"
              }`}
            >
              3
            </span>
          </div>
          <span
            className={`text-xs mt-2 text-center font-medium ${
              step >= 3 ? "text-white" : "text-gray-500"
            }`}
          >
            Select Your Cone Size
          </span>
        </div>

        {/* Connector Line */}
        <div
          className={`h-[2px] mb-10 flex-1 min-w-[160px] transition-all ${
            step >= 4 ? "bg-blue-700" : "bg-white/80"
          }`}
        ></div>

        {/* Step 4 */}
        <div className="flex flex-col items-center flex-1">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
              step >= 4
                ? "bg-blue-700"
                : "border-white/80 bg-white/95"
            }`}
          >
            <span
              className={`text-sm font-bold ${
                step >= 4 ? "text-white" : "text-black/80"
              }`}
            >
              4
            </span>
          </div>
          <span
            className={`text-xs mt-2 text-center font-medium ${
              step >= 4 ? "text-white" : "text-gray-500"
            }`}
          >
            Select Your Cone Paper
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;


