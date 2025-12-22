"use client";

import Link from "next/link";
import { useState } from "react";
import { IconBrandGoogle, IconEye, IconEyeOff } from '@tabler/icons-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import GoogleButtonLink from "../sharedcomponents/GoogleButton";
import { useUser } from "@/src/contexts/UserContext";

export default function LoginPage() {

  const router = useRouter();
  const { login } = useUser();

  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  interface GoogleIdTokenPayload extends JwtPayload {
    email?: string;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      const idToken = credentialResponse?.credential;
      if (!idToken) throw new Error("Google ID token not received");

      // Decode token if you want to show user info immediately
      const user = jwtDecode<GoogleIdTokenPayload>(idToken);
      console.log("Google user info:", user);

      // Send token to backend for verification and login
      const response = await AuthService.googleAuth(idToken);
      
      console.log("Google auth response:", response);
      
      // Google auth returns: { token: "..." } at root level (different from regular login)
      let token: string | undefined;
      let userId: string | undefined;
      
      // Try root level token first (Google auth structure)
      if (response.token) {
        token = response.token;
        // Decode JWT token to extract user ID from 'sub' field
        try {
          const decodedToken = jwtDecode<{ sub?: string }>(token);
          userId = decodedToken.sub;
          console.log("Decoded user ID from token:", userId);
        } catch (decodeError) {
          console.error("Failed to decode token:", decodeError);
        }
      }
      
      // Fallback to regular login structure (result object)
      if (!token && response.result) {
        token = response.result.token || response.result.accessToken;
        userId = response.result.user?.id || response.result.userId || response.result.id;
      }
      
      // Try data object as fallback
      if (!token && response.data) {
        token = response.data.token;
        userId = response.data.userId || response.data.id;
      }
      
      console.log("Extracted token:", token ? "Present" : "Missing");
      console.log("Extracted userId:", userId || "Missing");
      
      if (!token) {
        console.error("Response structure:", JSON.stringify(response, null, 2));
        throw new Error("Token not received from server. Please check the API response structure.");
      }
      
      if (!userId) {
        console.error("Could not extract user ID. Response structure:", JSON.stringify(response, null, 2));
        throw new Error("User ID not found in token or response. Please check the API response structure.");
      }

      // Login using UserContext
      await login(token, userId);

      // Redirect to home
      router.push("/");
    } catch (err: unknown) {
      console.error("Google login error:", err);
      if (err instanceof Error) {
        alert(err.message);
        console.error("Error details:", err.message);
      } else {
        const errorMessage = typeof err === "string" ? err : "Google login failed. Please check the console for details.";
        alert(errorMessage);
        console.error("Unknown error:", err);
      }
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await AuthService.login({
        userName: form.email,
        password: form.password,
      });

      console.log("Login response:", response);
      
      // Check if response indicates success
      const isSuccess = response.isSuccess !== false && response.success !== false;
      
      if (isSuccess && response.result) {
        // Extract token and userId from the actual API structure
        // Structure: { result: { token: "...", user: { id: "..." } } }
        const token = response.result.token || response.result.accessToken;
        const userId = response.result.user?.id || response.result.userId || response.result.id;
        
        console.log("Extracted token:", token ? "Present" : "Missing");
        console.log("Extracted userId:", userId || "Missing");
        
        if (!token || !userId) {
          console.error("Response structure:", JSON.stringify(response, null, 2));
          throw new Error("Token or user ID not received from server. Please check the API response structure.");
        }

        // Login using UserContext
        await login(token, userId);

        // Redirect to home
        router.push("/");
      } else {
        console.error("Login failed - response:", JSON.stringify(response, null, 2));
        throw new Error(response.message || "Login failed");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
        console.error(err.message);
      } else {
        alert("Something went wrong");
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-28 md:pt-32 relative">
      <div className="liquid-canvas">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <div className="glass-panel p-8 md:p-10 w-full max-w-md relative z-10 mb-7 mt-1">
        <h2 className="text-3xl font-serif text-center mb-10" style={{ textShadow: "0 0 4px rgba(255,255,255,0.6)" }}>Login</h2>

        <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-black/40 border placeholder:text-white/50 border-white/10 rounded-lg p-4 text-sm text-white focus:border-blue-500 outline-none transition focus:bg-black/60"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-black/40 border placeholder:text-white/50 border-white/10 rounded-lg p-4 pr-12 text-sm text-white focus:border-blue-500 outline-none transition focus:bg-black/60"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <IconEyeOff className="mr-1.5 w-5 h-5" />
              ) : (
                <IconEye className="mr-1.5 w-5 h-5" />
              )}
            </button>
          </div>
          
          {/* Remember Me and Forgot Password */}
          <div className="flex items-center mt-6 justify-between">
            <div className="flex items-center space-x-[10px]">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-white/50 ml-2 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <Label
                htmlFor="remember-me"
                className="text-sm text-gray-300 cursor-pointer hover:text-white transition"
              >
                Remember me
              </Label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-400 transition mr-0.5"
              onMouseEnter={(e) =>
                (e.currentTarget.style.textShadow = "0 0 8px rgba(59,130,246,0.6)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textShadow = "none")
              }
            >
              Forgot password<span className="ml-px">?</span>
            </Link>
          </div>

          <button
            type="submit"
            className="hover:active btn-liquid active w-full max-w-70 mt-13.5 mx-auto flex items-center justify-center gap-2 px-5 py-3 text-[13px] font-semibold uppercase tracking-widest 
                       text-gray-300 hover:text-white border-gray-500 rounded-3xl hover:bg-gray-800 transition border-2"
            // onMouseEnter={(e) =>
            //   (e.currentTarget.classList.add("active"))
            // }
            // onMouseLeave={(e) =>
            //   (e.currentTarget.classList.remove("active"))  
            // }
          >
            Sign In
          </button>
        </form>

        <div className="mt-[25px] text-center">
          <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-[25px]">
            Or continue with
          </p>
          {/* <div className="flex justify-center gap-4">
            <a
              href="#"
              className="btn-liquid flex items-center justify-center gap-2 px-3 py-2 text-sm w-full max-w-70
                         font-semibold text-gray-300 hover:text-white border-gray-500 rounded-3xl hover:bg-gray-800 transition border-2"
              onMouseEnter={(e) =>
                (e.currentTarget.classList.add("active"))
              }
              onMouseLeave={(e) =>
                (e.currentTarget.classList.remove("active"))  
              }
            >
              <IconBrandGoogle className="w-5 h-6" />
              Continue with Google
            </a>
          </div> */}
        </div>

        <GoogleButtonLink onSuccess={handleGoogleLogin} />

        <div className="text-center mt-9">
          <span className="text-xs text-gray-400 mr-1">Don’t have an account?</span>
          <Link
            href="/signup"
            className="text-xs text-gray-300 hover:text-white transition"
            onMouseEnter={(e) =>
              (e.currentTarget.style.textShadow = "0 0 8px rgba(255,255,255,0.6)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.textShadow = "none")
            }
          >
            SignUp
          </Link>
        </div>
      </div>
    </div>
  );
}
