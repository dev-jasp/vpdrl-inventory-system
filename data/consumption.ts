/**
 * Monthly units withdrawn by category, ported from `trend` in
 * `design/LabTrack Dashboard.dc.html`. Twelve months ending at `TODAY`'s
 * month, oldest first.
 */
export type ConsumptionSeries = {
  key: string;
  label: string;
  color: string;
  values: number[];
};

export const CONSUMPTION_MONTHS = [
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
];

/**
 * Legend order. The design draws them back to front — consumables first,
 * reagents last — so the busiest line sits on top.
 */
export const CONSUMPTION_SERIES: ConsumptionSeries[] = [
  {
    key: "reagents",
    label: "Reagents",
    color: "#3b82f6",
    values: [42, 44, 47, 49, 48, 52, 63, 70, 68, 72, 84, 83],
  },
  {
    key: "solvents",
    label: "Solvents",
    color: "#22c55e",
    values: [27, 28, 31, 34, 37, 35, 33, 32, 34, 40, 44, 43],
  },
  {
    key: "consumables",
    label: "Consumables",
    color: "#f59e0b",
    values: [60, 62, 64, 66, 70, 72, 74, 73, 72, 78, 88, 89],
  },
];

/** The month-range picker's options. */
export const CONSUMPTION_WINDOWS = [3, 6, 12] as const;
