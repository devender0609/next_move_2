import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* layered background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full blur-3xl opacity-25 gradient-brand" />
          <div className="absolute -left-24 -bottom-28 h-80 w-80 rounded-full blur-3xl opacity-20 gradient-brand" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(124,58,237,0.10),transparent_45%),radial-gradient(circle_at_70%_45%,rgba(37,99,235,0.10),transparent_45%)] dark:bg-[radial-gradient(circle_at_25%_20%,rgba(124,58,237,0.18),transparent_45%),radial-gradient(circle_at_70%_45%,rgba(37,99,235,0.18),transparent_45%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(15,23,42,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.15)_1px,transparent_1px)] [background-size:32px_32px] dark:opacity-[0.12]" />
        </div>

        <div className="relative p-10 md:p-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT */}
            <div className="max-w-2xl">
              {/* top chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-700 backdrop-blur dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200">
                  <span className="h-2 w-2 rounded-full gradient-brand" />
                  Decision Assistant
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-700 backdrop-blur dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200">
                  <span className="text-slate-400">⚡</span> Reduce decision fatigue
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-700 backdrop-blur dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200">
                  <span className="text-slate-400">⏱</span> 60 seconds to clarity
                </span>
              </div>

              <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Decide your next move —
                <span className="block">
                  with calm confidence.
                </span>
              </h1>

              <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                NextMove turns a messy list of “shoulds” into one clear next step — plus a few good alternatives — so you can stop thinking and start moving.
              </p>

              {/* CTAs */}
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/app/decide"
                  className="rounded-xl px-6 py-3 text-sm font-semibold text-white gradient-brand shadow-sm hover:opacity-95"
                >
                  Start now
                </Link>

                <Link
                  href="/app"
                  className="rounded-xl px-6 py-3 text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:text-slate-100"
                >
                  Explore workspace
                </Link>
              </div>

              {/* micro proof */}
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="inline-flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400">●</span>
                  No login required to try
                </div>
                <div className="inline-flex items-center gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">●</span>
                  Save history when you login
                </div>
                <div className="inline-flex items-center gap-2">
                  <span className="text-sky-600 dark:text-sky-400">●</span>
                  Daily Focus streaks
                </div>
              </div>
            </div>

            {/* RIGHT: “How it works” card */}
            <div className="w-full max-w-md">
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
                      <div>
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
