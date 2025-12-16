"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { BorderGradient } from "@/src/sharedcomponents/BorderGradient";
import { useIsMobile } from "@/hooks/use-mobile";
import { CartButton } from "@/components/CartButton";
import Image from "next/image";

const menus = [
  { name: "HOME", path: "/" },
  { name: "PRODUCTS", path: "/catalog" },
  { name: "BUILD", path: "/build" },
  { name: "CONTACT", path: "/contact" },
];

const glassButtonBase =
  "relative overflow-hidden px-6 py-2 rounded-full text-sm font-semibold tracking-wide border backdrop-blur-md bg-white/10 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0.3),rgba(255,255,255,0.08))] bg-[length:220%_100%] bg-[position:0%_0] transition-[background-position] border-white/20 text-gray-100 shadow-[0_12px_28px_rgba(0,0,0,0.38)] shadow-inner transition-all duration-300 hover:bg-[position:100%_0] hover:-translate-y-0.5 active:translate-y-0 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/70 before:via-white/10 before:to-white/0 before:opacity-50 before:pointer-events-none after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-1/2 after:rounded-full after:bg-white/15 after:blur-xl after:opacity-60 after:pointer-events-none";
const glassButtonActive =
  "text-white border-blue-300/70 bg-gradient-to-b from-blue-400/70 via-blue-500/40 to-blue-600/30 shadow-[0_16px_38px_rgba(59,130,246,0.4)]";
const glassButtonIdle =
  "text-gray-200/90 hover:text-white hover:border-white/50 hover:bg-white/15 hover:shadow-[0_18px_34px_rgba(0,0,0,0.46)]";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState(0);

  const activeLogin = pathname === "/login";
  const activeSignup = pathname === "/signup";


  const isMobile = useIsMobile();

  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(menuRef.current.scrollHeight);
    }
  }, [menuRef, isOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full py-4 px-8 flex items-center justify-between bg-[#132135]">
    <Link href="/" className="flex items-center">
      <Image
        src="/logo.png"
        alt="Company Logo"  
        width={85}
        height={30}
        className="object-contain"
      />
    </Link>

      {isMobile ? (
        // MOBILE
        <>
          <div className="flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div
            ref={menuRef}
            className="absolute top-full left-0 w-full bg-[#132135] overflow-hidden transition-all duration-500"
            style={{ maxHeight: isOpen ? `${menuHeight}px` : "0px" }}
          >
            <div className="flex flex-col items-center gap-3 py-4">
              {menus.map((m) => {
                const active = pathname === m.path;
                return (
                  <Link
                    key={m.path}
                    href={m.path}
                    onClick={() => setIsOpen(false)}
                    className={`${glassButtonBase} ${
                      active
                        ? glassButtonActive
                        : glassButtonIdle
                    }`}
                  >
                    {m.name}
                  </Link>
                );
              })}
              <div className="flex items-center gap-3 mt-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className={`${glassButtonBase} ${
                    activeLogin ? glassButtonActive : glassButtonIdle
                  }`}
                >
                  LOGIN
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className={`${glassButtonBase} ${
                    activeSignup ? glassButtonActive : glassButtonIdle
                  }`}
                >
                  SIGN UP
                </Link>

                  <div onClick={() => setIsOpen(false)}>
                    <CartButton variant="mobile" />
                  </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        // DESKTOP
        <>
          <div className="flex items-center gap-4">
            {menus.map((m) => {
              const active = pathname === m.path;
              return (
                <Link
                  key={m.path}
                  href={m.path}
                  className={`${glassButtonBase} ${
                    active
                      ? glassButtonActive
                      : glassButtonIdle
                  }`}
                >
                  {m.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
          <Link href="/login">
            <BorderGradient text="LOGIN" active={activeLogin} />
          </Link>

          <Link href="/signup">
            <BorderGradient text="SIGN UP" active={activeSignup} />
          </Link>


            <CartButton variant="desktop" />
          </div>
        </>
      )}
    </nav>
  );
}
