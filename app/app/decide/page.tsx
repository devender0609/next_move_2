"use client";

import { useMemo, useState } from "react";

type Energy = "Low" | "Medium" | "High";

type Task = {
  id: string;
  title: string;
  impact: number; // 1-5
  effort: number; // 1-5
  resistance: number; // 1-5
  deadline?: string; // YYYY-MM-DD
  tags: string; // comma separated
};

type Preset = { goal: string; time: number; energy: Energy; tasks: Partial<Task>[] };

const uid = () => Math.random().toString(36).slice(2, 10);

const todayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

const isPastDate = (iso?: string) => {
  if (!iso) return false;
  const t = todayISO();
  return iso < t;
};

const clamp1to5 = (n: number) => Math.min(5, Math.max(1, n));

const TEMPLATES: Record<string, Preset> = {
  "Deep Work": {
    goal: "Make meaningful progress on one important thing",
    time: 60,
    energy: "High",
    tasks: [
      { title: "Draft the hardest part for 25 minutes", impact: 5, effort: 3, resistance: 4, tags: "work,focus" },
      { title: "Outline the next 3 steps (10 minutes)", impact: 4, effort: 1, resistance: 2, tags: "work,planning" },
    ],
  },
  "Admin Cleanup": {
    goal: "Clear small tasks that create mental clutter",
    time: 20,
    energy: "Low",
    tasks: [
      { title: "Reply to 2 pending emails", impact: 3, effort: 2, resistance: 2, tags: "admin,email" },
      { title: "Schedule one item you’ve been avoiding", impact: 4, effort: 2, resistance: 3, tags: "admin,calendar" },
    ],
  },
  "Quick Wins": {
    goal: "Build momentum with a few small wins",
    time: 15,
    energy: "Low",
    tasks: [
      { title: "Do one 5-minute cleanup task", impact: 2, effort: 1, resistance: 1, tags: "home" },
      { title: "Send one message you’ve been delaying", impact: 3, effort: 1, resistance: 3, tags: "communication" },
    ],
  },
  "Health Reset": {
    goal: "Make one healthy choice that improves today",
    time: 30,
    energy: "Medium",
    tasks: [
      { title: "20-minute walk", impact: 4, effort: 2, resistance: 2, tags: "health" },
      { title: "Plan one simple meal", impact: 3, effort: 2, resistance: 2, tags: "health,nutrition" },
    ],
  },
  "Money Clarity": {
    goal: "Reduce money stress with one concrete step",
    time: 25,
    energy: "Medium",
    tasks: [
      { title: "Check balances & note what’s due", impact: 3, effort: 1, resistance: 2, tags: "money" },
      { title: "Pay one bill or set autopay", impact: 4, effort: 2, resistance: 3, tags: "money,admin" },
    ],
  },
  "Household Reset": {
    goal: "Make home feel lighter with one action",
    time: 25,
    energy: "Low",
    tasks: [
      { title: "Tidy one surface (desk/counter)", impact: 3, effort: 1, resistance: 1, tags: "home" },
      { title: "Start one load (laundry/dishes)", impact: 3, effort: 2, resistance: 1, tags: "home" },
    ],
  },
  "Career Growth": {
    goal: "Do one action that improves your career trajectory",
    time: 45,
    energy: "High",
    tasks: [
      { title: "Update one section of resume/LinkedIn", impact: 4, effort: 2, resistance: 3, tags: "career" },
      { title: "Reach out to one contact (short message)", impact: 4, effort: 2, resistance: 4, tags: "career,network" },
    ],
  },

  // ✅ NEW templates you asked for (relationships + more practical life ones)
  "Relationships": {
    goal: "Strengthen a relationship with one small action",
    time: 15,
    energy: "Low",
    tasks: [
      { title: "Send one appreciative message", impact: 4, effort: 1, resistance: 2, tags: "relationships" },
      { title: "Schedule a 20-minute check-in", impact: 4, effort: 2, resistance: 3, tags: "relationships,calendar" },
    ],
  },
  "Difficult Conversation": {
    goal: "Prepare for a tough conversation calmly",
    time: 30,
    energy: "Medium",
    tasks: [
      { title: "Write 3 outcomes you want (and 3 you don’t)", impact: 5, effort: 2, resistance: 4, tags: "relationships,communication" },
      { title: "Draft a 2-sentence opening", impact: 4, effort: 1, resistance: 3, tags: "communication" },
    ],
  },
  "Family / Parenting": {
    goal: "Reduce friction at home with one small reset",
    time: 20,
    energy: "Medium",
    tasks: [
      { title: "Plan tomorrow’s 2 key moments (AM/PM)", impact: 4, effort: 2, resistance: 2, tags: "family,planning" },
      { title: "Set up one ‘easy win’ routine", impact: 4, effort: 2, resistance: 3, tags: "family" },
    ],
  },
  "Learning": {
    goal: "Make progress learning something important",
    time: 30,
    energy: "Medium",
    tasks: [
      { title: "Study one concept for 20 minutes", impact: 4, effort: 2, resistance: 3, tags: "learning" },
      { title: "Do 5 practice questions", impact: 4, effort: 2, resistance: 3, tags: "learning" },
    ],
  },
};

