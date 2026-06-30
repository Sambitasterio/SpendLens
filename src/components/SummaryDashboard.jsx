import { summarize, topMerchants } from '../lib/currency.js';
import { fmtUSD, colorFor } from '../lib/format.js';

export default function SummaryDashboard({ expenses, rates }) {
  const { categories, overall } = summarize(expenses, rates);
  const merchants = topMerchants(expenses, rates, 3);

  const txnCount = expenses.length;
  const topCategory = categories[0];
  const avg = txnCount ? overall / txnCount : 0;
  const maxCatTotal = categories.length ? categories[0].total : 0;
  const maxMerchant = merchants.length ? merchants[0].total : 0;

  const kpis = [
    { label: 'Total Spend', value: fmtUSD(overall), meta: `${txnCount} transactions`, icon: '$', tone: '' },
    { label: 'Transactions', value: String(txnCount), meta: `${categories.length} categories`, icon: '☰', tone: 'blue' },
    {
      label: 'Top Category',
      value: topCategory ? topCategory.category : 'n/a',
      meta: topCategory ? <strong>{fmtUSD(topCategory.total)}</strong> : 'n/a',
      icon: '◆',
      tone: '',
    },
    { label: 'Avg / Expense', value: fmtUSD(avg), meta: 'across all currencies', icon: '∼', tone: 'green' },
  ];

  return (
    <div>
      {/* KPI cards */}
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div className="kpi" key={k.label}>
            <div className="kpi-top">
              <span className="kpi-label">{k.label}</span>
              <span className={`kpi-icon ${k.tone}`}>{k.icon}</span>
            </div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-meta">{k.meta}</div>
          </div>
        ))}
      </div>

      {/* Lower row: category table + top merchants */}
      <div className="cols-2" style={{ marginTop: 20 }}>
        {/* Ranked category table */}
        <div className="card">
          <div className="card-pad" style={{ paddingBottom: 6 }}>
            <h3 style={{ fontSize: '1rem' }}>Spend by Category</h3>
            <p style={{ margin: '4px 0 0', color: 'var(--ink-muted)', fontSize: '0.84rem' }}>
              Ranked by total in USD
            </p>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th style={{ width: 36 }}>#</th>
                  <th>Category</th>
                  <th className="num">Txns</th>
                  <th>Share</th>
                  <th className="num">Total USD</th>
                  <th className="num">Largest</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c, i) => (
                  <tr key={c.category}>
                    <td><span className={`rank ${i === 0 ? 'top' : ''}`}>{i + 1}</span></td>
                    <td>
                      <span className="pill">
                        <span className="swatch" style={{ background: colorFor(c.category) }} />
                        {c.category}
                      </span>
                    </td>
                    <td className="num">{c.count}</td>
                    <td>
                      <div className="share" title={`${((c.total / maxCatTotal) * 100).toFixed(0)}% of top`}>
                        <i style={{ width: `${maxCatTotal ? (c.total / maxCatTotal) * 100 : 0}%` }} />
                      </div>
                    </td>
                    <td className="num strong-ink">{fmtUSD(c.total)}</td>
                    <td className="num" title={c.largestMerchant || ''}>{fmtUSD(c.largest)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-pad" style={{ paddingTop: 14, borderTop: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--ink-muted)', fontSize: '0.84rem' }}>Overall total</span>
            <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{fmtUSD(overall)}</span>
          </div>
        </div>

        {/* Top 3 merchants */}
        <div className="card card-pad">
          <h3 style={{ fontSize: '1rem' }}>Top Merchants</h3>
          <p style={{ margin: '4px 0 10px', color: 'var(--ink-muted)', fontSize: '0.84rem' }}>
            Highest spend in USD
          </p>
          {merchants.map((m, i) => (
            <div className="merchant-row" key={m.merchant}>
              <span className={`rank ${i === 0 ? 'top' : ''}`}>{i + 1}</span>
              <div>
                <div className="merchant-name">{m.merchant}</div>
                <div className="merchant-bar">
                  <i style={{ width: `${maxMerchant ? (m.total / maxMerchant) * 100 : 0}%` }} />
                </div>
              </div>
              <span className="merchant-amount">{fmtUSD(m.total)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
