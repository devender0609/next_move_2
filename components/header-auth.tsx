"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

function truncateEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const safeUser = user.length > 10 ? `${user.slice(0, 7)}…` : user;
  return `${safeUser}@${domain}`;
}

export default function HeaderAuth() {
  // Use the browser (client-side) Supabase singleton
  const supabase = useMemo(() => supabaseBrowser(), []);
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setEmail(data.session?.user?.email ?? null);
      setLoading(false);
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const onLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (loading) {
    return <div className="nav-auth-skeleton" aria-hidden="true" />;
  }

  if (!email) {
    return (
      <Link className="navlink" href="/app/login">
        Login
      </Link>
    );
  }

  return (
    <div className="nav-auth">
      <span className="nav-auth-email" title={email}>
        {truncateEmail(email)}
      </span>
      <button className="nav-auth-logout" type="button" onClick={onLogout}>
        Log out
      </button>
    </div>
  );
}
