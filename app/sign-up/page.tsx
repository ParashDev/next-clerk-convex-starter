"use client";

import { useState, FormEvent } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Layers,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Mail,
} from "lucide-react";
import { SocialButtons } from "../_components/SocialButtons";

export default function SignUpPage() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [bannerError, setBannerError] = useState<string | null>(null);

  const submitting = fetchStatus === "fetching";

  // Verification phase is derived from Clerk's signUp state — when the only
  // outstanding requirement is verifying the email address, we're in step 2.
  const inVerifyPhase =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  const finishAndRedirect = async () => {
    await signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) return;
        const url = decorateUrl("/dashboard");
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      },
    });
  };

  const handleStart = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setBannerError(null);

    const { error } = await signUp.password({
      emailAddress: email,
      password,
    });

    if (error) {
      setBannerError(error.message ?? "Could not create account.");
      return;
    }

    await signUp.verifications.sendEmailCode();
    setCode("");
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setBannerError(null);

    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await finishAndRedirect();
      return;
    }

    setBannerError("Invalid code or verification incomplete.");
  };

  const handleResend = async () => {
    if (submitting) return;
    setBannerError(null);
    await signUp.verifications.sendEmailCode();
  };

  const handleSocialError = (msg: string) => setBannerError(msg);

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
            {!inVerifyPhase ? (
              <CollectStep
                email={email}
                password={password}
                showPassword={showPassword}
                bannerError={bannerError}
                fieldErrors={{
                  email: errors.fields.emailAddress?.message,
                  password: errors.fields.password?.message,
                }}
                submitting={submitting}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onTogglePassword={() => setShowPassword((s) => !s)}
                onSubmit={handleStart}
                onSocialError={handleSocialError}
              />
            ) : (
              <VerifyStep
                email={email}
                code={code}
                bannerError={bannerError}
                fieldError={errors.fields.code?.message}
                submitting={submitting}
                onCodeChange={(v) => setCode(v.replace(/\D/g, ""))}
                onSubmit={handleVerify}
                onResend={handleResend}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function CollectStep({
  email,
  password,
  showPassword,
  bannerError,
  fieldErrors,
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
  bannerError: string | null;
  fieldErrors: { email?: string; password?: string };
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
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-neutral-600">Get started in seconds.</p>
      </div>

      <SocialButtons
        mode="sign-up"
        dividerText="or sign up with email"
        onError={onSocialError}
      />

      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email" id="email" error={fieldErrors.email}>
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
        <Field label="Password" id="password" error={fieldErrors.password}>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
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
          <p className="mt-1.5 text-xs text-neutral-500">
            At least 8 characters.
          </p>
        </Field>
        {/* Required by Clerk's bot-protection — Smart CAPTCHA mounts here. */}
        <div id="clerk-captcha" />
        {bannerError && <ErrorBanner>{bannerError}</ErrorBanner>}
        <button
          type="submit"
          disabled={submitting || !email || !password}
          className={SUBMIT_CLASS}
        >
          {submitting ? (
            <Loader2 className="size-4 animate-spin" strokeWidth={2.25} />
          ) : (
            <>
              Continue
              <ArrowRight className="size-4" strokeWidth={2.25} />
            </>
          )}
        </button>
      </form>
      <div className="mt-6 pt-6 border-t border-neutral-200 text-center text-sm text-neutral-600">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-neutral-900 font-medium hover:underline underline-offset-4"
        >
          Sign in
        </Link>
      </div>
    </>
  );
}

function VerifyStep({
  email,
  code,
  bannerError,
  fieldError,
  submitting,
  onCodeChange,
  onSubmit,
  onResend,
}: {
  email: string;
  code: string;
  bannerError: string | null;
  fieldError?: string;
  submitting: boolean;
  onCodeChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  onResend: () => void;
}) {
  return (
    <>
      <div className="mb-6">
        <div className="size-10 rounded-md border border-neutral-200 inline-flex items-center justify-center mb-4">
          <Mail className="size-5" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Check your email
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          We sent a 6-digit code to{" "}
          <span className="text-neutral-900 font-medium">{email}</span>.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Verification code" id="code" error={fieldError}>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            autoFocus
            maxLength={6}
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder="------"
            className="w-full rounded-md border border-neutral-200 px-3 py-2.5 text-center text-lg font-mono tracking-[0.4em] text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
          />
        </Field>
        {bannerError && <ErrorBanner>{bannerError}</ErrorBanner>}
        <button
          type="submit"
          disabled={submitting || code.length !== 6}
          className={SUBMIT_CLASS}
        >
          {submitting ? (
            <Loader2 className="size-4 animate-spin" strokeWidth={2.25} />
          ) : (
            <>
              Verify and continue
              <ArrowRight className="size-4" strokeWidth={2.25} />
            </>
          )}
        </button>
      </form>
      <div className="mt-6 pt-6 border-t border-neutral-200 flex items-center justify-end text-sm">
        <button
          type="button"
          onClick={onResend}
          className="text-neutral-900 font-medium hover:underline underline-offset-4"
        >
          Resend code
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
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
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
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
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
