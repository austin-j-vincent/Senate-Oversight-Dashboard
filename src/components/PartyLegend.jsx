// Shared R/D/I color-key legend, with an optional right-aligned hint line.
const PARTIES = [
  ["R", "var(--party-r)", "Republican"],
  ["D", "var(--party-d)", "Democrat"],
  ["I", "var(--party-i)", "Independent"],
];

export default function PartyLegend({ hint }) {
  return (
    <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", marginBottom: "12px" }}>
      {PARTIES.map(([party, color, label]) => (
        <div key={party} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ display: "inline-block", width: "26px", padding: "2px 0", textAlign: "center", background: color, color: "var(--cream)", fontSize: "11px", fontWeight: "700", borderRadius: "3px" }}>{party}</span>
          <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>{label}</span>
        </div>
      ))}
      {hint && <span style={{ color: "var(--text-faint)", fontSize: "11px", marginLeft: "auto" }}>{hint}</span>}
    </div>
  );
}
