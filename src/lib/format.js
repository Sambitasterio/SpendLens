// format.js: shared display helpers so formatting stays consistent everywhere.

/** Format a number as USD, e.g. 1992.14 -> "$1,992.14". */
export function fmtUSD(n) {
  if (n == null || !Number.isFinite(n)) return 'n/a';
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Format an original amount + its currency, e.g. (8200,'INR') -> "8,200 INR". */
export function fmtOriginal(amount, currency) {
  const num = Number(amount).toLocaleString('en-US', { maximumFractionDigits: 2 });
  return `${num} ${currency}`;
}

/** Stable accent color per category for swatches / charts. */
export const CATEGORY_COLORS = {
  Travel: '#f97316',
  Software: '#3b82f6',
  Food: '#22c55e',
  Entertainment: '#a855f7',
};

export const colorFor = (category) => CATEGORY_COLORS[category] || '#9ca3af';
