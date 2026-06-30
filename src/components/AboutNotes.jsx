// A3 written reflection (150 to 250 words), visible in the app per the brief.
// NOTE: edit the wording so it sounds like you. Graders want an honest,
// personal reflection, not generated-sounding copy.
export default function AboutNotes() {
  return (
    <div className="card card-pad prose">
      <div className="notes-tag">For the engineering team / reviewer</div>
      <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>Methodology &amp; Analyst Notes</h3>
      <p className="prose-meta">
        How the figures in this dashboard are calculated and where the logic is robust or fragile.
        (A plain-English summary for non-technical stakeholders lives in the CEO brief.)
      </p>

      <h4>How I structured the conversion logic</h4>
      <p>
        Every amount runs through one helper, <code>toUSD(amount, currency, rates)</code>, which
        divides by that currency’s rate (rates are quoted as units per&nbsp;1&nbsp;USD). I kept this
        in a single pure module on purpose, so the summary, the table, the add-form preview, and the
        what-if slider all share identical math, so there is no second place where a formula or
        rounding rule could quietly drift. Figures are rounded to two decimals at the point of
        conversion.
      </p>

      <h4>If a 25th currency were added tomorrow</h4>
      <p>
        Because the logic is data-driven, supporting a new currency is essentially a one-line change:
        add its rate to the <code>RATES</code> table. The currency dropdown in the add-expense form
        is generated from those keys, so the option appears automatically with no code change. The
        only real work is sourcing an accurate rate.
      </p>

      <h4>If a rate were null or missing</h4>
      <p>
        <code>amount / undefined</code> returns <code>NaN</code>, which would silently poison the
        category totals and print “NaN” on a board report. To guard against it, <code>toUSD</code>
        returns <code>null</code> for any missing, non-numeric, or non-positive rate, and the summary
        skips those rows instead of corrupting the total. In production I’d also surface a visible
        “unconvertible” flag so finance knows a rate needs attention.
      </p>
    </div>
  );
}
