import { summarize, round2 } from '../lib/currency.js';
import { fmtUSD } from '../lib/format.js';

const MIN = 0.8;
const MAX = 1.1;

// "What-if" control: adjust the EUR rate (units of EUR per 1 USD) and watch all
// EUR expenses + category totals recompute live. Note shows total-spend delta vs base.
export default function WhatIfSlider({ expenses, baseRates, eurRate, onChange, onReset }) {
  const base = baseRates.EUR;
  const isBase = Math.abs(eurRate - base) < 1e-9;
  const eurCount = expenses.filter((e) => e.currency === 'EUR').length;

  const baseOverall = summarize(expenses, baseRates).overall;
  const curOverall = summarize(expenses, { ...baseRates, EUR: eurRate }).overall;
  const delta = round2(curOverall - baseOverall);

  const pct = ((eurRate - MIN) / (MAX - MIN)) * 100;

  return (
    <div className={`card card-pad whatif ${isBase ? '' : 'active'}`}>
      <div className="whatif-head">
        <div>
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            What-if: EUR/USD rate
            {!isBase && <span className="hyp-badge">Hypothetical</span>}
          </h3>
          <p style={{ margin: '4px 0 0', color: 'var(--ink-muted)', fontSize: '0.84rem' }}>
            {eurCount} EUR expense{eurCount === 1 ? '' : 's'} and all totals update live · base {base.toFixed(4)}
          </p>
        </div>
        <button className="btn btn-ghost" onClick={onReset} disabled={isBase}>
          Reset to base
        </button>
      </div>

      <div className="whatif-controls">
        <div className="whatif-rate">
          <span className="whatif-rate-val">{eurRate.toFixed(4)}</span>
          <span className="whatif-rate-unit">EUR&nbsp;per&nbsp;USD</span>
        </div>
        <div className="whatif-slider">
          <input
            type="range"
            min={MIN}
            max={MAX}
            step="0.0001"
            value={eurRate}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ background: `linear-gradient(90deg, var(--accent) ${pct}%, var(--border) ${pct}%)` }}
            aria-label="EUR per USD rate"
          />
          <div className="whatif-scale">
            <span>{MIN.toFixed(2)}</span>
            <span>base {base.toFixed(2)}</span>
            <span>{MAX.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="whatif-note">
        Total spend <strong>{fmtUSD(curOverall)}</strong>
        {delta === 0 ? (
          <span className="delta neutral"> · matches base</span>
        ) : delta > 0 ? (
          <span className="delta up"> · ▲ {fmtUSD(delta)} higher than base ({fmtUSD(baseOverall)})</span>
        ) : (
          <span className="delta down"> · ▼ {fmtUSD(Math.abs(delta))} lower than base ({fmtUSD(baseOverall)})</span>
        )}
      </div>
    </div>
  );
}
