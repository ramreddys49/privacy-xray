import { ModeSwitch } from "@/components/mode-switch";
import type { AppViewMode } from "@/types/simulation";

interface AppHeaderProps {
  mode: AppViewMode;
  onModeChange: (mode: AppViewMode) => void;
}

export function AppHeader({ mode, onModeChange }: AppHeaderProps) {
  return (
    <header className="z-30 flex flex-col gap-4 border-b border-white/8 bg-[#05070d]/92 px-5 py-4 backdrop-blur-md lg:sticky lg:top-0 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-400/8 shadow-[0_0_24px_rgba(56,214,255,0.18)]"
          aria-hidden
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <circle cx="12" cy="12" r="8.25" stroke="#7ee7ff" strokeWidth="1.4" />
            <path d="M4 12h16M12 4c2.6 3.2 2.6 12.8 0 16M12 4c-2.6 3.2-2.6 12.8 0 16" stroke="#7ee7ff" strokeWidth="1.2" />
          </svg>
        </div>
        <div>
          <h1 className="text-[1.15rem] font-semibold tracking-tight text-slate-50">
            Privacy X-Ray
          </h1>
          <p className="mt-0.5 text-sm text-slate-400">
            See the invisible. Control your data.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:items-end">
        <ModeSwitch mode={mode} onChange={onModeChange} />
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-cyan-300/20 bg-cyan-400/8 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-cyan-100/90">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300" />
          </span>
          Live privacy simulation
        </div>
      </div>
    </header>
  );
}
