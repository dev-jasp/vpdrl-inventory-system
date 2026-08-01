/**
 * Peso amounts, grouped the way the design writes them ("₱66,100"). The
 * locale is pinned rather than left to the runtime so the server and the
 * browser can't disagree and trip hydration.
 */
const groups = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

export function peso(amount: number) {
  return `₱${groups.format(amount)}`;
}

/** Short form for chart axes — "₱12k", "₱0". */
export function pesoShort(amount: number) {
  if (amount === 0) return "₱0";
  return `₱${groups.format(amount / 1000)}k`;
}
