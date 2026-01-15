"use client";

import { useState } from "react";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`;

  async function googleLogin() {
    setBusy(true);
    setMsg(null);

    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    setBusy(false);
    if (error) setMsg(error.message);
  }

  async function sendMagicLink() {
    setBusy(true);
    setMsg(null);

    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    setBusy(false);
    if (error) setMsg(error.message);
    else setMsg("✅ Check your email for a login link.");
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <Image src="/logo.png" alt="NextMove logo" width={56} height={56} className="mx-auto mb-4" />

      <h1 className="text-2xl font-semibold text-center">Welcome</h1>
      <p className="mt-2 text-center text-sm" style={{ color: "rgb(var(--muted))" }}>
        Login to save decisions and track your progress. No passwords.
      </p>

      <div className="mt-6 space-y-3">
        <button
          onClick={googleLogin}
          disabled={busy}
          className="w-full rounded-xl px-4 py-2 text-white gradient-brand shadow-sm hover:opacity-95 disabled:opacity-60"
        >
          Continue with Google
        </button>

        <div className="text-center text-xs" style={{ color: "rgb(var(--muted))" }}>or</div>

        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950"
        />

        <button
          onClick={sendMagicLink}
          disabled={busy || !email}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm hover:bg-slate-100 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          Email me a login link
        </button>

        {msg && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-center dark:border-slate-800 dark:bg-slate-800">
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
