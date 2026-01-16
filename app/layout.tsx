import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

export const metadata: Metadata = {
  title: "NextMove",
  description: "Decision Assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Theme boot + toggle handler (no extra component files needed) */}
        <Script id="theme-boot" strategy="beforeInteractive">{`
          (function () {
            try {
              var saved = localStorage.getItem('nm_theme');
              var theme = saved || 'light';
              document.documentElement.setAttribute('data-theme', theme);
            } catch(e) {}
          })();
        `}</Script>

        <Script id="theme-toggle" strategy="afterInteractive">{`
          (function () {
            function setTheme(next) {
              document.documentElement.setAttribute('data-theme', next);
              try { localStorage.setItem('nm_theme', next); } catch(e) {}
              var btn = document.getElementById('nm-theme-btn');
              if (btn) btn.textContent = (next === 'dark') ? 'Light' : 'Dark';
            }

            function init() {
              var current = document.documentElement.getAttribute('data-theme') || 'light';
              var btn = document.getElementById('nm-theme-btn');
              if (btn) btn.textContent = (current === 'dark') ? 'Light' : 'Dark';

              document.addEventListener('click', function (e) {
                var t = e.target;
                if (!t) return;
                if (t.id === 'nm-theme-btn') {
                  var cur = document.documentElement.getAttribute('data-theme') || 'light';
                  setTheme(cur === 'dark' ? 'light' : 'dark');
                }
              });
            }

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', init);
            } else {
              init();
            }
          })();
        `}</Script>

        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="brand">
              <Image src="/logo.png" alt="NextMove logo" width={34} height={34} priority />
              <div className="brand-text">
                <div className="brand-title">NextMove</div>
                <div className="brand-sub">Decision Assistant</div>
              </div>
            </Link>

            <nav className="top-nav">
              <Link className="nav-link" href="/app/decide">App</Link>
              <Link className="nav-link" href="/pricing">Pricing</Link>
              <Link className="nav-link" href="/app/login">Login</Link>
              <button id="nm-theme-btn" className="btn btn-ghost" type="button">
                Dark
              </button>
            </nav>
          </div>
        </header>

        <main className="container main">{children}</main>

        {/* ✅ Single footer (global) */}
        <footer className="site-footer">
          <div className="container">
            © {new Date().getFullYear()} NextMove · Decision Assistant
          </div>
        </footer>
      </body>
    </html>
  );
}
