import { Card, CardTitle } from "@/components/ui/Card";
import { STOCK_BANDS, stockPosition } from "@/lib/inventory/stock";
import type { Item } from "@/types/item";

/** On hand against the reorder point, on the design's three-band bar. */
export function StockPosition({ item }: { item: Item }) {
  const { scale, markerPercent } = stockPosition(item);
  const marker = `${markerPercent}%`;

  return (
    <Card>
      <CardTitle>Stock position</CardTitle>

      <div className="mt-3 flex items-baseline gap-3">
        <span className="text-[40px] leading-none font-extrabold tracking-[-0.04em]">
          {item.quantity}
        </span>
        <span className="text-[13px] font-semibold text-text-3">
          {item.unit} on hand · reorder at {item.min} {item.unit}
        </span>
      </div>

      <div className="relative mt-[22px]">
        <div aria-hidden className="flex h-2 gap-0.5">
          {STOCK_BANDS.map((band) => (
            <div
              key={band.label}
              className="rounded-full"
              style={{ width: `${band.width}%`, background: band.color }}
            />
          ))}
        </div>
        <div
          aria-hidden
          className="absolute -top-1.5 h-5 w-0.5 rounded-sm bg-text"
          style={{ left: marker }}
        />
        <div
          aria-hidden
          className="absolute top-4 -translate-x-1/2 text-[11px] font-semibold whitespace-nowrap text-text"
          style={{ left: marker }}
        >
          {item.quantity} {item.unit}
        </div>
      </div>

      {/* The bar is drawn, so the same reading is spelled out for a reader. */}
      <p className="sr-only">
        {item.quantity} {item.unit} on hand, on a scale to {scale} {item.unit},
        with a reorder point of {item.min} {item.unit}.
      </p>

      <div
        aria-hidden
        className="mt-9 flex justify-between text-[11px] font-medium text-text-3"
      >
        <span>0</span>
        <span>
          Reorder point · {item.min} {item.unit}
        </span>
        <span>
          {scale} {item.unit}
        </span>
      </div>

      <div className="mt-3 flex gap-4 border-t border-border-soft pt-3">
        {STOCK_BANDS.map((band) => (
          <div
            key={band.label}
            className="flex items-center gap-[7px] text-[11.5px] font-medium text-text-3"
          >
            <span
              aria-hidden
              className="size-[9px] rounded-sm"
              style={{ background: band.color }}
            />
            {band.label}
          </div>
        ))}
      </div>
    </Card>
  );
}
