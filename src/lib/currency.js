// currency.js — the single source of truth for all money math.
// Every view (summary, table, form, what-if slider) MUST use these helpers so
// figures stay consistent. Rounding policy: round each value to 2dp, then sum
// the rounded values (see PROJECT_SPEC §9). Applied via round2() in one place.

/** Round to 2 decimal places, guarding against float drift (e.g. 1.005). */
export function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Convert an amount in `currency` to USD using the rate table.
 * Rate = units of currency per 1 USD, so usd = amount / rate.
 * Returns `null` (never NaN) when the rate is missing/invalid or the amount is
 * not a finite number — callers skip/flag null rather than poisoning totals.
 */
export function toUSD(amount, currency, rates) {
  const rate = rates[currency];
  if (rate == null || !Number.isFinite(rate) || rate <= 0) return null;
  if (!Number.isFinite(amount)) return null;
  return round2(amount / rate);
}

/**
 * Build the ranked category summary + overall total.
 * Returns { categories: [{ category, count, total, largest, largestMerchant }], overall, skipped }
 * sorted by total USD descending. `skipped` holds rows that couldn't be converted.
 */
export function summarize(expenses, rates) {
  const byCat = {};
  const skipped = [];
  let overall = 0;

  for (const e of expenses) {
    const usd = toUSD(e.amount, e.currency, rates);
    if (usd == null) {
      skipped.push(e);
      continue;
    }
    overall = round2(overall + usd);

    const c = (byCat[e.category] ??= {
      category: e.category,
      count: 0,
      total: 0,
      largest: 0,
      largestMerchant: null,
    });
    c.count += 1;
    c.total = round2(c.total + usd);
    if (usd > c.largest) {
      c.largest = usd;
      c.largestMerchant = e.merchant;
    }
  }

  const categories = Object.values(byCat).sort((a, b) => b.total - a.total);
  return { categories, overall: round2(overall), skipped };
}

/**
 * Top N merchants by total USD spend. Groups by merchant name so a duplicate
 * merchant added via the form aggregates correctly.
 */
export function topMerchants(expenses, rates, n = 3) {
  const byMerchant = {};
  for (const e of expenses) {
    const usd = toUSD(e.amount, e.currency, rates);
    if (usd == null) continue;
    byMerchant[e.merchant] = round2((byMerchant[e.merchant] || 0) + usd);
  }
  return Object.entries(byMerchant)
    .map(([merchant, total]) => ({ merchant, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, n);
}

/** Attach a `usd` field to each expense (used by the table view). */
export function withUSD(expenses, rates) {
  return expenses.map((e) => ({ ...e, usd: toUSD(e.amount, e.currency, rates) }));
}
