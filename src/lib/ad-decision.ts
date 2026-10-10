import { strongestInterest } from "@/lib/profile-engine";
import type { AdDecision, ConsentState, InterestProfile } from "@/types/privacy";

export function decideAd(
  consent: ConsentState,
  profile: InterestProfile,
): AdDecision {
  if (!consent.advertising) {
    return {
      mode: "contextual",
      title: "General content",
      body: "Behavioral advertising is disabled.",
      reason: "Behavioral advertising is disabled.",
    };
  }

  const top = strongestInterest(profile);

  if (!top || top.score === 0) {
    return {
      mode: "personalized",
      title: "Personalized placement",
      body: "Advertising is eligible to use inferred interests. Explore products to build a profile.",
      reason: "Personalized advertising is enabled.",
    };
  }

  return {
    mode: "personalized",
    title: `${top.title} picks`,
    body: `This simulated placement was selected because ${top.title.toLowerCase()} currently leads your interest scores.`,
    reason: `${top.title} is your strongest inferred interest.`,
  };
}
