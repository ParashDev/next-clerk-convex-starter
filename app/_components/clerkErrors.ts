// Pull a human-readable message out of a Clerk SDK error.
// Clerk errors look like: { errors: [{ message, longMessage, code, ... }] }.
export function extractClerkError(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (err && typeof err === "object" && "errors" in err) {
    const errors = (
      err as { errors?: Array<{ message?: string; longMessage?: string }> }
    ).errors;
    const first = errors?.[0];
    return first?.longMessage ?? first?.message ?? fallback;
  }
  return fallback;
}
