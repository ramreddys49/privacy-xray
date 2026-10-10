import { memo, type ReactElement } from "react";
import { strongestInterest } from "@/lib/profile-engine";
import type { AdDecision, InterestProfile } from "@/types/privacy";

interface AdExperienceProps {
  decision: AdDecision;
  profile: InterestProfile;
}

function TechnologyArt() {
  return (
    <svg viewBox="0 0 120 88" className="h-full w-full" aria-hidden>
      <rect x="18" y="16" width="84" height="52" rx="7" fill="#083344" stroke="#7ee7ff" strokeWidth="1.6" />
      <rect x="26" y="24" width="68" height="36" rx="3" fill="#041018" />
      <path d="M18 68h84" stroke="#67e8f9" strokeWidth="1.2" />
      <path d="M48 76h24" stroke="#7ee7ff" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="42" cy="38" r="3" fill="#22d3ee" />
      <path d="M52 38h28M52 46h18" stroke="#67e8f9" strokeWidth="1.4" />
    </svg>
  );
}

function TravelArt() {
  return (
    <svg viewBox="0 0 120 88" className="h-full w-full" aria-hidden>
      <circle cx="60" cy="42" r="22" fill="#082f49" stroke="#7dd3fc" strokeWidth="1.5" />
      <path d="M38 42h44M60 20c8 10 8 24 0 44M60 20c-8 10-8 24 0 44" stroke="#38bdf8" strokeWidth="1.2" />
      <path d="M24 58l36-16 16 8-22 14-12-2z" fill="#0c4a6e" stroke="#bae6fd" strokeWidth="1.2" />
      <path d="M16 74h88" stroke="#38bdf8" strokeWidth="1" opacity="0.45" />
    </svg>
  );
}

function FitnessArt() {
  return (
    <svg viewBox="0 0 120 88" className="h-full w-full" aria-hidden>
      <rect x="38" y="22" width="44" height="44" rx="14" fill="#042f2e" stroke="#5eead4" strokeWidth="1.6" />
      <circle cx="60" cy="44" r="10" fill="none" stroke="#99f6e4" strokeWidth="1.5" />
      <path d="M60 34v10l6 4" stroke="#5eead4" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 70h20l10-16 12 22 10-14 32 0" fill="none" stroke="#2dd4bf" strokeWidth="1.6" />
    </svg>
  );
}

function FashionArt() {
  return (
    <svg viewBox="0 0 120 88" className="h-full w-full" aria-hidden>
      <path
        d="M36 20h48l14 14-38 40-38-40 14-14z"
        fill="#1e1b4b"
        stroke="#c4b5fd"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M36 20c8 10 40 10 48 0" stroke="#a78bfa" strokeWidth="1.4" />
      <path d="M60 20v16" stroke="#ddd6fe" strokeWidth="1.2" />
    </svg>
  );
}

function ContextualArt() {
  return (
    <svg viewBox="0 0 120 88" className="h-full w-full" aria-hidden>
      <rect x="16" y="18" width="28" height="52" rx="4" fill="#111827" stroke="#94a3b8" strokeWidth="1.1" />
      <rect x="46" y="18" width="28" height="52" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1.1" />
      <rect x="76" y="18" width="28" height="52" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1.1" />
      <path d="M22 30h16M22 40h12M52 30h16M82 36h16" stroke="#cbd5e1" strokeWidth="1.1" />
    </svg>
  );
}

const CREATIVES: Record<
  string,
  {
    sponsor: string;
    headline: string;
    subhead: string;
    cta: string;
    panel: string;
    Art: () => ReactElement;
  }
> = {
  technology: {
    sponsor: "Workspace Lab",
    headline: "Upgrade your Workspace",
    subhead: "AI Laptop Collection",
    cta: "Discover More →",
    panel: "from-[#083344] via-[#041018] to-[#020617]",
    Art: TechnologyArt,
  },
  travel: {
    sponsor: "Horizon Escapes",
    headline: "Escape this weekend",
    subhead: "Find your next adventure",
    cta: "Explore →",
    panel: "from-[#0c4a6e] via-[#082f49] to-[#020617]",
    Art: TravelArt,
  },
  fitness: {
    sponsor: "Pulse Studio",
    headline: "Train Smarter",
    subhead: "Improve every workout",
    cta: "Learn More →",
    panel: "from-[#134e4a] via-[#042f2e] to-[#022c22]",
    Art: FitnessArt,
  },
  fashion: {
    sponsor: "Atelier North",
    headline: "New Collection",
    subhead: "Style picked for you",
    cta: "Shop →",
    panel: "from-[#312e81] via-[#1e1b4b] to-[#0f0a1f]",
    Art: FashionArt,
  },
  contextual: {
    sponsor: "Featured Today",
    headline: "General recommendations",
    subhead: "Not personalized",
    cta: "Browse →",
    panel: "from-[#1e293b] via-[#0f172a] to-[#020617]",
    Art: ContextualArt,
  },
};

function AdExperienceComponent({ decision, profile }: AdExperienceProps) {
  const personalized = decision.mode === "personalized";
  const top = strongestInterest(profile);
  const kind =
    !personalized || !top || top.score === 0 ? "contextual" : top.id;
  const visual = CREATIVES[kind] ?? CREATIVES.contextual;
  const Art = visual.Art;
  const why = !personalized
    ? "Shown because advertising is off — this placement is contextual, not inferred from your profile."
    : top && top.score > 0
      ? `The site selected this advertisement because ${top.title} is currently your strongest inferred interest.`
      : "Advertising is eligible, but there is no inferred interest yet, so this stays a generic recommendation.";

  return (
    <section
      aria-live="polite"
      className={`rounded-2xl border p-3 ${
        personalized
          ? "border-cyan-300/25 bg-cyan-400/[0.06]"
          : "border-white/10 bg-black/30"
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
          Sponsored
        </h2>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
            personalized
              ? "border-cyan-300/40 bg-cyan-400/15 text-cyan-100"
              : "border-white/15 bg-white/5 text-slate-300"
          }`}
        >
          {personalized ? "Personalized" : "Contextual"}
        </span>
      </div>

      <article
        key={kind}
        className={`ad-swap relative h-[9.5rem] overflow-hidden rounded-xl bg-gradient-to-br ${visual.panel} px-3 py-3 sm:h-[10.5rem]`}
      >
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/55">
          Sponsored · {visual.sponsor}
        </p>
        <div className="mt-2 grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-3">
          <div className="h-[4.75rem] rounded-lg border border-white/10 bg-black/20">
            <Art />
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-white sm:text-lg">
              {visual.headline}
            </h3>
            <p className="mt-0.5 text-sm text-white/70">{visual.subhead}</p>
            <span className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-900">
              {visual.cta}
            </span>
          </div>
        </div>
      </article>

      <p className="mt-2 text-[11px] leading-5 text-slate-400">{why}</p>
    </section>
  );
}

export const AdExperience = memo(AdExperienceComponent);
