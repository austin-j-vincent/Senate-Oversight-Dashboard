import { BILL_CATEGORIES } from "../lib/billCategories";

// Bills-page filter row: search + Category dropdown. Same look as the shared
// FilterControls (used by Committees/Roster), kept separate so those pages are untouched.
export default function BillFilterControls({ search, setSearch, category, setCategory }) {
  const active = search || category;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
      <input
        type="text"
        placeholder="Search title, number, sponsor, or category…"
        aria-label="Search bills"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "7px 12px",
          background: "var(--overlay-light)",
          border: "1px solid var(--border-gold-strong)",
          borderRadius: "4px",
          color: "var(--parchment)",
          fontSize: "13px",
          outline: "none",
          flex: "1 1 140px",
          minWidth: "120px",
        }}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Filter by category"
        style={{
          padding: "7px 10px",
          background: "var(--surface-select)",
          border: "1px solid var(--border-gold-strong)",
          borderRadius: "4px",
          color: "var(--parchment)",
          fontSize: "13px",
          cursor: "pointer",
          maxWidth: "100%",
          minWidth: 0,
          flex: "0 1 auto",
        }}
      >
        <option value="">All Categories</option>
        {BILL_CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
      </select>
      {active && (
        <button
          onClick={() => { setSearch(""); setCategory(""); }}
          style={{
            fontFamily: "inherit",
            padding: "7px 10px",
            background: "var(--danger-bg)",
            border: "1px solid var(--danger-border)",
            borderRadius: "4px",
            color: "var(--danger)",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >✕ Clear</button>
      )}
    </div>
  );
}
