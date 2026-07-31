/** Titles that sit in front of a name and should not become an initial. */
const HONORIFICS = new Set([
  "dr",
  "prof",
  "mr",
  "mrs",
  "ms",
  "mx",
  "engr",
  "atty",
  "fr",
  "rev",
]);

function isHonorific(word: string) {
  return HONORIFICS.has(word.replace(/\.$/, "").toLowerCase());
}

/**
 * Initials for an avatar. A leading honorific is dropped and the *last* word
 * is used rather than the second, so "Dr. Jane Davis" reads "JD" as the design
 * shows — titles and middle names both turn up in the staff list.
 */
export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  // A name that is nothing but a title still deserves an initial.
  const words =
    parts.length > 1 && isHonorific(parts[0]) ? parts.slice(1) : parts;
  if (words.length === 0) return "";
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (words[0][0] + last).toUpperCase();
}
