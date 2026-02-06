"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const STORAGE_KEY = "ageVerifiedUntil";
const VALID_DAYS = 7;

export default function AgeGate() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  // Don't show on underage page
  const blockedRoutes = ["/underage", "/privacy"];
  const isUnderagePage = blockedRoutes.includes(pathname);

  useEffect(() => {
    if (isUnderagePage) return;

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      setShow(true);
      return;
    }

    const expiresAt = Number(saved);

    if (Date.now() > expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      setShow(true);
    }
  }, [isUnderagePage]);

  function handleAccept() {
    const expires = Date.now() + VALID_DAYS * 24 * 60 * 60 * 1000;

    localStorage.setItem(STORAGE_KEY, expires.toString());
    setShow(false);
  }

  function handleDeny() {
    window.location.href = "/underage";
  }

  if (isUnderagePage) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-transparent backdrop-blur-xl rounded-2xl p-8 w-[90%] max-w-md shadow-2xl text-center outline-2 outline-offset-4 outline-white"
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center pb-4">
              <Image src="/logo.png" alt="SOL FRANCE" height={40} width={100} />
            </div>
            <h2 className="text-2xl font-bold mb-3 font-bold tracking-tight">
              Confirm Your Age
            </h2>

            <div className="text-white mb-6 font-mono">
              <div>You must be 21 years or older to access this website.</div>
              <div>
                <Link href={"/privacy"} className="text-gray-200 underline">
                  {" "}
                  Privacy Policy{" "}
                </Link>
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-nowrap">
              <button
                onClick={handleAccept}
                className="w-40 px-6 py-2 rounded-lg bg-gray-200 text-black font-medium 
               hover:bg-gray-300 transition cursor-pointer hover:scale-105 
               whitespace-nowrap"
              >
                Yes, I'm 21+
              </button>

              <button
                onClick={handleDeny}
                className="w-40 px-6 py-2 rounded-lg text-white font-medium 
               cursor-pointer border border-white 
               whitespace-nowrap hover:scale-105 transition"
              >
                No
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}