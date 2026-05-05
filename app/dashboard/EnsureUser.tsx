"use client";

import { useEffect } from "react";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function EnsureUser() {
  const { isAuthenticated } = useConvexAuth();
  const store = useMutation(api.users.store);

  useEffect(() => {
    if (!isAuthenticated) return;
    store().catch(() => {
      // Surface failures via the rest of the UI; nothing to do here.
    });
  }, [isAuthenticated, store]);

  return null;
}
