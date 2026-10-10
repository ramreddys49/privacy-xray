import type { PurposePolicies } from "@/lib/consent-policy";
import { isPurposeAllowed } from "@/lib/consent-policy";
import { getVendor } from "@/data/vendors";
import type { SimulatedNetworkRequest, ViolationRecord } from "@/types/simulation";

export function isPolicyViolation(
  request: SimulatedNetworkRequest,
  policies: PurposePolicies,
): boolean {
  return request.status === "sent" && !isPurposeAllowed(policies, request.purpose);
}

export function toViolationRecord(
  request: SimulatedNetworkRequest,
): ViolationRecord {
  const vendor = getVendor(request.vendorId);

  return {
    id: `viol-${request.id}`,
    vendorName: vendor?.name ?? request.vendorId,
    expected: "blocked",
    actual: "attempted transmission",
    reason: request.reason,
    timestamp: request.timestamp,
    requestId: request.id,
  };
}
