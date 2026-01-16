"use client";

import { useMemo, useState } from "react";

type Domain =
  | "Work"
  | "Career"
  | "Health"
  | "Relationships"
  | "Family"
  | "Money"
  | "Home"
  | "Personal growth"
  | "Mental reset";

type Mood = "Calm" | "Motivated" | "Stressed" | "Tired" | "Overwhelmed" | "Anxious";

type Task = {
  id: string;
  title: string;
  benefit: number; // 1-5 (upside)
  energy: number; // 1-5 (energy/time cost)
  resistance: number; // 1-5 (how hard it feels to start)
  deadline?: string;
  tags: string;
};

type Recommendation = {
  best: Task;
  why: string;
  alts: Task[];
  badges: Array<{ label: string; tone: "high" | "medium" | "low" }>;
};

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

const DOMAIN_OPTIONS: Domain[] = [
  "Work",
  "Career",
  "Health",
  "Relationships",
  "Family",
  "Money",
  "Home",
  "Personal growth",
  "Mental reset",
];

const MOOD_OPTIONS: Mood[] = ["Calm", "Motivated", "Stressed", "Tired", "Overwhelmed", "Anxious"];

const TEMPLATE_SETS: Array<{
  label: string;
  domain: Domain;
  mood: Mood;
  goal: string;
  tasks: Array<Pick<Task, "title" | "benefit" | "energy" | "resistance" | "tags">>;
}> = [
  {
    label: "Deep focus sprint",
    domain: "Work",
    mood: "Calm",
    goal: "Make meaningful progress today",
    tasks: [
      { title: "Outline the next 3 concrete steps", benefit: 4, energy: 2, resistance: 2, tags: "work, planning" },
      { title: "Do 25 minutes on the hardest subtask", benefit: 5, energy: 3, resistance: 3, tags: "work, deep work" },
      { title: "Send 1 unblocker message", benefit: 3, energy: 1, resistance: 2, tags: "work, communication" },
    ],
  },
  {
    label: "Admin clean-up",
    domain: "Work",
    mood: "Tired",
    goal: "Reduce friction and feel caught up",
    tasks: [
      { title: "Delete/triage 20 emails", benefit: 3, energy: 1, resistance: 2, tags: "work, admin" },
      { title: "Pay/bill-check or file 1 thing", benefit: 3, energy: 1, resistance: 2, tags: "admin, money" },
      { title: "Make a 5-line plan for tomorrow", benefit: 4, energy: 1, resistance: 2, tags: "planning" },
    ],
  },
  {
    label: "Relationship repair",
    domain: "Relationships",
    mood: "Anxious",
    goal: "Reduce tension and reconnect",
    tasks: [
      { title: "Send a kind check-in text", benefit: 4, energy: 1, resistance: 2, tags: "relationships" },
      { title: "Write 3 sentences: what I want + what I feel", benefit: 4, energy: 2, resistance: 3, tags: "relationships, reflection" },
      { title: "Schedule a 10-minute call (not the full talk)", benefit: 5, energy: 2, resistance: 4, tags: "relationships" },
    ],
  },
  {
    label: "Health reset",
    domain: "Health",
    mood: "Overwhelmed",
    goal: "Feel a bit better in 30 minutes",
    tasks: [
      { title: "Drink water + small protein snack", benefit: 3, energy: 1, resistance: 1, tags: "health" },
      { title: "10-minute walk or stretch", benefit: 4, energy: 2, resistance: 2, tags: "health, movement" },
      { title: "Book/confirm one appointment", benefit: 5, energy: 2, resistance: 4, tags: "health, admin" },
    ],
  },
  {
    label: "Money clarity",
    domain: "Money",
    mood: "Stressed",
    goal: "Reduce money anxiety with one move",
    tasks: [
      { title: "List 3 upcoming bills + due dates", benefit: 4, energy: 2, resistance: 2, tags: "money" },
      { title: "Cancel one unused subscription", benefit: 4, energy: 1, resistance: 3, tags: "money, admin" },
      { title: "Set a 15-min budget timer", benefit: 3, energy: 2, resistance: 3, tags: "money" },
    ],
  },
  {
    label: "Mental reset",
    domain: "Mental reset",
    mood: "Tired",
    goal: "Get calmer and regain clarity",
    tasks: [
      { title: "2 minutes box breathing", benefit: 3, energy: 1, resistance: 1, tags: "reset" },
      { title: "Write the worry down (one paragraph)", benefit: 4, energy: 2, resistance: 2, tags: "reset, journaling" },
      { title: "Tidy one small surface", benefit: 3, energy: 2, resistance: 2, tags: "home, reset" },
    ],
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Deterministic, explainable ranking (no “AI magic”):
 * score = (benefit*2) - energy - resistance
 * Then small nudges based on selected mood/energy/time.
 */
function scoreTask(t: Task, ctx: { mood: Mood; energyLevel: "Low" | "Medium" | "High"; minutes: number }) {
  let s = t.benefit * 2 - t.energy - t.resistance;

  // If time is short, penalize high-energy tasks a bit more.
  if (ctx.minutes <= 15) s -= (t.energy - 1) * 0.5;
  if (ctx.minutes <= 30) s -= (t.energy - 1) * 0.25;

  // If user says energy is Low, penalize energy cost more.
  if (ctx.energyLevel === "Low") s -= (t.energy - 1) * 0.6;
  if (ctx.energyLevel === "High") s += (t.benefit - 3) * 0.2;

  // Mood nudges:
  if (ctx.mood === "Overwhelmed" || ctx.mood === "Anxious") s -= (t.resistance - 1) * 0.4;
  if (ctx.mood === "Motivated") s += (t.benefit - 3) * 0.25;
  if (ctx.mood === "Tired") s -= (t.energy - 1) * 0.35;
  if (ctx.mood === "Stressed") s -= (t.resistance - 1) * 0.2;

  return s;
}

function impactBadge(t: Task) {
  if (t.benefit >= 4 && t.energy <= 3 && t.resistance <= 3) return { label: "High leverage", tone: "high" as const };
  if (t.benefit >= 3) return { label: "Solid win", tone: "medium" as const };
  return { label: "Small step", tone: "low" as const };
}

export default function DecidePage() {
  const [domain, setDomain] = useState<Domain>("Work");
  const [mood, setMood] = useState<Mood>("Calm");

  const [goal, setGoal] = useState("");
  const [minutes, setMinutes] = useState(30);
  const [energyLevel, setEnergyLevel] = useState<"Low" | "Medium" | "High">("Medium");

  const [tasks, setTasks] = useState<Task[]>([
    { id: uid(), title: "", benefit: 3, energy: 3, resistance: 3, deadline: "", tags: "" },
    { id: uid(), title: "", benefit: 3, energy: 3, resistance: 3, deadline: "", tags: "" },
  ]);

  const [rec, setRec] = useState<Recommendation | null>(null);

  const canRecommend = useMemo(() => tasks.some((t) => t.title.trim().length > 0), [tasks]);

  function applyTemplate(label: string) {
    const t = TEMPLATE_SETS.find((x) => x.label === label);
    if (!t) return;

    setDomain(t.domain);
    setMood(t.mood);
    setGoal(t.goal);
    setMinutes(30);
    setEnergyLevel("Medium");

    setTasks(
      t.tasks.map((x) => ({
        id: uid(),
        title: x.title,
        benefit: x.benefit,
        energy: x.energy,
        resistance: x.resistance,
        deadline: "",
        tags: x.tags,
      }))
    );

    setRec(null);
  }

  function updateTask(id: string, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function addTask() {
    setTasks((prev) => [
      ...prev,
      { id: uid(), title: "", benefit: 3, energy: 3, resistance: 3, deadline: "", tags: "" },
    ]);
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function resetAll() {
    setDomain("Work");
    setMood("Calm");
    setGoal("");
    setMinutes(30);
    setEnergyLevel("Medium");
    setTasks([
      { id: uid(), title: "", benefit: 3, energy: 3, resistance: 3, deadline: "", tags: "" },
      { id: uid(), title: "", benefit: 3, energy: 3, resistance: 3, deadline: "", tags: "" },
    ]);
    setRec(null);
  }

  function clearResult() {
    setRec(null);
  }

  function recommend() {
    const valid = tasks
      .map((t) => ({
        ...t,
        title: t.title.trim(),
        benefit: clamp(t.benefit, 1, 5),
        energy: clamp(t.energy, 1, 5),
        resistance: clamp(t.resistance, 1, 5),
      }))
      .filter((t) => t.title.length > 0);

    if (valid.length === 0) {
      setRec(null);
      return;
    }

    const ctx = { mood, energyLevel, minutes };
    const ranked = [...valid]
      .map((t) => ({ t, s: scoreTask(t, ctx) }))
      .sort((a, b) => b.s - a.s);

    const best = ranked[0].t;
    const alts = ranked.slice(1, 3).map((x) => x.t);

    const whyParts = [
      `It balances upside (benefit ${best.benefit}/5) with energy cost (${best.energy}/5) and start-friction (${best.resistance}/5).`,
    ];

    if (energyLevel === "Low") whyParts.push("You set energy to Low, so we favor options that are easier to start.");
    if (minutes <= 15) whyParts.push("You have limited time, so we favor actions that fit quickly.");
    if (mood === "Overwhelmed" || mood === "Anxious") whyParts.push("You chose a high-friction mood, so we reduce resistance-weighted choices.");

    const badges = [impactBadge(best)];

    setRec({
      best,
      alts,
      why: whyParts.join(" "),
      badges,
    });
  }

  return (
    <div className="container" style={{ paddingBottom: 30 }}>
      <div className="page-head">
        <div className="kicker">New decision</div>
        <h1 className="page-title">What should you do next?</h1>
        <p className="page-sub">
          Keep it simple: pick a domain + how you feel, list a few options, then get one best next step.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 18,
          alignItems: "start",
        }}
      >
        {/* Left sidebar (single nav only — no duplicate middle nav card) */}
        <aside className="sidebar-card">
          <div className="card-title-row" style={{ marginBottom: 10 }}>
            <div>
              <div className="card-title">Overview</div>
              <div className="card-sub">Navigate</div>
            </div>
          </div>

          <div className="sidebar-nav">
            <a className="side-link" href="/app">
              Overview
            </a>
            <a className="side-link side-link-active" href="/app/decide">
              New decision
            </a>
            <a className="side-link" href="/app/focus">
              Daily focus
            </a>
            <a className="side-link" href="/app/history">
              History
            </a>
            <a className="side-link" href="/app/login">
              Login
            </a>
          </div>
        </aside>

        {/* Main */}
        <div style={{ display: "grid", gap: 18 }}>
          {/* Decision context */}
          <section className="card">
            <div className="card-title-row">
              <div>
                <div className="card-title">Decision context</div>
                <div className="card-sub">This helps tailor the recommendation (no extra burden).</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-ghost" type="button" onClick={clearResult}>
                  Clear result
                </button>
                <button className="btn btn-ghost" type="button" onClick={resetAll}>
                  Reset
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
              <div>
                <div className="label">Decision domain</div>
                <div className="chip-row">
                  {DOMAIN_OPTIONS.map((d) => (
                    <button
                      key={d}
                      className={`chip ${domain === d ? "chip-on" : ""}`}
                      type="button"
                      onClick={() => setDomain(d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="label">How do you feel?</div>
                <div className="chip-row">
                  {MOOD_OPTIONS.map((m) => (
                    <button
                      key={m}
                      className={`chip ${mood === m ? "chip-on" : ""}`}
                      type="button"
                      onClick={() => setMood(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 180px", gap: 12, marginTop: 14 }}>
              <div>
                <div className="label">Goal</div>
                <input
                  className="input"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Feel less overwhelmed about this decision"
                />
              </div>

              <div>
                <div className="label">Time (minutes)</div>
                <input
                  className="input"
                  type="number"
                  min={5}
                  max={240}
                  value={minutes}
                  onChange={(e) => setMinutes(clamp(Number(e.target.value || 0), 5, 240))}
                />
              </div>

              <div>
                <div className="label">Energy</div>
                <select className="input" value={energyLevel} onChange={(e) => setEnergyLevel(e.target.value as any)}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
          </section>

          {/* Templates */}
          <section className="card">
            <div className="card-title">Templates</div>
            <div className="card-sub">Optional: load a realistic starter set and edit in seconds.</div>
            <div className="chip-row" style={{ marginTop: 12 }}>
              {TEMPLATE_SETS.map((t) => (
                <button key={t.label} className="chip" type="button" onClick={() => applyTemplate(t.label)}>
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          {/* Tasks */}
          <section className="card">
            <div className="card-title-row">
              <div>
                <div className="card-title">Options</div>
                <div className="card-sub">
                  Score each option (1–5): benefit (upside), energy cost, and how hard it feels to start.
                </div>
              </div>
              <button className="btn btn-primary" type="button" onClick={addTask}>
                + Add option
              </button>
            </div>

            <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
              {tasks.map((t, idx) => (
                <div className="task-card" key={t.id}>
                  <div className="task-top">
                    <div style={{ fontWeight: 800 }}>Option {idx + 1}</div>
                    <button className="btn btn-ghost" type="button" onClick={() => removeTask(t.id)}>
                      Remove
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                    <div>
                      <div className="label">Title</div>
                      <input
                        className="input"
                        value={t.title}
                        onChange={(e) => updateTask(t.id, { title: e.target.value })}
                        placeholder="e.g., Draft 3 slides"
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10 }}>
                      <div>
                        <div className="label">Benefit (1–5)</div>
                        <input
                          className="input"
                          type="number"
                          min={1}
                          max={5}
                          value={t.benefit}
                          onChange={(e) => updateTask(t.id, { benefit: clamp(Number(e.target.value), 1, 5) })}
                        />
                      </div>
                      <div>
                        <div className="label">Energy cost (1–5)</div>
                        <input
                          className="input"
                          type="number"
                          min={1}
                          max={5}
                          value={t.energy}
                          onChange={(e) => updateTask(t.id, { energy: clamp(Number(e.target.value), 1, 5) })}
                        />
                      </div>
                      <div>
                        <div className="label">Hard to start (1–5)</div>
                        <input
                          className="input"
                          type="number"
                          min={1}
                          max={5}
                          value={t.resistance}
                          onChange={(e) =>
                            updateTask(t.id, { resistance: clamp(Number(e.target.value), 1, 5) })
                          }
                        />
                      </div>
                      <div>
                        <div className="label">Deadline (optional)</div>
                        <input
                          className="input"
                          type="date"
                          value={t.deadline || ""}
                          onChange={(e) => updateTask(t.id, { deadline: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="label">Tags (optional)</div>
                      <input
                        className="input"
                        value={t.tags}
                        onChange={(e) => updateTask(t.id, { tags: e.target.value })}
                        placeholder="e.g., work, admin"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
              <button className="btn btn-primary" type="button" onClick={recommend} disabled={!canRecommend}>
                Get recommendation
              </button>
              <button className="btn btn-ghost" type="button" onClick={clearResult}>
                Clear result
              </button>
              <button className="btn btn-ghost" type="button" onClick={resetAll}>
                Reset
              </button>
            </div>
          </section>

          {/* Result */}
          {rec && (
            <section className="result-card" aria-live="polite">
              <div className="result-title">Recommendation</div>
              <div className="result-main">{rec.best.title}</div>
              <div className="result-reason">{rec.why}</div>

              <div className="result-meta">
                {rec.badges.map((b, i) => (
                  <span
                    key={i}
                    className={`badge ${b.tone === "high" ? "badge-high" : b.tone === "medium" ? "badge-medium" : "badge-low"}`}
                  >
                    {b.label}
                  </span>
                ))}
                <span className="badge">{domain}</span>
                <span className="badge">{mood}</span>
                <span className="badge">{minutes} min</span>
                <span className="badge">{energyLevel} energy</span>
              </div>

              {rec.alts.length > 0 && (
                <div className="result-alt">
                  <div className="result-alt-title">Good alternatives</div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {rec.alts.map((a) => (
                      <li key={a.id}>{a.title}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
