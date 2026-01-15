import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="space-y-10">
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-8">
        <h1 className="text-3xl font-semibold">Pricing</h1>
        <p className="text-slate-600 mt-2">
          Launch plan: start Free, then upgrade when you want deeper insights.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-3">
          <div className="text-lg font-semibold">Free</div>
          <div className="text-slate-600 text-sm">Perfect for trying the workflow.</div>
          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
            <li>Unlimited recommendations</li>
            <li>Save history (up to 100)</li>
            <li>Helpful / not helpful feedback</li>
          </ul>
          <Link
            href="/app"
            className="inline-flex rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800"
          >
            Get started
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Pro</div>
            <div className="text-sm font-semibold">$8/mo</div>
          </div>
          <div className="text-slate-600 text-sm">For people who want patterns and modes.</div>
          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
            <li>Unlimited history</li>
            <li>Weekly patterns</li>
            <li>Advanced modes (health/finance) — coming soon</li>
          </ul>
          <div className="text-xs text-slate-500">MVP note: add Stripe later.</div>
        </div>
      </div>

      <div className="text-xs text-slate-500">
        By using NextMove you agree to our <Link href="/terms" className="underline">Terms</Link> and{" "}
        <Link href="/privacy" className="underline">Privacy Policy</Link>.
      </div>
    </div>
  );
}
