import type { Category, StatusKind } from "@/types/item";
import type { IconName } from "@/components/ui/Icon";
import type { LotStatusKind } from "./lots";

/**
 * The design's colour and icon mapping for inventory. Presentational, but it
 * belongs with the domain rather than in one view: the dashboard cards, the
 * inventory list and the item detail all have to agree on what amber means.
 */
export const CATEGORY_COLORS: Record<Category, string> = {
  Reagent: "#3b82f6",
  Solvent: "#22c55e",
  Consumable: "#f59e0b",
  Equipment: "#8b5cf6",
  Standard: "#94a3b8",
};

export const CATEGORY_TINTS: Record<Category, string> = {
  Reagent: "rgba(59,130,246,.12)",
  Solvent: "rgba(34,197,94,.12)",
  Consumable: "rgba(245,158,11,.14)",
  Equipment: "rgba(139,92,246,.12)",
  Standard: "rgba(148,163,184,.16)",
};

export const CATEGORY_ICONS: Record<Category, IconName> = {
  Reagent: "flask",
  Solvent: "droplet",
  Consumable: "package",
  Equipment: "microscope",
  Standard: "badge",
};

/** Badge fill, text and border for a status pill. */
export const STATUS_BADGES: Record<
  StatusKind,
  { background: string; color: string; border: string }
> = {
  Available: {
    background: "var(--badge-green-bg)",
    color: "var(--badge-green-fg)",
    border: "var(--tint-green)",
  },
  "Low Stock": {
    background: "var(--badge-amber-bg)",
    color: "var(--badge-amber-fg)",
    border: "var(--tint-amber)",
  },
  "Out of Stock": {
    background: "var(--badge-red-bg)",
    color: "var(--badge-red-fg)",
    border: "var(--tint-red)",
  },
  "Expiring Soon": {
    background: "var(--badge-violet-bg)",
    color: "var(--badge-violet-fg)",
    border: "var(--tint-violet)",
  },
  "Cal. Due": {
    background: "var(--badge-violet-bg)",
    color: "var(--badge-violet-fg)",
    border: "var(--tint-violet)",
  },
  Expired: {
    background: "var(--badge-red-bg)",
    color: "var(--badge-red-fg)",
    border: "var(--tint-red)",
  },
  "Cal. Overdue": {
    background: "var(--badge-red-bg)",
    color: "var(--badge-red-fg)",
    border: "var(--tint-red)",
  },
};

/**
 * Badges for a single lot on the item detail's Lots table.
 *
 * The design writes these three as literal hex while using the badge tokens
 * everywhere else, which would strand them light-on-light in dark mode. The
 * fills and text it names are the exact values those tokens already hold, so
 * this reaches for the tokens and picks up the dark set for free; only the
 * borders differ, the design's being a shade stronger than the tints.
 */
export const LOT_BADGES: Record<
  LotStatusKind,
  { background: string; color: string; border: string }
> = {
  Good: {
    background: "var(--badge-green-bg)",
    color: "var(--badge-green-fg)",
    border: "var(--tint-green)",
  },
  Expiring: {
    background: "var(--badge-violet-bg)",
    color: "var(--badge-violet-fg)",
    border: "var(--tint-violet)",
  },
  Expired: {
    background: "var(--badge-red-bg)",
    color: "var(--badge-red-fg)",
    border: "var(--tint-red)",
  },
};

/** Solid colour for one block in the stock status tracker. */
export const STATUS_TRACK_COLORS: Record<StatusKind, string> = {
  Available: "#10b981",
  "Low Stock": "#f59e0b",
  "Out of Stock": "#ef4444",
  "Expiring Soon": "#8b5cf6",
  "Cal. Due": "#8b5cf6",
  Expired: "#dc2626",
  "Cal. Overdue": "#dc2626",
};
