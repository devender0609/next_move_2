import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="lg:sticky lg:top-6 h-fit rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <div className="text-sm text-slate-500">Workspace</div>
          <div className="text-lg font-semibold">NextMove</div>
          <div className="text-xs text-slate-500 mt-1">Decision assistant</div>
        </div>
        <nav className="p-3">
          {[
            ["/app", "Overview"],
            ["/app/decide", "New decision"],
            ["/app/history", "History"],
            ["/app/login", "Login"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-5 pb-5 text-xs text-slate-500">
          Tip: Start with <span className="font-medium text-slate-700">New decision</span>.
        </div>
      </aside>

      <section className="min-w-0">{children}</section>
    </div>
  );
}
