"use client";

import { useEffect, useRef } from "react";
import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Completes an OAuth/SSO redirect started by signIn.sso() / signUp.sso().
// Handles every branch Clerk can return on the way back:
//  - clean sign-in        → finalize
//  - clean sign-up        → finalize
//  - account transfer     → existing user signing in via a new provider, or
//                           a new user signing up via a provider
//  - already-signed-in    → activate the existing session
//  - anything unexpected  → bounce back to /sign-in
//
// Based on Clerk's official custom OAuth flow guide.

const DESTINATION = "/dashboard";

export default function SsoCallbackPage() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    void (async () => {
      if (!clerk.loaded || !signIn || !signUp || hasRun.current) return;
      hasRun.current = true;

      const goToSignIn = () => router.push("/sign-in");

      const navigate = ({
        session,
        decorateUrl,
      }: {
        session?: { currentTask?: unknown } | null;
        decorateUrl: (url: string) => string;
      }) => {
        // Let Clerk drive any follow-up session tasks itself.
        if (session?.currentTask) return;
        const url = decorateUrl(DESTINATION);
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      };

      const finalizeSignIn = () => signIn.finalize({ navigate });
      const finalizeSignUp = () => signUp.finalize({ navigate });

      // 1. Clean sign-in completed at the provider.
      if (signIn.status === "complete") {
        await finalizeSignIn();
        return;
      }

      // 2. Provider returned an existing user mid-signup → transfer to sign-in.
      if (signUp.isTransferable) {
        await signIn.create({ transfer: true });
        if ((signIn.status as string) === "complete") {
          await finalizeSignIn();
          return;
        }
        return goToSignIn();
      }

      // 3. Sign-in needs more than SSO can provide here (e.g. password/MFA).
      if (
        signIn.status === "needs_first_factor" &&
        !signIn.supportedFirstFactors?.every(
          (f) => f.strategy === "enterprise_sso",
        )
      ) {
        return goToSignIn();
      }

      // 4. Provider returned a new user mid-signin → transfer to sign-up.
      if (signIn.isTransferable) {
        await signUp.create({ transfer: true });
        if (signUp.status === "complete") {
          await finalizeSignUp();
          return;
        }
        return goToSignIn();
      }

      // 5. Clean sign-up completed at the provider.
      if (signUp.status === "complete") {
        await finalizeSignUp();
        return;
      }

      // 6. Second factor / password reset can't be handled on the callback.
      if (
        signIn.status === "needs_second_factor" ||
        signIn.status === "needs_new_password"
      ) {
        return goToSignIn();
      }

      // 7. The user already had an active session — just activate it.
      const sessionId =
        signIn.existingSession?.sessionId || signUp.existingSession?.sessionId;
      if (sessionId) {
        await clerk.setActive({ session: sessionId, navigate });
        return;
      }

      // Nothing matched — send them back to start over.
      goToSignIn();
    })();
  }, [clerk, signIn, signUp, router]);

  return (
    <div className="min-h-svh flex flex-col items-center justify-center gap-3 px-6 bg-neutral-50/60">
      <Loader2
        className="size-5 animate-spin text-neutral-500"
        strokeWidth={2.25}
      />
      <p className="text-sm text-neutral-600">Finishing sign-in…</p>
      {/* Required for the new-user-signup branch — Clerk's bot CAPTCHA mounts here. */}
      <div id="clerk-captcha" />
    </div>
  );
}
