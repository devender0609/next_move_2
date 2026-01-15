import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export const metadata = {
  title: "NextMove",
  description: "Decision assistant to reduce overthinking and move forward.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="NextMove logo" width={32} height={32} priority />
              <span className="text-lg font-semibold tracking-tight">NextMove</span>
            </Link>

            <nav className="flex items-center gap-4 text-sm">
              <Link href="/app" className="hover:underline">App</Link>
              <Link href="/pricing" className="hover:underline">Pricing</Link>
              <DarkModeToggle />
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

        {/* Footer background matches page, no white strip */}
        <footer className="mt-12 py-6">
          <div className="mx-auto max-w-6xl px-4 text-sm" style={{ color: "rgb(var(--muted))" }}>
            © {new Date().getFullYear()} NextMove · Decision Assistant
          </div>
        </footer>
      </body>
    </html>
  );
}