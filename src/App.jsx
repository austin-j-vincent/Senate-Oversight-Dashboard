import { useHashRoute, CHAMBER_LABELS, TAB_LABELS } from "./hooks/useHashRoute";
import ChamberSwitch from "./components/ChamberSwitch";
import TabBar from "./components/TabBar";
import UnderConstruction from "./components/UnderConstruction";
import CommitteesPage from "./pages/CommitteesPage";

export default function App() {
  const { chamber, tab, navigate } = useHashRoute();

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-navy)",
      backgroundImage: "radial-gradient(ellipse at 20% 0%, var(--glow-top) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, var(--glow-bottom) 0%, transparent 60%)",
      fontFamily: "'Source Sans 3', 'Helvetica Neue', sans-serif",
      color: "var(--ink)",
    }}>
      {/* Slim sticky header: title (left) + chamber switch (right) */}
      <header style={{
        padding: "calc(10px + env(safe-area-inset-top)) 20px 10px",
        borderBottom: "1px solid var(--border-gold)",
        background: "var(--surface-header)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{
          maxWidth: "var(--container)",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}>
          <div>
            <div style={{ fontSize: "9px", letterSpacing: "0.2em", color: "var(--text-eyebrow)", fontWeight: "700", textTransform: "uppercase", marginBottom: "2px" }}>119th Congress · 2025–2026</div>
            <h1 style={{
              fontFamily: "'Playfair Display', 'Times New Roman', serif",
              fontSize: "clamp(14px, 2.5vw, 18px)",
              color: "var(--gold)",
              margin: 0,
              fontWeight: "700",
              lineHeight: 1.2,
            }}>
              {CHAMBER_LABELS[chamber]} Oversight Contact Directory
            </h1>
          </div>
          <ChamberSwitch chamber={chamber} onChange={(c) => navigate(c, tab)} />
        </div>
      </header>

      {/* Routed content + bottom runway so the fixed TabBar always lands in dead space.
          CommitteesPage stays mounted (hidden via display:none) so filter state and
          open panels survive tab and chamber switches. */}
      <div style={{ paddingBottom: "calc(110px + env(safe-area-inset-bottom))" }}>
        <div style={{ display: chamber === "senate" && tab === "committees" ? "" : "none" }}>
          <CommitteesPage />
        </div>
        {(chamber !== "senate" || tab !== "committees") && (
          <UnderConstruction label={`${CHAMBER_LABELS[chamber]} · ${TAB_LABELS[tab]}`} />
        )}
      </div>

      <TabBar tab={tab} onChange={(t) => navigate(chamber, t)} />
    </div>
  );
}
