const FLOW = [
  "User Interaction",
  "Observed Event",
  "Region Policy",
  "Consent Engine",
  "Processing Decision",
  "Profile / Storage / Network / Ad Decision",
];

const NOTES = [
  "Single centralized consent evaluator",
  "Typed event model",
  "Deterministic policy modules",
  "Simulated vendor and network layer",
  "No external trackers",
  "Privacy-first local demo",
];

export function ArchitecturePanel() {
  return (
    <section className="mx-auto w-full max-w-[1500px] px-5 py-6 sm:px-8">
      <h2 className="text-xl font-semibold tracking-tight text-slate-50">
        How Privacy X-Ray Works
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
        Observation and processing are intentionally separated.
      </p>
      <ol className="mt-6 max-w-xl space-y-2">
        {FLOW.map((item, index) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-0.5 font-mono text-[11px] text-cyan-200/80">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm text-slate-200">{item}</p>
              {index < FLOW.length - 1 ? (
                <p className="text-[11px] text-slate-600" aria-hidden>
                  ↓
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {NOTES.map((note) => (
          <li
            key={note}
            className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-xs leading-5 text-slate-400"
          >
            {note}
          </li>
        ))}
      </ul>
    </section>
  );
}
