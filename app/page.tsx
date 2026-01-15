import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Fancy hero */}
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* decorative gradient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full blur-3xl opacity-20 gradient-brand" />
          <div className="absolute -left-28 -bottom-28 h-80 w-80 rounded-full blur-3xl opacity-20 gradient-brand" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.10),transparent_45%),radial-gradient(circle_at_80%_40%,rgba(37,99,235,0.10),transparent_45%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.18),transparent_45%),radial-gradient(circle_at_80%_40%,rgba(37,99,235,0.18),transparent_45%)]" />
        </div>

        <div className="relative p-10 md:p-14">
          {/* ✅ removed the small logo above the headline */}

          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-700 backdrop-blur dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200">
            <span className="h-2 w-2 rounded-full gradient-brand" />
            Decision Assistant • Reduce decision fatigue
          </div>

          <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Decide your next move.
          </h1>

          <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
            NextMove helps you cut through decision fatigue and tells you what to do next —
            clearly, calmly, and fast.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {/* ✅ removed "Try it now" */}
            <Link
              href="/app"
              className="rounded-xl px-6 py-3 text-sm font-semibold text-white gradient-brand shadow-sm hover:opacity-95"
            >
              Open app
            </Link>

            <Link
              href="/app/decide"
              className="rounded-xl px-6 py-3 text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:text-slate-100"
            >
              New decision
            </Link>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["No login required", "Use it instantly. Login only if you want to save."],
          ["Clear recommendations", "One best next step, plus alternatives."],
          ["Built for momentum", "Less thinking. More doing."],
        ].map(([t, d]) => (
          <div
            key={t}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="font-semibold text-slate-900 dark:text-slate-100">{t}</div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{d}</div>
          </div>
        ))}
      </section>
    </div>
  );
}