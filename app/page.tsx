import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 opacity-20 blur-3xl" />
        <div className="absolute -left-32 -bottom-32 h-80 w-80 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 opacity-20 blur-3xl" />

        <Image
          src="/logo.png"
          alt="NextMove logo"
          width={64}
          height={64}
          className="mb-4"
        />

        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Decide your next move.
        </h1>

        <p className="mt-4 max-w-2xl text-slate-600 text-lg">
          NextMove helps you cut through decision fatigue and tells you
          what to do next — clearly, calmly, and fast.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/app/decide"
            className="rounded-xl px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow hover:opacity-95"
          >
            Try it now
          </Link>
          <Link
            href="/app"
            className="rounded-xl border border-slate-200 px-6 py-3 hover:bg-slate-50"
          >
            Open app
          </Link>
        </div>
      </section>

      {/* Value props */}
      <section className="grid md:grid-cols-3 gap-4">
        {[
          ["No login required", "Use it instantly. Login only if you want to save."],
          ["Clear recommendations", "One best next step, plus alternatives."],
          ["Built for momentum", "Less thinking. More doing."],
        ].map(([title, desc]) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="font-semibold">{title}</div>
            <p className="mt-2 text-sm text-slate-600">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
