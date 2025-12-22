"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { IconBrandGoogle } from "@tabler/icons-react";

interface GoogleButtonProps {
  onSuccess: (credentialResponse: CredentialResponse) => void;
}

export default function GoogleButtonLink({ onSuccess }: GoogleButtonProps) {
  return (
    <div className="flex justify-center">
      {/* Custom wrapper to match your UI */}
      <div
        className="btn-liquid relative flex items-center justify-center gap-2 px-4 py-3 text-sm w-full max-w-72 mx-auto
                   font-semibold text-gray-300 hover:text-white border-gray-500 rounded-3xl
                   hover:bg-gray-800 transition border-2 cursor-pointer"
      >
        {/* Your icon + text */}
        <IconBrandGoogle className="w-5 h-5 z-10 pointer-events-none" />
        <span className="z-10 pointer-events-none">
          Continue with Google
        </span>

        {/* Invisible Google button overlay */}
        <div className="absolute inset-0 opacity-0">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={() => alert("Google login failed")}
            width="280"
          />
        </div>
      </div>
    </div>
  );
}
