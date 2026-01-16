import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "NextMove · Decision Assistant",
  description: "Decision clarity in under a minute.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-app text-app">
        <header className="sticky top-0 z-50 border-b border-skin bg-surface/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="NextMove logo"
                width={34}
                height={34}
                priority
                className="rounded-md"
              />
              <div className="leading-tight">
                <div className="text-base font-semibold tracking-tight">NextMove</div>
                <div className="text-xs text-muted">Decision Assistant</div>
              </div>
            </Link>

            <nav className="flex items-center gap-2">
              <Link href="/app/decide" className="btn-ghost">
                App
              </Link>
              <Link href="/pricing" className="btn-ghost">
                Pricing
              </Link>
              <Link href="/app/login" className="btn-ghost">
                Login
              </Link>
              <button className="btn-ghost" type="button" aria-label="Toggle theme">
                Dark
              </button>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

        {/* Single footer globally (so it never duplicates on pages) */}
        <footer className="border-t border-skin">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted">
            © {new Date().getFullYear()} NextMove · Decision Assistant
          </div>
        </footer>
      </body>
    </html>
  );
}