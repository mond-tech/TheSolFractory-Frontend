"use client";

import { useEffect } from "react";

export default function SmokeCursor() {
  useEffect(() => {
    const createSmoke = (x: number, y: number) => {
      const smoke = document.createElement("div");
      smoke.className =
        "w-3 h-3 rounded-full bg-gray-200/50 absolute pointer-events-none animate-smoke-cursor";
      smoke.style.left = x + "px";
      smoke.style.top = y + "px";
      document.body.appendChild(smoke);

      setTimeout(() => {
        smoke.remove();
      }, 1000); // lasts 1s
    };

    const handleMouseMove = (e: MouseEvent) => {
      createSmoke(e.pageX, e.pageY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return null;
}