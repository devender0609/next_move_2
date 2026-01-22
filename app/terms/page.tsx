import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Terms of Service</h1>
        <p className="mt-2 text-slate-600">
          NextMove provides decision-support suggestions. It is not professional, medical, legal, or financial advice.
        </p>

        <div className="mt-8 space-y-6 text-slate-700">
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Use of the app</h2>
            <ul className="mt-2 list-disc pl-6">
              <li>You are responsible for the choices you make based on the app’s outputs.</li>
              <li>Do not input sensitive personal, medical, or confidential information.</li>
              <li>The app may change over time, and some features may be experimental.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">No warranties</h2>
            <p className="mt-2">
              The app is provided “as is” without warranties of any kind. We do not guarantee that recommendations will be
              accurate, complete, or suitable for your situation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">Limitation of liability</h2>
            <p className="mt-2">
              To the maximum extent permitted by law, NextMove will not be liable for indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits or data, arising from your use of the app.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
            <p className="mt-2">If you have questions about these terms, contact the project owner.</p>
            <div className="mt-4">
              <Link className="text-sm text-slate-700 underline hover:text-slate-900" href="/">
                Back to home
              </Link>
            </div>
          </section>
        </div>

        <p className="mt-8 text-xs text-slate-500">Last updated: {new Date().getFullYear()}</p>
      </div>
    </main>
  );
}
