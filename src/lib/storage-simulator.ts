import type { PurposePolicies } from "@/lib/consent-policy";
import { isPurposeAllowed } from "@/lib/consent-policy";
import type { ConsentState, InterestProfile, PrivacyEvent } from "@/types/privacy";
import type {
  SimulatedStorageRecord,
  SimulatedStore,
  StorageWriteStatus,
} from "@/types/simulation";

export const EMPTY_STORE: SimulatedStore = {
  session_id: "",
  consent_state: "",
  interest_profile: "",
  last_category: "",
};

export function createEmptyStore(): SimulatedStore {
  return { ...EMPTY_STORE };
}

function createRecordId(): string {
  return `store-${crypto.randomUUID()}`;
}

function writeRecord(
  event: PrivacyEvent,
  key: keyof SimulatedStore,
  attemptedValue: string,
  previousValue: string,
  purpose: SimulatedStorageRecord["purpose"],
  policies: PurposePolicies,
): { record: SimulatedStorageRecord; nextValue: string } {
  const allowed = isPurposeAllowed(policies, purpose);
  let status: StorageWriteStatus;
  let nextValue = previousValue;
  let reason: string;

  if (!allowed) {
    status = "blocked";
    reason = policies[purpose].reason;
  } else if (previousValue === attemptedValue && previousValue !== "") {
    status = "unchanged";
    nextValue = previousValue;
    reason = "Value already present in simulated storage.";
  } else {
    status = "stored";
    nextValue = attemptedValue;
    reason = policies[purpose].reason;
  }

  return {
    nextValue,
    record: {
      id: createRecordId(),
      eventId: event.id,
      key,
      value: attemptedValue,
      storageKind: "simulated-localStorage",
      purpose,
      status,
      reason,
      timestamp: event.timestamp,
    },
  };
}

export function simulateStorageWrites(input: {
  event: PrivacyEvent;
  consent: ConsentState;
  profile: InterestProfile;
  previousStore: SimulatedStore;
  policies: PurposePolicies;
}): { store: SimulatedStore; records: SimulatedStorageRecord[] } {
  const { event, consent, profile, previousStore, policies } = input;
  const records: SimulatedStorageRecord[] = [];
  const nextStore: SimulatedStore = { ...previousStore };

  const session = writeRecord(
    event,
    "session_id",
    previousStore.session_id || "sess-xray-demo",
    previousStore.session_id,
    "essential",
    policies,
  );
  nextStore.session_id = session.nextValue;
  records.push(session.record);

  const consentWrite = writeRecord(
    event,
    "consent_state",
    JSON.stringify(consent),
    previousStore.consent_state,
    "essential",
    policies,
  );
  nextStore.consent_state = consentWrite.nextValue;
  records.push(consentWrite.record);

  const categoryEligible =
    event.type === "category_view" ||
    event.type === "product_click" ||
    event.type === "search";

  if (categoryEligible) {
    const categoryWrite = writeRecord(
      event,
      "last_category",
      event.category,
      previousStore.last_category,
      "analytics",
      policies,
    );
    nextStore.last_category = categoryWrite.nextValue;
    records.push(categoryWrite.record);

    const profileWrite = writeRecord(
      event,
      "interest_profile",
      JSON.stringify(profile),
      previousStore.interest_profile,
      "analytics",
      policies,
    );
    nextStore.interest_profile = profileWrite.nextValue;
    records.push(profileWrite.record);
  }

  return { store: nextStore, records };
}
