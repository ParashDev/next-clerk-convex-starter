"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SsoCallbackPage() {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center gap-3 px-6 bg-neutral-50/60">
      <Loader2
        className="size-5 animate-spin text-neutral-500"
        strokeWidth={2.25}
      />
      <p className="text-sm text-neutral-600">Finishing sign-in…</p>
      {/* Required by Clerk's bot-protection — Smart CAPTCHA mounts here
          invisibly when the OAuth flow ends in a new user signup. */}
      <div id="clerk-captcha" />
      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl="/dashboard"
        signUpForceRedirectUrl="/dashboard"
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}
