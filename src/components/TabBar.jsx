import { TABS as TAB_IDS } from "../hooks/useHashRoute";

// Floating bottom "island": three equidistant tab buttons (Roster · Bills · Committees).
// Gold/bronze gradient with depth; active tab fills dark-blue (--nav-active). Icons use
// currentColor so the button's text color (light on active, dark on inactive) drives them.

// Roster — a person silhouette inside an ID card.
function RosterIcon() {
  return (
    <svg viewBox="0 0 24 24" width="38" height="38" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8.3" cy="10" r="2.2" fill="currentColor" />
      <path d="M4.6 16.2c0-2.1 1.7-3.3 3.7-3.3s3.7 1.2 3.7 3.3z" fill="currentColor" />
      <rect x="14" y="9.2" width="5.4" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="14" y="12.4" width="5.4" height="1.5" rx="0.75" fill="currentColor" />
    </svg>
  );
}

// Bills — a scroll with writing lines.
function BillsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="38" height="38" aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 5.5h8.5v11.5a2.5 2.5 0 0 1-2.5 2.5H8a2.5 2.5 0 0 1-2.5-2.5V7" />
      <path d="M15.5 5.5a2 2 0 0 1 2 2 1.6 1.6 0 0 1-1.6 1.6H15.5" />
      <path d="M5.5 7a1.5 1.5 0 0 1 1.5-1.5" />
      <line x1="8.5" y1="9.5" x2="13" y2="9.5" />
      <line x1="8.5" y1="12.3" x2="13" y2="12.3" />
      <line x1="8.5" y1="15.1" x2="11.4" y2="15.1" />
    </svg>
  );
}

// Committees — multiple overlapping people.
function CommitteesIcon() {
  return (
    <svg viewBox="0 0 24 24" width="38" height="38" aria-hidden="true" fill="currentColor">
      <circle cx="6.4" cy="9.4" r="2.1" />
      <circle cx="17.6" cy="9.4" r="2.1" />
      <path d="M2.4 17c0-2.2 1.7-3.5 4-3.5 0.7 0 1.3 0.12 1.9 0.35l-0.2 3.15z" />
      <path d="M21.6 17c0-2.2-1.7-3.5-4-3.5-0.7 0-1.3 0.12-1.9 0.35l0.2 3.15z" />
      <circle cx="12" cy="7.8" r="2.7" />
      <path d="M6 18c0-3.1 2.7-4.9 6-4.9s6 1.8 6 4.9z" />
    </svg>
  );
}

const TAB_META = {
  roster:     ["Roster",     RosterIcon],
  bills:      ["Bills",      BillsIcon],
  committees: ["Committees", CommitteesIcon],
};
const TABS = TAB_IDS.map(id => [id, ...TAB_META[id]]);

export default function TabBar({ tab, onChange }) {
  return (
    <nav
      aria-label="Pages"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: "calc(12px + env(safe-area-inset-bottom))",
        marginInline: "auto",
        width: "fit-content",
        zIndex: 200,
        display: "flex",
        gap: "6px",
        padding: "7px",
        borderRadius: "24px",
        background: "linear-gradient(180deg, var(--nav-island-top), var(--nav-island-bottom))",
        borderTop: "1px solid rgba(255, 255, 255, 0.25)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.45)",
      }}
    >
      {TABS.map(([id, label, Icon]) => {
        const active = tab === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            title={label}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "48px",
              border: "none",
              borderRadius: "18px",
              cursor: "pointer",
              background: active ? "var(--nav-active)" : "var(--nav-inactive-bg)",
              color: active ? "var(--nav-active-fg)" : "var(--nav-inactive-fg)",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            <Icon />
          </button>
        );
      })}
    </nav>
  );
}
