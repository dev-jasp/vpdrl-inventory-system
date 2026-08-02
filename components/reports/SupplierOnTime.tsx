import { Card, CardTitle } from "@/components/ui/Card";
import { onTimeBand, type SupplierRow } from "@/lib/suppliers/performance";

/**
 * On-time delivery by supplier, weakest first.
 *
 * Horizontal bars because the labels are supplier names — set them under
 * vertical columns and they collide or rotate. One series, so no legend: the
 * title names the measure.
 *
 * The bar is a single hue; the percentage beside it takes the band's colour,
 * exactly as the supplier table draws it, and the band is written out in words
 * next to it. That is the same reasoning `lib/suppliers/performance.ts` gives
 * for naming the band as well as colouring it — three shades of "fine" is a
 * distinction that disappears for anyone who cannot separate green from amber.
 *
 * The bars start at 0%, not at the lowest value on show. A truncated axis on a
 * percentage turns 91 against 97 into a landslide.
 */
export function SupplierOnTime({ suppliers }: { suppliers: SupplierRow[] }) {
  return (
    <Card className="h-full">
      <CardTitle>On-time delivery</CardTitle>
      <p className="mt-1 text-[11.5px] font-normal text-text-3">
        Suppliers the catalogue depends on, weakest first
      </p>

      {suppliers.length === 0 ? (
        <p className="mt-6 text-[13px] font-normal text-text-3">
          No supplier has anything in the catalogue yet.
        </p>
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {suppliers.map((supplier) => {
            const band = onTimeBand(supplier.onTime);
            return (
              <li key={supplier.name} className="flex items-center gap-3">
                <span className="w-[124px] shrink-0 truncate text-[12.5px] font-medium">
                  {supplier.name}
                </span>
                <span
                  aria-hidden
                  className="h-[9px] flex-1 overflow-hidden rounded-full bg-muted"
                >
                  <span
                    className="block h-full rounded-full bg-[#3b82f6]"
                    style={{ width: `${supplier.onTime}%` }}
                  />
                </span>
                <span
                  className="w-[42px] shrink-0 text-right font-mono text-[12.5px] font-semibold"
                  style={{ color: band.color }}
                >
                  {supplier.onTime}%
                </span>
                <span className="w-[62px] shrink-0 text-[11px] font-normal text-text-3">
                  {band.kind}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
