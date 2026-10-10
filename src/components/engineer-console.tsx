"use client";

import { useState } from "react";
import { JsonDrawer } from "@/components/json-drawer";
import { PrivacySignalPanel } from "@/components/privacy-signal-panel";
import { getVendor } from "@/data/vendors";
import { PRODUCT_CATEGORIES } from "@/data/catalog";
import { PURPOSE_LABELS } from "@/lib/consent-policy";
import {
  buildObservedPayload,
  buildPolicyDecisionView,
} from "@/lib/observed-payload";
import { profileIncrementForEvent } from "@/lib/profile-engine";
import type { RegionPolicy } from "@/lib/region-policy";
import type { ConsentState, PipelineContext, PrivacyEvent } from "@/types/privacy";
import type {
  SimulatedNetworkRequest,
  SimulatedStorageRecord,
  ViolationRecord,
} from "@/types/simulation";

interface EngineerConsoleProps {
  event: PrivacyEvent | null;
  pipelineContext: PipelineContext | null;
  storageRecords: SimulatedStorageRecord[];
  requests: SimulatedNetworkRequest[];
  violations: ViolationRecord[];
  regionPolicy: RegionPolicy;
  consent: ConsentState;
  onSimulateViolation: () => void;
}

const TABS = ["payload", "network", "storage", "policy"] as const;
type ConsoleTab = (typeof TABS)[number];

const TAB_LABELS: Record<ConsoleTab, string> = {
  payload: "Payload",
  network: "Network",
  storage: "Storage",
  policy: "Policy",
};

const STORAGE_STATUS: Record<SimulatedStorageRecord["status"], string> = {
  stored: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  blocked: "border-red-400/25 bg-red-400/10 text-red-300",
  unchanged: "border-white/10 bg-white/5 text-slate-400",
  removed: "border-amber-400/25 bg-amber-400/10 text-amber-300",
};

const NETWORK_STATUS: Record<SimulatedNetworkRequest["status"], string> = {
  sent: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  blocked: "border-red-400/25 bg-red-400/10 text-red-300",
  not_required: "border-white/10 bg-white/5 text-slate-400",
};

function StatusBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.12em] ${className}`}
    >
      {label.replace(/_/g, " ")}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 font-mono text-[11px]">
      <dt className="text-slate-500">{label}</dt>
      <dd className="truncate text-right text-slate-200">{value}</dd>
    </div>
  );
}

function inspectionModel(
  event: PrivacyEvent | null,
  pipelineContext: PipelineContext | null,
  requests: SimulatedNetworkRequest[],
  storageRecords: SimulatedStorageRecord[],
  regionPolicy: RegionPolicy,
) {
  if (!event) return null;
  const category =
    PRODUCT_CATEGORIES.find((item) => item.id === event.category)?.title ??
    event.category;
  const delta =
    pipelineContext?.event.id === event.id && pipelineContext.profileChanged
      ? pipelineContext.profileDelta
      : event.purpose === "analytics" && event.decision === "allowed"
        ? profileIncrementForEvent(event.type)
        : 0;
  const analyticsRequest = requests.find((request) => request.purpose === "analytics");
  const request = analyticsRequest ?? requests[0];
  const vendor = request ? getVendor(request.vendorId) : null;
  const store =
    storageRecords.find((record) => record.key === "interest_profile") ??
    storageRecords[0];
  const regionValue =
    typeof event.payload.region === "string"
      ? event.payload.region
      : regionPolicy.id;

  return {
    category,
    delta,
    request,
    vendor,
    store,
    regionValue,
    blocked: event.decision === "blocked",
  };
}

function LifecycleSummary({
  event,
  pipelineContext,
  requests,
  storageRecords,
  regionPolicy,
}: {
  event: PrivacyEvent | null;
  pipelineContext: PipelineContext | null;
  requests: SimulatedNetworkRequest[];
  storageRecords: SimulatedStorageRecord[];
  regionPolicy: RegionPolicy;
}) {
  const model = inspectionModel(
    event,
    pipelineContext,
    requests,
    storageRecords,
    regionPolicy,
  );
  if (!event || !model) {
    return (
      <p className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-[11px] text-slate-500">
        Waiting for interactions.
      </p>
    );
  }

  const policy = buildPolicyDecisionView(event);

  return (
    <div className="space-y-0 rounded-xl border border-violet-300/20 bg-black/30 px-3 py-3">
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          Input
        </p>
        <dl className="mt-1.5 space-y-1.5">
          <Field label="event" value={event.type} />
          <Field label="category" value={model.category} />
          <Field
            label="payload"
            value={`${event.type} · ${model.category}`}
          />
        </dl>
      </section>
      <p className="py-2 text-center text-[10px] uppercase tracking-[0.16em] text-violet-300/70" aria-hidden>
        ↓
      </p>
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          Policy
        </p>
        <dl className="mt-1.5 space-y-1.5">
          <Field label="region" value={String(model.regionValue)} />
          <Field label="purpose" value={event.purpose} />
          <Field label="consent" value={policy.consent} />
          <Field label="policy" value={policy.processing} />
          <Field label="decision" value={event.decision.toUpperCase()} />
          <Field label="reason" value={event.reason} />
        </dl>
      </section>
      <p className="py-2 text-center text-[10px] uppercase tracking-[0.16em] text-violet-300/70" aria-hidden>
        ↓
      </p>
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Output
        </p>
        <dl className="mt-1.5 space-y-1.5">
          <Field
            label="profileDelta"
            value={
              model.delta > 0
                ? `${model.category.toLowerCase()} +${model.delta}`
                : model.blocked
                  ? "skipped"
                  : "none"
            }
          />
          <Field
            label="storage"
            value={model.store ? `${model.store.key} ${model.store.status.toUpperCase()}` : "none"}
          />
          <Field
            label="network"
            value={
              model.vendor && model.request
                ? `${model.vendor.name} ${model.request.status.toUpperCase()}`
                : "none"
            }
          />
          <Field
            label="ad"
            value={
              pipelineContext?.event.id === event.id
                ? pipelineContext.adMode
                : "see latest"
            }
          />
          <Field
            label="violation"
            value={
              event && requests.some((request) => request.violation)
                ? "detected"
                : "none"
            }
          />
        </dl>
      </section>
    </div>
  );
}

function PayloadPanel({ event }: { event: PrivacyEvent | null }) {
  if (!event) {
    return <p className="text-[11px] text-slate-500">No event observed yet.</p>;
  }

  const payload = buildObservedPayload(event);
  return (
    <>
      <pre className="max-h-56 max-w-full overflow-auto break-all font-mono text-[11px] leading-5 text-slate-300">
        {JSON.stringify(payload, null, 2)}
      </pre>
      <JsonDrawer label="Raw event JSON" value={event} />
    </>
  );
}

function NetworkPanel({
  requests,
  onSimulateViolation,
}: {
  requests: SimulatedNetworkRequest[];
  onSimulateViolation: () => void;
}) {
  return (
    <div>
      <p className="text-[11px] text-slate-500">
        Simulated destinations only. No external request is made.
      </p>
      <ul className="mt-3 space-y-2">
        {requests.length === 0 ? (
          <li className="text-[11px] text-slate-500">No simulated requests for this event.</li>
        ) : (
          requests.map((request) => {
            const vendor = getVendor(request.vendorId);
            return (
              <li
                key={request.id}
                className="rounded-lg border border-white/8 bg-black/20 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-mono text-[11px] text-slate-200">
                    {request.method} {request.destination}
                  </span>
                  <StatusBadge
                    label={request.violation ? "violation" : request.status}
                    className={
                      request.violation
                        ? "border-red-400/40 bg-red-400/15 text-red-200"
                        : NETWORK_STATUS[request.status]
                    }
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  {vendor?.name ?? request.vendorId} · {PURPOSE_LABELS[request.purpose]}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">{request.reason}</p>
                <JsonDrawer label="Raw request JSON" value={request} />
              </li>
            );
          })
        )}
      </ul>
      <button
        type="button"
        onClick={onSimulateViolation}
        className="mt-3 w-full rounded-lg border border-red-400/20 bg-red-400/8 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-red-200 transition hover:border-red-400/40"
      >
        Simulate privacy violation
      </button>
    </div>
  );
}

function StoragePanel({ records }: { records: SimulatedStorageRecord[] }) {
  return (
    <div>
      <p className="text-[11px] text-slate-500">
        Simulated localStorage only. Nothing is written to the browser.
      </p>
      <ul className="mt-3 space-y-2">
        {records.length === 0 ? (
          <li className="text-[11px] text-slate-500">No storage operations for this event.</li>
        ) : (
          records.map((record) => (
            <li
              key={record.id}
              className="rounded-lg border border-white/8 bg-black/20 px-3 py-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-slate-200">
                  {record.key}
                </span>
                <StatusBadge
                  label={record.status}
                  className={STORAGE_STATUS[record.status]}
                />
              </div>
              <p className="mt-1 truncate font-mono text-[10px] text-slate-400">
                {record.value || "—"}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">{record.reason}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function PolicyPanel({
  event,
  regionPolicy,
  consent,
  violations,
}: {
  event: PrivacyEvent | null;
  regionPolicy: RegionPolicy;
  consent: ConsentState;
  violations: ViolationRecord[];
}) {
  const policy = event ? buildPolicyDecisionView(event) : null;

  return (
    <div className="space-y-3">
      {violations[0] ? (
        <div
          className="rounded-xl border border-red-400/30 bg-red-400/8 px-3 py-2.5"
          role="alert"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-red-300">
            Policy violation detected
          </p>
          <p className="mt-1 font-mono text-[11px] text-red-200/80">
            Vendor {violations[0].vendorName} · expected BLOCKED · actual{" "}
            {violations[0].actual}
          </p>
        </div>
      ) : (
        <p className="text-[11px] text-slate-500">
          No violations detected for this session.
        </p>
      )}
      {policy && event ? (
        <dl className="grid grid-cols-2 gap-2 text-xs text-slate-300">
          <div>
            <dt className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
              Purpose
            </dt>
            <dd>{PURPOSE_LABELS[policy.purpose]}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
              Consent
            </dt>
            <dd className="capitalize">{policy.consent}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
              Decision
            </dt>
            <dd className="uppercase">{policy.decision}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
              Observed
            </dt>
            <dd>Yes</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
              Reason
            </dt>
            <dd className="mt-0.5 text-slate-400">{policy.reason}</dd>
          </div>
        </dl>
      ) : (
        <p className="text-[11px] text-slate-500">No policy evaluation yet.</p>
      )}
      <PrivacySignalPanel policy={regionPolicy} consent={consent} />
    </div>
  );
}

function TabContent({
  tab,
  event,
  storageRecords,
  requests,
  violations,
  regionPolicy,
  consent,
  onSimulateViolation,
}: EngineerConsoleProps & { tab: ConsoleTab }) {
  switch (tab) {
    case "payload":
      return <PayloadPanel event={event} />;
    case "network":
      return (
        <NetworkPanel
          requests={requests}
          onSimulateViolation={onSimulateViolation}
        />
      );
    case "storage":
      return <StoragePanel records={storageRecords} />;
    case "policy":
      return (
        <PolicyPanel
          event={event}
          regionPolicy={regionPolicy}
          consent={consent}
          violations={violations}
        />
      );
  }
}

export function EngineerConsole(props: EngineerConsoleProps) {
  const [tab, setTab] = useState<ConsoleTab>("payload");
  const { event, storageRecords, requests, pipelineContext, regionPolicy } = props;
  const eventStorage = event
    ? storageRecords.filter((record) => record.eventId === event.id)
    : [];
  const eventRequests = event
    ? requests.filter((request) => request.eventId === event.id)
    : [];
  const scoped = {
    ...props,
    storageRecords: eventStorage,
    requests: eventRequests,
  };

  return (
    <div id="engineer-console" className="scroll-mt-28 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-100">
          Technical inspection
        </p>
        {event ? (
          <span className="rounded-full border border-violet-300/30 bg-violet-400/10 px-2 py-0.5 font-mono text-[10px] text-violet-100">
            {event.type}
          </span>
        ) : null}
      </div>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <LifecycleSummary
          event={event}
          pipelineContext={pipelineContext}
          requests={eventRequests}
          storageRecords={eventStorage}
          regionPolicy={regionPolicy}
        />
        <div>
          <div className="hidden lg:block">
            <div
              role="tablist"
              aria-label="Event details"
              className="flex flex-wrap gap-1 rounded-lg border border-white/8 bg-black/30 p-1"
            >
              {TABS.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  id={`tab-${item}`}
                  aria-controls={`panel-${item}`}
                  aria-selected={tab === item}
                  onClick={() => setTab(item)}
                  className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 ${
                    tab === item
                      ? "bg-violet-400/20 text-violet-50"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {TAB_LABELS[item]}
                </button>
              ))}
            </div>
            <div
              role="tabpanel"
              id={`panel-${tab}`}
              aria-labelledby={`tab-${tab}`}
              className="mt-3 min-w-0 overflow-hidden rounded-xl border border-white/8 bg-white/[0.03] px-3 py-3"
            >
              <TabContent {...scoped} tab={tab} />
            </div>
          </div>

          <div className="space-y-2 lg:hidden">
            {TABS.map((item) => (
              <details
                key={item}
                open={item === "payload"}
                className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2"
              >
                <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300">
                  {TAB_LABELS[item]}
                </summary>
                <div className="mt-3">
                  <TabContent {...scoped} tab={item} />
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
