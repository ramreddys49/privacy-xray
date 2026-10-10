import { evaluateAllPurposes } from "@/lib/consent-policy";
import { simulateNetworkRequests } from "@/lib/network-simulator";
import type { PrivacyRegion } from "@/lib/region-policy";
import { simulateStorageWrites } from "@/lib/storage-simulator";
import type {
  AdDecision,
  ConsentState,
  InterestProfile,
  PrivacyEvent,
} from "@/types/privacy";
import type { DownstreamSnapshot, SimulatedStore } from "@/types/simulation";

export function simulateDownstreamEffects(input: {
  event: PrivacyEvent;
  consent: ConsentState;
  profile: InterestProfile;
  store: SimulatedStore;
  adDecision: AdDecision;
  region: PrivacyRegion;
}): DownstreamSnapshot {
  const policies = evaluateAllPurposes(input.consent, input.region);
  const storage = simulateStorageWrites({
    event: input.event,
    consent: input.consent,
    profile: input.profile,
    previousStore: input.store,
    policies,
  });
  const requests = simulateNetworkRequests({
    event: input.event,
    profile: input.profile,
    policies,
    adDecision: input.adDecision,
  });

  return {
    store: storage.store,
    storageRecords: storage.records,
    requests,
    adMode: input.adDecision.mode,
  };
}
