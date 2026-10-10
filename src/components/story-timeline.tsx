import { buildStoryTimeline } from "@/lib/experience";
import type { PipelineContext, PrivacyEvent } from "@/types/privacy";

interface StoryTimelineProps {
  events: PrivacyEvent[];
  context: PipelineContext | null;
}

export function StoryTimeline({ events, context }: StoryTimelineProps) {
  const steps = buildStoryTimeline(events, context);

  return (
    <section id="live-event-stream" className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-3">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
        Why am I seeing this?
      </h2>
      {steps.length === 0 ? (
        <p className="mt-2 text-[11px] leading-5 text-slate-500">
          Interact with the demo.
        </p>
      ) : (
        <ol className="mt-2 space-y-1.5">
          {steps.map((step) => (
            <li
              key={step.id}
              className="flex items-baseline gap-3 rounded-lg bg-black/20 px-2.5 py-1.5"
            >
              <time className="w-10 shrink-0 font-mono text-[10px] text-slate-500">
                {step.time}
              </time>
              <span className="text-xs text-slate-200">{step.text}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