function scoreTask(t: Task) {
  // Core: high impact, low effort, low resistance
  let score = t.impact * 2 - t.effort - t.resistance;

  // Urgency bonus: deadlines closer get a bump
  if (t.deadline) {
    const now = new Date();
    const due = new Date(t.deadline + "T00:00:00");
    const days = Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 0) score += 2; // due today
    else if (days <= 2) score += 1.5;
    else if (days <= 7) score += 1;
  }

  return score;
}

function computeConfidence(best: number, second: number | null) {
  // Confidence means: how strongly the top choice stands out vs the next option.
  // Higher gap = higher confidence.
  if (second === null) return 0.72;
  const gap = best - second;
  // map gap roughly to [0.35..0.92]
  const c = 0.35 + Math.max(0, Math.min(1, gap / 4)) * 0.57;
  return Math.round(c * 100) / 100;
}

export default function DecidePage() {
  const [goal, setGoal] = useState("");
  const [time, setTime] = useState<number>(30);
  const [energy, setEnergy] = useState<Energy>("Medium");
  const [tasks, setTasks] = useState<Task[]>([
    { id: uid(), title: "", impact: 3, effort: 3, resistance: 3, tags: "" },
  ]);

  const [deadlineErrors, setDeadlineErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<null | {
    best: Task;
    alternatives: Task[];
    confidence: number;
    reasoning: string[];
  }>(null);

  const templateNames = useMemo(() => Object.keys(TEMPLATES), []);

  function applyTemplate(name: string) {
    const p = TEMPLATES[name];
    setGoal(p.goal);
    setTime(p.time);
    setEnergy(p.energy);
    setTasks(
      (p.tasks.length ? p.tasks : [{}]).map((pt) => ({
        id: uid(),
        title: pt.title ?? "",
        impact: clamp1to5(pt.impact ?? 3),
        effort: clamp1to5(pt.effort ?? 3),
        resistance: clamp1to5(pt.resistance ?? 3),
        deadline: pt.deadline,
        tags: pt.tags ?? "",
      }))
    );
    setResult(null);
    setDeadlineErrors({});
  }

  function addTask() {
    setTasks((prev) => [
      ...prev,
      { id: uid(), title: "", impact: 3, effort: 3, resistance: 3, tags: "" },
    ]);
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setDeadlineErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function updateTask(id: string, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    setResult(null);
  }

  function validateDeadlines(ts: Task[]) {
    const errs: Record<string, string> = {};
    for (const t of ts) {
      if (t.deadline && isPastDate(t.deadline)) {
        errs[t.id] = "Deadline can’t be in the past.";
      }
    }
    setDeadlineErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function resetAll() {
    setGoal("");
    setTime(30);
    setEnergy("Medium");
    setTasks([{ id: uid(), title: "", impact: 3, effort: 3, resistance: 3, tags: "" }]);
    setResult(null);
    setDeadlineErrors({});
  }

  function getRecommendation() {
    const cleaned = tasks
      .map((t) => ({
        ...t,
        title: t.title.trim(),
        tags: (t.tags ?? "").trim(),
      }))
      .filter((t) => t.title.length > 0);

    if (cleaned.length === 0) {
      setResult(null);
      alert("Add at least one task title.");
      return;
    }

    if (!validateDeadlines(cleaned)) {
      setResult(null);
      return;
    }

    const scored = cleaned
      .map((t) => ({ t, s: scoreTask(t) }))
      .sort((a, b) => b.s - a.s);

    const best = scored[0].t;
    const second = scored.length > 1 ? scored[1].s : null;
    const confidence = computeConfidence(scored[0].s, second);

    const alternatives = scored.slice(1, 3).map((x) => x.t);

    const reasoning: string[] = [];
    reasoning.push("Highest impact per effort/resistance.");
    if (best.deadline) reasoning.push("Deadline adds urgency.");
    if (energy === "Low") reasoning.push("Low-energy mode: prioritize low-effort steps.");

    setResult({ best, alternatives, confidence, reasoning });
  }

  const darkReadableCard =
    "rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900";
  const labelClass = "text-xs font-semibold text-slate-600 dark:text-slate-300";
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500";
  const chipBase =
    "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition";
  const chipOff =
    "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900";
  const chipOn =
    "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-200";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className={darkReadableCard + " p-6"}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">
              New decision
            </div>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              What should you do next?
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Add a goal and a few tasks — we’ll pick one best next step + alternatives.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={resetAll}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            >
              Reset
            </button>
            <button
              onClick={getRecommendation}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm gradient-brand hover:opacity-95"
            >
              Get recommendation
            </button>
          </div>
        </div>
      </div>

      {/* TEMPLATES */}
      <div className={darkReadableCard + " p-6"}>
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Templates
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Start fast, then edit.
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {templateNames.map((name) => (
            <button
              key={name}
              onClick={() => applyTemplate(name)}
              className={chipBase + " " + chipOff}
              type="button"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* GOAL + SETTINGS */}
      <div className={darkReadableCard + " p-6"}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className={labelClass}>Goal</div>
            <input
              className={inputClass}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Make progress on my project"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className={labelClass}>Time available (minutes)</div>
              <input
                className={inputClass}
                type="number"
                min={5}
                max={240}
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
              />
            </div>
            <div>
              <div className={labelClass}>Energy</div>
              <select
                className={inputClass}
                value={energy}
                onChange={(e) => setEnergy(e.target.value as Energy)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* TASKS */}
      <div className={darkReadableCard + " p-6"}>
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Tasks
          </div>
          <button
            onClick={addTask}
            className="rounded-xl px-3 py-2 text-sm font-semibold text-white shadow-sm gradient-brand hover:opacity-95"
          >
            + Add task
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className={labelClass}>Task title</div>
                  <input
                    className={inputClass}
                    value={t.title}
                    onChange={(e) => updateTask(t.id, { title: e.target.value })}
                    placeholder="e.g., Draft 3 slides"
                  />
                </div>

                <div className="flex md:justify-end">
                  <button
                    onClick={() => removeTask(t.id)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-4">
                <div>
                  <div className={labelClass}>Impact (1–5)</div>
                  <input
                    className={inputClass}
                    type="number"
                    min={1}
                    max={5}
                    value={t.impact}
                    onChange={(e) => updateTask(t.id, { impact: clamp1to5(Number(e.target.value)) })}
                  />
                </div>
                <div>
                  <div className={labelClass}>Effort (1–5)</div>
                  <input
                    className={inputClass}
                    type="number"
                    min={1}
                    max={5}
                    value={t.effort}
                    onChange={(e) => updateTask(t.id, { effort: clamp1to5(Number(e.target.value)) })}
                  />
                </div>
                <div>
                  <div className={labelClass}>Resistance (1–5)</div>
                  <input
                    className={inputClass}
                    type="number"
                    min={1}
                    max={5}
                    value={t.resistance}
                    onChange={(e) => updateTask(t.id, { resistance: clamp1to5(Number(e.target.value)) })}
                  />
                </div>
                <div>
                  <div className={labelClass}>Deadline</div>
                  <input
                    className={inputClass}
                    type="date"
                    value={t.deadline ?? ""}
                    min={todayISO()}
                    onChange={(e) => {
                      const v = e.target.value || undefined;
                      updateTask(t.id, { deadline: v });
                      setDeadlineErrors((prev) => {
                        const next = { ...prev };
                        if (v && isPastDate(v)) next[t.id] = "Deadline can’t be in the past.";
                        else delete next[t.id];
                        return next;
                      });
                    }}
                  />
                  {deadlineErrors[t.id] && (
                    <div className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                      {deadlineErrors[t.id]}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <div className={labelClass}>Tags (comma separated)</div>
                <input
                  className={inputClass}
                  value={t.tags}
                  onChange={(e) => updateTask(t.id, { tags: e.target.value })}
                  placeholder="e.g., work, health, admin"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESULT */}
      {result && (
        <div className={darkReadableCard + " p-6"}>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Recommendation
              </div>
              <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {result.best.title}
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Confidence:
                </span>{" "}
                {Math.round(result.confidence * 100)}%
                <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                  (How strongly the top option stands out vs the next best.)
                </span>
              </div>

              <ul className="mt-3 list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
                {result.reasoning.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {result.alternatives.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Alternatives
                </div>
                <div className="mt-2 space-y-2">
                  {result.alternatives.map((a) => (
                    <div
                      key={a.id}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                    >
                      {a.title}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        .gradient-brand {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #2563eb 100%);
        }
      `}</style>
    </div>
  );
}
