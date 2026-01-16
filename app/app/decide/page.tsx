"use client";

import { useMemo, useState } from "react";

type Task = {
  title: string;
  benefit: number; // 1–5
  energy: number; // 1–5
  hardness: number; // 1–5
  deadline?: string;
  tags?: string;
};

type Recommendation = {
  title: string;
  reason: string;
  alternatives: string[];
  confidence: "High" | "Medium" | "Low";
};

const clamp15 = (n: number) => Math.max(1, Math.min(5, n));

export default function DecidePage() {
  const [domain, setDomain] = useState<string>("Work");
  const [mood, setMood] = useState<string>("Calm");
  const [goal, setGoal] = useState<string>("");
  const [timeMinutes, setTimeMinutes] = useState<number>(30);
  const [energyLevel, setEnergyLevel] = useState<string>("Medium");

  const [tasks, setTasks] = useState<Task[]>([
    { title: "Draft 3 slides", benefit: 4, energy: 3, hardness: 2, tags: "work, admin" },
    { title: "Send a kind check-in text", benefit: 4, energy: 2, hardness: 2, tags: "relationships" },
  ]);

  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const templates = useMemo(
    () => [
      { label: "Deep focus sprint", domain: "Work", mood: "Motivated", goal: "Make real progress in one session" },
      { label: "Admin clean-up", domain: "Work", mood: "Tired", goal: "Clear small tasks that remove friction" },
      { label: "Health reset", domain: "Health", mood: "Stressed", goal: "Do one small thing that helps today" },
      { label: "Relationship repair", domain: "Relationships", mood: "Anxious", goal: "Reconnect with kindness and clarity" },
      { label: "Money clarity", domain: "Money", mood: "Overwhelmed", goal: "Get one concrete next action for finances" },
      { label: "Mental reset", domain: "Mental reset", mood: "Overwhelmed", goal: "Reduce mental load in 10 minutes" },
    ],
    []
  );

  const domains = ["Work", "Career", "Health", "Relationships", "Family", "Money", "Home", "Personal growth", "Mental reset"];
  const moods = ["Calm", "Motivated", "Stressed", "Tired", "Overwhelmed", "Anxious"];

  function updateTask(idx: number, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t, i) => (i === idx ? { ...t, ...patch } : t)));
  }

  function addTask() {
    setTasks((prev) => [...prev, { title: "", benefit: 3, energy: 3, hardness: 3, tags: "" }]);
  }

  function removeTask(idx: number) {
    setTasks((prev) => prev.filter((_, i) => i !== idx));
  }

  function clearResult() {
    setRecommendation(null);
  }

  function resetAll() {
    setDomain("Work");
    setMood("Calm");
    setGoal("");
    setTimeMinutes(30);
    setEnergyLevel("Medium");
    setTasks([{ title: "", benefit: 3, energy: 3, hardness: 3, tags: "" }]);
    setRecommendation(null);
  }

  function scoreTask(t: Task) {
    const energyBias = energyLevel === "Low" ? 0.4 : energyLevel === "High" ? -0.2 : 0.0;
    const timeBias = timeMinutes <= 15 ? 0.3 : timeMinutes >= 60 ? -0.1 : 0.0;

    return t.benefit * 1.2 - t.energy * (1.0 + energyBias) - t.hardness * 0.9 + timeBias;
  }

  function computeConfidence(best: Task) {
    const ease = 6 - (best.energy + best.hardness) / 2;
    const strength = best.benefit + ease;
    if (strength >= 8) return "High";
    if (strength >= 6.5) return "Medium";
    return "Low";
  }

  function getRecommendation() {
    const cleaned = tasks
      .map((t) => ({
        ...t,
        title: (t.title || "").trim(),
        benefit: clamp15(Number(t.benefit)),
        energy: clamp15(Number(t.energy)),
        hardness: clamp15(Number(t.hardness)),
      }))
      .filter((t) => t.title.length > 0);

    if (cleaned.length === 0) {
      setRecommendation({
        title: "Add one task to get a recommendation",
        reason: "Type a task title (even a tiny one). Then click Get recommendation again.",
        alternatives: [],
        confidence: "Low",
      });
      return;
    }

    const ranked = [...cleaned].sort((a, b) => scoreTask(b) - scoreTask(a));
    const best = ranked[0];
    const alternatives = ranked.slice(1, 3).map((t) => t.title);

    setRecommendation({
      title: best.title,
      reason: `Chosen because it balances benefit with a manageable energy cost and resistance for your current mood (${mood}) and energy (${energyLevel}).`,
      alternatives,
      confidence: computeConfidence(best),
    });
  }

  return (
    <div className="space-y-8">
      <div className="page-head">
        <div>
          <div className="kicker">New decision</div>
          <h1 className="page-title">What should you do next?</h1>
          <p className="page-sub">
            Pick a domain and how you feel right now — then we’ll choose a next step that fits your energy.
          </p>
        </div>
      </div>

      {/* ✅ Full-width content (no duplicate sidebar/grid) */}
      <section className="space-y-6">
        <div className="card">
          <div className="card-title">Decision context</div>
          <div className="card-sub">Keep it simple — this just helps tailor the next step.</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <div className="label">Decision domain</div>
              <div className="chip-row">
                {domains.map((d) => (
                  <button key={d} type="button" className={`chip ${d === domain ? "chip-on" : ""}`} onClick={() => setDomain(d)}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="label">How do you feel?</div>
              <div className="chip-row">
                {moods.map((m) => (
                  <button key={m} type="button" className={`chip ${m === mood ? "chip-on" : ""}`} onClick={() => setMood(m)}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Templates</div>
          <div className="card-sub">Start with a preset and edit in seconds.</div>

          <div className="chip-row mt-3">
            {templates.map((t) => (
              <button
                key={t.label}
                type="button"
                className="chip"
                onClick={() => {
                  setDomain(t.domain);
                  setMood(t.mood);
                  setGoal(t.goal);
                  clearResult();
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Context</div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="label">Goal</div>
              <input className="input" placeholder="e.g., Feel less overwhelmed about this decision" value={goal} onChange={(e) => setGoal(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="label">Time available (minutes)</div>
                <input className="input" type="number" min={5} max={240} value={timeMinutes} onChange={(e) => setTimeMinutes(Number(e.target.value || 0))} />
              </div>

              <div>
                <div className="label">Energy</div>
                <select className="input" value={energyLevel} onChange={(e) => setEnergyLevel(e.target.value)}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title-row">
            <div>
              <div className="card-title">Tasks</div>
              <div className="card-sub">Benefit = upside. Energy cost = time/effort. How hard it feels = resistance.</div>
            </div>

            <button type="button" className="btn btn-primary" onClick={addTask}>
              + Add task
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {tasks.map((t, idx) => (
              <div key={idx} className="task-card">
                <div className="task-top">
                  <div className="label">Task title</div>
                  <button className="btn btn-ghost" type="button" onClick={() => removeTask(idx)}>
                    Remove
                  </button>
                </div>

                <input className="input" placeholder="e.g., Draft 3 slides" value={t.title} onChange={(e) => updateTask(idx, { title: e.target.value })} />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
                  <div>
                    <div className="label">Benefit (1–5)</div>
                    <input className="input" type="number" min={1} max={5} value={t.benefit} onChange={(e) => updateTask(idx, { benefit: Number(e.target.value || 3) })} />
                  </div>

                  <div>
                    <div className="label">Energy cost (1–5)</div>
                    <input className="input" type="number" min={1} max={5} value={t.energy} onChange={(e) => updateTask(idx, { energy: Number(e.target.value || 3) })} />
                  </div>

                  <div>
                    <div className="label">How hard it feels (1–5)</div>
                    <input className="input" type="number" min={1} max={5} value={t.hardness} onChange={(e) => updateTask(idx, { hardness: Number(e.target.value || 3) })} />
                  </div>

                  <div>
                    <div className="label">Deadline (optional)</div>
                    <input className="input" type="date" value={t.deadline || ""} onChange={(e) => updateTask(idx, { deadline: e.target.value })} />
                  </div>
                </div>

                <div className="mt-3">
                  <div className="label">Tags (comma separated)</div>
                  <input className="input" placeholder="e.g., relationships, family, health" value={t.tags || ""} onChange={(e) => updateTask(idx, { tags: e.target.value })} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={getRecommendation}>
              Get recommendation
            </button>
            <button type="button" className="btn btn-ghost" onClick={clearResult}>
              Clear result
            </button>
            <button type="button" className="btn btn-ghost" onClick={resetAll}>
              Reset
            </button>
          </div>

          {recommendation && (
            <div className="result-card mt-6">
              <div className="result-title">Your best next step</div>
              <div className="result-main">{recommendation.title}</div>
              <div className="result-reason">{recommendation.reason}</div>

              <div className="result-meta">
                <span className={`badge badge-${recommendation.confidence.toLowerCase()}`}>Confidence: {recommendation.confidence}</span>
              </div>

              {recommendation.alternatives.length > 0 && (
                <div className="result-alt">
                  <div className="result-alt-title">Alternatives</div>
                  <ul className="list-disc pl-5">
                    {recommendation.alternatives.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
