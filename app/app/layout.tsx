import Link from "next/link";
import { MobileNav } from "@/components/MobileNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr] pb-16 lg:pb-0">
      <aside className="lg:sticky lg:top-6 h-fit rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* ✅ removed the "Workspace / NextMove / Decision assistant" header completely */}
        <nav className="p-3">
          {[
            ["/app", "Overview"],
            ["/app/decide", "New decision"],
            ["/app/focus", "Daily focus"],
            ["/app/history", "History"],
            ["/app/login", "Login"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="min-w-0">{children}</section>

      <MobileNav />
    </div>
  );
}