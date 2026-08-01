import Image from "next/image";

import { Icon } from "@/components/ui/Icon";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_TINTS,
} from "@/lib/inventory/palette";
import { photoUrl } from "@/lib/inventory/photos";
import type { Category } from "@/types/item";
import { cx } from "@/utils/cx";

/**
 * The category-tinted tile an item is shown as, wherever it is listed. Items
 * with no photo fall back to their category glyph, which is what the design
 * draws for everything until a photo is attached.
 *
 * Decorative by design: every place this appears, the item's name is already
 * rendered beside it, so labelling the image would only make a screen reader
 * say the name twice.
 *
 * `size` is the tile's edge in px — 40 in the inventory row, 38 in Alerts, 32
 * in Upcoming Calibrations. The glyph is sized from it at the design's ratio.
 */
export function ItemPhoto({
  category,
  photo,
  size,
  className,
}: {
  category: Category;
  photo?: string;
  size: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cx(
        "relative grid flex-none place-items-center overflow-hidden",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: CATEGORY_TINTS[category],
      }}
    >
      {photo ? (
        <Image
          src={photoUrl(photo)}
          alt=""
          fill
          // A tile this small never needs the full-resolution asset.
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        <Icon
          name={CATEGORY_ICONS[category]}
          className="opacity-55"
          style={{
            width: Math.round(size * 0.475),
            height: Math.round(size * 0.475),
            color: CATEGORY_COLORS[category],
          }}
        />
      )}
    </span>
  );
}
