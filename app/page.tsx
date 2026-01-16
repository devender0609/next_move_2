import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container">
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-inner">
            <div>
              <div className="pill-row" aria-label="Product highlights">
                <span className="pill">
                  <span className="dot" /> Decision Assistant
                </span>
                <span className="pill">⚡ Reduce decision fatigue</span>
                <span className="pill">⏱️ 60 seconds to clarity</span>
              </div>

              <h1 className="hero-title">
                Decide your next move{" "}
                <span className="hero-accent">with calm confidence.</span>
              </h1>

              <p className="hero-subtitle">One clear next step — fast.</p>

              <div className="hero-cta">
                <Link className="btn btn-primary" href="/app/decide">
                  Start now
                </Link>
              </div>
            </div>

            <div className="how-card" aria-label="How it works">
              <div className="how-title">How it works</div>

              <div className="how-step">
                <div className="how-num">1</div>
                <div>
                  <div className="how-head">Pick a domain + mood</div>
                  <div className="how-desc">
                    Work, health, relationships… plus how you feel right now.
                  </div>
                </div>
              </div>

              <div className="how-step">
                <div className="how-num">2</div>
                <div>
                  <div className="how-head">Add your goal</div>
                  <div className="how-desc">Keep it short. Outcome-focused.</div>
                </div>
              </div>

              <div className="how-step">
                <div className="how-num">3</div>
                <div>
                  <div className="how-head">List a few options</div>
                  <div className="how-desc">
                    Benefit, energy cost, and how hard it feels to start.
                  </div>
                </div>
              </div>

              <div className="how-step">
                <div className="how-num">4</div>
                <div>
                  <div className="how-head">Get one best next step</div>
                  <div className="how-desc">
                    With a clear “why” + two alternatives.
                  </div>
                </div>
              </div>

              <div className="how-tip">
                Pro tip: Write actions, not projects (e.g., “Text Alex to check in”).
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-row" aria-label="Key features">
        <div className="feature-card">
          <div className="feature-title">Clear recommendations</div>
          <div className="feature-desc">One best next step, plus a couple smart alternatives.</div>
        </div>
        <div className="feature-card">
          <div className="feature-title">Daily focus</div>
          <div className="feature-desc">Build momentum with simple streaks (optional).</div>
        </div>
        <div className="feature-card">
          <div className="feature-title">Track what works</div>
          <div className="feature-desc">Save outcomes to learn patterns over time.</div>
        </div>
      </section>
    </div>
  );
}
