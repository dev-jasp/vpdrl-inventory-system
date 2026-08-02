"use client";

import { useState } from "react";

/**
 * The headshot on the staff form: attach a file, or take the one already there
 * away.
 *
 * Not `components/inventory/PhotoField` with props bolted on. That field is a
 * square tile with a camera behind it, because an item photo is taken standing
 * in front of the shelf; the design gives staff a round, file-only tile, since
 * nobody photographs a colleague through the browser to fill in their record.
 * The two share only a hidden input and a `FileReader`.
 *
 * The photo travels with the form as a `data:` URL, which is how the design
 * carries it too — a plain form post with no upload endpoint behind it, and
 * the thing to revisit when there is somewhere to PUT a file.
 */
export function StaffPhotoField({ initial }: { initial?: string }) {
  const [photo, setPhoto] = useState(initial ?? "");
  const [error, setError] = useState<string | null>(null);

  function readFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Cleared so picking the same file twice still fires a change.
    event.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(String(reader.result));
      setError(null);
    };
    reader.onerror = () => setError("That file could not be read.");
    reader.readAsDataURL(file);
  }

  return (
    <div className="mb-5 flex items-start gap-4 border-b border-border-soft pb-5">
      <input type="hidden" name="photo" value={photo} />

      <div className="relative grid size-[76px] flex-none place-items-center overflow-hidden rounded-full border border-dashed border-border-strong bg-bg">
        {photo ? (
          // Not `next/image`: an attached headshot is a data URL with no
          // intrinsic size to optimise, and this is a fixed 76px preview.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt="Staff photo"
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <span className="px-1.5 text-center text-[10.5px] leading-tight font-semibold text-text-4">
            No photo
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] font-semibold">Staff photo</p>
        <p className="mt-[3px] max-w-[420px] text-[11.5px] font-normal text-text-3">
          Attach a headshot so the team can recognise who&rsquo;s on shift.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="flex h-[34px] cursor-pointer items-center rounded-[9px] border border-tint-blue bg-tint-blue px-3.5 text-[12.5px] font-semibold text-accent-fg">
            Attach photo
            <input
              type="file"
              accept="image/*"
              onChange={readFile}
              className="sr-only"
            />
          </label>
          {photo ? (
            <button
              type="button"
              onClick={() => setPhoto("")}
              className="flex h-[34px] items-center rounded-[9px] px-3 text-[12.5px] font-semibold text-[#dc2626] hover:bg-badge-red-bg"
            >
              Remove
            </button>
          ) : null}
        </div>

        {error ? (
          <p
            role="status"
            className="mt-2.5 text-[11.5px] font-medium text-[#dc2626]"
          >
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
