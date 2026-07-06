import { TABS as TAB_IDS } from "../hooks/useHashRoute";
import { RosterIcon, BillsIcon, CommitteesIcon } from "./icons";

// Floating bottom "island": three equidistant tab buttons (Roster · Bills · Committees).
// Gold/bronze gradient with depth; active tab fills dark-blue (--nav-active). Icons use
// currentColor so the button's text color (light on active, dark on inactive) drives them.

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
