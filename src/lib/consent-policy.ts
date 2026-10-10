import {
  defaultConsentForRegion,
  getRegionPolicy,
  type PrivacyRegion,
  type RegionPolicy,
} from "@/lib/region-policy";
import type {
  ConsentState,
  EventType,
  PolicyResult,
  Purpose,
} from "@/types/privacy";

export const DEFAULT_CONSENT: ConsentState = defaultConsentForRegion("row");

export const PURPOSE_LABELS: Record<Purpose, string> = {
  essential: "Essential",
  analytics: "Analytics",
  advertising: "Advertising",
};

export function purposeForEventType(type: EventType): Purpose {
  switch (type) {
    case "page_view":
    case "consent_updated":
    case "region_changed":
      return "essential";
    case "category_view":
    case "product_click":
    case "search":
      return "analytics";
  }
}

export function evaluateConsent(
  purpose: Purpose,
  consent: ConsentState,
  region: PrivacyRegion | RegionPolicy = "row",
): PolicyResult {
  const policy = typeof region === "string" ? getRegionPolicy(region) : region;

  if (purpose === "essential") {
    if (!consent.essential) {
      return {
        decision: "limited",
        reason:
          "Essential processing cannot be disabled; required operations continue.",
      };
    }

    return {
      decision: "allowed",
      reason: "Essential processing is always on.",
    };
  }

  if (purpose === "analytics") {
    return consent.analytics
      ? {
          decision: "allowed",
          reason:
            policy.id === "eu"
              ? "Analytics consent was granted."
              : "Analytics consent is enabled.",
        }
      : {
          decision: "blocked",
          reason:
            policy.id === "eu"
              ? "Analytics consent not granted"
              : "Analytics consent disabled",
        };
  }

  const advertisingAllowed =
    policy.id === "us-ca" ? !consent.doNotSellOrShare : consent.advertising;

  if (advertisingAllowed) {
    return {
      decision: "allowed",
      reason:
        policy.id === "us-ca"
          ? "Advertising personalization is permitted until opt-out."
          : "Advertising consent is enabled.",
    };
  }

  return {
    decision: "blocked",
    reason:
      policy.id === "us-ca"
        ? "Do Not Sell or Share is enabled"
        : policy.id === "eu"
          ? "Advertising consent not granted"
          : "Advertising consent disabled",
  };
}

export function canUpdateProfile(result: PolicyResult, purpose: Purpose): boolean {
  return purpose === "analytics" && result.decision === "allowed";
}

export type PurposePolicies = Record<Purpose, PolicyResult>;

export function evaluateAllPurposes(
  consent: ConsentState,
  region: PrivacyRegion | RegionPolicy = "row",
): PurposePolicies {
  const policy = typeof region === "string" ? getRegionPolicy(region) : region;

  return {
    essential: evaluateConsent("essential", consent, policy),
    analytics: evaluateConsent("analytics", consent, policy),
    advertising: evaluateConsent("advertising", consent, policy),
  };
}

export function isPurposeAllowed(
  policies: PurposePolicies,
  purpose: Purpose,
): boolean {
  return policies[purpose].decision === "allowed";
}
