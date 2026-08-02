<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Typography

Readings set in the mono face, prose sets in the sans, and the switch happens at
a cell boundary — never inside a line. Put `font-mono` on the whole data cell
(unit word included), not on a `<span>` around a numeral.

**Weights run one step lighter than the design**, because Uncut Sans is a
denser face than the Manrope it was drawn in: the design's 500/600/700 are
`font-normal`/`font-medium`/`font-semibold` here, and headings are
`font-semibold`. Body text is 400. Only mono figures keep `font-extrabold`.
Size, tracking and colour follow the design exactly — weight is the only
property that diverges.

See `docs/adr/0001-typography.md` before changing a font, a weight, or where the
mono face lands.

# Icons

**New icons come from Heroicons outline**, not from the design's glyph table.
Add the key to `GLYPHS` in `components/ui/Icon.tsx` and to the `HEROICONS` set
beside it, which is what gives it Heroicons' 1.5 stroke instead of the design's
1.7. The nav, the notification bell and the row menu have already moved; the
design's own glyphs are still there for everything else.

Keys are semantic slots, not drawing names — `package` is a cube, `support` is a
rocket. Don't rename a key to match its artwork.

See `docs/adr/0002-icons.md` before adding a glyph or changing a stroke weight.
