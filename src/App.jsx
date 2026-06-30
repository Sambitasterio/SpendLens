import { RATES } from './data/rates.js';
import { EXPENSES } from './data/expenses.js';

// Phase 1 placeholder: confirms the scaffold runs and the dataset loads.
// Real UI (summary, table, filter, form) arrives in later phases.
export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Spendlens</h1>
        <p className="tagline">Multi-currency expense dashboard</p>
      </header>

      <main>
        <p className="scaffold-note">
          ✅ Scaffold is running. Loaded <strong>{EXPENSES.length}</strong> expenses
          across <strong>{Object.keys(RATES).length}</strong> supported currencies.
        </p>
        <p className="scaffold-note muted">
          Next: Phase 2 builds the currency conversion logic.
        </p>
      </main>
    </div>
  );
}
