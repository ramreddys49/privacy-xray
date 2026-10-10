import { evaluateConsent, purposeForEventType } from "@/lib/consent-policy";
import type { PrivacyRegion } from "@/lib/region-policy";
import type {
  ConsentState,
  PrivacyEvent,
  PrivacyEventPayload,
  EventType,
} from "@/types/privacy";

export const MAX_VISIBLE_EVENTS = 10;

export function createObservedEvent(
  type: EventType,
  category: string,
  payload: PrivacyEventPayload,
  consent: ConsentState,
  region: PrivacyRegion = "row",
): PrivacyEvent {
  if (typeof window === "undefined") {
    throw new Error("Privacy events must be created on the client after mount.");
  }

  const purpose = purposeForEventType(type);
  const policy = evaluateConsent(purpose, consent, region);

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    type,
    category,
    payload,
    purpose,
    decision: policy.decision,
    reason: policy.reason,
  };
}

export function prependEvent(
  events: PrivacyEvent[],
  next: PrivacyEvent,
  limit = MAX_VISIBLE_EVENTS,
): PrivacyEvent[] {
  return [next, ...events].slice(0, limit);
}

export function formatEventTime(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export function summarizeEvents(events: PrivacyEvent[]) {
  const typeCounts = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.type] = (acc[event.type] ?? 0) + 1;
    return acc;
  }, {});

  const decisionCounts = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.decision] = (acc[event.decision] ?? 0) + 1;
    return acc;
  }, {});

  const categories = new Set(
    events
      .map((event) => event.category)
      .filter(
        (category) =>
          category !== "home" && category !== "consent" && category !== "region",
      ),
  );

  return {
    total: events.length,
    typeCounts,
    decisionCounts,
    categoryCount: categories.size,
    allowed: decisionCounts.allowed ?? 0,
    blocked: decisionCounts.blocked ?? 0,
  };
}
