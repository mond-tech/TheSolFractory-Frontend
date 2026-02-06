"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import {
  IconRocket,
  IconDropletFilled,
  IconShieldCheck,
} from "@tabler/icons-react";

const FEATURE_CARDS = [
  { icon: IconRocket, label: "High speed output" },
  { icon: IconDropletFilled, label: "Consistent fill" },
  { icon: IconShieldCheck, label: "Industrial-grade reliability" },
] as const;

function ShinyGlassCard({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string; stroke?: number }>;
  label: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [shine, setShine] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setShine({ x, y });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setShine({ x: 50, y: 50 });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl px-4 py-6 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(255,255,255,0.08)]"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.1) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.25)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -1px 2px rgba(0,0,0,0.1)",
      }}
    >
      {/* Cursor-following shine */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle 80px at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.15) 30%, transparent 70%)`,
        }}
      />
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full text-white relative z-10 transition-all duration-300 group-hover:scale-110"
        style={{
          border: "1px solid rgba(255, 255, 255, 0.35)",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08))",
          boxShadow:
            "inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <Icon className="h-6 w-6" stroke={1.5} />
      </div>
      <span className="text-white text-[11px] md:text-xs font-medium uppercase tracking-wider leading-snug relative z-10 drop-shadow-sm">
        {label}
      </span>
    </div>
  );
}

export default function MachinerySection() {
  return (
    <section
      className="relative w-full min-h-[85vh] flex items-center py-20 overflow-hidden"
      style={{ backgroundColor: "#0a1628" }}
    >
      {/* Brighter ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 60%)",
        }}
      />

      {/* Shinier glass container */}
      <div
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16 rounded-3xl"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(19, 33, 53, 0.5) 40%, rgba(19, 33, 53, 0.35) 100%)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow:
            "0 25px 80px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.1)",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* ================= LEFT CONTENT ================= */}
          <div className="flex flex-col justify-center lg:pl-8 xl:pl-16 max-w-xl">
            <h2 className="text-4xl md:text-5xl lg:text-[3rem] font-bold text-white leading-tight drop-shadow-sm">
              Cone Automation
            </h2>

            <p className="mt-4 text-base md:text-lg text-white/95 leading-relaxed">
              Automate your pre-roll production with high-speed fill and seal
              technology.
            </p>

            {/* Shiny glass cards – cursor reactive */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {FEATURE_CARDS.map(({ icon, label }) => (
                <ShinyGlassCard key={label} icon={icon} label={label} />
              ))}
            </div>

            <Link
              href="/build"
              className="mt-10 inline-flex items-center gap-2 text-white font-medium text-sm md:text-base transition-all duration-300 group hover:gap-3"
            >
              Automate your packaging
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* ================= RIGHT – ROBOTIC ARM IMAGE ================= */}
          <div className="relative flex justify-center lg:justify-end items-center">
            <div
              className="relative z-10 w-full max-w-[380px] rounded-2xl p-3 overflow-hidden transition-all duration-500 hover:scale-[1.02]"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)",
              }}
            >
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="/homepage/robotic-arm.png"
                  alt="Advanced robotic arm in modern factory setting"
                  width={380}
                  height={475}
                  className="w-full aspect-[4/5] object-cover rounded-lg"
                  priority
                />
                {/* Subtle bright overlay for more pop */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-lg"
                  style={{
                    background:
                      "linear-gradient(to top, transparent 40%, rgba(255,255,255,0.03) 100%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
