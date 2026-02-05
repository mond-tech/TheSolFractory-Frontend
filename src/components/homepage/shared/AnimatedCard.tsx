"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface CardProps {
  href: string;
  image: string;
  logo: string;
  text: string;
  direction: "left" | "right";
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

/* Opposite corner glow */
const glowMap: Record<CardProps["position"], string> = {
  "top-left":
    "bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.9),transparent_35%)]",

  "top-right":
    "bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.9),transparent_35%)]",

  "bottom-left":
    "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.9),transparent_35%)]",

  "bottom-right":
    "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_35%)]",
};

const innerGradientMap: Record<CardProps["position"], string> = {
  "top-left": "linear-gradient(315deg, #000000 0%, #001d7b 100%)", // dark starts bottom-right
  "top-right": "linear-gradient(45deg, #000000 0%, #001f3f 100%)", // dark starts bottom-left
  "bottom-left": "linear-gradient(225deg, #000000 0%, #001d7b 100%)", // dark starts top-right
  "bottom-right": "linear-gradient(135deg, #000000 0%, #001f3f 100%)", // dark starts top-left
};

export default function AnimatedCard({
  href,
  image,
  logo,
  text,
  direction,
  position,
}: CardProps) {
  const isLeft = direction === "left";

  return (
  <Link href={href} className="block h-full w-full cursor-cone">
      <motion.div
        initial="rest"
        animate="rest"
        whileHover="hover"
        className="
          relative
          h-full
          w-full
          rounded-3xl
          overflow-hidden
          bg-transparent
        "
      >
        {/* ================= BORDER GLOW RING ================= */}
        <div className="cursor-events-none absolute inset-0 rounded-3xl">
          {/* Glow */}
          <div
            className={`
              absolute inset-0 rounded-3xl
              ${glowMap[position]}
            `}
          />

          {/* Inner cut */}
          <div
            className="absolute inset-[3px] rounded-[22px] cursor-events-none"
            style={{
              background: innerGradientMap[position],
              boxShadow:
                "0 10px 20px rgba(0, 29, 123, 0.4), 0 4px 6px rgba(0, 0, 0, 0.25)",
              backdropFilter: "blur(10px) saturate(180%)",
            }}
          />
        </div>

        {/* ================= IMAGE ================= */}
        <motion.div
          variants={{
            rest: { opacity: 0.3 },
            hover: { opacity: 0.8 },
          }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image src={image} alt="" fill priority className="object-cover" />
        </motion.div>

        {/* ================= CONTENT ================= */}
        <div className="relative z-10 h-full w-full px-10 flex items-center">
          {/* Logo */}
          <motion.div
            className={`
              absolute
              top-1/2
              -translate-y-1/2
              ${isLeft ? "right-20" : "left-20"}
            `}
            variants={{
              rest: { x: 0 },
              hover: { x: isLeft ? "-180%" : "180%" },
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
          >
            <Image src={logo} width={160} height={120} alt="logo" />
          </motion.div>

          {/* Text */}
          <motion.p
            variants={{
              rest: { opacity: 0 },
              hover: { opacity: 1 },
            }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={`
              w-[50%]
              text-lg
              text-white
              font-medium
              leading-relaxed
              ${isLeft ? "ml-auto text-right" : "mr-auto text-left"}
            `}
          >
            {text}
          </motion.p>
        </div>
      </motion.div>
    </Link>
  );
}