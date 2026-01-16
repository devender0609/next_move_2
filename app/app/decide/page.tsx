"use client";

import { useMemo, useState } from "react";

type Energy = "Low" | "Medium" | "High";
type Domain =
  | "Work"
  | "Health"
  | "Relationships"
  | "Money"
  | "Home"
  | "Personal growth"
  | "Mental reset";

type Task = {
  title: string;
  benefit: number; // 1-5
  effort: number; // 1-5
  friction: number; // 1-5
  tags?: string;
};

type Recommendation = {
  best: Task;
  alternatives: Task[];
  explanation: string[];
  weights: { benefitW: number; effortW: number; frictionW: number };
};

const clamp15 = (n: number) => Math.max(1, Math.min(5, n || 3));

function scoreTask(
  t: Task,
  weights: { benefitW: number; effortW: number; frictionW: number }
) {
  // Momentum Score: higher is better (transparent heuristic)
  return weights.benefitW * t.benefit - weights.effortW * t.effort - weights.frictionW * t.friction;
}

export default function DecidePage() {
  // Stepper
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Situation
  const [goal, setGoal] = useState("");
  const [domain, setDomain] = useState<Domain>("Work");
  const [timeMinutes, setTimeMinutes] = useState(30);
  const [energy, setEnergy] = useState<Energy>("Medium");

  // Tasks
  const [tasks, setTasks] = useState<Task[]>([
    { title: "Draft the first 3 slides", benefit: 4, effort: 3, friction: 2, tags: "work" },
    { title: "Send one kind check-in text", benefit: 4, effort: 2, friction: 2, tags: "relationships" },
    { title: "Do a 10-minute walk", benefit: 3, effort: 2, friction: 2, tags: "health" },
  ]);

  const [showMath, setShowMath] = useState(false);
  const [rec, setRec] = useState<Recommendation | null>(null);

  const domains: Domain[] = ["Work", "Health", "Relationships", "Money", "Home", "Personal growth", "Mental reset"];

  const templates = useMemo(() => {
    return [
      {
        label: "Deep focus sprint",
        domain: "Work" as Domain,
        goal: "Make real progress in one session",
        tasks: [
          { title: "Define the smallest deliverable (1 sentence)", benefit: 5, effort: 1, friction: 2, tags: "work" },
          { title: "25-minute focused sprint", benefit: 4, effort: 3, friction: 3, tags: "work" },
          { title: "Stop after the first deliverable", benefit: 3, effort: 1, friction: 1, tags: "work" },
        ],
      },
      {
        label: "Mental reset (10 minutes)",
        domain: "Mental reset" as Domain,
        goal: "Lower mental load quickly",
        tasks: [
          { title: "Brain-dump 10 items on paper", benefit: 4, effort: 1, friction: 2, tags: "reset" },
          { title: "Pick ONE item to act on", benefit: 4, effort: 1, friction: 3, tags: "reset" },
          { title: "Do the first 2-minute action", benefit: 4, effort: 1, friction: 2, tags: "reset" },
        ],
      },
      {
        label: "Relationship repair",
        domain: "Relationships" as Domain,
        goal: "Reconnect with clarity and kindness",
        tasks: [
          { title: "Send a warm check-in text", benefit: 4, effort: 1, friction: 2, tags: "relationships" },
          { title: "Name the issue in one sentence (draft)", benefit: 5, effort: 2, friction: 4, tags: "relationships" },
          { title: "Propose a simple next step (call/coffee)", benefit: 4, effort: 2, friction: 3, tags: "relationships" },
        ],
      },
      {
        label: "Money clarity",
        domain: "Money" as Domain,
        goal: "Get one concrete next step for finances",
        tasks: [
          { title: "List top 3 money worries (no solving)", benefit: 4, effort: 1, friction: 3, tags: "money" },
          { title: "Check balances / due dates (5 min)", benefit: 4, effort: 1, friction: 2, tags: "money" },
          { title: "Choose ONE action (pay/call/transfer)", benefit: 5, effort: 2, friction: 3, tags: "money" },
        ],
      },
      {
        label: "Health reset",
        domain: "Health" as Domain,
        goal: "Do one thing that helps today",
        tasks: [
          { title: "Drink water + quick snack (if needed)", benefit: 3, effort: 1, friction: 1, tags: "health" },
          { title: "10-minute walk or stretch", benefit: 4, effort: 2, friction: 2, tags: "health" },
          { title: "Schedule the next appointment / refill", benefit: 4, effort: 2, friction: 3, tags: "health" },
        ],
      },
    ];
  }, []);

  function setTemplate(t: typeof templates[number]) {
    setDomain(t.domain);
    setGoal(t.goal);
    setTasks(t.tasks);
    setRec(null);
    setStep(2);
  }

  function updateTask(i: number, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  }

  function addTask() {
    setTasks((prev) => [...prev, { title: "", benefit: 3, effort: 3, friction: 3, tags: "" }]);
  }

  function removeTask(i: number) {
    setTasks((prev) => prev.filter((_, idx) => idx !== i));
  }

  function resetAll() {
    setStep(1);
    setGoal("");
    setDomain("Work");
    setTimeMinutes(30);
    setEnergy("Medium");
    setTasks([{ title: "", benefit: 3, effort: 3, friction: 3, tags: "" }]);
    setRec(null);
    setShowMath(false);
  }

  function computeWeights() {
    // energy + time adjust how harsh we are on effort/friction (transparent)
    const lowEnergy = energy === "Low";
    const highEnergy = energy === "High";

    const shortTime = timeMinutes <= 15;
    const longTime = timeMinutes >= 60;

    let benefitW = 2.0;
    let effortW = 1.0;
    let frictionW = 1.0;

    if (lowEnergy) {
      effortW += 0.3;
      frictionW += 0.3;
    }
    if (highEnergy) {
      effortW -= 0.1;
      frictionW -= 0.1;
    }
    if (shortTime) {
      effortW += 0.2;
    }
    if (longTime) {
      benefitW += 0.1;
    }

    return { benefitW, effortW, frictionW };
  }

  function getNextStep() {
    const cleaned = tasks
      .map((t) => ({
        ...t,
        title: (t.title || "").trim(),
        benefit: clamp15(t.benefit),
        effort: clamp15(t.effort),
        friction: clamp15(t.friction),
      }))
      .filter((t) => t.title.length > 0);

    if (cleaned.length < 1) {
      setRec(null);
      setStep(2);
      return;
    }

    const weights = computeWeights();
    const ranked = [...cleaned].sort((a, b) => scoreTask(b, weights) - scoreTask(a, weights));

    const best = ranked[0];
    const alternatives = ranked.slice(1, 3);

    const explanation: string[] = [];
    explanation.push(`We prioritize momentum: high benefit with manageable effort and low resistance.`);
    explanation.push(
      `With ${energy.toLowerCase()} energy and ${timeMinutes} minutes, we weigh effort and friction a bit more.`
    );
    explanation.push(
      `Score = (${weights.benefitW.toFixed(1)}×Benefit) − (${weights.effortW.toFixed(1)}×Effort) − (${weights.frictionW.toFixed(1)}×Friction).`
    );

    setRec({ best, alternatives, explanation, weights });
    setStep(3);
  }

  return (
    <div className="decide-wrap">
      <div className="decide-head">
        <div>
          <div className="kicker">New decision</div>
          <h1 className="page-title">Get one next step — sized to your energy.</h1>
          <p className="page-sub">Fast clarity. Clear reasoning. No overwhelm.</p>
        </div>

        <div className="stepper">
          <button className={`step ${step === 1 ? "step-on" : ""}`} onClick={() => setStep(1)} type="button">
            1 · Situation
          </button>
          <button className={`step ${step === 2 ? "step-on" : ""}`} onClick={() => setStep(2)} type="button">
            2 · Options
          </button>
          <button className={`step ${step === 3 ? "step-on" : ""}`} onClick={() => setStep(3)} type="button" disabled={!rec}>
            3 · Next step
          </button>
        </div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="card hero-card">
          <div className="hero-visual" aria-hidden="true" />
          <div className="card-title">Situation</div>
          <div className="card-sub">Start with a goal. Then pick time + energy. Templates are optional.</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div>
              <div className="label">Domain (optional)</div>
              <div className="chip-row">
                {domains.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`chip ${d === domain ? "chip-on" : ""}`}
                    onClick={() => setDomain(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="label">Quick templates (optional)</div>
              <div className="template-grid">
                {templates.map((t) => (
                  <button key={t.label} type="button" className="template-card" onClick={() => setTemplate(t)}>
                    <div className="template-title">{t.label}</div>
                    <div className="template-sub">{t.domain}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div className="label">Goal (one sentence)</div>
            <input
              className="input"
              placeholder="e.g., Stop overthinking and move forward today"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <div className="label">Time available (minutes)</div>
              <input
                className="input"
                type="number"
                min={5}
                max={240}
                value={timeMinutes}
                onChange={(e) => setTimeMinutes(Number(e.target.value || 0))}
              />
            </div>

            <div>
              <div className="label">Energy</div>
              <div className="chip-row">
                {(["Low", "Medium", "High"] as Energy[]).map((x) => (
                  <button
                    key={x}
                    type="button"
                    className={`chip ${energy === x ? "chip-on" : ""}`}
                    onClick={() => setEnergy(x)}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn btn-primary" type="button" onClick={() => setStep(2)}>
              Continue
            </button>
            <button className="btn btn-ghost" type="button" onClick={resetAll}>
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="card">
          <div className="card-title-row">
            <div>
              <div className="card-title">Options</div>
              <div className="card-sub">Add 3–6 actions. Keep them concrete and small.</div>
            </div>

            <div className="flex gap-2">
              <button type="button" className="btn btn-primary" onClick={addTask}>
                + Add option
              </button>
              <button type="button" className="btn btn-ghost" onClick={resetAll}>
                Reset
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {tasks.map((t, idx) => (
              <div key={idx} className="task-card">
                <div className="task-top">
                  <div className="label">Action</div>
                  <button className="btn btn-ghost" type="button" onClick={() => removeTask(idx)}>
                    Remove
                  </button>
                </div>

                <input
                  className="input"
                  placeholder="e.g., Text Alex to check in"
                  value={t.title}
                  onChange={(e) => updateTask(idx, { title: e.target.value })}
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
                  <div>
                    <div className="label">Benefit (1–5)</div>
                    <input
                      className="input"
                      type="number"
                      min={1}
                      max={5}
                      value={t.benefit}
                      onChange={(e) => updateTask(idx, { benefit: clamp15(Number(e.target.value)) })}
                    />
                  </div>

                  <div>
                    <div className="label">Effort (1–5)</div>
                    <input
                      className="input"
                      type="number"
                      min={1}
                      max={5}
                      value={t.effort}
                      onChange={(e) => updateTask(idx, { effort: clamp15(Number(e.target.value)) })}
                    />
                  </div>

                  <div>
                    <div className="label">Friction (1–5)</div>
                    <input
                      className="input"
                      type="number"
                      min={1}
                      max={5}
                      value={t.friction}
                      onChange={(e) => updateTask(idx, { friction: clamp15(Number(e.target.value)) })}
                    />
                  </div>

                  <div>
                    <div className="label">Tags (optional)</div>
                    <input
                      className="input"
                      placeholder="e.g., health, relationships"
                      value={t.tags || ""}
                      onChange={(e) => updateTask(idx, { tags: e.target.value })}
                    />
                  </div>
                </div>

                <div className="task-hint">
                  <strong>Tip:</strong> Friction = emotional resistance to starting (not difficulty).
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn btn-primary" type="button" onClick={getNextStep}>
              Get my next step
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => setStep(1)}>
              Back
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && rec && (
        <div className="card result-wrap">
          <div className="result-header">
            <div>
              <div className="card-title">Your next step</div>
              <div className="card-sub">
                Domain: <strong>{domain}</strong> • Time: <strong>{timeMinutes}m</strong> • Energy: <strong>{energy}</strong>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="btn btn-ghost" type="button" onClick={() => setShowMath((v) => !v)}>
                {showMath ? "Hide the math" : "Show the math"}
              </button>
              <button className="btn btn-ghost" type="button" onClick={resetAll}>
                Reset
              </button>
            </div>
          </div>

          <div className="result-card">
            <div className="result-title">Do this next</div>
            <div className="result-main">{rec.best.title}</div>

            <div className="result-why">
              <div className="result-alt-title">Why this?</div>
              <ul className="list-disc pl-5">
                {rec.explanation.slice(0, 2).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>

            {showMath && (
              <div className="math-box">
                <div className="math-title">Momentum Score</div>
                <div className="math-line">
                  Score = ({rec.weights.benefitW.toFixed(1)}×Benefit) − ({rec.weights.effortW.toFixed(1)}×Effort) − (
                  {rec.weights.frictionW.toFixed(1)}×Friction)
                </div>
                <div className="math-line">
                  This is a transparent weighted heuristic (MCDA-style) — it’s not pretending to be a perfect optimizer.
                </div>
              </div>
            )}

            {rec.alternatives.length > 0 && (
              <div className="result-alt">
                <div className="result-alt-title">Good alternatives</div>
                <ul className="list-disc pl-5">
                  {rec.alternatives.map((a) => (
                    <li key={a.title}>{a.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn btn-primary" type="button" onClick={() => setStep(2)}>
              Adjust options
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => setStep(1)}>
              New situation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
