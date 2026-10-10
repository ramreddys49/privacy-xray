import { PRODUCT_CATEGORIES } from "@/data/catalog";
import { PURPOSE_LABELS } from "@/lib/consent-policy";
import type {
  CategoryId,
  ConsentState,
  InterestProfile,
  PipelineContext,
  PrivacyEvent,
} from "@/types/privacy";

export type ProfileStrength = "None" | "Low" | "Medium" | "High";

export interface RankedInterest {
  id: CategoryId;
  title: string;
  accent: string;
  raw: number;
  percent: number;
}

export function rankedInterests(profile: InterestProfile): RankedInterest[] {
  const max = Math.max(
    0,
    ...PRODUCT_CATEGORIES.map((category) => profile[category.id]),
  );

  return [...PRODUCT_CATEGORIES]
    .map((category) => ({
      id: category.id,
      title: category.title,
      accent: category.accent,
      raw: profile[category.id],
      percent:
        max === 0 ? 0 : Math.round((profile[category.id] / max) * 100),
    }))
    .sort(
      (left, right) =>
        right.raw - left.raw || left.title.localeCompare(right.title),
    );
}

export function profileStrength(profile: InterestProfile): ProfileStrength {
  const total = PRODUCT_CATEGORIES.reduce(
    (sum, category) => sum + profile[category.id],
    0,
  );
  if (total === 0) return "None";
  if (total < 40) return "Low";
  if (total < 100) return "Medium";
  return "High";
}

export function profileConfidence(profile: InterestProfile): number {
  return rankedInterests(profile)[0]?.percent ?? 0;
}

export function trackingLabel(consent: ConsentState): string {
  if (consent.analytics && consent.advertising) return "Allowed";
  if (!consent.analytics && !consent.advertising) return "Blocked";
  return "Partially blocked";
}

export function categoryTitle(id: string): string {
  return PRODUCT_CATEGORIES.find((category) => category.id === id)?.title ?? id;
}

export function relativeUpdated(iso: string | undefined, now = Date.now()): string {
  if (!iso) return "Not yet";
  const elapsed = Math.max(0, now - new Date(iso).getTime());
  const seconds = Math.floor(elapsed / 1000);
  if (seconds < 2) return "just now";
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return "1 minute ago";
  return `${minutes} minutes ago`;
}

export function interactionLabel(event: PrivacyEvent): string {
  const title = categoryTitle(event.category);
  switch (event.type) {
    case "product_click":
      return `${title} clicked`;
    case "category_view":
      return `Viewed ${title}`;
    case "search":
      return "Searched the catalog";
    case "page_view":
      return "Opened the page";
    case "consent_updated":
      return "Updated a privacy choice";
    case "region_changed":
      return "Changed region policy";
    default:
      return event.type;
  }
}

export interface StoryStep {
  id: string;
  label: string;
  value: string;
  tone: "neutral" | "allowed" | "blocked" | "skipped";
}

export function buildDataStory(context: PipelineContext | null): StoryStep[] {
  if (!context) {
    return [
      { id: "interact", label: "User interaction", value: "Waiting", tone: "neutral" },
      { id: "event", label: "Event observed", value: "—", tone: "neutral" },
      { id: "consent", label: "Consent decision", value: "—", tone: "neutral" },
      { id: "profile", label: "Profile result", value: "—", tone: "neutral" },
      { id: "ad", label: "Ad result", value: "—", tone: "neutral" },
    ];
  }

  const { event, profileChanged, profileDelta, adChanged, adMode } = context;
  const blocked = event.decision === "blocked";
  const title = categoryTitle(event.category);

  return [
    {
      id: "interact",
      label: "User interaction",
      value: interactionLabel(event),
      tone: "neutral",
    },
    {
      id: "event",
      label: "Event observed",
      value: event.type,
      tone: "allowed",
    },
    {
      id: "consent",
      label: "Consent decision",
      value: `${PURPOSE_LABELS[event.purpose]}: ${event.decision.toUpperCase()}`,
      tone: blocked ? "blocked" : "allowed",
    },
    {
      id: "profile",
      label: "Profile result",
      value: profileChanged
        ? `${title} +${profileDelta}`
        : blocked
          ? "Profile unchanged"
          : "Profile unchanged",
      tone: profileChanged ? "allowed" : "skipped",
    },
    {
      id: "ad",
      label: "Ad result",
      value: adChanged
        ? adMode === "personalized" && profileChanged
          ? `${title} Ad`
          : adMode === "contextual"
            ? "Contextual ad"
            : "Ad updated"
        : blocked || !adChanged
          ? adMode === "contextual"
            ? "Ad unchanged / contextual"
            : "Ad unchanged"
          : "Ad unchanged",
      tone: adChanged ? "allowed" : "skipped",
    },
  ];
}

export interface TimelineStep {
  id: string;
  time: string;
  text: string;
}

export function buildStoryTimeline(
  events: PrivacyEvent[],
  context: PipelineContext | null,
): TimelineStep[] {
  const steps: TimelineStep[] = [];
  const chronological = [...events].slice(0, 8).reverse();

  for (const event of chronological) {
    const time = new Date(event.timestamp).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const title = categoryTitle(event.category);

    if (event.type === "category_view") {
      steps.push({ id: `${event.id}-view`, time, text: `Viewed ${title}` });
    } else if (event.type === "product_click") {
      steps.push({
        id: `${event.id}-click`,
        time,
        text: `Clicked ${title} product`,
      });
    } else if (event.type === "search") {
      steps.push({ id: `${event.id}-search`, time, text: "Searched the catalog" });
    } else if (event.type === "consent_updated") {
      steps.push({
        id: `${event.id}-consent`,
        time,
        text: event.decision === "blocked"
          ? "Privacy choice updated"
          : "Updated a privacy choice",
      });
    }

    if (
      context?.event.id === event.id &&
      context.profileChanged &&
      context.profileDelta > 0
    ) {
      steps.push({
        id: `${event.id}-profile`,
        time,
        text: `${title} profile +${context.profileDelta}`,
      });
    }

    if (context?.event.id === event.id && context.adChanged) {
      steps.push({
        id: `${event.id}-ad`,
        time,
        text:
          context.adMode === "contextual"
            ? "Ad switched to contextual"
            : "Personalized ad changed",
      });
    }
  }

  return steps.slice(-5);
}
