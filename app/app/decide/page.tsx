"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";

type Energy = "Low" | "Medium" | "High";

type Task = {
  title: string;
  impact: number;
  effort: number;
  resistance: number;
  deadline?: string;
  tagsText?: string;
  tags?: string[];
};

type Recommendation = {
  selectedTaskTitle: string;
  rationale: string;
  confidence: number;
  alternatives: string[];
};

const todayISO = () => new Date().toISOString().slice(0, 10);

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function scoreTask(t: Task, energy: Energy, timeMinutes: number) {
  const impact = clamp(t.impact || 3, 1, 5);
  const effort = clamp(t.effort || 3, 1, 5);
  const resistance = clamp(t.resistance || 3, 1, 5);

  const energyEffortPenalty =
    energy === "Low" ? (effort - 1) * 1.2 :
    energy === "Medium" ? (effort - 1) * 0.8 :
    (effort - 1) * 0.5;

  const resistancePenalty = (resistance - 1) * 0.9;
  const timePenalty =
    timeMinutes <= 20 ? (effort - 1) * 0.8 :
    timeMinutes <= 45 ? (effort - 1) * 0.4 :
    0;

  let deadlineBonus = 0;
  if (t.deadline) {
    const d = new Date(t.deadline + "T00:00:00");
    const now = new Date(todayISO() + "T00:00:00");
    const diffDays = Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 2 && diffDays >= 0) deadlineBonus = 1.0;
    if (diffDays < 0) deadlineBonus = -2.0;
  }

  return impact * 2.2 - energyEffortPenalty - resistancePenalty - timePenalty + deadlineBonus;
}

