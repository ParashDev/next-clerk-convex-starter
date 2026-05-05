"use client";

import { useState, FormEvent } from "react";
import { useSignIn } from "@clerk/nextjs/legacy";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layers, Eye, EyeOff, Loader2, ArrowRight, Shield } from "lucide-react";
import { SocialButtons } from "../_components/SocialButtons";
import { extractClerkError } from "../_components/clerkErrors";

type Phase = "credentials" | "second_factor";
type SecondFactor = "totp" | "backup_code";

export default function SignInPage() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [factor, setFactor] = useState<SecondFactor>("totp");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCredentials = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
        return;
      }
      if (result.status === "needs_second_factor") {
        setPhase("second_factor");
        setCode("");
        return;
      }
      setError(`Unexpected sign-in state: ${result.status ?? "unknown"}.`);
    } catch (err: unknown) {
      setError(extractClerkError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSecondFactor = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const result = await signIn.attemptSecondFactor({
        strategy: factor,
        code,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
        return;
      }
      setError("Verification incomplete.");
    } catch (err: unknown) {
      setError(extractClerkError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-svh flex flex-col">
      <header className="border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight"
          >
            <Layers className="size-4" strokeWidth={2.25} />
            Starter
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-16 bg-neutral-50/60">
        <div className="w-full max-w-sm">
          <div className="rounded-lg border border-neutral-200 bg-white p-8">
            {phase === "credentials" ? (
              <CredentialsStep
                email={email}
                password={password}
                showPassword={showPassword}
                error={error}
                submitting={submitting}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onTogglePassword={() => setShowPassword((s) => !s)}
                onSubmit={handleCredentials}
                onSocialError={setError}
              />
            ) : (
              <SecondFactorStep
                factor={factor}
                code={code}
                error={error}
                submitting={submitting}
                onCodeChange={(v) =>
                  setCode(factor === "totp" ? v.replace(/\D/g, "") : v)
                }
                onFactorChange={(f) => {
                  setFactor(f);
                  setCode("");
                  setError(null);
                }}
                onSubmit={handleSecondFactor}
                onCancel={() => {
                  setPhase("credentials");
                  setError(null);
                  setCode("");
                }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function CredentialsStep({
  email,
  password,
  showPassword,
  error,
  submitting,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
  onSocialError,
}: {
  email: string;
  password: string;
  showPassword: boolean;
  error: string | null;
  submitting: boolean;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: FormEvent) => void;
  onSocialError: (msg: string) => void;
}) {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-neutral-600">Welcome back.</p>
      </div>

      <SocialButtons
        mode="sign-in"
        dividerText="or sign in with email"
        onError={onSocialError}
      />

      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email" id="email">
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Password" id="password">
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className={`${INPUT_CLASS} pr-10`}
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 transition p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </Field>
        {error && <ErrorBanner>{error}</ErrorBanner>}
        <button
          type="submit"
          disabled={submitting || !email || !password}
          className={SUBMIT_CLASS}
        >
          {submitting ? (
            <Loader2 className="size-4 animate-spin" strokeWidth={2.25} />
          ) : (
            <>
              Sign in
              <ArrowRight className="size-4" strokeWidth={2.25} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-neutral-200 text-center text-sm text-neutral-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-neutral-900 font-medium hover:underline underline-offset-4"
        >
          Sign up
        </Link>
      </div>
    </>
  );
}

function SecondFactorStep({
  factor,
  code,
  error,
  submitting,
  onCodeChange,
  onFactorChange,
  onSubmit,
  onCancel,
}: {
  factor: SecondFactor;
  code: string;
  error: string | null;
  submitting: boolean;
  onCodeChange: (v: string) => void;
  onFactorChange: (f: SecondFactor) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}) {
  const isTotp = factor === "totp";
  return (
    <>
      <div className="mb-6">
        <div className="size-10 rounded-md border border-neutral-200 inline-flex items-center justify-center mb-4">
          <Shield className="size-5" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Two-factor verification
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          {isTotp
            ? "Enter the 6-digit code from your authenticator app."
            : "Enter one of your one-time backup codes."}
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label={isTotp ? "Authenticator code" : "Backup code"}
          id="code"
        >
          <input
            id="code"
            type="text"
            inputMode={isTotp ? "numeric" : "text"}
            pattern={isTotp ? "[0-9]*" : undefined}
            autoComplete="one-time-code"
            autoFocus
            maxLength={isTotp ? 6 : undefined}
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder={isTotp ? "------" : "xxxx-xxxx"}
            className={
              isTotp
                ? "w-full rounded-md border border-neutral-200 px-3 py-2.5 text-center text-lg font-mono tracking-[0.4em] text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
                : INPUT_CLASS
            }
          />
        </Field>
        {error && <ErrorBanner>{error}</ErrorBanner>}
        <button
          type="submit"
          disabled={
            submitting || (isTotp ? code.length !== 6 : code.length === 0)
          }
          className={SUBMIT_CLASS}
        >
          {submitting ? (
            <Loader2 className="size-4 animate-spin" strokeWidth={2.25} />
          ) : (
            <>
              Verify
              <ArrowRight className="size-4" strokeWidth={2.25} />
            </>
          )}
        </button>
      </form>
      <div className="mt-6 pt-6 border-t border-neutral-200 flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onCancel}
          className="text-neutral-600 hover:text-neutral-900 transition"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => onFactorChange(isTotp ? "backup_code" : "totp")}
          className="text-neutral-900 font-medium hover:underline underline-offset-4"
        >
          {isTotp ? "Use backup code" : "Use authenticator app"}
        </button>
      </div>
    </>
  );
}

const INPUT_CLASS =
  "w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none transition";

const SUBMIT_CLASS =
  "w-full inline-flex items-center justify-center gap-2 rounded-md bg-neutral-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed";

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1.5"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function ErrorBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {children}
    </div>
  );
}
