import { useMemo, useState } from 'react';
import { RATES } from './data/rates.js';
import { EXPENSES } from './data/expenses.js';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import SummaryDashboard from './components/SummaryDashboard.jsx';
import ExpenseTable from './components/ExpenseTable.jsx';
import CategoryFilter from './components/CategoryFilter.jsx';
import AddExpenseForm from './components/AddExpenseForm.jsx';
import AboutNotes from './components/AboutNotes.jsx';
import WhatIfSlider from './components/WhatIfSlider.jsx';

export default function App() {
  const [active, setActive] = useState('dashboard');

  // In-memory expenses. The add-form appends here (no persistence needed).
  const [expenses, setExpenses] = useState(EXPENSES);

  const addExpense = (expense) => {
    setExpenses((prev) => {
      const nextId = prev.reduce((max, e) => Math.max(max, e.id), 0) + 1;
      return [...prev, { ...expense, id: nextId }];
    });
  };

  // Table-only category filter (null = show all). Summary stays global.
  const [activeCategory, setActiveCategory] = useState(null);

  // What-if: live EUR rate (units of EUR per USD). Default = base snapshot.
  const [eurRate, setEurRate] = useState(RATES.EUR);
  const effectiveRates = useMemo(() => ({ ...RATES, EUR: eurRate }), [eurRate]);

  const categories = useMemo(
    () => [...new Set(expenses.map((e) => e.category))].sort(),
    [expenses]
  );

  const counts = useMemo(() => {
    const c = { __all: expenses.length };
    for (const e of expenses) c[e.category] = (c[e.category] || 0) + 1;
    return c;
  }, [expenses]);

  const filteredExpenses = useMemo(
    () => (activeCategory ? expenses.filter((e) => e.category === activeCategory) : expenses),
    [expenses, activeCategory]
  );

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
          <SummaryDashboard expenses={expenses} rates={effectiveRates} />

          <div className="explore-head">
            <span>Explore</span>
          </div>
          <WhatIfSlider
            expenses={expenses}
            baseRates={RATES}
            eurRate={eurRate}
            onChange={setEurRate}
            onReset={() => setEurRate(RATES.EUR)}
          />
        </section>

        {/* Placeholders for upcoming phases */}
        <section id="expenses" className="section">
          <div className="section-head">
            <h2>Expenses</h2>
            <p>Every transaction, sortable by date or USD amount · filter by category</p>
          </div>
          <CategoryFilter
            categories={categories}
            active={activeCategory}
            onSelect={setActiveCategory}
            counts={counts}
          />
          <ExpenseTable expenses={filteredExpenses} rates={effectiveRates} />
        </section>

        <section id="add" className="section">
          <div className="section-head">
            <h2>Add Expense</h2>
            <p>Record a new transaction, reflected in the table and summary immediately</p>
          </div>
          <AddExpenseForm rates={RATES} categories={categories} onAdd={addExpense} />
        </section>

        <section id="about" className="section">
          <div className="section-head">
            <h2>About &amp; Notes</h2>
            <p>Analyst reflection on the currency logic</p>
          </div>
          <AboutNotes />
        </section>
      </main>
    </div>
  );
}
