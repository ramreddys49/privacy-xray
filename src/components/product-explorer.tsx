"use client";

import { useState, type FormEvent } from "react";
import { CategoryCard } from "@/components/category-card";
import { SectionHint } from "@/components/section-hint";
import { PRODUCT_CATEGORIES } from "@/data/catalog";
import type { CategoryId, ProductCategory } from "@/types/privacy";

interface ProductExplorerProps {
  highlightedCategory?: CategoryId;
  onCategoryView: (category: ProductCategory) => void;
  onProductClick: (category: ProductCategory) => void;
  onSearch: (query: string) => void;
}

export function ProductExplorer({
  highlightedCategory,
  onCategoryView,
  onProductClick,
  onSearch,
}: ProductExplorerProps) {
  const [query, setQuery] = useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  }

  return (
    <section
      id="product-explorer"
      className="scroll-mt-28 px-5 pt-5 lg:px-6"
    >
      <div className="mb-4 max-w-2xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-200/70">
          Simulated consumer surface
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-50">
          Explore products
        </h2>
        <SectionHint>
          Simulated storefront only. Interactions stay in this page.
        </SectionHint>
        <p className="mt-1.5 text-sm leading-6 text-slate-400">
          Browse as a shopper. Each action is observed locally in the inspector.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-4">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <div className="flex max-w-xl overflow-hidden rounded-xl border border-white/10 bg-black/25 focus-within:border-cyan-300/30">
          <input
            id="product-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search devices, destinations, kits…"
            className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="border-l border-white/10 px-4 text-xs font-medium uppercase tracking-[0.12em] text-cyan-100/90 transition hover:bg-cyan-400/10"
          >
            Search
          </button>
        </div>
      </form>

      <div className="grid gap-3 sm:grid-cols-2">
        {PRODUCT_CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            highlighted={highlightedCategory === category.id}
            onView={onCategoryView}
            onExplore={onProductClick}
          />
        ))}
      </div>
    </section>
  );
}
