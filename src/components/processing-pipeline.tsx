"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildPipelineFrames,
  connectorStatus,
  finalPipelineStatus,
  IDLE_PIPELINE_STATUS,
  planPipeline,
  prefersReducedMotion,
  statusLabel,
} from "@/lib/pipeline";
import type { PipelineContext, PipelineStageStatus, PipelineStatusMap } from "@/types/privacy";

interface ProcessingPipelineProps {
  context: PipelineContext | null;
}

const STAGE_STYLES: Record<PipelineStageStatus, string> = {
  idle: "border-white/8 bg-white/[0.03] text-slate-400",
  active:
    "border-cyan-300/40 bg-cyan-400/10 text-cyan-50 shadow-[0_0_16px_rgba(56,214,255,0.18)]",
  allowed: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
  blocked: "border-red-400/40 bg-red-400/10 text-red-100 pipeline-stopped",
  skipped: "border-white/8 bg-white/[0.02] text-slate-500",
};

export function ProcessingPipeline({ context }: ProcessingPipelineProps) {
  const [statuses, setStatuses] = useState<PipelineStatusMap>(IDLE_PIPELINE_STATUS);
  const steps = useMemo(
    () => (context ? planPipeline(context) : []),
    [context],
  );
  const eventId = context?.event.id;

  useEffect(() => {
    if (!eventId || steps.length === 0) {
      return;
    }

    const frames = prefersReducedMotion()
      ? [{ delay: 0, statuses: finalPipelineStatus(steps) }]
      : [
          { delay: 0, statuses: IDLE_PIPELINE_STATUS },
          ...buildPipelineFrames(steps).map((frame) => ({
            ...frame,
            delay: frame.delay + 16,
          })),
        ];

    const timers = frames.map((frame) =>
      window.setTimeout(() => {
        setStatuses(frame.statuses);
      }, frame.delay),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [eventId, steps]);

  const visibleStatuses = context ? statuses : IDLE_PIPELINE_STATUS;

  return (
    <section
      className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3"
      aria-live="polite"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
            Processing pipeline
          </h2>
          <p className="mt-1 text-[11px] text-slate-500">
            Interaction → Event → Consent → Profile → Ad
          </p>
        </div>
        {context ? (
          <span className="rounded-full border border-violet-300/30 bg-violet-400/10 px-2 py-0.5 font-mono text-[10px] text-violet-100">
            {context.event.type}
          </span>
        ) : (
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-slate-500">
            Idle
          </span>
        )}
      </div>

      {context?.event.decision === "blocked" ? (
        <p className="mb-2 text-[11px] text-red-200/80">
          Consent blocked. Downstream stages skipped.
        </p>
      ) : null}

      {steps.length === 0 ? (
        <p className="text-[11px] text-slate-500">Waiting for interactions.</p>
      ) : (
        <ol className="flex flex-col gap-0 lg:flex-row lg:items-stretch">
          {steps.map((step, index) => {
            const status = visibleStatuses[step.stage];
            const previous = index > 0 ? visibleStatuses[steps[index - 1].stage] : "idle";
            const link = connectorStatus(previous, status);
            return (
              <li
                key={step.stage}
                className="flex min-w-0 flex-1 flex-col lg:flex-row lg:items-stretch"
              >
                {index > 0 ? <PipelineConnector status={link} /> : null}
                <div
                  className={`min-w-0 flex-1 rounded-xl border px-2.5 py-2 transition-colors duration-300 ${STAGE_STYLES[status]}`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                    {step.title}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em]">
                    {statusLabel(status, step.detail)}
                    {status === "blocked" ? " ✕" : ""}
                  </p>
                  <p className="mt-1 truncate text-[10px] leading-4 opacity-80">
                    {step.detail || "Waiting"}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function PipelineConnector({ status }: { status: PipelineStageStatus }) {
  return (
    <div
      className={`pipeline-connector ${
        status === "blocked"
          ? "pipeline-connector-blocked"
          : status === "skipped"
            ? "pipeline-connector-skipped"
            : status === "active" || status === "allowed"
              ? "pipeline-connector-live"
              : ""
      }`}
      aria-hidden
    >
      <span className="pipeline-flow-dot" />
    </div>
  );
}
