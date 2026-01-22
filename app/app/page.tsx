import Link from "next/link";

export default function AppHome() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/app/decide" className="card card-link">
          <div className="card-title">New decision</div>
          <div className="card-sub">Pick one best next step with a clear explanation.</div>
          <div className="card-cta">Open →</div>
        </Link>

        <Link href="/app/history" className="card card-link">
          <div className="card-title">History</div>
          <div className="card-sub">See saved decisions (login required to save).</div>
          <div className="card-cta">View →</div>
        </Link>
      </div>
    </div>
  );
}
