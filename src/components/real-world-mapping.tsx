const CONCEPT_MAP = [
  {
    demo: "User Interaction",
    production: "Browser event listeners / application events",
  },
  {
    demo: "Observed Event",
    production: "Analytics SDK / event collection layer",
  },
  {
    demo: "Region Policy",
    production: "Geo lookup + regional privacy configuration",
  },
  {
    demo: "Consent Evaluation",
    production: "Consent Management Platform / consent policy engine",
  },
  {
    demo: "Digital Twin",
    production: "Customer profile / audience segmentation / CDP-style profile",
  },
  {
    demo: "Ad Decision",
    production: "Recommendation engine / ad server / personalization layer",
  },
  {
    demo: "Storage",
    production: "Cookies / localStorage / server-side profile storage",
  },
  {
    demo: "Network",
    production: "Vendor API requests / analytics endpoints / advertising endpoints",
  },
  {
    demo: "Violation Detection",
    production: "Privacy QA / compliance monitoring / automated consent validation",
  },
];

const EXAMPLES = [
  { demo: "Region Selector", production: "Geo lookup + CMP configuration" },
  {
    demo: "Consent Controls",
    production: "CMP such as OneTrust, TrustArc, or Didomi",
  },
  {
    demo: "Digital Twin",
    production: "Audience profile / Customer Data Platform",
  },
  {
    demo: "Live Event Console",
    production: "Analytics debugger / event observability",
  },
  {
    demo: "Processing Pipeline",
    production: "Consent enforcement / policy decision engine",
  },
  {
    demo: "Payload Inspector",
    production: "Analytics / telemetry request payload",
  },
  {
    demo: "Storage Simulation",
    production: "Cookies / localStorage / server profile",
  },
  {
    demo: "Network Simulation",
    production: "Vendor API / analytics / ad-tech requests",
  },
  {
    demo: "Personalized Ad",
    production: "Ad server / recommendation engine",
  },
  {
    demo: "Violation Detector",
    production: "Privacy QA / automated compliance monitoring",
  },
];

const PRODUCTION_LAYERS = [
  "Consent Management Platforms (CMPs)",
  "identity resolution",
  "Customer Data Platforms (CDPs)",
  "analytics pipelines",
  "recommendation engines",
  "ad decision systems",
  "vendor management",
  "data governance",
  "consent signal frameworks",
  "automated privacy testing",
];

export function RealWorldMapping() {
  return (
    <section
      className="mx-auto w-full max-w-[1500px] px-5 py-6 sm:px-8"
      aria-labelledby="real-world-heading"
    >
      <h2
        id="real-world-heading"
        className="text-xl font-semibold tracking-tight text-slate-50"
      >
        Real-World Privacy Engineering
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
        How the concepts shown in this demo translate to production privacy
        platforms.
      </p>

      <h3 className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200/80">
        Demo → production mapping
      </h3>
      <p className="mt-1 text-[11px] text-slate-500">
        How would this work on a real website?
      </p>
      <ul className="mt-3 grid gap-2 lg:grid-cols-2">
        {CONCEPT_MAP.map((item) => (
          <li
            key={item.demo}
            className="grid gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-3 sm:grid-cols-2"
          >
            <div>
              <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                What this demo shows
              </p>
              <p className="mt-1 text-sm font-medium text-slate-100">{item.demo}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.12em] text-cyan-200/70">
                Production equivalent
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-300">{item.production}</p>
            </div>
          </li>
        ))}
      </ul>

      <h3 className="mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200/80">
        Production examples
      </h3>
      <p className="mt-1 text-[11px] text-slate-500">
        Named platforms are examples only. This project does not integrate them.
      </p>
      <ul className="mt-3 grid gap-2 md:hidden">
        {EXAMPLES.map((item) => (
          <li
            key={item.demo}
            className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5"
          >
            <p className="text-sm font-medium text-slate-100">{item.demo}</p>
            <p className="mt-1 text-[13px] leading-5 text-slate-400">{item.production}</p>
          </li>
        ))}
      </ul>
      <div className="mt-3 hidden overflow-hidden rounded-xl border border-white/8 md:block">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">
            Privacy X-Ray demo surfaces and their production equivalents
          </caption>
          <thead className="bg-white/[0.04] text-[10px] uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium">
                Privacy X-Ray Demo
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Real-World Production Equivalent
              </th>
            </tr>
          </thead>
          <tbody>
            {EXAMPLES.map((item) => (
              <tr key={item.demo} className="border-t border-white/8">
                <th
                  scope="row"
                  className="px-3 py-2 font-medium text-slate-200"
                >
                  {item.demo}
                </th>
                <td className="px-3 py-2 text-slate-400">{item.production}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <aside className="mt-6 rounded-xl border border-cyan-300/20 bg-cyan-400/[0.06] px-4 py-4">
        <p className="text-sm font-medium text-cyan-50">
          This demo intentionally simplifies production architectures.
        </p>
        <p className="mt-2 text-[13px] leading-6 text-slate-300">
          Real privacy platforms may also include:
        </p>
        <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {PRODUCTION_LAYERS.map((item) => (
            <li key={item} className="flex gap-2 text-[13px] text-slate-300">
              <span className="text-cyan-300" aria-hidden>
                →
              </span>
              {item}
            </li>
          ))}
        </ul>
      </aside>

      <article className="mt-4 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-4">
        <h3 className="text-sm font-semibold tracking-tight text-slate-50">
          Why Privacy Engineering Matters
        </h3>
        <p className="mt-2 max-w-3xl text-[13px] leading-6 text-slate-400">
          Modern websites generate large volumes of behavioral events. Privacy
          engineering helps ensure those events are collected, stored, shared,
          and processed according to user choices, business policy, and
          applicable regional privacy requirements. Privacy X-Ray makes those
          normally invisible decisions observable.
        </p>
      </article>

      <p className="mt-4 max-w-3xl text-[11px] leading-5 text-slate-500">
        Privacy X-Ray is an educational simulation and does not represent a
        production CMP, legal compliance system, or complete implementation of
        GDPR, CCPA/CPRA, TCF, or GPP.
      </p>
    </section>
  );
}
