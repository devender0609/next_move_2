"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setEmail(data.session?.user?.email ?? null);
      setLoading(false);
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setEmail(session?.user?.email ?? null);
      }
    );

    return () => {
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/app`,
      },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (loading) return null;

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      {!email ? (
        <>
          <h1 style={{ fontSize: 22, marginBottom: 12 }}>Log in</h1>

          <button
            onClick={loginWithGoogle}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Continue with Google
          </button>
        </>
      ) : (
        <>
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>
            Logged in
          </h1>

          <p style={{ marginBottom: 16 }}>{email}</p>

          <button
            onClick={logout}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Log out
          </button>
        </>
      )}
    </div>
  );
}
