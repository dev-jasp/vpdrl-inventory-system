import { hash } from "@/lib/shared/hash";
import { initials } from "@/lib/shared/names";
import { cx } from "@/utils/cx";

/** The design's `avatarTints` — background paired with the initials colour. */
const TINTS = [
  ["var(--av-1)", "var(--accent-fg)"],
  ["var(--av-2)", "#34d399"],
  ["var(--av-3)", "#fbbf24"],
  ["var(--av-4)", "#a78bfa"],
  ["var(--av-5)", "#f87171"],
  ["var(--av-6)", "#34d399"],
] as const;

/**
 * A person's initials in a tinted circle, with their photo over the top when
 * there is one. The tint is derived from `id`, so it stays put as lists are
 * filtered and re-sorted.
 */
export function Avatar({
  id,
  name,
  photo,
  className,
}: {
  id: string;
  name: string;
  photo?: string;
  className?: string;
}) {
  const [background, color] = TINTS[hash(id) % TINTS.length];
  return (
    <span
      className={cx(
        "relative grid size-[34px] flex-none place-items-center overflow-hidden rounded-full text-[11.5px] font-extrabold",
        className,
      )}
      style={{ background, color }}
    >
      {initials(name)}
      {photo ? (
        <span
          role="img"
          aria-label={name}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${photo})` }}
        />
      ) : null}
    </span>
  );
}
