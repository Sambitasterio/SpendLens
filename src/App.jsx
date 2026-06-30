import { useState } from 'react';
import { RATES } from './data/rates.js';
import { EXPENSES } from './data/expenses.js';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import SummaryDashboard from './components/SummaryDashboard.jsx';
import ExpenseTable from './components/ExpenseTable.jsx';

export default function App() {
  const [active, setActive] = useState('dashboard');

  // In-memory expenses (the add-form in a later phase will append here).
  const [expenses] = useState(EXPENSES);

  const navigate = (id) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="shell">
      <Sidebar active={active} onNavigate={navigate} />
      <Topbar active={active} />

      <main className="main">
        {/* Dashboard / Summary (Phase 3) */}
        <section id="dashboard" className="section">
          <div className="section-head">
            <h2>Spending Summary</h2>
            <p>All {expenses.length} expenses converted to USD · rates snapshot 2026-05-01</p>
          </div>
          <SummaryDashboard expenses={expenses} rates={RATES} />
        </section>

        {/* Placeholders for upcoming phases */}
        <section id="expenses" className="section">
          <div className="section-head">
            <h2>Expenses</h2>
            <p>Every transaction, sortable by date or USD amount</p>
          </div>
          <ExpenseTable expenses={expenses} rates={RATES} />
        </section>

        <section id="add" className="section">
          <div className="section-head">
            <h2>Add Expense</h2>
            <p>Add-expense form — coming in Phase 6</p>
          </div>
          <div className="card card-pad empty-state">Add-expense form arrives soon.</div>
        </section>

        <section id="about" className="section">
          <div className="section-head">
            <h2>About &amp; Notes</h2>
            <p>Written reflection — coming in Phase 7</p>
          </div>
          <div className="card card-pad empty-state">Notes &amp; reflection arrive soon.</div>
        </section>
      </main>
    </div>
  );
}
