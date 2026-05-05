// Override Clerk's default UI strings.
// Keeps the auth pages brand-neutral — by default Clerk shows
// "Sign in to <Clerk application name>", which leaks the project name.
//
// Full list of overridable keys:
// https://clerk.com/docs/customization/localization

export const clerkLocalization = {
  signIn: {
    start: {
      title: "Sign in",
      subtitle: "Welcome back.",
    },
  },
  signUp: {
    start: {
      title: "Create your account",
      subtitle: "Get started in seconds.",
    },
  },
};
