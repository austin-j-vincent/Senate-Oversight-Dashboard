// Placeholder shown for not-yet-built tabs (Roster, Bills) and the House chamber.
export default function UnderConstruction({ label }) {
  return (
    <div style={{
      minHeight: "55vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "60px 24px",
      gap: "12px",
    }}>
      <div style={{ fontSize: "46px", lineHeight: 1 }}>🚧</div>
      <div style={{
        fontFamily: "'Playfair Display', 'Times New Roman', serif",
        fontSize: "22px",
        fontWeight: 700,
        color: "var(--gold)",
      }}>
        Under Construction
      </div>
      {label && (
        <div style={{
          fontSize: "11px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}>
          {label}
        </div>
      )}
    </div>
  );
}
