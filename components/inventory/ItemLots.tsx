import { CardTitle } from "@/components/ui/Card";
import { lotStatus, type Lot } from "@/lib/inventory/lots";
import { LOT_BADGES } from "@/lib/inventory/palette";
import { cx } from "@/utils/cx";

const HEAD =
  "px-3.5 py-[9px] text-[10px] font-semibold tracking-[0.1em] text-text-4";

/**
 * The deliveries making up an item's stock, oldest date first — FEFO, so the
 * lot at the top is the one to open next and is marked as such.
 *
 * Its own card rather than a `Card`, because the table runs edge to edge.
 */
export function ItemLots({ lots, unit }: { lots: Lot[]; unit: string }) {
  return (
    <section className="overflow-hidden rounded-[14px] border border-border bg-surface shadow-[var(--shadow-1)]">
      <div className="px-[22px] pt-5 pb-3.5">
        <CardTitle>Lots</CardTitle>
        <p className="mt-[3px] text-[12px] font-normal text-text-3">
          {lots.length === 1
            ? "1 lot on record"
            : `${lots.length} lots on record · FEFO order`}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] table-fixed border-collapse text-left">
          <colgroup>
            <col style={{ width: 64 }} />
            <col />
            <col style={{ width: 92 }} />
            <col style={{ width: 118 }} />
            <col style={{ width: 118 }} />
            <col style={{ width: 104 }} />
          </colgroup>
          <thead>
            <tr className="border-y border-border-soft bg-surface-2">
              <th scope="col" className={HEAD}>
                <span className="sr-only">Pick order</span>
              </th>
              <th scope="col" className={HEAD}>
                LOT
              </th>
              <th scope="col" className={HEAD}>
                QTY
              </th>
              <th scope="col" className={HEAD}>
                EXPIRY
              </th>
              <th scope="col" className={HEAD}>
                RECEIVED
              </th>
              <th scope="col" className={HEAD}>
                STATUS
              </th>
            </tr>
          </thead>
          <tbody>
            {lots.map((lot, index) => {
              const status = lotStatus(lot);
              const badge = LOT_BADGES[status];
              const next = index === 0;

              return (
                <tr
                  key={lot.lot}
                  className={cx(
                    "border-b border-border-soft",
                    next && "bg-tint-blue",
                  )}
                >
                  <td className="px-3.5 py-[11px] text-[9.5px] font-semibold tracking-[0.08em] text-accent-fg">
                    {next ? "NEXT" : ""}
                  </td>
                  <td className="px-3.5 py-[11px] font-mono text-[12.5px] font-semibold whitespace-nowrap">
                    {lot.lot}
                  </td>
                  <td className="px-3.5 py-[11px] font-mono text-[12.5px] font-medium whitespace-nowrap">
                    {lot.quantity} {unit}
                  </td>
                  <td className="px-3.5 py-[11px]">
                    <div className="font-mono text-[12.5px] font-medium whitespace-nowrap">
                      {lot.expiry}
                    </div>
                    {/* A phrase, not a reading — so it stays in the sans. */}
                    <div className="mt-px text-[11px] font-normal text-text-3">
                      {lot.days < 0
                        ? `${Math.abs(lot.days)} d ago`
                        : `in ${lot.days} d`}
                    </div>
                  </td>
                  <td className="px-3.5 py-[11px] font-mono text-[12.5px] font-normal whitespace-nowrap text-text-2">
                    {lot.received}
                  </td>
                  <td className="px-3.5 py-[11px]">
                    <span
                      className="inline-flex rounded-full border px-2 py-[3px] text-[10.5px] font-semibold whitespace-nowrap"
                      style={{
                        background: badge.background,
                        color: badge.color,
                        borderColor: badge.border,
                      }}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
