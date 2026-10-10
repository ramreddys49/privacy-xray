import { CategoryIcon } from "@/components/category-icons";
import type { ProductCategory } from "@/types/privacy";
import type { MouseEvent } from "react";

interface CategoryCardProps {
  category: ProductCategory;
  highlighted?: boolean;
  onView: (category: ProductCategory) => void;
  onExplore: (category: ProductCategory) => void;
}

export function CategoryCard({
  category,
  highlighted = false,
  onView,
  onExplore,
}: CategoryCardProps) {
  function handleExplore(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onExplore(category);
  }

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-white/[0.03] p-3 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-white/[0.045] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] ${
        highlighted
          ? "border-cyan-300/40 ring-1 ring-cyan-300/30"
          : "border-white/8"
      }`}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full opacity-30 blur-2xl transition group-hover:opacity-50"
        style={{ background: category.accent }}
        aria-hidden
      />
      <button
        type="button"
        onClick={() => onView(category)}
        className="absolute inset-0 z-0 rounded-2xl"
        aria-label={`View ${category.title} category`}
      />
      <div className="pointer-events-none relative z-10 flex h-full flex-col">
        <div
            className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/30"
          style={{ boxShadow: `inset 0 0 0 1px ${category.accent}22` }}
        >
          <CategoryIcon category={category.id} accent={category.accent} />
        </div>
        <h3 className="text-base font-medium text-slate-50">{category.title}</h3>
        <p className="mt-1 text-sm leading-5 text-slate-400">
          {category.description}
        </p>
        <button
          type="button"
          onClick={handleExplore}
          className="pointer-events-auto relative z-20 mt-3 inline-flex w-fit items-center gap-2 rounded-lg border border-cyan-200/15 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium tracking-wide text-cyan-100 transition hover:border-cyan-200/30 hover:bg-cyan-400/16"
        >
          Explore {category.title}
          <span aria-hidden>→</span>
        </button>
      </div>
    </article>
  );
}
