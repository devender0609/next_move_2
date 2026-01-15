"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const path = usePathname();

  const items = [
    { href: "/app", label: "Home" },
    { href: "/app/decide", label: "Decide" },
    { href: "/app/focus", label: "Focus" },
    { href: "/app/history", label: "History" },
    { href: "/app/login", label: "Login" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 lg:hidden">
      <div className="mx-auto max-w-6xl px-3 py-2 flex justify-between">
        {items.map((it) => {
          const active = path === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`px-2 py-2 text-xs rounded-xl ${active ? "text-white gradient-brand" : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"}`}
            >
              {it.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}