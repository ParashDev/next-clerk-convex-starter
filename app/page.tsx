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
  Terminal,
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

type Step = {
  title: string;
  lead?: React.ReactNode;
  points?: React.ReactNode[];
  code?: string;
  note?: React.ReactNode;
};

const SETUP_STEPS: Step[] = [
  {
    title: "Clone and install",
    lead: (
      <>
        Requires Node.js 20.19+ (check with <Code>node -v</Code>).
      </>
    ),
    code: `git clone ${REPO_URL} my-app
cd my-app
npm install`,
    note: (
      <>
        <span className="block font-medium text-neutral-900">
          Don&apos;t want a <Code>my-app</Code> subfolder?
        </span>
        <span className="mt-1 block">
          Clone into the folder you&apos;re already in — add a trailing dot:
        </span>
        <span className="mt-2.5 block font-mono text-[13px] text-neutral-800">
          git clone {REPO_URL} .
        </span>
      </>
    ),
  },
  {
    title: "Create your env file",
    code: `cp .env.local.example .env.local`,
    lead: (
      <>
        This creates your local config file. You&apos;ll fill it in over the next
        two steps — Convex first, then Clerk.
      </>
    ),
  },
  {
    title: "Create a Convex project",
    lead: (
      <>
        On the web first — this is your backend + database.
      </>
    ),
    points: [
      <>
        Go to <Ext href="https://convex.dev">convex.dev</Ext> and create an
        account.
      </>,
      <>
        Click <strong>New project</strong>, give it a name, and pick a region.
        Create it.
      </>,
    ],
  },
  {
    title: "Connect the CLI (terminal 1)",
    code: `npx convex dev`,
    lead: (
      <>
        Run this in a terminal at the project folder and{" "}
        <strong>keep it open</strong> — it runs continuously and watches for
        changes.
      </>
    ),
    points: [
      <>
        It asks you to sign in. A browser window opens showing a{" "}
        <strong>code</strong> — check it matches the code in your terminal, then
        confirm in the browser. That logs the CLI in as the account active in
        that browser.
      </>,
      <>
        When it asks <strong>local</strong> or <strong>cloud</strong>, choose{" "}
        <strong>cloud</strong>.
      </>,
      <>
        It lists your Convex projects — pick the one you just created.
      </>,
      <>
        It auto-fills <Code>NEXT_PUBLIC_CONVEX_URL</Code> and{" "}
        <Code>CONVEX_DEPLOYMENT</Code> in your <Code>.env.local</Code>, then
        syncs your backend.
      </>,
      <>
        It then prints a <Code>CLERK_JWT_ISSUER_DOMAIN … not set</Code> error and
        waits. That&apos;s expected — you fix it in step 6.
      </>,
    ],
    note: (
      <>
        <span className="block font-medium text-neutral-900">
          Logged in as the wrong account?
        </span>
        <span className="mt-1 block">
          The browser account is the one that gets used. Log out, then re-run and
          confirm in a browser signed into the right Convex account:
        </span>
        <span className="mt-2.5 block font-mono text-[13px] text-neutral-800">
          npx convex logout
          <br />
          npx convex dev --configure
        </span>
      </>
    ),
  },
  {
    title: "Set up Clerk and paste your keys",
    lead: (
      <>
        Now the auth side. Everything here happens in the{" "}
        <Ext href="https://dashboard.clerk.com">Clerk dashboard</Ext>.
      </>
    ),
    points: [
      <>
        Sign up at <Ext href="https://clerk.com">clerk.com</Ext> → click{" "}
        <strong>Create application</strong>.
      </>,
      <>
        Enable <strong>Email</strong> and <strong>Password</strong> sign-in.
      </>,
      <>
        Go to <strong>Configure → API Keys</strong>, and under{" "}
        <strong>Quick Copy</strong> pick the <strong>Next.js</strong> tab.
      </>,
      <>
        Copy that snippet and paste it into your <Code>.env.local</Code> — it
        fills in both <Code>pk_test_…</Code> and <Code>sk_test_…</Code> keys.
      </>,
      <>
        Still in Clerk: open <strong>Configure → Sessions → JWT Templates</strong>{" "}
        (or search <strong>JWT Templates</strong>) → <strong>New template</strong>{" "}
        → choose <strong>Convex</strong> from the <strong>Template</strong>{" "}
        dropdown → <strong>Save</strong>.
      </>,
      <>
        On that template, copy the <strong>Issuer</strong> URL (looks like{" "}
        <Code>https://verb-noun-00.clerk.accounts.dev</Code>) — you paste it in
        the next step.
      </>,
    ],
  },
  {
    title: "Add the Issuer URL to Convex",
    lead: (
      <>
        This clears the error from step 4 and connects Clerk to Convex.
      </>
    ),
    points: [
      <>
        Open{" "}
        <Ext href="https://dashboard.convex.dev">dashboard.convex.dev</Ext> →
        your project → <strong>Settings → Environment Variables</strong>.
      </>,
      <>
        Add a variable named <Code>CLERK_JWT_ISSUER_DOMAIN</Code>, value = the{" "}
        <strong>Issuer URL you just copied</strong>. Click <strong>Save</strong>.
      </>,
      <>
        Your <Code>convex dev</Code> terminal (from step 4) auto-retries within
        seconds and prints <Code>Convex functions ready!</Code>
      </>,
    ],
    note: (
      <strong className="text-neutral-900">
        This goes on the Convex dashboard — not in .env.local.
      </strong>
    ),
  },
  {
    title: "Run the app (terminal 2)",
    code: `npm run dev`,
    lead: (
      <>
        Run this in a <strong>second</strong> terminal (leave the Convex one from
        step 4 running), then open{" "}
        <Ext href="http://localhost:3000">localhost:3000</Ext>.
      </>
    ),
  },
  {
    title: "Verify the full chain",
    points: [
      <>
        Sign up, then land on <Code>/dashboard</Code>.
      </>,
      <>Send a message — it should appear instantly.</>,
      <>
        In the Convex dashboard <strong>Data</strong> tab, confirm a{" "}
        <Code>users</Code> row and a <Code>messages</Code> row exist.
      </>,
      <>
        Both there? Clerk auth → JWT → Convex → live UI all works. ✓
      </>,
    ],
  },
];

function QuickStart() {
  return (
    <section id="setup" className="border-t border-neutral-200">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1 text-xs font-mono text-neutral-600 mb-6">
            <Terminal className="size-3" strokeWidth={2.25} />
            Setup · ~10 min · free tier
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Get it running.
          </h2>
          <p className="mt-4 text-neutral-600 leading-relaxed max-w-xl mx-auto">
            Eight steps, top to bottom. Do them in order — no jumping back and
            forth.
          </p>
        </div>

        <ol className="relative">
          {SETUP_STEPS.map((step, i) => {
            const last = i === SETUP_STEPS.length - 1;
            return (
              <li key={i} className="relative flex gap-5 sm:gap-6 pb-12 last:pb-0">
                {/* connector line */}
                {!last && (
                  <span
                    aria-hidden
                    className="absolute left-[19px] top-12 bottom-0 w-px bg-neutral-200"
                  />
                )}
                {/* number badge */}
                <div className="relative shrink-0">
                  <div className="size-10 rounded-full bg-neutral-900 text-white text-sm font-semibold inline-flex items-center justify-center ring-4 ring-white">
                    {i + 1}
                  </div>
                </div>
                {/* content */}
                <div className="min-w-0 flex-1 pt-1.5">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  {/* command first */}
                  {step.code && (
                    <pre className="mt-3 rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-[13px] font-mono overflow-x-auto leading-relaxed text-neutral-100">
                      <code>{step.code}</code>
                    </pre>
                  )}
                  {step.lead && (
                    <p className="mt-3.5 text-[15px] text-neutral-600 leading-7">
                      {step.lead}
                    </p>
                  )}
                  {step.points && (
                    <ul className="mt-3 space-y-2.5">
                      {step.points.map((point, j) => (
                        <li
                          key={j}
                          className="flex gap-3 text-[15px] text-neutral-600 leading-7"
                        >
                          <span
                            aria-hidden
                            className="mt-[11px] size-1.5 shrink-0 rounded-full bg-neutral-300"
                          />
                          <span className="min-w-0">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {step.note && (
                    <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-sm text-neutral-600 leading-relaxed">
                      {step.note}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-14 rounded-lg border border-neutral-200 bg-neutral-50/60 px-5 py-4 text-sm text-neutral-600 flex items-start gap-3">
          <ShieldCheck
            className="size-4 mt-0.5 shrink-0 text-neutral-400"
            strokeWidth={2.25}
          />
          <p>
            Stuck on a step? The{" "}
            <a
              className="text-neutral-900 font-medium underline underline-offset-4 hover:text-neutral-600"
              href={`${REPO_URL}#readme`}
            >
              README
            </a>{" "}
            has the same eight steps plus a troubleshooting table for the common
            failure modes.
          </p>
        </div>
      </div>
    </section>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
      {children}
    </code>
  );
}

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-neutral-900 font-medium underline underline-offset-2 hover:text-neutral-600"
    >
      {children}
    </a>
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
