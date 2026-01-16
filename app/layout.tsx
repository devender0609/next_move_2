import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "NextMove",
  description: "Decision Assistant",
};

function ThemeScript() {
  // Sets initial theme before paint (prevents flash)
  const code = `
(function () {
  try {
    var saved = localStorage.getItem("nm_theme");
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = saved || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <header className="site-header">
          <div className="header-inner">
            <Link href="/" className="brand" aria-label="NextMove Home">
              <Image
                src="/logo.png"
                alt="NextMove logo"
                width={28}
                height={28}
                priority
              />
              <div className="brand-text">
                <div className="brand-title">NextMove</div>
                <div className="brand-sub">Decision Assistant</div>
              </div>
            </Link>

            <nav className="top-nav" aria-label="Top navigation">
              <Link className="nav-link" href="/app">
                App
              </Link>
              <Link className="nav-link" href="/pricing">
                Pricing
              </Link>
              <Link className="nav-link" href="/app/login">
                Login
              </Link>
              <button
                className="nav-link"
                type="button"
                onClick={() => {
                  const cur = document.documentElement.getAttribute("data-theme") || "light";
                  const next = cur === "dark" ? "light" : "dark";
                  document.documentElement.setAttribute("data-theme", next);
                  try {
                    localStorage.setItem("nm_theme", next);
                  } catch {}
                }}
                aria-label="Toggle dark mode"
              >
                Dark
              </button>
            </nav>
          </div>
        </header>

        <main className="main">{children}</main>

        <footer className="site-footer">
          <div className="container">
            © {new Date().getFullYear()} NextMove · Decision Assistant
          </div>
        </footer>
      </body>
    </html>
  );
}
