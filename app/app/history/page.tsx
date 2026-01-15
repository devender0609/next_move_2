"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type Row = {
  id: string;
  created_at: string;
  goal: string;
  recommendation: any;
  user_feedback: "helpful" | "not_helpful" | null;
};

export default function HistoryPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      .select("id, created_at, goal, recommendation, user_feedback")
      .order("created_at", { ascending: false })
      .limit(100);

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

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const total = rows.length;
    const helpful = rows.filter((r) => r.user_feedback === "helpful").length;
    const notHelpful = rows.filter((r) => r.user_feedback === "not_helpful").length;
    const rated = helpful + notHelpful;
    const helpfulRate = rated ? Math.round((helpful / rated) * 100) : 0;

    const top = new Map<string, number>();
    rows.forEach((r) => {
      const title = r.recommendation?.selectedTaskTitle;
      if (title) top.set(title, (top.get(title) || 0) + 1);
    });
    const top3 = [...top.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);

    return { total, rated, helpful, notHelpful, helpfulRate, top3 };
  }, [rows]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm text-slate-500">History</div>
          <h2 className="text-2xl font-semibold">What you decided</h2>
        </div>
        <Button variant="secondary" onClick={load} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {msg && <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">{msg}</div>}

      {!msg && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <div className="text-xs text-slate-500">Total saved</div>
              <div className="text-xl font-semibold">{stats.total}</div>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">Decisions saved to your account.</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-xs text-slate-500">Helpful rate</div>
              <div className="text-xl font-semibold">{stats.rated ? `${stats.helpfulRate}%` : "—"}</div>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">Based on {stats.rated} rated decisions.</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-xs text-slate-500">Top recommendations</div>
              <div className="text-sm text-slate-700 mt-2 space-y-1">
                {stats.top3.length ? (
                  stats.top3.map(([t, c]) => (
                    <div key={t} className="flex items-center justify-between gap-2">
                      <span className="truncate">{t}</span>
                      <Badge>{c}</Badge>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-500">No data yet</span>
                )}
              </div>
            </CardHeader>
          </Card>
        </div>
      )}

      <div className="space-y-3">
        {rows.map((r) => (
          <Card key={r.id}>
            <CardHeader className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs text-slate-500">{new Date(r.created_at).toLocaleString()}</div>
                <div className="text-sm text-slate-700 mt-1">
                  <span className="font-medium">Goal:</span> {r.goal}
                </div>
              </div>
              {r.user_feedback ? (
                <Badge
                  className={
                    r.user_feedback === "helpful"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }
                >
                  {r.user_feedback.replace("_", " ")}
                </Badge>
              ) : (
                <Badge>unrated</Badge>
              )}
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="text-lg font-semibold">{r.recommendation?.selectedTaskTitle ?? "—"}</div>
              <div className="text-sm text-slate-700">{r.recommendation?.rationale ?? ""}</div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button variant="secondary" size="sm" onClick={() => setFeedback(r.id, "helpful")}>
                  Helpful
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setFeedback(r.id, "not_helpful")}>
                  Not helpful
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {rows.length === 0 && !msg && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-lg font-semibold">No history yet</div>
              <p className="text-sm text-slate-600 mt-2">Save your first decision to see it here.</p>
              <div className="mt-4">
                <a
                  className="inline-flex rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800"
                  href="/app/decide"
                >
                  Create a decision
                </a>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
