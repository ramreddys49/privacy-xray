import { JsonDrawer } from "@/components/json-drawer";
import {
  buildPrivacySignal,
  describePrivacySignal,
} from "@/lib/privacy-signal";
import type { RegionPolicy } from "@/lib/region-policy";
import type { ConsentState } from "@/types/privacy";

interface PrivacySignalPanelProps {
  policy: RegionPolicy;
  consent: ConsentState;
}

export function PrivacySignalPanel({ policy, consent }: PrivacySignalPanelProps) {
  const signal = buildPrivacySignal(policy, consent);
  const explanation = describePrivacySignal(policy, consent);

  return (
    <section className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-cyan-200/70">
        Privacy Signal
      </p>
      <p className="mt-1 text-[11px] text-slate-500">
        Represents the active privacy choices for this demo. Not a TCF or GPP
        string.
      </p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
            Framework
          </dt>
          <dd>{explanation.framework}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
            Model
          </dt>
          <dd>{explanation.model}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
            Analytics
          </dt>
          <dd>{explanation.analytics}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
            Advertising
          </dt>
          <dd>{explanation.advertising}</dd>
        </div>
        {explanation.doNotSellOrShare ? (
          <div className="col-span-2">
            <dt className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
              Do Not Sell or Share
            </dt>
            <dd>{explanation.doNotSellOrShare}</dd>
          </div>
        ) : null}
        <div className="col-span-2">
          <dt className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
            Contextual advertising
          </dt>
          <dd>{explanation.contextualAdvertising}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
            Result
          </dt>
          <dd className="mt-0.5 text-slate-400">{explanation.result}</dd>
        </div>
      </dl>
      <p className="mt-3 text-[11px] leading-5 text-slate-500">{policy.engineerNote}</p>
      <p className="mt-1 font-mono text-[10px] text-slate-500">{signal.version}</p>
      <JsonDrawer label="Raw Privacy Signal JSON" value={signal} />
    </section>
  );
}
