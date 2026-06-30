const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '◫' },
  { id: 'expenses', label: 'Expenses', icon: '☰' },
  { id: 'add', label: 'Add Expense', icon: '＋' },
  { id: 'about', label: 'About & Notes', icon: 'ⓘ' },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">S</div>
        <div className="brand-name">
          Spend<span>lens</span>
        </div>
      </div>

      <nav className="nav">
        <div className="nav-label">Menu</div>
        {NAV.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="ic">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        Rates snapshot · 2026-05-01
        <br />
        Base currency: USD
      </div>
    </aside>
  );
}
