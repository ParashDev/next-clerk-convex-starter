"use client";

import { useState, FormEvent } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layers, Eye, EyeOff, Loader2, ArrowRight, Mail, Shield } from "lucide-react";
import { SocialButtons } from "../_components/SocialButtons";

// The strategy we're currently asking the user to verify with.
//  - email_code / phone_code: a code was SENT (resend available)
//  - totp:        read from the user's authenticator app
//  - backup_code: one of the user's saved one-time codes
type VerifyStrategy = "email_code" | "phone_code" | "totp" | "backup_code";

export default function SignInPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [phase, setPhase] = useState<"credentials" | "verify">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [strategy, setStrategy] = useState<VerifyStrategy>("email_code");
  // For enrolled MFA we may offer a fallback toggle (authenticator <-> backup code).
  const [canUseBackupCode, setCanUseBackupCode] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);

  const submitting = fetchStatus === "fetching";

  const finishAndRedirect = async () => {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        // If Clerk has follow-up session tasks (org selection, forced MFA
        // enrollment, etc.) it drives them itself when we return early.
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

  const handleCredentials = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setBannerError(null);

    const { error } = await signIn.password({ emailAddress: email, password });
    if (error) {
      setBannerError(error.message ?? "Could not sign in.");
      return;
    }

    if (signIn.status === "complete") {
      await finishAndRedirect();
      return;
    }

    // User has MFA enrolled — pick the strongest available factor.
    if (signIn.status === "needs_second_factor") {
      const factors = signIn.supportedSecondFactors ?? [];
      const hasTotp = factors.some((f) => f.strategy === "totp");
      const hasPhone = factors.some((f) => f.strategy === "phone_code");
      const hasBackup = factors.some((f) => f.strategy === "backup_code");

      setCanUseBackupCode(hasBackup);

      if (hasTotp) {
        setStrategy("totp");
      } else if (hasPhone) {
        setStrategy("phone_code");
        await signIn.mfa.sendPhoneCode();
      } else if (hasBackup) {
        setStrategy("backup_code");
      } else {
        setBannerError("No supported second factor is available on this account.");
        return;
      }
      setPhase("verify");
      setCode("");
      return;
    }

    // Client Trust: new device challenge for an account without enrolled MFA.
    // Clerk falls back to an emailed one-time code.
    if (signIn.status === "needs_client_trust") {
      const emailFactor = (signIn.supportedSecondFactors ?? []).find(
        (f) => f.strategy === "email_code",
      );
      if (emailFactor) {
        setStrategy("email_code");
        setCanUseBackupCode(false);
        await signIn.mfa.sendEmailCode();
        setPhase("verify");
        setCode("");
        return;
      }
      setBannerError("This device needs verification, but no email code is configured.");
      return;
    }

    if (signIn.status === "needs_new_password") {
      setBannerError("Your password must be reset before signing in. Use ‘Forgot password’.");
      return;
    }

    setBannerError(`Sign-in not complete: ${signIn.status ?? "unknown"}.`);
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setBannerError(null);

    let result: { error: { message?: string } | null };
    switch (strategy) {
      case "email_code":
        result = await signIn.mfa.verifyEmailCode({ code });
        break;
      case "phone_code":
        result = await signIn.mfa.verifyPhoneCode({ code });
        break;
      case "totp":
        result = await signIn.mfa.verifyTOTP({ code });
        break;
      case "backup_code":
        result = await signIn.mfa.verifyBackupCode({ code });
        break;
    }

    if (result.error) {
      setBannerError(result.error.message ?? "Invalid code.");
      return;
    }

    if (signIn.status === "complete") {
      await finishAndRedirect();
      return;
    }
    setBannerError("Verification incomplete. Please try again.");
  };

  const handleResend = async () => {
    if (submitting) return;
    setBannerError(null);
    if (strategy === "email_code") await signIn.mfa.sendEmailCode();
    else if (strategy === "phone_code") await signIn.mfa.sendPhoneCode();
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
            {phase === "credentials" ? (
              <CredentialsStep
                email={email}
                password={password}
                showPassword={showPassword}
                bannerError={bannerError}
                fieldErrors={{
                  identifier: errors.fields.identifier?.message,
                  password: errors.fields.password?.message,
                }}
                submitting={submitting}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onTogglePassword={() => setShowPassword((s) => !s)}
                onSubmit={handleCredentials}
                onSocialError={handleSocialError}
              />
            ) : (
              <VerifyStep
                strategy={strategy}
                email={email}
                code={code}
                canUseBackupCode={canUseBackupCode}
                bannerError={bannerError}
                fieldError={errors.fields.code?.message}
                submitting={submitting}
                onCodeChange={(v) =>
                  setCode(strategy === "backup_code" ? v : v.replace(/\D/g, ""))
                }
                onToggleBackup={() => {
                  setStrategy((s) => (s === "totp" ? "backup_code" : "totp"));
                  setCode("");
                  setBannerError(null);
                }}
                onSubmit={handleVerify}
                onResend={handleResend}
                onCancel={() => {
                  setPhase("credentials");
                  setBannerError(null);
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
  fieldErrors: { identifier?: string; password?: string };
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
        <Field label="Email" id="email" error={fieldErrors.identifier}>
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
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </Field>
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

function VerifyStep({
  strategy,
  email,
  code,
  canUseBackupCode,
  bannerError,
  fieldError,
  submitting,
  onCodeChange,
  onToggleBackup,
  onSubmit,
  onResend,
  onCancel,
}: {
  strategy: VerifyStrategy;
  email: string;
  code: string;
  canUseBackupCode: boolean;
  bannerError: string | null;
  fieldError?: string;
  submitting: boolean;
  onCodeChange: (v: string) => void;
  onToggleBackup: () => void;
  onSubmit: (e: FormEvent) => void;
  onResend: () => void;
  onCancel: () => void;
}) {
  const isCodeSent = strategy === "email_code" || strategy === "phone_code";
  const isBackup = strategy === "backup_code";
  const isAuthenticatorFlow = strategy === "totp" || strategy === "backup_code";

  const copy = {
    email_code: {
      title: "Verify it's you",
      subtitle: (
        <>
          We sent a code to{" "}
          <span className="text-neutral-900 font-medium">{email}</span>.
        </>
      ),
    },
    phone_code: {
      title: "Verify it's you",
      subtitle: <>We sent a code to your phone.</>,
    },
    totp: {
      title: "Two-factor authentication",
      subtitle: <>Enter the 6-digit code from your authenticator app.</>,
    },
    backup_code: {
      title: "Two-factor authentication",
      subtitle: <>Enter one of your saved backup codes.</>,
    },
  }[strategy];

  return (
    <>
      <div className="mb-6">
        <div className="size-10 rounded-md border border-neutral-200 inline-flex items-center justify-center mb-4">
          {isAuthenticatorFlow ? (
            <Shield className="size-5" strokeWidth={2} />
          ) : (
            <Mail className="size-5" strokeWidth={2} />
          )}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="mt-1 text-sm text-neutral-600">{copy.subtitle}</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label={isBackup ? "Backup code" : "Verification code"}
          id="code"
          error={fieldError}
        >
          <input
            id="code"
            type="text"
            inputMode={isBackup ? "text" : "numeric"}
            pattern={isBackup ? undefined : "[0-9]*"}
            autoComplete="one-time-code"
            autoFocus
            maxLength={isBackup ? undefined : 6}
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder={isBackup ? "xxxxxxxx" : "------"}
            className={
              isBackup
                ? INPUT_CLASS
                : "w-full rounded-md border border-neutral-200 px-3 py-2.5 text-center text-lg font-mono tracking-[0.4em] text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            }
          />
        </Field>
        {bannerError && <ErrorBanner>{bannerError}</ErrorBanner>}
        <button
          type="submit"
          disabled={submitting || (isBackup ? code.length === 0 : code.length !== 6)}
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
        {isCodeSent && (
          <button
            type="button"
            onClick={onResend}
            className="text-neutral-900 font-medium hover:underline underline-offset-4"
          >
            Resend code
          </button>
        )}
        {isAuthenticatorFlow && canUseBackupCode && (
          <button
            type="button"
            onClick={onToggleBackup}
            className="text-neutral-900 font-medium hover:underline underline-offset-4"
          >
            {isBackup ? "Use authenticator app" : "Use a backup code"}
          </button>
        )}
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
