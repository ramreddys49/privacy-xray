import type { ConsentDecision } from "@/types/privacy";

export const DECISION_STYLES: Record<ConsentDecision, string> = {
  allowed: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  blocked: "border-red-400/25 bg-red-400/10 text-red-300",
  limited: "border-amber-400/25 bg-amber-400/10 text-amber-300",
};

export function DecisionBadge({ decision }: { decision: ConsentDecision }) {
  return (
    <span
      className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${DECISION_STYLES[decision]}`}
    >
      {decision}
    </span>
  );
}
