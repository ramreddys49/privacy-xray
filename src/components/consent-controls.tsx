import { PURPOSE_LABELS } from "@/lib/consent-policy";
import type { RegionPolicy } from "@/lib/region-policy";
import type { ConsentState, Purpose } from "@/types/privacy";

interface ConsentControlsProps {
  consent: ConsentState;
  regionPolicy: RegionPolicy;
  onToggle: (purpose: Exclude<Purpose, "essential">, enabled: boolean) => void;
  onDoNotSellOrShare: (enabled: boolean) => void;
  onReset: () => void;
}

export function ConsentControls({
  consent,
  regionPolicy,
  onToggle,
  onDoNotSellOrShare,
  onReset,
}: ConsentControlsProps) {
  const purposes: Purpose[] = ["essential", "analytics", "advertising"];

  return (
    <div id="consent-controls" className="scroll-mt-6">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
          Current consent · {regionPolicy.label}
        </p>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-300 transition hover:border-cyan-300/25 hover:text-cyan-100"
        >
          Reset Demo
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {purposes.map((purpose) => {
          const enabled = consent[purpose];
          const locked = purpose === "essential";
          const hidden =
            (purpose === "analytics" && !regionPolicy.controls.analytics) ||
            (purpose === "advertising" && !regionPolicy.controls.advertising);

          if (hidden) {
            return (
              <div
                key={purpose}
                className="rounded-xl border border-white/8 bg-white/[0.03] px-2.5 py-2"
              >
                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
                  {PURPOSE_LABELS[purpose]}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  {purpose === "advertising"
                    ? consent.advertising
                      ? "Allowed"
                      : "Opted out"
                    : enabled
                      ? "On"
                      : "Off"}
                </p>
              </div>
            );
          }

          return (
            <div
              key={purpose}
              className="rounded-xl border border-white/8 bg-white/[0.03] px-2.5 py-2"
            >
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
                {PURPOSE_LABELS[purpose]}
              </p>
              <button
                type="button"
                role="switch"
                aria-label={`${PURPOSE_LABELS[purpose]}, ${enabled ? "on" : "off"}`}
                aria-checked={enabled}
                aria-disabled={locked}
                disabled={locked}
                onClick={() => {
                  if (purpose === "essential") return;
                  onToggle(purpose, !enabled);
                }}
                className="mt-2 flex w-full items-center justify-between gap-2 disabled:cursor-not-allowed"
              >
                <span
                  className={`text-xs font-medium ${
                    enabled ? "text-emerald-300/90" : "text-slate-400"
                  }`}
                >
                  {locked ? "Required" : enabled ? "On" : "Off"}
                </span>
                <span
                  className={`relative h-4 w-7 rounded-full transition ${
                    enabled ? "bg-emerald-400/80" : "bg-slate-600"
                  } ${locked ? "opacity-70" : ""}`}
                >
                  <span
                    className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition ${
                      enabled ? "left-3.5" : "left-0.5"
                    }`}
                  />
                </span>
              </button>
            </div>
          );
        })}
      </div>
      {regionPolicy.controls.doNotSellOrShare ? (
        <button
          type="button"
          role="switch"
          aria-label={`Do Not Sell or Share, ${consent.doNotSellOrShare ? "enabled" : "off"}`}
          aria-checked={consent.doNotSellOrShare}
          onClick={() => onDoNotSellOrShare(!consent.doNotSellOrShare)}
          className="mt-2 flex w-full items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2"
        >
          <span>
            <span className="block text-[10px] uppercase tracking-[0.12em] text-slate-500">
              US / California
            </span>
            <span className="mt-1 block text-xs font-medium text-slate-200">
              Do Not Sell or Share
            </span>
          </span>
          <span className="flex items-center gap-2">
            <span
              className={`text-xs font-medium ${
                consent.doNotSellOrShare ? "text-amber-300" : "text-slate-400"
              }`}
            >
              {consent.doNotSellOrShare ? "Enabled" : "Off"}
            </span>
            <span
              className={`relative h-4 w-7 rounded-full transition ${
                consent.doNotSellOrShare ? "bg-amber-400/80" : "bg-slate-600"
              }`}
            >
              <span
                className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition ${
                  consent.doNotSellOrShare ? "left-3.5" : "left-0.5"
                }`}
              />
            </span>
          </span>
        </button>
      ) : null}
    </div>
  );
}
