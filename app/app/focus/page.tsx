"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

type FocusItem = {
  id: string;
  date: string;
  title: string;
  done: boolean;
};

export default function FocusPage() {
  const [items, setItems] = useState<FocusItem[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  async function load() {
    setMsg(null);
    const supabase = supabaseBrowser();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setMsg("Login to use Daily Focus (App → Login).");
      return;
    }

    const { data, error } = await supabase
      .from("focus_items")
      .select("id,date,title,done")
      .eq("date", today)
      .order("created_at", { ascending: true });

    if (error) setMsg(error.message);
    else setItems((data as any) || []);
  }

  async function toggleDone(id: string, done: boolean) {
    const supabase = supabaseBrowser();
    await supabase.from("focus_items").update({ done }).eq("id", id);
    load();
  }

  const streak = useMemo(async () => {
    // streak computed server-side later; keep simple UI for now
    return 0;
  }, []);

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm" style={{ color: "rgb(var(--muted))" }}>Daily Focus</div>
        <h2 className="text-2xl font-semibold">Today’s checklist</h2>
        <p className="text-sm mt-1" style={{ color: "rgb(var(--muted))" }}>
          Keep it small. Win the day.
        </p>
      </div>

      {msg && <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-900">{msg}</div>}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 dark:border-slate-800 dark:bg-slate-900">
        {items.length === 0 ? (
          <div className="text-sm" style={{ color: "rgb(var(--muted))" }}>
            No items yet. Add one from “New decision” by saving a recommendation, or add rows directly in DB.
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800">
                <div className="font-medium">{it.title}</div>
                <button
                  onClick={() => toggleDone(it.id, !it.done)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold ${it.done ? "text-white gradient-brand" : "border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950"}`}
                >
                  {it.done ? "Done" : "Mark done"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
