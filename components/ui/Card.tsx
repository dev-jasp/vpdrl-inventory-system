import { cx } from "@/utils/cx";

/** The dashboard's card chrome: surface, hairline border, soft lift. */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cx(
        "flex flex-col rounded-sm border border-border bg-surface px-[22px] py-5 shadow-[var(--shadow-1)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

/**
 * Headings sit at 600, not the design's 800. Uncut Sans is a denser grotesk
 * than the Manrope the design was drawn in, so it lays down more ink at the
 * same size and colour; 600 is what makes a heading read as emphasis rather
 * than as a blot. Size, tracking and colour are the design's, untouched.
 */
export function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold tracking-[-0.015em]">{children}</h2>
  );
}
