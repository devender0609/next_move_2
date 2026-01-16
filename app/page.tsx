import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="hero hero-grid">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="pill-row">
              <span className="pill">
                <span className="dot" /> Clarity & momentum
              </span>
              <span className="pill">⏱️ 60 seconds</span>
              <span className="pill">✅ One next step</span>
            </div>

            <h1 className="hero-title">
              Decide your next move <br />
              <span className="hero-accent">with calm confidence.</span>
            </h1>

            <p className="hero-subtitle">
              Turn “I should…” into one clear next action — sized to your time and energy.
            </p>

            <div className="hero-cta">
              <Link href="/app/decide" className="btn btn-primary">
                Start now
              </Link>
              <Link href="/app/history" className="btn btn-ghost">
                See examples
              </Link>
            </div>

            <div className="micro-proof">
              Transparent logic • No overwhelm • Works for work, health, relationships, money
            </div>
          </div>

          <div className="hero-right">
            <div className="how-card">
              <div className="how-title">How it works</div>

              <div className="how-step">
                <div className="how-num">1</div>
                <div>
                  <div className="how-head">Set your situation</div>
                  <div className="how-desc">Goal + time + energy (that’s it).</div>
                </div>
              </div>

              <div className="how-step">
                <div className="how-num">2</div>
                <div>
                  <div className="how-head">List 3–6 options</div>
                  <div className="how-desc">Use templates if you want. Edit in seconds.</div>
                </div>
              </div>

              <div className="how-step">
                <div className="how-num">3</div>
                <div>
                  <div className="how-head">Get one next step</div>
                  <div className="how-desc">With a clear “why” and 2 alternatives.</div>
                </div>
              </div>

              <div className="how-tip">
                <strong>Pro tip:</strong> Write actions, not projects (e.g., “Text Alex to check in”).
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-row">
        <div className="feature-card">
          <div className="feature-title">Simple, explainable</div>
          <div className="feature-desc">You can see why a step was chosen — no mystery.</div>
        </div>

        <div className="feature-card">
          <div className="feature-title">Sized to your energy</div>
          <div className="feature-desc">Low-energy days still get a meaningful win.</div>
        </div>

        <div className="feature-card">
          <div className="feature-title">Learn what works</div>
          <div className="feature-desc">Save outcomes to build better instincts over time.</div>
        </div>
      </section>
    </div>
  );
}
