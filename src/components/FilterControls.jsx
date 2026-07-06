import { ALL_STATES } from "../lib/senators";

// Shared search / party / state filter row used by the Committees and Roster pages.
// onClear is an optional extra reset hook (Committees uses it to also drop the URL
// highlight/committee params so Clear fully resets a jumped-in view).
export default function FilterControls({ search, setSearch, filterParty, setFilterParty, filterState, setFilterState, onClear, extraActive = false }) {
  const active = search || filterParty !== "all" || filterState || extraActive;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
      <input
        type="text"
        placeholder="Search senator or state…"
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
        value={filterParty}
        onChange={(e) => setFilterParty(e.target.value)}
        style={{
          padding: "7px 10px",
          background: "var(--surface-select)",
          border: "1px solid var(--border-gold-strong)",
          borderRadius: "4px",
          color: "var(--parchment)",
          fontSize: "13px",
          cursor: "pointer",
        }}
      >
        <option value="all">All Parties</option>
        <option value="R">Republican</option>
        <option value="D">Democrat</option>
        <option value="I">Independent</option>
      </select>
      <select
        value={filterState}
        onChange={(e) => setFilterState(e.target.value)}
        style={{
          padding: "7px 10px",
          background: "var(--surface-select)",
          border: "1px solid var(--border-gold-strong)",
          borderRadius: "4px",
          color: "var(--parchment)",
          fontSize: "13px",
          cursor: "pointer",
        }}
      >
        <option value="">All States</option>
        {ALL_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      {active && (
        <button
          onClick={() => { setSearch(""); setFilterParty("all"); setFilterState(""); onClear?.(); }}
          style={{
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
