const TITLES = {
  dashboard: { title: 'Dashboard', sub: 'Spending summary across all currencies' },
  expenses: { title: 'Expenses', sub: 'Every transaction, converted to USD' },
  add: { title: 'Add Expense', sub: 'Record a new transaction' },
  about: { title: 'About & Notes', sub: 'How this works' },
};

export default function Topbar({ active }) {
  const t = TITLES[active] || TITLES.dashboard;
  return (
    <header className="topbar">
      <div>
        <div className="topbar-title">{t.title}</div>
        <div className="topbar-sub">{t.sub}</div>
      </div>
      <div className="topbar-right">
        <span className="snapshot-pill">
          <span className="dot" />
          Live · in-memory
        </span>
      </div>
    </header>
  );
}
