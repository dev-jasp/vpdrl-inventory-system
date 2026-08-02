import { Card, CardTitle } from "@/components/ui/Card";
import { SPEND, SPEND_AXIS_MAX } from "@/data/spend";
import { peso, pesoShort } from "@/lib/shared/currency";

const AXIS_TICKS = [12000, 8000, 4000, 0];

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

/**
 * Monthly spend against budget.
 *
 * The design pops a styled card on bar hover; this uses the native `title` the
 * design also sets, which keeps the card a server component. The richer
 * tooltip is worth adding once more of the dashboard's charts need one.
 */
export function SpendVsBudget() {
  const totalSpend = sum(SPEND.map((month) => month.spend));
  const totalBudget = sum(SPEND.map((month) => month.budget));
  const height = (value: number) =>
    `${Math.round((value / SPEND_AXIS_MAX) * 100)}%`;

  return (
    <Card className="h-full pb-4">
      <CardTitle>Spend vs. Budget</CardTitle>

      <div className="mt-[26px] flex gap-[34px]">
        <div>
          <div className="text-xs font-semibold tracking-[0.12em] text-text-4">
            TOTAL SPEND
          </div>
          <div className="mt-[3px] font-mono text-[21px] font-extrabold">
            {peso(totalSpend)}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold tracking-[0.12em] text-text-4">
            TOTAL BUDGET
          </div>
          <div className="mt-[3px] font-mono text-[21px] font-extrabold text-text-3">
            {peso(totalBudget)}
          </div>
        </div>
      </div>

      <div className="mt-3.5 flex justify-end gap-[18px]">
        <span className="flex items-center gap-[7px] text-[11.5px] font-normal text-text-3">
          <span aria-hidden className="size-[9px] rounded-sm bg-[#3b82f6]" />
          Spend
        </span>
        <span className="flex items-center gap-[7px] text-[11.5px] font-normal text-text-3">
          <span aria-hidden className="size-[9px] rounded-sm bg-grid" />
          Budget
        </span>
      </div>

      <div className="flex-1" />

      <div className="relative pl-10">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 h-[132px] w-[34px]"
        >
          {AXIS_TICKS.map((tick, index) => (
            <div
              key={tick}
              className="absolute right-0 -translate-y-1/2 font-mono text-[11px] font-normal text-text-3"
              style={{ top: `${(index / (AXIS_TICKS.length - 1)) * 100}%` }}
            >
              {pesoShort(tick)}
            </div>
          ))}
        </div>

        <div className="relative h-[132px] border-b border-grid">
          {[0, 33.3, 66.6].map((top) => (
            <div
              key={top}
              aria-hidden
              className="absolute right-0 left-0 h-px bg-grid-soft"
              style={{ top: `${top}%` }}
            />
          ))}
          <ul className="absolute inset-0 flex items-end gap-2.5">
            {SPEND.map((month) => (
              <li
                key={month.label}
                title={`${month.label} · ${peso(month.spend)} of ${peso(month.budget)}`}
                className="flex h-full flex-1 items-end justify-center gap-1"
              >
                <span
                  className="w-3 rounded-t bg-[#3b82f6]"
                  style={{ height: height(month.spend) }}
                />
                <span
                  className="w-3 rounded-t bg-grid"
                  style={{ height: height(month.budget) }}
                />
              </li>
            ))}
          </ul>
        </div>

        <div aria-hidden className="mt-2 flex gap-2.5">
          {SPEND.map((month) => (
            <div
              key={month.label}
              className="flex-1 text-center text-[11px] font-normal text-text-3"
            >
              {month.label}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
