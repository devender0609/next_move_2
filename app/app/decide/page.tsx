"use client";

import { useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { Recommendation, TaskInput } from "@/lib/types";

type Template = {
  name: string;
  goal: string;
  time_minutes: number;
  energy: number;
  tasks: TaskInput[];
};

const TEMPLATES: Template[] = [
  {
    name: "Work sprint",
    goal: "Make meaningful progress with minimal switching.",
    time_minutes: 45,
    energy: 3,
    tasks: [
      { title: "Finish the next 2 slides / paragraphs", impact: 5, effort: 3, anxiety: 2 },
      { title: "Reply to the 3 most time-sensitive emails", impact: 4, effort: 2, anxiety: 2 },
      { title: "Plan the next 30 minutes (tiny checklist)", impact: 3, effort: 1, anxiety: 1 },
    ],
  },
  {
    name: "Relationships",
    goal: "Strengthen one relationship with a small, real action.",
    time_minutes: 20,
    energy: 2,
    tasks: [
      { title: "Send a thoughtful check-in text", impact: 4, effort: 1, anxiety: 1 },
      { title: "Schedule a quick call this week", impact: 4, effort: 2, anxiety: 2 },
      { title: "Write a short apology / appreciation note", impact: 5, effort: 2, anxiety: 3 },
    ],
  },
  {
    name: "Health reset",
    goal: "Pick one action that improves today (not perfection).",
    time_minutes: 30,
    energy: 2,
    tasks: [
      { title: "10–15 minute walk", impact: 4, effort: 2, anxiety: 1 },
      { title: "Prep a simple meal / protein + veggies", impact: 4, effort: 3, anxiety: 2 },
      { title: "Book / confirm an appointment", impact: 3, effort: 2, anxiety: 2 },
    ],
  },
  {
    name: "Home tidy",
    goal: "Reduce visual clutter fast.",
    time_minutes: 25,
    energy: 2,
    tasks: [
      { title: "Clear one surface (desk/counter)", impact: 4, effort: 2, anxiety: 1 },
      { title: "Start one load of laundry", impact: 3, effort: 2, anxiety: 1 },
      { title: "Take out trash / recycling", impact: 3, effort: 1, anxiety: 1 },
    ],
  },
  {
    name: "Money",
    goal: "Do one thing that prevents future stress.",
    time_minutes: 20,
    energy: 2,
    tasks: [
      { title: "Pay / schedule one bill", impact: 5, effort: 1, anxiety: 2 },
      { title: "Review last 3 transactions", impact: 3, effort: 1, anxiety: 1 },
      { title: "Cancel one unused subscription", impact: 4, effort: 2, anxiety: 2 },
    ],
  },
];

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function clamp15(n: number) {
  const v = Number(n);
  if (Number.isNaN(v)) return 3;
  return Math.max(1, Math.min(5, v));
}

function confidenceHelp(c: Recommendation["confidence"]) {
  if (c === "high") return "High: the top choice clearly beat the runner‑up given your inputs.";
  if (c === "medium") return "Medium: the top choice edged out the runner‑up, but others are close.";
  return "Low: multiple options scored similarly—your preference may decide.";
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="label">{children}</div>;
}

function TaskRow({
  t,
  onChange,
  onRemove,
}: {
  t: TaskInput;
  onChange: (patch: Partial<TaskInput>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="task-card">
      <div className="task-top">
        <div className="text-sm font-extrabold">Option</div>
        <button className="btn btn-ghost" type="button" onClick={onRemove}>
          Remove
        </button>
      </div>

      <div className="grid gap-3">
        <div>
          <Label>Title</Label>
          <input
            className="input"
            value={t.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="e.g., Draft 2 paragraphs for the intro"
          />
        </div>

        <div className="grid sm:grid-cols-4 gap-3">
          <div>
            <Label>Impact (1–5)</Label>
            <input
              className="input"
              type="number"
              min={1}
              max={5}
              value={t.impact}
              onChange={(e) => onChange({ impact: clamp15(e.target.valueAsNumber) })}
            />
          </div>
          <div>
            <Label>Effort (1–5)</Label>
            <input
              className="input"
              type="number"
              min={1}
              max={5}
              value={t.effort}
              onChange={(e) => onChange({ effort: clamp15(e.target.valueAsNumber) })}
            />
          </div>
          <div>
            <Label>Hard to start (1–5)</Label>
            <input
              className="input"
              type="number"
              min={1}
              max={5}
              value={t.anxiety}
              onChange={(e) => onChange({ anxiety: clamp15(e.target.valueAsNumber) })}
            />
          </div>
          <div>
            <Label>Deadline (optional)</Label>
            <input
              className="input"
              type="date"
              min={todayISO()}
              value={t.deadline ?? ""}
              onChange={(e) => onChange({ deadline: e.target.value || undefined })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DecidePage() {
  const [goal, setGoal] = useState("Finish the most important thing.");
  const [timeMinutes, setTimeMinutes] = useState(45);
  const [energy, setEnergy] = useState(3);
  const [tasks, setTasks] = useState<TaskInput[]>([
    { title: "", impact: 3, effort: 3, anxiety: 2 },
    { title: "", impact: 3, effort: 3, anxiety: 2 },
    { title: "", impact: 3, effort: 3, anxiety: 2 },
  ]);

  const [busy, setBusy] = useState(false);
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const validCount = useMemo(() => tasks.filter((t) => t.title.trim().length > 0).length, [tasks]);

  function applyTemplate(t: Template) {
    setGoal(t.goal);
    setTimeMinutes(t.time_minutes);
    setEnergy(t.energy);
    setTasks(t.tasks.map((x) => ({ ...x })));
    setRec(null);
    setStatus(`Loaded template: ${t.name}`);
  }

  function addTask() {
    setTasks((prev) => [...prev, { title: "", impact: 3, effort: 3, anxiety: 2 }]);
  }

  function resetAll() {
    setGoal("Finish the most important thing.");
    setTimeMinutes(45);
    setEnergy(3);
    setTasks([
      { title: "", impact: 3, effort: 3, anxiety: 2 },
      { title: "", impact: 3, effort: 3, anxiety: 2 },
      { title: "", impact: 3, effort: 3, anxiety: 2 },
    ]);
    setRec(null);
    setStatus("Reset complete.");
  }

  async function getRecommendation() {
    setBusy(true);
    setStatus(null);
    setRec(null);

    const payload = {
      goal,
      time_minutes: timeMinutes,
      energy,
      tasks: tasks.map((t) => ({
        ...t,
        title: t.title.trim(),
        impact: clamp15(t.impact),
        effort: clamp15(t.effort),
        anxiety: clamp15(t.anxiety),
        deadline: t.deadline,
      })),
    };

    const res = await fetch("/api/decide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setBusy(false);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setStatus(err?.error || "Could not generate a recommendation.");
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
      setStatus("Login required to save (App → Login / Logout).");
      return;
    }
    if (!rec) {
      setStatus("Get a recommendation first.");
      return;
    }

    const { error } = await supabase.from("decisions").insert({
      user_id: auth.user.id,
      goal,
      time_minutes: timeMinutes,
      energy,
      tasks,
      recommendation: rec,
    });

    if (error) setStatus(error.message);
    else setStatus("Saved to history!");
  }

  return (
    <div className="space-y-6">
      <div className="page-head">
        <div className="kicker">New decision</div>
        <h1 className="page-title">Decide your next move</h1>
        <p className="page-sub">Fast, explainable ranking—designed to reduce user effort.</p>
      </div>

      <section className="card">
        <div className="card-title-row">
          <div>
            <div className="card-title">Templates</div>
            <div className="card-sub">Start with a preset, then tweak.</div>
          </div>
          <button className="btn btn-ghost" type="button" onClick={resetAll}>
            Reset
          </button>
        </div>

        <div className="chip-row mt-3">
          {TEMPLATES.map((t) => (
            <button key={t.name} type="button" className="chip" onClick={() => applyTemplate(t)}>
              {t.name}
            </button>
          ))}
        </div>

        {status && <div className="alert mt-4">{status}</div>}
      </section>

      <section className="card">
        <div className="card-title">Decision context</div>
        <div className="card-sub">These settings tune the recommendation.</div>

        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <div>
            <Label>Goal</Label>
            <input className="input" value={goal} onChange={(e) => setGoal(e.target.value)} />
          </div>
          <div>
            <Label>Time (minutes)</Label>
            <input
              className="input"
              type="number"
              min={5}
              max={600}
              value={timeMinutes}
              onChange={(e) => setTimeMinutes(Math.max(5, Math.min(600, Number(e.target.value || 45))))}
            />
          </div>
          <div>
            <Label>Energy (1–5)</Label>
            <input
              className="input"
              type="number"
              min={1}
              max={5}
              value={energy}
              onChange={(e) => setEnergy(clamp15(e.target.valueAsNumber))}
            />
          </div>
        </div>

        <details className="mt-4">
          <summary className="text-sm font-semibold cursor-pointer text-slate-700 dark:text-slate-200">
            How the scoring works (transparent)
          </summary>
          <div className="mt-2 text-sm text-slate-700 dark:text-slate-200 space-y-2">
            <div>
              <span className="font-semibold">Impact</span> is weighted up. <span className="font-semibold">Effort</span> is penalized more when your energy is low.
              <span className="font-semibold"> Hard to start</span> slightly penalizes tasks that create friction.
            </div>
            <div>
              If a <span className="font-semibold">deadline</span> is near, the task can get a small bonus (past dates are ignored).
            </div>
            <div>
              <span className="font-semibold">Confidence</span> reflects how far the best option scored above the runner‑up (high/medium/low).
            </div>
          </div>
        </details>
      </section>

      <section className="card">
        <div className="card-title-row">
          <div>
            <div className="card-title">Options</div>
            <div className="card-sub">Fill titles first. Numbers can be quick estimates.</div>
          </div>
          <button className="btn btn-primary" type="button" onClick={addTask}>
            + Add option
          </button>
        </div>

        <div className="grid gap-3 mt-4">
          {tasks.map((t, idx) => (
            <TaskRow
              key={idx}
              t={t}
              onChange={(patch) => setTasks((prev) => prev.map((x, i) => (i === idx ? { ...x, ...patch } : x)))}
              onRemove={() => setTasks((prev) => prev.filter((_, i) => i !== idx))}
            />
          ))}
        </div>

        <div className="flex gap-3 flex-wrap mt-4">
          <button
            className="btn btn-primary"
            type="button"
            disabled={busy || validCount === 0}
            onClick={getRecommendation}
          >
            {busy ? "Thinking…" : "Get recommendation"}
          </button>

          <button className="btn btn-ghost" type="button" onClick={() => setRec(null)}>
            Clear result
          </button>

          <button className="btn btn-ghost" type="button" onClick={saveDecision} disabled={!rec}>
            Save to history
          </button>
        </div>

        {validCount === 0 && (
          <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Add at least one option title to enable recommendation.
          </div>
        )}
      </section>

      {rec && (
        <section className="result-card">
          <div className="result-title-row">
            <div className="result-title">Recommendation</div>
            <div className={`confidence-pill confidence-${rec.confidence}`}>
              Confidence: {rec.confidence}
            </div>
          </div>

          <div className="result-main">{rec.selectedTaskTitle}</div>
          <div className="result-reason">{rec.rationale}</div>
          <div className="text-sm text-slate-700 dark:text-slate-200 mt-3">
            {confidenceHelp(rec.confidence)}
          </div>

          {rec.alternatives?.length > 0 && (
            <div className="result-alt">
              <div className="result-alt-title">Good alternatives</div>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {rec.alternatives.map((a, i) => (
                  <li key={i} className="text-sm text-slate-700 dark:text-slate-200">
                    <span className="font-semibold">{a.title}:</span> {a.why}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
