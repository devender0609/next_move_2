import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Privacy Policy</h1>
        <p className="mt-2 text-slate-600">
          NextMove is designed to help you choose a clear next step with an explainable rationale.
          We aim to collect as little personal data as possible.
        </p>

        <div className="mt-8 space-y-6 text-slate-700">
          <section>
            <h2 className="text-lg font-semibold text-slate-900">What we collect</h2>
            <ul className="mt-2 list-disc pl-6">
              <li>
                <span className="font-medium">Decision inputs you type</span> (options, time, energy) are processed to generate a recommendation.
              </li>
              <li>
                <span className="font-medium">Account email</span> (if you choose to log in) so we can associate saved decisions with your account.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">How we use it</h2>
            <ul className="mt-2 list-disc pl-6">
              <li>To generate your recommendation and show the explanation.</li>
              <li>To save and retrieve your history (only if you log in).</li>
              <li>To improve product quality through aggregate, non-identifying usage patterns.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">Data retention</h2>
            <p className="mt-2">
              If you do not log in, decisions are meant to be ephemeral (in-session). If you log in and save decisions,
              they remain associated with your account until you delete them (when that feature is available) or request removal.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">Third-party services</h2>
            <p className="mt-2">
              If NextMove is configured with Supabase for authentication or storage, those services may process account and
              saved-decision data to operate the app.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
            <p className="mt-2">
              Questions? Reach out via the project owner. You can also return to the home page.
            </p>
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
