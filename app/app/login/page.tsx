"use client";

import { useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState<"google" | "email" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setBusy("google");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // After Google sign-in, return the user to the app.
          redirectTo: `${baseUrl}/app`,
        },
      });
      if (error) throw error;
    } catch (e: any) {
      setError(e?.message ?? "Google sign-in failed.");
      setBusy(null);
    }
  };

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setBusy("email");
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${baseUrl}/app/login`,
        },
      });
      if (error) throw error;
      setSent(true);
    } catch (e: any) {
      setError(e?.message ?? "Email sign-in failed.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <main className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <h1 style={{ marginBottom: 6 }}>Login</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        Use Gmail (Google) or an email magic link.
      </p>

      <div className="card" style={{ maxWidth: 520, padding: 18, marginTop: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={signInWithGoogle}
            disabled={busy !== null}
            aria-busy={busy === "google"}
            style={{
              justifyContent: "center",
              gap: 10,
              borderRadius: 9999,
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <span className="gmark" aria-hidden="true">
              G
            </span>
            {busy === "google" ? "Opening Google…" : "Continue with Google"}
          </button>

          <div className="divider" aria-hidden="true" />

          {sent ? (
            <div className="note">
              Check your email for a sign-in link.
              <div className="muted" style={{ marginTop: 6 }}>
                You can close this page after clicking the link.
              </div>
            </div>
          ) : (
            <form onSubmit={sendMagicLink} className="form" style={{ gap: 10 }}>
              <label className="label">
                Email
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  required
                />
              </label>

              <button
                className="btn btn-primary"
                type="submit"
                disabled={!email || busy !== null}
                aria-busy={busy === "email"}
              >
                {busy === "email" ? "Sending…" : "Send magic link"}
              </button>
            </form>
          )}

          {error ? (
            <div className="note" role="alert" style={{ borderColor: "#fca5a5" }}>
              {error}
            </div>
          ) : null}
        </div>
      </div>

      <div className="muted" style={{ maxWidth: 720, marginTop: 12 }}>
        <strong>Supabase setup:</strong> Enable the <em>Google</em> provider in Supabase
        Auth and add your Vercel URL to Redirect URLs.
      </div>
    </main>
  );
}
