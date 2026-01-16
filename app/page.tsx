import Link from "next/link";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-skin bg-surface/60 px-3 py-1 text-xs text-muted shadow-sm">
      <span className="h-2 w-2 rounded-full bg-accent" />
      {children}
    </span>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="card p-5">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm text-muted">{desc}</div>
    </div>
  );
}

function HeroGraphics() {
  // Pure SVG “graphics” so you don’t need extra files.
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      {/* subtle grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.18] dark:opacity-[0.12]" viewBox="0 0 800 400" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(99,102,241,0.35)" />
            <stop offset="0.55" stopColor="rgba(168,85,247,0.22)" />
            <stop offset="1" stopColor="rgba(34,211,238,0.18)" />
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill="url(#wash)" />
        <rect width="800" height="400" fill="url(#grid)" />
      </svg>

      {/* floating blobs */}
      <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-accent/25 blur-3xl" />
      <div className="absolute -right-20 top-6 h-72 w-72 rounded-full bg-accent2/25 blur-3xl" />
      <div className="absolute left-1/3 -bottom-28 h-72 w-72 rounded-full bg-accent3/20 blur-3xl" />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-skin bg-surface shadow-soft">
        <HeroGraphics />

        <div className="relative grid gap-8 p-6 md:grid-cols-2 md:p-10">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge>Decision Assistant</Badge>
              <Badge>Reduce decision fatigue</Badge>
              <Badge>60 seconds to clarity</Badge>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl">
              Decide your next move{" "}
              <span className="bg-gradient-to-r from-[rgb(99,102,241)] via-[rgb(168,85,247)] to-[rgb(34,211,238)] bg-clip-text text-transparent">
                with calm confidence
              </span>
              .
            </h1>

            <p className="mt-4 max-w-xl text-base text-muted md:text-lg">
              Get one clear next step — fast.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/app/decide" className="btn-primary">
                Start now
              </Link>
              <Link href="#how-it-works" className="btn-secondary">
                How it works
              </Link>
            </div>

            <div className="mt-6 text-xs text-muted">
              No pressure to log in. Use it instantly — log in only if you want to save history.
            </div>
          </div>

          {/* HOW IT WORKS box */}
          <div id="how-it-works" className="card p-6 md:p-7">
            <div className="text-sm font-semibold">How it works</div>

            <div className="mt-4 space-y-3">
              {[
                { n: "1", t: "Pick a domain + mood", d: "Work, health, relationships… and how you feel right now." },
                { n: "2", t: "Add your goal", d: "What outcome are you aiming for?" },
                { n: "3", t: "List a few tasks", d: "Include effort, impact, and emotional friction." },
                { n: "4", t: "Get one best next step", d: "Plus alternatives — and a confidence check." },
              ].map((x) => (
                <div key={x.n} className="flex items-start gap-3 rounded-2xl border border-skin bg-surface2 px-4 py-3">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-accent text-white text-sm font-bold">
                    {x.n}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{x.t}</div>
                    <div className="text-sm text-muted">{x.d}</div>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-skin bg-surface2 px-4 py-3 text-sm text-muted">
                Pro tip: Keep tasks action-based (e.g., “Draft 3 slides” not “Presentation”).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE CARDS */}
      <section className="grid gap-4 md:grid-cols-3">
        <FeatureCard title="Clear recommendations" desc="One best next step, plus a couple smart alternatives." />
        <FeatureCard title="Daily focus" desc="Build momentum with simple streaks (optional)." />
        <FeatureCard title="Track what works" desc="Save outcomes to learn patterns over time." />
      </section>
    </div>
  );
}
