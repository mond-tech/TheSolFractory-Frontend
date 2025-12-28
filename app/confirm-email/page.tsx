"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";

export default function ConfirmEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const userId = params.get("userId");
  const token = params.get("token");

  const [resendEmailValue, setResendEmailValue] = useState("");
  const [resendStatus, setResendStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [debug, setDebug] = useState<any>(null);


  useEffect(() => {
    if (!userId || !token) {
      setMessage("Confirmation link appears incomplete — please use the link sent to your email.");
      setStatus("error");
    }
  }, [userId, token]);

  const confirmEmail = async () => {
    if (!userId || !token) return;

    setStatus("loading");
    setMessage(null);
    setDebug(null);

    try {
      const data = await AuthService.confirmEmail(userId, token);

      if (data.isSuccess) {
        setStatus("success");
        setMessage("Your email has been verified. Redirecting to sign in...");
        setTimeout(() => router.push("/login"), 4000);
      } else {
        setStatus("error");
        setMessage(data.message || "Verification failed");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Network error");

      // Optional: show full error for dev
      setDebug(err);
    }
  };

  const resendEmail = async () => {
    if (!resendEmailValue) return;

    setResendStatus("loading");
    try {
      const res = await AuthService.resendConfirmEmail(resendEmailValue);
      if (res.isSuccess) {
        setResendStatus("success");
        setMessage("Confirmation email resent successfully.");
      } else {
        setResendStatus("error");
        setMessage(res.message);
      }
    } catch (err: any) {
      setResendStatus("error");
      setMessage(err.message || "Failed to resend email");
    }
  };


  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-black/70 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/10 p-8">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center text-white">
            {/* simple mail icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8.5v7A2.5 2.5 0 0 0 5.5 18h13A2.5 2.5 0 0 0 21 15.5v-7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 8.5L12 13l9-4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Confirm your email</h1>
            <p className="text-sm text-gray-300">Please confirm your email so we can finish creating your account.</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="rounded-lg border border-dashed border-white/10 p-6 bg-white">
            <p className="text-sm text-gray-300">
              We sent a confirmation link to your email. Click <strong>Confirm Email</strong> to complete verification.
            </p>

            {message && (
              <div className={`mt-4 px-4 py-3 rounded-md text-sm ${status === "error" ? "bg-red-500/10 text-red-300 border border-red-500/20" : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"}`} role="status">
                {message}
              </div>
            )}

            <div className="mt-6 flex items-center justify-center">
              {status === "success" ? (
                <button
                  onClick={() => router.push("/login")}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-600 text-white font-medium shadow-sm hover:opacity-95"
                >
                  {/* check icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Proceed to Sign in
                </button>
              ) : (
                <button
                  onClick={confirmEmail}
                  disabled={!userId || !token || status === "loading"}
                  className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-black text-white border border-white font-medium disabled:opacity-60"
                  aria-disabled={!userId || !token || status === "loading"}
                >
                  {status === "loading" ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" strokeDasharray="60" strokeLinecap="round" fill="none" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 8.5L12 13l9-4.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}

                  <span>{status === "loading" ? "Verifying..." : "Confirm Email"}</span>
                </button>
              )}
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-xs text-gray-400 mb-2">Didn’t receive the email?</p>

              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={resendEmailValue}
                  onChange={(e) => setResendEmailValue(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-md bg-black text-white border border-white/20 text-sm outline-none"
                />

                <button
                  onClick={resendEmail}
                  disabled={resendStatus === "loading"}
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm disabled:opacity-60"
                >
                  {resendStatus === "loading" ? "Sending..." : "Resend"}
                </button>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          This link will expire after a short time for your security.
        </div>
      </div>
    </div>
  );
}
