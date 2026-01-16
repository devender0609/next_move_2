"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function TopNav() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nm_theme");
    const isDark = saved ? saved === "dark" : document.documentElement.classList.contains("dark");
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("nm_theme", next ? "dark" : "light");
  }

  return (
    <div className="flex items-center gap-6">
      <Link href="/app" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">App</Link>
      <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Pricing</Link>
      <Link href="/app/login" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Login</Link>

      <button
        type="button"
        onClick={toggle}
        className="rounded-full border px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
        aria-label="Toggle dark mode"
      >
        {dark ? "Light" : "Dark"}
      </button>
    </div>
  );
}
