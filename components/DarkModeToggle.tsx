"use client";

import { useEffect, useState } from "react";

export function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nm_theme");
    const isDark = saved === "dark";
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
    <button
      onClick={toggle}
      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
}
