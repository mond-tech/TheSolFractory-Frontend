"use client";
import React from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

interface Data {
  text: string;
  active?: boolean;
  icon?: React.ReactNode; // optional custom icon
}

export function BorderGradient({ text, active, icon }: Data) {
  return (
    <div
      className={`
        rounded-full transition-all duration-300
        ${active ? "shadow-[0_0_15px_#3b82f6]" : ""}
      `}
    >
      <HoverBorderGradient
        containerClassName={`
          rounded-full transition-all duration-300 ease-in-out
          ${!active ? "hover:shadow-[0_0_15px_#3b82f6]" : ""}
        `}
        as="button"
        className="relative overflow-hidden bg-white/10 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0.32),rgba(255,255,255,0.08))] bg-[length:220%_100%] bg-[position:0%_0] transition-[background-position] hover:bg-[position:100%_0] text-white flex items-center space-x-2 px-5 py-2 rounded-full border border-white/25 shadow-[0_12px_28px_rgba(0,0,0,0.38)] shadow-inner backdrop-blur-md before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/70 before:via-white/15 before:to-white/0 before:opacity-60 before:pointer-events-none after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-1/2 after:rounded-full after:bg-white/20 after:blur-xl after:opacity-70 after:pointer-events-none"
      >
        {/* Icon section — custom icon or default */}
        {icon ? (
          <span className="h-3 w-3 text-white flex items-center">{icon}</span>
        ) : ""}

        <span>{text}</span>
      </HoverBorderGradient>
    </div>
  );
}