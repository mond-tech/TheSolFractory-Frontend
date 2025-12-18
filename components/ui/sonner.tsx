"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-left"
      theme="dark"
      expand
      toastOptions={{
        classNames: {
          toast:
            "glass-panel " +
            "bg-gradient-to-r from-blue-600/95 via-blue-500/95 to-blue-600/95 " +
            "border border-blue-400/40 " +
            "text-white " +
            "shadow-[0_20px_40px_rgba(37,99,235,0.6)]",

          title: "font-semibold text-white",

          description: "text-sm text-blue-100",

          actionButton:
            "btn-liquid px-3 py-1 text-xs font-bold uppercase tracking-widest text-white",

          cancelButton:
            "btn-liquid px-3 py-1 text-xs font-bold uppercase tracking-widest bg-transparent text-white",
        },
      }}
    />
  );
}
