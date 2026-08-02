"use client";

import { useEffect, useRef } from "react";

import { cx } from "@/utils/cx";

/**
 * A modal dialog over whatever route is behind it.
 *
 * Built on the native `<dialog>` rather than a div with `position:fixed`: with
 * `showModal()` the browser handles the things a hand-rolled modal usually
 * gets wrong — the top layer, making the page behind inert, trapping focus,
 * restoring it on close, and Escape.
 */
export function Dialog({
  title,
  subtitle,
  onClose,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  /** Called for every dismissal: Escape, the ×, or a click on the backdrop. */
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="dialog-title"
      // Escape fires `cancel`; letting it through would close the element
      // without telling the route that opened it.
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      // A click landing on the dialog itself rather than its contents is a
      // click on the backdrop.
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={cx(
        "m-auto max-h-[86vh] w-[min(860px,calc(100vw-56px))] overflow-auto rounded-[18px] bg-surface text-text shadow-[var(--shadow-3)] backdrop:bg-[var(--scrim)] backdrop:backdrop-blur-[9px]",
        "animate-lt-pop backdrop:animate-lt-fade",
        className,
      )}
    >
      <div className="sticky top-0 z-2 flex items-start gap-4 border-b border-border-soft bg-surface px-[26px] pt-[22px] pb-[18px]">
        <div>
          <h2
            id="dialog-title"
            className="text-xl font-semibold tracking-[-0.025em]"
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-[10px] font-semibold tracking-[0.12em] text-text-4">
              {subtitle}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="ml-auto flex size-[34px] flex-none items-center justify-center rounded-[9px] border border-border-strong bg-surface text-base leading-none font-semibold text-text-2 hover:bg-muted"
        >
          ×
        </button>
      </div>

      {children}
    </dialog>
  );
}
