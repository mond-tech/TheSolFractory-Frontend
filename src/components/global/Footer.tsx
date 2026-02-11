"use client";

import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative w-full">
      {/* PAPER SHADOW */}
<div
  className="pointer-events-none absolute top-0 left-0 right-0 h-10"
  style={{
    background: `
      linear-gradient(
        to bottom,
        rgba(0,0,0,0.35),
        rgba(0,0,0,0.15),
        rgba(0,0,0,0.05),
        transparent
      )
    `,
    filter: "blur(6px)",
    opacity: 0.55,
  }}
/>

      {/* FOOTER BACKGROUND */}
      <div
        className="w-full text-white px-6 pt-14 pb-6"
        style={{
          background: "#001534",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* GLASS RECTANGLE */}
        <div
          className="max-w-7xl mx-auto rounded-[28px] px-10 py-10"
          style={{
            background: `
              linear-gradient(
                180deg,
                rgba(255,255,255,0.10),
                rgba(255,255,255,0.04)
              )
            `,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="
              grid grid-cols-1
              md:grid-cols-[2fr_1fr_1fr]
              gap-y-8 md:gap-x-20
            "
          >
            {/* BRAND */}
            <div>
              <Link href="/" className="block mb-4">
                <Image
                  src="/logo.png"
                  alt="SOL FRANCE"
                  width={90}
                  height={60}
                />
              </Link>

              <p className="text-sm text-white/70 max-w-sm leading-relaxed">
                Exceptional quality. Endless customization. True scalability.
              </p>

              <div className="flex gap-4 mt-6">
                <Link
                  href="https://www.instagram.com/thesolfactory"
                  target="_blank"
                  className="h-10 w-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-white/10 transition"
                >
                  <IconBrandInstagram size={22} />
                </Link>

                <Link
                  href="https://www.linkedin.com/in/prerolledcones"
                  target="_blank"
                  className="h-10 w-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-white/10 transition"
                >
                  <IconBrandLinkedin size={22} />
                </Link>

                <Link
                  href="https://x.com/Thesolfrance"
                  target="_blank"
                  className="h-10 w-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-white/10 transition"
                >
                  <IconBrandTwitter size={22} />
                </Link>
              </div>
            </div>

            {/* EXPLORE */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Explore</h3>
              <ul className="space-y-3 text-white/70">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/catalog">Products</Link>
                </li>
                <li>
                  <Link href="/build">Build</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
              </ul>
            </div>

            {/* LINKS */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Links</h3>
              <ul className="space-y-3 text-white/70">
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-6 text-center text-white/50 text-xs flex items-center justify-center gap-1">
          <span>
            © {new Date().getFullYear()} SolFactory. All rights reserved.
          </span>
          <span className="text-white/50">•</span>
          <span className="text-white/60">Powered by Lumzy</span>
        </div>
      </div>
    </footer>
  );
}
