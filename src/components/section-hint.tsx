interface SectionHintProps {
  children: string;
}

export function SectionHint({ children }: SectionHintProps) {
  return <p className="mt-1 text-[11px] leading-5 text-slate-500">{children}</p>;
}
