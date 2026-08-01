/**
 * Reading a list's state off the URL.
 *
 * Both lists hand their raw `searchParams` straight in, so both want the same
 * two things from it: one value out of a param that may legally repeat, and a
 * value that has to be one of a known set or else the default.
 */
export type RawSearchParams = Record<string, string | string[] | undefined>;

/** `?zone=a&zone=b` is a legal URL; a filter has room for one answer. */
export function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/** Anything unrecognised falls back to the default rather than erroring. */
export function oneOf<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}
