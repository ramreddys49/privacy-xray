import {
  PRIVACY_REGIONS,
  REGION_POLICIES,
  type PrivacyRegion,
} from "@/lib/region-policy";

interface RegionSelectorProps {
  region: PrivacyRegion;
  onChange: (region: PrivacyRegion) => void;
}

export function RegionSelector({ region, onChange }: RegionSelectorProps) {
  return (
    <div
      className="inline-flex max-w-full flex-wrap rounded-full border border-white/10 bg-black/30 p-0.5"
      role="group"
      aria-label="Privacy region"
    >
      {PRIVACY_REGIONS.map((id) => (
        <button
          key={id}
          type="button"
          aria-pressed={region === id}
          onClick={() => onChange(id)}
          className={`rounded-full px-3 py-1.5 text-[11px] font-medium tracking-wide transition ${
            region === id
              ? "bg-cyan-400/15 text-cyan-100"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {REGION_POLICIES[id].label}
        </button>
      ))}
    </div>
  );
}
