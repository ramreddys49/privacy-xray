const ITEMS = [
  "Runs entirely in your browser",
  "No real analytics SDKs",
  "No real advertising network",
  "Educational privacy simulation",
];

export function TrustStrip() {
  return (
    <section
      className="mx-auto w-full max-w-[1440px] px-5 pb-5 sm:px-8"
      aria-label="Privacy assurances"
    >
      <ul className="grid gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <li key={item} className="flex items-center gap-2 text-[12px] text-slate-300">
            <span className="text-emerald-300" aria-hidden>
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
