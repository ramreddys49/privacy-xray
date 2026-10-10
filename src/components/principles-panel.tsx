const PRINCIPLES = [
  "No real tracking",
  "All data stays local",
  "No external ad SDKs",
  "No real personal information",
  "Consent decisions are observable",
  "Blocked processing remains inspectable",
];

export function PrinciplesPanel() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 py-6 sm:px-8">
      <h2 className="text-xl font-semibold tracking-tight text-slate-50">
        Built with Privacy by Design
      </h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {PRINCIPLES.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-slate-300"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
