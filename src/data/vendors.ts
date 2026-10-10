import type { SimulatedVendor } from "@/types/simulation";

export const VENDORS = {
  sitecore: {
    id: "sitecore",
    name: "SiteCore",
    purpose: "essential",
    description: "First-party experience telemetry required to render the demo.",
    destination: "sitecore.example",
    path: "/telemetry",
  },
  analyticsCo: {
    id: "analytics-co",
    name: "AnalyticsCo",
    purpose: "analytics",
    description: "Simulated measurement vendor for interaction analytics.",
    destination: "analytics.example",
    path: "/events",
  },
  adPersonalize: {
    id: "ad-personalize",
    name: "AdPersonalize",
    purpose: "advertising",
    description: "Simulated personalization vendor for interest-based placements.",
    destination: "ads.example",
    path: "/profile",
  },
} as const satisfies Record<string, SimulatedVendor>;

export const VENDOR_LIST: SimulatedVendor[] = Object.values(VENDORS);

export function getVendor(id: string): SimulatedVendor | undefined {
  return VENDOR_LIST.find((vendor) => vendor.id === id);
}
