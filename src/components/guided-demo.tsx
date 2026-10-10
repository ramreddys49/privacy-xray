import { GUIDED_STEPS } from "@/data/guided-demo";

interface GuidedDemoProps {
  active: boolean;
  stepIndex: number;
  completed: boolean;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onRestart: () => void;
}

export function GuidedDemo({
  active,
  stepIndex,
  completed,
  onNext,
  onBack,
  onSkip,
  onRestart,
}: GuidedDemoProps) {
  if (!active && !completed) return null;

  const step = GUIDED_STEPS[stepIndex];
  const stepNumber = stepIndex + 1;

  return (
    <section
      className="mx-auto w-full max-w-[1440px] px-5 pb-4 sm:px-8"
      aria-label="Guided demo"
    >
      <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/[0.05] px-4 py-3 sm:px-5">
        {completed || !step ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-300">
              Guided demo complete. The lab stays fully usable.
            </p>
            <button
              type="button"
              onClick={onRestart}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              Restart Guided Demo
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-cyan-200/70">
                  Guided demo · Step {stepNumber} of {GUIDED_STEPS.length}
                </p>
                <h2 className="mt-1 text-sm font-semibold text-slate-50">
                  {step.title}
                </h2>
                <p className="mt-1 text-xs text-slate-400">{step.action}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {step.explanation}
                </p>
              </div>
              <button
                type="button"
                onClick={onSkip}
                className="shrink-0 text-[11px] uppercase tracking-[0.12em] text-slate-500 hover:text-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                Skip
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onBack}
                disabled={stepIndex === 0}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-300 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                Back
              </button>
              <button
                type="button"
                onClick={onNext}
                className="rounded-lg border border-cyan-300/25 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-cyan-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                {stepIndex === GUIDED_STEPS.length - 1 ? "Finish" : "Next"}
              </button>
              <button
                type="button"
                onClick={onRestart}
                className="rounded-lg px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500 hover:text-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                Restart Guided Demo
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
