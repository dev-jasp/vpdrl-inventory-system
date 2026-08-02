import { Icon } from "@/components/ui/Icon";
import type { FaqEntry } from "@/data/support";

/**
 * The FAQ accordion.
 *
 * Native `<details>` rather than React state, and `name` on all of them so the
 * browser enforces the accordion: opening one closes the rest. That is exactly
 * the design's behaviour — its `faqOpen` holds a single index, and clicking the
 * open question closes it — with no client component, no JavaScript, and the
 * disclosure semantics, keyboard handling and find-in-page expansion the
 * browser already ships.
 *
 * The first is open on arrival, as the design's `faqOpen: 0` has it.
 */
export function Faq({ entries }: { entries: FaqEntry[] }) {
  return (
    <div className="rounded-[14px] border border-border bg-surface px-[22px] py-2 shadow-[var(--shadow-1)]">
      <h2 className="sr-only">Frequently asked questions</h2>
      {entries.map((entry, index) => (
        <details
          key={entry.question}
          name="faq"
          open={index === 0}
          className="group border-b border-border-soft"
        >
          <summary className="flex cursor-pointer list-none items-center gap-3.5 py-4 [&::-webkit-details-marker]:hidden">
            <span className="flex-1 text-[13.5px] font-semibold">
              {entry.question}
            </span>
            {/* The design's chevron never turns; it does here, because a
                disclosure whose indicator is identical open and closed makes
                the reader find the answer to know the state. */}
            <Icon
              name="chevron"
              className="size-3.5 text-text-3 transition-transform group-open:rotate-180"
            />
          </summary>
          <p className="max-w-[640px] pb-[18px] text-[12.5px] leading-[1.6] font-normal text-text-2">
            {entry.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
