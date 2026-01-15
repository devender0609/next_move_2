import Link from "next/link";

export default function AppHome() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="text-sm text-slate-500 dark:text-slate-400">Overview</div>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Your decision workspace
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Use New decision to get a recommendation. Save it to build a history and track what actually helped.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/app/decide"
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white gradient-brand hover:opacity-95"
          >
            New decision
          </Link>

          <Link
            href="/app/history"
            className="rounded-xl px-5 py-2.5 text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:text-slate-100"
          >
            View history
          </Link>

          {/* ✅ removed the Login button from this row */}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="font-semibold text-slate-900 dark:text-slate-100">Fast templates</div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Start with a preset and edit in seconds.
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
            <li>Deep work (high focus tasks)</li>
            <li>Admin cleanup (email, scheduling)</li>
            <li>Quick wins (low effort boosts)</li>
            <li>Health reset (small wellbeing actions)</li>
            <li>Money clarity (small finance next steps)</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="font-semibold text-slate-900 dark:text-slate-100">Track what works</div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Mark outcomes helpful/not helpful to improve recommendations over time.
          </p>
          <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Tip: Keep task titles short and action-based (e.g., “Draft intro slide”, not “Presentation”).
          </div>
        </div>
      </div>
    </div>
  );
}
