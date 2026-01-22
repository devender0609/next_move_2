import Link from "next/link";
import Image from "next/image";

function Sparkle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l1.7 6.2L20 10l-6.3 1.8L12 18l-1.7-6.2L4 10l6.3-1.8L12 2z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-badge">
              <span className="inline-flex items-center gap-2">
                <Sparkle />
                Simple. Explainable. Fast.
              </span>
            </div>

            <h1 className="hero-title">
              Decide your next move
              <span className="hero-title-accent"> with calm confidence.</span>
            </h1>

            <p className="hero-sub">
              Drop in a few options. NextMove picks one best next step—sized to your time and energy—with a clear rationale.
            </p>

            <div className="mt-6 flex gap-3 flex-wrap">
              <Link className="btn btn-primary" href="/app/decide">
                Open NextMove
              </Link>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="visual-card">
              <div className="visual-top">
                <div className="visual-dot" />
                <div className="visual-dot" />
                <div className="visual-dot" />
              </div>
              <div className="visual-title">Example</div>

              <div className="visual-row">
                <div className="visual-chip">Call dentist</div>
                <div className="visual-score">Impact 4</div>
              </div>
              <div className="visual-row">
                <div className="visual-chip">Finish slides</div>
                <div className="visual-score">Impact 5</div>
              </div>
              <div className="visual-row">
                <div className="visual-chip">Laundry</div>
                <div className="visual-score">Impact 2</div>
              </div>

              <div className="visual-result">
                <div className="visual-result-title">Recommendation</div>
                <div className="visual-result-main">Finish slides</div>
                <div className="visual-result-sub">High impact, good time-fit.</div>
              </div>
            </div>

            <div className="visual-glow" />
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="how-card">
          <div className="how-title">How it works</div>
          <ol className="how-list">
            <li>
              <span className="how-step">1</span>
              Add 3–6 options (keep them concrete).
            </li>
            <li>
              <span className="how-step">2</span>
              Set your time + energy.
            </li>
            <li>
              <span className="how-step">3</span>
              Get a recommendation with rationale + alternatives.
            </li>
          </ol>

        </div>
      </section>
    </div>
  );
}
