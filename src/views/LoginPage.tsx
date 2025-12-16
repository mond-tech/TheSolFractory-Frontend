"use client";

import Link from "next/link";
import { useState } from "react";

/* Previous login layout kept for reference:
<div className="min-h-screen flex items-center justify-center p-1 mt-20 mb-10.5">
  <div className="w-full max-w-155 backdrop-blur-lg border border-white rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.9)]">
    <div className="bg-[#D9D9D9] border-22 border-[#132135] rounded-2xl">
      <CardContent className="p-10">
        ...form fields and buttons...
      </CardContent>
    </div>
  </div>
</div>
*/

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-28 md:pt-32 relative">
      <div className="liquid-canvas">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <div className="glass-panel p-8 md:p-10 w-full max-w-md relative z-10">
        <h2 className="text-3xl font-serif text-center mb-2">Login</h2>
        <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-sm text-white focus:border-blue-500 outline-none transition focus:bg-black/60"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-sm text-white focus:border-blue-500 outline-none transition focus:bg-black/60"
          />
          <button
            type="submit"
            className="w-full btn-liquid btn-primary py-4 text-xs font-bold uppercase tracking-widest"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-4">
            Or continue with
          </p>
          <div className="flex justify-center gap-4">
            <a href="#" className="btn-liquid px-1 py-3 w-70 font-semibold uppercase tracking-widest 
                    text-gray-300 hover:text-white border-gray-500 rounded-3xl hover:bg-gray-800 transition border-2">
              Continue With Google
            </a>
          </div>
        </div>
        <div className="text-center mt-6">
          <span className="text-xs text-gray-500 mr-1">Don’t have an account?</span>
          <Link href="/signup" className="text-xs hover:text-white transition">
             Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
