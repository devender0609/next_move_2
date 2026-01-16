"use client";

import { useMemo, useState } from "react";

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

type Mood = "Calm" | "Motivated" | "Stressed" | "Tired" | "Overwhelmed" | "Anxious";

type Task = {
  title: string;
  impact: number; // 1-5
  effort: number; // 1-5
  friction: number; // 1-5 (emotional friction)
  deadline?: string; // yyyy-mm-dd
  tags: string;
};

const DOMAIN_TEMPLATES: Record<Domain, { label: string; goal: string; tasks: string[]; tags: string[] }[]> = {
  Work: [
    { label: "Deep focus sprint", goal: "Make visible progress today", tasks: ["Pick one deliverable", "Do a 25-minute focused block", "Send a quick update"], tags: ["work"] },
    { label: "Admin clean-up", goal: "Clear mental clutter", tasks: ["Reply to 3 emails", "Schedule 1 meeting", "Close 5 tabs / files"], tags: ["admin"] },
  ],
  Career: [
    { label: "Career growth", goal: "Move forward professionally", tasks: ["Update 1 portfolio item", "Message 1 mentor", "Apply to 1 opportunity"], tags: ["career"] },
  ],
  Health: [
    { label: "Health reset", goal: "Feel better in body + mind", tasks: ["10-minute walk", "Drink water + snack", "Book appointment if needed"], tags: ["health"] },
    { label: "Sleep support", goal: "Get set up for a better night", tasks: ["Reduce caffeine", "Set bedtime alarm", "Prep tomorrow clothes"], tags: ["sleep"] },
  ],
  Relationships: [
    { label: "Check-in + connection", goal: "Strengthen connection", tasks: ["Send a warm check-in message", "Ask 1 curious question", "Propose a time to talk"], tags: ["relationships"] },
    { label: "Repair / apology", goal: "Reduce tension respectfully", tasks: ["Name what happened (briefly)", "Own your part", "Ask what would help"], tags: ["repair"] },
    { label: "Boundary clarity", goal: "Protect your energy", tasks: ["Write a 1-sentence boundary", "Say no to 1 thing", "Offer an alternative"], tags: ["boundary"] },
  ],
  Family: [
    { label: "Family planning", goal: "Make home life smoother", tasks: ["Plan 1 shared activity", "Assign 1 simple responsibility", "Confirm schedule"], tags: ["family"] },
    { label: "Hard conversation", goal: "Talk about something important", tasks: ["Pick a calm time", "Use “I feel / I need”", "Agree on one next step"], tags: ["conversation"] },
  ],
  Money: [
    { label: "Money clarity", goal: "Reduce financial stress", tasks: ["Review last 7 days spending", "Cancel 1 subscription", "Move a small amount to savings"], tags: ["money"] },
  ],
  "Personal growth": [
    { label: "Skill momentum", goal: "Grow in small steps", tasks: ["Choose 1 skill", "Practice 15 minutes", "Capture 1 takeaway"], tags: ["growth"] },
  ],
  Home: [
    { label: "Household reset", goal: "Make your space easier", tasks: ["Clean one surface", "Start one load", "Put 10 items away"], tags: ["home"] },
  ],
  "Mental reset": [
    { label: "Overwhelm relief", goal: "Get unstuck gently", tasks: ["Brain-dump for 3 minutes", "Pick the smallest next step", "Do it for 5 minutes"], tags: ["reset"] },
    { label: "Anxiety ease", goal: "Lower nervous system load", tasks: ["3 slow breaths", "Write what you can control", "Do 1 tiny action"], tags: ["anxiety"] },
  ],
};

function clampDeadline(dateStr?: string) {
  if (!dateStr) return undefined;
  // Prevent “deadline can’t be in the past” errors by simply leaving it blank if past.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d < today ? undefined : dateStr;
}

function scoreTask(t: Task) {
  // Higher impact is better; higher effort & friction reduce score.
  // Weight friction slightly stronger for the “life” positioning.
  return t.impact * 2 - t.effort * 1.1 - t.friction * 1.3;
}

function readableReason(domain: Domain, mood: Mood, best: Task) {
  const moodLine: Record<Mood, string> = {
    Calm: "You’re in a steady state — a focused step can land well.",
    Motivated: "You’re motivated — take a meaningful step while the energy is here.",
    Stressed: "You’re stressed — keep the step small and stabilizing.",
    Tired: "You’re tired — choose the lowest-energy action that still helps.",
    Overwhelmed: "You’re overwhelmed — the best next step is the smallest one that reduces load.",
    Anxious: "You’re anxious — pick an action that increases safety and clarity.",
  };

  return `${moodLine[mood]} For ${domain.toLowerCase()}, “${best.title}” balances impact with manageable effort and emotional friction.`;
}

