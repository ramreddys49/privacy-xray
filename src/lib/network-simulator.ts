import type { PurposePolicies } from "@/lib/consent-policy";
import { isPurposeAllowed } from "@/lib/consent-policy";
import { VENDORS } from "@/data/vendors";
import { strongestInterest } from "@/lib/profile-engine";
import type { AdDecision, InterestProfile, PrivacyEvent } from "@/types/privacy";
import type { SimulatedNetworkRequest } from "@/types/simulation";

function createRequestId(): string {
  return `req-${crypto.randomUUID()}`;
}

function requestForVendor(
  event: PrivacyEvent,
  vendor: (typeof VENDORS)[keyof typeof VENDORS],
  status: SimulatedNetworkRequest["status"],
  reason: string,
  payloadSummary: string,
  violation = false,
): SimulatedNetworkRequest {
  return {
    id: createRequestId(),
    eventId: event.id,
    vendorId: vendor.id,
    destination: `${vendor.destination}${vendor.path}`,
    method: "POST",
    eventType: event.type,
    purpose: vendor.purpose,
    payloadSummary,
    status,
    reason,
    timestamp: event.timestamp,
    violation,
  };
}

export function simulateNetworkRequests(input: {
  event: PrivacyEvent;
  profile: InterestProfile;
  policies: PurposePolicies;
  adDecision: AdDecision;
}): SimulatedNetworkRequest[] {
  const { event, profile, policies, adDecision } = input;
  const requests: SimulatedNetworkRequest[] = [];

  requests.push(
    requestForVendor(
      event,
      VENDORS.sitecore,
      "sent",
      policies.essential.reason,
      `${event.type} · first-party telemetry`,
    ),
  );

  const analyticsEvent =
    event.type === "category_view" ||
    event.type === "product_click" ||
    event.type === "search";

  if (analyticsEvent) {
    const allowed = isPurposeAllowed(policies, "analytics");
    requests.push(
      requestForVendor(
        event,
        VENDORS.analyticsCo,
        allowed ? "sent" : "blocked",
        policies.analytics.reason,
        `${event.type} · ${event.category}`,
      ),
    );
  }

  if (event.type === "product_click") {
    const adsAllowed = isPurposeAllowed(policies, "advertising");
    const eligible = (strongestInterest(profile)?.score ?? 0) > 0;

    if (!adsAllowed) {
      requests.push(
        requestForVendor(
          event,
          VENDORS.adPersonalize,
          "blocked",
          policies.advertising.reason,
          "personalization profile update",
        ),
      );
    } else if (!eligible) {
      requests.push(
        requestForVendor(
          event,
          VENDORS.adPersonalize,
          "not_required",
          "Advertising is allowed, but no inferred interest exists yet.",
          adDecision.mode,
        ),
      );
    } else {
      requests.push(
        requestForVendor(
          event,
          VENDORS.adPersonalize,
          "sent",
          policies.advertising.reason,
          `${adDecision.mode} · ${adDecision.reason}`,
        ),
      );
    }
  }

  return requests;
}

export function simulatePrivacyViolation(input: {
  event: PrivacyEvent;
  policies: PurposePolicies;
}): SimulatedNetworkRequest {
  const { event, policies } = input;
  const adsAllowed = isPurposeAllowed(policies, "advertising");

  return requestForVendor(
    event,
    VENDORS.adPersonalize,
    "sent",
    adsAllowed
      ? "Buggy vendor attempted a duplicate advertising call."
      : "Advertising consent not granted",
    "unauthorized personalization attempt",
    !adsAllowed,
  );
}
