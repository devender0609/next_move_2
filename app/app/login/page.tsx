"use client";

import { useState } from "react";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loginWithGoogle() {
    setLoading(true);
    const supabase = supabaseBrowser();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });
  }

  async function sendMagicLink() {
    setLoading(true);
    setMessage(null);

    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) setMessage(error.message);
    else setMessage("Check your email for a login link.");
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <Image
        src="/logo.png"
        alt="NextMove logo"
        width={48}
        height={48}
        className="mx-auto mb-4"
      />

      <h1 className="text-2xl font-semibold text-center">
        Welcome to NextMove
      </h1>
      <p className="mt-2 text-center text-slate-600 text-sm">
        Login to save your decisions. No passwords required.
      </p>

      <div className="mt-6 space-y-3">
        <button
          onClick={loginWithGoogle}
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-white hover:opacity-95"
        >
          Continue with Google
        </button>

        <div className="text-center text-xs text-slate-500">or</div>

        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2"
        />

        <button
          onClick={sendMagicLink}
          disabled={loading || !email}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 hover:bg-slate-100"
        >
          Email me a login link
        </button>

        {message && (
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
