# Edge Cases & Failure Modes

Written in the spirit of "try to break your own dashboard." For each case: what could go wrong, how
the current code handles it (honestly, including where it does not), and what the correct behaviour
should be.

The two cases I find most interesting are #1 (rounding drift) and #2 (merchant grouping), because
they are quiet correctness traps rather than obvious input bugs. They are covered first.

---

## 1. Rounding drift: which total is the "right" total? (the subtle one)

**What could go wrong.** There are two defensible ways to total converted amounts: round every row to
2 decimals and then sum the rounded values, or sum the raw values and round once at the end. They
disagree by a cent or two. If different parts of the app pick different policies, the category totals,
the overall total, and the what-if delta stop reconciling, and a finance reviewer sees what looks like
a bug.

**How the code handles it now.** One policy is enforced in a single place: `round2()` in
`lib/currency.js`, applied at the point of conversion in `toUSD()`, and totals are the sum of those
rounded rows. Every view (summary, table, slider) imports the same functions, so they cannot drift
apart. The README states the chosen policy explicitly.

**Correct behaviour.** Pick one policy, centralise it, and document it. That is what is done. For a
true accounting product I would additionally store amounts in integer minor units (cents) to remove
binary floating point from the equation entirely.

## 2. Merchant grouping in "Top 3" (the second subtle one)

**What could go wrong.** "Top merchants" sums spend per merchant. The dataset happens to have 20
unique merchants, so it looks like a simple sort. But the moment someone adds a second "AWS" expense
via the form, the two must combine into one merchant row. A naive implementation would instead show
"AWS" twice and push a real third merchant off the list. A subtler trap: `"AWS"` vs `"aws "` (case or
trailing space) would be treated as two different merchants.

**How the code handles it now.** `topMerchants()` groups by exact merchant string before ranking, so
duplicates added through the form aggregate correctly. It does **not** normalise case or trim
whitespace, so `"AWS"` and `"aws"` would currently count as two merchants.

**Correct behaviour.** Group by a normalised key (trimmed, case-folded) or, better, by a stable
merchant id rather than display text. For now the form trims the merchant name on submit, which
removes the most likely cause (stray spaces).

---

## 3. Missing, null, or zero exchange rate

**What could go wrong.** If a currency has no rate, `amount / undefined` is `NaN`, which would spread
into category totals and the overall figure and print "NaN" on a board report.

**How the code handles it now.** `toUSD()` returns `null` for a missing, non-numeric, zero, or
negative rate. `summarize()` skips those rows and records them in a `skipped` list, so totals stay
clean and never become `NaN`. `fmtUSD()` renders a null value as `n/a`.

**Correct behaviour.** Mostly handled. The gap: the `skipped` count is tracked but not yet shown in
the UI, so an excluded row is silent. The correct behaviour is a visible "1 expense could not be
converted" flag so finance knows a rate needs attention. This is a known limitation.

## 4. Amount of zero or negative

**What could go wrong.** A zero or negative amount could enter the totals and quietly understate or
distort spend.

**How the code handles it now.** The add-form rejects an amount that is not a number or is less than
or equal to zero, with an inline error, so it never reaches the data. Note that `toUSD()` itself does
not block a negative amount; the guard currently lives at the form layer.

**Correct behaviour.** Block at entry (done). If refunds are a real use case, support them explicitly
as negative values with their own display treatment, rather than silently allowing them.

## 5. Add-form submitted with empty or partial fields

**What could go wrong.** A blank merchant, missing amount, or missing date could create a broken row.

**How the code handles it now.** Validation checks every field on submit; invalid fields get a red
border and a message, and nothing is added until all pass. Currency and category come from controlled
dropdowns, so they cannot be free-typed into an invalid state.

**Correct behaviour.** Handled as intended.

## 6. Non-numeric or formatted amount (for example "1,000" or "abc")

**What could go wrong.** Text or a thousands-separated string could become `NaN` and poison totals.

**How the code handles it now.** The amount field is a number input and is parsed with `Number()`;
anything that is not a clean number fails validation and is rejected.

**Correct behaviour.** Acceptable. A nicer version would strip thousands separators and accept
"1,000" rather than rejecting it, reducing user friction.

## 7. Special characters or very long merchant name

**What could go wrong.** A name like `<script>` could attempt script injection; a very long name
could break the table layout.

**How the code handles it now.** React escapes all rendered text by default, so injection is not
possible. A long name wraps within its table cell rather than overflowing the page.

**Correct behaviour.** Safe today. For polish I would truncate with an ellipsis and show the full name
on hover, so row heights stay even.

## 8. Very large amount causing display overflow

**What could go wrong.** A value like 1,000,000,000 could overflow a column or misalign the table.

**How the code handles it now.** `fmtUSD()` formats with locale grouping (commas) and the table is
wrapped in a horizontally scrollable container, so large numbers stay readable and the layout holds.

**Correct behaviour.** Adequate. For extreme values I would abbreviate (for example "$1.0B") with the
exact figure on hover.

## 9. Filtering to a category with no results

**What could go wrong.** A filter that matches nothing could render a blank, confusing table.

**How the code handles it now.** With the fixed dataset every category has rows, so this is not
reachable today. Defensively, the table already renders a centered "No expenses to show" empty state
when the row count is zero.

**Correct behaviour.** Handled defensively, which matters once categories can be added or removed.

## 10. Narrow mobile screen

**What could go wrong.** The grid layout and wide table could break or force horizontal page scroll.

**How the code handles it now.** Responsive breakpoints collapse the KPI grid from four columns to two
to one, move the sidebar to the top, and keep the table inside a horizontally scrollable container so
the page itself does not break.

**Correct behaviour.** Works. A future improvement is a stacked card layout for the table on the
smallest screens instead of horizontal scroll.

## 11. Future or invalid date in the add-form

**What could go wrong.** A user could record an expense dated in the future, skewing time-based views
later.

**How the code handles it now.** The date field is required and defaults to today, but no maximum is
enforced, so a future date is currently accepted.

**Correct behaviour.** Decide the policy explicitly. If future dates are invalid, cap the input at
today and validate on submit. This is a known gap.

---

## Summary

| # | Case | Status today |
|---|------|--------------|
| 1 | Rounding drift | Handled (single policy, documented) |
| 2 | Merchant grouping in top 3 | Handled for duplicates; case/whitespace not normalised |
| 3 | Missing or null rate | Handled in math; excluded count not yet shown in UI |
| 4 | Zero or negative amount | Blocked at form; not blocked in `toUSD` |
| 5 | Empty or partial form | Handled |
| 6 | Non-numeric amount | Rejected (could be friendlier) |
| 7 | Special chars / long name | Safe; could truncate for polish |
| 8 | Very large amount | Handled (grouping + scroll) |
| 9 | Empty filter result | Handled defensively |
| 10 | Narrow mobile screen | Handled (responsive + scroll) |
| 11 | Future date | Currently accepted; policy needed |
