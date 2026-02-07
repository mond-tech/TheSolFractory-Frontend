"use client";

import Link from "next/link";
import { useState } from "react";
import { IconEye, IconEyeOff, IconAlertCircle } from '@tabler/icons-react';
import { Checkbox } from "@/components/ui/checkbox";
import { AuthService } from "@/services/auth.service";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import type { CredentialResponse } from "@react-oauth/google";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import GoogleButtonLink from "../sharedcomponents/GoogleButton";
import { useUser } from "@/src/contexts/UserContext";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useUser();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  interface GoogleIdTokenPayload extends JwtPayload {
    email?: string;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
  }

  // Helper to parse the JSON error string you're getting from the backend
  const formatErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
      if (err.message.includes('{"') || err.message.includes("isSuccess")) {
        try {
          const parsed = JSON.parse(err.message.replace("Error: ", ""));
          return parsed.message || "Registration failed";
        } catch {
          return err.message;
        }
      }
      return err.message;
    }
    return "Something went wrong. Please try again.";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validation: Check for empty fields
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    const hasEmptyFields = requiredFields.some(field => !form[field as keyof typeof form].trim());
    
    if (hasEmptyFields) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!agreeTerms) {
      setError("Please accept the terms & conditions to continue.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await AuthService.register({
        email: form.email,
        name: `${form.firstName} ${form.lastName}`,
        phoneNumber: "",
        password: form.password,
        role: "User",
      });

      if (response.isSuccess) {
        router.push(`/verify-email-pending?email=${encodeURIComponent(form.email)}`);
        return;
      }

      setError(response.message || "Registration failed");
    } catch (err) {
      setError(formatErrorMessage(err));
      console.error(err);
    }
  };

  const handleGoogleSignup = async (credentialResponse: CredentialResponse) => {
    try {
      setError(null);
      const idToken = credentialResponse?.credential;
      if (!idToken) throw new Error("Google ID token not received");

      const response = await AuthService.googleAuth(idToken);
      
      let token: string | undefined;
      let userId: string | undefined;
      
      if (response.token) {
        token = response.token;
        try {
          const decodedToken = jwtDecode<{ sub?: string }>(token);
          userId = decodedToken.sub;
        } catch (decodeError) {
          console.error("Failed to decode token:", decodeError);
        }
      }
      
      if (!token && response.result) {
        token = response.result.token || response.result.accessToken;
        userId = response.result.user?.id || response.result.userId || response.result.id;
      }
      
      if (!token || !userId) {
        throw new Error("Could not retrieve user session from Google login.");
      }

      await login(token, userId);
      router.push("/");
    } catch (err: unknown) {
      setError(formatErrorMessage(err));
      console.error("Google signup error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-30 md:pt-30 relative">
      <div className="liquid-canvas">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <div className="glass-panel w-full max-w-lg p-6 sm:p-8 md:p-10 relative z-10 mb-13">
        <h2
          className="text-3xl font-serif text-center mb-9 mt-2 w-full max-w-112.5 mx-auto"
          style={{ textShadow: "0 0 2px rgba(255,255,255,0.6)" }}
        >
          Sign Up to <span className="text-blue-400">SOL Factory</span>
        </h2>

        {/* Error Message Box */}
        {error && (
          <div className="mb-6 flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm backdrop-blur-md animate-in fade-in slide-in-from-top-1">
            <IconAlertCircle size={18} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className={`bg-black/40 border ${error && !form.firstName ? 'border-red-500/50' : 'border-white/10'} placeholder:text-white/50 rounded-lg p-4 text-sm text-white outline-none focus:border-blue-500 transition`}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className={`bg-black/40 border ${error && !form.lastName ? 'border-red-500/50' : 'border-white/10'} placeholder:text-white/50 rounded-lg p-4 text-sm text-white outline-none focus:border-blue-500 transition`}
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={`w-full bg-black/40 border ${error && !form.email ? 'border-red-500/50' : 'border-white/10'} placeholder:text-white/50 rounded-lg p-4 text-sm text-white outline-none focus:border-blue-500 transition`}
          />

          <input
            type="text"
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            className="w-full bg-black/40 border border-white/10 placeholder:text-white/50 rounded-lg p-4 text-sm text-white outline-none focus:border-blue-500 transition"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={`w-full bg-black/40 border ${error && !form.password ? 'border-red-500/50' : 'border-white/10'} placeholder:text-white/50 rounded-lg p-4 pr-12 text-sm text-white focus:border-blue-500 outline-none transition focus:bg-black/60`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
              >
                {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`w-full bg-black/40 border ${error && !form.confirmPassword ? 'border-red-500/50' : 'border-white/10'} placeholder:text-white/50 rounded-lg p-4 pr-12 text-sm text-white focus:border-blue-500 outline-none transition focus:bg-black/60`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
              >
                {showConfirmPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center md:gap-3 gap-2 pt-2">
            <Checkbox
              id="terms"
              checked={agreeTerms}
              onCheckedChange={(checked) => {
                setError(null);
                setAgreeTerms(checked === true);
              }}
              className="border-white/20 ml-3 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
            <Label htmlFor="terms" className="text-[10px] md:text-sm text-gray-300 leading-relaxed cursor-pointer">
              I agree to the{" "}
              <Link href="/" className="text-blue-400 hover:underline">Terms & Conditions</Link>{" "}
              and{" "}
              <Link href="/" className="text-blue-400 hover:underline">Privacy Policy</Link>
            </Label>
          </div>

          <button
            type="submit"
            className="btn-liquid active w-full max-w-70 mt-13.5 mx-auto flex items-center justify-center gap-2 px-5 py-3 text-[13px] font-semibold uppercase tracking-widest text-gray-300 hover:text-white border-gray-500 rounded-3xl hover:bg-gray-800 transition border-2"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6">
          <p className="text-[11px] text-center uppercase tracking-widest text-gray-400 mb-5">
            Or continue with
          </p>
          <GoogleButtonLink onSuccess={handleGoogleSignup} />
        </div>

        <div className="text-center mt-6">
          <span className="text-xs text-gray-400 mr-1">Already have an account?</span>
          <Link href="/login" className="text-xs text-gray-300 hover:text-white transition">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}