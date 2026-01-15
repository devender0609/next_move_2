import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "NextMove",
  description: "Decision assistant to reduce overthinking and move forward.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="NextMove logo"
                width={32}
                height={32}
                priority
              />
              <span className="text-lg font-semibold tracking-tight">
                NextMove
              </span>
            </Link>

            <nav className="flex items-center gap-4 text-sm text-slate-700">
              <Link href="/app" className="hover:underline">
                App
              </Link>
              <Link href="/pricing" className="hover:underline">
                Pricing
              </Link>
              <Link
                href="/app/decide"
                className="rounded-xl px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-sm hover:opacity-95"
              >
                Try it
              </Link>
            </nav>
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto max-w-6xl px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-600">
            © {new Date().getFullYear()} NextMove · Decision Assistant
          </div>
        </footer>
      </body>
    </html>
  );
}
