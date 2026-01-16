// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-10">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-indigo-50 to-sky-100/60 p-6 md:p-10 shadow-sm">
          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            {/* LEFT */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  Decision Assistant
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                  <span className="text-[13px]">⚡</span>
                  Reduce decision fatigue
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                  <span className="text-[13px]">⏱</span>
                  60 seconds to clarity
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                Decide your next move <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">
                  with calm confidence.
                </span>
              </h1>

              {/* Removed the circled tagline line here */}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/app/decide"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:brightness-110 active:brightness-95"
                >
                  Start now
                </Link>

                {/* Removed the circled "How it works" button */}
              </div>

              {/* Removed the circled login/no-pressure helper text */}
            </div>

            {/* RIGHT */}
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">How it works</div>

              <div className="mt-4 space-y-3">
                <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white">
                    1
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">Pick a domain + mood</div>
                    <div className="text-sm text-slate-600">
                      Work, health, relationships… and how you feel right now.
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white">
                    2
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">Add your goal</div>
                    <div className="text-sm text-slate-600">What outcome are you aiming for?</div>
                  </div>
                </div>

                <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white">
                    3
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">List a few tasks</div>
                    <div className="text-sm text-slate-600">
                      Include effort, impact, and emotional friction.
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white">
                    4
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">Get one best next step</div>
                    <div className="text-sm text-slate-600">
                      Plus alternatives — and a confidence check.
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                  <span className="font-semibold">Pro tip:</span> Keep tasks action-based (e.g., “Draft 3 slides” not
                  “Presentation”).
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom feature cards */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Clear recommendations</div>
            <div className="mt-1 text-sm text-slate-600">One best next step, plus a couple smart alternatives.</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Daily focus</div>
            <div className="mt-1 text-sm text-slate-600">Build momentum with simple streaks (optional).</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Track what works</div>
            <div className="mt-1 text-sm text-slate-600">Save outcomes to learn patterns over time.</div>
          </div>
        </div>
      </section>
    </main>
  );
}
