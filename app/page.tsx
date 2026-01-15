import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm p-8 md:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
          <span>✨</span> Reduce decision fatigue
        </div>

        <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
          Make small decisions fast — without overthinking.
        </h1>

        <p className="mt-3 text-slate-600 max-w-2xl">
          Enter your goal, time, energy, and tasks. NextMove recommends your best next step with a clear explanation and
          alternatives.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-xl bg-slate-900 text-white px-5 py-3 text-sm font-medium hover:bg-slate-800" href="/app">
            Open the App
          </Link>
          <Link className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium hover:bg-slate-50" href="/app/decide">
            Try a decision
          </Link>
          <Link className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium hover:bg-slate-50" href="/pricing">
            Pricing
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {[
          ["Instant recommendation", "Pick your best next task in ~10 seconds."],
          ["Explainable", "See why it chose it + what would change the answer."],
          ["Learns from you", "Mark decisions helpful/not helpful to improve over time."]
        ].map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="font-semibold">{t}</div>
            <div className="text-sm text-slate-600 mt-2">{d}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
