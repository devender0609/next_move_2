"use client";

import { useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { Recommendation, TaskInput } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";

type Template = {
  name: string;
  goal: string;
  timeMinutes: number;
  energy: number;
  tasks: TaskInput[];
};

const templates: Template[] = [
  {
    name: "Deep work",
    goal: "Make meaningful progress on the highest-impact work.",
    timeMinutes: 60,
    energy: 4,
    tasks: [
      { title: "Draft key section / outline", impact: 5, effort: 4, anxiety: 3 },
      { title: "Revise existing content", impact: 4, effort: 3, anxiety: 2 },
      { title: "Admin messages", impact: 2, effort: 2, anxiety: 2 },
    ],
  },
  {
    name: "Admin cleanup",
    goal: "Clear the backlog and reduce mental load.",
    timeMinutes: 30,
    energy: 3,
    tasks: [
      { title: "Reply to urgent emails", impact: 4, effort: 2, anxiety: 2 },
      { title: "Schedule / calendar cleanup", impact: 3, effort: 2, anxiety: 2 },
      { title: "File / document organization", impact: 2, effort: 2, anxiety: 1 },
    ],
  },
  {
    name: "Quick wins",
    goal: "Do something useful even with low energy.",
    timeMinutes: 20,
    energy: 2,
    tasks: [
      { title: "One small task I’ve been avoiding", impact: 3, effort: 2, anxiety: 4 },
      { title: "Tidy workspace / notes", impact: 2, effort: 1, anxiety: 1 },
      { title: "Plan next 3 steps", impact: 4, effort: 2, anxiety: 2 },
    ],
  },
];

function ScorePill({ label, value }: { label: string; value: number }) {
  const tone =
    value >= 4
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : value === 3
      ? "bg-slate-50 text-slate-700 border-slate-200"
      : "bg-amber-50 text-amber-800 border-amber-200";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${tone}`}>
      <span className="text-[10px] uppercase tracking-wide">{label}</span>
      <span className="font-semibold">{value}</span>
    </span>
  );
}

function TaskCard({
  t,
  onChange,
  onRemove,
}: {
  t: TaskInput;
  onChange: (patch: Partial<TaskInput>) => void;
  onRemove: () => void;
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Input
            placeholder="Task title (e.g., Draft methods section)"
            value={t.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <ScorePill label="impact" value={t.impact} />
            <ScorePill label="effort" value={t.effort} />
            <ScorePill label="dread" value={t.anxiety} />
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={onRemove}>
          Remove
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {([
          ["impact", "Impact"],
          ["effort", "Effort"],
          ["anxiety", "Dread"],
        ] as const).map(([k, label]) => (
          <label key={k} className="space-y-1">
            <div className="text-xs text-slate-500">{label} (1–5)</div>
            <Select value={String(t[k])} onChange={(e) => onChange({ [k]: Number(e.target.value) } as any)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </label>
        ))}

        <label className="space-y-1">
          <div className="text-xs text-slate-500">Deadline (optional)</div>
          <Input
            type="date"
            value={t.deadline ?? ""}
            onChange={(e) => onChange({ deadline: e.target.value || undefined })}
          />
        </label>
      </CardContent>
    </Card>
  );
}

export default function DecidePage() {
  const [goal, setGoal] = useState("Finish the most important thing.");
  const [timeMinutes, setTimeMinutes] = useState(45);
  const [energy, setEnergy] = useState(3);
  const [tasks, setTasks] = useState<TaskInput[]>([
    { title: "Email cleanup", impact: 2, effort: 2, anxiety: 2 },
    { title: "Work on presentation", impact: 5, effort: 4, anxiety: 3 },
  ]);

  const [rec, setRec] = useState<Recommendation | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const canRecommend = useMemo(
    () => tasks.length > 0 && tasks.some((t) => (t.title || "").trim().length > 0),
    [tasks]
  );

  function applyTemplate(name: string) {
    const t = templates.find((x) => x.name === name);
    if (!t) return;
    setGoal(t.goal);
    setTimeMinutes(t.timeMinutes);
    setEnergy(t.energy);
    setTasks(t.tasks);
    setRec(null);
    setStatus(`Template applied: ${name}`);
  }

  function addTask() {
    setTasks((prev) => [...prev, { title: "", impact: 3, effort: 3, anxiety: 3 }]);
  }

  async function getRecommendation() {
    setBusy(true);
    setStatus(null);
    setRec(null);

    const cleaned = tasks
      .map((t) => ({ ...t, title: (t.title || "").trim() }))
      .filter((t) => t.title.length > 0);

    if (cleaned.length === 0) {
      setBusy(false);
      setStatus("Add at least one task title.");
      return;
    }

    const res = await fetch("/api/decide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, time_minutes: timeMinutes, energy, tasks: cleaned }),
    });

    setBusy(false);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setStatus(err?.error || "Failed to decide.");
      return;
    }

    const data = (await res.json()) as Recommendation;
    setRec(data);
  }

  async function saveDecision() {
    setStatus(null);
    const supabase = supabaseBrowser();
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      setStatus("Please login first (App → Login).");
      return;
    }
    if (!rec) {
      setStatus("Get a recommendation first.");
      return;
    }

    const cleaned = tasks
      .map((t) => ({ ...t, title: (t.title || "").trim() }))
      .filter((t) => t.title.length > 0);

    const { error } = await supabase.from("decisions").insert({
      user_id: auth.user.id,
      goal,
      time_minutes: timeMinutes,
      energy,
      tasks: cleaned,
      recommendation: rec,
    });

    if (error) setStatus(error.message);
    else setStatus("Saved to history!");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm text-slate-500">New decision</div>
          <h2 className="text-2xl font-semibold">What should I do next?</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {templates.map((t) => (
            <button
              key={t.name}
              onClick={() => applyTemplate(t.name)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Goal</Badge>
            <span className="text-xs text-slate-500">Keep it short and concrete.</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Goal (e.g., Finish slides for meeting)"
          />
          <div className="grid md:grid-cols-3 gap-3">
            <label className="space-y-1">
              <div className="text-xs text-slate-500">Time available</div>
              <Select value={String(timeMinutes)} onChange={(e) => setTimeMinutes(Number(e.target.value))}>
                {[15, 20, 30, 45, 60, 90, 120, 180].map((m) => (
                  <option key={m} value={m}>
                    {m} minutes
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-1">
              <div className="text-xs text-slate-500">Energy</div>
              <Select value={String(energy)} onChange={(e) => setEnergy(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} / 5
                  </option>
                ))}
              </Select>
            </label>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <div className="font-medium text-slate-700">Tip</div>
              If energy is low, the engine favors lower-effort tasks unless impact is much higher.
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Tasks</div>
          <div className="text-xs text-slate-500">Add 2–5 tasks for best results.</div>
        </div>
        <Button variant="secondary" onClick={addTask}>
          Add task
        </Button>
      </div>

      <div className="space-y-3">
        {tasks.map((t, i) => (
          <TaskCard
            key={i}
            t={t}
            onChange={(patch) =>
              setTasks((prev) => prev.map((x, idx) => (idx === i ? { ...x, ...patch } : x)))
            }
            onRemove={() => setTasks((prev) => prev.filter((_, idx) => idx !== i))}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={getRecommendation} disabled={busy || !canRecommend}>
          {busy ? "Thinking..." : "Recommend"}
        </Button>
        <Button variant="secondary" onClick={saveDecision} disabled={!rec}>
          Save to history
        </Button>
      </div>

      {status && <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">{status}</div>}

      {rec && (
        <Card className="border-slate-900/10">
          <CardHeader className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500">Recommendation</div>
              <div className="text-xl font-semibold">{rec.selectedTaskTitle}</div>
            </div>
            <Badge className="uppercase">{rec.confidence}</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-slate-700">{rec.rationale}</p>

            {rec.alternatives?.length > 0 && (
              <div>
                <div className="text-sm font-semibold">Alternatives</div>
                <ul className="mt-2 space-y-2">
                  {rec.alternatives.map((a, idx) => (
                    <li key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                      <div className="font-medium">{a.title}</div>
                      <div className="text-slate-600 mt-1">{a.why}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
