# Spendlens · Multi-Currency Expense Dashboard

A small, hosted expense dashboard for Spendlens. It takes a set of expenses recorded in
different currencies, converts every one to USD against a fixed rate snapshot, and shows a clean
summary (category totals, overall spend, top merchants) plus a sortable, filterable transaction
table and an add-expense form. Everything runs in the browser, with no backend and no database.

**Live URL:** `<LIVE_URL>` &nbsp;·&nbsp; **Stack:** Vite + React (in-memory state)

---

## Run it locally

Requires Node 18+.

```bash
npm install
npm run dev
```

That's it. Open the URL Vite prints (default `http://localhost:5173`).

Other scripts:

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

---

## What's in here

```
.
├── index.html              # HTML entry; loads Inter font + the React app
├── package.json            # scripts + deps (react, vite)
├── vite.config.js          # Vite + React plugin config
├── README.md               # this file (engineer handoff)
├── docs/
│   ├── ceo-brief.md        # one-page plain-English brief for the CEO
│   └── edge-cases.md       # adversarial edge-case analysis
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # app shell + state (expenses, filter, what-if rate)
    ├── styles.css          # the whole design system (white + orange theme)
    ├── data/
    │   ├── rates.js        # RATES: fixed USD exchange-rate snapshot (source of truth)
    │   └── expenses.js     # EXPENSES: the 20 sample transactions
    ├── lib/
    │   ├── currency.js     # all money math: toUSD, summarize, topMerchants, round2
    │   └── format.js       # display helpers: fmtUSD, category colors
    └── components/
        ├── Sidebar.jsx          # left nav (Dashboard / Expenses / Add / About)
        ├── Topbar.jsx           # contextual page title bar
        ├── SummaryDashboard.jsx # KPI cards + ranked category table + top 3 merchants
        ├── ExpenseTable.jsx     # all transactions, sortable by date or USD
        ├── CategoryFilter.jsx   # toggle chips that filter the table
        ├── AddExpenseForm.jsx   # validated in-memory add-expense form
        ├── WhatIfSlider.jsx     # bonus: live EUR/USD rate adjuster
        └── AboutNotes.jsx       # A3 methodology reflection (engineer-facing)
```

### How the pieces fit

- **`data/`** is the single source of truth. Rates are quoted as *units of currency per 1 USD*.
- **`lib/currency.js`** is pure logic with no UI or data-source assumptions. `toUSD(amount, currency,
  rates)` is the one conversion path (`usd = amount / rate`), so every view shares identical math.
  `summarize()` produces the ranked category table + overall total; `topMerchants()` ranks by spend.
- **`App.jsx`** owns all state and passes data down. The expense list is in-memory; the add-form
  appends to it. The what-if slider overrides the EUR rate to produce `effectiveRates`, which feeds
  both the summary and the table so EUR figures recalculate live.

### Rounding policy

Each value is rounded to 2 decimals **at the point of conversion**, and totals are the sum of those
rounded values (see `round2` in `lib/currency.js`). This is applied in one place so the summary,
table, and slider never disagree.

---

## Assumptions the next developer should know

- **Static data by design.** The brief specifies no external API; `RATES` and `EXPENSES` are local
  modules and state is in-memory, so **added expenses reset on refresh**. This is intentional, not a
  bug.
- **API-ready architecture.** The data source is isolated to `src/data/*` and the single
  `addExpense` function in `App.jsx`, and `lib/currency.js` is source-agnostic. Moving to a real
  backend is a localized change: `addExpense` becomes async (`POST`, server-issued id), `EXPENSES`/
  `RATES` become `GET` calls with loading/error states, and the existing null-rate guard already
  covers a failed or stale rate fetch.
- **Rates are quoted per 1 USD** (e.g. `INR: 83.47` = 83.47 INR per USD). Convert by dividing.
- **Categories** come from the data; the add-form offers the existing set. New free-text categories
  aren't supported by the filter chips.
- **What-if scope:** the slider adjusts only the EUR rate (range 0.80 to 1.10), per the brief. The
  dataset has a single EUR expense, so the headline swing is small by design.

---

## Known limitations & what I'd do with another 4 hours

1. **No persistence.** Add `localStorage` (about 30 min) so added expenses survive a refresh; the
   in-memory model is a deliberate first step toward a real API.
2. **No edit/delete.** The table is add-only. I'd add row editing/removal and recompute totals.
3. **Long merchant names / very large amounts** can stretch the table on small screens; it scrolls
   horizontally but I'd add truncation + tooltips.
4. **What-if is EUR-only.** I'd generalise the adjuster to any currency with a dropdown.
5. **No automated tests in the repo.** The logic was validated against expected figures during
   development; I'd commit a small test file for `lib/currency.js` (conversions, null-rate guard,
   summary totals) so the math is protected against future edits.

---

## Notes for reviewers

- All figures are USD, rounded to 2 decimals. Base totals: Travel **$1,590.94**, Software
  **$204.49**, Food **$129.66**, Entertainment **$67.05**, overall **$1,992.14**.
- A plain-English summary for non-technical stakeholders is in [`docs/ceo-brief.md`](docs/ceo-brief.md).
- Adversarial failure-mode analysis is in [`docs/edge-cases.md`](docs/edge-cases.md).
