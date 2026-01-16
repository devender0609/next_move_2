// app/app/decide/page.tsx
"use client";

import { useMemo, useState } from "react";

type Mood =
  | "Calm"
  | "Motivated"
  | "Stressed"
  | "Tired"
  | "Overwhelmed"
  | "Anxious";

type Domain =
  | "Work"
  | "Career"
  | "Health"
  | "Relationships"
  | "Family"
  | "Money"
  | "Personal growth"
  | "Home"
  | "Mental reset";

const DOMAINS: Domain[] = [
  "Work",
  "Career",
  "Health",
  "Relationships",
  "Family",
  "Money",
  "Personal growth",
  "Home",
  "Mental reset",
];

const MOODS: Mood[] = ["Calm", "Motivated", "Stressed", "Tired", "Overwhelmed", "Anxious"];

const TEMPLATES = [
  { label: "Deep focus sprint", domain: "Work" as Domain, mood: "Motivated" as Mood },
  { label: "Admin clean-up", domain: "Work" as Domain, mood: "Tired" as Mood },
  { label: "Health reset", domain: "Health" as Domain, mood: "Overwhelmed" as Mood },
  { label: "Relationship repair", domain: "Relationships" as Domain, mood: "Anxious" as Mood },
  { label: "Money clarity", domain: "Money" as Domain, mood: "Stressed" as Mood },
  { label: "Mental reset", domain: "Mental reset" as Domain, mood: "Tired" as Mood },
];

type Task = {
  title: string;
  impact: number;
  effort: number;
  friction: number;
  deadline?: string;
  tags?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function DecidePage() {
  const [domain, setDomain] = useState<Domain>("Work");
  const [mood, setMood] = useState<Mood>("Calm");
  const [goal, setGoal] = useState("");
  const [minutes, setMinutes] = useState<number>(30);
  const [energy, setEnergy] = useState<"Low" | "Medium" | "High">("Medium");
  const [tasks, setTasks] = useState<Task[]>([
    { title: "", impact: 3, effort: 3, friction: 3, tags: "" },
    { title: "", impact: 3, effort: 3, friction: 3, tags: "" },
  ]);

  const canRecommend = useMemo(() => {
    const hasGoal = goal.trim().length > 0;
    const hasAnyTaskTitle = tasks.some((t) => t.title.trim().length > 0);
    return hasGoal || hasAnyTaskTitle;
  }, [goal, tasks]);

  const addTask = () => {
    setTasks((prev) => [...prev, { title: "", impact: 3, effort: 3, friction: 3, tags: "" }]);
  };

  const removeTask = (idx: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== idx));
  };

  const resetAll = () => {
    setDomain("Work");
    setMood("Calm");
    setGoal("");
    setMinutes(30);
    setEnergy("Medium");
    setTasks([{ title: "", impact: 3, effort: 3, friction: 3, tags: "" }]);
  };

  const applyTemplate = (label: string) => {
    const t = TEMPLATES.find((x) => x.label === label);
    if (!t) return;
    setDomain(t.domain);
    setMood(t.mood);
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* LEFT SIDEBAR */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <nav className="space-y-1 text-sm">
              {[
                { label: "Overview", href: "/app" },
                { label: "New decision", href: "/app/decide" },
                { label: "Daily focus", href: "/app/daily" },
                { label: "History", href: "/app/history" },
                { label: "Login", href: "/app/login" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* MAIN */}
          <section className="space-y-6">
            <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">New decision</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                What should you do next?
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Pick a domain and how you feel right now — then we’ll choose a next step that fits your energy.
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Decision domain</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {DOMAINS.map((d) => (
                      <button
                        key={d}
                        onClick={() => setDomain(d)}
                        className={[
                          "rounded-full border px-3 py-1 text-sm transition",
                          d === domain
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950/50 dark:text-indigo-200"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
                        ].join(" ")}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">How do you feel?</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {MOODS.map((m) => (
                      <button
                        key={m}
                        onClick={() => setMood(m)}
                        className={[
                          "rounded-full border px-3 py-1 text-sm transition",
                          m === mood
                            ? "border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-400 dark:bg-violet-950/50 dark:text-violet-200"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
                        ].join(" ")}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </header>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">Templates</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Start with a preset and edit in seconds.
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => applyTemplate(t.label)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">Context</div>

              <div className="mt-4">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Goal</label>
                <input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Feel less overwhelmed about this decision"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-indigo-900/40"
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Time available (minutes)
                  </label>
                  <input
                    type="number"
                    value={minutes}
                    min={5}
                    max={480}
                    onChange={(e) => setMinutes(clamp(Number(e.target.value || 0), 5, 480))}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-indigo-900/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Energy</label>
                  <select
                    value={energy}
                    onChange={(e) => setEnergy(e.target.value as any)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-indigo-900/40"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">Tasks</div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Impact = benefit. Effort = time/energy. Emotional friction = how hard it feels to start.
                  </div>
                </div>
                <button
                  onClick={addTask}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95"
                >
                  + Add task
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {tasks.map((t, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">Task {idx + 1}</div>
                      <button
                        onClick={() => removeTask(idx)}
                        className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-3">
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Task title</label>
                      <input
                        value={t.title}
                        onChange={(e) => {
                          const v = e.target.value;
                          setTasks((prev) => prev.map((x, i) => (i === idx ? { ...x, title: v } : x)));
                        }}
                        placeholder="e.g., Send a kind check-in text"
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:ring-indigo-900/40"
                      />
                    </div>

                    <div className="mt-3 grid gap-3 md:grid-cols-4">
                      {[
                        { key: "impact", label: "Impact (1–5)" },
                        { key: "effort", label: "Effort (1–5)" },
                        { key: "friction", label: "Emotional friction (1–5)" },
                      ].map((f) => (
                        <div key={f.key} className="md:col-span-1">
                          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{f.label}</label>
                          <input
                            type="number"
                            min={1}
                            max={5}
                            value={(t as any)[f.key]}
                            onChange={(e) => {
                              const v = clamp(Number(e.target.value || 3), 1, 5);
                              setTasks((prev) =>
                                prev.map((x, i) => (i === idx ? { ...x, [f.key]: v } : x))
                              );
                            }}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:ring-indigo-900/40"
                          />
                        </div>
                      ))}

                      <div className="md:col-span-1">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Deadline (optional)</label>
                        <input
                          type="date"
                          value={t.deadline || ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            setTasks((prev) => prev.map((x, i) => (i === idx ? { ...x, deadline: v } : x)));
                          }}
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:ring-indigo-900/40"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Tags (comma separated)
                      </label>
                      <input
                        value={t.tags || ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setTasks((prev) => prev.map((x, i) => (i === idx ? { ...x, tags: v } : x)));
                        }}
                        placeholder="e.g., relationships, family, health"
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:ring-indigo-900/40"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  disabled={!canRecommend}
                  className={[
                    "rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition",
                    canRecommend
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:brightness-110 active:brightness-95"
                      : "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                  ].join(" ")}
                >
                  Get recommendation
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Clear result
                </button>

                <button
                  onClick={resetAll}
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Reset
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
