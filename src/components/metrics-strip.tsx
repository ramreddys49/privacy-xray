import { profileStrength, trackingLabel } from "@/lib/experience";
import type { RegionPolicy } from "@/lib/region-policy";
import type { AdDecision, ConsentState, InterestProfile } from "@/types/privacy";

interface MetricsStripProps {
  regionPolicy: RegionPolicy;
  consent: ConsentState;
  profile: InterestProfile;
  adDecision: AdDecision;
}

export function MetricsStrip({
  regionPolicy,
  consent,
  profile,
  adDecision,
}: MetricsStripProps) {
  const items = [
    { label: "Framework", value: regionPolicy.frameworkLabel.replace(" demo", "") },
    { label: "Tracking state", value: trackingLabel(consent) },
    { label: "Profile strength", value: profileStrength(profile) },
    {
      label: "Ad mode",
      value: adDecision.mode === "personalized" ? "Personalized" : "Contextual",
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-white/8 bg-black/25 px-2.5 py-2"
        >
          <dt className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
            {item.label}
          </dt>
          <dd className="mt-1 truncate text-[11px] font-medium text-slate-200">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
