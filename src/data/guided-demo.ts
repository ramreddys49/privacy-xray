export interface GuidedStep {
  id: string;
  title: string;
  action: string;
  explanation: string;
  targetId: string;
  apply?: "eu" | "engineer";
}

export const GUIDED_STEPS: GuidedStep[] = [
  {
    id: "click-technology",
    title: "Click Technology",
    action: "Use the Technology card on the left.",
    explanation: "Your interaction is observed by the application.",
    targetId: "product-explorer",
  },
  {
    id: "watch-stream",
    title: "Watch the Event Stream",
    action: "Look at the inspector on the right.",
    explanation: "The interaction becomes structured event data.",
    targetId: "live-event-stream",
  },
  {
    id: "analytics-off",
    title: "Turn Analytics Off",
    action: "Use the Analytics purpose control.",
    explanation:
      "The click still happens, but downstream analytics processing is blocked.",
    targetId: "consent-controls",
  },
  {
    id: "switch-eu",
    title: "Switch to EU / GDPR",
    action: "Use the region selector, or press Next to apply the EU demo.",
    explanation:
      "Non-essential processing starts disabled in this simulation.",
    targetId: "demo",
    apply: "eu",
  },
  {
    id: "engineer-view",
    title: "Open Privacy Engineer View",
    action: "Use the mode switch, or press Next to open Engineer View.",
    explanation:
      "Inspect payloads, storage attempts, network decisions, and policy results.",
    targetId: "engineer-view",
    apply: "engineer",
  },
  {
    id: "violation",
    title: "Simulate Privacy Violation",
    action: "Use Simulate privacy violation in Engineer View.",
    explanation:
      "See how the system detects a request that conflicts with consent policy.",
    targetId: "engineer-view",
    apply: "engineer",
  },
];
