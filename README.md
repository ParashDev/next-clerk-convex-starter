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

## Setup

Complete walkthrough — from cloning to a working login. Takes ~10 minutes. No prior Clerk/Convex knowledge needed.

You'll create two free accounts ([Clerk](https://clerk.com) for auth, [Convex](https://convex.dev) for the database) and run two terminals side by side. Everything is free-tier; no credit card.

**Prerequisites:** [Node.js](https://nodejs.org) 20.19+ (or 22.13+) and `git`. Check with `node -v`.

---

### Step 1 — Clone and install

```bash
git clone https://github.com/ParashDev/next-clerk-convex-starter my-app
cd my-app
npm install
```

**Don't want a `my-app` subfolder?** Clone into the folder you're already in — add a trailing dot:

```bash
git clone https://github.com/ParashDev/next-clerk-convex-starter .
```

---

### Step 2 — Create your env file

```bash
cp .env.local.example .env.local
```

This creates your local config file. You'll fill it in over the next two steps — Convex first, then Clerk. Leave everything blank for now.

> `.env.local` is gitignored — never commit it. Note: `CLERK_JWT_ISSUER_DOMAIN` is **not** in this file; it goes on the Convex dashboard (Step 6).

---

### Step 3 — Create a Convex project (on the web)

1. Go to [convex.dev](https://convex.dev) and create an account.
2. Click **New project**, give it a name, and pick a region. Create it.

That's the backend + database. Next you connect the CLI to it.

---

### Step 4 — Connect the CLI (terminal 1)

Open a terminal in the project folder and run:

```bash
npm run convex          # alias for `npx convex dev`
```

- **Sign in:** a browser window opens showing a **code**. Check it matches the code printed in your terminal, then confirm in the browser. The CLI logs in as whichever Convex account is active in that browser.
- **If it asks `local` or `cloud`, choose `cloud`.**
- It lists your Convex projects — **pick the one you created in Step 3**.
- It auto-fills `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` in your `.env.local`, generates the typed API client, and pushes the schema (`users` + `messages` tables).
- **Keep this terminal open** — it runs continuously and re-syncs on save. (The app's dev server in Step 7 gets its own terminal.)

It will then **stop with this error and wait** — this is expected, you fix it in Step 6:

```
✖ Environment variable CLERK_JWT_ISSUER_DOMAIN is used in auth config file
  but its value was not set.
```

<details>
<summary><strong>Logged in as the wrong Convex account?</strong></summary>

The browser account is the one the CLI uses. If it's wrong (or you don't see your project), log out and re-run — then confirm in a browser signed into the right account:

```bash
npx convex logout
npx convex dev --configure
```

`--configure` forces the account + project picker instead of silently reusing the cached one.
</details>

---

### Step 5 — Set up Clerk and paste your keys

Now the auth side. Everything here happens in the [Clerk dashboard](https://dashboard.clerk.com).

1. Sign up at [clerk.com](https://clerk.com) → click **Create application**.
2. Enable **Email** and **Password** sign-in. (Social logins like Google/GitHub are optional — see [Enabling social login](#enabling-social-login).)
3. Go to **Configure → API Keys**, and under **Quick Copy** pick the **Next.js** tab.
4. Copy that snippet and paste it into your `.env.local` — it fills in both keys:
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
   CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
   ```
5. Still in Clerk: open **Configure → Sessions → JWT Templates** (or search **JWT Templates**) → **New template** → choose **Convex** from the **Template** dropdown → **Save**. (Every field auto-populates; the template is named `convex`.)
6. On that template, copy the **Issuer** URL — you paste it in the next step. It looks like:
   ```
   https://verb-noun-00.clerk.accounts.dev
   ```

> Why must the template be named `convex`? Our `convex/auth.config.ts` declares `applicationID: "convex"`, which must match the template name. Rename one → rename both.

---

### Step 6 — Add the Issuer URL to Convex

This clears the error from Step 4 and connects Clerk to Convex.

1. Open [dashboard.convex.dev](https://dashboard.convex.dev) → your project → **Settings → Environment Variables**.
2. Add a variable:

   | Name | Value |
   |---|---|
   | `CLERK_JWT_ISSUER_DOMAIN` | The **Issuer URL** you just copied (e.g. `https://verb-noun-00.clerk.accounts.dev`, no trailing slash) |

3. **Save.** Your `convex dev` terminal (from Step 4) auto-retries within seconds and prints `Convex functions ready!`.

> **This is the #1 thing people miss.** `CLERK_JWT_ISSUER_DOMAIN` lives on the **Convex dashboard**, NOT in `.env.local`. Convex (the backend) uses it to verify Clerk's tokens. Putting it in `.env.local` does nothing.

---

### Step 7 — Run the app (terminal 2)

Open a **second** terminal (leave `convex dev` running in the first):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

### Step 8 — Verify it all works

1. Click **Get started** → create an account (email + password). On a Clerk dev instance you can use any email; the verification code is emailed to you (or use Clerk's test address `your_email+clerk_test@example.com` with code `424242`).
2. You land on `/dashboard`.
3. Type a message and hit send — it appears instantly.
4. Open [Convex dashboard](https://dashboard.convex.dev) → your project → **Data**. You should see:
   - a **`users`** row (auto-created on your first dashboard visit), and
   - a **`messages`** row (what you just typed).

If you see both, the full chain works: **Clerk auth → JWT → Convex verification → reactive query → live UI.** 🎉

---

### Troubleshooting

| Symptom | Fix |
|---|---|
| `convex dev` errors about `CLERK_JWT_ISSUER_DOMAIN` | You skipped Step 6. Set it on the Convex dashboard, not `.env.local`. |
| Signed in, but dashboard data never loads / `isAuthenticated` stays false | Issuer URL mismatch. Re-copy the **Issuer** from Clerk's `convex` JWT template into the Convex env var, then re-run `npx convex dev`. |
| `convex dev` keeps using the wrong account/project | `npx convex logout` then `npx convex dev --configure`. |
| `Missing NEXT_PUBLIC_CONVEX_URL` on app start | `convex dev` hasn't run yet (or didn't finish). Run it and let it populate `.env.local`. |
| OAuth button does nothing / errors | The provider isn't enabled in Clerk. See [Enabling social login](#enabling-social-login). |
| Changed `.env.local` but nothing updates | Restart `npm run dev` — env vars are read at boot. |

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
  sign-in/page.tsx              # Email + password + Client Trust + 2FA + social (useSignIn)
  sign-up/page.tsx              # Email signup with email-code verify + social (useSignUp)
  sso-callback/page.tsx         # Completes the OAuth redirect (handles transfer/edge cases)
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

The sign-in and sign-up pages render OAuth buttons **only for providers you've actually enabled in Clerk**. The component reads `clerk.__internal_environment.userSettings.authenticatableSocialStrategies` at runtime and filters the `PROVIDERS` array against it — no buttons appear until both ends agree:

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

OAuth flow: button click → `signIn.sso()` / `signUp.sso()` redirects to the provider → provider redirects back to `/sso-callback` → that page calls `finalize()` and handles account-transfer edge cases → user lands on `/dashboard`. `/sso-callback` is intentionally outside `/dashboard` so middleware doesn't block it.

## Authentication flows (the details)

All auth UI is custom — built on Clerk's hooks (`useSignIn`, `useSignUp`), not Clerk's drop-in `<SignIn />` components. This means full control over styling and behaviour. The flows use Clerk's current API: `signIn.password()`, `signIn.finalize()`, `signIn.mfa.*`, etc.

### Two-factor authentication (2FA)

When a user has 2FA enrolled, `signIn.password()` returns status `needs_second_factor`. The sign-in form reads `signIn.supportedSecondFactors` and shows the right input automatically:

- **`totp`** — 6-digit code from an authenticator app (Google Authenticator, 1Password, Authy). Verified with `signIn.mfa.verifyTOTP()`.
- **`backup_code`** — a saved one-time code. Verified with `signIn.mfa.verifyBackupCode()`. The form offers a "Use a backup code" toggle when the user has them.
- **`phone_code`** (SMS) — sent via `signIn.mfa.sendPhoneCode()`, verified with `signIn.mfa.verifyPhoneCode()`.

**How a user enrolls in 2FA:** sign in → click the avatar menu (top-right of the dashboard) → **Manage account** → **Security** → **Add two-step verification** → scan the QR with an authenticator app → save the backup codes. Their next sign-in prompts for the code automatically.

### Client Trust (new-device verification)

Clerk's [Client Trust](https://clerk.com/docs/guides/secure/client-trust) feature (on by default) challenges sign-ins from a new device — even for users **without** 2FA — to block credential-stuffing. When it triggers, `signIn.password()` returns status `needs_client_trust`, and Clerk falls back to an emailed one-time code.

The sign-in form handles this automatically: it sends the code with `signIn.mfa.sendEmailCode()` and verifies with `signIn.mfa.verifyEmailCode()`. **No setup needed** — it just works.

To turn Client Trust off (e.g. to simplify dev), go to Clerk dashboard → **Configure** → **Attack protection** (or **Client Trust**) and disable it. With it off, password sign-in is a single step when no 2FA is enrolled.

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
