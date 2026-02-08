// components/CenterOverlay.tsx
"use client";

import React from "react";

/**
 * Props:
 * - center: { screenX, screenY, index } | null
 * - containerSize: { width, height } - used for layout
 */
export default function CenterOverlay({
  center,
  containerSize,
  titles,
}: {
  center: { screenX: number; screenY: number; index: number } | null;
  containerSize: { width: number; height: number };
  titles?: string[];
}) {
  // position for card on the right side (fixed relative to container)
  const cardRight = Math.round(containerSize.width * 0.82);
  const cardTop = Math.round(containerSize.height / 2 - 80); // center vertically, adjust

  // points for the Z-shaped path: from cone point -> mid -> card
  const zPath = () => {
    if (!center) return "";
    const startX = center.screenX;
    const startY = center.screenY;
    // mid point roughly halfway to card
    const mid1X = startX + (cardRight - startX) * 0.35;
    const mid1Y = startY - 30;
    const mid2X = startX + (cardRight - startX) * 0.65;
    const mid2Y = startY + 40;
    const endX = cardRight;
    const endY = cardTop + 30;
    // Compose Z-like polyline
    return `M ${startX},${startY} L ${mid1X},${mid1Y} L ${mid2X},${mid2Y} L ${endX},${endY}`;
  };

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {center && (
        <>
          <svg
            width={containerSize.width}
            height={containerSize.height}
            style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
          >
            <path d={zPath()} stroke="rgba(255,255,255,0.9)" strokeWidth={2.2} fill="none" strokeLinecap="round" />
          </svg>

          <div
            style={{
              position: "absolute",
              left: cardRight,
              top: cardTop,
              width: 260,
              padding: 14,
              background: "rgba(8,12,30,0.85)",
              color: "white",
              borderRadius: 12,
              boxShadow: "0 6px 24px rgba(0,0,0,0.6)",
              pointerEvents: "auto",
            }}
          >
            <div style={{ fontSize: 12, color: "#9fb0ff", marginBottom: 8 }}>Center cone</div>
            <h3 style={{ margin: 0, fontSize: 18 }}>{titles?.[center.index] ?? `Cone #${center.index}`}</h3>
            <p style={{ marginTop: 8, fontSize: 13, opacity: 0.85 }}>
              Some info about the cone — editable. You can put details, specs or buttons here.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
