import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="hero hero-grid">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="pill-row">
              <span className="pill">
                <span className="dot" /> Decision Assistant
              </span>
              <span className="pill">⚡ Reduce decision fatigue</span>
              <span className="pill">⏱️ 60 seconds to clarity</span>
            </div>

            <h1 className="hero-title">
              Decide your next move <br />
              <span className="hero-accent">with calm confidence.</span>
            </h1>

            <p className="hero-subtitle">Get one clear next step — fast.</p>

            <div className="hero-cta">
              <Link href="/app/decide" className="btn btn-primary">
                Start now
              </Link>
            </div>
          </div>

          <div className="hero-right">
            <div className="how-card">
              <div className="how-title">How it works</div>

              <div className="how-step">
                <div className="how-num">1</div>
                <div>
                  <div className="how-head">Pick a domain + mood</div>
                  <div className="how-desc">Work, health, relationships… and how you feel right now.</div>
                </div>
              </div>

              <div className="how-step">
                <div className="how-num">2</div>
                <div>
                  <div className="how-head">Add your goal</div>
                  <div className="how-desc">What outcome are you aiming for?</div>
                </div>
              </div>

              <div className="how-step">
                <div className="how-num">3</div>
                <div>
                  <div className="how-head">List a few tasks</div>
                  <div className="how-desc">Include benefit, energy cost, and how hard it feels.</div>
                </div>
              </div>

              <div className="how-step">
                <div className="how-num">4</div>
                <div>
                  <div className="how-head">Get one best next step</div>
                  <div className="how-desc">Plus alternatives — and a confidence check.</div>
                </div>
              </div>

              <div className="how-tip">
                <strong>Pro tip:</strong> Keep tasks action-based (e.g., “Draft 3 slides” not “Presentation”).
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-row">
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
