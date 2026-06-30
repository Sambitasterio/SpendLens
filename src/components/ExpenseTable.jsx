import { useMemo, useState } from 'react';
import { withUSD } from '../lib/currency.js';
import { fmtUSD, fmtOriginal, colorFor } from '../lib/format.js';

// Columns the user can sort by. Each has an accessor for the sort value.
const SORTERS = {
  date: (e) => e.date, // ISO strings sort lexically = chronologically
  usd: (e) => (e.usd == null ? -Infinity : e.usd),
};

export default function ExpenseTable({ expenses, rates }) {
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc'); // 'asc' | 'desc'

  const rows = useMemo(() => {
    const withUsd = withUSD(expenses, rates);
    const get = SORTERS[sortKey];
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...withUsd].sort((a, b) => {
      const av = get(a);
      const bv = get(b);
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [expenses, rates, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'date' ? 'desc' : 'desc');
    }
  };

  const arrow = (key) => (sortKey !== key ? '↕' : sortDir === 'asc' ? '↑' : '↓');

  return (
    <div className="card">
      <div className="card-pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12 }}>
        <div>
          <h3 style={{ fontSize: '1rem' }}>All Expenses</h3>
          <p style={{ margin: '4px 0 0', color: 'var(--ink-muted)', fontSize: '0.84rem' }}>
            {rows.length} transaction{rows.length === 1 ? '' : 's'} · click a header to sort
          </p>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>
                <button className={`th-sort ${sortKey === 'date' ? 'active' : ''}`} onClick={() => toggleSort('date')}>
                  Date <span className="th-arrow">{arrow('date')}</span>
                </button>
              </th>
              <th>Merchant</th>
              <th>Category</th>
              <th className="num">Original</th>
              <th className="num">
                <button className={`th-sort ${sortKey === 'usd' ? 'active' : ''}`} onClick={() => toggleSort('usd')}>
                  USD <span className="th-arrow">{arrow('usd')}</span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">No expenses to show.</div>
                </td>
              </tr>
            ) : (
              rows.map((e) => (
                <tr key={e.id}>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--ink-muted)' }}>{e.date}</td>
                  <td className="strong-ink">{e.merchant}</td>
                  <td>
                    <span className="pill">
                      <span className="swatch" style={{ background: colorFor(e.category) }} />
                      {e.category}
                    </span>
                  </td>
                  <td className="num">{fmtOriginal(e.amount, e.currency)}</td>
                  <td className="num strong-ink">{fmtUSD(e.usd)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
