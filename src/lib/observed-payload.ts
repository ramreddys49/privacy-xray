import { PRODUCT_CATEGORIES } from "@/data/catalog";
import type { PrivacyEvent } from "@/types/privacy";
import type { PolicyDecisionView } from "@/types/simulation";

export function buildObservedPayload(event: PrivacyEvent): Record<string, string | number | boolean> {
  const category = PRODUCT_CATEGORIES.find((item) => item.id === event.category);
  const payload: Record<string, string | number | boolean> = {
    event: event.type,
    category: category?.title ?? event.category,
    timestamp: event.timestamp,
    purpose: event.purpose,
  };

  if (event.type === "product_click") {
    payload.productId = `demo-${event.category}-01`;
  }

  for (const [key, value] of Object.entries(event.payload)) {
    payload[key] = value;
  }

  return payload;
}

export function buildPolicyDecisionView(event: PrivacyEvent): PolicyDecisionView {
  const blocked = event.decision === "blocked";

  return {
    observed: true,
    purpose: event.purpose,
    consent: blocked ? "denied" : "granted",
    decision: event.decision,
    processing: blocked
      ? "Stopped before analytics/profile transmission"
      : event.purpose === "essential"
        ? "Essential processing only"
        : "Allowed downstream processing",
    reason: event.reason,
  };
}
