import { colorFor } from '../lib/format.js';

// Toggle chips: click a category to filter, click the active one again to clear.
export default function CategoryFilter({ categories, active, onSelect, counts }) {
  return (
    <div className="filter-bar">
      <button
        className={`chip ${active == null ? 'active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All
        <span className="chip-count">{counts.__all}</span>
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          className={`chip ${active === cat ? 'active' : ''}`}
          onClick={() => onSelect(active === cat ? null : cat)}
        >
          <span className="swatch" style={{ background: colorFor(cat) }} />
          {cat}
          <span className="chip-count">{counts[cat] || 0}</span>
        </button>
      ))}
    </div>
  );
}
