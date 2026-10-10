import type { AppViewMode } from "@/types/simulation";

interface InspectorModeHeaderProps {
  mode: AppViewMode;
}

export function InspectorModeHeader({ mode }: InspectorModeHeaderProps) {
  const engineer = mode === "engineer";

  return (
    <div>
      <p
        className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
          engineer ? "text-violet-200/80" : "text-cyan-200/70"
        }`}
      >
        {engineer ? "Engineer View" : "User View"}
      </p>
      <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-slate-50">
        {engineer ? "Technical inspection" : "Privacy impact"}
      </h2>
      <p className="mt-1.5 max-w-prose text-sm leading-6 text-slate-400">
        {engineer
          ? "What fired, what data was created, and what processing was allowed or blocked."
          : "What this site infers about you, and how your privacy choices change that."}
      </p>
    </div>
  );
}
