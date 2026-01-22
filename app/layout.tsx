import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import HeaderAuth from "@/components/header-auth";

export const metadata = {
  title: "NextMove",
  description: "A lightweight decision assistant that helps you pick one clear next step—fast, with an explanation.",
  icons: { icon: "/icon.png" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-app text-slate-900 dark:text-slate-100">
        <header className="site-header">
          <div className="container flex items-center justify-between py-3">
            <Link href="/" className="flex items-center gap-3">
              {/* Logo badge: improves contrast/visibility on light backgrounds */}
              <span className="brand-badge" aria-hidden>
                <Image
                  src="/mark.png"
                  alt=""
                  width={26}
                  height={26}
                  priority
                  className="brand-mark"
                />
              </span>
              <div className="leading-tight">
                <div className="text-base font-extrabold tracking-tight">NextMove</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Decision Assistant</div>
              </div>
            </Link>

            <nav className="flex items-center gap-3 text-sm">
              <Link className="navlink" href="/app/decide">
                Open app
              </Link>
              <Link className="navlink" href="/privacy">
                Privacy
              </Link>
              <Link className="navlink" href="/terms">
                Terms
              </Link>
              <HeaderAuth />
            </nav>
          </div>
        </header>

        <main className="container py-8">{children}</main>

        <footer className="site-footer">
          <div className="container py-6 text-sm text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} NextMove · Decision Assistant
          </div>
        </footer>
      </body>
    </html>
  );
}
