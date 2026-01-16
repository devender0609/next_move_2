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
  benefit: number; // 1-5
  energy: number; // 1-5
  resistance: number; // 1-5
  tags: string;
};

type Rec = {
  best: Task;
  alts: Task[];
  why: string;
};

const DOMAINS: Domain[] = [
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

const MOODS: Mood[] = ["Calm", "Motivated", "Stressed", "Tired", "Overwhelmed", "Anxious"];

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function clamp15(n: number) {
  if (Number.isNaN(n)) return 3;
  return Math.max(1, Math.min(5, n));
}

function scoreTask(t: Task, ctx: { minutes: number; energyLevel: "Low" | "Medium" | "High"; mood: Mood }) {
  // Transparent heuristic:
  // score = benefit*2 - energy - resistance (+ small context nudges)
  let s = t.benefit * 2 - t.energy - t.resistance;

  if (ctx.minutes <= 15) s -= (t.energy - 1) * 0.5;
  if (ctx.energyLevel === "Low") s -= (t.energy - 1) * 0.6;
  if (ctx.energyLevel === "High") s += (t.benefit - 3) * 0.2;

  if (ctx.mood === "Overwhelmed" || ctx.mood === "Anxious") s -= (t.resistance - 1) * 0.4;
  if (ctx.mood === "Tired") s -= (t.energy - 1) * 0.35;
  if (ctx.mood === "Motivated") s += (t.benefit - 3) * 0.25;

  return s;
}

export default function DecidePage() {
  const [domain, setDomain] = useState<Domain>("Work");
  const [mood, setMood] = useState<Mood>("Calm");
  const [minutes, setMinutes] = useState(30);
  const [energyLevel, setEnergyLevel] = useState<"Low" | "Medium" | "High">("Medium");

  const [tasks, setTasks] = useState<Task[]>([
    { id: uid(), title: "", benefit: 3, energy: 3, resistance: 3, tags: "" },
    { id: uid(), title: "", benefit: 3, energy: 3, resistance: 3, tags: "" },
    { id: uid(), title: "", benefit: 3, energy: 3, resistance: 3, tags: "" },
  ]);

  const [rec, setRec] = useState<Rec | null>(null);
  const [error, setError] = useState<string>("");

  const canRecommend = useMemo(() => tasks.some((t) => t.title.trim().length > 0), [tasks]);

  function updateTask(id: string, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function addTask() {
    setTasks((prev) => [...prev, { id: uid(), title: "", benefit: 3, energy: 3, resistance: 3, tags: "" }]);
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function resetAll() {
    setDomain("Work");
    setMood("Calm");
    setMinutes(30);
    setEnergyLevel("Medium");
    setTasks([
      { id: uid(), title: "", benefit: 3, energy: 3, resistance: 3, tags: "" },
      { id: uid(), title: "", benefit: 3, energy: 3, resistance: 3, tags: "" },
      { id: uid(), title: "", benefit: 3, energy: 3, resistance: 3, tags: "" },
    ]);
    setRec(null);
    setError("");
  }

  function recommend() {
    setError("");
    setRec(null);

    const valid = tasks
      .map((t) => ({
        ...t,
        title: t.title.trim(),
        benefit: clamp15(t.benefit),
        energy: clamp15(t.energy),
        resistance: clamp15(t.resistance),
      }))
      .filter((t) => t.title.length > 0);

    if (valid.length === 0) {
      setError("Add at least one option title before getting a recommendation.");
      return;
    }

    const ctx = { minutes, energyLevel, mood };
    const ranked = valid
      .map((t) => ({ t, s: scoreTask(t, ctx) }))
      .sort((a, b) => b.s - a.s);

    const best = ranked[0].t;
    const alts = ranked.slice(1, 3).map((x) => x.t);

    const whyParts: string[] = [];
    whyParts.push(
      `Chosen because it balances upside (benefit ${best.benefit}/5) with manageable energy cost (${best.energy}/5) and start-friction (${best.resistance}/5).`
    );

    if (minutes <= 15) whyParts.push("Your time is short, so we penalize high-energy options more.");
    if (energyLevel === "Low") whyParts.push("You set energy to Low, so we favor easier-to-do options.");
    if (mood === "Overwhelmed" || mood === "Anxious") whyParts.push("You picked a high-friction mood, so we penalize hard-to-start options more.");

    setRec({ best, alts, why: whyParts.join(" ") });
  }

  return (
    <div className="container" style={{ paddingBottom: 30 }}>
      <div className="page-head">
        <div className="kicker">New decision</div>
        <h1 className="page-title">Get one best next step</h1>
        <p className="page-sub">Fast clarity using simple, explainable scoring (not “magic AI”).</p>
      </div>

      <section className="card">
        <div className="card-title">Decision context</div>
        <div className="card-sub">Domain + mood help adjust the recommendation slightly.</div>

        <div style={{ marginTop: 12, display: "grid", gap: 14 }}>
          <div>
            <div className="label">Domain</div>
            <div className="chip-row">
              {DOMAINS.map((d) => (
                <button key={d} type="button" className={`chip ${domain === d ? "chip-on" : ""}`} onClick={() => setDomain(d)}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="label">How do you feel?</div>
            <div className="chip-row">
              {MOODS.map((m) => (
                <button key={m} type="button" className={`chip ${mood === m ? "chip-on" : ""}`} onClick={() => setMood(m)}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div className="label">Time (minutes)</div>
              <input
                className="input"
                type="number"
                min={5}
                max={240}
                value={minutes}
                onChange={(e) => setMinutes(Math.max(5, Math.min(240, Number(e.target.value || 30))))}
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
        </div>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="card-title-row">
          <div>
            <div className="card-title">Options</div>
            <div className="card-sub">Add 3–6 concrete actions. Titles matter most.</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-ghost" type="button" onClick={resetAll}>
              Reset
            </button>
            <button className="btn btn-primary" type="button" onClick={addTask}>
              + Add option
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
          {tasks.map((t, i) => (
            <div key={t.id} className="task-card">
              <div className="task-top">
                <div style={{ fontWeight: 800 }}>Option {i + 1}</div>
                <button className="btn btn-ghost" type="button" onClick={() => removeTask(t.id)}>
                  Remove
                </button>
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  <div className="label">Title</div>
                  <input
                    className="input"
                    value={t.title}
                    onChange={(e) => updateTask(t.id, { title: e.target.value })}
                    placeholder="e.g., Text Alex to check in"
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10 }}>
                  <div>
                    <div className="label">Benefit (1–5)</div>
                    <input
                      className="input"
                      type="number"
                      min={1}
                      max={5}
                      value={t.benefit}
                      onChange={(e) => updateTask(t.id, { benefit: clamp15(Number(e.target.value)) })}
                    />
                  </div>
                  <div>
                    <div className="label">Energy (1–5)</div>
                    <input
                      className="input"
                      type="number"
                      min={1}
                      max={5}
                      value={t.energy}
                      onChange={(e) => updateTask(t.id, { energy: clamp15(Number(e.target.value)) })}
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
                      onChange={(e) => updateTask(t.id, { resistance: clamp15(Number(e.target.value)) })}
                    />
                  </div>
                  <div>
                    <div className="label">Tags (optional)</div>
                    <input
                      className="input"
                      value={t.tags}
                      onChange={(e) => updateTask(t.id, { tags: e.target.value })}
                      placeholder="work, health"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <button className="btn btn-primary" type="button" onClick={recommend} disabled={!canRecommend}>
            Get recommendation
          </button>
          <button className="btn btn-ghost" type="button" onClick={() => { setRec(null); setError(""); }}>
            Clear result
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 10, color: "crimson", fontWeight: 700 }}>
            {error}
          </div>
        )}
      </section>

      {rec && (
        <section className="result-card" style={{ marginTop: 16 }}>
          <div className="result-title">Recommendation</div>
          <div className="result-main">{rec.best.title}</div>
          <div className="result-reason">{rec.why}</div>

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
  );
}
