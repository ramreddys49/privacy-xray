import { HeroPrivacyStory } from "@/components/hero-privacy-story";
import type { PipelineContext } from "@/types/privacy";
import type { AppViewMode } from "@/types/simulation";

interface HeroIntroProps {
  mode: AppViewMode;
  onExploreUser: () => void;
  onExploreEngineer: () => void;
  onPlayDemo: () => void;
  onStopDemo: () => void;
  demoPlaying: boolean;
  pipelineContext: PipelineContext | null;
}

export function HeroIntro({
  mode,
  onExploreUser,
  onExploreEngineer,
  onPlayDemo,
  onStopDemo,
  demoPlaying,
  pipelineContext,
}: HeroIntroProps) {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 py-5 sm:px-8 lg:py-6">
      <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-200/70">
            Interactive privacy engineering lab
          </p>
          <h2 className="mt-2 max-w-3xl text-[1.85rem] font-semibold tracking-tight text-slate-50 sm:text-3xl">
            See the invisible.
            <span className="block text-slate-300">Control your data.</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            A click becomes an event. Consent decides whether it is processed.
            Processing becomes a profile — and the profile selects an ad.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {demoPlaying ? (
              <button
                type="button"
                onClick={onStopDemo}
                className="rounded-xl border border-amber-300/30 bg-amber-400/10 px-4 py-2.5 text-sm font-medium text-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                Stop demo
              </button>
            ) : (
              <button
                type="button"
                onClick={onPlayDemo}
                className="rounded-xl border border-cyan-300/40 bg-cyan-400/20 px-4 py-2.5 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-400/28 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                Play Demo
              </button>
            )}
            <button
              type="button"
              aria-pressed={mode === "user"}
              onClick={onExploreUser}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 ${
                mode === "user"
                  ? "border-white/20 bg-white/[0.08] text-slate-50"
                  : "border-white/10 bg-white/[0.04] text-slate-100 hover:border-white/20"
              }`}
            >
              Explore as User
            </button>
            <button
              type="button"
              aria-pressed={mode === "engineer"}
              onClick={onExploreEngineer}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 ${
                mode === "engineer"
                  ? "border-violet-300/40 bg-violet-400/20 text-violet-50"
                  : "border-white/10 bg-white/[0.04] text-slate-100 hover:border-white/20"
              }`}
            >
              Explore as Privacy Engineer
            </button>
          </div>
        </div>
        <HeroPrivacyStory context={pipelineContext} />
      </div>
    </section>
  );
}
