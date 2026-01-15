export default function Privacy() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Privacy Policy</h1>
      <p className="text-slate-600">
        NextMove stores your account email (for login) and any decisions you choose to save (goal, tasks, and recommendations).
        We do not sell your personal data.
      </p>
      <p className="text-slate-600">
        If you enable optional AI explanations, your decision input may be sent to an AI provider to generate clearer text.
        Do not include sensitive personal information in task titles.
      </p>
      <p className="text-slate-600">For deletion requests, contact the site owner.</p>
    </div>
  );
}
