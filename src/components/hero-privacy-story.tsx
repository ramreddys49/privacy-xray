import { buildDataStory } from "@/lib/experience";
import type { PipelineContext } from "@/types/privacy";

const PREVIEW_STEPS = [
  "Technology Click",
  "Event Observed",
  "Analytics Allowed",
  "Technology Profile",
  "Technology Advertisement",
];

interface HeroPrivacyStoryProps {
  context: PipelineContext | null;
}

export function HeroPrivacyStory({ context }: HeroPrivacyStoryProps) {
  const live = Boolean(context && context.event.type !== "page_view");
  const liveSteps = live ? buildDataStory(context).map((step) => step.value) : PREVIEW_STEPS;

  return (
    <aside
      className="rounded-2xl border border-cyan-300/20 bg-black/35 px-4 py-4 shadow-[0_0_40px_rgba(56,214,255,0.08)]"
      aria-label={
        live
          ? "Latest privacy story from your interaction"
          : "Preview of how a click becomes an advertisement"
      }
      aria-live={live ? "polite" : undefined}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200/80">
        {live ? "Live from your last action" : "How profiling works"}
      </p>
      <ol className={`mt-3 space-y-0 ${live ? "hero-story-live" : "hero-story-preview"}`}>
        {liveSteps.map((step, index) => (
          <li key={`${step}-${index}`} className="hero-story-step flex gap-3">
            <div className="flex w-4 flex-col items-center" aria-hidden>
              <span className="hero-story-dot mt-1 h-2.5 w-2.5 rounded-full bg-white/20" />
              {index < liveSteps.length - 1 ? (
                <span className="story-rail my-1 w-px flex-1 bg-cyan-300/30" />
              ) : null}
            </div>
            <div className="pb-3">
              <p className="text-sm font-medium text-slate-100">{step}</p>
              {index < liveSteps.length - 1 ? (
                <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">↓</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
