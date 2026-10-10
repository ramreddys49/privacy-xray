import type { ConsentState } from "@/types/privacy";

export const PRIVACY_REGIONS = ["eu", "us-ca", "row"] as const;

export type PrivacyRegion = (typeof PRIVACY_REGIONS)[number];

export type ConsentOrientation = "opt-in" | "opt-out";

export type SignalFramework = "GDPR" | "US_CA" | "ROW_DEMO";

export type SignalRegion = "EU" | "US_CA" | "ROW";

export interface RegionPolicy {
  id: PrivacyRegion;
  label: string;
  framework: SignalFramework;
  frameworkLabel: string;
  signalRegion: SignalRegion;
  orientation: ConsentOrientation;
  engineerNote: string;
  controls: {
    analytics: boolean;
    advertising: boolean;
    doNotSellOrShare: boolean;
  };
  defaultConsent: ConsentState;
}

export const REGION_POLICIES: Record<PrivacyRegion, RegionPolicy> = {
  eu: {
    id: "eu",
    label: "EU / GDPR",
    framework: "GDPR",
    frameworkLabel: "GDPR-style demo",
    signalRegion: "EU",
    orientation: "opt-in",
    engineerNote:
      "Non-essential processing requires prior consent in this simulation.",
    controls: {
      analytics: true,
      advertising: true,
      doNotSellOrShare: false,
    },
    defaultConsent: {
      essential: true,
      analytics: false,
      advertising: false,
      doNotSellOrShare: false,
    },
  },
  "us-ca": {
    id: "us-ca",
    label: "US / California",
    framework: "US_CA",
    frameworkLabel: "California-style demo",
    signalRegion: "US_CA",
    orientation: "opt-out",
    engineerNote: "This simulation models an opt-out style privacy regime.",
    controls: {
      analytics: true,
      advertising: false,
      doNotSellOrShare: true,
    },
    defaultConsent: {
      essential: true,
      analytics: true,
      advertising: true,
      doNotSellOrShare: false,
    },
  },
  row: {
    id: "row",
    label: "Rest of World",
    framework: "ROW_DEMO",
    frameworkLabel: "Generic demo",
    signalRegion: "ROW",
    orientation: "opt-out",
    engineerNote:
      "This generic demo lets the user toggle Analytics and Advertising directly.",
    controls: {
      analytics: true,
      advertising: true,
      doNotSellOrShare: false,
    },
    defaultConsent: {
      essential: true,
      analytics: true,
      advertising: true,
      doNotSellOrShare: false,
    },
  },
};

export const DEFAULT_REGION: PrivacyRegion = "row";

export function getRegionPolicy(region: PrivacyRegion): RegionPolicy {
  return REGION_POLICIES[region];
}

export function defaultConsentForRegion(region: PrivacyRegion): ConsentState {
  return { ...REGION_POLICIES[region].defaultConsent };
}

export function applyDoNotSellOrShare(
  region: PrivacyRegion,
  consent: ConsentState,
  enabled: boolean,
): ConsentState {
  if (region !== "us-ca") {
    return { ...consent, doNotSellOrShare: enabled };
  }

  return {
    ...consent,
    doNotSellOrShare: enabled,
    advertising: !enabled,
  };
}
