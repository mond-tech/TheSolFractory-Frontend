"use client";
 
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IconChevronDown } from "@tabler/icons-react";
import MobileSolFactoryAdvantage from "../mobile/MobileSolFactoryAdvantage";
import { useIsMobile } from "@/hooks/use-mobile";
import FullPageLoader from "@/src/components/global/FullPageLoader";
import { advantageCards } from "@/sampledata/advantageData";
 
const statPills = [
  { label: "Food-Grade", value: "100%", color: "text-emerald-400" },
  { label: "Cones / Year", value: "50M+", color: "text-blue-400" },
  { label: "Support", value: "E2E", color: "text-purple-400" },
];
 
/* ═══════════════════════════════════════════
   DESKTOP
   ═══════════════════════════════════════════ */
function DesktopAdvantage() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(0);
 
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setInView(true); observer.unobserve(el); }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
 
  const line1Words = "Why Choose".split(" ");
 
  return (
    <section className="relative w-full min-h-[80vh] flex items-center px-6 pt-36 pb-20 overflow-hidden">
 
      {/* CSS keyframes */}
      <style>{`
        @keyframes adv-float    { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-9px); } }
        @keyframes adv-glow-pulse {
          0%,100% { opacity: 0.20; transform: scale(1);    }
          50%     { opacity: 0.40; transform: scale(1.22); }
        }
        @keyframes adv-sep-grow {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
      `}</style>
 
      {/* Background glow blobs */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,35,149,0.28) 0%, transparent 70%)",
          filter: "blur(90px)",
          opacity: inView ? 1 : 0,
          transition: "opacity 1.6s ease",
        }}
      />
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(77,166,255,0.14) 0%, transparent 70%)",
          filter: "blur(90px)",
          opacity: inView ? 1 : 0,
          transition: "opacity 1.6s ease 400ms",
        }}
      />
 
      <div
        ref={ref}
        className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-[1fr_1.15fr] gap-16 items-start"
      >
 
        {/* ── LEFT: Brand visual ── */}
        <div
          className="flex flex-col items-center"
          style={{
            position: "sticky",
            top: "calc(50vh - 180px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(-55px)",
            transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 100ms, transform 1s cubic-bezier(0.16,1,0.3,1) 100ms",
          }}
        >
          {/* Logo + glow */}
          <div className="relative flex items-center justify-center mb-5">
            {/* Soft glow core behind logo */}
            <div
              className="absolute w-52 h-52 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(77,166,255,0.2) 0%, transparent 70%)",
                filter: "blur(20px)",
                animation: inView ? "adv-glow-pulse 3.5s ease-in-out infinite" : "none",
              }}
            />
 
            {/* Logo — floats after entry */}
            <Image
              src="/logo.png"
              alt="SOL Factory"
              width={210}
              height={210}
              className="relative z-10"
              style={{
                filter: "drop-shadow(0 0 22px rgba(77,166,255,0.5))",
                animation: inView ? "adv-float 4.5s ease-in-out infinite" : "none",
                animationDelay: "0.8s",
              }}
            />
          </div>
 
          {/* Gradient divider — grows in */}
          <div
            className="w-20 h-px mb-5 origin-center"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.55), transparent)",
              animation: inView ? "adv-sep-grow 0.7s cubic-bezier(0.22,1,0.36,1) 600ms both" : "none",
            }}
          />
 
          {/* Stat pills — staggered */}
          <div className="flex gap-3">
            {statPills.map(({ label, value, color }, pi) => (
              <div
                key={label}
                className="flex flex-col items-center px-4 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.04]"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(14px)",
                  transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${700 + pi * 90}ms,
                               transform 0.65s cubic-bezier(0.16,1,0.3,1) ${700 + pi * 90}ms`,
                }}
              >
                <span className={`text-base font-black leading-none ${color}`}>{value}</span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30 mt-1">{label}</span>
              </div>
            ))}
          </div>
        </div>
 
 
        {/* ── RIGHT: Accordion ── */}
        <div>
          {/* Heading — word-by-word reveal */}
          <div className="mb-10">
            <h2 className="text-[42px] leading-tight tracking-tight flex flex-wrap gap-x-[0.3em] items-baseline overflow-hidden">
              {line1Words.map((word, i) => (
                <span
                  key={i}
                  className="font-light text-white inline-block"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(30px)",
                    transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${200 + i * 90}ms,
                                 transform 0.6s cubic-bezier(0.16,1,0.3,1) ${200 + i * 90}ms`,
                  }}
                >
                  {word}
                </span>
              ))}
              <span
                className="font-bold inline-block whitespace-nowrap"
                style={{
                  background: "linear-gradient(90deg, #60a5fa 0%, #34d399 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(30px)",
                  transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${200 + line1Words.length * 90}ms,
                               transform 0.65s cubic-bezier(0.16,1,0.3,1) ${200 + line1Words.length * 90}ms`,
                }}
              >
                The SOL Factory?
              </span>
            </h2>
          </div>
 
          {/* Accordion — rows stagger in */}
          <div>
            {advantageCards.map(({ icon: Icon, title, desc, stat, statLabel, accentColor, glowColor }, i) => {
              const isOpen = openIdx === i;
              const rowDelay = 700 + i * 80;
 
              return (
                <div
                  key={title}
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(18px)",
                    transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${rowDelay}ms,
                                 transform 0.65s cubic-bezier(0.16,1,0.3,1) ${rowDelay}ms`,
                  }}
                >
                  <div className="h-px bg-white/[0.07]" />
 
                  <button
                    className="w-full flex items-center gap-4 py-[18px] text-left group"
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                  >
                    {/* Number */}
                    <span
                      className={`text-xs font-bold tabular-nums w-6 flex-shrink-0 ${isOpen ? accentColor : "text-white/40 group-hover:text-white/60"}`}
                      style={{ transform: isOpen ? "scale(1.15)" : "scale(1)", transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), color 0.3s ease" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
 
                    {/* Active accent bar */}
                    <div
                      className="flex-shrink-0 w-0.5 rounded-full"
                      style={{
                        height: isOpen ? "20px" : "0px",
                        background: `linear-gradient(to bottom, transparent, ${glowColor.replace("0.15", "0.9")}, transparent)`,
                        transition: "height 0.4s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    />
 
                    {/* Title */}
                    <span
                      className="flex-1 text-[18px] font-bold"
                      style={{
                        color: isOpen ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.52)",
                        transition: "color 0.35s ease",
                      }}
                    >
                      {title}
                    </span>
 
                    {/* Stat badge (closed) */}
                    <span
                      className={`text-xs font-black ${accentColor}`}
                      style={{
                        opacity: isOpen ? 0 : 0.48,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      {stat}
                    </span>
 
                    {/* Chevron */}
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center border flex-shrink-0"
                      style={{
                        borderColor: isOpen ? "rgba(96,165,250,0.35)" : "rgba(255,255,255,0.08)",
                        background: isOpen ? "rgba(96,165,250,0.08)" : "rgba(255,255,255,0.03)",
                        color: isOpen ? "rgb(96,165,250)" : "rgba(255,255,255,0.25)",
                        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    >
                      <IconChevronDown
                        size={16}
                        stroke={1.5}
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
                        }}
                      />
                    </span>
                  </button>
 
                  {/* Expanded body */}
                  <div
                    style={{
                      maxHeight: isOpen ? "160px" : "0px",
                      opacity: isOpen ? 1 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.46s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease",
                    }}
                  >
                    <div className="pb-5 pl-10 flex items-start gap-4">
                      <div
                        className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center border border-white/10 mt-0.5"
                        style={{ background: glowColor, boxShadow: `0 0 14px ${glowColor}` }}
                      >
                        <Icon size={15} stroke={1.5} className={accentColor} />
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-1.5">
                          <span className={`text-xl font-black leading-none ${accentColor}`}>{stat}</span>
                          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">{statLabel}</span>
                        </div>
                        <p className="text-white/70 text-[14px] leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="h-px bg-white/[0.07]" />
          </div>
        </div>
 
      </div>
    </section >
  );
}
 
/* ─── Shell ─── */
export default function SolFactoryAdvantage() {
  const isMobile = useIsMobile();
 
  if (isMobile === null) return <FullPageLoader />;
  if (isMobile) return <MobileSolFactoryAdvantage />;
 
  return <DesktopAdvantage />;
}