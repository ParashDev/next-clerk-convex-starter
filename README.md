# Starter — Next.js + Tailwind + Clerk + Convex

A production-ready Next.js starter with authentication and a real-time database, fully wired up. Drop in your API keys, run two commands, ship.

**Stack**

- [Next.js 16](https://nextjs.org) — App Router, TypeScript, Turbopack
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first styling
- [Clerk](https://clerk.com) — authentication (sign-in, sign-up, sessions, social, MFA)
- [Convex](https://convex.dev) — reactive TypeScript database with real-time queries
- [lucide-react](https://lucide.dev) — icons

## What you get on first run

- A polished landing page (`/`) you can show off or rip out
- **Fully custom sign-in / sign-up forms** (no Clerk drop-in UI) wired through Clerk's `useSignIn` / `useSignUp` hooks
- **Social login** (Google + GitHub by default) with a `/sso-callback` return route
- **Two-factor authentication** support — TOTP (authenticator app) and backup codes, prompted automatically when a user has 2FA enabled
- Email-code verification for password signups
- A protected `/dashboard` route gated by `clerkMiddleware` at the edge
- A working Convex demo on the dashboard: a `messages` table you can write to and watch update live, scoped to the signed-in user
- A `users` table that lazy-creates a Convex row on first authed visit (mirrors Clerk identity)
- End-to-end types from Convex schema → API → React components

## Quick start

### 1. Clone

```bash
git clone https://github.com/ParashDev/next-clerk-convex-starter my-app
cd my-app
npm install
```

### 2. Set up Clerk

1. Create a free account at [clerk.com](https://clerk.com).
2. Create a new application. Pick the sign-in methods you want.
3. From the [API keys](https://dashboard.clerk.com/last-active?path=api-keys) page, copy your **Publishable Key** (`pk_test_…`) and **Secret Key** (`sk_test_…`).

### 3. Create the Convex JWT template in Clerk

Convex needs Clerk to issue JWTs in a specific shape. There are two ways to set this up — either works, pick one:

**Option A — One-click integration (easiest):**

In the Clerk dashboard, open the [Convex integration](https://dashboard.clerk.com/apps/setup/convex) and click **Activate**. Clerk auto-creates a JWT template named `convex` with the right claims.

**Option B — Manual JWT template:**

1. Clerk dashboard → **JWT Templates** → **New template**.
2. Choose the **Convex** preset.
3. Save it. Clerk names it `convex` automatically — leave that name as-is, our `convex/auth.config.ts` expects `applicationID: "convex"`.

Either way, after this step Clerk shows you an **Issuer URL** like `https://verb-noun-00.clerk.accounts.dev`. **Copy it** — you'll paste it into Convex in step 5.

> Why "convex"? The string in `convex/auth.config.ts` (`applicationID: "convex"`) must match the Clerk JWT template name. If you ever rename the template, update the config too.

### 4. Configure your local env

```bash
cp .env.local.example .env.local
```

Open `.env.local` and paste:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_`)
- `CLERK_SECRET_KEY` (starts with `sk_test_`)

Leave `NEXT_PUBLIC_CONVEX_URL` blank — Convex sets it for you in the next step.

### 5. Set up Convex

In one terminal at the project root:

```bash
npm run convex          # alias for `npx convex dev`
```

This will:

- Prompt you to log in (GitHub or email).
- Create a new Convex project.
- Write `NEXT_PUBLIC_CONVEX_URL` and `CONVEX_DEPLOYMENT` into `.env.local`.
- Generate `convex/_generated/` (typed API client).
- Stay running to sync your backend functions on save.

The first sync will fail with a message like:

```
✖ Environment variable CLERK_JWT_ISSUER_DOMAIN is used in auth config file
  but its value was not set.
  Go to: https://dashboard.convex.dev/d/<your-deployment>/settings/environment-variables…
```

That's expected. Click the link (or open Convex dashboard → your project → Settings → Environment Variables) and add:

| Name | Value |
|---|---|
| `CLERK_JWT_ISSUER_DOMAIN` | The **Issuer URL** from step 3 (e.g. `https://verb-noun-00.clerk.accounts.dev`, no trailing slash) |

> **Important:** `CLERK_JWT_ISSUER_DOMAIN` is a **Convex** environment variable, *not* a Next.js one. It only needs to live on the Convex dashboard — putting it in `.env.local` does nothing. The `.env.local.example` file lists it at the bottom as a reminder.

Save it. The `convex dev` terminal automatically retries and logs `Auth config pushed`.

### 6. Run

In a second terminal:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign up, and you'll land on the dashboard. Type a message — it should appear instantly. Open the page in another tab and watch it sync.

## Project structure

```
app/
  layout.tsx                    # ClerkProvider + ConvexClientProvider wrap the app
  page.tsx                      # Landing page
  ConvexClientProvider.tsx      # ConvexProviderWithClerk client wrapper
  clerkAppearance.ts            # <UserButton /> popover styling (Clerk Appearance API)
  clerkLocalization.ts          # Override Clerk's default UI strings
  _components/
    SocialButtons.tsx           # OAuth provider buttons (shared by sign-in & sign-up)
    clerkErrors.ts              # extractClerkError helper
  sign-in/page.tsx              # Email + password + 2FA + social (useSignIn hook)
  sign-up/page.tsx              # Email signup with email-code verify + social (useSignUp hook)
  sso-callback/page.tsx         # Where OAuth providers redirect back — completes the flow
  dashboard/
    layout.tsx                  # Nav shell + UserButton + <EnsureUser />
    EnsureUser.tsx              # Lazy-creates the Convex user row on first authed visit
    page.tsx                    # Convex demo (messages table)
convex/
  schema.ts                     # users + messages tables
  users.ts                      # current query + store mutation (idempotent upsert)
  messages.ts                   # list / send / remove (auth-scoped)
  auth.config.ts                # Clerk JWT issuer config
  _generated/                   # auto-generated API types (gitignored)
proxy.ts                        # clerkMiddleware — protects /dashboard
.env.local.example              # env var template
```

## Enabling social login

The sign-in and sign-up pages render OAuth buttons **only for providers you've actually enabled in Clerk**. The component reads `clerk.environment.userSettings.authenticatableSocialStrategies` at runtime and filters the `PROVIDERS` array against it — no buttons appear until both ends agree:

1. **Define the button** in `app/_components/SocialButtons.tsx`:
   ```ts
   const PROVIDERS = [
     { name: "Google", strategy: "oauth_google", icon: <GoogleIcon /> },
     { name: "GitHub", strategy: "oauth_github", icon: <GitHubIcon /> },
     // Add more here when you enable them in Clerk:
     // { name: "Apple", strategy: "oauth_apple", icon: <AppleIcon /> },
   ];
   ```
2. **Enable in Clerk dashboard** → **User & Authentication** → **Social Connections** → toggle the matching provider on. In dev, you can use Clerk's shared dev OAuth credentials (zero setup). In prod, register your own OAuth app per provider and paste the client ID/secret.

The button appears the moment Clerk reports the provider as enabled — refresh the page and it's there. If you defined the button but didn't enable it in Clerk, it stays hidden (rather than rendering and erroring on click).

OAuth flow: button click → Clerk redirects to the provider → provider redirects to `/sso-callback` → `<AuthenticateWithRedirectCallback />` finishes the handshake → user lands on `/dashboard`. The callback page is unprotected by middleware (it's not under `/dashboard`).

## Two-factor authentication

The sign-in form already detects `result.status === "needs_second_factor"` and shows a TOTP code input with a "Use backup code" toggle. You don't have to write anything for it to kick in.

**How a user enrolls in 2FA:**

1. Sign in.
2. Open `<UserButton />` (top-right on the dashboard) → **Manage account** → **Security**.
3. **Add two-step verification** → choose **Authenticator app** → scan the QR code in their authenticator → save the backup codes.

Next sign-in for that user will prompt for the 2FA code automatically.

**Strategies handled in the form:**

- `totp` (default) — 6-digit code from Google Authenticator, 1Password, etc.
- `backup_code` — single-use codes from enrollment

For SMS 2FA (`phone_code`), you'd need an extra `prepareSecondFactor({ strategy: "phone_code", phoneNumberId })` call before showing the code input. That's roughly 20 extra lines if you need it.

## How users get into Convex

Clerk owns user accounts. Convex keeps a mirror row in its own `users` table so you can join with other data and store app-specific fields.

The mirror is populated by the **lazy-create** pattern, no webhooks required:

1. After signup, Clerk redirects the user to `/dashboard`.
2. `app/dashboard/EnsureUser.tsx` mounts. It waits until Convex has validated the JWT (`useConvexAuth` returns `isAuthenticated: true`), then calls the `users.store` mutation.
3. `users.store` is idempotent — it inserts the row on first call and patches `email` / `name` / `imageUrl` on later calls if they've changed in Clerk.

Stored fields per user:

- `clerkId` — `identity.subject`, the stable Clerk user ID (your foreign key)
- `email` / `name` / `imageUrl` — copied from the JWT identity

To read the current user inside another query/mutation, import the helpers from `convex/users.ts`:

```ts
import { getCurrentUser, getCurrentUserOrThrow } from "./users";

// In a query — graceful (returns null if no session):
const me = await getCurrentUser(ctx);

// In a mutation — strict (throws if no session):
const me = await getCurrentUserOrThrow(ctx);
```

## ID conventions

- **`clerkId`** — only stored on the `users` table. It's the auth-boundary identifier (`identity.subject` from Clerk's JWT). Used once per authed call to look up the user row, then forgotten.
- **`Id<"users">`** (Convex's `_id`) — the canonical primary key. **Every other table that needs to reference a user stores `Id<"users">`**, not `clerkId`.

The `messages` demo follows this pattern: `messages.authorId: v.id("users")`. Direct join with `await ctx.db.get(message.authorId)` returns the typed user record. When you add new tables, do the same — use `v.id("users")` (or `v.id("yourTable")`) for any user-scoped foreign keys.

When you want stricter sync (immediate updates when a user changes their name in Clerk's profile UI, or row deletion when they delete their account), upgrade from lazy-create to a Clerk webhook → Convex `httpAction`. The lazy-create scaffold stays useful as a fallback.

## Replacing the demo

Once the messages demo confirms the wiring works, delete it and start your own data model:

1. Edit `convex/schema.ts` — define your tables.
2. Replace `convex/messages.ts` with your own queries and mutations.
3. Replace `app/dashboard/page.tsx` with your real UI.

The auth + Convex bridge stays exactly the same. Every query gets `ctx.auth.getUserIdentity()` for the signed-in user.

## Deploying

- **Frontend (Next.js)** → [Vercel](https://vercel.com) is the default. Set the env vars from `.env.local` in the Vercel project settings.
- **Backend (Convex)** → run `npx convex deploy` once. In the Convex dashboard, configure the same `CLERK_JWT_ISSUER_DOMAIN` env var on the production deployment (using your production Clerk Frontend API URL).
- **Clerk** → switch from test to production keys (`pk_live_*`, `sk_live_*`) in the Vercel env settings.

## Customizing

- **Branding** — replace the `Layers` icon and `Starter` wordmark in `app/page.tsx`, the auth pages, and `app/dashboard/layout.tsx`.
- **Add protected routes** — extend the matcher in `proxy.ts`:
  ```ts
  const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/settings(.*)"]);
  ```
- **Theming** — edit `app/globals.css`. Tailwind v4 picks up theme tokens via `@theme inline`.

## License

MIT — see [LICENSE](./LICENSE). Fork it, ship it, make it yours.
