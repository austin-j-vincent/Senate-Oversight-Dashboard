import { useState } from "react";
import { BILL_CATEGORIES, getCategory } from "../lib/billCategories";

// Visually hidden but read by screen readers.
const SR_ONLY = {
  position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px",
  overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0,
};

// Category tag, styled like the roster's party/state tags (e.g. "R-TN"). The faint outline
// keeps the darkest colors (Animals, Private Legislation) visible on the navy background.
// Screen readers hear the full category name instead of the code, unless the name is
// already printed next to the pill (the key), in which case pass announce={false}.
export function CategoryPill({ name, style, announce = true }) {
  const c = getCategory(name);
  return (
    <span title={c.name} aria-hidden={announce ? undefined : "true"} style={{
      display: "inline-block",
      minWidth: "34px",
      padding: "2px 7px",
      borderRadius: "3px",
      fontSize: "11px",
      fontWeight: "700",
      letterSpacing: "0.04em",
      textAlign: "center",
      background: c.color,
      color: c.text,
      boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.18)",
      whiteSpace: "nowrap",
      flexShrink: 0,
      ...style,
    }}>
      <span aria-hidden="true">{c.abbr}</span>
      {announce && <span style={SR_ONLY}>{`Category: ${c.name}`}</span>}
    </span>
  );
}

// Collapsible key of every category code → full name, plus an optional right-aligned hint
// (same spot as PartyLegend's hint on the other pages).
export default function CategoryLegend({ hint }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          style={{
            fontFamily: "inherit",
            padding: 0,
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            fontSize: "12px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {open ? "Hide" : "Show"} category key
          <span aria-hidden="true" style={{
            color: "var(--gold)",
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.25s",
          }}>▾</span>
        </button>
        {hint && <span style={{ color: "var(--text-faint)", fontSize: "11px", marginLeft: "auto" }}>{hint}</span>}
      </div>
      {open && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(230px, 100%), 1fr))",
          gap: "6px 14px",
          marginTop: "10px",
          padding: "12px 14px",
          border: "1px solid var(--border-gold-faint)",
          borderRadius: "6px",
          background: "var(--surface-rows)",
        }}>
          {BILL_CATEGORIES.map((c) => (
            <div key={c.name} style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
              <CategoryPill name={c.name} announce={false} style={{ minWidth: "44px" }} />
              <span style={{ color: "var(--text-muted)", fontSize: "12px", lineHeight: 1.3 }}>{c.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
