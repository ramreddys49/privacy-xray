import { PURPOSE_LABELS } from "@/lib/consent-policy";
import { PRODUCT_CATEGORIES } from "@/data/catalog";
import {
  PIPELINE_STAGES,
  type PipelineContext,
  type PipelineStageStatus,
  type PipelineStatusMap,
  type PipelineStepPlan,
  type PrivacyEvent,
} from "@/types/privacy";

export const PIPELINE_STEP_MS = 170;

export const IDLE_PIPELINE_STATUS: PipelineStatusMap = {
  interaction: "idle",
  capture: "idle",
  consent: "idle",
  profile: "idle",
  ad: "idle",
};

function categoryLabel(category: string): string {
  const match = PRODUCT_CATEGORIES.find((item) => item.id === category);
  if (match) return match.title;
  if (category === "home") return "Home";
  if (category === "consent") return "Consent";
  if (category === "catalog") return "Catalog";
  return category;
}

export function latestEventLabel(event: PrivacyEvent): string {
  return `${event.type} · ${categoryLabel(event.category)}`;
}

export function planPipeline(context: PipelineContext): PipelineStepPlan[] {
  const { event, profileChanged, profileDelta, adChanged, adMode } = context;
  const blocked = event.decision === "blocked";
  const settingChange =
    event.type === "consent_updated" || event.type === "region_changed";

  const profileAllowed = profileChanged && !blocked;
  const adAllowed = adChanged && !blocked && event.type !== "page_view";

  return [
    {
      stage: "interaction",
      finalStatus: "allowed",
      title: event.type === "region_changed" ? "Region change" : settingChange ? "Setting change" : "Interaction",
      detail:
        event.type === "region_changed"
          ? "Policy context updated"
          : settingChange
            ? "Preference recorded"
            : "User action",
    },
    {
      stage: "capture",
      finalStatus: "allowed",
      title: "Event captured",
      detail: "Observed",
    },
    {
      stage: "consent",
      finalStatus: blocked ? "blocked" : "allowed",
      title: "Consent check",
      detail: blocked
        ? event.reason
        : `${PURPOSE_LABELS[event.purpose]} · ${event.reason}`,
    },
    {
      stage: "profile",
      finalStatus: profileAllowed ? "allowed" : "skipped",
      title: profileAllowed ? "Profile updated" : "Profile",
      detail: profileAllowed
        ? `${categoryLabel(event.category)} +${profileDelta}`
        : blocked
          ? "Did not run"
          : "Skipped",
    },
    {
      stage: "ad",
      finalStatus: adAllowed ? "allowed" : "skipped",
      title: "Ad decision",
      detail: adAllowed
        ? adMode === "personalized"
          ? "Personalized"
          : "Contextual"
        : blocked
          ? "Unchanged"
          : event.type === "page_view"
            ? "Skipped"
            : "Unchanged",
    },
  ];
}

export interface PipelineFrame {
  delay: number;
  statuses: PipelineStatusMap;
}

export function buildPipelineFrames(steps: PipelineStepPlan[]): PipelineFrame[] {
  const frames: PipelineFrame[] = [];
  let statuses: PipelineStatusMap = { ...IDLE_PIPELINE_STATUS };
  let delay = 0;

  for (let index = 0; index < steps.length; index += 1) {
    const step = steps[index];

    if (step.finalStatus === "skipped") {
      statuses = { ...statuses, [step.stage]: "skipped" };
      frames.push({ delay, statuses });
      delay += Math.round(PIPELINE_STEP_MS * 0.45);
      continue;
    }

    statuses = { ...statuses, [step.stage]: "active" };
    frames.push({ delay, statuses });
    delay += PIPELINE_STEP_MS;

    statuses = { ...statuses, [step.stage]: step.finalStatus };

    if (step.finalStatus === "blocked") {
      const remaining = steps.slice(index + 1).reduce(
        (next, later) => ({ ...next, [later.stage]: "skipped" as const }),
        statuses,
      );
      frames.push({ delay, statuses: remaining });
      break;
    }

    frames.push({ delay, statuses });
  }

  return frames;
}

export function connectorStatus(
  previous: PipelineStageStatus,
  next: PipelineStageStatus,
): PipelineStageStatus {
  if (previous === "idle" && next === "idle") return "idle";
  if (previous === "blocked") return "blocked";
  if (previous === "skipped" || next === "skipped") return "skipped";
  if (previous === "active" || next === "active") return "active";
  if (previous === "allowed") return "allowed";
  return "idle";
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function finalPipelineStatus(steps: PipelineStepPlan[]): PipelineStatusMap {
  return PIPELINE_STAGES.reduce((statuses, stage) => {
    const step = steps.find((item) => item.stage === stage);
    return {
      ...statuses,
      [stage]: step?.finalStatus ?? "idle",
    };
  }, { ...IDLE_PIPELINE_STATUS });
}

export function statusLabel(
  status: PipelineStageStatus,
  detail: string,
): string {
  if (status === "skipped" && detail === "Unchanged") return "Unchanged";
  if (status === "idle") return "Idle";
  if (status === "active") return "Active";
  if (status === "allowed") return "Allowed";
  if (status === "blocked") return "Blocked";
  return "Skipped";
}
