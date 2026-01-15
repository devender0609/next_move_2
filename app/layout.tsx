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
              <Image src="/logo.png" alt="NextMove logo" width={34} height={34} priority />
              <div className="leading-tight">
                <div className="text-base font-semibold tracking-tight">NextMove</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Decision Assistant</div>
              </div>
            </Link>

            <nav className="flex items-center gap-4 text-sm text-slate-700 dark:text-slate-200">
              <Link href="/app" className="hover:text-slate-900 dark:hover:text-white">App</Link>
              <Link href="/pricing" className="hover:text-slate-900 dark:hover:text-white">Pricing</Link>
              <DarkModeToggle />
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

        <footer className="mt-12 py-6">
          <div className="mx-auto max-w-6xl px-4 text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} NextMove · Decision Assistant
          </div>
        </footer>
      </body>
    </html>
  );
}
