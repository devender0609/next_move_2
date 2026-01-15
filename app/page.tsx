import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full blur-3xl opacity-25 gradient-brand" />
          <div className="absolute -left-24 -bottom-28 h-80 w-80 rounded-full blur-3xl opacity-20 gradient-brand" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(124,58,237,0.10),transparent_45%),radial-gradient(circle_at_70%_45%,rgba(37,99,235,0.10),transparent_45%)] dark:bg-[radial-gradient(circle_at_25%_20%,rgba(124,58,237,0.18),transparent_45%),radial-gradient(circle_at_70%_45%,rgba(37,99,235,0.18),transparent_45%)]" />
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(15,23,42,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.15)_1px,transparent_1px)] [background-size:36px_36px] dark:opacity-[0.10]" />
        </div>

        <div className="relative p-10 md:p-12">
          {/* Make it less crowded: more whitespace, smaller type, tighter content */}
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            {/* LEFT */}
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-700 backdrop-blur dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200">
                  <span className="h-2 w-2 rounded-full gradient-brand" />
                  Decision Assistant
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-700 backdrop-blur dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200">
                  ⚡ Reduce decision fatigue
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-700 backdrop-blur dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200">
                  ⏱ 60 seconds to clarity
                </span>
              </div>

              {/* ✅ reduced headline size */}
              <h1 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Decide your next move —
                <span className="block">with calm confidence.</span>
              </h1>

              {/* ✅ removed the long paragraph per request */}
              <p className="mt-4 max-w-xl text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                Get one clear next step — fast.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/app/decide"
                  className="rounded-xl px-6 py-3 text-sm font-semibold text-white gradient-brand shadow-sm hover:opacity-95"
                >
                  Start now
                </Link>
              </div>

              {/* ✅ removed the 3 bullet/“●” lines */}
            </div>

            {/* RIGHT: How it works (keep, but make cleaner) */}
            <div className="w-full">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  How it works
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    ["1", "Add your goal", "What outcome are you aiming for?"],
                    ["2", "List a few tasks", "Include impact, effort, and resistance."],
                    ["3", "Get one best next step", "With confidence + alternatives."],
                    ["4", "Save & track outcomes", "Build history and learn what works."],
                  ].map(([n, t, d]) => (
                    <div
                      key={n}
                      className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white gradient-brand">
                        {n}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {t}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300">
                          {d}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  <span className="font-semibold">Pro tip:</span>{" "}
                  Keep tasks action-based (e.g., “Draft 3 slides”, not “Presentation”).
                </div>
              </div>
            </div>
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
