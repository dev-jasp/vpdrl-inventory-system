import {
  CONSUMPTION_MONTHS,
  CONSUMPTION_SERIES,
  type ConsumptionSeries,
} from "@/data/consumption";

/**
 * The chart's coordinate space, from the design. The SVG is stretched with
 * `preserveAspectRatio="none"`, so these are layout units rather than pixels
 * and every position derives from them — including the y-axis labels, which
 * sit outside the SVG and are placed as percentages of `height`.
 */
export const CHART = {
  width: 900,
  height: 210,
  top: 12,
  bottom: 170,
  /** Units withdrawn at the top gridline; the axis does not autoscale. */
  max: 100,
} as const;

/** Gridline values, top to bottom: 100, 75, 50, 25, 0. */
export const AXIS_TICKS = [100, 75, 50, 25, 0];

const round = (value: number) => Math.round(value * 10) / 10;

export function tickY(value: number) {
  return CHART.bottom - (value / CHART.max) * (CHART.bottom - CHART.top);
}

/** A gridline or point as a percentage down the chart box. */
export function percentDown(y: number) {
  return `${((y / CHART.height) * 100).toFixed(1)}%`;
}

export function pointsOf(values: number[]) {
  const last = values.length - 1;
  return values.map((value, index) => ({
    x: last === 0 ? 0 : (index * CHART.width) / last,
    y: tickY(Math.min(CHART.max, value)),
  }));
}

/** An SVG path through `values`; `close` drops it to the baseline for a fill. */
export function pathOf(values: number[], close = false) {
  const points = pointsOf(values);
  if (points.length === 0) return "";
  let d = `M ${round(points[0].x)} ${round(points[0].y)}`;
  for (const point of points.slice(1)) {
    d += ` L ${round(point.x)} ${round(point.y)}`;
  }
  if (close) {
    d += ` L ${round(points[points.length - 1].x)} ${CHART.bottom}`;
    d += ` L ${round(points[0].x)} ${CHART.bottom} Z`;
  }
  return d;
}

export type ConsumptionWindow = {
  months: string[];
  series: (ConsumptionSeries & { values: number[] })[];
  /** Every unit withdrawn across the window. */
  total: number;
  /** Change in the last month against the one before, as a percentage. */
  delta: number;
};

/** The last `months` of the trend, with its headline total and change. */
export function consumptionWindow(months: number): ConsumptionWindow {
  const take = <T>(values: T[]) => values.slice(values.length - months);
  const series = CONSUMPTION_SERIES.map((entry) => ({
    ...entry,
    values: take(entry.values),
  }));
  const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

  const total = sum(series.map((entry) => sum(entry.values)));
  const at = (index: number) =>
    sum(series.map((entry) => entry.values[index] ?? 0));
  const last = at(months - 1);
  const previous = at(months - 2);

  return {
    months: take(CONSUMPTION_MONTHS),
    series,
    total,
    delta: previous === 0 ? 0 : ((last - previous) / previous) * 100,
  };
}

/** "+3.4%" / "-1.2%", as the design formats it. */
export function formatDelta(delta: number) {
  return `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`;
}
