import Link from "next/link";

export default function AppHome() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        <div className="text-sm text-slate-500">Overview</div>
        <h2 className="mt-1 text-2xl font-semibold">Your decision workspace</h2>
        <p className="mt-2 text-slate-600">
          Use <span className="font-medium text-slate-900">New decision</span> to get a recommendation. Save it to build
          a history and track what actually helped.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800" href="/app/decide">
            New decision
          </Link>
          <Link className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50" href="/app/history">
            View history
          </Link>
          <Link className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50" href="/app/login">
            Login
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="font-semibold">Fast templates</div>
          <p className="text-sm text-slate-600 mt-1">
            Start with a preset and edit in seconds.
          </p>
          <ul className="mt-3 text-sm text-slate-700 list-disc pl-5 space-y-1">
            <li>Deep work (high focus tasks)</li>
            <li>Admin cleanup (email, scheduling)</li>
            <li>Quick wins (low effort boosts)</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="font-semibold">Track what works</div>
          <p className="text-sm text-slate-600 mt-1">
            Mark outcomes helpful/not helpful to improve recommendations over time.
          </p>
          <div className="mt-4 text-xs text-slate-500">
            Tip: Keep task titles short and action-based (e.g., “Draft intro slide”, not “Presentation”).
          </div>
        </div>
      </div>
    </div>
  );
}