function Chip({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1 text-xs shadow-sm transition",
        active ? "border-transparent bg-accent text-white" : "border-skin bg-surface2 text-muted hover:bg-surface",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function DecidePage() {
  const [domain, setDomain] = useState<Domain>("Work");
  const [mood, setMood] = useState<Mood>("Calm");

  const [goal, setGoal] = useState<string>("");
  const [time, setTime] = useState<number>(30);
  const [energy, setEnergy] = useState<"Low" | "Medium" | "High">("Medium");

  const [tasks, setTasks] = useState<Task[]>([
    { title: "", impact: 3, effort: 3, friction: 3, deadline: "", tags: "" },
    { title: "", impact: 3, effort: 3, friction: 3, deadline: "", tags: "" },
  ]);

  const [result, setResult] = useState<{
    best?: Task;
    alternatives: Task[];
    confidence: "High" | "Medium" | "Low";
    explanation: string;
  } | null>(null);

  const templates = useMemo(() => DOMAIN_TEMPLATES[domain] ?? [], [domain]);

  const background = (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      <div className="absolute -left-28 -top-28 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-accent2/20 blur-3xl" />
      <div className="absolute left-1/3 -bottom-28 h-80 w-80 rounded-full bg-accent3/15 blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/0 dark:to-black/0" />
    </div>
  );

  function applyTemplate(tpl: (typeof templates)[number]) {
    setGoal(tpl.goal);
    setTasks(
      tpl.tasks.slice(0, 4).map((title) => ({
        title,
        impact: 3,
        effort: 2,
        friction: 2,
        deadline: "",
        tags: tpl.tags.join(", "),
      }))
    );
    setResult(null);
  }

  function addTask() {
    setTasks((prev) => [...prev, { title: "", impact: 3, effort: 3, friction: 3, deadline: "", tags: "" }]);
  }

  function removeTask(idx: number) {
    setTasks((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateTask(idx: number, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t, i) => (i === idx ? { ...t, ...patch } : t)));
  }

  function resetAll() {
    setDomain("Work");
    setMood("Calm");
    setGoal("");
    setTime(30);
    setEnergy("Medium");
    setTasks([
      { title: "", impact: 3, effort: 3, friction: 3, deadline: "", tags: "" },
      { title: "", impact: 3, effort: 3, friction: 3, deadline: "", tags: "" },
    ]);
    setResult(null);
  }

  function getRecommendation() {
    const cleaned = tasks
      .map((t) => ({ ...t, deadline: clampDeadline(t.deadline) }))
      .filter((t) => t.title.trim().length > 0);

    if (!goal.trim() && cleaned.length === 0) {
      setResult({
        alternatives: [],
        confidence: "Low",
        explanation: "Add a goal or at least one task so I can suggest a next step.",
      });
      return;
    }

    const scored = cleaned
      .map((t) => ({ t, s: scoreTask(t) }))
      .sort((a, b) => b.s - a.s);

    const best = scored[0]?.t;
    const alternatives = scored.slice(1, 3).map((x) => x.t);

    let confidence: "High" | "Medium" | "Low" = "Medium";
    if (!best) confidence = "Low";
    else if (best.impact >= 4 && best.effort <= 3 && best.friction <= 3) confidence = "High";
    else if (best.effort >= 4 || best.friction >= 4) confidence = "Low";

    const explanation = best ? readableReason(domain, mood, best) : "Add a task to generate a next step.";

    setResult({ best, alternatives, confidence, explanation });
  }

  return (
    <div className="relative">
      {/* Top layout */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left nav card */}
        <aside className="card p-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="text-sm font-semibold">Navigation</div>
          <div className="mt-3 grid gap-2 text-sm">
            <a className="navlink" href="/app/decide">New decision</a>
            <a className="navlink" href="/app/daily">Daily focus</a>
            <a className="navlink" href="/app/history">History</a>
            <a className="navlink" href="/app/login">Login</a>
          </div>

          <div className="mt-6 border-t border-skin pt-4">
            <div className="text-xs text-muted">
              Tip: This app is for <span className="font-medium text-app">life decisions</span> too —
              health, relationships, home, money, and mental reset.
            </div>
          </div>
        </aside>

        {/* Main panel */}
        <section className="space-y-6">
          {/* Header panel */}
          <div className="relative overflow-hidden rounded-3xl border border-skin bg-surface shadow-soft">
            {background}
            <div className="relative p-6 md:p-8">
              <div className="text-xs text-muted">New decision</div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
                What should you do next?
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                Pick a domain and how you feel right now — then we’ll choose a next step that fits your energy.
              </p>

              <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Domain */}
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-muted">Decision domain</div>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(DOMAIN_TEMPLATES) as Domain[]).map((d) => (
                      <Chip key={d} active={domain === d} onClick={() => { setDomain(d); setResult(null); }}>
                        {d}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Mood */}
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-muted">How do you feel?</div>
                  <div className="flex flex-wrap gap-2">
                    {(["Calm", "Motivated", "Stressed", "Tired", "Overwhelmed", "Anxious"] as Mood[]).map((m) => (
                      <Chip key={m} active={mood === m} onClick={() => { setMood(m); setResult(null); }}>
                        {m}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Templates */}
          <div className="card p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">Templates</div>
                <div className="text-sm text-muted">Start with a preset and edit in seconds.</div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {templates.map((t) => (
                <button key={t.label} className="pill" type="button" onClick={() => applyTemplate(t)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Goal + context */}
          <div className="card p-5">
            <div className="text-sm font-semibold">Context</div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="label">Goal</label>
                <input
                  className="input"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Feel less overwhelmed about this decision"
                />
              </div>

              <div>
                <label className="label">Time available (minutes)</label>
                <input
                  className="input"
                  type="number"
                  value={time}
                  onChange={(e) => setTime(Number(e.target.value || 0))}
                  min={0}
                />
              </div>

              <div>
                <label className="label">Energy</label>
                <select className="input" value={energy} onChange={(e) => setEnergy(e.target.value as any)}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Tasks</div>
                <div className="text-sm text-muted">
                  Impact = benefit. Effort = time/energy. Emotional friction = how hard it feels to start.
                </div>
              </div>
              <button className="btn-primary" type="button" onClick={addTask}>
                + Add task
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {tasks.map((t, idx) => (
                <div key={idx} className="rounded-2xl border border-skin bg-surface2 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold text-muted">Task {idx + 1}</div>
                    <button className="btn-ghost" type="button" onClick={() => removeTask(idx)} disabled={tasks.length <= 1}>
                      Remove
                    </button>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-12">
                    <div className="md:col-span-12">
                      <label className="label">Task title</label>
                      <input
                        className="input"
                        value={t.title}
                        onChange={(e) => updateTask(idx, { title: e.target.value })}
                        placeholder="e.g., Send a kind check-in text"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="label">Impact (1–5)</label>
                      <input
                        className="input"
                        type="number"
                        min={1}
                        max={5}
                        value={t.impact}
                        onChange={(e) => updateTask(idx, { impact: Number(e.target.value || 1) })}
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="label">Effort (1–5)</label>
                      <input
                        className="input"
                        type="number"
                        min={1}
                        max={5}
                        value={t.effort}
                        onChange={(e) => updateTask(idx, { effort: Number(e.target.value || 1) })}
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="label">Emotional friction (1–5)</label>
                      <input
                        className="input"
                        type="number"
                        min={1}
                        max={5}
                        value={t.friction}
                        onChange={(e) => updateTask(idx, { friction: Number(e.target.value || 1) })}
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="label">Deadline (optional)</label>
                      <input
                        className="input"
                        type="date"
                        value={t.deadline || ""}
                        onChange={(e) => updateTask(idx, { deadline: e.target.value })}
                      />
                    </div>

                    <div className="md:col-span-12">
                      <label className="label">Tags (comma separated)</label>
                      <input
                        className="input"
                        value={t.tags}
                        onChange={(e) => updateTask(idx, { tags: e.target.value })}
                        placeholder="e.g., relationships, family, health"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button className="btn-primary" type="button" onClick={getRecommendation}>
                Get recommendation
              </button>
              <button className="btn-secondary" type="button" onClick={() => setResult(null)}>
                Clear result
              </button>
              <button className="btn-secondary" type="button" onClick={resetAll}>
                Reset
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">Recommendation</div>
                  <div className="mt-1 text-sm text-muted">{result.explanation}</div>
                </div>

                <div className="rounded-full border border-skin bg-surface2 px-3 py-1 text-xs text-muted">
                  Confidence:{" "}
                  <span className="font-semibold text-app">{result.confidence}</span>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-skin bg-surface2 p-4">
                  <div className="text-xs font-semibold text-muted">Best next step</div>
                  <div className="mt-2 text-base font-semibold">{result.best?.title ?? "—"}</div>
                  <div className="mt-2 text-sm text-muted">
                    Confidence means: how well this step balances benefit vs effort and emotional friction, given your mood.
                  </div>
                </div>

                <div className="rounded-2xl border border-skin bg-surface2 p-4">
                  <div className="text-xs font-semibold text-muted">Alternatives</div>
                  <ul className="mt-2 space-y-2 text-sm">
                    {result.alternatives.length ? (
                      result.alternatives.map((a, i) => <li key={i} className="text-app">• {a.title}</li>)
                    ) : (
                      <li className="text-muted">Add more tasks to get alternatives.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
