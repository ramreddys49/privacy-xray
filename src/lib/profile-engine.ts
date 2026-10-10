import { PRODUCT_CATEGORIES } from "@/data/catalog";
import type {
  CategoryId,
  EventType,
  InterestProfile,
  PrivacyEvent,
} from "@/types/privacy";

const CATEGORY_IDS = new Set<CategoryId>(
  PRODUCT_CATEGORIES.map((category) => category.id),
);

const SCORE_WEIGHTS: Partial<Record<EventType, number>> = {
  category_view: 14,
  product_click: 22,
  search: 10,
};

export const EMPTY_PROFILE: InterestProfile = {
  technology: 0,
  travel: 0,
  fitness: 0,
  fashion: 0,
};

export function createEmptyProfile(): InterestProfile {
  return { ...EMPTY_PROFILE };
}

export function isCategoryId(value: string): value is CategoryId {
  return CATEGORY_IDS.has(value as CategoryId);
}

export function inferCategoryFromSearch(query: string): CategoryId | null {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  const match = PRODUCT_CATEGORIES.find(
    (category) =>
      normalized.includes(category.id) ||
      normalized.includes(category.title.toLowerCase()),
  );

  return match?.id ?? null;
}

export function profileIncrementForEvent(type: EventType): number {
  return SCORE_WEIGHTS[type] ?? 0;
}

export function profilesDiffer(
  left: InterestProfile,
  right: InterestProfile,
): boolean {
  return PRODUCT_CATEGORIES.some(
    (category) => left[category.id] !== right[category.id],
  );
}

export function applyEventToProfile(
  profile: InterestProfile,
  event: PrivacyEvent,
): InterestProfile {
  if (event.purpose !== "analytics" || event.decision !== "allowed") {
    return profile;
  }

  if (!isCategoryId(event.category)) {
    return profile;
  }

  const delta = SCORE_WEIGHTS[event.type] ?? 0;
  if (delta === 0) return profile;

  return {
    ...profile,
    [event.category]: profile[event.category] + delta,
  };
}

export function strongestInterest(profile: InterestProfile) {
  let top: { id: CategoryId; title: string; score: number } | null = null;

  for (const category of PRODUCT_CATEGORIES) {
    const score = profile[category.id];
    if (!top || score > top.score) {
      top = { id: category.id, title: category.title, score };
    }
  }

  return top;
}
