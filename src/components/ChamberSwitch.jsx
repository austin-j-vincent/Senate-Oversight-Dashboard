import { CHAMBERS } from "../hooks/useHashRoute";

// Senate ⇄ House toggle in the top header. Active segment = dark-blue (--nav-active);
// inactive = dark text on the gold/bronze track. Built now; House content is a placeholder.
const CHAMBER_META = {
  senate: ["🏛️", "Senate"],
  house:  ["🏠",  "House"],
};
const SEGMENTS = CHAMBERS.map(id => [id, ...CHAMBER_META[id]]);

export default function ChamberSwitch({ chamber, onChange }) {
  return (
    <div
      role="group"
      aria-label="Chamber"
      style={{
        display: "inline-flex",
        gap: "2px",
        padding: "3px",
        borderRadius: "999px",
        background: "linear-gradient(180deg, var(--nav-island-top), var(--nav-island-bottom))",
        border: "1px solid var(--border-gold-strong)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
        flexShrink: 0,
      }}
    >
      {SEGMENTS.map(([id, emoji, label]) => {
        const active = chamber === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            aria-pressed={active}
            title={`${label} view`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 11px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 700,
              background: active ? "var(--nav-active)" : "transparent",
              color: active ? "var(--nav-active-fg)" : "var(--nav-inactive-fg)",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            <span style={{ fontSize: "14px", lineHeight: 1 }}>{emoji}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
