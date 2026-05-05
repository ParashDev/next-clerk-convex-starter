// Shared Clerk Appearance config — keeps sign-in, sign-up, and <UserButton />
// in sync with the rest of the app. Applied globally via <ClerkProvider>
// in app/layout.tsx.
//
// Two layers:
//   - `variables`: design tokens (colors, font, radius). Fast to tweak.
//   - `elements`: per-element classNames (Tailwind here). Use this for
//      anything `variables` can't express.
// Full reference: https://clerk.com/docs/customization/overview

export const clerkAppearance = {
  variables: {
    colorPrimary: "#171717", // neutral-900
    colorBackground: "#ffffff",
    colorText: "#171717",
    colorTextSecondary: "#525252", // neutral-600
    colorInputBackground: "#ffffff",
    colorInputText: "#171717",
    colorDanger: "#dc2626",
    fontFamily: "var(--font-geist-sans), -apple-system, sans-serif",
    fontSize: "0.875rem",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full max-w-md mx-auto",
    card: "shadow-none border border-neutral-200 rounded-lg p-8 bg-white",
    cardBox: "shadow-none border border-neutral-200 rounded-lg",
    header: "mb-6",
    headerTitle: "text-2xl font-semibold tracking-tight text-neutral-900",
    headerSubtitle: "text-sm text-neutral-600 mt-1",
    socialButtonsBlockButton:
      "border border-neutral-200 hover:bg-neutral-50 transition rounded-md text-sm font-medium text-neutral-900 normal-case",
    socialButtonsBlockButtonText: "font-medium text-neutral-900",
    socialButtonsProviderIcon: "size-4",
    dividerLine: "bg-neutral-200",
    dividerText:
      "text-neutral-500 text-xs uppercase tracking-[0.15em] font-medium",
    formFieldLabel: "text-xs font-medium text-neutral-700 uppercase tracking-wider",
    formFieldInput:
      "border border-neutral-200 rounded-md px-3 py-2 text-sm bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-900 focus:ring-offset-0 focus:border-neutral-900 outline-none",
    formFieldInputShowPasswordButton: "text-neutral-500 hover:text-neutral-900",
    formButtonPrimary:
      "bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium rounded-md py-2.5 normal-case shadow-none transition",
    formButtonReset:
      "text-neutral-600 hover:text-neutral-900 text-sm font-medium",
    footer: "bg-transparent border-t border-neutral-200 mt-4 pt-4",
    footerAction: "text-neutral-600 text-sm",
    footerActionLink:
      "text-neutral-900 font-medium hover:underline underline-offset-4",
    footerActionText: "text-neutral-600",
    formFieldAction: "text-neutral-900 hover:underline underline-offset-4",
    formFieldErrorText: "text-red-600 text-xs mt-1",
    formResendCodeLink: "text-neutral-900 font-medium hover:underline",
    identityPreviewEditButton: "text-neutral-600 hover:text-neutral-900",
    identityPreviewText: "text-neutral-700",
    otpCodeFieldInput:
      "border-neutral-200 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900",
    alertText: "text-neutral-600 text-sm",
    badge: "bg-neutral-100 text-neutral-700 border border-neutral-200",
    avatarBox: "border border-neutral-200",
    userButtonPopoverCard:
      "shadow-lg border border-neutral-200 rounded-lg bg-white",
    userButtonPopoverActionButton:
      "text-sm text-neutral-700 hover:bg-neutral-50",
    userButtonPopoverActionButtonText: "text-neutral-700",
    userButtonPopoverFooter: "hidden",
    logoBox: "hidden",
  },
  layout: {
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
    showOptionalFields: true,
  },
};
