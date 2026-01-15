import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/40">
        {/* Aurora background */}
        <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden rounded-[28px]">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-400/35 blur-3xl" />
          <div className="absolute top-10 right-10 h-80 w-80 rounded-full bg-violet-400/30 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-sky-400/25 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(99,102,241,0.16),transparent_45%),radial-gradient(circle_at_75%_30%,rgba(168,85,247,0.14),transparent_45%),radial-gradient(circle_at_55%_80%,rgba(14,165,233,0.12),transparent_45%)]" />
        </div>

        <div className="relative p-10 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            {/* LEFT */}
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs text-slate-700 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600" />
                  Decision Assistant
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs text-slate-700 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200">
                  ⚡ Reduce decision fatigue
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs text-slate-700 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200">
                  ⏱ 60 seconds to clarity
                </span>
              </div>

              {/* Headline (no underline) */}
              <h1 className="mt-7 text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Decide your next move{" "}
                <span className="block mt-2 text-3xl md:text-4xl font-semibold">
                  with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600">
                    calm confidence
                  </span>
                  .
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-200">
                Get one clear next step — fast.
              </p>

              {/* CTA */}
              <div className="mt-7">
                <Link href="/app/decide" className="btn-brand">
                  Start now
                </Link>
              </div>
            </div>

            {/* RIGHT: How it works */}
            <div className="w-full">
              <div className="panel">
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
                      className="flex gap-3 rounded-xl border border-slate-200/70 bg-white/70 p-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600">
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

                <div className="mt-5 rounded-xl border border-slate-200/70 bg-white/70 p-4 text-sm text-slate-700 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
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
          ["Clear recommendations", "One best next step, plus alternatives."],
          ["Daily focus", "Build momentum with simple streaks."],
          ["Track what works", "Save outcomes to learn patterns."],
        ].map(([t, d]) => (
          <div key={t} className="card-soft">
            <div className="font-semibold text-slate-900 dark:text-slate-100">{t}</div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{d}</div>
          </div>
        ))}
      </section>

      {/* NOTE: footer removed here on purpose (it exists in app/layout.tsx) */}
    </div>
  );
}
