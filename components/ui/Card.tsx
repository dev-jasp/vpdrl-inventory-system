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
        "flex flex-col rounded-[14px] border border-border bg-surface px-[22px] py-5 shadow-[var(--shadow-1)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[15px] font-extrabold tracking-[-0.015em]">
      {children}
    </h2>
  );
}
