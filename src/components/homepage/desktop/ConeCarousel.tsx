"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionValue, type MotionValue } from "framer-motion";

type LazyCarouselCanvasProps = {
  scrollProgress: MotionValue<number>;
  onItemClick: (index: number) => void;
  onLoadingChange?: (loading: boolean, progress: number) => void;
  showSmoke?: boolean;
};

const LazyCarouselCanvas = dynamic<LazyCarouselCanvasProps>(
  () => import("../shared/CarouselScene").then((m) => m.default),
  { ssr: false, loading: () => null },
);

const CARD_PLACEHOLDER_SRC = "/homepage/hero-image.png"; // TODO: swap to your attached robo PNG in /public, e.g. "/homepage/robo.png"

function isTouchLike() {
  if (typeof window === "undefined") return true;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia?.("(pointer: coarse)")?.matches
  );
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function CustomCursor({
  enabled,
  loading,
}: {
  enabled: boolean;
  loading: boolean;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef({
    tx: 0,
    ty: 0,
    x: 0,
    y: 0,
    mode: "idle" as "idle" | "hover" | "loading",
    magnetEl: null as HTMLElement | null,
    label: "",
  });

  useEffect(() => {
    if (!enabled) return;

    gsap.registerPlugin(ScrollTrigger);

    const outer = outerRef.current;
    const inner = innerRef.current;
    const label = labelRef.current;
    if (!outer || !inner || !label) return;

    // Hide native cursor (desktop only)
    const prevCursor = document.documentElement.style.cursor;
    document.documentElement.style.cursor = "none";

    const setOuterX = gsap.quickSetter(outer, "x", "px");
    const setOuterY = gsap.quickSetter(outer, "y", "px");
    const setInnerX = gsap.quickSetter(inner, "x", "px");
    const setInnerY = gsap.quickSetter(inner, "y", "px");

    const onMove = (e: PointerEvent) => {
      stateRef.current.tx = e.clientX;
      stateRef.current.ty = e.clientY;
    };

    const interactiveSelector =
      "a,button,[role='button'],[data-cursor='hover'],summary";

    const onPointerOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.(
        interactiveSelector,
      ) as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-cursor='none']")) return;

      stateRef.current.magnetEl = target;
      stateRef.current.mode = "hover";
      stateRef.current.label = target.getAttribute("data-cursor-label") ?? "";

      gsap.to(outer, { scale: 44 / 28, duration: 0.22, ease: "power2.out" });
      gsap.to(inner, { scale: 1.15, duration: 0.22, ease: "power2.out" });

      if (stateRef.current.label) {
        label.textContent = stateRef.current.label;
        gsap.to(label, { autoAlpha: 1, duration: 0.18, ease: "power2.out" });
      }
    };

    const onPointerOut = (e: PointerEvent) => {
      const leaving = e.target as HTMLElement | null;
      if (!leaving) return;
      if (!leaving.closest?.(interactiveSelector)) return;

      stateRef.current.magnetEl = null;
      stateRef.current.mode = "idle";
      stateRef.current.label = "";

      gsap.to(outer, { scale: 1, duration: 0.22, ease: "power2.out" });
      gsap.to(inner, { scale: 1, duration: 0.22, ease: "power2.out" });
      gsap.to(label, { autoAlpha: 0, duration: 0.18, ease: "power2.out" });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });

    let raf = 0;
    const tick = () => {
      const s = stateRef.current;

      // Loading state overrides hover/idle visuals (but keeps magnet behavior).
      if (loading) {
        s.mode = "loading";
      } else if (s.mode === "loading") {
        s.mode = s.magnetEl ? "hover" : "idle";
      }

      // Smooth follow
      const follow = s.mode === "hover" ? 0.22 : 0.18;
      s.x += (s.tx - s.x) * follow;
      s.y += (s.ty - s.y) * follow;

      let ox = s.x;
      let oy = s.y;

      // Magnetic attraction
      if (s.magnetEl) {
        const r = s.magnetEl.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        ox += (cx - ox) * 0.35;
        oy += (cy - oy) * 0.35;
      }

      setOuterX(ox);
      setOuterY(oy);
      setInnerX(s.x);
      setInnerY(s.y);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerout", onPointerOut);
      cancelAnimationFrame(raf);
      document.documentElement.style.cursor = prevCursor;
    };
  }, [enabled, loading]);

  if (!enabled) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999] hidden md:block"
      aria-hidden="true"
    >
      <div
        ref={outerRef}
        className="absolute left-0 top-0 w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35 bg-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-[2px] will-change-transform"
      >
        {/* loader ring (shows only during loading) */}
        <svg
          className={`absolute inset-0 w-full h-full ${
            loading ? "opacity-100 animate-spin" : "opacity-0"
          } transition-opacity duration-200`}
          viewBox="0 0 28 28"
        >
          <circle
            cx="14"
            cy="14"
            r="12"
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="22 10"
          />
        </svg>
      </div>

      <div
        ref={innerRef}
        className={`absolute left-0 top-0 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.25)] will-change-transform ${
          loading ? "animate-pulse" : ""
        }`}
      />

      <div
        ref={labelRef}
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-full bg-black/70 text-white text-[11px] px-3 py-1 opacity-0 will-change-transform"
      />
    </div>
  );
}

