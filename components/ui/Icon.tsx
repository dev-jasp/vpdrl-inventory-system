import { cx } from "@/utils/cx";

// The inner markup of a 24×24 stroked icon, one entry per glyph. The design
// paints icons as a CSS mask over a solid colour rather than as inline SVG, so
// one icon picks up whatever `color` its container sets.
//
// Entries are a verbatim port of the `glyphs` table in
// `design/LabTrack Dashboard.dc.html`, except for the ones listed in
// `HEROICONS`, which come from Heroicons outline (MIT, Tailwind Labs) instead.
// That divergence from the design is deliberate — see `docs/adr/0002-icons.md`.
const GLYPHS = {
  "layout-dashboard":
    '<path d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z"/>',
  package:
    '<path d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/>',
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
    '<path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"/>',
  truck:
    '<path d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>',
  report:
    '<path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>',
  settings:
    '<circle cx="12" cy="12" r="3.3"/><rect x="10.8" y="1.4" width="2.4" height="4.2" rx="1.1"/><rect x="10.8" y="18.4" width="2.4" height="4.2" rx="1.1" transform="rotate(180 12 12)"/><rect x="10.8" y="1.4" width="2.4" height="4.2" rx="1.1" transform="rotate(90 12 12)"/><rect x="10.8" y="1.4" width="2.4" height="4.2" rx="1.1" transform="rotate(-90 12 12)"/><rect x="10.8" y="1.4" width="2.4" height="4.2" rx="1.1" transform="rotate(45 12 12)"/><rect x="10.8" y="1.4" width="2.4" height="4.2" rx="1.1" transform="rotate(135 12 12)"/><rect x="10.8" y="1.4" width="2.4" height="4.2" rx="1.1" transform="rotate(-45 12 12)"/><rect x="10.8" y="1.4" width="2.4" height="4.2" rx="1.1" transform="rotate(-135 12 12)"/>',
  support:
    '<path d="M16.712 4.33a9.027 9.027 0 0 1 1.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 0 0-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 0 1 0 9.424m-4.138-5.976a3.736 3.736 0 0 0-.88-1.388 3.737 3.737 0 0 0-1.388-.88m2.268 2.268a3.765 3.765 0 0 1 0 2.528m-2.268-4.796a3.765 3.765 0 0 0-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 0 1-1.388.88m2.268-2.268 4.138 3.448m0 0a9.027 9.027 0 0 1-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0-3.448-4.138m3.448 4.138a9.014 9.014 0 0 1-9.424 0m5.976-4.138a3.765 3.765 0 0 1-2.528 0m0 0a3.736 3.736 0 0 1-1.388-.88 3.737 3.737 0 0 1-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 0 1-1.652-1.306 9.027 9.027 0 0 1-1.306-1.652m0 0 4.138-3.448M4.33 16.712a9.014 9.014 0 0 1 0-9.424m4.138 5.976a3.765 3.765 0 0 1 0-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 0 1 1.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 0 0-1.652 1.306A9.025 9.025 0 0 0 4.33 7.288"/>',
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
  bell: '<path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"/>',
  logout:
    '<path d="M9.2 4.6H6.6a1.8 1.8 0 0 0-1.8 1.8v11.2a1.8 1.8 0 0 0 1.8 1.8h2.6"/><path d="M13.6 8 17.6 12 13.6 16"/><line x1="17.3" y1="12" x2="9.4" y2="12"/>',
  users:
    '<path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>',
  ellipsis:
    '<path d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>',
  list: '<line x1="8.4" y1="6.5" x2="20" y2="6.5"/><line x1="8.4" y1="12" x2="20" y2="12"/><line x1="8.4" y1="17.5" x2="20" y2="17.5"/><circle cx="4.6" cy="6.5" r="1.1"/><circle cx="4.6" cy="12" r="1.1"/><circle cx="4.6" cy="17.5" r="1.1"/>',
  grid: '<rect x="3.6" y="3.6" width="7.4" height="7.4" rx="1.6"/><rect x="13" y="3.6" width="7.4" height="7.4" rx="1.6"/><rect x="3.6" y="13" width="7.4" height="7.4" rx="1.6"/><rect x="13" y="13" width="7.4" height="7.4" rx="1.6"/>',
} as const;

export type IconName = keyof typeof GLYPHS;

/**
 * Glyphs taken from Heroicons outline rather than from the design's set. They
 * are drawn for a 1.5 stroke and carry finer detail than the design's own
 * geometry — a rocket or a checklist at the design's 1.7 fills in at 17px — so
 * stroke weight is a property of the glyph, not of the icon set.
 *
 * A new icon belongs here, not in the design's set. See `docs/adr/0002-icons.md`.
 */
const HEROICONS = new Set<IconName>([
  "layout-dashboard",
  "package",
  "users",
  "clipboard",
  "truck",
  "report",
  "support",
  "bell",
  "ellipsis",
]);

// Encoding a glyph is pure and the table is fixed, so each one is built once
// rather than on every render of every icon.
const maskUrls = new Map<IconName, string>();

function maskUrl(name: IconName) {
  const cached = maskUrls.get(name);
  if (cached) return cached;
  const width = HEROICONS.has(name) ? "1.5" : "1.7";
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">` +
    GLYPHS[name] +
    "</svg>";
  const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  maskUrls.set(name, url);
  return url;
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
