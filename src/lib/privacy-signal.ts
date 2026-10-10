import type { RegionPolicy } from "@/lib/region-policy";
import type { ConsentState } from "@/types/privacy";

export const PRIVACY_SIGNAL_VERSION = "privacy-signal-v1";

export interface PrivacySignal {
  framework: RegionPolicy["framework"];
  region: RegionPolicy["signalRegion"];
  model: RegionPolicy["orientation"];
  version: typeof PRIVACY_SIGNAL_VERSION;
  purposes: {
    essential: boolean;
    analytics: boolean;
    advertising: boolean;
  };
  doNotSellOrShare?: boolean;
}

export function buildPrivacySignal(
  policy: RegionPolicy,
  consent: ConsentState,
): PrivacySignal {
  const signal: PrivacySignal = {
    framework: policy.framework,
    region: policy.signalRegion,
    model: policy.orientation,
    version: PRIVACY_SIGNAL_VERSION,
    purposes: {
      essential: consent.essential,
      analytics: consent.analytics,
      advertising: consent.advertising,
    },
  };

  if (policy.controls.doNotSellOrShare) {
    signal.doNotSellOrShare = consent.doNotSellOrShare;
  }

  return signal;
}

export function describePrivacySignal(
  policy: RegionPolicy,
  consent: ConsentState,
): {
  framework: string;
  model: string;
  analytics: string;
  advertising: string;
  contextualAdvertising: string;
  result: string;
  doNotSellOrShare?: string;
} {
  const analytics = consent.analytics ? "Allowed" : "Denied";
  const advertising = consent.advertising ? "Allowed" : "Blocked";

  if (policy.id === "eu") {
    return {
      framework: policy.frameworkLabel,
      model: "Opt-in",
      analytics,
      advertising,
      contextualAdvertising: "Allowed",
      result:
        consent.analytics || consent.advertising
          ? "Non-essential processing follows explicit opt-in."
          : "Analytics and personalized advertising blocked",
    };
  }

  if (policy.id === "us-ca") {
    return {
      framework: policy.frameworkLabel,
      model: "Opt-out",
      analytics,
      advertising,
      contextualAdvertising: "Allowed",
      doNotSellOrShare: consent.doNotSellOrShare ? "Enabled" : "Off",
      result: consent.doNotSellOrShare
        ? "Personalized sharing blocked; contextual ads remain."
        : "Advertising personalization is permitted until opt-out.",
    };
  }

  return {
    framework: policy.frameworkLabel,
    model: "Toggle-based demo",
    analytics,
    advertising,
    contextualAdvertising: "Allowed",
    result: "Processing follows the current purpose toggles.",
  };
}
