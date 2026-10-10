import type { AppViewMode } from "@/types/simulation";

interface ModeSwitchProps {
  mode: AppViewMode;
  onChange: (mode: AppViewMode) => void;
}

export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
    <div
      className="inline-flex rounded-full border border-white/10 bg-black/30 p-0.5"
      role="group"
      aria-label="Application view mode"
    >
      <button
        type="button"
        aria-pressed={mode === "user"}
        onClick={() => onChange("user")}
        className={`rounded-full px-3 py-1.5 text-[11px] font-medium tracking-wide transition ${
          mode === "user"
            ? "bg-cyan-400/20 text-cyan-50 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.25)]"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        User View
      </button>
      <button
        type="button"
        aria-pressed={mode === "engineer"}
        onClick={() => onChange("engineer")}
        className={`rounded-full px-3 py-1.5 text-[11px] font-medium tracking-wide transition ${
          mode === "engineer"
            ? "bg-violet-400/25 text-violet-50 shadow-[inset_0_0_0_1px_rgba(196,181,253,0.35)]"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        Privacy Engineer View
      </button>
    </div>
  );
}
