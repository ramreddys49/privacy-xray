const STACK = ["Next.js", "React", "TypeScript", "Tailwind CSS"];

export function AboutPanel() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 py-6 sm:px-8">
      <h2 className="text-xl font-semibold tracking-tight text-slate-50">
        About Privacy X-Ray
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
        Privacy X-Ray is an interactive privacy engineering lab built to
        demonstrate how behavioral events, consent policy, profiling, advertising
        decisions, storage, and simulated network activity interact in modern
        web applications.
      </p>
      <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
        Built with
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {STACK.map((item) => (
          <li
            key={item}
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
