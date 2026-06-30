import { useState } from 'react';
import { toUSD } from '../lib/currency.js';
import { fmtUSD } from '../lib/format.js';

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = (categories) => ({
  merchant: '',
  amount: '',
  currency: 'USD',
  category: categories[0] || 'Travel',
  date: today(),
});

export default function AddExpenseForm({ rates, categories, onAdd }) {
  const [form, setForm] = useState(() => emptyForm(categories));
  const [errors, setErrors] = useState({});
  const [justAdded, setJustAdded] = useState(null);

  const currencyOptions = Object.keys(rates);

  // Live USD preview as the user types.
  const previewAmount = Number(form.amount);
  const preview =
    form.amount !== '' && Number.isFinite(previewAmount)
      ? toUSD(previewAmount, form.currency, rates)
      : null;

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.merchant.trim()) next.merchant = 'Merchant is required.';
    const amt = Number(form.amount);
    if (form.amount === '' || Number.isNaN(amt)) next.amount = 'Enter a number.';
    else if (amt <= 0) next.amount = 'Amount must be greater than 0.';
    if (!rates[form.currency]) next.currency = 'Pick a supported currency.';
    if (!form.category) next.category = 'Pick a category.';
    if (!form.date) next.date = 'Date is required.';
    return next;
  };

  const submit = (e) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    const expense = {
      merchant: form.merchant.trim(),
      amount: Number(form.amount),
      currency: form.currency,
      category: form.category,
      date: form.date,
    };
    onAdd(expense);
    setJustAdded({ ...expense, usd: toUSD(expense.amount, expense.currency, rates) });
    setForm(emptyForm(categories));
    setErrors({});
    window.clearTimeout(submit._t);
    submit._t = window.setTimeout(() => setJustAdded(null), 4000);
  };

  return (
    <div className="card card-pad">
      <h3 style={{ fontSize: '1rem' }}>New Expense</h3>
      <p style={{ margin: '4px 0 16px', color: 'var(--ink-muted)', fontSize: '0.84rem' }}>
        Adds to the table and summary instantly · stored in-memory for this session
      </p>

      <form onSubmit={submit} noValidate>
        <div className="form-grid">
          <div className="field" style={{ gridColumn: 'span 2' }}>
            <label>Merchant</label>
            <input
              type="text"
              value={form.merchant}
              onChange={set('merchant')}
              placeholder="e.g. Uber, Notion, Hotel Berlin"
              className={errors.merchant ? 'invalid' : ''}
            />
            {errors.merchant && <span className="field-error">{errors.merchant}</span>}
          </div>

          <div className="field">
            <label>Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={set('amount')}
              placeholder="0.00"
              className={errors.amount ? 'invalid' : ''}
            />
            {errors.amount && <span className="field-error">{errors.amount}</span>}
          </div>

          <div className="field">
            <label>Currency</label>
            <select value={form.currency} onChange={set('currency')}>
              {currencyOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={set('category')}>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={set('date')}
              className={errors.date ? 'invalid' : ''}
            />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </div>
        </div>

        <div className="form-foot">
          <span className="preview">
            {preview != null ? <>≈ <strong>{fmtUSD(preview)}</strong> in USD</> : 'Enter an amount to preview USD'}
          </span>
          <button type="submit" className="btn btn-primary">＋ Add Expense</button>
        </div>
      </form>

      {justAdded && (
        <div className="add-success">
          ✓ Added <strong>{justAdded.merchant}</strong>, {fmtUSD(justAdded.usd)} · it’s now in the table and summary.
        </div>
      )}
    </div>
  );
}
