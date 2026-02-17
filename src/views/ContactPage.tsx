"use client";
 
import React, { useState, useRef } from "react";
import Navbar from "@/src/components/global/Navbar";
import Footer from "@/src/components/global/Footer";
import { motion, useInView, easeInOut } from "framer-motion";
 
export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    message: "",
  });
 
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
 
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
 
  /* ================= ANIMATION VARIANTS ================= */
 
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15 },
    },
  };
 
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeInOut },
    },
  };
 
  return (
    <div className="min-h-screen text-white relative">
      <Navbar />
 
      <main className="min-h-screen pt-4 md:pt-[9%] pb-17 relative z-10">
        <div className="text-center">
          <h1
            className="text-3xl md:text-4xl font-semibold text-white mb-10 md:mb-14 mt-10 md:mt-1"
            style={{ textShadow: "0 0 2px rgba(255,255,255,0.6)" }}
          >
            Contact <span className="text-blue-400">Us</span>
          </h1>
        </div>
 
        <div
          ref={ref}
          className="max-w-7xl mx-auto px-4 md:px-6 space-y-10 md:space-y-12"
        >
          <motion.div
            variants={container}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="flex flex-col lg:flex-row justify-center items-stretch gap-8 md:gap-12 w-full"
          >
            {/* FORM */}
            <motion.div
              variants={fadeUp}
              className="w-full max-w-125 h-full min-h-130"
            >
              <section className="glass-panel p-6 md:p-7 rounded-2xl border border-white/10 w-full h-full relative overflow-hidden flex flex-col">
                <div className="mb-4 md:mb-5 space-y-1 flex justify-center items-center flex-col">
                  <h2 className="text-lg md:text-xl font-semibold">
                    Send us a message
                  </h2>
                  <p className="text-xs md:text-sm text-gray-300">
                    Fill out the form and we’ll follow up with a tailored
                    proposal.
                  </p>
                </div>
 
                <form
                  className="space-y-3 flex-1 flex flex-col"
                  onSubmit={handleSubmit}
                >
                  {/* inputs unchanged */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      name="fullName"
                      placeholder="Full Name"
                      value={form.fullName}
                      onChange={handleChange}
                      className="bg-black/40 border placeholder:text-white/50 border-white/10 rounded-lg px-3 py-3 text-xs md:text-sm text-white"
                    />
                    <input
                      name="jobTitle"
                      placeholder="Job Title"
                      value={form.jobTitle}
                      onChange={handleChange}
                      className="bg-black/40 border placeholder:text-white/50 border-white/10 rounded-lg px-3 py-3 text-xs md:text-sm text-white"
                    />
                  </div>
 
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="email"
                      name="email"
                      placeholder="Work Email"
                      value={form.email}
                      onChange={handleChange}
                      className="bg-black/40 border placeholder:text-white/50 border-white/10 rounded-lg px-3 py-3 text-xs md:text-sm text-white"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={handleChange}
                      className="bg-black/40 border placeholder:text-white/50 border-white/10 rounded-lg px-3 py-3 text-xs md:text-sm text-white"
                    />
                  </div>
 
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      name="company"
                      placeholder="Company Name"
                      value={form.company}
                      onChange={handleChange}
                      className="bg-black/40 border placeholder:text-white/50 border-white/10 rounded-lg px-3 py-3 text-xs md:text-sm text-white"
                    />
                    <input
                      name="website"
                      placeholder="Website"
                      value={form.website}
                      onChange={handleChange}
                      className="bg-black/40 border placeholder:text-white/50 border-white/10 rounded-lg px-3 py-3 text-xs md:text-sm text-white"
                    />
                  </div>
 
                  <textarea
                    name="message"
                    placeholder="Tell us about your project requirements..."
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full bg-black/40 border placeholder:text-white/50 border-white/10 rounded-lg px-3 py-3 text-sm text-white resize-none"
                  />
 
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="block w-full mt-2.75 mb-1 md:w-65 mx-auto btn-liquid py-3 text-[11px] font-bold uppercase tracking-[0.2em]"
                    >
                      Send Request
                    </button>
                  </div>
                </form>
              </section>
            </motion.div>
 
            {/* CARDS */}
            <motion.div
              variants={container}
              className="w-full lg:max-w-75 h-full"
            >
              <div className="grid grid-cols-2 grid-rows-2 auto-rows-fr gap-4 lg:flex lg:flex-col lg:justify-between lg:gap-6 h-full">
                <motion.div
                  variants={fadeUp}
                  className="glass-panel p-5 md:p-6 rounded-2xl border flex justify-center flex-col items-center text-center border-white/10"
                >
                  <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-blue-400 mb-2">
                    Support
                  </h3>
                  <p className="text-sm text-gray-300 break-all">
                    braj@thesolfactory.com
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Existing customer or production partner? Reach our support
                    team here.
                  </p>
                </motion.div>
 
                <motion.div
                  variants={fadeUp}
                  className="glass-panel p-5 md:p-6 rounded-2xl border flex justify-center flex-col items-center text-center border-white/10"
                >
                  <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-blue-400 mb-1">
                    Global Sales
                  </h3>
                  <p className="text-sm text-gray-300">+1 (742) 688-0288</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Talk to our sales team about pricing, volumes, and
                    white-label options.
                  </p>
                </motion.div>
 
                <motion.div
                  variants={fadeUp}
                  className="glass-panel p-5 md:p-6 rounded-2xl border flex flex-col justify-center items-center text-center border-white/10 col-span-2 lg:col-span-1"
                >
                  <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-blue-400 mb-1">
                    Headquarters
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Solitude Flame Pvt Ltd
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    D63B, Site 4, Behind Fortis Hospital 201310, Greater Noida,
                    India
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
 
      <Footer />
    </div>
  );
}