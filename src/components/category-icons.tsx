import type { CategoryId } from "@/types/privacy";

interface CategoryIconProps {
  category: CategoryId;
  accent: string;
}

export function CategoryIcon({ category, accent }: CategoryIconProps) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    className: "h-8 w-8",
    "aria-hidden": true,
  } as const;

  switch (category) {
    case "technology":
      return (
        <svg {...common}>
          <rect x="8" y="12" width="32" height="22" rx="3" stroke={accent} strokeWidth="1.6" />
          <path d="M18 38h12" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M16 18h8M16 24h16" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "travel":
      return (
        <svg {...common}>
          <path
            d="M8 32c6-10 10-16 16-16s10 6 16 16"
            stroke={accent}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="24" cy="18" r="4" stroke={accent} strokeWidth="1.6" />
          <path d="M24 22v14" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "fitness":
      return (
        <svg {...common}>
          <path
            d="M8 24h6l4-8 8 16 4-8h10"
            stroke={accent}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "fashion":
      return (
        <svg {...common}>
          <path
            d="M16 12h16l4 8-12 18L12 20l4-8z"
            stroke={accent}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M16 12c2 4 14 4 16 0" stroke={accent} strokeWidth="1.6" />
        </svg>
      );
  }
}
