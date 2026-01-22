"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      focusable="false"
    >
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.6-6 5.9-6c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.7 3.6 14.6 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12S6.9 21.3 12 21.3c6 0 9-4.2 9-6.4 0-.4-.1-.7-.1-1H12z"
      />
      <path
        fill="#34A853"
        d="M3.9 7.7l3.2 2.3C7.9 8 9.8 6.6 12 6.6c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.7 3.6 14.6 2.7 12 2.7 8.4 2.7 5.3 4.8 3.9 7.7z"
        opacity=".001"
      />
      <path
        fill="#4285F4"
        d="M21 12c0-.4-.1-.7-.1-1H12v3.9h5.4c-.3 1.6-1.9 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6 0-1 .3-2 .8-2.8L3.9 7.7C3.2 9 2.8 10.5 2.8 12c0 5.2 4.1 9.3 9.2 9.3 6 0 9-4.2 9-6.4z"
        opacity=".001"
      />
      <path
        fill="#FBBC05"
        d="M12 21.3c2.6 0 4.8-.9 6.4-2.4l-3.1-2.5c-.8.6-1.9 1-3.3 1-2.5 0-4.7-1.7-5.5-4l-3.3 2.5c1.4 3.2 4.6 5.4 8.8 5.4z"
        opacity=".001"
      />
    </svg>
  );
}

export default function LoginPage() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "";

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSessionEmail(data.session?.user?.email ?? null);
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user?.email ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  async function signInWithGoogle() {
    setBusy(true);
    setMsg(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // After Google auth, land in the app
        redirectTo: `${origin}/app`,
      },
    });

    // OAuth redirects away on success; reaching here usually means error.
    setBusy(false);
    if (error) setMsg(error.message);
  }

  async function sendLink() {
    setBusy(true);
    setMsg(null);

    const redirectTo = `${origin}/app/login`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    setBusy(false);
    if (error) setMsg(error.message);
    else setMsg("Magic link sent! Check your email.");
  }

  async function logout() {
    setBusy(true);
    setMsg(null);
    await supabase.auth.signOut();
    setSessionEmail(null);
    setBusy(false);
    setMsg("Logged out.");
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white/75 p-8 shadow-sm backdrop-blur">
        <div className="mb-6">
          <div className="text-xs font-semibold tracking-wide text-slate-500">
            NextMove
          </div>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Log in
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Use Google for the quickest sign-in, or request a magic link.
          </p>
        </div>

        {sessionEmail && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            You’re already signed in as{" "}
            <span className="font-medium">{sessionEmail}</span>.
          </div>
        )}

        <button
          className="group flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-900 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
          onClick={signInWithGoogle}
          disabled={busy}
        >
          <span className="flex items-center justify-center rounded-full border border-slate-200 bg-white p-1">
            <GoogleIcon />
          </span>
          <span>{busy ? "Opening Google…" : "Continue with Google"}</span>
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <div className="text-xs font-medium text-slate-500">OR</div>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-800">
            Email (magic link)
          </label>

          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
            placeholder="you@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputMode="email"
            autoComplete="email"
          />

          <button
            className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
            onClick={sendLink}
            disabled={busy || !email.includes("@")}
          >
            {busy ? "Sending…" : "Send magic link"}
          </button>

          {sessionEmail && (
            <button
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-800 transition hover:bg-slate-50 disabled:opacity-60"
              onClick={logout}
              disabled={busy}
            >
              Log out
            </button>
          )}
        </div>

        {msg && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