export default function DecidePage() {
  const initialTasks: Task[] = [
    { title: "", impact: 3, effort: 3, resistance: 3, tagsText: "" },
    { title: "", impact: 3, effort: 3, resistance: 3, tagsText: "" },
  ];

  const [goal, setGoal] = useState("");
  const [timeMinutes, setTimeMinutes] = useState<number>(30);
  const [energy, setEnergy] = useState<Energy>("Medium");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const [rec, setRec] = useState<Recommendation | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const templates = [
    {
      name: "Deep Work",
      goal: "Make progress on my most important project",
      timeMinutes: 60,
      energy: "High" as Energy,
      tasks: [
        { title: "Draft the next section / outline", impact: 5, effort: 4, resistance: 3, tagsText: "work, deep" },
        { title: "Clean up notes + create next actions", impact: 4, effort: 3, resistance: 2, tagsText: "work" },
        { title: "Schedule 1 focused block for tomorrow", impact: 3, effort: 2, resistance: 1, tagsText: "planning" },
      ],
    },
    {
      name: "Admin Cleanup",
      goal: "Clear small tasks so I can focus later",
      timeMinutes: 25,
      energy: "Low" as Energy,
      tasks: [
        { title: "Reply to the 3 most urgent emails", impact: 3, effort: 2, resistance: 2, tagsText: "admin" },
        { title: "Pay / confirm one bill or appointment", impact: 4, effort: 2, resistance: 2, tagsText: "admin, life" },
        { title: "Create a 3-item to-do list for tomorrow", impact: 3, effort: 1, resistance: 1, tagsText: "planning" },
      ],
    },
    {
      name: "Quick Wins",
      goal: "Get momentum with small wins",
      timeMinutes: 15,
      energy: "Low" as Energy,
      tasks: [
        { title: "Do one 5-minute cleanup task", impact: 2, effort: 1, resistance: 1, tagsText: "life" },
        { title: "Send one message you’ve been delaying", impact: 3, effort: 2, resistance: 4, tagsText: "admin" },
        { title: "Prep materials for next task (open docs, notes)", impact: 3, effort: 1, resistance: 1, tagsText: "work" },
      ],
    },
    {
      name: "Health Reset",
      goal: "Do one small thing for my health today",
      timeMinutes: 20,
      energy: "Low" as Energy,
      tasks: [
        { title: "10-minute walk", impact: 4, effort: 2, resistance: 1, tagsText: "health" },
        { title: "Drink water + quick snack plan", impact: 3, effort: 1, resistance: 1, tagsText: "health" },
        { title: "5-minute stretch / mobility", impact: 3, effort: 1, resistance: 1, tagsText: "health" },
      ],
    },
    {
      name: "Money Clarity",
      goal: "Reduce money stress with one next step",
      timeMinutes: 25,
      energy: "Medium" as Energy,
      tasks: [
        { title: "List top 3 bills due this week", impact: 4, effort: 2, resistance: 2, tagsText: "money, admin" },
        { title: "Cancel one unused subscription", impact: 4, effort: 2, resistance: 3, tagsText: "money" },
        { title: "Set a 10-min budget check-in", impact: 3, effort: 1, resistance: 2, tagsText: "money, planning" },
      ],
    },
    {
      name: "Household Reset",
      goal: "Make home feel under control",
      timeMinutes: 30,
      energy: "Low" as Energy,
      tasks: [
        { title: "Clear one surface (desk/counter)", impact: 3, effort: 2, resistance: 1, tagsText: "home" },
        { title: "Start one load (laundry/dishes)", impact: 3, effort: 2, resistance: 1, tagsText: "home" },
        { title: "Make a 3-item home to-do list", impact: 3, effort: 1, resistance: 1, tagsText: "home, planning" },
      ],
    },
  ];

  function resetAll() {
    setGoal("");
    setTimeMinutes(30);
    setEnergy("Medium");
    setTasks(initialTasks);
    setRec(null);
    setStatus(null);
  }

  function applyTemplate(i: number) {
    const t = templates[i];
    setGoal(t.goal);
    setTimeMinutes(t.timeMinutes);
    setEnergy(t.energy);
    setTasks(t.tasks.map((x) => ({ ...x })));
    setRec(null);
    setStatus(null);
  }

  function updateTask(idx: number, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t, i) => (i === idx ? { ...t, ...patch } : t)));
  }

  function addTask() {
    setTasks((prev) => [...prev, { title: "", impact: 3, effort: 3, resistance: 3, tagsText: "" }]);
  }

  function removeTask(idx: number) {
    setTasks((prev) => prev.filter((_, i) => i !== idx));
  }

  const cleanedTasks = useMemo(() => {
    return tasks
      .map((t) => ({
        ...t,
        title: (t.title || "").trim(),
        tags: (t.tagsText || "")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      }))
      .filter((t) => t.title.length > 0);
  }, [tasks]);

  function computeRecommendation() {
    setStatus(null);

    if (!goal.trim()) {
      setStatus("Please enter a goal.");
      return;
    }
    if (cleanedTasks.length === 0) {
      setStatus("Add at least one task.");
      return;
    }

    const scored = cleanedTasks
      .map((t) => ({ t, s: scoreTask(t, energy, timeMinutes) }))
      .sort((a, b) => b.s - a.s);

    const best = scored[0];
    const alts = scored.slice(1, 4).map((x) => x.t.title);

    const second = scored.length > 1 ? scored[1].s : best.s - 1;
    const confidence = clamp(Math.round(55 + (best.s - second) * 8), 45, 92);

    const rationaleParts = [
      `High impact (${best.t.impact}/5).`,
      `Fits your energy (${energy}) and time (${timeMinutes} min).`,
      `Lower effort/resistance relative to alternatives.`,
    ];
    if (best.t.deadline) rationaleParts.push(`Deadline: ${best.t.deadline}.`);

    setRec({
      selectedTaskTitle: best.t.title,
      confidence,
      rationale: rationaleParts.join(" "),
      alternatives: alts,
    });
  }

  async function saveDecision() {
    setStatus(null);
    setBusy(true);
    try {
      const supabase = supabaseBrowser();
      const { data: auth } = await supabase.auth.getUser();

      if (!auth.user) {
        setStatus("Login required to save. Go to Login and come back.");
        return;
      }
      if (!rec) {
        setStatus("Create a recommendation first.");
        return;
      }

      const { error } = await supabase.from("decisions").insert({
        user_id: auth.user.id,
        goal,
        time_minutes: timeMinutes,
        energy,
        tasks: cleanedTasks,
        recommendation: rec,
      });

      if (error) setStatus(error.message);
      else setStatus("Saved to history!");
    } finally {
      setBusy(false);
    }
  }

  async function addToDailyFocus() {
    setStatus(null);
    setBusy(true);
    try {
      const supabase = supabaseBrowser();
      const { data: auth } = await supabase.auth.getUser();

      if (!auth.user) {
        setStatus("Login required to use Daily Focus.");
        return;
      }
      if (!rec) {
        setStatus("Create a recommendation first.");
        return;
      }

      const { error } = await supabase.from("focus_items").insert({
        user_id: auth.user.id,
        date: todayISO(),
        title: rec.selectedTaskTitle,
        done: false,
      });

      if (error) setStatus(error.message);
      else setStatus("Added to Daily Focus!");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-sm text-slate-500 dark:text-slate-400">New decision</div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            What should you do next?
          </h2>
        </div>

        <div className="flex gap-2">
          <Link
            href="/app/history"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-100"
          >
            History
          </Link>
          <Link
            href="/app/focus"
            className="rounded-xl px-4 py-2 text-sm text-white gradient-brand hover:opacity-95"
          >
            Daily Focus
          </Link>
        </div>
      </div>

      {/* Templates */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="font-semibold text-slate-900 dark:text-slate-100">Templates</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {templates.map((t, i) => (
            <button
              key={t.name}
              onClick={() => applyTemplate(i)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800 dark:text-slate-100"
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-1 md:col-span-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">Goal</div>
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Make progress on my project"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </label>

          <label className="space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">Time available (minutes)</div>
            <input
              type="number"
              min={5}
              max={240}
              value={timeMinutes}
              onChange={(e) => setTimeMinutes(parseInt(e.target.value || "30", 10))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </label>

          <label className="space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">Energy</div>
            <select
              value={energy}
              onChange={(e) => setEnergy(e.target.value as Energy)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
        </div>
      </div>

      {/* Tasks */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-slate-900 dark:text-slate-100">Tasks</div>
          <button onClick={addTask} className="rounded-xl px-3 py-2 text-sm text-white gradient-brand hover:opacity-95">
            + Add task
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {tasks.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-full space-y-3">
                  <label className="space-y-1">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Task title</div>
                    <input
                      value={t.title}
                      onChange={(e) => updateTask(idx, { title: e.target.value })}
                      placeholder="e.g., Draft 3 slides"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                  </label>

                  <div className="grid gap-3 md:grid-cols-4">
                    {[
                      ["Impact (1-5)", "impact"] as const,
                      ["Effort (1-5)", "effort"] as const,
                      ["Resistance (1-5)", "resistance"] as const,
                    ].map(([label, key]) => (
                      <label key={key} className="space-y-1">
                        <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={(t as any)[key]}
                          onChange={(e) =>
                            updateTask(idx, { [key]: parseInt(e.target.value || "3", 10) } as any)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        />
                      </label>
                    ))}

                    <label className="space-y-1">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Deadline</div>
                      <input
                        type="date"
                        min={todayISO()}
                        value={t.deadline ?? ""}
                        onChange={(e) => {
                          const v = e.target.value || undefined;
                          if (v && v < todayISO()) return;
                          updateTask(idx, { deadline: v });
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </label>

                    <label className="space-y-1 md:col-span-4">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Tags (comma separated) — e.g., work, health, admin
                      </div>
                      <input
                        value={t.tagsText ?? ""}
                        onChange={(e) => updateTask(idx, { tagsText: e.target.value })}
                        placeholder="work, admin"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                      />
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => removeTask(idx)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-100"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={computeRecommendation}
          className="rounded-xl px-5 py-3 text-sm font-semibold text-white gradient-brand hover:opacity-95"
        >
          Get recommendation
        </button>

        <button
          onClick={saveDecision}
          disabled={busy}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-100"
        >
          Save to history
        </button>

        <button
          onClick={addToDailyFocus}
          disabled={busy}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-100"
        >
          Add to Daily Focus
        </button>

        {/* ✅ Reset button */}
        <button
          onClick={resetAll}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:text-slate-100"
        >
          Reset
        </button>
      </div>

      {rec && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Recommendation · Confidence {rec.confidence}%
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Confidence = how strongly this option ranks above your other tasks (impact, effort, resistance, time, energy, deadline). It’s a ranking strength, not a guarantee.
            </div>
          </div>

          <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {rec.selectedTaskTitle}
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{rec.rationale}</p>

          {rec.alternatives?.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Alternatives</div>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
                {rec.alternatives.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {status && (
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
          {status}
        </div>
      )}
    </div>
  );
}
