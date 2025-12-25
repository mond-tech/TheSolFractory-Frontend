import React from "react";

interface HeaderProps {
  step: number;
  mb?: number;
  mt?: number;
}

const Header: React.FC<HeaderProps> = ({ step, mb = 0, mt = 0 }) => {
  return (
    <div className={`flex justify-center mb-${mb} mt-${mt}`}>
      <div className="flex items-center max-w-5xl w-[85%] px-4">
        {/* Step 1 */}
        <StepCircle active stepNum={1} />

        <Connector active={step >= 2} />

        {/* Step 2 */}
        <StepCircle active={step >= 2} stepNum={2} />

        <Connector active={step >= 3} />

        {/* Step 3 */}
        <StepCircle active={step >= 3} stepNum={3} />

        <Connector active={step >= 4} />

        {/* Step 4 */}
        <StepCircle active={step >= 4} stepNum={4} />
      </div>
    </div>
  );
};

export default Header;

/* ---------- Sub Components ---------- */

const StepCircle = ({
  active,
  stepNum,
}: {
  active: boolean;
  stepNum: number;
}) => (
  <div className="relative z-10 flex-shrink-0">
    <div
      className={`w-9 h-9 ml-4 mr-4 rounded-full border-2 flex items-center justify-center transition-all
        ${
          active
            ? "bg-blue-700 border-blue-700 text-white"
            : "bg-white border-white/80 text-black/80"
        }`}
    >
      <span className="text-sm font-bold">{stepNum}</span>
    </div>
  </div>
);

const Connector = ({ active }: { active: boolean }) => (
  <div
    className={`h-[2px] flex-1 -mx-1 transition-all ${
      active ? "bg-blue-700" : "bg-white/80"
    }`}
  />
);
