import type { AdMode, Purpose } from "@/types/privacy";

export type AppViewMode = "user" | "engineer";

export type StorageWriteStatus = "stored" | "blocked" | "unchanged" | "removed";

export type NetworkRequestStatus = "sent" | "blocked" | "not_required";

export interface SimulatedVendor {
  id: string;
  name: string;
  purpose: Purpose;
  description: string;
  destination: string;
  path: string;
}

export interface SimulatedStore {
  session_id: string;
  consent_state: string;
  interest_profile: string;
  last_category: string;
}

export interface SimulatedStorageRecord {
  id: string;
  eventId: string;
  key: keyof SimulatedStore;
  value: string;
  storageKind: "simulated-localStorage";
  purpose: Purpose;
  status: StorageWriteStatus;
  reason: string;
  timestamp: string;
}

export interface SimulatedNetworkRequest {
  id: string;
  eventId: string;
  vendorId: string;
  destination: string;
  method: "POST";
  eventType: string;
  purpose: Purpose;
  payloadSummary: string;
  status: NetworkRequestStatus;
  reason: string;
  timestamp: string;
  violation: boolean;
}

export interface PolicyDecisionView {
  observed: true;
  purpose: Purpose;
  consent: "granted" | "denied";
  decision: string;
  processing: string;
  reason: string;
}

export interface ViolationRecord {
  id: string;
  vendorName: string;
  expected: "blocked";
  actual: "attempted transmission";
  reason: string;
  timestamp: string;
  requestId: string;
}

export interface DownstreamSnapshot {
  store: SimulatedStore;
  storageRecords: SimulatedStorageRecord[];
  requests: SimulatedNetworkRequest[];
  adMode: AdMode;
}
