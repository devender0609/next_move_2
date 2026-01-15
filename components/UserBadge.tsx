"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export function UserBadge() {
  const [email, setEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const supabase = supabaseBrowser();

      // Initial fetch
      const { data } = await supabase.auth.getUser();
      if (mounted) setEmail(data.user?.email ?? null);

      // Subscribe to auth changes
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        setEmail(session?.user?.email ?? null);
      });

      return () => {
        sub.subscription.unsubscribe();
      };
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function logout() {
    setBusy(true);
    try {
      const supabase = supabaseBrowser();
      await supabase.auth.signOut();
      setEmail(null);
    } finally {
      setBusy(false);
    }
  }

  if (!email) {
    return (
      <LinkLike href="/app/login" label="Login" />
    );
  }

  return (
    <div className="hidden md:flex items-center gap-2">
      <div className="max-w-[220px] truncate text-xs text-slate-600 dark:text-slate-300">
        {email}
      </div>
      <button
        onClick={logout}
        disabled={busy}
        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800"
      >
        Logout
      </button>
    </div>
  );
}

function LinkLike({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="hidden md:inline-flex rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
    >
      {label}
    </a>
  );
}
