"use client";

import { useState, ReactNode } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs/legacy";
import { useClerk } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { extractClerkError } from "./clerkErrors";

// Strategy strings come from Clerk. Add the matching entry to PROVIDERS below
// when you enable a new provider in Clerk dashboard → Social Connections,
// and the button will appear automatically once Clerk finishes loading.
type OAuthStrategy =
  | "oauth_google"
  | "oauth_github"
  | "oauth_apple"
  | "oauth_microsoft"
  | "oauth_discord"
  | "oauth_facebook";

type Provider = {
  name: string;
  strategy: OAuthStrategy;
  icon: ReactNode;
};

const PROVIDERS: ReadonlyArray<Provider> = [
  { name: "Google", strategy: "oauth_google", icon: <GoogleIcon /> },
  { name: "GitHub", strategy: "oauth_github", icon: <GitHubIcon /> },
];

export function SocialButtons({
  mode,
  dividerText,
  onError,
}: {
  mode: "sign-in" | "sign-up";
  dividerText: string;
  onError: (msg: string) => void;
}) {
  const clerk = useClerk();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const [loading, setLoading] = useState<OAuthStrategy | null>(null);

  // Filter PROVIDERS to only those actually enabled in this Clerk app.
  // The environment lives at `clerk.__internal_environment` in Clerk v7
  // (the underscore prefix marks it as a private surface — fine for a
  // read-only check, but expect it to move in future major versions).
  const env = (
    clerk as unknown as {
      __internal_environment?: {
        userSettings?: {
          authenticatableSocialStrategies?: ReadonlyArray<string>;
        };
      };
    }
  ).__internal_environment;

  // While Clerk is still loading, render nothing — avoids a flash of buttons
  // that get hidden a tick later.
  if (!clerk.loaded) return null;
  const enabled = env?.userSettings?.authenticatableSocialStrategies ?? [];

const visible = PROVIDERS.filter((p) => enabled.includes(p.strategy));
  if (visible.length === 0) return null;

  const isLoaded = mode === "sign-in" ? signInLoaded : signUpLoaded;
  const auth = mode === "sign-in" ? signIn : signUp;

  const handleClick = async (strategy: OAuthStrategy) => {
    if (!isLoaded || !auth || loading) return;
    setLoading(strategy);
    try {
      await auth.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: unknown) {
      onError(extractClerkError(err));
      setLoading(null);
    }
    // No `finally` reset — the success path navigates away.
  };

  return (
    <>
      <div className="space-y-2">
        {visible.map((p) => (
          <button
            key={p.strategy}
            type="button"
            disabled={!isLoaded || loading !== null}
            onClick={() => handleClick(p.strategy)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === p.strategy ? (
              <Loader2 className="size-4 animate-spin" strokeWidth={2.25} />
            ) : (
              <>
                {p.icon}
                <span>Continue with {p.name}</span>
              </>
            )}
          </button>
        ))}
      </div>
      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-neutral-200" />
        <span className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-medium">
          {dividerText}
        </span>
        <span className="h-px flex-1 bg-neutral-200" />
      </div>
    </>
  );
}

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.13c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.27-5.24-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.17.91-.25 1.89-.38 2.86-.38s1.95.13 2.86.38c2.19-1.48 3.15-1.17 3.15-1.17.62 1.57.23 2.73.11 3.02.74.8 1.18 1.82 1.18 3.07 0 4.39-2.69 5.36-5.25 5.64.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.79.55C20.71 21.39 24 17.08 24 12 24 5.65 18.85.5 12 .5z" />
    </svg>
  );
}
