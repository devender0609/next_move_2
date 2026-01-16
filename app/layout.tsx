// app/app/layout.tsx
import Link from "next/link";
import Image from "next/image";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar-card" aria-label="App navigation">
        <div className="sidebar-brand">
          <Link href="/app" className="brand-link" aria-label="Go to app overview">
            <Image src="/logo.png" alt="NextMove" width={28} height={28} priority />
            <div className="brand-text">
              <div className="brand-title">NextMove</div>
              <div className="brand-subtitle">Decision Assistant</div>
            </div>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <Link className="side-link" href="/app">
            Overview
          </Link>
          <Link className="side-link" href="/app/decide">
            New decision
          </Link>
          <Link className="side-link" href="/app/focus">
            Daily focus
          </Link>
          <Link className="side-link" href="/app/history">
            History
          </Link>
          <Link className="side-link" href="/app/login">
            Login
          </Link>
        </nav>
      </aside>

      <main className="app-main" role="main">
        {children}
      </main>
    </div>
  );
}
