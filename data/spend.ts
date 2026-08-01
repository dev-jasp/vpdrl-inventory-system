/**
 * Monthly spend against budget, ported from `spendData` in
 * `design/LabTrack Dashboard.dc.html`. Amounts are pesos.
 */
export type SpendMonth = {
  label: string;
  spend: number;
  budget: number;
};

export const SPEND: SpendMonth[] = [
  { label: "Jan", spend: 8600, budget: 10000 },
  { label: "Feb", spend: 9900, budget: 10300 },
  { label: "Mar", spend: 7800, budget: 10200 },
  { label: "Apr", spend: 11200, budget: 11800 },
  { label: "May", spend: 9400, budget: 10000 },
  { label: "Jun", spend: 10800, budget: 11700 },
  { label: "Jul", spend: 8400, budget: 8000 },
];

/** Top of the chart's y-axis, fixed by the design so bars stay comparable. */
export const SPEND_AXIS_MAX = 12000;
