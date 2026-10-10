import { ConsentControls } from "@/components/consent-controls";
import { RegionSelector } from "@/components/region-selector";
import type { ConsentState, Purpose } from "@/types/privacy";
import type { PrivacyRegion, RegionPolicy } from "@/lib/region-policy";

interface PrivacyContextProps {
  consent: ConsentState;
  regionPolicy: RegionPolicy;
  region: PrivacyRegion;
  onRegionChange: (region: PrivacyRegion) => void;
  onToggle: (purpose: Exclude<Purpose, "essential">, enabled: boolean) => void;
  onDoNotSellOrShare: (enabled: boolean) => void;
  onReset: () => void;
}

export function PrivacyContextPanel({
  consent,
  regionPolicy,
  region,
  onRegionChange,
  onToggle,
  onDoNotSellOrShare,
  onReset,
}: PrivacyContextProps) {
  return (
    <section className="space-y-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
          Privacy context
        </p>
        <p className="mt-1 text-[11px] leading-5 text-slate-500">
          Region selects which privacy policy this demo applies.
        </p>
        <div className="mt-2">
          <p className="mb-1.5 text-[10px] uppercase tracking-[0.12em] text-slate-500">
            Region
          </p>
          <RegionSelector region={region} onChange={onRegionChange} />
        </div>
      </div>
      <ConsentControls
        consent={consent}
        regionPolicy={regionPolicy}
        onToggle={onToggle}
        onDoNotSellOrShare={onDoNotSellOrShare}
        onReset={onReset}
      />
    </section>
  );
}
