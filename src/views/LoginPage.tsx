"use client";

import Link from "next/link";
import { useState } from "react";
import { IconEye, IconEyeOff, IconAlertCircle } from '@tabler/icons-react'; // Added IconAlertCircle
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { CredentialResponse } from "@react-oauth/google";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import GoogleButtonLink from "../sharedcomponents/GoogleButton";
import { useUser } from "@/src/contexts/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();

  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  interface GoogleIdTokenPayload extends JwtPayload {
    email?: string;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear error when user starts typing again
    if (error) setError(null);
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      setError(null); // Reset error
      const idToken = credentialResponse?.credential;
      if (!idToken) throw new Error("Google ID token not received");

      const user = jwtDecode<GoogleIdTokenPayload>(idToken);
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
      
      if (!token && response.data) {
        token = response.data.token;
        userId = response.data.userId || response.data.id;
      }
      
      if (!token || !userId) {
        throw new Error("Login failed: Invalid server response structure.");
      }

      await login(token, userId);
      router.push("/");
    } catch (err: unknown) {
      console.error("Google login error:", err);
      setError(err instanceof Error ? err.message : "Google login failed.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // --- Validation Check ---
    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter both your email and password.");
      return;
    }

    try {
      const response = await AuthService.login({
        userName: form.email,
        password: form.password,
      });

      const isSuccess = response.isSuccess !== false && response.success !== false;
      
      if (response.isSuccess && response.result) {
        const token = response.result?.token || response.result?.accessToken;
        const userId = response.result?.user?.id || response.result?.userId || response.result?.id;
        
        if (!token || !userId) {
          throw new Error("Token or user ID missing from server.");
        }

        await login(token, userId);
        router.push("/");
      } else {
        throw new Error(response.message || "Invalid credentials. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Login error raw:", err);

      let displayMessage = "Something went wrong. Please try again.";

      if (err instanceof Error) {
        if (err.message.includes('{"') || err.message.includes("isSuccess")) {
          try {
            const parsed = JSON.parse(err.message.replace("Error: ", ""));
            displayMessage = parsed.message || "Login failed";
          } catch (e) {
            displayMessage = err.message;
          }
        } else {
          displayMessage = err.message;
        }
      }

      setError(displayMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-30 md:pt-30 relative">
      <div className="liquid-canvas">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <div className="glass-panel p-8 md:p-10 w-full max-w-md relative z-10 mb-7">
        <h2 className="text-3xl font-serif text-center mb-10 mt-3" style={{ textShadow: "0 0 4px rgba(255,255,255,0.6)" }}>Login</h2>

        {/* --- Error Message Display --- */}
        {error && (
          <div className="mb-6 flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in fade-in slide-in-from-top-1">
            <IconAlertCircle size={18} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={`w-full bg-black/40 border placeholder:text-white/50 border-white/10 rounded-lg p-4 text-sm text-white focus:border-blue-500 outline-none transition focus:bg-black/60 ${error && !form.email ? 'border-red-500/50' : ''}`}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`w-full bg-black/40 border placeholder:text-white/50 border-white/10 rounded-lg p-4 pr-12 text-sm text-white focus:border-blue-500 outline-none transition focus:bg-black/60 ${error && !form.password ? 'border-red-500/50' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          </div>
          
          <div className="flex items-center mt-6 justify-between">
            <div className="flex items-center space-x-[10px]">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-white/50 ml-2 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <Label htmlFor="remember-me" className="text-sm text-gray-300 cursor-pointer hover:text-white transition">
                Remember me
              </Label>
            </div>
            <Link href="/" className="text-sm text-blue-400 transition mr-0.5">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="hover:active btn-liquid active w-full max-w-70 mt-13.5 mx-auto flex items-center justify-center gap-2 px-5 py-3 text-[13px] font-semibold uppercase tracking-widest 
                       text-gray-300 hover:text-white border-gray-500 rounded-3xl hover:bg-gray-800 transition border-2"
          >
            Sign In
          </button>
        </form>

        <div className="mt-[25px] text-center">
          <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-[25px]">
            Or continue with
          </p>
        </div>

        <GoogleButtonLink onSuccess={handleGoogleLogin} />

        <div className="text-center mt-9">
          <span className="text-xs text-gray-400 mr-1">Don’t have an account?</span>
          <Link href="/signup" className="text-xs text-gray-300 hover:text-white transition">
            SignUp
          </Link>
        </div>
      </div>
    </div>
  );
}