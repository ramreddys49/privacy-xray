export const EVENT_TYPES = [
  "page_view",
  "category_view",
  "product_click",
  "search",
  "consent_updated",
  "region_changed",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const PURPOSES = ["essential", "analytics", "advertising"] as const;

export type Purpose = (typeof PURPOSES)[number];

export type ConsentDecision = "allowed" | "blocked" | "limited";

export type CategoryId = "technology" | "travel" | "fitness" | "fashion";

export type PrivacyEventPayload = Record<string, string | number | boolean>;

export interface ConsentState {
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
  doNotSellOrShare: boolean;
}

export interface PolicyResult {
  decision: ConsentDecision;
  reason: string;
}

export interface PrivacyEvent {
  id: string;
  timestamp: string;
  type: EventType;
  category: string;
  payload: PrivacyEventPayload;
  purpose: Purpose;
  decision: ConsentDecision;
  reason: string;
}

export interface ProductCategory {
  id: CategoryId;
  title: string;
  description: string;
  accent: string;
}

export type InterestProfile = Record<CategoryId, number>;

export type AdMode = "personalized" | "contextual";

export interface AdDecision {
  mode: AdMode;
  title: string;
  body: string;
  reason: string;
}

export const PIPELINE_STAGES = [
  "interaction",
  "capture",
  "consent",
  "profile",
  "ad",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export type PipelineStageStatus =
  | "idle"
  | "active"
  | "allowed"
  | "blocked"
  | "skipped";

export interface PipelineStepPlan {
  stage: PipelineStage;
  finalStatus: Extract<PipelineStageStatus, "allowed" | "blocked" | "skipped">;
  title: string;
  detail: string;
}

export interface PipelineContext {
  event: PrivacyEvent;
  profileChanged: boolean;
  profileDelta: number;
  adChanged: boolean;
  adMode: AdMode;
  regionLabel: string;
  frameworkLabel: string;
}

export type PipelineStatusMap = Record<PipelineStage, PipelineStageStatus>;
