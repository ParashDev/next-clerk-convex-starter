import Link from "next/link";
import { Layers } from "lucide-react";
import { EnsureUser } from "./EnsureUser";
import { UserMenu } from "./UserMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh flex flex-col">
      <EnsureUser />
      <header className="border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight"
          >
            <Layers className="size-4" strokeWidth={2.25} />
            Starter
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-neutral-600 hover:text-neutral-900 transition"
            >
              Dashboard
            </Link>
            <UserMenu />
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
