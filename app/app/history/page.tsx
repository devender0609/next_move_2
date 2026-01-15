"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

type Row = {
  id: string;
  created_at: string;
  goal: string;
  recommendation: any;
  tasks: any[];
  user_feedback: "helpful" | "not_helpful" | null;
};

export default function HistoryPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tagFilter, setTagFilter] = useState("");

  async function load() {
    setMsg(null);
    setLoading(true);

    const supabase = supabaseBrowser();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setLoading(false);
      setMsg("Please login first (App → Login).");
      return;
    }

    const { data, error } = await supabase
      .from("decisions")
      .select("id, created_at, goal, recommendation, tasks, user_feedback")
      .order("created_at", { ascending: false })
      .limit(200);

    setLoading(false);
    if (error) setMsg(error.message);
    else setRows((data as any) || []);
  }

  async function setFeedback(id: string, val: "helpful" | "not_helpful") {
    const supabase = supabaseBrowser();
    const { error } = await supabase.from("decisions").update({ user_feedback: val }).eq("id", id);
    if (error) setMsg(error.message);
    else load();
  }

  const allTags = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => {
      (r.tasks || []).forEach((t: any) => (t.tags || []).forEach((x: string) => s.add(x)));
    });
    return Array.from(s).sort();
  }, [rows]);

  const filtered = useMemo(() => {
    if (!tagFilter) return rows;
    return rows.filter((r) =>
      (r.tasks || []).some((t: any) => (t.tags || []).includes(tagFilter))
    );
  }, [rows, tagFilter]);

  function exportCSV() {
    const headers = ["created_at", "goal", "selected_task", "confidence", "feedback", "tags"];
    const lines = [headers.join(",")];

    filtered.forEach((r) => {
      const selected = r.recommendation?.selectedTaskTitle ?? "";
      const conf = r.recommendation?.confidence ?? "";
      const feedback = r.user_feedback ?? "";
      const tags = Array.from(
        new Set((r.tasks || []).flatMap((t: any) => (t.tags || [])))
      ).join("|");

      const row = [
        r.created_at,
        `"${String(r.goal).replaceAll('"', '""')}"`,
        `"${String(selected).replaceAll('"', '""')}"`,
        conf,
        feedback,
        `"${tags.replaceAll('"', '""')}"`,
      ];
      lines.push(row.join(","));
    });

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nextmove_history_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm" style={{ color: "rgb(var(--muted))" }}>History</div>
          <h2 className="text-2xl font-semibold">What you decided</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={load}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button
            onClick={exportCSV}
            className="rounded-xl px-4 py-2 text-sm text-white gradient-brand hover:opacity-95"
            disabled={!filtered.length}
          >
            Export CSV
          </button>
        </div>
      </div>

      {msg && <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-900">{msg}</div>}

      <div className="flex flex-wrap items-center gap-2">
        <div className="text-sm font-semibold">Filter by tag:</div>
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <option value="">All</option>
          {allTags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <div className="text-xs" style={{ color: "rgb(var(--muted))" }}>
          Showing {filtered.length} of {rows.length}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs" style={{ color: "rgb(var(--muted))" }}>
              {new Date(r.created_at).toLocaleString()}
            </div>
            <div className="mt-1 text-sm">
              <span className="font-medium">Goal:</span> {r.goal}
            </div>

            <div className="mt-3 text-lg font-semibold">
              {r.recommendation?.selectedTaskTitle ?? "—"}
            </div>
            <div className="text-sm mt-1">{r.recommendation?.rationale ?? ""}</div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setFeedback(r.id, "helpful")}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800"
              >
                Helpful
              </button>
              <button
                onClick={() => setFeedback(r.id, "not_helpful")}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800"
              >
                Not helpful
              </button>
            </div>
          </div>
        ))}

        {!filtered.length && !msg && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="text-lg font-semibold">No history yet</div>
            <p className="text-sm mt-2" style={{ color: "rgb(var(--muted))" }}>
              Save your first decision to see it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
