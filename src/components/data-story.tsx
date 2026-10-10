"use client";

import { useEffect, useState } from "react";
import { buildDataStory } from "@/lib/experience";
import { prefersReducedMotion } from "@/lib/pipeline";
import type { PipelineContext } from "@/types/privacy";

interface DataStoryProps {
  context: PipelineContext | null;
}

const TONE: Record<string, string> = {
  neutral: "border-white/10 bg-black/30 text-slate-200",
  allowed: "border-emerald-400/25 bg-emerald-400/8 text-emerald-100",
  blocked: "border-red-400/30 bg-red-400/10 text-red-100",
  skipped: "border-white/8 bg-white/[0.03] text-slate-400",
};

export function DataStory({ context }: DataStoryProps) {
  const steps = buildDataStory(context);
  const [visible, setVisible] = useState(steps.length);
  const eventId = context?.event.id;

  useEffect(() => {
    if (!eventId) return;
    const reduced = prefersReducedMotion();
    const timers = (reduced ? [steps.length]       : [1, 2, 3, 4, 5]).map((count, index) =>
        window.setTimeout(
          () => {
            setVisible(count);
          },
          reduced ? 0 : index * 140,
        ),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reveal uses a fixed 5-step sequence
  }, [eventId]);

  return (
    <section className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-3" aria-live="polite">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
        Latest privacy story
      </h2>
      <ol className="mt-3 flex flex-col gap-0 lg:flex-row lg:items-stretch lg:gap-1">
        {steps.map((step, index) => {
          const shown = index < visible;
          return (
            <li
              key={step.id}
              className={`flex min-w-0 flex-1 flex-col lg:items-stretch ${
                shown ? "story-step-enter" : "opacity-40"
              }`}
            >
              {index > 0 ? (
                <div
                  className="story-connector mx-auto h-3 w-px lg:mx-0 lg:h-auto lg:w-3 lg:self-center"
                  aria-hidden
                />
              ) : null}
              <div className={`rounded-lg border px-2.5 py-2 ${TONE[step.tone]}`}>
                <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                  {step.label}
                </p>
                <p className="mt-1 text-[11px] font-medium leading-4">{step.value}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
