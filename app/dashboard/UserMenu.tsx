"use client";

import { useState, useEffect, useRef } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Settings, LogOut } from "lucide-react";

// Custom replacement for <UserButton /> — avatar trigger + dropdown.
// "Manage account" still opens Clerk's prebuilt UserProfile modal (styled via
// app/clerkAppearance.ts) so password/2FA/sessions management Just Works.

export function UserMenu() {
  const { user, isLoaded } = useUser();
  const clerk = useClerk();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  if (!isLoaded || !user) {
    return <div className="size-8 rounded-full bg-neutral-100" />;
  }

  const email = user.primaryEmailAddress?.emailAddress;
  const displayName = user.fullName || email || "Account";
  const initial = (
    user.firstName?.[0] ??
    email?.[0] ??
    "?"
  ).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-label="Open user menu"
        aria-expanded={open}
        className="size-8 rounded-full overflow-hidden border border-neutral-200 hover:border-neutral-400 transition focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
      >
        {user.imageUrl ? (
          // Plain <img> avoids configuring img.clerk.com in next.config for next/image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.imageUrl}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <span className="flex items-center justify-center size-full bg-neutral-900 text-white text-sm font-medium">
            {initial}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full right-0 mt-2 w-64 rounded-lg border border-neutral-200 bg-white shadow-lg overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-neutral-200">
            <div className="text-sm font-medium text-neutral-900 truncate">
              {displayName}
            </div>
            {email && displayName !== email && (
              <div className="text-xs text-neutral-500 truncate mt-0.5">
                {email}
              </div>
            )}
          </div>
          <div className="py-1">
            <MenuItem
              icon={<Settings className="size-4" strokeWidth={2.25} />}
              label="Manage account"
              onClick={() => {
                setOpen(false);
                clerk.openUserProfile();
              }}
            />
            <MenuItem
              icon={<LogOut className="size-4" strokeWidth={2.25} />}
              label="Sign out"
              onClick={() => {
                setOpen(false);
                void clerk.signOut({ redirectUrl: "/" });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition"
    >
      <span className="text-neutral-500">{icon}</span>
      {label}
    </button>
  );
}
