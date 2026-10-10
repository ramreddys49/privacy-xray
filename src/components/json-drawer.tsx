"use client";

import { useState } from "react";

interface JsonDrawerProps {
  label: string;
  value: unknown;
}

export function JsonDrawer({ label, value }: JsonDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <details
      className="mt-2 rounded-lg border border-white/8 bg-black/20 px-2.5 py-2"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary
        aria-expanded={open}
        className="cursor-pointer text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
      >
        {label}
      </summary>
      <pre className="mt-2 max-h-56 max-w-full overflow-auto break-all font-mono text-[10px] leading-4 text-slate-400">
        {JSON.stringify(value, null, 2)}
      </pre>
    </details>
  );
}