export default function ConeCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [shouldMount3D, setShouldMount3D] = useState(false);
  const [is3DLoading, setIs3DLoading] = useState(false);
  const [is3DReady, setIs3DReady] = useState(false);

  const touch = useMemo(() => isTouchLike(), []);
  const reduce = useMemo(() => prefersReducedMotion(), []);
  const settled3DProgress = useMotionValue(1);

  useEffect(() => {
    if (touch) return;
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const pin = pinRef.current;
    const card = cardRef.current;
    const copy = copyRef.current;
    const accent = accentRef.current;
    if (!section || !pin || !card || !copy || !accent) return;

    let tl: gsap.core.Timeline | null = null;
    let st: ScrollTrigger | null = null;

    const build = () => {
      // Reset to baseline before measuring
      gsap.set(card, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        borderRadius: 24,
        force3D: true,
        transformOrigin: "center center",
        willChange: "transform",
      });
      gsap.set(copy, { opacity: 1, y: 0, willChange: "transform,opacity" });
      gsap.set(accent, { yPercent: 0, willChange: "transform" });

      const rect = card.getBoundingClientRect();
      const targetX = window.innerWidth / 2 - (rect.left + rect.width / 2);
      const targetY = window.innerHeight / 2 - (rect.top + rect.height / 2);
      const scaleX = window.innerWidth / rect.width;
      const scaleY = window.innerHeight / rect.height;

      tl?.kill();
      tl = gsap.timeline({ defaults: { ease: "none" } });
      tl.to(
        accent,
        {
          yPercent: -28,
          duration: 1,
        },
        0,
      );
      // keep layout stable; fade copy as the card starts expanding
      tl.to(
        copy,
        {
          opacity: 0,
          y: -12,
          duration: 0.35,
        },
        0.52,
      );
      // expansion phase
      tl.to(
        card,
        {
          x: targetX,
          y: targetY,
          scaleX,
          scaleY,
          borderRadius: 0,
          duration: 1,
        },
        0.52,
      );

      st?.kill();
      st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * 2.2)}`,
        pin,
        scrub: reduce ? false : 0.3,
        invalidateOnRefresh: true,
        animation: tl,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);

          // Lazy-mount 3D only when card is basically full-screen.
          if (!touch && p > 0.95 && !shouldMount3D) {
            setShouldMount3D(true);
            setIs3DLoading(true);
          }

          // If user scrolls far back up, unmount to free GPU/memory.
          if (p < 0.6 && shouldMount3D) {
            setShouldMount3D(false);
            setIs3DLoading(false);
            setIs3DReady(false);
          }
        },
      });
    };

    const ctx = gsap.context(() => {
      build();
      ScrollTrigger.addEventListener("refreshInit", build);
      ScrollTrigger.refresh();
    }, pin);

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", build);
      st?.kill();
      tl?.kill();
      ctx.revert();
    };
  }, [reduce, shouldMount3D, touch]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#f7f8fb] text-[#0b0d12] overflow-hidden"
      aria-label="Experiences"
    >
      <CustomCursor enabled={!touch} loading={is3DLoading && !is3DReady} />

      {/* pinned stage */}
      <div ref={pinRef} className="relative h-screen w-full">
        <div className="absolute inset-0">
          {/* subtle gradient wash */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f7f8fb] to-[#f2f3f7]" />
        </div>

        <div className="relative z-10 h-full px-6 md:px-10 lg:px-16 py-16">
          <div className="grid h-full grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* LEFT: framed card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <div
                ref={cardRef}
                className="relative w-[340px] h-[230px] md:w-[440px] md:h-[300px] rounded-3xl border border-black/10 bg-white shadow-[0_20px_80px_rgba(10,12,20,0.10)] overflow-hidden will-change-transform"
                style={{
                  transform: "translate3d(0,0,0)",
                }}
              >
                {/* placeholder image (stays until 3D is ready) */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    is3DReady ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <img
                    src={CARD_PLACEHOLDER_SRC}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-[#00f0ff]/10" />
                </div>

                {/* 3D stage (lazy mounted) */}
                {shouldMount3D && (
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      is3DReady ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <LazyCarouselCanvas
                      // Keep the 3D scene in its "settled" end state for now;
                      // the scroll-scrub polish is handled by GSAP for the card expansion.
                      scrollProgress={settled3DProgress}
                      onItemClick={() => {}}
                      showSmoke={false}
                      onLoadingChange={(loading: boolean, prog: number) => {
                        setIs3DLoading(loading);
                        if (!loading && prog >= 100) setIs3DReady(true);
                      }}
                    />
                  </div>
                )}

                {/* overlay loader */}
                {(is3DLoading || (shouldMount3D && !is3DReady)) && (
                  <div className="absolute inset-0 grid place-items-center bg-white/65 backdrop-blur-sm">
                    <div className="flex items-center gap-3 text-sm text-black/70">
                      <div className="w-6 h-6 rounded-full border-2 border-black/15 border-t-black/70 animate-spin" />
                      <span className="font-medium">Loading 3D…</span>
                    </div>
                  </div>
                )}

                {/* touch fallback: manual load */}
                {touch && !shouldMount3D && (
                  <div className="absolute inset-0 grid place-items-center bg-white/0">
                    <button
                      type="button"
                      data-cursor="hover"
                      data-cursor-label="Load 3D"
                      onClick={() => {
                        setShouldMount3D(true);
                        setIs3DLoading(true);
                      }}
                      className="pointer-events-auto rounded-full border border-black/15 bg-white/80 px-4 py-2 text-sm font-medium text-black/80 shadow-sm backdrop-blur hover:bg-white transition-colors"
                    >
                      Tap to load 3D
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: copy */}
            <div ref={copyRef} className="lg:col-span-7 max-w-xl">
              <div className="relative">
                {/* accent stroke (parallax) */}
                <div
                  ref={accentRef}
                  className="absolute -right-10 -top-10 w-[520px] h-[240px] opacity-80 pointer-events-none"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 rounded-[999px] border border-transparent [mask:linear-gradient(#000,transparent)]" />
                  <div className="absolute inset-0 rounded-[999px] border border-transparent bg-[conic-gradient(from_180deg_at_50%_50%,#3feeea,rgba(63,238,234,0),#00f0ff)] opacity-60 blur-[0.5px]" />
                  <div className="absolute inset-0 rounded-[999px] border border-transparent ring-1 ring-[#00f0ff]/15" />
                </div>

                <p className="text-xs tracking-[0.28em] uppercase text-black/45">
                  Experiences
                </p>
                <h2 className="mt-4 text-[clamp(42px,6vw,76px)] leading-[0.95] font-light tracking-tight">
                  Cone-style
                  <br />
                  <span className="font-medium">scroll reveal</span>
                </h2>

                <div className="mt-8 space-y-6 text-[15px] leading-7 text-black/70">
                  <p>
                    A minimal, white UI with spacious typography and a neon
                    accent stroke — the left card expands smoothly with
                    scroll-scrubbed transforms (no layout thrash).
                  </p>
                  <p>
                    The heavy Three/GLTF viewer mounts only when the card is
                    effectively full-screen. While assets load, you get a
                    centered overlay loader and a cursor “loading” state.
                  </p>
                </div>

                <div className="mt-10 flex items-center gap-4">
                  <a
                    href="#"
                    data-cursor="hover"
                    data-cursor-label="Let’s talk"
                    className="inline-flex items-center justify-center rounded-full bg-[#0b0d12] text-white px-6 py-3 text-sm font-medium transition-transform will-change-transform hover:scale-[1.02] active:scale-[0.99]"
                  >
                    Let’s talk
                  </a>
                  <button
                    type="button"
                    data-cursor="hover"
                    className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-medium text-black/70 hover:bg-white/70 transition-colors"
                  >
                    Menu
                  </button>
                </div>

                <div className="mt-10 text-xs text-black/40">
                  Scroll progress: {(progress * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tail space after pin (ScrollTrigger adds spacing; this keeps the section breathable in reduced motion / touch) */}
      <div className="h-[30vh]" />
    </section>
  );
}
