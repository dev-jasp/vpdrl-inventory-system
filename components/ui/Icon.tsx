import { cx } from "@/utils/cx";

// Verbatim port of the `glyphs` table in `design/LabTrack Dashboard.dc.html`.
// Each entry is the inner markup of a 24×24 stroked icon; the design paints
// them as a CSS mask over a solid colour rather than as inline SVG, so one
// icon picks up whatever `color` its container sets.
const GLYPHS = {
  "layout-dashboard":
    '<rect x="3" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="4.8" rx="1.6"/><rect x="13.5" y="10.8" width="7.5" height="10.2" rx="1.6"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6"/>',
  package:
    '<rect x="3.5" y="6.5" width="17" height="14" rx="2"/><line x1="3.5" y1="11" x2="20.5" y2="11"/><line x1="12" y1="11" x2="12" y2="20.5"/>',
  flask:
    '<circle cx="12" cy="3.2" r="1.3"/><path d="M9.3 6.8 Q12 4 14.7 6.8"/><path d="M10.3 6.4 L10.3 10.2 L6.5 17.8 Q5.9 19.4 7.6 19.4 L16.4 19.4 Q18.1 19.4 17.5 17.8 L13.7 10.2 L13.7 6.4 Z"/><line x1="8.3" y1="15.2" x2="15.7" y2="15.2"/>',
  microscope:
    '<circle cx="12" cy="8.5" r="4.4"/><rect x="5.5" y="18.5" width="13" height="2.6" rx="1.3"/><line x1="12" y1="12.9" x2="12" y2="18.5"/>',
  hourglass:
    '<circle cx="12" cy="12" r="8.6"/><line x1="12" y1="7.2" x2="12" y2="12"/><line x1="12" y1="12" x2="15.6" y2="14.2"/>',
  calendar:
    '<rect x="3.6" y="5.2" width="16.8" height="15.2" rx="2.2"/><line x1="3.6" y1="9.8" x2="20.4" y2="9.8"/><line x1="8.4" y1="3.2" x2="8.4" y2="6.4"/><line x1="15.6" y1="3.2" x2="15.6" y2="6.4"/>',
  note: '<path d="M6 3.6h12v16.8l-3.4-2.6-2.6 2.6-2.6-2.6-3.4 2.6Z"/><line x1="8.6" y1="8.4" x2="15.4" y2="8.4"/><line x1="8.6" y1="12" x2="15.4" y2="12"/>',
  todo: '<rect x="3.6" y="4" width="16.8" height="16" rx="2.2"/><polyline points="7 12 9.4 14.4 14 9.4"/><line x1="7" y1="17.6" x2="17" y2="17.6"/>',
  clipboard:
    '<rect x="4.6" y="4.4" width="14.8" height="16.2" rx="2"/><line x1="8.2" y1="9.4" x2="15.8" y2="9.4"/><line x1="8.2" y1="12.9" x2="15.8" y2="12.9"/><line x1="8.2" y1="16.4" x2="13" y2="16.4"/>',
  truck:
    '<rect x="2.6" y="7" width="11.4" height="9.4" rx="1.6"/><rect x="14" y="10.4" width="6.6" height="6" rx="1.6"/><circle cx="7" cy="18.6" r="2"/><circle cx="17" cy="18.6" r="2"/>',
  report:
    '<rect x="4.8" y="13" width="3.6" height="7.4" rx="1.2"/><rect x="10.2" y="8.6" width="3.6" height="11.8" rx="1.2"/><rect x="15.6" y="4.6" width="3.6" height="15.8" rx="1.2"/>',
  settings:
    '<circle cx="12" cy="12" r="3.3"/><rect x="10.8" y="1.4" width="2.4" height="4.2" rx="1.1"/><rect x="10.8" y="18.4" width="2.4" height="4.2" rx="1.1" transform="rotate(180 12 12)"/><rect x="10.8" y="1.4" width="2.4" height="4.2" rx="1.1" transform="rotate(90 12 12)"/><rect x="10.8" y="1.4" width="2.4" height="4.2" rx="1.1" transform="rotate(-90 12 12)"/><rect x="10.8" y="1.4" width="2.4" height="4.2" rx="1.1" transform="rotate(45 12 12)"/><rect x="10.8" y="1.4" width="2.4" height="4.2" rx="1.1" transform="rotate(135 12 12)"/><rect x="10.8" y="1.4" width="2.4" height="4.2" rx="1.1" transform="rotate(-45 12 12)"/><rect x="10.8" y="1.4" width="2.4" height="4.2" rx="1.1" transform="rotate(-135 12 12)"/>',
  support: '<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="3.4"/>',
  panel:
    '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><line x1="9.6" y1="4.5" x2="9.6" y2="19.5"/>',
  chevron: '<polyline points="6 9 12 15 18 9"/>',
  sun: '<circle cx="12" cy="12" r="4"/><line x1="12" y1="2.4" x2="12" y2="4.6"/><line x1="12" y1="19.4" x2="12" y2="21.6"/><line x1="2.4" y1="12" x2="4.6" y2="12"/><line x1="19.4" y1="12" x2="21.6" y2="12"/><line x1="5.2" y1="5.2" x2="6.8" y2="6.8"/><line x1="17.2" y1="17.2" x2="18.8" y2="18.8"/><line x1="18.8" y1="5.2" x2="17.2" y2="6.8"/><line x1="6.8" y1="17.2" x2="5.2" y2="18.8"/>',
  moon: '<path d="M20 14.4A8.4 8.4 0 0 1 9.6 4 8.6 8.6 0 1 0 20 14.4Z"/>',
  check: '<polyline points="5 12.5 9.5 17 19 7"/>',
  droplet:
    '<path d="M12 3.4 C12 3.4 5.8 11.4 5.8 15.9 A6.2 6.2 0 0 0 18.2 15.9 C18.2 11.4 12 3.4 12 3.4 Z"/>',
  badge:
    '<circle cx="12" cy="9.6" r="5.4"/><path d="M8.5 14 L6.8 20.6 L12 17.6 L17.2 20.6 L15.5 14"/>',
  account:
    '<circle cx="12" cy="8.6" r="3.4"/><path d="M5.6 19.6c0-3.6 2.9-5.8 6.4-5.8s6.4 2.2 6.4 5.8"/>',
  billing:
    '<rect x="3" y="5.5" width="18" height="13" rx="2.2"/><line x1="3" y1="9.6" x2="21" y2="9.6"/>',
  bell: '<path d="M6 10.4a6 6 0 0 1 12 0c0 4 1.4 5.6 1.4 5.6H4.6S6 14.4 6 10.4Z"/><path d="M10.1 18.4a1.9 1.9 0 0 0 3.8 0"/>',
  logout:
    '<path d="M9.2 4.6H6.6a1.8 1.8 0 0 0-1.8 1.8v11.2a1.8 1.8 0 0 0 1.8 1.8h2.6"/><path d="M13.6 8 17.6 12 13.6 16"/><line x1="17.3" y1="12" x2="9.4" y2="12"/>',
  users:
    '<circle cx="9.4" cy="8.2" r="3.4"/><rect x="3.4" y="14" width="12" height="6.2" rx="3.1"/><circle cx="17.6" cy="9.4" r="2.2"/>',
  list: '<line x1="8.4" y1="6.5" x2="20" y2="6.5"/><line x1="8.4" y1="12" x2="20" y2="12"/><line x1="8.4" y1="17.5" x2="20" y2="17.5"/><circle cx="4.6" cy="6.5" r="1.1"/><circle cx="4.6" cy="12" r="1.1"/><circle cx="4.6" cy="17.5" r="1.1"/>',
  grid: '<rect x="3.6" y="3.6" width="7.4" height="7.4" rx="1.6"/><rect x="13" y="3.6" width="7.4" height="7.4" rx="1.6"/><rect x="3.6" y="13" width="7.4" height="7.4" rx="1.6"/><rect x="13" y="13" width="7.4" height="7.4" rx="1.6"/>',
} as const;

export type IconName = keyof typeof GLYPHS;

function maskUrl(name: IconName) {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
    GLYPHS[name] +
    "</svg>";
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * A glyph from the design's icon set, tinted with the current text colour.
 * Size it with `className` (`size-[17px]`); it is purely decorative, so give
 * the interactive element that wraps it an accessible name.
 */
export function Icon({
  name,
  className,
  style,
}: {
  name: IconName;
  className?: string;
  style?: React.CSSProperties;
}) {
  const url = maskUrl(name);
  return (
    <span
      aria-hidden
      className={cx("inline-block flex-none bg-current", className)}
      style={{
        maskImage: url,
        maskSize: "contain",
        maskPosition: "center",
        maskRepeat: "no-repeat",
        WebkitMaskImage: url,
        WebkitMaskSize: "contain",
        WebkitMaskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        ...style,
      }}
    />
  );
}
