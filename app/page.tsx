import Link from "next/link";
import { Show } from "@clerk/nextjs";
import {
  Layers,
  GitBranch,
  Lock,
  Package,
  Database,
  Code2,
  ShieldCheck,
  Zap,
  Star,
  ArrowRight,
} from "lucide-react";

const REPO_URL = "https://github.com/ParashDev/next-clerk-convex-starter";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <SiteNav />
      <Hero />
      <StackStrip />
      <Features />
      <QuickStart />
      <SiteFooter />
    </div>
  );
}

function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/80 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <Layers className="size-4" strokeWidth={2.25} />
          Starter
        </Link>
        <div className="flex items-center gap-1">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="size-9 inline-flex items-center justify-center rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition"
            aria-label="View on GitHub"
          >
            <GitBranch className="size-4" strokeWidth={2.25} />
          </a>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-900 transition"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="ml-1 inline-flex items-center gap-1.5 rounded-md bg-neutral-900 text-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-800 transition"
            >
              Get started
            </Link>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="ml-1 inline-flex items-center gap-1.5 rounded-md bg-neutral-900 text-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-800 transition"
            >
              Dashboard
              <ArrowRight className="size-3.5" strokeWidth={2.25} />
            </Link>
          </Show>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-32 text-center">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1 text-xs font-mono text-neutral-600 mb-8">
        <Star className="size-3" strokeWidth={2.25} />
        Open source · MIT License
      </div>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] max-w-4xl mx-auto">
        The Next.js starter that&apos;s actually wired up.
      </h1>
      <p className="mt-6 text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
        Auth, real-time database, and end-to-end types — production-ready out
        of the box. Drop in your env vars and ship.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Show when="signed-out">
          <Link
            href="/sign-up"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-neutral-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-neutral-800 transition"
          >
            Get started
            <ArrowRight className="size-4" strokeWidth={2.25} />
          </Link>
        </Show>
        <Show when="signed-in">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-neutral-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-neutral-800 transition"
          >
            Open dashboard
            <ArrowRight className="size-4" strokeWidth={2.25} />
          </Link>
        </Show>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 px-5 py-2.5 text-sm font-medium hover:bg-neutral-50 transition"
        >
          <GitBranch className="size-4" strokeWidth={2.25} />
          Star on GitHub
        </a>
      </div>
    </section>
  );
}

const STACK = [
  { name: "Next.js", version: "16" },
  { name: "TypeScript", version: "5" },
  { name: "Tailwind", version: "4" },
  { name: "Clerk", version: "7" },
  { name: "Convex", version: "1.37" },
];

function StackStrip() {
  return (
    <section className="border-t border-neutral-200">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="text-center text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 mb-8">
          Built with
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-neutral-200 border border-neutral-200 rounded-lg overflow-hidden">
          {STACK.map((s) => (
            <div
              key={s.name}
              className="bg-white px-4 py-6 text-center"
            >
              <div className="text-sm font-semibold tracking-tight">
                {s.name}
              </div>
              <div className="mt-1 text-xs font-mono text-neutral-500">
                v{s.version}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: Lock,
    title: "Authentication built in",
    desc: "Clerk-powered sign-in, sign-up, sessions, social logins, and MFA. Drop-in UI with full customization.",
  },
  {
    icon: Database,
    title: "Real-time database",
    desc: "Convex queries auto-subscribe. Mutate from one tab, watch the UI update everywhere — no websockets to wire.",
  },
  {
    icon: Code2,
    title: "End-to-end types",
    desc: "TypeScript from your Convex schema through the API to your React components. Generated, not hand-written.",
  },
  {
    icon: ShieldCheck,
    title: "Protected routes",
    desc: "clerkMiddleware gates routes at the edge before they render. Convex verifies the same JWT server-side.",
  },
  {
    icon: Zap,
    title: "Instant setup",
    desc: "Clone the repo, paste two API keys, run two commands. Working auth, database, and UI on first boot.",
  },
  {
    icon: Package,
    title: "Open source",
    desc: "MIT licensed. Fork it, rip out what you don't need, make it yours. No fees, no vendor lock-in.",
  },
];

function Features() {
  return (
    <section className="border-t border-neutral-200">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-2xl mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="mt-4 text-neutral-600 leading-relaxed">
            The boring parts of a new project — already done. Spend day one
            building features, not wiring up infrastructure.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200 rounded-lg overflow-hidden">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white p-6">
              <div className="size-10 rounded-md border border-neutral-200 inline-flex items-center justify-center mb-4">
                <f.icon className="size-5" strokeWidth={2} />
              </div>
              <h3 className="font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickStart() {
  const code = `# 1. Clone and install
git clone ${REPO_URL}
cd starter-template && npm install

# 2. Wire up Clerk + Convex
cp .env.local.example .env.local
# • Activate Clerk's "Convex" JWT template, paste keys into .env.local
# • Set CLERK_JWT_ISSUER_DOMAIN on the Convex dashboard
# (Full click-by-click walkthrough in the README)

# 3. Run
npx convex dev   # terminal 1 — backend sync + type generation
npm run dev      # terminal 2 — Next.js`;

  return (
    <section className="border-t border-neutral-200 bg-neutral-50/60">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Three steps to running.
          </h2>
          <p className="mt-4 text-neutral-600 leading-relaxed">
            No config to hand-edit. No setup wizards. Clone, wire up Clerk and
            Convex, run.
          </p>
        </div>
        <pre className="rounded-lg border border-neutral-200 bg-white p-6 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed">
          <code>{code}</code>
        </pre>
        <p className="mt-4 text-sm text-neutral-500">
          Full walkthrough in the{" "}
          <a
            className="underline underline-offset-4 hover:text-neutral-900"
            href={`${REPO_URL}#readme`}
          >
            README
          </a>
          .
        </p>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-neutral-200">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Layers className="size-4" strokeWidth={2.25} />
          <span>Starter — MIT licensed.</span>
        </div>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition"
        >
          <GitBranch className="size-4" strokeWidth={2.25} />
          {REPO_URL.replace("https://", "")}
        </a>
      </div>
    </footer>
  );
}
